// Layout
import '../layouts/General.js'

// Components

export default class Home {
  constructor() {}

  async getHTML() {
    return `
      <style>${css}</style>
      <general-layout>
        <h1>HomePage</h1>
      </general-layout>
    `
  }
}

const css = ``
