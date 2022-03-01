/**
 * 资源文件
 * 把模型和图片分开进行加载
 */

interface ITextures {
  chinese_name:string
  name:string
  path:string
}

interface IResources {
  textures?: ITextures[],
  models?: any,
}
const resources: IResources = {
  textures: [
    {
      chinese_name: '科技地球',
      name: 'earth',
      path: './images/textures/earth.png'
    },
    {
      chinese_name: '海洋',
      name: 'ocean',
      path: './images/textures/ocean.png'
    },
    {
      chinese_name: '房间',
      name: 'room',
      path: './images/textures/room.png'
    }
  ]
}
export {
  resources
}