// Router
import { navigateTo } from '../router/index.js'

// Services
import User from '../services/User.js'

// Components
import '../components/PageLogo.js'
import '../components/ButtonLink.js'

export default class AdminNavigation extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })

    this.state = {
      activeLink: 'products'
    }

    this.buttonLinks = []

    this._handleButtonLinkClick = this._handleButtonLinkClick.bind(this)
    this._handleSignOutClick = this._handleSignOutClick.bind(this)
  }

  _handleButtonLinkClick(event) {
    this.state.activeLink = event.target.id
    this.buttonLinks.forEach((btnLink) => {
      btnLink.removeEventListener('click', this._handleButtonLinkClick)
    })
    this.dispatchEvent(new CustomEvent('changepage', event.target.id))
    this.render()
  }

  async _handleSignOutClick() {
    try {
      await User.signOut()
      sessionStorage.removeItem('access-token')
      navigateTo('/')
    } catch(error) {
      console.error(error)
    }
  }

  _renderButtonLinks() {
    const linksToRender = [{ id: 'products', label: 'Products' }, { id: 'categories', label: 'Categories' }]
    const nav = document.createElement('nav')

    linksToRender.forEach((link) => {
      const buttonLink = document.createElement('button-link')
      buttonLink.id = link.id
      buttonLink.style.setProperty('--button-link-width', '100%')
      buttonLink.textContent = link.label
      buttonLink.setAttribute('data-admin-nav', '')
      
      if (link.id === this.state.activeLink) {
        buttonLink.setAttribute('data-active', '')
      }

      nav.appendChild(buttonLink)
    })

    return nav.outerHTML ?? ''
  }

  connectedCallback() {
    this.render()
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <page-logo></page-logo>
      ${this._renderButtonLinks()}
      <button-link style="--button-link-width: 100%;" class="sign-out" data-admin-nav>Sign Out</button-link>
    `

    this.buttonLinks = this.shadowRoot.querySelectorAll('nav button-link')
    this.buttonLinks.forEach((btnLink) => {
      btnLink.addEventListener('click', this._handleButtonLinkClick)
    })

    const signOutButton = this.shadowRoot.querySelector('.sign-out')
    signOutButton.addEventListener('click', this._handleSignOutClick)
  }
}

const css = `
  :host {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 24px 0;
    height: 100%;
    
    & nav {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }
  }
`

customElements.define('admin-navigation', AdminNavigation)
