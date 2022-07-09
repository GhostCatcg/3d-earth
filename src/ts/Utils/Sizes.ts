/**
 * 屏幕尺寸
*/
import { EventEmitter } from 'pietile-eventemitter';
import { IEvents } from '../interfaces/IEvents';
import World from '../world/Word';

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
  constructor(user: World) {
    this.emitter = user.emitter
    // Viewport size
    this.$sizeViewport = user.option.dom

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

    this.emitter.emit('resize')
  }
}
