import ComfortyLogo from '../assets/comforty-logo.svg'

export default class PageLogo extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    this.render()
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <a href="/" class="page-logo" data-internal-link>
        <img src="${ComfortyLogo}" alt="Conmforty Logo" />
        <p>Comforty</p>
      </a>
    `
  }
}

const css = `
  .page-logo {
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;

    & p {
      font-size: 24px;
      color: #272343;
      font-weight: 600;
      margin: 0;
    }
  }
`

customElements.define('page-logo', PageLogo)
