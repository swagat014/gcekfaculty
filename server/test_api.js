import assert from 'assert';

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('=== Starting API Verification Tests ===');
  
  // 1. Fetch public faculty list
  console.log('Testing GET /api/faculty...');
  const facultyRes = await fetch(`${BASE_URL}/faculty`);
  assert.strictEqual(facultyRes.status, 200, 'Public faculty retrieval failed.');
  const faculty = await facultyRes.json();
  console.log(`✓ Retrieved ${faculty.length} faculty records dynamically from SQLite.`);
  assert.ok(faculty.length > 0, 'No faculty records found.');

  // 2. Test Admin Login (Invalid Password)
  console.log('Testing login with invalid credentials...');
  const failLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'wrongpassword' })
  });
  assert.strictEqual(failLoginRes.status, 401, 'Invalid login should be blocked.');
  console.log('✓ Invalid login was successfully blocked.');

  // 3. Test Admin Login (Valid Credentials)
  console.log('Testing login with correct credentials...');
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' })
  });
  assert.strictEqual(loginRes.status, 200, 'Valid login failed.');
  const loginData = await loginRes.json();
  const token = loginData.token;
  assert.ok(token, 'No token returned on successful login.');
  console.log('✓ Admin login succeeded. JWT token generated.');

  // 4. Test secure endpoint: Create Faculty
  console.log('Testing POST /api/faculty (Secure)...');
  const newFaculty = {
    name: 'Verification Test Faculty',
    department: 'Computer Science and Engineering',
    type: 'Regular Faculty',
    hod: 'no',
    email: 'test@verification.gcek.ac.in',
    designation: 'Temporary Assistant Professor'
  };

  const createRes = await fetch(`${BASE_URL}/faculty`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(newFaculty)
  });
  assert.strictEqual(createRes.status, 201, 'Failed to create faculty member.');
  const createData = await createRes.json();
  const createdId = createData.data.id;
  assert.ok(createdId, 'No ID returned for created faculty member.');
  console.log(`✓ Faculty created successfully. ID: ${createdId}`);

  // 5. Test secure endpoint: Delete Faculty
  console.log(`Testing DELETE /api/faculty/${createdId}...`);
  const deleteRes = await fetch(`${BASE_URL}/faculty/${createdId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  assert.strictEqual(deleteRes.status, 200, 'Failed to delete faculty member.');
  console.log('✓ Faculty deleted successfully.');

  console.log('=== All API Tests Passed Successfully! ===');
}

runTests().catch(err => {
  console.error('❌ Test execution failed:', err);
  process.exit(1);
});
