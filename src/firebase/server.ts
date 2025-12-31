import { initializeApp, type FirebaseApp, getApps } from 'firebase/app'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getFirebaseServerConfig } from './config'

/**
 * Initialize Firebase server app with server-only configuration
 * Uses unprefixed environment variables (not exposed to browser)
 */
export function initializeServerApp(): FirebaseApp {
  const config = getFirebaseServerConfig()
  const existing = getApps().find((app) => app.name === 'server')
  return existing ?? initializeApp(config, 'server')
}

/**
 * Get Firestore instance for server-side operations
 */
export function getServerFirestoreSDK(app: FirebaseApp): Firestore {
  return getFirestore(app)
}
