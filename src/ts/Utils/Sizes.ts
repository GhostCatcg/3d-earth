/**
 * 屏幕尺寸
 */
import EventEmitter from './EventEmitter'

export default class Sizes extends EventEmitter {
  public width: number
  public height: number
  public viewport: {
    width: Number,
    height: Number
  }
  public $sizeViewport: HTMLElement
  /**
   * Constructor
   */
  constructor(dom: HTMLElement) {
    super()

    // Viewport size
    this.$sizeViewport = dom

    this.viewport = {
      width: 0,
      height: 0
    }
    // Resize event
    this.resize = this.resize.bind(this)
    window.addEventListener('resize', this.resize)

    this.resize()
  }

  /**
   * Resize
   */
  resize() {
    // 可视区域大小
    this.viewport.width = this.$sizeViewport.offsetWidth
    this.viewport.height = this.$sizeViewport.offsetHeight

    // 屏幕大小
    this.width = window.innerWidth
    this.height = window.innerHeight

    this.$emit('resize')
  }
}
