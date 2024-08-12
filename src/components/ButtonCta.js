import './icons/ArrowIcon.js'

export default class ButtonCta extends HTMLElement {
  static formAssociated = true

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this._internals = this.attachInternals()

    this.props = {
      type: '',
      showArrow: false
    }

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

    if (this.props.showArrow) {
      this.arrowIcon = document.createElement('span')
      this.arrowIcon.classList.add('arrow-icon')
      this.arrowIcon.innerHTML = '<arrow-icon></arrow-icon>'
    } else {
      this.arrowIcon = null
    }

    this.render()
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <button style="--padding-y: ${this.props.showArrow ? '8px' : '14px'};" class="btn-cta" type="${this.props.type}">
        <slot></slot>
        ${this.arrowIcon ? this.arrowIcon.outerHTML : ''}
      </button>
    `

    this.shadowRoot.querySelector('button').addEventListener('click', this._handleClick)
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

    &:hover {
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
