// Services
import Products from '../services/Products.js'

// Components
import './ButtonCta.js'

// Icons
import './icons/CloseIcon.js'

export default class RemoveProductDialog extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.props = {
      productToRemove: {}
    }

    this.dialog = null
    this.form = null

    this._handleRemoveProduct = this._handleRemoveProduct.bind(this)
    this._handleCloseButtonClick = this._handleCloseButtonClick.bind(this)
    this._handleSubmitFromInputs = this._handleSubmitFromInputs.bind(this)
  }

  _handleRemoveProduct(event) {
    event.preventDefault()
    try {
      Products.removeProduct(this.props.productToRemove.uuid)
    } catch (error) {
      throw new Error(error)
    } finally {
      this.dialog.close()
      this.dispatchEvent(new CustomEvent('removedproduct', {
        detail: { action: 'remove' }
      }))
    }
  }
  _handleCloseButtonClick() {
    this.dialog.close()
    this.dispatchEvent(new CustomEvent('closedialog', {
      detail: { action: 'remove' }
    }))
  }

  _handleSubmitFromInputs() {
    this.form.requestSubmit()
  }

  connectedCallback() {
    this.props.productToRemove = JSON.parse(this.getAttribute('data-product-to-remove'))

    this.render()
  }

  showModal() {
    this.dialog.showModal()
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <dialog>
        <div class="close-button-container">
          <close-icon></close-icon>
        </div>
        <form>
          <p class="title">Remove Product</p>
          <p class="description">Are you sure you want to remove ${this.props.productToRemove.name}?</p>
          <button-cta data-type="submit" >
            Remove Product
          </button-cta>
        </form>
      </dialog>
    `

    this.dialog = this.shadowRoot.querySelector('dialog')
    this.form = this.shadowRoot.querySelector('form')
    const closeButton = this.shadowRoot.querySelector('close-icon')
    const submitButton = this.shadowRoot.querySelector('button-cta')

    this.form.addEventListener('submit', this._handleRemoveProduct)
    closeButton.addEventListener('click', this._handleCloseButtonClick)
    submitButton.addEventListener('click', this._handleSubmitFromInputs)
  }
}

const css = `
  dialog {
    left: 250px;
    width: 648px;
    border-radius: var(--card-border-radius);
    box-shadow: var(--card-box-shadow);
    border: none;
    pediting: 24px 48px;
    box-sizing: border-box;
    scale: 0;

    &[open] {
      scale: 1;
      transition: scale 0.3s ease;

      @starting-style {
        scale: 0;
      }
    }

    & .close-button-container {
      display: flex;
      justify-content: end;
      color: var(--text-color-dark);

      & close-icon {
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          color: var(--primary-color);
        }
      }
    }

    & form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    & .title {
      text-align: center;
      font-size: 26px;
      margin: 0;
    }
    
    & .description {
      text-align: center;
      font-size: 16px;
      margin: 16px 0;
    }
  }
`

customElements.define('remove-product-dialog', RemoveProductDialog)
