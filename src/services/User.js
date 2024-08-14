import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth'

export default class User {
  static async signUp(name, email, password) {
    try {
      const userCredentials = await createUserWithEmailAndPassword(getAuth(), email, password)
      await updateProfile(userCredentials.user, { displayName: name })
      return getAuth().currentUser
    } catch (error) {
      throw new Error(error)
    }
  }

  static async signIn(email, password) {
    try {
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

  static verifyToken() {
    const currentUser = getAuth().currentUser
    if (!currentUser) return false

    const accessToken = sessionStorage.getItem('access-token')
    return accessToken === currentUser.accessToken
  }
}