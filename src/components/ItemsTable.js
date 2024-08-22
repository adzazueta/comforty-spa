// Components
import '../components/CustomInput.js'
import '../components/ButtonIcon.js'

// Icons
import '../components/icons/AddCircleIcon.js'
import '../components/icons/EditIcon.js'
import '../components/icons/RemoveIcon.js'

export default class ItemsTable extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })

    this.props = {
      itemName: '',
      headers: [],
      items: []
    }

    this.state = {
      itemsToShow: []
    }

    this.table = document.createElement('table')

    this._handleFilterInput = this._handleFilterInput.bind(this)
    this._handleAddItemClick = this._handleAddItemClick.bind(this)
    this._handleEditButtonClick = this._handleEditButtonClick.bind(this)
    this._handleRemoveButtonClick = this._handleRemoveButtonClick.bind(this)
  }

  _handleFilterInput(event) {
    if (event.detail.value) {
      this.state.itemsToShow = this.props.items.filter((items) => {
        return items.name.toLowerCase().includes(event.detail.value.toLowerCase()) ||
          items.description.toLowerCase().includes(event.detail.value.toLowerCase())
      })
    } else {
      this.state.itemsToShow = this.props.items
    }

    this._renderTable(true)
  }

  _handleAddItemClick() {
    this.dispatchEvent(new CustomEvent('additemclick'))
  }

  _handleEditButtonClick(event) {
    const itemUuid = event.target.getAttribute('data-item-id')
    this.dispatchEvent(new CustomEvent('edititemclick', { 
      detail: {
        uuid: itemUuid
      }
    }))
  }

  _handleRemoveButtonClick(event) {
    const itemUuid = event.target.getAttribute('data-item-id')
    this.dispatchEvent(new CustomEvent('removeitemclick', { 
      detail: {
        uuid: itemUuid
      }
    }))
  }

  _renderTable(removeTable = false) {
    if (removeTable) {
      this.shadowRoot.removeChild(this.table)
      const noDataLegend = this.shadowRoot.querySelector('.no-data')
      if (noDataLegend) this.shadowRoot.removeChild(noDataLegend)
    } 

    this.table.innerHTML = ''
    const tr = document.createElement('tr')

    this.props.headers.forEach((header) =>  {
      const th = document.createElement('th')
      th.textContent = header
      tr.appendChild(th)
    })

    const actionsTh = document.createElement('th')
    actionsTh.textContent = 'Actions'
    tr.appendChild(actionsTh)

    this.table.appendChild(tr)

    this.state.itemsToShow.forEach((item) => {
      const row = this.table.insertRow(-1)
      
      this.props.headers.forEach((header, index) => {
        const cell = row.insertCell(index)
        cell.innerHTML = item[header.toLowerCase()]
      })

      const actionsCell = row.insertCell(this.props.headers.length)

      const editButton = document.createElement('edit-icon')
      editButton.setAttribute('data-item-id', item.uuid)

      const removeButton = document.createElement('remove-icon')
      removeButton.setAttribute('data-item-id', item.uuid)
  
      actionsCell.appendChild(editButton)
      actionsCell.appendChild(removeButton)
    })

    this.shadowRoot.appendChild(this.table)

    if (!this.state.itemsToShow?.length) {
      const noDataLegend = document.createElement('p')
      noDataLegend.textContent = 'Not Available Data :('
      noDataLegend.classList.add('no-data')
      this.shadowRoot.appendChild(noDataLegend)
    }
  }

  connectedCallback() {
    this.props.itemName = this.getAttribute('data-item-name')
    this.props.headers = JSON.parse(this.getAttribute('data-headers').replace(/'/g, '"'))
    this.props.items = JSON.parse(this.getAttribute('data-items').replace(/'/g, '"'))
    
    this.table.id = this.props.itemName.toLowerCase()

    this.state.itemsToShow = this.props.items

    this.render()
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <custom-input
        class="filter-input"
        style="--custom-input-width: 100%;"
        name="search"
        data-type="text"
        data-label="Search ${this.props.itemName} by Name or Category"
        data-max-width="100%"
      ></custom-input>
      <button-icon
        class="add-item-btn"
        data-text="Add ${this.props.itemName}" 
        data-show-border
      >
        <add-circle-icon slot="icon"></add-circle-icon>
      </button-icon>
    `

    this._renderTable()

    const filterInput = this.shadowRoot.querySelector('.filter-input')
    filterInput.addEventListener('custominput', this._handleFilterInput)

    const addItemButton = this.shadowRoot.querySelector('.add-item-btn')
    addItemButton.addEventListener('internalclick', this._handleAddItemClick)

    const editButtons = this.shadowRoot.querySelectorAll('edit-icon')
    editButtons.forEach((editButton) => {
      editButton.addEventListener('click', this._handleEditButtonClick)
    })

    const removeButtons = this.shadowRoot.querySelectorAll('remove-icon')
    removeButtons.forEach((removeButton) => {
      removeButton.addEventListener('click', this._handleRemoveButtonClick)
    })
  }
}

const css = `
  :host {
    width: 100%;
    padding: 48px 24px;

    & .filter-input {
      margin-bottom: 16px;
    }
    
    & .add-item-btn {
      display: flex;
      justify-content: end;
    }

    & table {
      border-collapse: separate;
      border-spacing: 0;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      margin-top: 16px;
      width: 100%;

      & th {
        resize: horizontal;
        overflow: auto;
      }

      & td edit-icon, & td remove-icon {
        cursor: pointer;
        color: var(--primary-color);
        transition: all 0.3s ease;

        &:hover {
          color: var(--text-color-dark);
        }
      }

      & th, & td {
        padding: 8px;
        text-align: center;
      }

      & th:not(:last-child),
      & td:not(:last-child) {
        border-right: 1px solid var(--border-color);
      }

      & > thead > tr:not(:last-child) > th,
      & > thead > tr:not(:last-child) > td,
      & > tbody > tr:not(:last-child) > th,
      & > tbody > tr:not(:last-child) > td,
      & > tfoot > tr:not(:last-child) > th,
      & > tfoot > tr:not(:last-child) > td,
      & > tr:not(:last-child) > td,
      & > tr:not(:last-child) > th,
      & > thead:not(:last-child),
      & > tbody:not(:last-child),
      & > tfoot:not(:last-child) {
        border-bottom: 1px solid var(--border-color);
      }

      &:has(+.no-data) {
        border-radius: 8px 8px 0 0;

        & th {
          font-weight: 500;
        }
      }
    }

    & .no-data {
      border: 1px solid var(--border-color);
      border-top: none;
      border-radius: 0 0 8px 8px;
      margin: 0;
      color: var(--primary-color);
      font-weight: 500;
      padding: 8px;
      text-align: center;
    }
  }
`

customElements.define('items-table', ItemsTable)
