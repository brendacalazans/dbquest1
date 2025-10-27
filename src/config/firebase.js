/**
 * Configuração do Firebase
 * 
 * Este arquivo contém a configuração e inicialização do Firebase,
 * incluindo Authentication e Realtime Database.
 */

// Importa as funções necessárias do Firebase v10+
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
    getAuth, 
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { 
    getDatabase,
    ref,
    onValue,
    set,
    update,
    increment,
    get
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDoI9Az5udHaeUHOybJc5-YW75oV-kKtgs",
    authDomain: "dataquest-c39fd.firebaseapp.com",
    databaseURL: "https://dataquest-c39fd-default-rtdb.firebaseio.com",
    projectId: "dataquest-c39fd",
    storageBucket: "dataquest-c39fd.appspot.com",
    messagingSenderId: "130744038521",
    appId: "1:130744038521:web:432aaa66a10650210e50a8"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Exporta instâncias e funções para uso global
window.FB = {
    auth, 
    db, 
    onAuthStateChanged, 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithPopup,
    updateProfile, 
    signOut, 
    ref, 
    onValue, 
    set, 
    update, 
    increment,
    get
};

export {
    app,
    auth,
    db,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile,
    signOut,
    ref,
    onValue,
    set,
    update,
    increment,
    get
};

