// Components
import '../components/LoginForm.js'

export default class Login {
  async getHTML() {
    return `
      <h1>Login</h1>
      <login-form></login-form>
    `
  }
}