import * as firebase from 'firebase';
import firestore from 'firebase/firestore'

var firebaseConfig = {
  apiKey: "AIzaSyBPKvP-gRunli9qvLTg1qtu1CWI8UPz0gI",
  authDomain: "foodmarketplace-5f5d7.firebaseapp.com",
  projectId: "foodmarketplace-5f5d7",
  storageBucket: "foodmarketplace-5f5d7.appspot.com",
  messagingSenderId: "928101792726",
  appId: "1:928101792726:web:e1c064a47ba91f79200277",
  measurementId: "G-RWHRKR7JGW"
};
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);

firebase.firestore();

export default firebase;