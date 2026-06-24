const axios = require('axios');

async function test() {
  try {
    console.log('Testing signup...');
    let res = await axios.post('http://localhost:5005/api/auth/signup', {
      name: "TestUser123",
      email: "testuser123@example.com",
      password: "password123",
      role: "student",
      department: "Computer Science",
      year: "1st",
      semester: "Sem 1"
    });
    console.log('Signup Success:', res.data);
  } catch (err) {
    console.log('Signup Failed:', err.response?.data || err.message);
  }

  try {
    console.log('Testing login...');
    let res = await axios.post('http://localhost:5005/api/auth/login', {
      email: "testuser123@example.com",
      password: "password123"
    });
    console.log('Login Success:', res.data);
  } catch (err) {
    console.log('Login Failed:', err.response?.data || err.message);
  }
}

test();
