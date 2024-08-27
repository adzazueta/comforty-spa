// Router
import { navigateTo } from '../router/index.js'

// Services
import User from "../services/User.js"

// Components
import './ToastAlert.js'
import './ButtonCta.js'
import './CustomInput.js'

export default class SignupForm extends HTMLElement {
  static css = ``
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })

    this.form = null
    this.customInputs = []
    this.submitButton = null
    this.toastAlert = null

    this._handleSignupSubmit = this._handleSignupSubmit.bind(this)
    this._handleSubmitFromInputs = this._handleSubmitFromInputs.bind(this)
    this._checkFormValidity = this._checkFormValidity.bind(this)
  }

  async _handleSignupSubmit(event) {
    event.preventDefault()
    try {
      const formData = new FormData(event.target)
      await User.signUp(formData.get('name'), formData.get('email'), formData.get('password'))
      navigateTo('/admin/products')
    } catch (error) {
      this.toastAlert.showAlert('Signup failed. Please check your data or try again later.', 'error')
    }
  }

  _handleSubmitFromInputs() {
    this.shadowRoot.querySelector('#signup-form').requestSubmit()
  }

  _checkFormValidity() {
    const isFormValid = Array.from(this.customInputs).every((input) => input.checkValidity())
    if (isFormValid) this.submitButton.removeAttribute('data-disabled')
    else this.submitButton.setAttribute('data-disabled', '')
  }

  connectedCallback() {
    this.render()
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <toast-alert></toast-alert>
      <div class="card">
        <h1 class="title">Sign Up</h1>
        <form id="signup-form">
          <custom-input
            style="--custom-input-width: 100%;"
            name="name"
            data-type="text"
            data-label="Name"
            data-max-width="100%"
            data-required
          ></custom-input>
          <custom-input
            style="--custom-input-width: 100%;"
            name="email"
            data-type="email"
            data-label="Email"
            data-max-width="100%"
            data-required
          ></custom-input>
          <custom-input
            style="--custom-input-width: 100%;"
            name="password"
            data-type="password"
            data-label="Password"
            data-max-width="100%"
            data-required
          ></custom-input>
          <button-cta data-type="submit" data-show-arrow>
            Sign Up
          </button-cta>
          <slot name="extra-options"></slot>
        </form>
      </div>
    `

    this.form = this.shadowRoot.querySelector('#signup-form')
    this.customInputs = this.shadowRoot.querySelectorAll('custom-input')
    this.submitButton = this.shadowRoot.querySelector('button-cta')
    this.toastAlert = this.shadowRoot.querySelector('toast-alert')

    this.form.addEventListener('submit', this._handleSignupSubmit)
    this.customInputs.forEach((customInput) => {
      customInput.addEventListener('custominput', this._checkFormValidity)
      customInput.addEventListener('inputenter', this._handleSubmitFromInputs)
    })
    this.submitButton.addEventListener('click', this._handleSubmitFromInputs)

    this._checkFormValidity()
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
      gap: 4px;
      width: 100%;
    }
  }
`

customElements.define('signup-form', SignupForm)
