// Layout
import '../layouts/GeneralLayout.js'

// Sections
import '../sections/HomeBannerSection.js'
import '../sections/CategoriesSlider.js'

export default class HomeView extends HTMLElement {
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
      <general-layout>
        <div class="sections-wrapper">
          <home-banner-section></home-banner-section>
          <categories-slider></categories-slider>
        </div>
      </general-layout>
    `
  }
}

const css = `
  :host {
    max-width: var(--content-wrapper-width);
    width: 100%;
  }
`

customElements.define('home-view', HomeView)
