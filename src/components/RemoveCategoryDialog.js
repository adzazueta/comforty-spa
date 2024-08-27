// Services
import Categories from '../services/Categories.js'

// Components
import './ButtonCta.js'

// Icons
import './icons/CloseIcon.js'

export default class RemoveCategoryDialog extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.props = {
      categoryToRemove: {}
    }

    this.dialog = null
    this.form = null
    this.closeButton = null
    this.submitButton = null

    this._handleRemoveCategory = this._handleRemoveCategory.bind(this)
    this._handleCloseButtonClick = this._handleCloseButtonClick.bind(this)
    this._handleSubmitFromInputs = this._handleSubmitFromInputs.bind(this)
  }

  async _handleRemoveCategory(event) {
    event.preventDefault()
    let error = false
    try {
      await Categories.removeCategory(this.props.categoryToRemove.uuid)
    } catch {
      error = true
    } finally {
      this.dialog.close()
      this.dispatchEvent(new CustomEvent('removedcategory', {
        detail: { action: 'remove', error }
      }))
    }
  }
  _handleCloseButtonClick() {
    this.dialog.close()
    this.dispatchEvent(new CustomEvent('closedialog', {
      detail: { action: 'remove' }
    }))
  }

  _handleSubmitFromInputs() {
    this.form.requestSubmit()
  }

  connectedCallback() {
    this.props.categoryToRemove = JSON.parse(this.getAttribute('data-category-to-remove'))

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
          <p class="title">Remove Category</p>
          <p class="description">Are you sure you want to remove ${this.props.categoryToRemove.name}?</p>
          <button-cta data-type="submit" >
            Remove Category
          </button-cta>
        </form>
      </dialog>
    `

    this.dialog = this.shadowRoot.querySelector('dialog')
    this.form = this.shadowRoot.querySelector('form')
    this.closeButton = this.shadowRoot.querySelector('close-icon')
    this.submitButton = this.shadowRoot.querySelector('button-cta')

    this.form.addEventListener('submit', this._handleRemoveCategory)
    this.closeButton.addEventListener('click', this._handleCloseButtonClick)
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
      gap: 16px;
    }

    & .title {
      text-align: center;
      flex-basis: 100%;
      font-size: 26px;
      margin: 0;
    }
    
    & .description {
      text-align: center;
      flex-basis: 100%;
      font-size: 16px;
      margin: 16px 0;
    }
  }
`

customElements.define('remove-category-dialog', RemoveCategoryDialog)
