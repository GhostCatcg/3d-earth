/**
 * 资源管理和加载
 */
import { LoadingManager, TextureLoader } from 'three';
import { resources } from './Assets'
export class Resources {
  private manager: LoadingManager
  private fnc: Function;
  private textureLoader: any;
  private textures: any;
  constructor(fnc: Function) {
    this.fnc = fnc // 资源加载完成的回调

    this.textureLoader = null // 贴图加载对象
    this.textures = {} // 贴图数据

    this.LoadingResources()
    this.loadResources()
  }

  /**
   * 加载状态管理
   */
  private LoadingResources(): void {
    this.manager = new LoadingManager()
    // 开始加载
    this.manager.onStart = (url, itemsLoaded, itemsTotal) => {
      console.log('开始加载资源文件')
    }
    // 加载完成
    this.manager.onLoad = () => {
      console.log('加载完成')
      this.fnc()
    }
    // 正在进行中
    this.manager.onProgress = (url, itemsLoaded, itemsTotal) => {
      console.log(`正在加载：${url}`)
    }

    this.manager.onError = url => {
      console.log('加载失败：' + url)
    }

  }
  /**
   * 加载资源
   */
  private loadResources(): void {
    this.textureLoader = new TextureLoader(this.manager)
    resources.textures?.forEach((item) => {
      this.textureLoader.load(item.path, (e:any )=> {
        this.textures[item.name] = e
      })
    })
  }
}
