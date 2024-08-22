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
        <a href="/admin" data-internal-link>Admin</a>
        <a href="/login" data-internal-link>Login</a>
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
