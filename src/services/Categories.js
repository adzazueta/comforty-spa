// Firebase
import { getDownloadURL, getStorage, ref as storageRef, uploadBytes } from 'firebase/storage'
import {
  child,
  get,
  getDatabase,
  ref as databaseRef,
  remove,
  set,
  serverTimestamp,
  update
} from 'firebase/database'

// Services
import User from './User.js'

export default class Categories {
  static async createCategory(name, description, image) {
    const db = getDatabase()
    const storage = getStorage()
    
    try {
      const uuid = crypto.randomUUID()
      const imageRef = storageRef(storage, `images/categories/${uuid}.${image.extension}`)

      const uploadedImage = await uploadBytes(imageRef, image.file)
      const imageURL = await getDownloadURL(uploadedImage.ref)

      set(databaseRef(db, `categories/${uuid}`), {
        uuid,
        code: name.toLowerCase().replace(' ', '-'),
        name,
        description,
        image: imageURL,
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
      const categories = await get(child(databaseRef(db, `categories/${uuid}`)))
      if (categories.exists()) return Object.values(categories.val())
      else return null
    } catch (error) {
      throw new Error(error)
    }
  }

  static async getAllCategories() {
    const db = getDatabase()

    try {
      const categories = await get(child(databaseRef(db), 'categories/'))
      if (categories.exists()) return Object.values(categories.val())
      else return []
    } catch (error) {
      throw new Error(error)
    }
  }

  static async updateCategory(uuid, name, description, image = '') {
    const db = getDatabase()
    const storage = getStorage()

    try {
      const dataToUpdate = {
        name,
        description,
        updatedAt: serverTimestamp(),
        updatedBy: User.getUserData().displayName
      }

      if (image && typeof image !== 'string') {
        const imageUuid = crypto.randomUUID()
        const imageRef = storageRef(storage, `images/categories/${imageUuid}.${image.extension}`)

        const uploadedImage = await uploadBytes(imageRef, image.file)
        const imageURL = await getDownloadURL(uploadedImage.ref)
        dataToUpdate.image = imageURL
      }

      update(databaseRef(db, `categories/${uuid}`), dataToUpdate)
    } catch (error) {
      throw new Error(error)
    }
  }

  static removeCategory(uuid) {
    const db = getDatabase()

    try {
      remove(databaseRef(db, `categories/${uuid}`))
    } catch (error) {
      throw new Error(error)
    }
  }
}