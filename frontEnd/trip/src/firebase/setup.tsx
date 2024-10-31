import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth"


const firebaseConfig = {
  apiKey: "AIzaSyBkzMXNpxl_eP1as8LNlQf7rjlEyyefm30",
  authDomain: "tripadvisor-clone-18d6f.firebaseapp.com",
  projectId: "tripadvisor-clone-18d6f",
  storageBucket: "tripadvisor-clone-18d6f.appspot.com",
  messagingSenderId: "278216350122",
  appId: "1:278216350122:web:6e04dc7d83b4606f1d73d3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()