import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBkW8_UH8kAT1JmajbA6zpjx8WZDKCShS4",
  authDomain: "proj-mgmt-10c67.firebaseapp.com",
  projectId: "proj-mgmt-10c67",
  storageBucket: "proj-mgmt-10c67.appspot.com",
  messagingSenderId: "236008483548",
  appId: "1:236008483548:web:5111db1b57e2411c9be219",
  measurementId: "G-1LQKC2JYDH"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
