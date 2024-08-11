import User from "../services/User.js"

export default class LoginForm extends HTMLElement {
  static css = ``
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  onFormSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.target)
    User.signIn(formData.get('email'), formData.get('password'))
  }

  connectedCallback() {
    this.render()
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <form id="login-form">
        <input name="email" type="email" />
        <input name="password" type="password" />
        <button type="submit">Login</button>
      </form>
    `

    this.shadowRoot.querySelector('#login-form').addEventListener('submit', this.onFormSubmit)
  }
}

const css = `

`

customElements.define('login-form', LoginForm)
