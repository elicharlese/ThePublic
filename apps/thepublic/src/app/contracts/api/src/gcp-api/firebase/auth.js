const { firebase } = require('./config');
const { admin } = require('./config');

const signUpUser = async (email, password) => {
  try {
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

const signInUser = async (email, password) => {
  try {
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

const signOutUser = async () => {
  try {
    await firebase.auth().signOut();
  } catch (error) {
    throw new Error(error.message);
  }
};

const verifyToken = async (token) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  signUpUser,
  signInUser,
  signOutUser,
  verifyToken,
};