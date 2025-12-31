import type { FirebaseOptions } from 'firebase/app'

type RequiredKey = keyof Pick<FirebaseOptions, 'apiKey' | 'authDomain' | 'projectId' | 'storageBucket' | 'messagingSenderId' | 'appId'>

type FirebaseConfigContext = 'client' | 'server'

type FirebaseConfigKeys = {
  apiKey: string | undefined
  authDomain: string | undefined
  projectId: string | undefined
  storageBucket: string | undefined
  messagingSenderId: string | undefined
  appId: string | undefined
  measurementId?: string
}

function assertRequired(config: FirebaseConfigKeys, context: FirebaseConfigContext) {
  const missing = (['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'] satisfies RequiredKey[]).filter(
    (key) => !config[key]
  )

  if (missing.length) {
    throw new Error(`Missing Firebase ${context} env vars: ${missing.join(', ')}`)
  }
}

export function getFirebaseClientConfig(): FirebaseOptions {
  const config: FirebaseConfigKeys = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  }

  assertRequired(config, 'client')
  return config
}

export function getFirebaseServerConfig(): FirebaseOptions {
  const config: FirebaseConfigKeys = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  }

  assertRequired(config, 'server')
  return config
}
