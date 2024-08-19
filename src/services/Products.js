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

export default class Products {
  static createProduct(name, description, price, category, image) {
    const db = getDatabase()
    
    try {
      const uuid = crypto.randomUUID()

      set(ref(db, `products/${uuid}`), {
        uuid,
        name,
        description,
        price,
        category,
        image,
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
      const products = await get(child(ref(db, `products/${uuid}`)))
      if (products.exists()) return Object.values(products.val())
      else return null
    } catch (error) {
      throw new Error(error)
    }
  }

  static async getAllProducts() {
    const db = getDatabase()

    try {
      const products = await get(child(ref(db), 'products/'))
      if (products.exists()) return Object.values(products.val())
      else return []
    } catch (error) {
      throw new Error(error)
    }
  }

  static updateProduct(uuid, name, description, price, category, image) {
    const db = getDatabase()

    try {
      update(ref(db, `products/${uuid}`), {
        name,
        description,
        price,
        category,
        image,
        updatedAt: serverTimestamp(),
        updatedBy: User.getUserData().displayName
      })
    } catch (error) {
      throw new Error(error)
    }
  }

  static removeProduct(uuid) {
    const db = getDatabase()

    try {
      remove(ref(db, `products/${uuid}`))
    } catch (error) {
      throw new Error(error)
    }
  }
}