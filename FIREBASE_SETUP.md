# Firebase Setup Guide for MechaInvoice

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: "MechaInvoice" (or your preferred name)
4. Follow the setup wizard

## Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get Started"
3. Enable **Email/Password** authentication
4. Enable **Google** authentication:
   - Add your app's domain to authorized domains
   - Configure OAuth consent screen

## Step 3: Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click "Create database"
3. Start in **production mode** (we'll add security rules later)
4. Choose your database location

## Step 4: Set Firestore Security Rules

Go to **Firestore Database > Rules** and paste:

\`\`\`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own invoices
    match /invoices/{invoice} {
      allow read, write: if request.auth != null;
    }
  }
}
\`\`\`

## Step 5: Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the **Web** icon (</>)
4. Register your app
5. Copy the `firebaseConfig` object

## Step 6: Update Application

Open `src/lib/firebase.ts` and replace the configuration:

\`\`\`typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
\`\`\`

## Step 7: Configure Authentication URLs

1. Go to **Authentication > Settings > Authorized domains**
2. Add your application's domain (e.g., `yourapp.lovable.app`)
3. For local development, `localhost` should already be there

## Testing

1. Run your application
2. Try signing up with email/password
3. Try signing in with Google
4. Create an invoice and verify it's saved in Firestore

## Troubleshooting

### "auth/configuration-not-found"
- Make sure you've enabled Email/Password and Google authentication methods

### "Permission denied" on Firestore
- Check your Firestore security rules
- Make sure user is authenticated before creating invoices

### Google Sign-In not working
- Verify authorized domains in Firebase Console
- Check OAuth consent screen configuration

## Security Notes

⚠️ The Firebase config API key is safe to expose in client-side code - it identifies your Firebase project, but access is controlled by security rules.

✅ Always use proper Firestore security rules to protect your data
✅ Never commit sensitive credentials to version control
