import './icons/RightArrowIcon.js'

export default class ButtonCta extends HTMLElement {
  static observedAttributes = ['data-disabled']
  static formAssociated = true

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this._internals = this.attachInternals()

    this.props = {
      type: '',
      showArrow: false
    }

    this.button = null
    this.arrowIcon = null

    this._handleClick = this._handleClick.bind(this)
  }

  _handleClick(event) {
    event.stopPropagation()
    this.dispatchEvent(new Event('click'))
  }

  connectedCallback() {
    this.props.type = this.getAttribute('data-type') ?? 'button'
    this.props.showArrow = this.hasAttribute('data-show-arrow') ?? false

    this.render()
  }

  attributeChangedCallback(attributeName, oldValue, newValue) {
    if (oldValue === newValue) return

    if (attributeName === 'data-disabled') {
      this.button.disabled = this.hasAttribute('data-disabled')
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <button style="--padding-y: ${this.props.showArrow ? '8px' : '14px'};" class="btn-cta" type="${this.props.type}">
        <slot></slot>
      </button>
    `

    this.button = this.shadowRoot.querySelector('button')

    if (this.props.showArrow) {
      const icon = document.createElement('right-arrow-icon')
      this.arrowIcon = document.createElement('span')
      this.arrowIcon.classList.add('arrow-icon')
      this.arrowIcon.appendChild(icon)
      this.button.appendChild(this.arrowIcon)
    }

    this.button.addEventListener('click', this._handleClick)
  }
}

const css = `
  .btn-cta {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: var(--padding-y, 14px) 24px;
    background-color: var(--primary-color);
    border-radius: var(--button-border-radius);
    border: var(--button-border);
    color: var(--text-color-light);
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    width: 100%;
    transition: all 0.3s ease;

    &[disabled] {
      cursor: default;
      opacity: 0.3;
    }

    &:hover:enabled {
      background-color: var(--bg-color);
      color: var(--text-color-dark);
      border: var(--input-border);
    }

    & .arrow-icon {
      margin-top: 2px;
    }
  }
`

customElements.define('button-cta', ButtonCta)
