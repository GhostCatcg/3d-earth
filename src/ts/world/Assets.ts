/**
 * 资源文件
 * 把模型和图片分开进行加载
 */

import { Material } from "three"

interface ITextures {
  name: string
  url: string
}

export interface IResources {
  textures?: ITextures[],
  models?: Material,
}

const filePath = './images/earth/'
const fileSuffix = [
  'gradient',
  'redCircle',
  "label",
  "aperture",
  'earth_aperture',
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