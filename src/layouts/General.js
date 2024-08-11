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
import '../components/ButtonCta.js'
import '../components/CustomInput.js'
import '../components/NewsletterForm.js'

export default class GeneralLayout extends HTMLElement {
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
      <header>
        <div class="wrapper">
          <page-logo></page-logo>
          <div class="user-links">
            <button-icon data-text="Cart" data-badge="0">
              <cart-icon slot="icon"></cart-icon>
            </button-icon>
            <button-icon>
              <user-icon slot="icon"></user-icon>
            </button-icon>
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
            <p class="footer-col-title">Category</p>
            <div class="footer-links">
              <a href="/" data-internal-link>Sofa</a>
              <a href="/shop" data-internal-link>Armchair</a>
              <a href="/shop" data-internal-link>Wing Chair</a>
              <a href="/shop" data-internal-link>Desk Chair</a>
              <a href="/shop" data-internal-link>Wooden Chair</a>
              <a href="/shop" data-internal-link>Park Bench</a>
            </div>
          </div>
          <div class="col">
            <p class="footer-col-title">Support</p>
            <div class="footer-links">
              <a href="/shop" data-internal-link>Help & Support</a>
              <a href="/shop" data-internal-link>Tearms & Conditions</a>
              <a href="/shop" data-internal-link>Privacy Policy</a>
              <a href="/shop" data-internal-link>Help</a>
            </div>
          </div>
          <div class="col">
            <newsletter-form></newsletter-form>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam tincidunt erat enim.</p>
          </div>
        </div>
      </footer>
    `
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
