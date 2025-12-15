import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDGpagCpskeOxzVO4C5qgdVUTeWO8rUZUU",
  authDomain: "electrician-830b2.firebaseapp.com",
  projectId: "electrician-830b2",
  storageBucket: "electrician-830b2.firebasestorage.app",
  messagingSenderId: "1053791458330",
  appId: "1:1053791458330:web:fdbf5befa79aef2376eda3"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
