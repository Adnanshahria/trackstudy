import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { FIREBASE_CONFIG } from '../../constants';

let firebaseApp: firebase.app.App;
let firestore: firebase.firestore.Firestore;
let firebaseAuth: firebase.auth.Auth;

try {
    // Initialize Firebase only if it hasn't been initialized yet
    if (!firebase.apps.length) {
        firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
    } else {
        firebaseApp = firebase.app(); // Use existing instance
    }

    console.log("Firebase Initialized on:", window.location.hostname);

    firebaseAuth = firebase.auth();
    firestore = firebase.firestore();
    
    // Apply settings safely
    if (firestore) {
        // ignoreUndefinedProperties allows saving objects with undefined fields without error
        firestore.settings({ ignoreUndefinedProperties: true });
        
        // Attempt to enable offline persistence
        // This might fail if multiple tabs are open, which is expected and handled
        firestore.enablePersistence({ synchronizeTabs: true }).catch(err => {
            if (err.code === 'failed-precondition') {
                 console.warn('Persistence failed: Multiple tabs open.');
            } else if (err.code === 'unimplemented') {
                 console.warn('Persistence not supported by browser.');
            }
        });
    }
} catch (error) {
    console.error("CRITICAL: Firebase Initialization Failed", error);
}

export { firebaseApp, firestore, firebaseAuth, firebase };