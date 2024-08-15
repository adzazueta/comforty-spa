// Services
import Categories from '../services/Categories.js'

// Layout
import '../layouts/AdminLayout.js'

// Components
import '../components/ItemsTable.js'
import '../components/CustomInput.js'
import '../components/ButtonCta.js'
import '../components/ButtonLink.js'

// Icons
import '../components/icons/CloseIcon.js'

export default class AdminCategoriesView extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })

    this.state = {
      categories: []
    }

    this.dialog = null

    this._handleCreateCategory = this._handleCreateCategory.bind(this)
    this._handleEditCategory = this._handleEditCategory.bind(this)
    this._handleRemoveCategory = this._handleRemoveCategory.bind(this)
    this._handleSubmitFromInputs = this._handleSubmitFromInputs.bind(this)
    this._handleCloseButtonClick = this._handleCloseButtonClick.bind(this)
    this._handleAddCategory = this._handleAddCategory.bind(this)
  }

  async _handleCreateCategory(event) {
    event.preventDefault()

    try {
      const formData = new FormData(event.target)
      Categories.createCategory(formData.get('name'), formData.get('description'))
    } catch (error) {
      console.error(error)
    } finally {
      this.state.categories = await Categories.getAllCategories()
      this.dialog.close()
      this.render()
    }
  }

  _handleEditCategory(event) {
    console.log(event.detail.uuid)
  }

  _handleRemoveCategory(event) {
    console.log(event.detail.uuid)
  }

  _handleSubmitFromInputs() {
    this.shadowRoot.querySelector('#create-category-form').requestSubmit()
  }

  _handleCloseButtonClick() {
    this.dialog.close()
  }

  _handleAddCategory() {
    this.dialog.showModal()
  }

  async connectedCallback() {
    this.state.categories = await Categories.getAllCategories()
    this.render()
  }

  render() {
    const { categories } = this.state

    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <admin-layout>
        <div class="wrapper">
          <h1 class="title">Categories</h1>
          <items-table data-item-name="Category" data-headers="['Name', 'Description']" data-items='${JSON.stringify(categories)}'></items-table>
        </div>
        <dialog id="add-category-dialog" modal-mode="mega">
          <div class="close-button-container">
            <close-icon></close-icon>
          </div>
          <form id="create-category-form">
            <p class="title">Add Category</p>
            <custom-input style="--custom-input-width: 100%;" name="name" data-type="text" data-label="Name" data-max-width="100%"></custom-input>
            <custom-input style="--custom-input-width: 100%;" name="description" data-type="text" data-label="Description" data-max-width="100%"></custom-input>
            <button-cta data-type="submit" >
              Add Category
            </button-cta>
          </form>
        </dialog>
      </admin-layout>
    `

    this.dialog = this.shadowRoot.querySelector('#add-category-dialog')
    const itemsTable = this.shadowRoot.querySelector('items-table')
    const closeButton = this.shadowRoot.querySelector('close-icon')
    const createCategoryForm = this.shadowRoot.querySelector('#create-category-form')
    const nameInput = this.shadowRoot.querySelector('[name="name"]')
    const descriptionInput = this.shadowRoot.querySelector('[name="description"]')
    const submitButtom = this.shadowRoot.querySelector('button-cta')

    itemsTable.addEventListener('additemclick', this._handleAddCategory)
    itemsTable.addEventListener('edititemclick', this._handleEditCategory)
    itemsTable.addEventListener('removeitemclick', this._handleRemoveCategory)
    closeButton.addEventListener('click', this._handleCloseButtonClick)
    createCategoryForm.addEventListener('submit', this._handleCreateCategory)
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

  #add-category-dialog {
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

customElements.define('admin-categories-view', AdminCategoriesView)
