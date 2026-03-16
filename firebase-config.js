// firebase-config.js
// نسخة متوافقة مع جميع الصفحات

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBdOWisjz-qJQNwcCVNPImAseVQvfJueOo",
  authDomain: "cat11-547eb.firebaseapp.com",
  projectId: "cat11-547eb",
  storageBucket: "cat11-547eb.firebasestorage.app",
  messagingSenderId: "123943009791",
  appId: "1:123943009791:web:99e903cce24f10c7db3bca",
  measurementId: "G-YLDRJ7G2VQ"
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);

// تصدير الخدمات
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// تصدير جميع دوال Firestore
export { 
    doc, collection, query, where, orderBy, limit, onSnapshot, 
    getDoc, getDocs, setDoc, updateDoc, deleteDoc, addDoc,
    serverTimestamp, arrayUnion, arrayRemove, increment 
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// تصدير دوال Auth
export { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

// تصدير دوال Storage
export {
    ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";

console.log('✅ Firebase Config Loaded');