import express from 'express';
import { signInWithWallet, signOutUser } from './thirdweb/auth';
import authenticate from './thirdweb/middleware';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

app.post('/signin', async (req, res) => {
  const { address, nonce, signature } = req.body;
  try {
    const user = await signInWithWallet(address, nonce, signature);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post('/signout', async (req, res) => {
  const { address } = req.body;
  try {
    await signOutUser(address);
    res.status(200).json({ message: 'Signed out successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/protected', authenticate, (req, res) => {
  res.status(200).json({ message: 'You have access', user: req.user });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;