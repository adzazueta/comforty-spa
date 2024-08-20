// Services
import Products from '../services/Products.js'

// Components
import './UploadImage.js'
import './CustomInput.js'
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

    this.dialog = null
    this.form = null

    this._handleEditProduct = this._handleEditProduct.bind(this)
    this._handleCloseButtonClick = this._handleCloseButtonClick.bind(this)
    this._handleSubmitFromInputs = this._handleSubmitFromInputs.bind(this)
  }

  _handleEditProduct(event) {
    event.preventDefault()
    try {
      const formData = new FormData(event.target)
      let image = formData.get('image')
      if (image && typeof image !== 'string') {
        image = {
          file: formData.get('image'),
          extension: formData.get('image').name.split('.').reverse()[0]
        }
      }

      Products.updateProduct(
        this.props.productToEdit.uuid,
        formData.get('name'),
        formData.get('description'),
        formData.get('price'),
        formData.get('category'),
        image
      )
    } catch (error) {
      throw new Error(error)
    } finally {
      this.dialog.close()
      this.dispatchEvent(new CustomEvent('editedproduct', {
        detail: { action: 'edit' }
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
        <form>
          <p class="title">Edit Product</p>
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
          ></custom-input>
          <custom-input
            style="--custom-input-width: 100%;"
            name="description"
            data-type="text"
            data-label="Description"
            data-max-width="100%"
            data-value="${productToEdit.description}"
          ></custom-input>
          <custom-input
            style="--custom-input-width: 100%;"
            name="price"
            data-type="number"
            data-label="Price"
            data-max-width="100%"
            data-value="${productToEdit.price}"
          ></custom-input>
          <custom-input
            style="--custom-input-width: 100%;"
            name="category"
            data-type="text"
            data-label="Category"
            data-max-width="100%"
            data-value="${productToEdit.category}"
          ></custom-input>
          <button-cta data-type="submit">
            Edit Product
          </button-cta>
        </form>
      </dialog>
    `

    this.dialog = this.shadowRoot.querySelector('dialog')
    this.form = this.shadowRoot.querySelector('form')
    const closeButton = this.shadowRoot.querySelector('close-icon')
    const customInputs = this.shadowRoot.querySelectorAll('custom-input')
    const submitButton = this.shadowRoot.querySelector('button-cta')

    this.form.addEventListener('submit', this._handleEditProduct)
    closeButton.addEventListener('click', this._handleCloseButtonClick)
    customInputs.forEach((custonInput) => {
      custonInput.addEventListener('inputenter', this._handleSubmitFromInputs)
    })
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
  }
`

customElements.define('edit-product-dialog', EditProductDialog)
