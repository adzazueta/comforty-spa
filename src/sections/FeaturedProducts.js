// Services
import Products from '../services/Products.js'

// Components
import '../components/TabSelector.js'
import '../components/ProductCard.js'

export default class FeautredProducts extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })

    this.state = {
      products: [],
      productsToRender: [],
      tabs: ['All', 'Newest', 'Trending', 'Best Sellers'],
      activeTab: 'all'
    }

    this.productsContainer = null

    this._handleUpdatedTab = this._handleUpdatedTab.bind(this)
    this._renderProducts = this._renderProducts.bind(this)
  }

  _handleUpdatedTab(event) {
    this.state.activeTab = event.detail.activeTab

    if (this.state.activeTab === 'all') {
      this.state.productsToRender = this.state.products.slice(0, 8)
    }

    if (this.state.activeTab === 'newest') {
      this.state.productsToRender = [...this.state.products]
        .sort((a, b) => a.updatedAt - b.updatedAt)
        .slice(0, 8)
    }

    if (this.state.activeTab === 'trending') {
      this.state.productsToRender = [...this.state.products]
        .sort((a, b) => a.rating - b.rating)  
        .slice(0, 8)
    }

    if (this.state.activeTab === 'best-sellers') {
      this.state.productsToRender = [...this.state.products]
        .sort((a, b) => a.sales - b.sales)  
        .slice(0, 8)
    }
    
    this._renderProducts()
  }

  _renderProducts() {
    while (this.productsContainer.firstChild) {
      this.productsContainer.removeChild(this.productsContainer.firstChild)
    }

    this.state.productsToRender.forEach((product) => {
      const productCard = document.createElement('product-card')
      productCard.setAttribute('data-product', JSON.stringify(product))

      this.productsContainer.appendChild(productCard)
    })
  }

  async connectedCallback() {
    this.state.products = await Products.getAllProducts()
    this.state.productsToRender = this.state.products.slice(0, 8)

    this.render()
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <section class="featured-products">
        <p class="title">Our Products</p>
        <tab-selector data-tabs='${JSON.stringify(this.state.tabs)}'></tab-selector>
        <div class="products-container"></div>
      </section>
    `
    const tabSelector = this.shadowRoot.querySelector('tab-selector')
    tabSelector.addEventListener('updatedtab', this._handleUpdatedTab)

    this.productsContainer = this.shadowRoot.querySelector('.products-container')
    this._renderProducts()
  }
}

const css = `
  :host {
    display: block;
    max-width: var(--content-wrapper-width);
    width: 100%;
    margin: 0 auto;

    & .featured-products {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      & .title {
        font-size: 28px;
        font-weight: 600;
        color: var(--text-color-dark);
      }

      & tab-selector {
        margin-bottom: 28px;
      }

      & .products-container {
        display: flex;
        align-items: center;
        justify-content: start;
        flex-wrap: wrap;
        width: 100%;
        margin-bottom: 32px;

        & product-card {
          flex-basis: 25%;
        }
      }
    }
  }
`

customElements.define('featured-products', FeautredProducts)
