class PubSub {
  constructor() {
    this.topics = {}
  }

  subscribe(topic, listener) {
    if (!this.topics[topic]) {
      this.topics[topic] = []
    }

    this.topics[topic].push(listener)
  }

  unsubscribe(topic, listener) {
    if (!this.topics[topic]) return

    this.topics[topic] = this.topics[topic].filter(fn => fn !== listener)
  }

  publish(topic, data) {
    if (!this.topics[topic]) return

    this.topics[topic].forEach(listener => listener(data))
  }
}

const pubSub = new PubSub()
export default pubSub
