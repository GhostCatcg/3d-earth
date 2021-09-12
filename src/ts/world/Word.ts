import * as THREE from 'three';
import {
  OrbitControls
} from "three/examples/jsm/controls/OrbitControls";
import * as _ from 'lodash'
import { Pane } from 'tweakpane'
import gsap from 'gsap'

// interfaces
import { IWord } from '../interfaces/IWord'

import { Basic } from './Basic'
import Sizes from '../Utils/Sizes'
import { Resources } from './Resources';

// shader
import boxVertex from '../../shaders/box/vertex.vs'
import boxFragment from '../../shaders/box/fragment.fs'


export class World {
  public basic: any;
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer
  public controls: OrbitControls;
  public sizes: Sizes;
  public material: THREE.Material | THREE.ShaderMaterial | any;
  public useShader: Boolean = true;
  public clock: THREE.Clock;
  public debug: Pane;
  public resources: any;



  constructor(option: IWord) {
    /**
     * 加载资源
     */
    this.basic = new Basic(option.dom)
    this.scene = this.basic.scene
    this.renderer = this.basic.renderer
    this.controls = this.basic.controls
    this.camera = this.basic.camera

    this.sizes = new Sizes(option.dom)
    this.clock = new THREE.Clock()

    this.initialize()

    this.resources = new Resources(() => {
      console.log('资源加载完成', this.resources)
      this.createBox()
      this.render()
    })
  }

  /**
   * 初始化场景
   */
  public initialize() {
    this.scene.background = new THREE.Color('#000')
    this.camera.position.set(5, 5, 5)
    this.setDebug()
    this.sizes.$on('resize', () => {
      this.renderer.setSize(Number(this.sizes.viewport.width), Number(this.sizes.viewport.height))
      this.camera.aspect = Number(this.sizes.viewport.width) / Number(this.sizes.viewport.height)
      this.camera.updateProjectionMatrix()
    })
  }
  /**
   * 创建box
   */
  public createBox() {

    const geometry = new THREE.BoxGeometry(1, 1, 1);

    if (this.useShader) {
      this.material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: {
            value: 0
          }
        },
        vertexShader: boxVertex,
        fragmentShader: boxFragment
      });

    } else {
      this.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    }
    const cube = new THREE.Mesh(geometry, this.material);
    this.scene.add(cube);
    this.controls.target = _.cloneDeep(cube.position)
    const PARAMS = {
      cubeY: cube.position.y
    };
    this.debug
      .addInput(
        PARAMS, 'cubeY',
        { min: -5, max: 5, step: 0.00001 }
      )
      .on('change', (e) => {
        cube.position.y = e.value
      })
  }
  /**
   * debug
   */
  private setDebug() {
    this.debug = new Pane()
  }
  /**
   * 渲染函数
   */
  public render() {
    requestAnimationFrame(this.render.bind(this))
    this.renderer.render(this.scene, this.camera)
    this.controls && this.controls.update()
    this.useShader && (this.material.uniforms.uTime.value = this.clock.getElapsedTime())
  }
}