
import 'normalize.css/normalize.css'
import World  from './world/Word'

// earth-canvas
const dom: HTMLElement = document.querySelector('#earth-canvas')
new World({
  dom,
})