// Router
import { navigateTo } from '../router/index.js'

// Services
import User from "../services/User.js"

// Components
import '../components/ButtonCta.js'
import '../components/CustomInput.js'

export default class SignupForm extends HTMLElement {
  static css = ``
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })

    this._handleSignupSubmit = this._handleSignupSubmit.bind(this)
    this._handleSubmitFromInputs = this._handleSubmitFromInputs.bind(this)
  }

  async _handleSignupSubmit(event) {
    event.preventDefault()
    try {
      const formData = new FormData(event.target)
      await User.signUp(formData.get('name'), formData.get('email'), formData.get('password'))
      navigateTo('/admin/products')
    } catch (error) {
      console.error(error)
    }
  }

  _handleSubmitFromInputs() {
    this.shadowRoot.querySelector('#signup-form').requestSubmit()
  }

  connectedCallback() {
    this.render()
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <div class="card">
        <h1 class="title">Sign Up</h1>
        <form id="signup-form">
          <custom-input style="--custom-input-width: 100%;" name="name" data-type="text" data-label="Name" data-max-width="100%"></custom-input>
          <custom-input style="--custom-input-width: 100%;" name="email" data-type="email" data-label="Email" data-max-width="100%"></custom-input>
          <custom-input style="--custom-input-width: 100%;" name="password" data-type="password" data-label="Password" data-max-width="100%"></custom-input>
          <button-cta data-type="submit" data-show-arrow>
            Sign Up
          </button-cta>
          <slot name="extra-options"></slot>
        </form>
      </div>
    `

    const newsletterForm = this.shadowRoot.querySelector('#signup-form')
    const emailInput = this.shadowRoot.querySelector('[name="email"]')
    const passwordInput = this.shadowRoot.querySelector('[name="password"]')
    const submitButtom = this.shadowRoot.querySelector('button-cta')

    newsletterForm.addEventListener('submit', this._handleSignupSubmit)
    emailInput.addEventListener('inputenter', this._handleSubmitFromInputs)
    passwordInput.addEventListener('inputenter', this._handleSubmitFromInputs)
    submitButtom.addEventListener('click', this._handleSubmitFromInputs)
  }
}

const css = `
  :host {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;

    & .card {
      max-width: 648px;
      width: 100%;
      border-radius: var(--card-border-radius);
      box-shadow: var(--card-box-shadow);
      padding: 24px 48px;
      box-sizing: border-box;
    }

    & .title {
      margin-top: 0;
      font-size: 32px;
      font-weight: 500;
      text-align: center;
    }

    & #signup-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      width: 100%;
    }
  }
`

customElements.define('signup-form', SignupForm)
