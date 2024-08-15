// Layout
import '../layouts/AdminLayout.js'

// Components
import '../components/ItemsTable.js'

export default class AdminProductsView extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    this.render()
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <admin-layout>
        <div class="wrapper">
          <h1 class="title">Products</h1>
          <items-table data-item-name="Product" data-headers="['Name', 'Price', 'Description']"></items-table>
        </div>
      </admin-layout>
    `
  }
}

const css = `
  .wrapper {
    padding: 24px;

    & .title {
      margin: 0;
      font-size: 32px;
      font-weight: 500;
      text-align: center;
    }
  }
`

customElements.define('admin-products-view', AdminProductsView)
