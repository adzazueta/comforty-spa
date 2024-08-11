// Layout
import '../layouts/General.js'

// Components
import '../components/LoginForm.js'

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
