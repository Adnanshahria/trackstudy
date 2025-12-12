
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { FIREBASE_CONFIG } from '../../constants';
import { logger } from '../logger';

let firebaseApp: firebase.app.App;
let firestore: firebase.firestore.Firestore;
let firebaseAuth: firebase.auth.Auth;

logger.debug("Initializing Firebase...");

try {
    // Initialize Firebase only if it hasn't been initialized yet
    if (!firebase.apps.length) {
        firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
    } else {
        firebaseApp = firebase.app(); // Use existing instance
    }

    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    const fullDomain = `${protocol}//${hostname}`;
    logger.debug(`App running on: ${hostname}`);
    
    // Firebase domain whitelist check
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
        logger.info(`📝 For authentication to work, ensure '${hostname}' is added to Firebase Console > Authentication > Settings > Authorized Domains. You can also deploy to: Vercel, Netlify, GitHub Pages, or any domain.`);
    }

    firebaseAuth = firebase.auth();
    firestore = firebase.firestore();
    
    // Apply settings safely
    if (firestore) {
        // ignoreUndefinedProperties allows saving objects with undefined fields without error
        // merge: true prevents "You are overriding the original host" warning
        firestore.settings({ ignoreUndefinedProperties: true, merge: true });
        
        // Attempt to enable offline persistence
        // Removed { synchronizeTabs: true } as it causes deprecation warnings and is often unstable in basic compat mode
        firestore.enablePersistence().catch(err => {
            if (err.code === 'failed-precondition') {
                 logger.warn('Persistence warning: Multiple tabs open. Persistence disabled for this tab.');
            } else if (err.code === 'unimplemented') {
                 logger.warn('Persistence warning: Browser does not support offline persistence.');
            }
        });
    }
} catch (error) {
    logger.error("CRITICAL: Firebase Initialization Failed. Check your configuration.", error);
}

export { firebaseApp, firestore, firebaseAuth, firebase };
