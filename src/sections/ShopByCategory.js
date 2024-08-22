// Services
import Products from '../services/Products.js'
import Categories from '../services/Categories.js'

// Components
import '../components/TabSelector.js'
import '../components/ProductCard.js'

export default class ShopByCategory extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })

    this.state = {
      products: [],
      productsToRender: [],
      tabs: [],
      activeTab: 'all'
    }

    this.productsContainer = null

    this._setProductsToRender = this._setProductsToRender.bind(this)
    this._handleUpdatedTab = this._handleUpdatedTab.bind(this)
    this._renderProducts = this._renderProducts.bind(this)
  }

  _setProductsToRender() {
    if (this.state.activeTab === 'all') {
      this.state.productsToRender = this.state.products
    } else {
      for (let tab of this.state.tabs) {
        if (tab.value === this.state.activeTab) {
          this.state.productsToRender = this.state.products.filter((product) => product.category === tab.value)
          break
        }
      }
    }
  }

  _handleUpdatedTab(event) {
    this.state.activeTab = event.detail.activeTab
    this._setProductsToRender()
    this._renderProducts()
  }

  _renderProducts() {
    while (this.productsContainer.firstChild) {
      this.productsContainer.removeChild(this.productsContainer.firstChild)
    }

    if (this.state.productsToRender.length) {
      this.state.productsToRender.forEach((product) => {
        const productCard = document.createElement('product-card')
        productCard.setAttribute('data-product', JSON.stringify(product))
  
        this.productsContainer.appendChild(productCard)
      })
    } else {
      const noProductsLegend = document.createElement('p')
      noProductsLegend.classList.add('no-products')
      noProductsLegend.textContent = 'We have no products in this category at this time :('

      this.productsContainer.appendChild(noProductsLegend)
    }
  }

  async connectedCallback() {
    const categories = await Categories.getAllCategories()
    this.state.tabs = [
      { value: 'all', label: 'All' },
      ...categories.map((category) => ({ value: category.code, label: category.name }))
    ]
    
    this.state.activeTab = this.getAttribute('data-initial-category') ?? 'all'
    this.state.products = await Products.getAllProducts()

    this._setProductsToRender()
    this.render()
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <section class="featured-products">
        <p class="title">Our Products</p>
        <tab-selector
          data-tabs='${JSON.stringify(this.state.tabs)}'
          data-initial-tab="${this.state.activeTab}"
        ></tab-selector>
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

        & .no-products {
          flex-grow: 1;
          text-align: center;
          font-size: 28px;
          font-weight: 500;
          color: var(--primary-color);
          margin: 0;
          height: 385px;
        }
      }
    }
  }
`

customElements.define('shop-by-category', ShopByCategory)
