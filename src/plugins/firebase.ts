import type { FirebaseApp } from 'firebase/app'
import { 
  initializeClientApp, 
  getClientFirestoreSDK, 
  getClientAnalyticsSDK 
} from '@/firebase/client'
import { 
  initializeServerApp, 
  getServerFirestoreSDK 
} from '@/firebase/server'

/**
 * Next.js-specific Firebase registry
 * Maintains singleton app instances across hot reloads
 */
type FirebaseRegistry = {
  client?: FirebaseApp
  server?: FirebaseApp
}

const firebaseRegistry = globalThis as typeof globalThis & { __firebaseApps__?: FirebaseRegistry }

function getRegistry(): FirebaseRegistry {
  if (!firebaseRegistry.__firebaseApps__) {
    firebaseRegistry.__firebaseApps__ = {}
  }

  return firebaseRegistry.__firebaseApps__
}

/**
 * Get or initialize Firebase client app
 * Safe for browser and server-rendered pages
 */
export function getFirebaseClientApp(): FirebaseApp {
  const registry = getRegistry()
  if (registry.client) return registry.client

  registry.client = initializeClientApp()
  return registry.client
}

/**
 * Get or initialize Firebase server app
 * Server-only - throws error if called in browser
 */
export function getFirebaseServerApp(): FirebaseApp {
  if (typeof window !== 'undefined') {
    throw new Error('getFirebaseServerApp should only be called on the server')
  }

  const registry = getRegistry()
  if (registry.server) return registry.server

  registry.server = initializeServerApp()
  return registry.server
}

/**
 * Get Firestore instance for client operations
 */
export const getClientFirestore = () => getClientFirestoreSDK(getFirebaseClientApp())

/**
 * Get Firestore instance for server operations
 */
export const getServerFirestore = () => getServerFirestoreSDK(getFirebaseServerApp())

/**
 * Get Analytics instance if supported (client-only)
 */
export const getClientAnalytics = () => getClientAnalyticsSDK(getFirebaseClientApp())
