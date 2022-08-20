import {
  Clock, MeshBasicMaterial, PerspectiveCamera,
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
  public useShader = true;
  public clock: Clock;
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
    this.clock = new Clock()

    this.initialize()

    console.log(this.scene)

    this.resources = new Resources(async () => {
      await this.createEarth()
      // 开始渲染
      this.render()
    })
  }

  async createEarth() {

    this.camera.position.set(0, 30, -200)
    this.controls.autoRotate = true
    this.controls.autoRotateSpeed = 3
    // 使动画循环使用时阻尼或自转 意思是否有惯性
    this.controls.enableDamping = true;
    // 动态阻尼系数 就是鼠标拖拽旋转灵敏度
    this.controls.dampingFactor = 0.05;
    // 是否可以缩放
    this.controls.enableZoom = true;
    // 设置相机距离原点的最远距离
    this.controls.minDistance = 100;
    // 设置相机距离原点的最远距离
    this.controls.maxDistance = 300;
    // 是否开启右键拖拽
    this.controls.enablePan = false;

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

    //
  }

  /**
   * 初始化场景
   */
  public initialize() {
    this.camera.position.set(5, 5, 5)
    this.sizes.$on('resize', () => {
      this.renderer.setSize(Number(this.sizes.viewport.width), Number(this.sizes.viewport.height))
      this.camera.aspect = Number(this.sizes.viewport.width) / Number(this.sizes.viewport.height)
      this.camera.updateProjectionMatrix()
    })
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