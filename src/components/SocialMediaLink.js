export default class SocialMediaLink extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })

    this.props = {
      href: ''
    }
  }

  connectedCallback() {
    this.props.href = this.getAttribute('data-href')

    this.render()
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <a class="social-media-link" href="${this.props.href}" target="__blank">
        <slot name="icon"></slot>
      </a>
    `
  }
}

const css = `
  .social-media-link {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    color: var(--text-color-dark);
    opacity: 0.6;
    transition: all 0.3s ease;
  }

  .social-media-link:hover {
    color: var(--primary-color);
    opacity: 1;
  }
`

customElements.define('social-media-link', SocialMediaLink)
