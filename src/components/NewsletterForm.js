// Components
import '../components/ButtonCta.js'
import '../components/CustomInput.js'

export default class NewsletterForm extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })

    this.newsletterForm = null
    this.emailInput = null
    this.submitButton = null

    this._handleNewsletterSubmit = this._handleNewsletterSubmit.bind(this)
    this._handleSubmitFromInputs = this._handleSubmitFromInputs.bind(this)
    this._checkFormValidity = this._checkFormValidity.bind(this)
  }

  _handleNewsletterSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.target)
    const email = formData.get('newsletter-email')
    console.log('Email entered:', email)
  }

  _handleSubmitFromInputs() {
    this.shadowRoot.querySelector('#newsletter-form').requestSubmit()
  }

  _checkFormValidity() {
    const isFormValid = this.emailInput.checkValidity()
    if (isFormValid) this.submitButton.removeAttribute('data-disabled')
    else this.submitButton.setAttribute('data-disabled', '')
  }

  connectedCallback() {
    this.render()
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <p class="newsletter-title">Newsletter</p>
      <form id="newsletter-form">
        <custom-input name="newsletter-email" data-type="email" data-label="Your email"></custom-input>
        <button-cta data-type="submit">
          Subscribe
        </button-cta>
      </form>
    `

    this.newsletterForm = this.shadowRoot.querySelector('#newsletter-form')
    this.emailInput = this.shadowRoot.querySelector('[name="newsletter-email"]')
    this.submitButton = this.shadowRoot.querySelector('button-cta')

    this.newsletterForm.addEventListener('submit', this._handleNewsletterSubmit)
    this.emailInput.addEventListener('custominput', this._checkFormValidity)
    this.emailInput.addEventListener('inputenter', this._handleSubmitFromInputs)
    this.submitButton.addEventListener('click', this._handleSubmitFromInputs)

    this._checkFormValidity()
  }
}

const css = `
  :host {
    & .newsletter-title {
      margin-top: 0;
      margin-bottom: 24px;
      font-size: 14px;
      letter-spacing: 2px;
      color: var(--text-color-dark);
      opacity: 0.6;
      text-transform: uppercase;
    }

    & #newsletter-form {
      display: flex;
      align-items: center;
      gap: 8px;

      & button-cta {
        margin-bottom: 20px;
      }
    }
  }
`

customElements.define('newsletter-form', NewsletterForm)
