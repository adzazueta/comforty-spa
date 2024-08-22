export default class PackageIcon extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    this.render()
  }

  render() {
    this.shadowRoot.innerHTML = `      
      <svg width="44" height="46" viewBox="0 0 44 46" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M43.1788 10.1498L22.293 0.0669785C22.1078 -0.0223262 21.8922 -0.0223262 21.7071 0.0669785L0.821216 10.1498C0.588341 10.2622 0.440369 10.498 0.440369 10.7566V35.2434C0.440369 35.502 0.588341 35.7378 0.821216 35.8502L21.707 45.933C21.7996 45.9777 21.8998 46 22 46C22.1002 46 22.2003 45.9777 22.293 45.933L43.1788 35.8502C43.4116 35.7378 43.5596 35.502 43.5596 35.2434V10.7567C43.5596 10.4979 43.4116 10.2623 43.1788 10.1498ZM22 1.42209L41.3359 10.7566L35.7308 13.4625C35.6953 13.4355 35.6579 13.4105 35.6167 13.3906L16.4122 4.11965L22 1.42209ZM14.8904 4.88153L34.1982 14.2025L30.2437 16.1115L10.9439 6.79439L14.8904 4.88153ZM34.6499 15.4808V22.5376L30.9562 24.3208V17.264L34.6499 15.4808ZM42.212 34.8206L22.6738 44.2526V21.2623L27.3343 19.0124C27.6694 18.8506 27.8099 18.4478 27.6481 18.1126C27.4863 17.7776 27.0835 17.6369 26.7483 17.7988L22 20.0912L20.1316 19.1891C19.7964 19.0272 19.3936 19.1679 19.2318 19.503C19.07 19.8381 19.2105 20.2409 19.5456 20.4028L21.3262 21.2623V44.2526L1.78803 34.8204V11.8301L16.6662 19.0127C16.7606 19.0583 16.8604 19.0799 16.9586 19.0799C17.2091 19.0799 17.4497 18.9396 17.5658 18.6989C17.7277 18.3637 17.5871 17.9609 17.252 17.7991L2.66409 10.7566L9.3579 7.52509L29.5992 17.2968C29.6021 17.3009 29.6054 17.3046 29.6085 17.3086V25.3945C29.6085 25.6264 29.7277 25.8419 29.9241 25.9652C30.0332 26.0337 30.1576 26.0683 30.2824 26.0683C30.3823 26.0683 30.4825 26.0461 30.5753 26.0013L35.6167 23.5675C35.8496 23.4551 35.9976 23.2194 35.9976 22.9607V14.8303L42.212 11.8302V34.8206Z" fill="currentColor"/>
      </svg>
    `
  }
}

customElements.define('package-icon', PackageIcon)
