import type { FirebaseApp } from 'firebase/app'
import { 
  initializeClientApp, 
  getClientFirestoreSDK, 
  getClientAnalyticsSDK 
} from '@/firebase/client'
import { 
  initializeServerApp, 
  getServerFirestoreSDK,
  getServerFirestore as getAdminFirestore 
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
 * Get or initialize Firebase server app (Client SDK - deprecated for server use)
 * Prefer using getServerFirestore() for server-side operations
 */
export function getFirebaseServerApp(): FirebaseApp {
  if (typeof window !== 'undefined') {
    throw new Error('getFirebaseServerApp should only be called on the server')
  }

  const registry = getRegistry()
  if (registry.server) return registry.server

  // Initialize using Admin SDK through the server module
  initializeServerApp()
  
  // Return a dummy app reference for backwards compatibility
  // Actual Firestore operations should use getServerFirestore() instead
  const dummyApp = {
    name: 'server',
  } as unknown as FirebaseApp
  
  registry.server = dummyApp
  return registry.server
}

/**
 * Get Firestore instance for client operations
 */
export const getClientFirestore = () => {
  const app = getFirebaseClientApp();
  return getClientFirestoreSDK(app);
}

/**
 * Get Firestore instance for server operations using Admin SDK
 * This is the recommended way to access Firestore on the server
 */
export const getServerFirestore = () => {
  return getAdminFirestore()
}

/**
 * Get Analytics instance if supported (client-only)
 */
export const getClientAnalytics = () => {
  const app = getFirebaseClientApp();
  return getClientAnalyticsSDK(app)
}
