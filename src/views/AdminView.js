// Layout
import '../layouts/AdminLayout.js'

// Components

export default class AdminView extends HTMLElement {
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
        <h1>Admin View</h1>
      </admin-layout>
    `
  }
}

const css = ``

customElements.define('admin-view', AdminView)
