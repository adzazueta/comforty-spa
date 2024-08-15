// Firebase
import {
  child,
  get,
  getDatabase,
  ref,
  remove,
  set,
  serverTimestamp,
  update
} from 'firebase/database'

// Services
import User from './User.js'

export default class Categories {
  static createCategory(name, description) {
    const db = getDatabase()
    
    try {
      const uuid = crypto.randomUUID()

      set(ref(db, `categories/${uuid}`), {
        uuid,
        name,
        description,
        createdBy: User.getUserData().displayName,
        updatedBy: User.getUserData().displayName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      throw new Error(error)
    }
  }

  static async getCategoryByUuid(uuid) {
    const db = getDatabase()

    try {
      const categories = await get(child(ref(db, `categories/${uuid}`)))
      if (categories.exists()) return Object.values(categories.val())
      else return null
    } catch (error) {
      throw new Error(error)
    }
  }

  static async getAllCategories() {
    const db = getDatabase()

    try {
      const categories = await get(child(ref(db), 'categories/'))
      if (categories.exists()) return Object.values(categories.val())
      else return []
    } catch (error) {
      throw new Error(error)
    }
  }

  static updateCategory(uuid, name, description) {
    const db = getDatabase()

    try {
      update(ref(db, `categories/${uuid}`), {
        name,
        description,
        updatedAt: serverTimestamp(),
        updatedBy: User.getUserData().displayName
      })
    } catch (error) {
      throw new Error(error)
    }
  }

  static removeCategory(uuid) {
    const db = getDatabase()

    try {
      remove(ref(db, `categories/${uuid}`))
    } catch (error) {
      throw new Error(error)
    }
  }
}