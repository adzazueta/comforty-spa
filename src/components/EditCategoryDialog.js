// Services
import Categories from '../services/Categories.js'

// Components
import './UploadImage.js'
import './CustomInput.js'
import './ButtonCta.js'

// Icons
import './icons/CloseIcon.js'

export default class EditCategoryDialog extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })

    this.props = {
      categoryToEdit: {}
    }

    this.dialog = null
    this.form = null
    this.imageUploader = null
    this.customInputs = []
    this.closeButton = null
    this.submitButton = null

    this._handleEditCategory = this._handleEditCategory.bind(this)
    this._handleCloseButtonClick = this._handleCloseButtonClick.bind(this)
    this._handleSubmitFromInputs = this._handleSubmitFromInputs.bind(this)
    this._checkFormValidity = this._checkFormValidity.bind(this)
  }

  async _handleEditCategory(event) {
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

      await Categories.updateCategory(
        this.props.categoryToEdit.uuid,
        formData.get('name'),
        formData.get('description'),
        image
      )
    } catch {
      error = true
    } finally {
      this.dialog.close()
      this.dispatchEvent(new CustomEvent('editedcategory', {
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

  _checkFormValidity() {
    const isFormValid = Array.from(this.customInputs).every((input) => input.checkValidity())
    if (isFormValid) this.submitButton.removeAttribute('data-disabled')
    else this.submitButton.setAttribute('data-disabled', '')
  }

  connectedCallback() {
    this.props.categoryToEdit = JSON.parse(this.getAttribute('data-category-to-edit'))

    this.render()
  }

  showModal() {
    this.dialog.showModal()
  }

  render() {
    const { categoryToEdit } = this.props

    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <dialog>
        <div class="close-button-container">
          <close-icon></close-icon>
        </div>
        <p class="title">Edit Category</p>
        <form>
          <upload-image
            name="image"
            data-src="${categoryToEdit.image}"
          ></upload-image>
          <custom-input
            style="--custom-input-width: 100%;"
            name="name"
            data-type="text"
            data-label="Name"
            data-max-width="100%"
            data-value="${categoryToEdit.name}"
            data-required
          ></custom-input>
          <custom-input
            style="--custom-input-width: 100%;"
            name="description"
            data-type="text"
            data-label="Description"
            data-max-width="100%"
            data-value="${categoryToEdit.description}"
            data-required
          ></custom-input>
          <button-cta data-type="submit">
            Edit Category
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

    this.form.addEventListener('submit', this._handleEditCategory)
    this.closeButton.addEventListener('click', this._handleCloseButtonClick)
    this.imageUploader.addEventListener('custominput', this._checkFormValidity)
    this.customInputs.forEach((custonInput) => {
      custonInput.addEventListener('custominput', this._checkFormValidity)
      custonInput.addEventListener('inputenter', this._handleSubmitFromInputs)
    })
    this.submitButton.addEventListener('click', this._handleSubmitFromInputs)
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

customElements.define('edit-category-dialog', EditCategoryDialog)
