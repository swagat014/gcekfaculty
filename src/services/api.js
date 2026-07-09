const API_BASE_URL = 'http://localhost:5000/api';

const getHeaders = (isMultipart = false) => {
  const token = localStorage.getItem('token');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

export const api = {
  // Public Endpoint to fetch dynamic MFA login requirement
  getMfaStatus: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/mfa-status`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to check MFA status');
    }
    return res.json();
  },

  // Auth Login
  login: async (username, password, code = '') => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, code })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Login failed');
    }
    return data;
  },

  // Public Endpoint to fetch Faculty List
  getFaculty: async () => {
    const res = await fetch(`${API_BASE_URL}/faculty`);
    if (!res.ok) {
      throw new Error('Failed to load faculty directory');
    }
    return res.json();
  },

  // Secure: Create Faculty
  addFaculty: async (facultyData) => {
    const res = await fetch(`${API_BASE_URL}/faculty`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(facultyData)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to add faculty');
    }
    return data.data;
  },

  // Secure: Update Faculty
  updateFaculty: async (id, facultyData) => {
    const res = await fetch(`${API_BASE_URL}/faculty/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(facultyData)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to update faculty');
    }
    return data.data;
  },

  // Secure: Delete Faculty
  deleteFaculty: async (id) => {
    const res = await fetch(`${API_BASE_URL}/faculty/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to delete faculty');
    }
    return data;
  },

  // Secure: Upload Image File
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to upload image');
    }
    return data;
  },

  // Secure: Retrieve MFA configurations and dynamic QR codes
  getMfaSettings: async () => {
    const res = await fetch(`${API_BASE_URL}/settings/mfa`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to load MFA settings');
    }
    return data;
  },

  // Secure: Enable/Disable MFA
  toggleMfa: async (enabled, code = '', tempSecret = '') => {
    const res = await fetch(`${API_BASE_URL}/settings/mfa/toggle`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ enabled, code, tempSecret })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to toggle MFA setting');
    }
    return data;
  },

  // Secure: Update login credentials
  updateCredentials: async (currentPassword, newUsername, newPassword) => {
    const res = await fetch(`${API_BASE_URL}/settings/credentials`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ currentPassword, newUsername, newPassword })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to update credentials');
    }
    return data;
  }
};
