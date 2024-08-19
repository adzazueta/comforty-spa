// Services
import Products from '../services/Products.js'

// Layout
import '../layouts/AdminLayout.js'

// Components
import '../components/ItemsTable.js'
import '../components/CustomInput.js'
import '../components/ButtonCta.js'
import '../components/ButtonLink.js'

// Icons
import '../components/icons/CloseIcon.js'

export default class AdminProductsView extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })

    this.state = {
      products: []
    }

    this.dialog = null

    this._handleCreateProduct = this._handleCreateProduct.bind(this)
    this._handleEditProduct = this._handleEditProduct.bind(this)
    this._handleRemoveProduct = this._handleRemoveProduct.bind(this)
    this._handleSubmitFromInputs = this._handleSubmitFromInputs.bind(this)
    this._handleCloseButtonClick = this._handleCloseButtonClick.bind(this)
    this._handleAddProduct = this._handleAddProduct.bind(this)
  }

  async _handleCreateProduct(event) {
    event.preventDefault()

    try {
      const formData = new FormData(event.target)
      Products.createProduct(formData.get('name'), formData.get('description'))
    } catch (error) {
      console.error(error)
    } finally {
      this.state.products = await Products.getAllProducts()
      this.dialog.close()
      this.render()
    }
  }

  _handleEditProduct(event) {
    console.log(event.detail.uuid)
  }

  _handleRemoveProduct(event) {
    console.log(event.detail.uuid)
  }

  _handleSubmitFromInputs() {
    this.shadowRoot.querySelector('#create-product-form').requestSubmit()
  }

  _handleCloseButtonClick() {
    this.dialog.close()
  }

  _handleAddProduct() {
    this.dialog.showModal()
  }

  async connectedCallback() {
    this.state.products = await Products.getAllProducts()
    this.render()
  }

  render() {
    const { products } = this.state

    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <admin-layout>
        <div class="wrapper">
          <h1 class="title">Products</h1>
          <items-table data-item-name="Product" data-headers="['Name', 'Description']" data-items='${JSON.stringify(products)}'></items-table>
        </div>
        <dialog id="add-product-dialog" modal-mode="mega">
          <div class="close-button-container">
            <close-icon></close-icon>
          </div>
          <form id="create-product-form">
            <p class="title">Add Product</p>
            <custom-input style="--custom-input-width: 100%;" name="name" data-type="text" data-label="Name" data-max-width="100%"></custom-input>
            <custom-input style="--custom-input-width: 100%;" name="description" data-type="text" data-label="Description" data-max-width="100%"></custom-input>
            <button-cta data-type="submit" >
              Add Product
            </button-cta>
          </form>
        </dialog>
      </admin-layout>
    `

    this.dialog = this.shadowRoot.querySelector('#add-product-dialog')
    const itemsTable = this.shadowRoot.querySelector('items-table')
    const closeButton = this.shadowRoot.querySelector('close-icon')
    const createProductForm = this.shadowRoot.querySelector('#create-product-form')
    const nameInput = this.shadowRoot.querySelector('[name="name"]')
    const descriptionInput = this.shadowRoot.querySelector('[name="description"]')
    const submitButtom = this.shadowRoot.querySelector('button-cta')

    itemsTable.addEventListener('additemclick', this._handleAddProduct)
    itemsTable.addEventListener('edititemclick', this._handleEditProduct)
    itemsTable.addEventListener('removeitemclick', this._handleRemoveProduct)
    closeButton.addEventListener('click', this._handleCloseButtonClick)
    createProductForm.addEventListener('submit', this._handleCreateProduct)
    nameInput.addEventListener('inputenter', this._handleSubmitFromInputs)
    descriptionInput.addEventListener('inputenter', this._handleSubmitFromInputs)
    submitButtom.addEventListener('click', this._handleSubmitFromInputs)
  }
}

const css = `
  .wrapper {
    padding: 24px;
  }

  .title {
    margin: 0;
    font-size: 32px;
    font-weight: 500;
    text-align: center;
  }

  #add-product-dialog {
    left: 250px;
    width: 648px;
    border-radius: var(--card-border-radius);
    box-shadow: var(--card-box-shadow);
    border: none;
    padding: 24px 48px;
    box-sizing: border-box;

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
      font-size: 26px
    }
  }
`

customElements.define('admin-products-view', AdminProductsView)
