import { authenticator } from './config';

const signInWithWallet = async (address: string, nonce: string, signature: string) => {
  try {
    const user = await authenticator.verify(nonce, signature);
    // Save user session to your database or session store
    // TODO: Is the nonce enough security to verify the signature?
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

const signOutUser = async (address: string) => {
  try {
    // Remove user session from your database or session store
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};

export { signInWithWallet, signOutUser };