export default class CustomInput extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })

    this.props = {
      type: 'text',
      name: '',
      label: ''
    }
  }

  connectedCallback() {
    this.props.type = this.getAttribute('data-type')
    this.props.name = this.getAttribute('data-name')
    this.props.label = this.getAttribute('data-label')

    this.render()
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <label class="custom-label" for=${this.props.name}>${this.props.label}</label>
      <input
        class="custom-input"
        type=${this.props.type}
        name=${this.props.name}
        placeholder=${this.props.label}
      />
    `
  }
}

const css = `
  .custom-label {
    display: none;
  }

  .custom-input {
    background-color var(--bg-color);
    padding: 14px;
    border-radius: var(--input-border-radius);
    border: var(--input-border);
    font-size: 16px;
    color: var(--input-text-color);
    transition: all 0.3s ease;
  }
`

customElements.define('custom-input', CustomInput)
