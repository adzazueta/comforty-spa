// Services
import Categories from '../services/Categories.js'

// Components
import './UploadImage.js'
import './CustomInput.js'
import './ButtonCta.js'

// Icons
import './icons/CloseIcon.js'

export default class AddCategoryDialog extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })

    this.dialog = null
    this.form = null
    this.imageUploader = null
    this.customInputs = []
    this.closeButton = null
    this.submitButton = null

    this._handleAddCategory = this._handleAddCategory.bind(this)
    this._handleCloseButtonClick = this._handleCloseButtonClick.bind(this)
    this._handleSubmitFromInputs = this._handleSubmitFromInputs.bind(this)
    this._checkFormValidity = this._checkFormValidity.bind(this)
  }

  _handleAddCategory(event) {
    event.preventDefault()
    try {
      const formData = new FormData(event.target)
      
      Categories.createCategory(
        formData.get('name'),
        formData.get('description'),
        {
          file: formData.get('image'),
          extension: formData.get('image').name.split('.').reverse()[0]
        }
      )
    } catch (error) {
      throw new Error(error)
    } finally {
      this.dialog.close()
      this.dispatchEvent(new CustomEvent('addedcategory', {
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

  _checkFormValidity() {
    const inputs = [...this.customInputs, this.imageUploader]
    const isFormValid = inputs.every((input) => input.checkValidity())
    if (isFormValid) this.submitButton.removeAttribute('data-disabled')
    else this.submitButton.setAttribute('data-disabled', '')
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
        <p class="title">Add Category</p>
        <form>
          <upload-image
            name="image"
            data-required
          ></upload-image>
          <custom-input
            style="--custom-input-width: 100%;"
            name="name"
            data-type="text"
            data-label="Name"
            data-max-width="100%"
            data-required
          ></custom-input>
          <custom-input
            style="--custom-input-width: 100%;"
            name="description"
            data-type="text"
            data-label="Description"
            data-max-width="100%"
            data-required
          ></custom-input>
          <button-cta data-type="submit" >
            Add Category
          </button-cta>
        </form>
      </dialog>
    `

    this.dialog = this.shadowRoot.querySelector('dialog')
    this.form = this.shadowRoot.querySelector('form')
    this.closeButton = this.shadowRoot.querySelector('close-icon')
    this.imageUploader = this.shadowRoot.querySelector('upload-image')
    this.customInputs = this.shadowRoot.querySelectorAll('custom-input')
    this.submitButton = this.shadowRoot.querySelector('button-cta')

    this.form.addEventListener('submit', this._handleAddCategory)
    this.closeButton.addEventListener('click', this._handleCloseButtonClick)
    this.imageUploader.addEventListener('custominput', this._checkFormValidity)
    this.customInputs.forEach((custonInput) => {
      custonInput.addEventListener('custominput', this._checkFormValidity)
      custonInput.addEventListener('inputenter', this._handleSubmitFromInputs)
    })
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

customElements.define('add-category-dialog', AddCategoryDialog)
