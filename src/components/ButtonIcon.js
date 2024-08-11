export default class ButtonIcon extends HTMLElement {
  static observedAttribites = ['data-badge']
  
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    
    this.props = {
      buttonText: '',
      buttonBagdeText: ''
    }

    this.badge = null
  }

  connectedCallback() {
    this.props.buttonText = this.getAttribute('data-text') ?? ''
    this.props.buttonBagdeText = this.getAttribute('data-badge') ?? ''

    if (this.props.buttonBagdeText) {
      this.badge = document.createElement('span')
      this.badge.classList.add('badge')
      this.badge.textContent = this.props.buttonBagdeText
    } else {
      this.badge = null
    }

    this.render()
  }

  attributeChangedCallback(attributeName, oldValue, newValue) {
    if (oldValue === newValue) return

    if (attributeName === 'data-badge') {
      this.props.buttonBagdeText = newValue
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <button class="btn" type="button" title="${this.props.buttonText}">
        <slot name="icon"></slot>
        ${this.props.buttonText}
        ${this.badge ? this.badge.outerHTML : ''}
      </button>
    `
  }
}

const css = `
  .btn {
    background-color: var(--bg-button);
    min-width: var(--icon-button-size);
    height: var(--icon-button-size);
    border: none;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 0 11px;
    font-size: 12px;
    transition: all 0.3s ease;
  }

  .btn .badge {
    background-color: var(--primary-color);
    border-radius: 100%;
    color: var(--text-color-light);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    font-size: 12px;
    transition: all 0.3s ease;
  }

  .btn:hover {
    background-color: var(--primary-color);
    color: var(--text-color-light);
  }

  .btn:hover .badge {
    background-color: var(--text-color-light);
    color: var(--primary-color);
  }
`

customElements.define('button-icon', ButtonIcon)
