// Layout
import '../layouts/GeneralLayout.js'

// Components
import '../components/LoginForm.js'
import '../components/SignupForm.js'
import '../components/ButtonLink.js'

export default class LoginView extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })

    this.state = {
      showLogin: true
    }

    this.buttonLink = null
    this._handleButtonLinkClick = this._handleButtonLinkClick.bind(this)
  }

  connectedCallback() {
    this.render()
  }

  _handleButtonLinkClick() {
    this.state.showLogin = !this.state.showLogin
    this.buttonLink.removeEventListener('click', this._handleButtonLinkClick)
    this.render()
  }

  _renderLoginForm() {
    return `
      <login-form>
        <div class="extra-options" slot="extra-options">
          <p>Don't have an account?</p>
          <button-link>Sign Up</button-link>
        </div>
      </login-form>
    `
  }

  _renderSignUpForm() {
    return `
      <signup-form>
        <div class="extra-options" slot="extra-options">
          <p>Already have an account?</p>
          <button-link>Login</button-link>
        </div>
      </signup-form>
    `
  }

  render() {
    const { showLogin } = this.state

    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <general-layout>
        <section class="login-section">
          ${showLogin ? this._renderLoginForm() : this._renderSignUpForm()}
        </section>
      </general-layout>
    `

    this.buttonLink = this.shadowRoot.querySelector('button-link')
    this.buttonLink.addEventListener('click', this._handleButtonLinkClick)
  }
}

const css = `
  .login-section {
    margin-top: 64px;
    margin-bottom: 92px;
    width: 100vw;

    & .extra-options {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;

      & p {
        font-size: 14px;
        margin: 0;
      }
    }
  }
`

customElements.define('login-view', LoginView)
