import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { IWord } from '../interfaces/IWord';
import Sizes from '../Utils/Sizes';
export declare class World {
    basic: any;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    sizes: Sizes;
    material: THREE.Material | THREE.ShaderMaterial | any;
    useShader: Boolean;
    clock: THREE.Clock;
    constructor(option: IWord);
    /**
     * 初始化场景
     */
    initialize(): void;
    /**
     * 创建box
     */
    createBox(): void;
    /**
     * 渲染函数
     */
    render(): void;
}
