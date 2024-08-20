export default class UploadImage extends HTMLElement {
  static formAssociated = true

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this._internals = this.attachInternals()

    this.props = {
      src: ''
    }

    this.img = null
    this.input = null

    this._handleInputChange = this._handleInputChange.bind(this)
  }

  _handleInputChange(event) {
    if (event.target.files.length) {
      const src = URL.createObjectURL(event.target.files[0])
      this.img.src = src
      this._internals.setFormValue(event.target.files[0])
    } else {
      this._internals.setFormValue(this.props.src)
    }
  }

  connectedCallback() {
    this.props.src = this.getAttribute('data-src') ?? 'https://fakeimg.pl/250x200?text=+'
    this.render()
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <img alt="Image Preview" src="${this.props.src}" width="250px" height="200px" />
      <label for="upload-image">Upload Image</label>
      <input
        id="upload-image"
        name="upload-image"
        type="file"
        accept="image/*"
      />
    `

    this.img = this.shadowRoot.querySelector('img')
    this.input = this.shadowRoot.querySelector('input')
    this.input.addEventListener('change', this._handleInputChange)
  }
}

const css = `
  :host {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;

    & img {
      border-radius: var(--img-border-radius);
      object-fit: cover;
    }

    & label {
      background: transparent;
      border: none;
      color: var(--primary-color);
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      padding: 0;
      transition: all 0.3s ease;

      &:hover {
        color: var(--text-color-dark);
        font-weigth: 400;
      }
    }
    
    & input {
      display: none;
    }
  }
`

customElements.define('upload-image', UploadImage)
