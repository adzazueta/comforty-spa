// Layout
import '../layouts/General.js'

// Components

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
        <h1>HomePage</h1>
      </general-layout>
    `
  }
}

const css = ``

customElements.define('home-view', HomeView)
