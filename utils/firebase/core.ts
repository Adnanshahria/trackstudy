import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { FIREBASE_CONFIG } from '../../constants';

let firebaseApp: firebase.app.App;
let firestore: firebase.firestore.Firestore;
let firebaseAuth: firebase.auth.Auth;

console.log("🔥 Initializing Firebase...");

try {
    // Initialize Firebase only if it hasn't been initialized yet
    if (!firebase.apps.length) {
        firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
    } else {
        firebaseApp = firebase.app(); // Use existing instance
    }

    const hostname = window.location.hostname;
    console.log(`%c App running on: ${hostname}`, 'background: #222; color: #bada55; padding: 4px; border-radius: 4px;');
    
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
        console.log(`%c IMPORTANT: If login fails, ensure 'https://${hostname}' is added to Firebase Console > Authentication > Settings > Authorized Domains`, 'color: orange; font-weight: bold;');
    }

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
                 console.warn('Persistence warning: Multiple tabs open. Persistence disabled for this tab.');
            } else if (err.code === 'unimplemented') {
                 console.warn('Persistence warning: Browser does not support offline persistence.');
            }
        });
    }
} catch (error) {
    console.error("CRITICAL: Firebase Initialization Failed. Check your configuration.", error);
}

export { firebaseApp, firestore, firebaseAuth, firebase };