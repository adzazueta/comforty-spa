// Utils
import pubSub from '../utils/PubSub.js'

class CartStore {
  constructor() {
    this.storeData = {
      items: JSON.parse(sessionStorage.getItem('cartStore:items')) ?? []
    }

    this.storeProxy = new Proxy(this.storeData, {
      get: (target, property) => {
        return target[property]
      },

      set: (target, property, value) => {
        target[property] = value
        pubSub.publish('cartStoreChange', { property, value })
        sessionStorage.setItem(`cartStore:${property}`, JSON.stringify(value))
        return true
      },
    });
  }

  get items() {
    return this.storeProxy.items
  }

  get totalPrice() {
    return this.storeProxy.items.reduce((acc, item) => acc + (item.amount * item.price), 0)
  }

  get totalItems() {
    return this.storeProxy.items.reduce((acc, item) => acc + item.amount, 0)
  }

  addItem(item) {
    const temporalItems = this.storeData.items
    const foundIndex = temporalItems.findIndex((savedItem) => savedItem.uuid === item.uuid)

    if (foundIndex >= 0) {
      temporalItems[foundIndex].amount += 1
    } else {
      item.amount = 1
      temporalItems.push(item)
    }

    this.storeProxy.items = temporalItems
  }

  removeItem(uuid) {
    const temporalItems = this.storeData.items
    const foundIndex = temporalItems.findIndex(savedItem => savedItem.uuid === uuid)
  
    if (foundIndex >= 0) {
      if (temporalItems[foundIndex].amount > 1) {
        temporalItems[foundIndex].amount -= 1
      } else {
        temporalItems.splice(foundIndex, 1)
      }

      this.storeProxy.items = temporalItems
    }
  }
}

const cartStore = new CartStore()
export default cartStore
