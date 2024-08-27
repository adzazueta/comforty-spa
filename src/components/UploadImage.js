export default class UploadImage extends HTMLElement {
  static formAssociated = true

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this._internals = this.attachInternals()

    this.props = {
      src: ''
    }

    this.img = null
    this.label = null
    this.input = null
    this.errorMessage = null

    this._handleInputChange = this._handleInputChange.bind(this)
    this._validateInput = this._validateInput.bind(this)
    this.checkValidity = this.checkValidity.bind(this)
  }

  _handleInputChange(event) {
    const inputValue = event.target.files[0]
    const errorMessage = this._validateInput()

    if (errorMessage) {
      this.label.classList.add('error')
      this.errorMessage.textContent = errorMessage
      this.errorMessage.style.display = 'block'
    } else {
      this.label.classList.remove('error')
      this.errorMessage.style.display = 'none'
    }

    if (event.target.files.length) {
      const src = URL.createObjectURL(inputValue)
      this.img.src = src
      this._internals.setFormValue(inputValue)

      this.dispatchEvent(new CustomEvent('custominput', {
        detail: { value: inputValue }
      }))
    }
  }

  _validateInput() {
    const inputFilesLength = this.input.files.length
    let errorMessage = ''

    if (this.props.required && !inputFilesLength) {
      errorMessage = 'The image is required.'
      this._internals.setValidity({ valueMissing: true }, errorMessage, this.input)
    }

    if (!errorMessage) {
      this._internals.setValidity({})
    }

    return errorMessage
  }

  checkValidity() {
    this._validateInput()
    return this._internals.checkValidity()
  }

  connectedCallback() {
    this.props.src = this.getAttribute('data-src') ?? 'https://fakeimg.pl/312x312?text=+'
    this.props.required = this.hasAttribute('data-required')

    this._internals.setFormValue(this.props.src)
    this.render()
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <img alt="Image Preview" src="${this.props.src}" width="250px" height="200px" />
      <label for="upload-image">Upload Image</label>
      <input
        id="upload-image"
        name="upload-image"
        type="file"
        accept="image/*"
        ${this.props.required ? 'required' : ''}
      />
      <span class="error-message"></span>
    `

    this.img = this.shadowRoot.querySelector('img')
    this.label = this.shadowRoot.querySelector('label')
    this.input = this.shadowRoot.querySelector('input')
    this.errorMessage = this.shadowRoot.querySelector('.error-message')

    this.input.addEventListener('change', this._handleInputChange)
  }
}

const css = `
  :host {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;

    & img {
      border-radius: var(--img-border-radius);
      object-fit: cover;
    }

    & label {
      background: transparent;
      border: none;
      color: var(--primary-color);
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      padding: 0;
      transition: all 0.3s ease;
      margin-bottom: 20px;

      &.error {
        margin-bottom: 0;
        border: var(--input-border-error);
      }

      &:hover {
        color: var(--text-color-dark);
        font-weigth: 400;
      }
    }
    
    & input {
      display: none;
    }
    
    & .error-message {
      display: none;
      color: red;
      font-size: 12px;
      font-weight: 500;
      color: var(--error-color);
      margin-top: 2px;
      text-align: center;
      padding-left: 14px;
      width: 100%;
      box-sizing: border-box;
    }
  }
`

customElements.define('upload-image', UploadImage)
