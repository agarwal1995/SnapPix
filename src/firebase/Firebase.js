// Initialize Firebase

import * as firebase from "firebase";

const config = {
  apiKey: "AIzaSyDVCF7F_KzH3ra-bPy0biz63IRNTxwT4Xc",
  authDomain: "snappix-9d635.firebaseapp.com",
  databaseURL: "https://snappix-9d635.firebaseio.com",
  projectId: "snappix-9d635",
  storageBucket: "snappix-9d635.appspot.com",
  messagingSenderId: "46927983446"
};

firebase.initializeApp(config);
export default firebase;
