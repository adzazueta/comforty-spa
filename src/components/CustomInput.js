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
      value: ''
    }

    this._handleBeforeInputEvent = this._handleBeforeInputEvent.bind(this)
    this._handleInputEvent = this._handleInputEvent.bind(this)
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
    } else {
      this._internals.setFormValue(event.target.value)
    }
  }

  connectedCallback() {
    this.props.name = this.getAttribute('name') ?? 'custom-input'
    this.props.type = this.getAttribute('data-type') ?? 'text'
    this.props.label = this.getAttribute('data-label') ?? 'Input your data'
    this.props.maxWidth = this.getAttribute('data-max-width') ?? '285px'
    this.props.accept = this.getAttribute('data-accept') ?? ''
    this.props.value = this.getAttribute('data-value') ?? ''

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
      />
    `
    const customInput = this.shadowRoot.querySelector('.custom-input')
    customInput.addEventListener('beforeinput', this._handleBeforeInputEvent)
    customInput.addEventListener('input', this._handleInputEvent)
  }
}

const css = `
  :host {
    &, .custom-input {
      display: flex;
      flex-grow: 1;
      max-width: var(--custom-input-width, 285px);
      width: 100%;
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
      transition: all 0.3s ease;

      &:focus-visible {
        outline: var(--input-border-radius) auto 1px;
      }

      &::placeholder {
        color: var(--input-text-color);
      }
    }
  }
`

customElements.define('custom-input', CustomInput)
