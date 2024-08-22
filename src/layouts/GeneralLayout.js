// Utils
import pubSub from '../utils/PubSub.js'

// Stores
import cartStore from '../stores/CartStore.js'

// Services
import Categories from '../services/Categories.js'

// Icons
import '../components/icons/UserIcon.js'
import '../components/icons/CartIcon.js'
import '../components/icons/FacebookIcon.js'
import '../components/icons/TwitterIcon.js'
import '../components/icons/InstagramIcon.js'
import '../components/icons/PinterestIcon.js'
import '../components/icons/YoutubeIcon.js'

// Components
import '../components/PageLogo.js'
import '../components/ButtonIcon.js'
import '../components/HomeNavbar.js'
import '../components/SocialMediaLink.js'
import '../components/NewsletterForm.js'

export default class GeneralLayout extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })

    this.state = {
      categories: []
    }

    this.cartButton = null
    this.categoryLinksContainer = null

    this._handleCartStoreChange = this._handleCartStoreChange.bind(this)
    this._renderCategoryLinks = this._renderCategoryLinks.bind(this)
  }

  _handleCartStoreChange() {
    this.cartButton.setAttribute('data-badge', cartStore.totalItems)
  }

  _renderCategoryLinks() {
    this.state.categories.forEach((category) => {
      const link = document.createElement('a')
      link.setAttribute('href', `/shop/${category.code}`)
      link.setAttribute('data-internal-link', '')
      link.textContent = category.name

      this.categoryLinksContainer.appendChild(link)
    })
  }

  async connectedCallback() {
    pubSub.subscribe('cartStoreChange', this._handleCartStoreChange)
    this.state.categories = await Categories.getAllCategories()

    this.render()
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <header>
        <div class="wrapper">
          <page-logo></page-logo>
          <div class="user-links">
            <button-icon id="cart" data-text="Cart" data-badge="${cartStore.totalItems}">
              <cart-icon slot="icon"></cart-icon>
            </button-icon>
            <a href="/admin" data-internal-link>
              <button-icon>
                <user-icon slot="icon"></user-icon>
              </button-icon>
            </a>
          </div>
        </div>
        <div class="nav">
          <div class="wrapper">
            <home-navbar></home-navbar>
          </div>
        </div>
      </header>
      <main>
        <slot></slot>
      </main>
      <footer>
        <div class="wrapper">
          <div class="col">
            <page-logo></page-logo>
            <p>Vivamus tristique odio sit amet velit semper, eu posuere turpis interdum. Cras egestas purus</p>
            <div class="social-media-container">
              <social-media-link data-href="https://facebook.com">
                <facebook-icon slot="icon"></facebook-icon>
              </social-media-link>
              <social-media-link data-href="https://x.com">
                <twitter-icon slot="icon"></twitter-icon>
              </social-media-link>
              <social-media-link data-href="https://instagram.com">
                <instagram-icon slot="icon"></instagram-icon>
              </social-media-link>
              <social-media-link data-href="https://pinterest.com">
                <pinterest-icon slot="icon"></-icon>
              </social-media-link>
              <social-media-link data-href="https://youtube.com">
                <youtube-icon slot="icon"></youtube-icon>
              </social-media-link>
            </div>
          </div>
          <div class="col">
            <p class="footer-col-title">Categories</p>
            <div class="footer-links category-links"></div>
          </div>
          <div class="col">
            <p class="footer-col-title">Pages</p>
            <div class="footer-links">
              <a href="/" data-internal-link>Home</a>
              <a href="/shop" data-internal-link>Shop</a>
              <a href="/admin" data-internal-link>Admin</a>
              <a href="/login" data-internal-link>Login</a>
            </div>
          </div>
          <div class="col">
            <newsletter-form></newsletter-form>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam tincidunt erat enim.</p>
          </div>
        </div>
      </footer>
    `

    this.cartButton = this.shadowRoot.querySelector('#cart')
    this.categoryLinksContainer = this.shadowRoot.querySelector('.category-links')
    this._renderCategoryLinks()
  }
}

const css = `
  :host {
    margin: 0 auto;

    & header {
      background-color: var(--bg-accent);

      & .wrapper {
        justify-content: space-between;
      }
    }
    
    & .nav {
      background-color: var(--bg-color);
    }

    & .wrapper {
      display: flex;
      flex-wrap: wrap;
      margin: 0 auto;
      max-width: var(--content-wrapper-width);
      padding: 16px 32px;

      & .user-links {
        display: flex;
        gap: 12px;
      }
    }

    & main {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: calc(100% - 477px);
      width: 100%;
    }

    & footer {
      background-color: var(--bg-accent);

      & .wrapper {
        gap: 32px;

        & .col {
          display: flex;
          flex-direction: column;
          justify-content: start;
          flex-basis: fit-content;
          flex-grow: 1;
          padding: 32px 0;
          gap: 24px;
          
          & p {
            color: var(--text-color-dark);
            font-size: 16px;
            margin: 0;
            opacity: 0.6;
          }
          
          &:first-of-type {
            justify-content: center;
          }

          &:first-of-type,
          &:last-of-type {
            flex-basis: 25%;
          }
        }
      }
      
      & .social-media-container {
        display: flex;
        gap: 16px;
      }

      & .footer-col-title {
        font-size: 14px;
        letter-spacing: 2px;
        color: var(--text-color-dark);
        opacity: 0.6;
        text-transform: uppercase;
      }

      & .footer-links {
        display: flex;
        flex-direction: column;
        gap: 12px;

        & a {
          font-size: 16px;
          color: var(--text-color-dark);
          text-decoration: none;
          transition: all 0.3s ease;
          width: fit-content;

          &:hover {
            color: var(--primary-color);
          }
        }
      }
    }
  }
`

customElements.define('general-layout', GeneralLayout)
