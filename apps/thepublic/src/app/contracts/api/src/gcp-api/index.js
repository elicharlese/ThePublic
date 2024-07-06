const express = require('express');
const { signUpUser, signInUser, signOutUser } = require('./firebase/auth');
const authenticate = require('./firebase/middleware');

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await signUpUser(email, password);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await signInUser(email, password);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/signout', async (req, res) => {
  try {
    await signOutUser();
    res.status(200).json({ message: 'Signed out successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/protected', authenticate, (req, res) => {
  res.status(200).json({ message: 'You have access', user: req.user });
});

module.exports = router;