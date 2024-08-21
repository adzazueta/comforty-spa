// Icons
import './icons/LeftArrowIcon.js'
import './icons/RightArrowIcon.js'

export default class ArrowButton extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })

    this.props = {
      arrowDirection: ''
    }

    this._handleButtonClick = this._handleButtonClick.bind(this)
  }

  _handleButtonClick() {
    if (this.props.arrowDirection === 'left') {
      this.dispatchEvent(new CustomEvent('leftbuttonclick'))
    } else {
      this.dispatchEvent(new CustomEvent('rightbuttonclick'))
    }
  }

  connectedCallback() {
    this.props.arrowDirection = this.getAttribute('data-arrow-direction') ?? 'right'

    this.render()
  }

  render() {
    const arrow = this.props.arrowDirection === 'left' 
      ? '<left-arrow-icon></left-arrow-icon>' 
      : '<right-arrow-icon></right-arrow-icon>'

    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <button>
        ${arrow}
      </button>
    `

    const button = this.shadowRoot.querySelector('button')
    button.addEventListener('click', this._handleButtonClick)
  }
}

const css = `
  :host {
    & button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--bg-accent);
      color: var(--text-color-dark);
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: var(--primary-color);
        color: var(--text-color-light);
      }
    }
  }
`

customElements.define('arrow-button', ArrowButton)
