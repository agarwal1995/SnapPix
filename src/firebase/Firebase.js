// Initialize Firebase

import * as firebase from "firebase";

const config = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: ""
};

firebase.initializeApp(config);

const storage = firebase.storage();
const database = firebase.database();
export { storage, database, firebase as default };
