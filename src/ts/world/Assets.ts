/**
 * 资源文件
 * 把模型和图片分开进行加载
 */

interface ITextures {
  name: string
  url: string
}

export interface IResources {
  textures?: ITextures[],
}

const filePath = './images/earth/'
const fileSuffix = [
  'gradient',
  'redCircle',
  "label",
  "aperture",
  'glow',
  'light_column',
  'aircraft'
]

const textures = fileSuffix.map(item => {
  return {
    name: item,
    url: filePath + item + '.png'
  }
})

textures.push({
  name: 'earth',
  url: filePath + 'earth.jpg'
})

const resources: IResources = {
  textures
}


export {
  resources
}