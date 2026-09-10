import fetch from 'node-fetch';

async function testRegistration() {
  try {
    const res = await fetch('http://localhost:8000/api/v1/auth/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: "node_test_candidate@example.com",
        password: "StrongTestPassword123!",
        password_confirm: "StrongTestPassword123!",
        first_name: "Node",
        last_name: "Test",
        role: "CANDIDATE"
      })
    });
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Response:", text);
  } catch(e) {
    console.error("Error:", e);
  }
}

testRegistration();
