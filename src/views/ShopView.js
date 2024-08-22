// Layout
import '../layouts/GeneralLayout.js'

// Sections
import '../sections/ShopByCategory.js'

export default class ShopView extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })

    this.props = {
      categoryParam: ''
    }
  }

  connectedCallback() {
    this.props.categoryParam = this.getAttribute('data-category') ?? 'all'

    this.render()
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <general-layout>
        <div class="sections-wrapper">
          <shop-by-category data-initial-category="${this.props.categoryParam}"></shop-by-category>
        </div>
      </general-layout>
    `
  }
}

const css = `
  :host {
    max-width: var(--content-wrapper-width);
    width: 100%;

    & .sections-wrapper {
      width: 100%;
    }
  }
`

customElements.define('shop-view', ShopView)
