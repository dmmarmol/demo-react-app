import * as admin from 'firebase-admin'
import * as path from 'path'
import type { Firestore } from 'firebase-admin/firestore'

let firebaseAdminApp: admin.app.App | null = null

/**
 * Initialize Firebase Admin SDK for server-side operations
 * Uses service account credentials from environment or default location
 */
export function initializeServerApp(): admin.app.App {
  if (firebaseAdminApp) {
    return firebaseAdminApp
  }

  // Check if credentials are already provided
  if (!admin.apps.length) {
    // Try to initialize with explicit service account if available
    const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
    
    if (serviceAccountPath) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const serviceAccount = require(path.resolve(serviceAccountPath))
        firebaseAdminApp = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        })
      } catch (error) {
        console.warn('Could not load service account from', serviceAccountPath, '- falling back to default initialization')
        firebaseAdminApp = admin.initializeApp()
      }
    } else {
      firebaseAdminApp = admin.initializeApp()
    }
  } else {
    firebaseAdminApp = admin.apps[0]!
  }

  return firebaseAdminApp
}

/**
 * Get Firestore instance from an initialized admin app
 */
export function getServerFirestoreSDK(app: admin.app.App): Firestore {
  return admin.firestore(app)
}

/**
 * Get Firestore instance for server-side operations using Admin SDK
 * Convenience function that combines initialization and retrieval
 */
export function getServerFirestore(): Firestore {
  const app = initializeServerApp()
  return getServerFirestoreSDK(app)
}
