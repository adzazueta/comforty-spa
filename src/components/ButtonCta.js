export default class ButtonCta extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })

    this.props = {
      showArrow: false
    }

    this.arrowIcon = null
  }

  connectedCallback() {
    this.props.showArrow = this.hasAttribute('data-show-arrow') ?? false

    console.log(this.props)

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
      <button class="btn-cta" type="button">
        <slot></slot>
        ${this.arrowIcon ? this.arrowIcon.outerHTML : ''}
      </button>
    `
  }
}

const css = `
  .btn-cta {
    padding: 14px 24px;
    background-color: var(--primary-color);
    border-radius: var(--button-border-radius);
    border: var(--button-border);
    color: var(--text-color-light);
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background-color: var(--bg-color);
      color: var(--text-color-dark);
    }
  }
`

customElements.define('button-cta', ButtonCta)
