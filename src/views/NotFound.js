// Layout
import '../layouts/GeneralLayout.js'

// Assets
import pageLost from '../assets/page-lost.webp'

export default class NotFound extends HTMLElement {
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
          <img alt="Page not found" src="${pageLost}" />
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
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;

      & img {
        width: 600px;
        object-fit: cover;
      }
    }
  }
`

customElements.define('not-found', NotFound)
