
import 'normalize.css/normalize.css'
import World  from './world/Word'

// threejs-canvas
const dom: HTMLElement = document.querySelector('#threejs-canvas')
new World({
  dom,
})