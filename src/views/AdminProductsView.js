// Services
import Products from '../services/Products.js'

// Layout
import '../layouts/AdminLayout.js'

// Components
import '../components/ItemsTable.js'
import '../components/AddProductDialog.js'
import '../components/EditProductDialog.js'
import '../components/RemoveProductDialog.js'

export default class AdminProductsView extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })

    this.state = {
      products: [],
      headers: ['Name', 'Description', 'Price', 'Inventory', 'Sales', 'Rating', 'Category']
    }

    this.adminLayout = null
    this.addDialog = null
    this.editDialog = null
    this.removeDialog = null

    this._handleAddProduct = this._handleAddProduct.bind(this)
    this._handleEditProduct = this._handleEditProduct.bind(this)
    this._handleRemoveProduct = this._handleRemoveProduct.bind(this)
    this._handleAfterActionProduct = this._handleAfterActionProduct.bind(this)
    this._handleCloseDialog = this._handleCloseDialog.bind(this)
  }

  _handleAddProduct() {
    this.addDialog = document.createElement('add-product-dialog')
    this.addDialog.addEventListener('addedproduct', this._handleAfterActionProduct)
    this.addDialog.addEventListener('closedialog', this._handleCloseDialog)
    this.adminLayout.appendChild(this.addDialog)
    this.addDialog.showModal()
  }

  _handleEditProduct(event) {
    const productToEdit = this.state.products.find((product) => product.uuid === event.detail.uuid)
    this.editDialog = document.createElement('edit-product-dialog')
    this.editDialog.setAttribute('data-product-to-edit', JSON.stringify(productToEdit))
    this.editDialog.addEventListener('editedproduct', this._handleAfterActionProduct)
    this.editDialog.addEventListener('closedialog', this._handleCloseDialog)
    this.adminLayout.appendChild(this.editDialog)
    this.editDialog.showModal()
  }

  _handleRemoveProduct(event) {
    const productToRemove = this.state.products.find((product) => product.uuid === event.detail.uuid)
    this.removeDialog = document.createElement('remove-product-dialog')
    this.removeDialog.setAttribute('data-product-to-remove', JSON.stringify(productToRemove))
    this.removeDialog.addEventListener('removedproduct', this._handleAfterActionProduct)
    this.removeDialog.addEventListener('closedialog', this._handleCloseDialog)
    this.adminLayout.appendChild(this.removeDialog)
    this.removeDialog.showModal()
  }

  async _handleAfterActionProduct(event) {
    event.preventDefault()
    try {
      this.state.products = await Products.getAllProducts()
    } catch (error) {
      console.error(error)
    } finally {
      if (event.detail.action === 'add') this.adminLayout.removeChild(this.addDialog)
      if (event.detail.action === 'edit') this.adminLayout.removeChild(this.editDialog)
      if (event.detail.action === 'remove') this.adminLayout.removeChild(this.removeDialog)
      this.render()
    }
  }

  _handleCloseDialog(event) {
    if (event.detail.action === 'add') this.adminLayout.removeChild(this.addDialog)
    if (event.detail.action === 'edit') this.adminLayout.removeChild(this.editDialog)
    if (event.detail.action === 'remove') this.adminLayout.removeChild(this.removeDialog)
  }

  async connectedCallback() {
    this.state.products = await Products.getAllProducts()
    this.render()
  }

  render() {
    const { products, headers } = this.state

    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <admin-layout>
        <div class="wrapper">
          <h1 class="title">Products</h1>
          <items-table data-item-name="Product" data-headers='${JSON.stringify(headers)}' data-items='${JSON.stringify(products)}'></items-table>
        </div>
      </admin-layout>
    `

    this.adminLayout = this.shadowRoot.querySelector('admin-layout')
    const itemsTable = this.shadowRoot.querySelector('items-table')

    itemsTable.addEventListener('additemclick', this._handleAddProduct)
    itemsTable.addEventListener('edititemclick', this._handleEditProduct)
    itemsTable.addEventListener('removeitemclick', this._handleRemoveProduct)
  }
}

const css = `
  .wrapper {
    padding: 24px;
    overflow-y: auto;
    box-sizing: border-box;
    height: 100%;
    max-height: calc(100vh - 56px);
  }

  .title {
    margin: 0;
    font-size: 32px;
    font-weight: 500;
    text-align: center;
  }
`

customElements.define('admin-products-view', AdminProductsView)
