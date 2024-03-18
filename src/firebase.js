// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQhqoHLZTfnd3qIhqyWCwMgDhQRFW7q_o",
  authDomain: "online-chat-app-d822f.firebaseapp.com",
  projectId: "online-chat-app-d822f",
  storageBucket: "online-chat-app-d822f.appspot.com",
  messagingSenderId: "940601703103",
  appId: "1:940601703103:web:9c08f0b77998eb8f12640a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);