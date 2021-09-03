/**
 * 创建 threejs 四大天王
 * 场景、相机、渲染器、控制器
 */
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
export declare class Basic {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    dom: HTMLElement;
    constructor(dom: HTMLElement);
    initScenes(): void;
    /**
     * 添加控制器
     */
    createControls(): void;
}
