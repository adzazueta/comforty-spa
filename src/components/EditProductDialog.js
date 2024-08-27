// Services
import Products from '../services/Products.js'
import Categories from '../services/Categories.js'

// Components
import './UploadImage.js'
import './CustomInput.js'
import './CustomSelect.js'
import './ButtonCta.js'

// Icons
import './icons/CloseIcon.js'

export default class EditProductDialog extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })

    this.props = {
      productToEdit: {}
    }

    this.state = {
      categories: []
    }

    this.dialog = null
    this.form = null
    this.imageUploader = null
    this.customInputs = []
    this.categorySelector = null
    this.closeButton = null
    this.submitButton = null

    this._handleEditProduct = this._handleEditProduct.bind(this)
    this._handleCloseButtonClick = this._handleCloseButtonClick.bind(this)
    this._handleSubmitFromInputs = this._handleSubmitFromInputs.bind(this)
    this._renderCategoryOptions = this._renderCategoryOptions.bind(this)
    this._checkFormValidity = this._checkFormValidity.bind(this)
  }

  async _handleEditProduct(event) {
    event.preventDefault()
    let error = false
    try {
      const formData = new FormData(event.target)

      let image = formData.get('image')
      if (image && typeof image !== 'string') {
        image = {
          file: formData.get('image'),
          extension: formData.get('image').name.split('.').reverse()[0]
        }
      }

      await Products.updateProduct(
        this.props.productToEdit.uuid,
        formData.get('name'),
        formData.get('description'),
        Number(formData.get('price')),
        Number(formData.get('inventory')),
        formData.get('category'),
        image
      )
    } catch {
      error = true
    } finally {
      this.dialog.close()
      this.dispatchEvent(new CustomEvent('editedproduct', {
        detail: { action: 'edit', error }
      }))
    }
  }

  _handleCloseButtonClick() {
    this.dialog.close()
    this.dispatchEvent(new CustomEvent('closedialog', {
      detail: { action: 'edit' }
    }))
  }

  _handleSubmitFromInputs() {
    this.form.requestSubmit()
  }

  async _renderCategoryOptions() {
    const categories = await Categories.getAllCategories()
    this.state.categories = categories.map((category) => ({
      value: category.code,
      label: category.name
    }))

    this.categorySelector.setAttribute('data-options', JSON.stringify(this.state.categories))
  }

  _checkFormValidity() {
    const inputs = [...this.customInputs, this.categorySelector]
    const isFormValid = inputs.every((input) => input.checkValidity())
    if (isFormValid) this.submitButton.removeAttribute('data-disabled')
    else this.submitButton.setAttribute('data-disabled', '')
  }

  connectedCallback() {
    this.props.productToEdit = JSON.parse(this.getAttribute('data-product-to-edit'))

    this.render()
  }

  showModal() {
    this.dialog.showModal()
  }

  render() {
    const { productToEdit } = this.props

    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <dialog>
        <div class="close-button-container">
          <close-icon></close-icon>
        </div>
        <p class="title">Edit Product</p>
        <form>
          <upload-image
            name="image"
            data-src="${productToEdit.image}"
          ></upload-image>
          <custom-input
            style="--custom-input-width: 100%;"
            name="name"
            data-type="text"
            data-label="Name"
            data-max-width="100%"
            data-value="${productToEdit.name}"
            data-required
          ></custom-input>
          <custom-input
            style="--custom-input-width: 100%;"
            name="description"
            data-type="text"
            data-label="Description"
            data-max-width="100%"
            data-value="${productToEdit.description}"
            data-required
          ></custom-input>
          <custom-input
            style="--custom-input-width: calc(50% - 2px);"
            name="price"
            data-type="number"
            data-label="Price"
            data-max-width="100%"
            data-value="${productToEdit.price}"
            data-required
          ></custom-input>
          <custom-input
            style="--custom-input-width: calc(50% - 2px);"
            name="inventory"
            data-type="number"
            data-label="Inventory"
            data-max-width="100%"
            data-value="${productToEdit.inventory}"
            data-required
          ></custom-input>
          <custom-select
            style="--custom-select-width: 100%;"
            name="category"
            data-label="Category"
            data-max-width="100%"
            data-value="${productToEdit.category}"
            data-required
          ></custom-select>
          <button-cta data-type="submit">
            Edit Product
          </button-cta>
        </form>
      </dialog>
    `

    this.dialog = this.shadowRoot.querySelector('dialog')
    this.form = this.shadowRoot.querySelector('form')
    this.imageUploader = this.shadowRoot.querySelector('upload-image')
    this.categorySelector = this.shadowRoot.querySelector('custom-select')
    
    this._renderCategoryOptions()

    this.closeButton = this.shadowRoot.querySelector('close-icon')
    this.customInputs = this.shadowRoot.querySelectorAll('custom-input')
    this.submitButton = this.shadowRoot.querySelector('button-cta')

    this.form.addEventListener('submit', this._handleEditProduct)
    this.closeButton.addEventListener('click', this._handleCloseButtonClick)
    this.imageUploader.addEventListener('custominput', this._checkFormValidity)
    this.customInputs.forEach((custonInput) => {
      custonInput.addEventListener('custominput', this._checkFormValidity)
      custonInput.addEventListener('inputenter', this._handleSubmitFromInputs)
    })
    this.categorySelector.addEventListener('customchange', this._checkFormValidity)
    this.categorySelector.addEventListener('initializedoptions', this._checkFormValidity)
    this.submitButton.addEventListener('click', this._handleSubmitFromInputs)

    this._checkFormValidity()
  }
}

const css = `
  dialog {
    left: 250px;
    width: 648px;
    border-radius: var(--card-border-radius);
    box-shadow: var(--card-box-shadow);
    border: none;
    padding: 24px 48px;
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
      flex-direction: row;
      justify-content: center;
      flex-wrap: wrap;
      gap: 4px;
    }

    & .title {
      text-align: center;
      font-size: 26px;
      margin: 0;
      margin-bottom: 16px;
    }
  }
`

customElements.define('edit-product-dialog', EditProductDialog)
