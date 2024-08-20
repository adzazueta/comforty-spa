// Services
import Products from '../services/Products.js'

// Components
import './UploadImage.js'
import './CustomInput.js'
import './ButtonCta.js'

// Icons
import './icons/CloseIcon.js'

export default class AddProductDialog extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })

    this.dialog = null
    this.form = null

    this._handleAddProduct = this._handleAddProduct.bind(this)
    this._handleCloseButtonClick = this._handleCloseButtonClick.bind(this)
    this._handleSubmitFromInputs = this._handleSubmitFromInputs.bind(this)
  }

  _handleAddProduct(event) {
    event.preventDefault()
    try {
      const formData = new FormData(event.target)
      Products.createProduct(
        formData.get('name'),
        formData.get('description'),
        formData.get('price'),
        formData.get('category'),
        {
          file: formData.get('image'),
          extension: formData.get('image').name.split('.').reverse()[0]
        }
      )
    } catch (error) {
      throw new Error(error)
    } finally {
      this.dialog.close()
      this.dispatchEvent(new CustomEvent('addedproduct', {
        detail: { action: 'add' }
      }))
    }
  }

  _handleCloseButtonClick() {
    this.dialog.close()
    this.dispatchEvent(new CustomEvent('closedialog', {
      detail: { action: 'add' }
    }))
  }

  _handleSubmitFromInputs() {
    this.form.requestSubmit()
  }

  connectedCallback() {
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
          <p class="title">Add Product</p>
          <upload-image name="image"></upload-image>
          <custom-input
            style="--custom-input-width: 100%;"
            name="name"
            data-type="text"
            data-label="Name"
            data-max-width="100%"
          ></custom-input>
          <custom-input
            style="--custom-input-width: 100%;"
            name="description"
            data-type="text"
            data-label="Description"
            data-max-width="100%"
          ></custom-input>
          <custom-input
            style="--custom-input-width: 100%;"
            name="price"
            data-type="number"
            data-label="Price"
            data-max-width="100%"
          ></custom-input>
          <custom-input
            style="--custom-input-width: 100%;"
            name="category"
            data-type="text"
            data-label="Category"
            data-max-width="100%"
          ></custom-input>
          <button-cta data-type="submit" >
            Add Product
          </button-cta>
        </form>
      </dialog>
    `

    this.dialog = this.shadowRoot.querySelector('dialog')
    this.form = this.shadowRoot.querySelector('form')
    const closeButton = this.shadowRoot.querySelector('close-icon')
    const customInputs = this.shadowRoot.querySelectorAll('custom-input')
    const submitButton = this.shadowRoot.querySelector('button-cta')

    this.form.addEventListener('submit', this._handleAddProduct)
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

customElements.define('add-product-dialog', AddProductDialog)
