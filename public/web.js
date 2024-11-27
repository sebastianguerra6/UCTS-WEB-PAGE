
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA6unpcJthG1vxG0uGsX3axTJrBSuiOcnY",
    authDomain: "ucts-95264.firebaseapp.com",
    projectId: "ucts-95264",
    storageBucket: "ucts-95264.appspot.com",
    messagingSenderId: "811788165580",
    appId: "1:811788165580:web:30c3e4af5e2c74f611bd69"
};
// Import the functions you need from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore();
console.log("Firebase initialized:", app);

console.log("Firebase ha sido inicializado");
