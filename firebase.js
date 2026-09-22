import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getDatabase, ref, onValue, push, set, update, remove } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDFKz6jWBnwx0AKD9F3EbtTN7tmvmFSSCg",
  authDomain: "adminpanel-6b54e.firebaseapp.com",
  databaseURL: "https://adminpanel-6b54e-default-rtdb.firebaseio.com",
  projectId: "adminpanel-6b54e",
  storageBucket: "adminpanel-6b54e.firebasestorage.app",
  messagingSenderId: "81655796126",
  appId: "1:81655796126:web:6e41ab2b5631c31a28c68f",
  measurementId: "G-6C417C45LR"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);

export {
  ref, onValue, push, set, update, remove,
  onAuthStateChanged, signInWithEmailAndPassword, signOut
};
