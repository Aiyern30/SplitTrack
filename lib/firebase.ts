import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

let firebaseApp: FirebaseApp | undefined;
let auth: Auth | undefined;

const initializeFirebase = (): Auth => {
  if (typeof window !== "undefined") {
    if (!firebaseApp) {
      firebaseApp = initializeApp(firebaseConfig);
    }
    if (!auth) {
      auth = getAuth(firebaseApp);
    }
    if (!auth) {
      throw new Error("Failed to initialize Firebase Auth.");
    }
    return auth;
  } else {
    throw new Error("Firebase Auth can only be initialized in the browser.");
  }
};

export { initializeFirebase };
