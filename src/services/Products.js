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

export default class Products {
  static async createProduct(name, description, price, category, image) {
    const db = getDatabase()
    const storage = getStorage()
    
    try {
      const uuid = crypto.randomUUID()
      const imageRef = storageRef(storage, `images/products/${uuid}.${image.extension}`)

      const uploadedImage = await uploadBytes(imageRef, image.file)
      const imageURL = await getDownloadURL(uploadedImage.ref)

      set(databaseRef(db, `products/${uuid}`), {
        uuid,
        name,
        description,
        price,
        category,
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

  static async getProductByUuid(uuid) {
    const db = getDatabase()

    try {
      const products = await get(child(databaseRef(db, `products/${uuid}`)))
      if (products.exists()) return Object.values(products.val())
      else return null
    } catch (error) {
      throw new Error(error)
    }
  }

  static async getAllProducts() {
    const db = getDatabase()

    try {
      const products = await get(child(databaseRef(db), 'products/'))
      if (products.exists()) return Object.values(products.val())
      else return []
    } catch (error) {
      throw new Error(error)
    }
  }

  static async updateProduct(uuid, name, description, price, category, image = '') {
    const db = getDatabase()
    const storage = getStorage()
    
    try {
      const dataToUpdate = {
        name,
        description,
        price,
        category,
        updatedAt: serverTimestamp(),
        updatedBy: User.getUserData().displayName
      }

      if (image && typeof image !== 'string') {
        const imageRef = storageRef(storage, `images/products/${uuid}.${image.extension}`)

        const uploadedImage = await uploadBytes(imageRef, image.file)
        const imageURL = await getDownloadURL(uploadedImage.ref)
        dataToUpdate.image = imageURL
      }

      update(databaseRef(db, `products/${uuid}`), dataToUpdate)
    } catch (error) {
      throw new Error(error)
    }
  }

  static removeProduct(uuid) {
    const db = getDatabase()

    try {
      remove(databaseRef(db, `products/${uuid}`))
    } catch (error) {
      throw new Error(error)
    }
  }
}