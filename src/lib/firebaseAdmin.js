import { initializeApp, cert, getApps } from "firebase-admin/app"

// Check for required environment variables first
const requiredEnvVars = ["FIREBASE_PROJECT_ID", "FIREBASE_CLIENT_EMAIL", "FIREBASE_PRIVATE_KEY"]

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName])

if (missingVars.length > 0) {
  console.error(`Missing required Firebase environment variables: ${missingVars.join(", ")}`)
  throw new Error(
    `Missing required Firebase Admin SDK configuration: ${missingVars.join(", ")}. Please add these environment variables in your Vercel project settings.`,
  )
}

// Validate environment variables
if (!process.env.FIREBASE_PROJECT_ID?.trim()) {
  throw new Error("FIREBASE_PROJECT_ID is empty or invalid")
}

if (!process.env.FIREBASE_CLIENT_EMAIL?.trim()) {
  throw new Error("FIREBASE_CLIENT_EMAIL is empty or invalid")
}

if (!process.env.FIREBASE_PRIVATE_KEY?.trim()) {
  throw new Error("FIREBASE_PRIVATE_KEY is empty or invalid")
}

// Initialize Firebase Admin SDK
const getFirebaseApp = () => {
  if (getApps().length > 0) {
    return getApps()[0]
  }

  try {
    // Properly format the private key - handle both escaped and unescaped newlines
    let privateKey = process.env.FIREBASE_PRIVATE_KEY
    if (!privateKey.includes("-----BEGIN PRIVATE KEY-----")) {
      throw new Error("Invalid private key format")
    }
    
    // Replace escaped newlines if they exist
    privateKey = privateKey.replace(/\\n/g, "\n")

    console.log("Initializing Firebase Admin SDK with project ID:", process.env.FIREBASE_PROJECT_ID)
    
    const app = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    })

    console.log("Firebase Admin SDK initialized successfully")
    return app
  } catch (error) {
    console.error("Error initializing Firebase Admin SDK:", error)
    console.error("Project ID:", process.env.FIREBASE_PROJECT_ID)
    console.error("Client Email:", process.env.FIREBASE_CLIENT_EMAIL)
    console.error("Private Key length:", process.env.FIREBASE_PRIVATE_KEY?.length)
    throw new Error(`Failed to initialize Firebase Admin SDK: ${error.message}`)
  }
}

// Export the initialized app
const firebaseApp = getFirebaseApp()
export default firebaseApp
