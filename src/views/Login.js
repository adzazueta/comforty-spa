// Layout
import '../layouts/General.js'

// Components
import '../components/LoginForm.js'

export default class Login {
  constructor() {}

  async getHTML() {
    return `
      <style>${css}</style>
      <general-layout>
        <login-form></login-form>
      </general-layout>
    `
  }
}

const css = ``
