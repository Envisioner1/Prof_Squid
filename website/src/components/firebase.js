import firebase from 'firebase';

// Initialize Firebase
var config = {
  apiKey: 'AIzaSyDGWAdb1BHrxOo_eD1_sr9FFI9QqeAcnoQ',
  authDomain: 'expinapp-dd87b.firebaseapp.com',
  databaseURL: 'https://expinapp-dd87b.firebaseio.com',
  projectId: 'expinapp-dd87b',
  storageBucket: 'expinapp-dd87b.appspot.com',
  messagingSenderId: '984220758882',
};
firebase.initializeApp(config);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export const db = firebase.database();

export const doPasswordReset = function(email) {
  auth.sendPasswordResetEmail(email);
};

export const doSignInWithEmailAndPassword = (email, password) =>
  auth.signInWithEmailAndPassword(email, password);

// Password Change
export const doPasswordUpdate = password =>
  auth.currentUser.updatePassword(password);

export const doCreateUserWithEmailAndPassword = (email, password) =>
  auth.createUserWithEmailAndPassword(email, password);

export const doSignOut = () => auth.signOut();

export default firebase;
