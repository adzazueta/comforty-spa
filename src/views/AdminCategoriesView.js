// Services
import Categories from '../services/Categories.js'
import Products from '../services/Products.js'

// Layout
import '../layouts/AdminLayout.js'

// Components
import '../components/ToastAlert.js'
import '../components/ItemsTable.js'
import '../components/AddCategoryDialog.js'
import '../components/EditCategoryDialog.js'
import '../components/RemoveCategoryDialog.js'

export default class AdminCategoriesView extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })

    this.state = {
      categories: [],
      headers: ['Code', 'Name', 'Description']
    }

    this.toastAlert = null
    this.adminLayout = null
    this.addDialog = null
    this.editDialog = null
    this.removeDialog = null

    this._handleAddCategory = this._handleAddCategory.bind(this)
    this._handleEditCategory = this._handleEditCategory.bind(this)
    this._handleRemoveCategory = this._handleRemoveCategory.bind(this)
    this._handleAfterActionCategory = this._handleAfterActionCategory.bind(this)
    this._handleCloseDialog = this._handleCloseDialog.bind(this)
  }

  _handleAddCategory() {
    this.addDialog = document.createElement('add-category-dialog')
    this.addDialog.addEventListener('addedcategory', this._handleAfterActionCategory)
    this.addDialog.addEventListener('closedialog', this._handleCloseDialog)
    this.adminLayout.appendChild(this.addDialog)
    this.addDialog.showModal()
  }

  _handleEditCategory(event) {
    const categoryToEdit = this.state.categories.find((category) => category.uuid === event.detail.uuid)
    this.editDialog = document.createElement('edit-category-dialog')
    this.editDialog.setAttribute('data-category-to-edit', JSON.stringify(categoryToEdit))
    this.editDialog.addEventListener('editedcategory', this._handleAfterActionCategory)
    this.editDialog.addEventListener('closedialog', this._handleCloseDialog)
    this.adminLayout.appendChild(this.editDialog)
    this.editDialog.showModal()
  }

  async _handleRemoveCategory(event) {
    const categoryToRemove = this.state.categories.find((category) => category.uuid === event.detail.uuid)
    const productsOfCategory = await Products.getProductsByCategory(categoryToRemove.code)

    if (productsOfCategory.length > 0) {
      this.toastAlert.showAlert('You cannot remove this category because it contains active products. If you want to remove it first remove the products.', 'error', 5000)
    } else {
      this.removeDialog = document.createElement('remove-category-dialog')
      this.removeDialog.setAttribute('data-category-to-remove', JSON.stringify(categoryToRemove))
      this.removeDialog.addEventListener('removedcategory', this._handleAfterActionCategory)
      this.removeDialog.addEventListener('closedialog', this._handleCloseDialog)
      this.adminLayout.appendChild(this.removeDialog)
      this.removeDialog.showModal()
    }
  }

  async _handleAfterActionCategory(event) {
    event.preventDefault()
    try {
      this.state.categories = await Categories.getAllCategories()
    } catch (error) {
      throw error
    } finally {
      if (event.detail.action === 'add') this.adminLayout.removeChild(this.addDialog)
      if (event.detail.action === 'edit') this.adminLayout.removeChild(this.editDialog)
      if (event.detail.action === 'remove') this.adminLayout.removeChild(this.removeDialog)

      this.render()

      if (event.detail.error) {
        if (event.detail.action === 'add') this.toastAlert.showAlert('There was an error creating the category. Please try again later', 'error')
        if (event.detail.action === 'edit') this.toastAlert.showAlert('There was an error updating the category. Please try again later', 'error')
        if (event.detail.action === 'remove') this.toastAlert.showAlert('There was an error removing the category. Please try again later', 'error')
      }
    }
  }

  _handleCloseDialog(event) {
    if (event.detail.action === 'add') this.adminLayout.removeChild(this.addDialog)
    if (event.detail.action === 'edit') this.adminLayout.removeChild(this.editDialog)
    if (event.detail.action === 'remove') this.adminLayout.removeChild(this.removeDialog)
  }

  async connectedCallback() {
    this.state.categories = await Categories.getAllCategories()
    this.render()
  }

  render() {
    const { categories, headers } = this.state

    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <toast-alert></toast-alert>
      <admin-layout>
        <div class="wrapper">
          <h1 class="title">Categories</h1>
          <items-table data-item-name="Category" data-headers='${JSON.stringify(headers)}' data-items='${JSON.stringify(categories)}'></items-table>
        </div>
      </admin-layout>
    `

    this.toastAlert = this.shadowRoot.querySelector('toast-alert')
    this.adminLayout = this.shadowRoot.querySelector('admin-layout')
    const itemsTable = this.shadowRoot.querySelector('items-table')

    itemsTable.addEventListener('additemclick', this._handleAddCategory)
    itemsTable.addEventListener('edititemclick', this._handleEditCategory)
    itemsTable.addEventListener('removeitemclick', this._handleRemoveCategory)
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

customElements.define('admin-categories-view', AdminCategoriesView)
