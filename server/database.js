import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { facultyData } from '../src/data/facultyData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'faculty.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
export function initDb() {
  // Create faculty table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS faculty (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hod TEXT,
      name TEXT NOT NULL,
      type TEXT,
      designation TEXT,
      phone TEXT,
      email TEXT,
      dateOfJoining TEXT,
      qualification TEXT,
      specialization TEXT,
      experience TEXT,
      subjects TEXT,
      awards TEXT,
      researchGuidance TEXT,
      administrativeResponsibility TEXT,
      professionalBodies TEXT,
      researchPublications TEXT,
      vidwanLink TEXT,
      researchProjects TEXT,
      seminarsOrganized TEXT,
      address TEXT,
      department TEXT,
      image TEXT
    )
  `).run();

  // Create users table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `).run();

  // Create settings table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    )
  `).run();

  // Ensure MFA default setting
  const mfaEnabled = db.prepare('SELECT value FROM settings WHERE key = ?').get('mfa_enabled');
  if (mfaEnabled === undefined) {
    db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run('mfa_enabled', 'false');
    db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run('mfa_secret', '');
  }

  // Seed default admin user gcekbpatnaadmin if not present
  const adminUser = db.prepare("SELECT * FROM users WHERE username = 'gcekbpatnaadmin'").get();
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (!adminUser && userCount <= 1) {
    const defaultUsername = 'gcekbpatnaadmin';
    const defaultPassword = 'gcek@2009#2009';
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(defaultPassword, salt);
    db.prepare('INSERT OR REPLACE INTO users (id, username, password) VALUES (1, ?, ?)').run(defaultUsername, hashedPassword);
    console.log(`[Database] Seeded admin user: ${defaultUsername}`);
  }

  // Seed faculty data if faculty table is empty
  const facultyCount = db.prepare('SELECT COUNT(*) as count FROM faculty').get().count;
  if (facultyCount === 0) {
    console.log(`[Database] Seeding ${facultyData.length} faculty members from static file...`);
    const insertStmt = db.prepare(`
      INSERT INTO faculty (
        hod, name, type, designation, phone, email, dateOfJoining, 
        qualification, specialization, experience, subjects, awards, 
        researchGuidance, administrativeResponsibility, professionalBodies, 
        researchPublications, vidwanLink, researchProjects, seminarsOrganized, 
        address, department, image
      ) VALUES (
        @hod, @name, @type, @designation, @phone, @email, @dateOfJoining, 
        @qualification, @specialization, @experience, @subjects, @awards, 
        @researchGuidance, @administrativeResponsibility, @professionalBodies, 
        @researchPublications, @vidwanLink, @researchProjects, @seminarsOrganized, 
        @address, @department, @image
      )
    `);

    // Run in a transaction for maximum speed
    const insertMany = db.transaction((list) => {
      for (const item of list) {
        insertStmt.run({
          hod: item.hod || 'no',
          name: item.name || '',
          type: item.type || '',
          designation: item.designation || '',
          phone: item.phone || '',
          email: item.email || '',
          dateOfJoining: item.dateOfJoining || '',
          qualification: item.qualification || '',
          specialization: item.specialization || '',
          experience: item.experience || '',
          subjects: item.subjects || '',
          awards: item.awards || '',
          researchGuidance: item.researchGuidance || '',
          administrativeResponsibility: item.administrativeResponsibility || '',
          professionalBodies: item.professionalBodies || '',
          researchPublications: item.researchPublications || '',
          vidwanLink: item.vidwanLink || '',
          researchProjects: item.researchProjects || '',
          seminarsOrganized: item.seminarsOrganized || '',
          address: item.address || '',
          department: item.department || '',
          image: item.image || ''
        });
      }
    });

    insertMany(facultyData);
    console.log('[Database] Faculty database seeding completed!');
  }
}

export default db;
