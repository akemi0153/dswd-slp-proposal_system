import { initializeApp, cert, getApps } from "firebase-admin/app"

// Check for required environment variables first
const requiredEnvVars = ["FIREBASE_PROJECT_ID", "FIREBASE_CLIENT_EMAIL", "FIREBASE_PRIVATE_KEY"]

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName])

if (missingVars.length > 0) {
  console.error(`Missing required Firebase environment variables: ${missingVars.join(", ")}`)

  // Add environment variables to your project
  throw new Error(
    `Missing required Firebase Admin SDK configuration: ${missingVars.join(", ")}. Please add these environment variables in your Vercel project settings.`,
  )
}

// Initialize Firebase Admin SDK
const getFirebaseApp = () => {
  if (getApps().length > 0) {
    return getApps()[0]
  }

  try {
    // Properly format the private key - it might be stored with escaped newlines
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")

    return initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    })
  } catch (error) {
    console.error("Error initializing Firebase Admin SDK:", error)
    throw new Error(`Failed to initialize Firebase Admin SDK: ${error.message}`)
  }
}

// Export the initialized app
const firebaseApp = getFirebaseApp()
export default firebaseApp
