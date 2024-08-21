// Services
import Categories from '../services/Categories.js'

// Components
import '../components/ArrowButon.js'
import '../components/CategoryCard.js'

export default class CategoriesSlider extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })

    this.state = {
      currentIndex: 1
    }

    this.state = {
      categories: []
    }

    this.sliderInner = null
    this.sliderItems = null

    this._renderItems = this._renderItems.bind(this)
    this._handleLeftButtonClick = this._handleLeftButtonClick.bind(this)
    this._handleRightButtonClick = this._handleRightButtonClick.bind(this)
  }

  _renderItems() {
    this.state.categories.forEach((category) => {
      const sliderItem = document.createElement('category-card')
      sliderItem.setAttribute('data-category', JSON.stringify(category))
      sliderItem.classList.add('slider-item')
      this.sliderInner.appendChild(sliderItem)
    })

    this.sliderItems = this.shadowRoot.querySelectorAll('.slider-item')
  }

  _handleLeftButtonClick() {
    this.currentIndex = this.currentIndex > 0
      ? this.currentIndex - 1
      : this.sliderItems.length - 1
    
    const offset = -this.currentIndex * 28
    this.sliderInner.style.transform = offset 
      ? `translateX(calc(${offset}% - ${32 * this.currentIndex + 1}px))`
      : `translateX(${offset}%)`
  }

  _handleRightButtonClick() {
    this.currentIndex = this.currentIndex < this.sliderItems.length - 1
      ? this.currentIndex + 1
      : 1
    
    const offset = -this.currentIndex * 28
    this.sliderInner.style.transform = offset 
      ? `translateX(calc(${offset}% - ${32 * this.currentIndex + 1}px))`
      : `translateX(${offset}%)`
  }

  async connectedCallback() {
    this.state.categories = await Categories.getAllCategories()

    this.render()
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <section class="categories-slider">
        <div class="slider">
          <div class="controls">
            <p class="title">Our Categories</p>
            <div class="arrow-buttons-container">
              <arrow-button data-arrow-direction="left"></arrow-button>
              <arrow-button data-arrow-direction="right"></arrow-button>
            </div>
          </div>
          <div class="slider-inner"></div>
        </div>
      </section>
    `

    this.sliderInner = this.shadowRoot.querySelector('.slider-inner')
    this._renderItems()

    this.sliderItems = this.shadowRoot.querySelectorAll('.slider-item')
    const leftArrowButton = this.shadowRoot.querySelector('[data-arrow-direction="left"]')
    const rightArrowButton = this.shadowRoot.querySelector('[data-arrow-direction="right"]')

    leftArrowButton.addEventListener('leftbuttonclick', this._handleLeftButtonClick)
    rightArrowButton.addEventListener('rightbuttonclick', this._handleRightButtonClick)
  }
}

const css = `
  :host {
    display: block;
    max-width: var(--content-wrapper-width);
    width: 100%;
    margin: 0 auto;

    & .categories-slider {
      margin: 32px 0;

      & .slider {
        position: relative;
        overflow: hidden;

        & .controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
  
          & .title {
            font-size: 28px;
            font-weight: 600;
            color: var(--text-color-dark);
          }
  
          & .arrow-buttons-container {
            display: flex;
            gap: 8px;
          }
        }
        
        & .slider-inner {
          display: flex;
          transition: transform 0.5s ease;

          & .slider-item {
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: var(--card-border-radius);
            min-width: 28%;
            margin-right: 32px;
          }
        }
      }
    }
  }
`

customElements.define('categories-slider', CategoriesSlider)
