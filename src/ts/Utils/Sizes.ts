/**
 * 屏幕尺寸
*/
import { EventEmitter } from 'pietile-eventemitter';
import { IEvents } from '../interfaces/IEvents';


type options = { dom: HTMLElement }

export default class Sizes {
  public width: number
  public height: number
  public viewport: {
    width: number,
    height: number
  }
  public $sizeViewport: HTMLElement
  public emitter: EventEmitter<IEvents>;

  /**
   * Constructor
   */
  constructor(options: options) {

    this.emitter = new EventEmitter<IEvents>()

    // Viewport size
    this.$sizeViewport = options.dom

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
   * 目前用于监听历史记录执行 historyChange
   * @param event 事件
   * @param fun 执行
   */
  $on<T extends keyof IEvents>(event: T, fun: () => void) {
    this.emitter.on(
      event,
      () => {
        fun()
      }
    )
  }

  /**
   * Resize
   */
  resize() {
    // 可视区域大小
    this.viewport.width = this.$sizeViewport.offsetWidth
    this.viewport.height = this.$sizeViewport.offsetHeight

    this.emitter.emit('resize')
  }
}
