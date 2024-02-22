const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public')); // Serve static files from the 'public' folder

// Handle signup requests
app.post('/signup', (req, res) => {
  try {
    const { username, password } = req.body;

    // Read existing user data
    let userData = [];
    try {
      userData = JSON.parse(fs.readFileSync('userData.json'));
    } catch (error) {
      // Log and handle errors related to reading the user data file
      console.error('Error reading user data file:', error.message);
      return res.status(500).json({ error: 'Internal server error - reading user data' });
    }

    // Check if the username already exists
    const existingUser = userData.find(user => user.username === username);
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Add new user to the data
    userData.push({ username, password });

    // Save updated user data
    fs.writeFileSync('userData.json', JSON.stringify(userData, null, 2));

    console.log('User signed up successfully:', username);

    res.json({ success: true });
  } catch (error) {
    // Log and handle unexpected errors during signup
    console.error('Unexpected error during signup:', error.message);
    res.status(500).json({ error: 'Internal server error - unexpected error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
