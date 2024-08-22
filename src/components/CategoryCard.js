export default class CategoryCard extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })

    this.props = {
      category: {}
    }
  }

  connectedCallback() {
    this.props.category = JSON.parse(this.getAttribute('data-category'))

    this.render()
  }

  render() {
    const { category } = this.props

    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <a href="/shop/${category.code}" data-internal-link>
        <img alt="${category.name} category image" src="${category.image ?? 'https://fakeimg.pl/424x420?text=+'}" />
        <div class="category-info">
          <p class="name">${category.name}</p>
          <p class="description">${category.description}</p>
        </div>
      </a>
    `
  }
}

const css = `
  :host {
    position: relative;
    border-radius: var(--card-border-radius);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 420px;
    cursor: pointer;
    transition: all 0.3s ease;

    & a {
      height: 100%;
      transition: all 0.3s ease;
      scale: 0.95;

      &:hover {
        scale: 1;
      }

      & img {
        width: 100%;
        height: 100%;
        border-radius: var(--card-border-radius);
        object-fit: cover;
      }
  
      & .category-info {
        position: absolute;
        background-color: rgba(0, 0, 0, 0.7);
        width: 100%;
        bottom: 0;
        padding: 20px;
        box-sizing: border-box;
        border-radius: 0 0 var(--card-border-radius) var(--card-border-radius);
  
        & p {
          margin: 0;
          color: var(--text-color-light);
        }
  
        & .name {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 2px;
        }
  
        & .description {
          font-size: 14px;
          font-weight: 400;
        }
      }
    }
  }
`

customElements.define('category-card', CategoryCard)
