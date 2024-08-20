// Components
import '../components/ButtonCta.js'

// Icons
import '../components/icons/PackageIcon.js'
import '../components/icons/DeliveryIcon.js'
import '../components/icons/FulltimeIcon.js'
import '../components/icons/ShieldIcon.js'

// Assets
import homeBannerImage from '../assets/home-banner.webp'

export default class HomeBannerSection extends HTMLElement {
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
      <section class="home-banner">
        <img src="${homeBannerImage}" alt="Home Banner Image" />
        <div class="banner-content">
          <h1 class="title">Welcome to Comforty</h1>
          <h2 class="subtitle">Best Furniture Collection For Your Interior.</h2>
          <button-cta data-show-arrow>Shop Now</button-cta>
        </div>
        <div class="benefits-card">
          <div class="item">
            <package-icon></package-icon>
            <div class="item-info">
              <p class="benefit-name">Discount</p>
              <p class="benefit-description">Every week new sales</p>
            </div>
          </div>
          <div class="item">
            <delivery-icon></delivery-icon>
            <div class="item-info">
              <p class="benefit-name">Free Delivery</p>
              <p class="benefit-description">100% Free for all orders</p>
            </div>
          </div>
          <div class="item">
            <fulltime-icon></fulltime-icon>
            <div class="item-info">
              <p class="benefit-name">Great Support 24/7</p>
              <p class="benefit-description">We care your experiences</p>
            </div>
          </div>
          <div class="item">
            <shield-icon></shield-icon>
            <div class="item-info">
              <p class="benefit-name">Secure Payment</p>
              <p class="benefit-description">100% Secure payment method</p>
            </div>
          </div>
        </div>
      </section>
    `
  }
}

const css = `
  :host {
    max-width: var(--content-wrapper-width);
    width: 100%;

    & .home-banner {
      display: flex;
      flex-direction: column;
      align-self: start;
      max-width: calc(var(--content-wrapper-width) + 150px);
      width: 100%;
      position: relative;
  
      & img {
        object-fit: cover;
        max-width: calc(var(--content-wrapper-width) + 150px);
        width: 100%;
      }
  
      & .banner-content {
        display: flex;
        flex-direction: column;
        align-items: start;
        color: var(--text-color-dark);
        position: absolute;
        left: 5%;
        top: 20%;
        z-index: 999;
  
        & .title {
          font-size: 14px;
          font-weight: 400;
          letter-spacing: 0.12em;
          margin: 0;
          margin-left: 4px;
          text-transform: uppercase;
        }
  
        & .subtitle {
          font-size: 54px;
          font-weight: 700;
          line-height: 1.25;
          margin: 0;
          width: 50%;
          padding-bottom: 16px;
        }
      }
  
      & .benefits-card {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        color: var(--text-color-dark);
        width: 80%;
        background-color: var(--bg-color);
        border-radius: var(--card-border-radius);
        box-shadow: var(--card-box-shadow);
        padding: 40px 70px;
        box-sizing: border-box;
        align-self: center;
        margin-top: -68px;
  
        & .item {
          display: flex;
          align-items: center;
          gap: 16px;
  
          & p {
            margin: 0;
            line-height: 110%;
  
            &.benefit-name {
              font-size: 16px;
              font-weight: 500;
            }
  
            &.benefit-description {
              font-size: 14px;
              font-weight: 400;
            }
          }
        }
      }
    }
  }
`

customElements.define('home-banner-section', HomeBannerSection)
