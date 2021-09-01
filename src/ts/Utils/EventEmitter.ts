/**
 * 观察者模式
 */
export default class EventEmitter {
  public message: any;
  constructor() {
    this.message = {}
  }
  public $on(type: string, fn: Function) {
    if (!this.message || !this.message[type]) {
      // 如果没有这个属性 就初始化一个空的数组
      this.message[type] = []
    }
    // 如果有这个属性，就往他的后面push一个新的fn
    this.message[type].push(fn)
  }

  public $off(type: string, fn: Function) {
    // 判断你有没有订阅
    if (!this.message[type]) return
    // 判断你有没有fn这个参数
    if (!fn) {
      // 如果没有fn我就删除掉整个事件
      this.message[type] = undefined // 或者 delete this.message[type]
      return
    }
    this.message[type] = this.message[type].filter((item: Function) => item !== fn)
  }

  public $emit(type: string) {
    // 判断你有没有订阅
    if (!this.message[type]) return
    this.message[type].forEach((item: Function) => {
      item()
    })
  }
}
