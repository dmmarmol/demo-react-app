import { getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics'
import { initializeApp, type FirebaseApp, getApps } from 'firebase/app'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getFirebaseClientConfig } from './config'

/**
 * Initialize Firebase client app with browser-safe configuration
 * Uses NEXT_PUBLIC_* environment variables
 */
export function initializeClientApp(): FirebaseApp {
  const config = getFirebaseClientConfig()
  const existing = getApps().find((app) => app.name === 'client')
  return existing ?? initializeApp(config, 'client')
}

/**
 * Get Firestore instance for client-side operations
 */
export function getClientFirestoreSDK(app: FirebaseApp): Firestore {
  return getFirestore(app)
}

/**
 * Get Analytics instance if supported in the browser
 * Returns null on server or if analytics not supported
 */
export async function getClientAnalyticsSDK(app: FirebaseApp) {
  if (typeof window === 'undefined') return null

  const supported = await isAnalyticsSupported()
  return supported ? getAnalytics(app) : null
}
