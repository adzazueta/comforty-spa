export default class NewsletterForm extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })

    this._handleNewsletterSubmit = this._handleNewsletterSubmit.bind(this)
    this._handleSubmitFromInputs = this._handleSubmitFromInputs.bind(this)
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

    const submitButtom = this.shadowRoot.querySelector('button-cta')
    const emailInput = this.shadowRoot.querySelector('[name="newsletter-email"]')
    const newsletterForm = this.shadowRoot.querySelector('#newsletter-form')

    submitButtom.addEventListener('click', this._handleSubmitFromInputs)
    emailInput.addEventListener('inputenter', this._handleSubmitFromInputs)
    newsletterForm.addEventListener('submit', this._handleNewsletterSubmit)
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
    }
  }
`

customElements.define('newsletter-form', NewsletterForm)
