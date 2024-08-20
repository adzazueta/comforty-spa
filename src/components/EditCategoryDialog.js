// Services
import Categories from '../services/Categories.js'

// Components
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

    this._handleEditCategory = this._handleEditCategory.bind(this)
    this._handleCloseButtonClick = this._handleCloseButtonClick.bind(this)
    this._handleSubmitFromInputs = this._handleSubmitFromInputs.bind(this)
  }

  _handleEditCategory(event) {
    event.preventDefault()
    try {
      const formData = new FormData(event.target)
      Categories.updateCategory(
        this.props.categoryToEdit.uuid,
        formData.get('name'),
        formData.get('description')
      )
    } catch (error) {
      throw new Error(error)
    } finally {
      this.dialog.close()
      this.dispatchEvent(new CustomEvent('editedcategory', {
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
        <form>
          <p class="title">Edit Category</p>
          <custom-input
            style="--custom-input-width: 100%;"
            name="name"
            data-type="text"
            data-label="Name"
            data-max-width="100%"
            data-value="${categoryToEdit.name}"
          ></custom-input>
          <custom-input
            style="--custom-input-width: 100%;"
            name="description"
            data-type="text"
            data-label="Description"
            data-max-width="100%"
            data-value="${categoryToEdit.description}"
          ></custom-input>
          <button-cta data-type="submit">
            Edit Category
          </button-cta>
        </form>
      </dialog>
    `

    this.dialog = this.shadowRoot.querySelector('dialog')
    this.form = this.shadowRoot.querySelector('form')
    const closeButton = this.shadowRoot.querySelector('close-icon')
    const customInputs = this.shadowRoot.querySelectorAll('custom-input')
    const submitButton = this.shadowRoot.querySelector('button-cta')

    this.form.addEventListener('submit', this._handleEditCategory)
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

customElements.define('edit-category-dialog', EditCategoryDialog)
