import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'

export default class User {
  static async signUp(email, password) {
    try {
      const userCredentials = await createUserWithEmailAndPassword(getAuth(), email, password)
      return userCredentials
    } catch (error) {
      throw new Error(error)
    }
  }

  static async signIn(email, password) {
    try {
      console.log({ auth: getAuth(), email, password })
      const userCredentials = await signInWithEmailAndPassword(getAuth(), email, password)
      return userCredentials
    } catch (error) {
      throw new Error(error)
    }
  }

  static async signOut() {
    try {
      await signOut(getAuth())
      return userCredentials
    } catch (error) {
      throw new Error(error)
    }
  }
}