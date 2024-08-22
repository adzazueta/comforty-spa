// Firebase
import {
  browserSessionPersistence,
  getAuth,
  createUserWithEmailAndPassword,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth'

export default class User {
  static async signUp(name, email, password) {
    try {
      await setPersistence(getAuth(), browserSessionPersistence)
      const userCredentials = await createUserWithEmailAndPassword(getAuth(), email, password)
      await updateProfile(userCredentials.user, { displayName: name })
      
      return getAuth().currentUser
    } catch (error) {
      throw new Error(error)
    }
  }

  static async signIn(email, password) {
    try {
      await setPersistence(getAuth(), browserSessionPersistence)
      const userCredentials = await signInWithEmailAndPassword(getAuth(), email, password)

      return userCredentials
    } catch (error) {
      throw new Error(error)
    }
  }

  static async signOut() {
    try {
      await signOut(getAuth())
    } catch (error) {
      throw new Error(error)
    }
  }

  static getUserData() {
    return getAuth().currentUser ?? JSON.parse(sessionStorage.getItem(`firebase:authUser:${import.meta.env.VITE_FIREBASE_API_KEY}:[DEFAULT]`))
  }
}