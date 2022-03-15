import firebase from "firebase/compat/app"
import "firebase/compat/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyARF0IT9Y63oefH7slnFanvwIiUOPAL9c4",
  authDomain: "grapeswap.firebaseapp.com",
  projectId: "grapeswap",
  storageBucket: "grapeswap.appspot.com",
  messagingSenderId: "1077360661398",
  appId: "1:1077360661398:web:b1b9b967a4b5a4e5b543b7",
  measurementId: "G-ZGJVZR619R"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore()

export { firestore }