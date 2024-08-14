export default class ButtonLink extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })

    this._handleButtonClick = this._handleButtonClick.bind(this)
  }

  _handleButtonClick() {
    this.dispatchEvent(new Event('click'))
  }

  connectedCallback() {
    this.render()
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <button class="button-link">
        <slot></slot>
      </button>
    `

    const buttonLink = this.shadowRoot.querySelector('.button-link')
    buttonLink.addEventListener('click', this._handleButtonClick)
  }
}

const css = `
  :host {
    margin-bottom: 1px;

    & .button-link {
      background: transparent;
      border: none;
      color: var(--primary-color);
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      padding: 0;
      transition: all 0.3s ease;
  
      &:hover {
        color: var(--text-color-dark);
        font-weigth: 400;
      }
    }
  }
`

customElements.define('button-link', ButtonLink)
