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
      value: ''
    }

    this.customSelect = null

    this._renderOptions = this._renderOptions.bind(this)
    this._handleSelectChange = this._handleSelectChange.bind(this)
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
  }

  _handleSelectChange(event) {
    this._internals.setFormValue(event.target.value)
  }

  connectedCallback() {
    this.props.options = JSON.parse(this.getAttribute('data-options')) ?? []
    this.props.name = this.getAttribute('name') ?? 'custom-select'
    this.props.label = this.getAttribute('data-label') ?? 'Input your data'
    this.props.maxWidth = this.getAttribute('data-max-width') ?? '285px'
    this.props.value = this.getAttribute('data-value') ?? ''

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
      >
        <option value="" disabled selected>${this.props.label}</option>
      </select
    `
    this.customSelect = this.shadowRoot.querySelector('.custom-select')
    this._renderOptions()

    this.customSelect.addEventListener('change', this._handleSelectChange)
  }
}

const css = `
  :host {
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

      &:focus-visible {
        outline: var(--input-border-radius) auto 1px;
      }

      &::placeholder {
        color: var(--input-text-color);
      }
    }
  }
`

customElements.define('custom-select', CustomSelect)
