export default class CustomSelect extends HTMLElement {
  static formAssociated = true
  static observedAttributes = ['data-options']

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this._internals = this.attachInternals()

    this.props = {
      options: [],
      name: '',
      label: '',
      maxWidth: '',
      value: '',
      required: false
    }

    this.customSelect = null
    this.errorMessage = null

    this._renderOptions = this._renderOptions.bind(this)
    this._handleSelectChange = this._handleSelectChange.bind(this)
    this._validateSelect = this._validateSelect.bind(this)
    this.checkValidity = this.checkValidity.bind(this)
  }

  _renderOptions() {
    while (this.customSelect.firstChild) {
      this.customSelect.removeChild(this.customSelect.firstChild)
    }

    if (!this.props.value) {
      const placeholderOption = document.createElement('option')
      placeholderOption.setAttribute('disabled', '')
      placeholderOption.setAttribute('selected', '')
      placeholderOption.value = ''
      placeholderOption.textContent = this.props.label
      this.customSelect.appendChild(placeholderOption)
    }

    this.props.options.forEach((option) => {
      const optionElement = document.createElement('option')
      optionElement.value = option.value
      optionElement.textContent = option.label

      if (option.value === this.props.value) {
        optionElement.setAttribute('selected', '')
      }

      this.customSelect.appendChild(optionElement)
    })

    this.customSelect.value = this.props.value
    this.dispatchEvent(new CustomEvent('initializedoptions'))
  }

  _handleSelectChange(event) {
    const selectValue = event.target.value
    const errorMessage = this._validateSelect()

    if (errorMessage) {
      this.customSelect.classList.add('error')
      this.errorMessage.textContent = errorMessage
      this.errorMessage.style.display = 'block'
    } else {
      this.customSelect.classList.remove('error')
      this.errorMessage.style.display = 'none'
    }

    this._internals.setFormValue(selectValue)
    this.dispatchEvent(new CustomEvent('customchange', {
      detail: { value: selectValue }
    }))
  }

  _validateSelect() {
    const selectValue = this.customSelect.value
    let errorMessage = ''

    if (this.props.required && (!selectValue.trim() || selectValue === this.props.label)) {
      errorMessage = 'This field is required.'
      this._internals.setValidity({ valueMissing: true }, errorMessage, this.customSelect)
    }

    if (!errorMessage) {
      this._internals.setValidity({})
    }

    return errorMessage
  }

  checkValidity() {
    this._validateSelect()
    return this._internals.checkValidity()
  }

  connectedCallback() {
    this.props.options = JSON.parse(this.getAttribute('data-options')) ?? []
    this.props.name = this.getAttribute('name') ?? 'custom-select'
    this.props.label = this.getAttribute('data-label') ?? 'Input your data'
    this.props.maxWidth = this.getAttribute('data-max-width') ?? '285px'
    this.props.value = this.getAttribute('data-value') ?? ''
    this.props.required = this.hasAttribute('data-required')

    this._internals.setFormValue(this.props.value)
    this.render()
  }

  attributeChangedCallback(attributeName, oldValue, newValue) {
    if (oldValue === newValue) return

    if (attributeName === 'data-options') {
      this.props.options = JSON.parse(newValue)
      this._renderOptions()
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <label class="custom-label" for="${this.props.name}">${this.props.label}</label>
      <select
        class="custom-select"
        style="--custom-select-width: ${this.props.maxWidth};"
        name="${this.props.name}"
        placeholder="${this.props.label}"
        value="${this.props.value}"
        ${this.props.required ? 'required' : ''}
      >
        <option value="" disabled selected>${this.props.label}</option>
      </select>
      <span class="error-message"></span>
    `
    this.customSelect = this.shadowRoot.querySelector('.custom-select')
    this.errorMessage = this.shadowRoot.querySelector('.error-message')

    this._renderOptions()

    this.customSelect.addEventListener('change', this._handleSelectChange)
  }
}

const css = `
  :host {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &, .custom-select {
      display: flex;
      flex-grow: 1;
      max-width: var(--custom-select-width, 285px);
      width: 100%;
    }

    & .custom-label {
      display: none;
    }

    & .custom-select {
      background-color var(--bg-color);
      padding: 14px;
      border-radius: var(--input-border-radius);
      border: var(--input-border);
      font-size: 16px;
      transition: all 0.3s ease;
      margin-bottom: 20px;
      appearance: none;
      background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"/></svg>') no-repeat right 10px center;

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

customElements.define('custom-select', CustomSelect)
