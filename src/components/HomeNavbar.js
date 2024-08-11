export default class HomeNavbar extends HTMLElement {
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
      <nav>
        <a href="/" data-internal-link>Home</a>
        <a href="/shop" data-internal-link>Shop</a>
        <a href="/product" data-internal-link>Product</a>
        <a href="/pages" data-internal-link>Pages</a>
        <a href="/about" data-internal-link>About</a>
      </nav>
    `
  }
}

const css = `
  nav {
    display: flex;
    gap: 32px;

    & a {
      text-decoration: none;
      color: var(--text-color-dark);
      font-size: 14px;
      transition: all 0.3s ease;

      &:hover {
        color: var(--primary-color);
      }
    }
  }
`

customElements.define('home-navbar', HomeNavbar)
