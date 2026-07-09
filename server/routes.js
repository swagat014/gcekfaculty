import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { authenticator } from 'otplib';
import qrcode from 'qrcode';
import db from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Multer Storage Configuration for Image Uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'faculty-' + uniqueSuffix + fileExt);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mime = allowedTypes.test(file.mimetype);
    if (ext && mime) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed (jpg, jpeg, png, gif, webp)'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Middleware to verify JWT Token
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET || 'super_secret_key_change_me', (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Token is invalid or expired.' });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: 'Authorization header is missing.' });
  }
};

// ----------------------------------------------------
// AUTHENTICATION API
// ----------------------------------------------------

// Get MFA Status for Login Screen
router.get('/auth/mfa-status', (req, res) => {
  try {
    const mfaEnabled = db.prepare("SELECT value FROM settings WHERE key = 'mfa_enabled'").get()?.value === 'true';
    res.json({ mfaEnabled });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve MFA status.', error: error.message });
  }
});

// Login API
router.post('/auth/login', (req, res) => {
  const { username, password, code } = req.body;

  if (!username) {
    return res.status(400).json({ message: 'Username is required.' });
  }

  try {
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Check MFA if enabled
    const mfaEnabled = db.prepare("SELECT value FROM settings WHERE key = 'mfa_enabled'").get()?.value === 'true';
    
    if (mfaEnabled && code) {
      // Login via Google Authenticator PIN
      const mfaSecret = db.prepare("SELECT value FROM settings WHERE key = 'mfa_secret'").get()?.value;
      if (mfaSecret) {
        const isValidOTP = authenticator.check(code, mfaSecret);
        if (!isValidOTP) {
          return res.status(401).json({ message: 'Invalid verification code.' });
        }
      } else {
        return res.status(400).json({ message: 'MFA configuration is corrupt. Please contact database admin.' });
      }
    } else {
      // Standard password validation (fallback for backup or MFA disabled)
      if (!password) {
        return res.status(400).json({ message: 'Password or Authenticator PIN is required.' });
      }
      const passwordMatch = bcrypt.compareSync(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || 'super_secret_key_change_me',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username }
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error during login.', error: error.message });
  }
});

// ----------------------------------------------------
// PUBLIC FACULTY DIRECTORY API
// ----------------------------------------------------

// Get All Faculty Members
router.get('/faculty', (req, res) => {
  try {
    const facultyList = db.prepare('SELECT * FROM faculty').all();
    res.json(facultyList);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve faculty list.', error: error.message });
  }
});

// ----------------------------------------------------
// SECURE ADMIN FACULTY CRUD API
// ----------------------------------------------------

// Add New Faculty
router.post('/faculty', authenticateJWT, (req, res) => {
  const fields = req.body;
  if (!fields.name) {
    return res.status(400).json({ message: 'Faculty name is required.' });
  }

  try {
    const keys = Object.keys(fields);
    const placeholders = keys.map(k => `@${k}`).join(', ');
    const columns = keys.join(', ');

    const stmt = db.prepare(`INSERT INTO faculty (${columns}) VALUES (${placeholders})`);
    const info = stmt.run(fields);

    const newFaculty = db.prepare('SELECT * FROM faculty WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json({ message: 'Faculty member added successfully.', data: newFaculty });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create faculty member.', error: error.message });
  }
});

// Update Faculty
router.put('/faculty/:id', authenticateJWT, (req, res) => {
  const { id } = req.params;
  const fields = req.body;
  
  // Exclude updating ID
  delete fields.id;

  try {
    const existing = db.prepare('SELECT * FROM faculty WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ message: 'Faculty member not found.' });
    }

    const updates = Object.keys(fields).map(key => `${key} = @${key}`).join(', ');
    if (updates.length === 0) {
      return res.status(400).json({ message: 'No fields provided for update.' });
    }

    const stmt = db.prepare(`UPDATE faculty SET ${updates} WHERE id = @id`);
    stmt.run({ ...fields, id });

    const updatedFaculty = db.prepare('SELECT * FROM faculty WHERE id = ?').get(id);
    res.json({ message: 'Faculty member updated successfully.', data: updatedFaculty });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update faculty member.', error: error.message });
  }
});

