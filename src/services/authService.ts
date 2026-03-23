import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { UserRole } from '../types';

const googleProvider = new GoogleAuthProvider();

export const authService = {
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user profile exists in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Create initial user profile
        // Default admin for the provided email
        const role: UserRole = user.email === "transvippasseios@gmail.com" ? "super_admin" : "client";
        
        await setDoc(userDocRef, {
          name: user.displayName || 'Usuário',
          email: user.email,
          role: role,
          status: 'active',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          lastLoginAt: serverTimestamp()
        });
      } else {
        // Update last login
        await setDoc(userDocRef, {
          lastLoginAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }, { merge: true });
      }

      return user;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  },

  async logout() {
    await signOut(auth);
  }
};
