export default class TabSelector extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })

    this.props = {
      tabs: [],
      initalTab: ''
    }

    this.tabsContainer = null
    this.tabItems = []
    this.activeTab = null

    this._renderTabs = this._renderTabs.bind(this)
    this._updateActiveTab = this._updateActiveTab.bind(this)
  }

  _renderTabs() {
    if (this.props.tabs.length) {
      this.props.tabs.forEach((tab, index) => {
        const tabElement = document.createElement('p')
        tabElement.classList.add('tab-item')

        if (
          (this.props.initalTab && this.props.initalTab === tab.value) || 
          (!this.props.initalTab && index === 0)
        ) {
          tabElement.classList.add('active');
        }

        tabElement.setAttribute('data-tab', tab.value)
        tabElement.textContent = tab.label

        this.tabsContainer.appendChild(tabElement)
      })

      this.activeTab = this.shadowRoot.querySelector('.active')
      this.tabItems = this.shadowRoot.querySelectorAll('.tab-item')
      this.tabItems.forEach((tabItem) => tabItem.addEventListener('click', this._updateActiveTab))
    }
  }

  _updateActiveTab(event) {
    this.activeTab.classList.remove('active')
    event.target.classList.add('active')
    this.activeTab = event.target

    this.dispatchEvent(new CustomEvent('updatedtab', {
      detail: {
        activeTab: event.target.getAttribute('data-tab')
      }
    }))

  }

  connectedCallback() {
    this.props.tabs = JSON.parse(this.getAttribute('data-tabs')) ?? []
    this.props.initalTab = this.getAttribute('data-initial-tab') ?? ''

    this.render()
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <div class="tabs-container"></div>
    `

    this.tabsContainer = this.shadowRoot.querySelector('.tabs-container')
    this._renderTabs()
  }
}

const css = `
  :host {
    & .tabs-container {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;

      & .tab-item {
        text-transform: uppercase;
        font-size: 16px;
        font-weight: 500;
        letter-spacing: 1px;
        color: #9a9caa;
        padding: 4px 8px;
        margin: 0;
        border-bottom: 2px solid transparent;
        cursor: pointer;
        transition: all 0.3s ease;

        &.active {
          border-bottom: 2px solid var(--primary-color);
        }

        &:hover, &.active  {
          color: var(--text-color-dark);
        }
      }
    }
  }
`

customElements.define('tab-selector', TabSelector)
