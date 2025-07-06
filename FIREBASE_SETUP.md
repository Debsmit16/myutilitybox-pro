# Firebase Setup Guide for MyUtilityBox Pro

This guide will help you set up Firebase for the full-stack version of MyUtilityBox Pro.

## 🚀 Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `myutilitybox-pro` (or your preferred name)
4. Enable Google Analytics (optional but recommended)
5. Click "Create project"

## 🔧 Step 2: Configure Firebase Services

### Authentication Setup
1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable the following providers:
   - **Email/Password**: Click and enable
   - **Google**: Click, enable, and add your project's support email
3. Go to **Authentication** > **Settings** > **Authorized domains**
4. Add your domains:
   - `localhost` (for development)
   - Your production domain (e.g., `myutilitybox-pro.vercel.app`)

### Firestore Database Setup
1. Go to **Firestore Database** > **Create database**
2. Choose **Start in test mode** (we'll add security rules later)
3. Select a location closest to your users
4. Click "Done"

### Storage Setup (Optional)
1. Go to **Storage** > **Get started**
2. Start in test mode
3. Choose the same location as Firestore

## 🔑 Step 3: Get Firebase Configuration

1. Go to **Project Settings** (gear icon) > **General**
2. Scroll down to "Your apps" section
3. Click **Web app** icon (`</>`)
4. Register app with nickname: `myutilitybox-pro-web`
5. Copy the Firebase configuration object

## 📝 Step 4: Update Firebase Config

Replace the placeholder config in `src/firebase/config.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id"
};
```

## 🛡️ Step 5: Security Rules

### Firestore Security Rules
Go to **Firestore Database** > **Rules** and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // User todos
    match /users/{userId}/todos/{todoId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // User notes
    match /users/{userId}/notes/{noteId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // User preferences
    match /users/{userId}/preferences/{prefId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Storage Security Rules (if using Storage)
Go to **Storage** > **Rules** and replace with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🚀 Step 6: Deploy to Firebase Hosting (Optional)

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init
   ```
   - Select **Hosting**
   - Choose your Firebase project
   - Set public directory to `build`
   - Configure as single-page app: **Yes**
   - Don't overwrite index.html: **No**

4. Build and deploy:
   ```bash
   npm run build
   firebase deploy
   ```

## 🧪 Step 7: Test the Setup

1. Start your development server:
   ```bash
   npm start
   ```

2. Test the following:
   - Sign up with email/password
   - Sign in with Google
   - Create todos and notes
   - Check if data persists after refresh
   - Test on different devices/browsers

## 🔧 Environment Variables (Optional)

For better security, you can use environment variables:

1. Create `.env` file in project root:
   ```
   REACT_APP_FIREBASE_API_KEY=your-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id
   ```

2. Update `src/firebase/config.js`:
   ```javascript
   const firebaseConfig = {
     apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
     authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
     projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
     storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
     messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
     appId: process.env.REACT_APP_FIREBASE_APP_ID
   };
   ```

## 🎯 Next Steps

After setup, you can:
- Customize the landing page
- Add more authentication providers
- Implement real-time data sync
- Add cloud functions for advanced features
- Set up analytics and monitoring

## 🆘 Troubleshooting

### Common Issues:
1. **Auth domain not authorized**: Add your domain to authorized domains
2. **Permission denied**: Check Firestore security rules
3. **API key restrictions**: Ensure API key has proper restrictions
4. **CORS errors**: Check Firebase project configuration

### Getting Help:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Support](https://firebase.google.com/support)
- Check browser console for detailed error messages

---

🎉 **Congratulations!** Your MyUtilityBox Pro is now a full-stack application with Firebase backend!
