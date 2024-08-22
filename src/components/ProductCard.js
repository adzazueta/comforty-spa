// Stores
import cartStore from '../stores/CartStore.js'

// Components
import './ButtonIcon.js'

// Icons
import './icons/CartIcon.js'
import './icons/MinusIcon.js'
import './icons/PlusIcon.js'

export default class ProductCard extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })

    this.prop = {
      product: null
    }

    this.state = {
      product: null
    }

    this.productInfoContainer = null
    this.cartButton = null

    this._handleAddToCartClick = this._handleAddToCartClick.bind(this)
    this._handleRemoveFromCartClick = this._handleRemoveFromCartClick.bind(this)
    this._renderActions = this._renderActions.bind(this)
  }

  _handleAddToCartClick() {
    if (this.state.product.amount === this.state.product.inventory) return

    cartStore.addItem(this.state.product)

    this.state.product = cartStore.items.find(
      (item) => item.uuid === this.state.product.uuid
    ) ?? JSON.parse(this.getAttribute('data-product'))

    this._renderActions()
  }

  _handleRemoveFromCartClick() {
    cartStore.removeItem(this.state.product.uuid)

    this.state.product = cartStore.items.find(
      (item) => item.uuid === this.state.product.uuid
    ) ?? JSON.parse(this.getAttribute('data-product'))

    this._renderActions()
  }

  _renderActions() {
    const { product } = this.state
    
    if (product.amount) {
      if (this.cartButton) {
        this.productInfoContainer.removeChild(this.cartButton)
        this.cartButton = null
      }

      if (this.counter) {
        const amount = this.counter.querySelector('span')
        amount.textContent = product.amount
      } else {
        const minusIcon = document.createElement('minus-icon')
        minusIcon.setAttribute('slot', 'icon')
        const removeButton = document.createElement('button-icon')
        removeButton.appendChild(minusIcon)
        removeButton.onclick = this._handleRemoveFromCartClick
  
        const amount = document.createElement('span')
        amount.textContent = product.amount
  
        const plusIcon = document.createElement('plus-icon')
        plusIcon.setAttribute('slot', 'icon')
        const addButton = document.createElement('button-icon')
        addButton.appendChild(plusIcon)
        addButton.onclick = this._handleAddToCartClick
  
        this.counter = document.createElement('div')
        this.counter.classList.add('counter')
        this.counter.appendChild(removeButton)
        this.counter.appendChild(amount)
        this.counter.appendChild(addButton)
  
        this.productInfoContainer.appendChild(this.counter)
      }
    } else {
      if (this.counter) {
        this.productInfoContainer.removeChild(this.counter)
        this.counter = null
      }

      const cartIcon = document.createElement('cart-icon')
      cartIcon.setAttribute('slot', 'icon')

      this.cartButton = document.createElement('button-icon')
      this.cartButton.appendChild(cartIcon)
      this.cartButton.onclick = this._handleAddToCartClick

      this.productInfoContainer.appendChild(this.cartButton)
    }
  }

  connectedCallback() {
    this.prop.product = JSON.parse(this.getAttribute('data-product'))
    this.state.product = cartStore.items.find((item) => item.uuid === this.prop.product.uuid) ?? this.prop.product

    this.render()
  }

  render() {
    const { product } = this.state

    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <div class="product-card-container">
        <img alt="${product.name} image" src="${product.image}" />
        <div class="product-info-container">
          <div class="product-info">
            <p class="name">${product.name}</p>
            <span class="price">$${product.price}</span>
          </div>
          <div class="counter"></div>
        </div>
      </div>
    `

    this.productInfoContainer = this.shadowRoot.querySelector('.product-info-container')
    this._renderActions()
  }
}

const css = `
  :host {
    border-radius: var(--card-border-radius);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;

    & .product-card-container {
      box-sizing: boder-box;
      padding: 8px;
      scale: 0.95;
      transition: all 0.3s ease;
    
      &:hover {
        scale: 1;

        & p.name {
          color: var(--primary-color);
        }
      }
      
      & img {
        width: 100%;
        height: 312px;
        border-radius: var(--card-border-radius);
        object-fit: cover;
      }
  
      & .product-info-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
  
        & p, & span {
          margin: 0;
          color: var(--text-color-dark);
          transition: all 0.3s ease;

          &.name {
            font-size: 16px;
          }

          &.price {
            font-size: 18px;
            font-weight: 600;
          }
        }

        & .counter {
          display: flex;
          align-items: center;
          gap: 8px;

          & span {
            color: var(--text-color-dark);
            font-size: 18px;
            font-weight: 600;
            transition: all 0.3s ease;
          }
        }
      }
    }
  }
`

customElements.define('product-card', ProductCard)
