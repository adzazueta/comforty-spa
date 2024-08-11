export default class ButtonCta extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })

    this.props = {
      text: '',
      showArrow: false
    }

    this.arrowIcon = null
  }

  connectedCallback() {
    this.props.text = this.getAttribute('data-text') ?? ''
    this.props.showArrow = this.getAttribute('data-show-arrow') ?? false

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
        ${this.props.text}
        ${this.arrowIcon ? this.arrowIcon.outerHTML : ''}
      </button>
    `
  }
}

const css = ``

customElements.define('button-cta', ButtonCta)
