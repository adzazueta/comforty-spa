export default class CustomInput extends HTMLElement {
  static formAssociated = true

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this._internals = this.attachInternals()

    this.props = {
      type: '',
      name: '',
      label: '',
      maxWidth: '',
      accept: '',
      value: '',
      required: false
    }

    this.customInput = null
    this.errorMessage = null

    this._handleBeforeInputEvent = this._handleBeforeInputEvent.bind(this)
    this._handleInputEvent = this._handleInputEvent.bind(this)
    this._validateInput = this._validateInput.bind(this)
    this.checkValidity = this.checkValidity.bind(this)
  }

  _handleBeforeInputEvent(event) {
    if (event.inputType === 'insertLineBreak') {
      event.preventDefault()
      this.dispatchEvent(new CustomEvent('inputenter'))
    }
  }

  _handleInputEvent(event) {
    if (this.props.type === 'file') {
      this._internals.setFormValue(event.target.files[0])
      this.dispatchEvent(new CustomEvent('custominput', {
        detail: { value: event.target.files[0] }
      }))
      return
    }

    const inputValue = event.target.value
    const errorMessage = this._validateInput()

    if (errorMessage) {
      this.customInput.classList.add('error')
      this.errorMessage.textContent = errorMessage
      this.errorMessage.style.display = 'block'
    } else {
      this.customInput.classList.remove('error')
      this.errorMessage.style.display = 'none'
    }

    this._internals.setFormValue(inputValue)
    this.dispatchEvent(new CustomEvent('custominput', {
      detail: { value: inputValue }
    }))
  }

  _validateInput() {
    const inputValue = this.customInput.value
    let errorMessage = ''

    if (this.props.required && !inputValue.trim()) {
      errorMessage = 'This field is required.'
      this._internals.setValidity({ valueMissing: true }, errorMessage, this.customInput)
    }

    if (this.props.type === 'email' && !this._isValidEmail(inputValue)) {
      errorMessage = 'Please enter a valid email.'
      this._internals.setValidity({ customError: true }, errorMessage, this.customInput)
    }

    if (!errorMessage) {
      this._internals.setValidity({})
    }

    return errorMessage
  }

  _isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailPattern.test(email)
  }

  checkValidity() {
    this._validateInput()
    return this._internals.checkValidity()
  }

  connectedCallback() {
    this.props.name = this.getAttribute('name') ?? 'custom-input'
    this.props.type = this.getAttribute('data-type') ?? 'text'
    this.props.label = this.getAttribute('data-label') ?? 'Input your data'
    this.props.maxWidth = this.getAttribute('data-max-width') ?? '285px'  
    this.props.accept = this.getAttribute('data-accept') ?? ''
    this.props.value = this.getAttribute('data-value') ?? ''
    this.props.required = this.hasAttribute('data-required')

    this._internals.setFormValue(this.props.value)
    this.render()
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <label class="custom-label" for="${this.props.name}">${this.props.label}</label>
      <input
        class="custom-input"
        style="--custom-input-width: ${this.props.maxWidth};"
        type="${this.props.type}"
        ${this.props.accept ? 'accept="'+this.props.accept+'"' : ''}
        name="${this.props.name}"
        placeholder="${this.props.label}"
        value="${this.props.value}"
        ${this.props.required ? 'required' : ''}
      />
      <span class="error-message"></span>
    `
    this.customInput = this.shadowRoot.querySelector('.custom-input')
    this.errorMessage = this.shadowRoot.querySelector('.error-message')

    this.customInput.addEventListener('beforeinput', this._handleBeforeInputEvent)
    this.customInput.addEventListener('input', this._handleInputEvent)
  }
}

const css = `
  :host {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &, .custom-input {
      display: flex;
      flex-grow: 1;
      max-width: var(--custom-input-width, 285px);
      width: 100%;
      box-sizing: border-box;
    }

    & .custom-label {
      display: none;
    }

    & .custom-input {
      background-color var(--bg-color);
      padding: 14px;
      border-radius: var(--input-border-radius);
      border: var(--input-border);
      font-size: 16px;
      margin-bottom: 20px;

      &.error {
        margin-bottom: 0;
        border: var(--input-border-error);
      }

      &:focus-visible {
        outline: var(--input-border-radius) auto 1px;
      }

      &::placeholder {
        color: var(--input-text-color);
      }
    }

    & .error-message {
      display: none;
      color: red;
      font-size: 12px;
      font-weight: 500;
      color: var(--error-color);
      margin-top: 2px;
      text-align: left;
      padding-left: 14px;
      width: 100%;
      box-sizing: border-box;
    }
  }
`

customElements.define('custom-input', CustomInput)
