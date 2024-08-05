export default class Home {
  constructor() {}

  async getHTML() {
    return `
      <style>${css}</style>
      <h1>Home Page</h1>
    `
  }
}

const css = ``
