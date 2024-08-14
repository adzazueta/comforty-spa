export default class NotFound extends HTMLElement {
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
      <h1>404 - NotFound</h1>
    `
  }
}

const css = ``

customElements.define('not-found', NotFound)