// Delete Faculty
router.delete('/faculty/:id', authenticateJWT, (req, res) => {
  const { id } = req.params;

  try {
    const existing = db.prepare('SELECT * FROM faculty WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ message: 'Faculty member not found.' });
    }

    // Block deletion of Regular Faculty members
    if (existing.type === 'Regular Faculty' || existing.type === 'Regular') {
      return res.status(403).json({ message: 'Regular Faculty members cannot be deleted from the UI.' });
    }

    // Delete image if uploaded locally
    if (existing.image && existing.image.startsWith('/uploads/')) {
      const imgPath = path.join(__dirname, existing.image);
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    }

    db.prepare('DELETE FROM faculty WHERE id = ?').run(id);
    res.json({ message: 'Faculty member deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete faculty member.', error: error.message });
  }
});

// Upload Faculty Image
router.post('/upload', authenticateJWT, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file uploaded.' });
  }

  // Return static relative path to serve
  const filePath = `/uploads/${req.file.filename}`;
  res.json({
    message: 'Image uploaded successfully.',
    imageUrl: filePath
  });
});

// ----------------------------------------------------
// SECURE ADMIN SECURITY / MFA SETTINGS API
// ----------------------------------------------------

// Get current MFA state & Generate registration QR code if proposed
router.get('/settings/mfa', authenticateJWT, async (req, res) => {
  try {
    const mfaEnabled = db.prepare("SELECT value FROM settings WHERE key = 'mfa_enabled'").get()?.value === 'true';
    const mfaSecret = db.prepare("SELECT value FROM settings WHERE key = 'mfa_secret'").get()?.value;

    let qrCodeUrl = null;
    let tempSecret = null;

    // If disabled or requested setup, generate temporary keys
    if (!mfaEnabled || !mfaSecret) {
      tempSecret = authenticator.generateSecret();
      const otpauth = authenticator.keyuri(req.user.username, 'GCEK Faculty Directory', tempSecret);
      qrCodeUrl = await qrcode.toDataURL(otpauth);
    }

    res.json({
      mfaEnabled,
      qrCodeUrl,
      tempSecret // sent only for verification when enabling
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load MFA settings.', error: error.message });
  }
});

// Toggle MFA state
router.post('/settings/mfa/toggle', authenticateJWT, (req, res) => {
  const { enabled, code, tempSecret } = req.body;

  try {
    if (enabled) {
      if (!code || !tempSecret) {
        return res.status(400).json({ message: 'Verification code and secret are required to enable MFA.' });
      }

      // Verify OTP code
      const isValid = authenticator.check(code, tempSecret);
      if (!isValid) {
        return res.status(400).json({ message: 'Invalid authentication code. Please try again.' });
      }

      // Save to database
      db.prepare("UPDATE settings SET value = ? WHERE key = 'mfa_secret'").run(tempSecret);
      db.prepare("UPDATE settings SET value = 'true' WHERE key = 'mfa_enabled'").run();

      return res.json({ message: 'Multi-Factor Authentication enabled successfully.' });
    } else {
      // Disabling MFA
      db.prepare("UPDATE settings SET value = 'false' WHERE key = 'mfa_enabled'").run();
      db.prepare("UPDATE settings SET value = '' WHERE key = 'mfa_secret'").run();

      return res.json({ message: 'Multi-Factor Authentication disabled.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update MFA settings.', error: error.message });
  }
});

// Reset credentials (username / password)
router.post('/settings/credentials', authenticateJWT, (req, res) => {
  const { currentPassword, newUsername, newPassword } = req.body;

  if (!currentPassword) {
    return res.status(400).json({ message: 'Current password is required to verify changes.' });
  }

  try {
    const admin = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.userId);
    const passMatch = bcrypt.compareSync(currentPassword, admin.password);
    if (!passMatch) {
      return res.status(401).json({ message: 'Incorrect current password.' });
    }

    if (newUsername) {
      db.prepare('UPDATE users SET username = ? WHERE id = ?').run(newUsername, req.user.userId);
    }

    if (newPassword) {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(newPassword, salt);
      db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashedPassword, req.user.userId);
    }

    res.json({ message: 'Credentials updated successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update credentials.', error: error.message });
  }
});

export default router;
