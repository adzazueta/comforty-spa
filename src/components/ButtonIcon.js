export default class ButtonIcon extends HTMLElement {
  static observedAttribites = ['data-badge']
  
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    
    this.props = {
      buttonText: '',
      buttonBagdeText: '',
      showBorder: false
    }

    this.button = null
    this.badge = null

    this._handleButtonClick = this._handleButtonClick.bind(this)
    this._renderBadge = this._renderBadge.bind(this)
  }

  _handleButtonClick() {
    this.dispatchEvent(new CustomEvent('internalclick'))
  }

  _renderBadge(resetBadge = false) {
    if (resetBadge) {
      this.button.removeChild(this.badge)
    }

    this.badge = document.createElement('span')
    this.badge.classList.add('badge')
    this.badge.textContent = this.props.buttonBagdeText
    this.button.appendChild(this.badge)
  }

  connectedCallback() {
    this.props.buttonText = this.getAttribute('data-text') ?? ''
    this.props.buttonBagdeText = this.getAttribute('data-badge') ?? ''
    this.props.showBorder = this.hasAttribute('data-show-border')

    this.render()
  }

  attributeChangedCallback(attributeName, oldValue, newValue) {
    if (oldValue === newValue) return

    if (attributeName === 'data-badge') {
      this.props.buttonBagdeText = newValue
      this._renderBadge(true)
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <button class="btn ${this.props.showBorder ? 'show-border' : ''}" type="button" title="${this.props.buttonText}">
        <slot name="icon"></slot>
        ${this.props.buttonText}
      </button>
    `

    this.button = this.shadowRoot.querySelector('.btn')
    this.button.addEventListener('click', this._handleButtonClick)

    if (this.props.buttonBagdeText) {
      this._renderBadge()
    }
  }
}

const css = `
  .btn {
    cursor: pointer;
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

    &.show-border {
      border: 1px solid var(--border-color);
    }

    &:hover {
      background-color: var(--primary-color);
      color: var(--text-color-light);

      & .badge {
        background-color: var(--text-color-light);
        color: var(--primary-color);
      }
    }

    & .badge {
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
  }
`

customElements.define('button-icon', ButtonIcon)
