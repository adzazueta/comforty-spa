// Services
import User from '../services/User.js'

// Components
import '../components/AdminNavigation.js'

export default class AdminLayout extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })

    this.state = {
      userName: ''
    }
  }

  connectedCallback() {
    this.state.userName = User.getUserData()?.displayName
    this.render()
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <main>
        <aside class="menu-wrapper">
          <admin-navigation></admin-navigation>
        </aside>
        <section class="view-wrapper">
          <div class="user-info">
            <p>Hello, ${this.state.userName}!</p>
          </div>
          <slot></slot>
        </section>
      </main>
    `
  }
}

const css = `
  main {
    display: flex;
    min-height: 100vh;

    & .menu-wrapper {
      width: 250px;
      background-color: var(--bg-accent);
    }

    & .view-wrapper {
      width: calc(100% - 250px);
      background-color: var(--bg-color);

      & .user-info {
        background-color: var(--bg-accent);
        text-align: right;
        padding: 16px 24px;

        & p {
          margin: 0;
        }
      }
    }
  }
`

customElements.define('admin-layout', AdminLayout)
