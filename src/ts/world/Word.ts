import {
  MeshBasicMaterial, PerspectiveCamera,
  Scene, ShaderMaterial, WebGLRenderer
} from "three";
import {
  OrbitControls
} from "three/examples/jsm/controls/OrbitControls";

// interfaces
import { IWord } from '../interfaces/IWord'

import { Basic } from './Basic'
import Sizes from '../Utils/Sizes'
import { Resources } from './Resources';

import { EventEmitter } from "pietile-eventemitter";

// interface
import { IEvents } from '../interfaces/IEvents'

// earth 
import Earth from './Earth'
import Data from './Data'

export default class World {
  public basic: Basic;
  public scene: Scene;
  public camera: PerspectiveCamera;
  public renderer: WebGLRenderer
  public controls: OrbitControls;
  public sizes: Sizes;
  public material: ShaderMaterial | MeshBasicMaterial;
  public resources: Resources;
  public emitter: EventEmitter<IEvents>
  public option: IWord;
  public earth: Earth;


  constructor(option: IWord) {
    /**
     * 加载资源
     */
    this.option = option

    this.emitter = new EventEmitter<IEvents>()

    this.basic = new Basic(option.dom)
    this.scene = this.basic.scene
    this.renderer = this.basic.renderer
    this.controls = this.basic.controls
    this.camera = this.basic.camera

    this.sizes = new Sizes({ dom: option.dom })
    
    this.sizes.$on('resize', () => {
      this.renderer.setSize(Number(this.sizes.viewport.width), Number(this.sizes.viewport.height))
      this.camera.aspect = Number(this.sizes.viewport.width) / Number(this.sizes.viewport.height)
      this.camera.updateProjectionMatrix()
    })

    this.resources = new Resources(async () => {
      await this.createEarth()
      // 开始渲染
      this.render()
    })
  }

  async createEarth() {

    // 资源加载完成，开始制作地球
    this.earth = new Earth({
      data: Data,
      dom: this.option.dom,
      textures: this.resources.textures,
      labelType: 1,
      earth: {
        radius: 50,
        earthTime: 5000,
        rotateEnabled: false,
        rotateSpeed: 0.002,
      },
      satellite: {
        show: true,
        rotateSpeed: -0.01,
        size: 1,
        number: 2
      },
      punctuation: {
        circleColor: 0x22ffcc,
        lightColumn: {
          startColor: 0xe4007f, // 起点颜色
          endColor: 0xffffff, // 终点颜色
        },
      },
      flyLine: {
        showAircraft: true, // 是否显示飞机
        color: 0xd18547, // 飞线的颜色
        showLine: true, // 是否显示飞行拖尾线
        speed: 0.004, // 拖尾飞线的速度
        colorStart: 0xec8f43, // 飞行线开头的颜色
        colorEnd: 0xf3ae76, // 飞行线结尾的颜色
      }
    })

    this.scene.add(this.earth.group)

    await this.earth.init()

  }

  /**
   * 渲染函数
   */
  public render() {
    requestAnimationFrame(this.render.bind(this))
    this.renderer.render(this.scene, this.camera)
    this.controls && this.controls.update()
    this.earth && this.earth.render()
  }
}