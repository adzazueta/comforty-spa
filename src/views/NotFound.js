export default class NotFound {
  constructor() {}

  async getHTML() {
    return `
      <style>${css}</style>
      <h1>404 - NotFound</h1>
    `
  }
}

const css = ``
