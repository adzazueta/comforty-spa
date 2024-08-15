export default class ButtonLink extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })

    this.props = {
      isAdminNavItem: false,
      isActive: false
    }

    this._handleButtonClick = this._handleButtonClick.bind(this)
  }

  _handleButtonClick() {
    this.dispatchEvent(new Event('click'))
  }

  _renderAdminNavClasses() {
    let classes = ''

    if (this.props.isAdminNavItem) classes += 'admin-nav '
    if (this.props.isActive) classes += 'active'

    return classes
  }

  connectedCallback() {
    this.props.isAdminNavItem = this.hasAttribute('data-admin-nav')
    this.props.isActive = this.hasAttribute('data-active')

    this.render()
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <button
        class="button-link ${this._renderAdminNavClasses()}"
        type="button"
      >
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
    width: var(--button-link-width, unset);

    & .button-link {
      background: transparent;
      border: none;
      color: var(--primary-color);
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      padding: 0;
      transition: all 0.3s ease;

      &.admin-nav {
        font-size: 16px;
        padding: 16px 24px;
        background-color: var(--bg-accent);
        width: 100%;

        &:hover, &.active {
          font-weigth: 500;
          background-color: var(--primary-color);
          color: var(--text-color-light);
        }
      }
  
      &:hover {
        color: var(--text-color-dark);
        font-weigth: 400;
      }
    }
  }
`

customElements.define('button-link', ButtonLink)
