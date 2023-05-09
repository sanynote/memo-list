// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";



const firebaseConfig = {
  apiKey: 'sss',
  authDomain: "qqqq",
  projectId: "qqqq",
  storageBucket: "qqqq",
  messagingSenderId: "qqqq",
  appId: "qqqq"
};

const app = initializeApp(firebaseConfig);
export const authFire = getAuth(app);

