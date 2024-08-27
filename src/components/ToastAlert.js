export default class ToastAlert extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })

    this.state = {
      message: '',
      type: 'info',
      visible: false,
      autoDismiss: true,
      duration: 4000
    };

    this.showAlert = this.showAlert.bind(this)
    this._closeAlert = this._closeAlert.bind(this)
  }

  _closeAlert() {
    this.state.visible = false
    this.render()
  }

  showAlert(message, type = 'info', duration = this.state.duration) {
    this.state.message = message
    this.state.type = type
    this.state.visible = true

    this.render()

    if (this.state.autoDismiss) {
      setTimeout(() => {
        this._closeAlert()
      }, duration)
    }
  }

  connectedCallback() {
    this.render()
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <div class="alert ${this.state.type} ${this.state.visible ? 'visible' : ''}">
        <span class="message">${this.state.message}</span>
        <button class="close-btn">&times;</button>
      </div>
    `

    this.shadowRoot.querySelector('.close-btn').addEventListener('click', this._closeAlert)
  }
}

const css = `
  :host {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;

    & .alert {
      display: none;
      padding: 16px;
      border-radius: var(--border-radius);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      font-size: 14px;
      color: var(--text-color-light);
      text-wrap: wrap;
      background-color: #333;
      opacity: 0;
      transition: opacity 0.3s, transform 0.3s;
      transform: translateY(-20px);
      max-width: 450px;

      &.visible {
        display: flex;
        opacity: 1;
        transform: translateY(0);
      }

      &.info {
        background-color: var(--info-color);
      }

      &.success {
        background-color: var(--success-color);
      }

      &.warning {
        background-color: var(--warning-color);
      }

      &.error {
        background-color: var(--error-color);
      }
    }

    & .close-btn {
      background: transparent;
      border: none;
      color: var(--text-color-light);
      font-size: 18px;
      cursor: pointer;
      margin-left: 12px;
      padding: 0;

      &:focus {
        outline: none;
      }
    }
  }
`;

customElements.define('toast-alert', ToastAlert);
