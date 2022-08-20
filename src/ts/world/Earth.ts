import {
  BufferAttribute, BufferGeometry, Color, DoubleSide, Group, Mesh, MeshBasicMaterial, NormalBlending,
  Object3D,
  Points, PointsMaterial, RepeatWrapping, ShaderMaterial,
  SphereBufferGeometry, Sprite, SpriteMaterial, Texture, TextureLoader, Vector3
} from "three";

import {
  CSS2DObject,
  CSS2DRenderer,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";
import html2canvas from "html2canvas";

import earthVertex from '../../shaders/earth/vertex.vs';
import earthFragment from '../../shaders/earth/fragment.fs';
import { createAnimateLine, createLightPillar, createPointMesh, createWaveMesh, getCirclePoints, lon2xyz } from "../Utils/common";
import { flyArc } from "../Utils/arc";

export type punctuation = {
  circleColor: number,
  lightColumn: {
    startColor: number, // 起点颜色
    endColor: number, // 终点颜色
  },
}

type options = {
  data: {
    startArray: {
      name: string,
      E: number, // 经度
      N: number, // 维度
    },
    endArray: {
      name: string,
      E: number, // 经度
      N: number, // 维度
    }[]
  }[]
  dom: HTMLElement,
  textures: Record<string, Texture>, // 贴图
  labelType: number, // 0 css2d 文字内容会一直在最前面 1 sprite 文字内容可以被物体遮挡
  earth: {
    radius: number, // 地球半径
    earthTime: number, // 地球旋转多长时间 0 是一直旋转
    rotateEnabled: boolean, // 是否自动旋转
    rotateSpeed: number, // 地球旋转速度
  }
  satellite: {
    show: boolean, // 是否显示卫星
    rotateSpeed: number, // 旋转速度
    size: number, // 卫星大小
    number: number, // 一个圆环几个球
  },
  punctuation: punctuation,
  flyLine: {
    showAircraft: boolean, // 是否显示飞机
    color: number, // 飞线的颜色
    showLine: boolean, // 是否显示飞机拖尾线
    speed: number, // 飞机拖尾线速度
    colorStart: number, // 飞机拖尾线起点颜色
    colorEnd: number, // 飞机拖尾线终点颜色
  },
}
type uniforms = {
  glowColor: { value: Color; }
  scale: { type: string; value: number; }
  bias: { type: string; value: number; }
  power: { type: string; value: number; }
  time: { type: string; value: any; }
  isHover: { value: boolean; };
  map: { value: Texture }
}

export default class earth {

  public group: Group;

  public around: BufferGeometry
  public aroundPoints: Points<BufferGeometry, PointsMaterial>;

  public options: options;
  public uniforms: uniforms
  public timeValue: number;

  public earth: Mesh<SphereBufferGeometry, ShaderMaterial>;
  public punctuationMaterial: MeshBasicMaterial;
  public markupPoint: Group;
  public waveMeshArr: Object3D[];

  public labelRenderer: CSS2DRenderer;

  public circleLineList: any[];
  public circleList: any[];
  public x: number;
  public n: number;

  constructor(options: options) {

    this.options = options;

    this.group = new Group()
    this.group.name = "EarthGroup";
    this.group.scale.set(0, 0, 0)

    // 星空效果
    this.around = new BufferGeometry()

    // 标注点效果
    this.markupPoint = new Group()
    this.markupPoint.name = "markupPoint"
    this.waveMeshArr = []

    // 卫星和标签
    this.circleLineList = []
    this.circleList = [];
    this.x = 0;
    this.n = 0;

    // 扫光动画 shader
    this.timeValue = 100
    this.uniforms = {
      glowColor: {
        value: new Color(0x0cd1eb),
      },
      scale: {
        type: "f",
        value: -1.0,
      },
      bias: {
        type: "f",
        value: 1.0,
      },
      power: {
        type: "f",
        value: 3.3,
      },
      time: {
        type: "f",
        value: this.timeValue,
      },
      isHover: {
        value: false,
      },
      map: {
        value: null,
      },
    };

  }

  async init(): Promise<void> {
    return new Promise(resolve => {

      console.log(111)

      this.createStars(); // 添加星星
      this.createEarth(); // 创建地球
      this.createEarthAperture() // 创建地球光晕
      this.createEarthGlow() // 创建地球的大气层辉光
      this.createMarkupPoint() // 创建标记点

      this.options.labelType === 0 ? this.createCss2DLabel() : this.createSpriteLabel()

      // this.createFlyLine() // 创建飞线
      // this.createAnimateCircle() // 创建环绕卫星
      this.show()
      resolve()
    })
  }

  createEarth() {
    const earth_geometry = new SphereBufferGeometry(
      this.options.earth.radius,
      50,
      50
    );

    const earth_border = new SphereBufferGeometry(
      this.options.earth.radius + 10,
      60,
      60
    );

    const pointMaterial = new PointsMaterial({
      color: 0x81ffff, //设置颜色，默认 0xFFFFFF
      transparent: true,
      sizeAttenuation: true,
      opacity: 0.1,
      vertexColors: false, //定义材料是否使用顶点颜色，默认false ---如果该选项设置为true，则color属性失效
      size: 0.01, //定义粒子的大小。默认为1.0
    })
    const points = new Points(earth_border, pointMaterial); //将模型添加到场景

    this.group.add(points);

    this.options.textures.earth.wrapS = this.options.textures.earth.wrapT =
      RepeatWrapping;
    this.uniforms.map.value = this.options.textures.earth;

    const earth_material = new ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: earthVertex,
      fragmentShader: earthFragment,
    });

    earth_material.needsUpdate = true;
    this.earth = new Mesh(earth_geometry, earth_material);
    this.earth.castShadow = true;
    this.earth.receiveShadow = true;
    this.earth.name = "earth";
    // this.earth.layers = this.bloomLayer;
    this.group.add(this.earth);

    // flyArcGroup.traverse((item) => {
    //   if (item.name == "飞机") {
    //     item.material.map = this.textureObject.aircraft;
    //     this.aircraft.push(item);
    //   }
    //   if (item.name == "飞行线") {
    //     item.material.map = this.textureObject.gradient;
    //   }
    // });

  }

  createStars() {

    const vertices = []
    const colors = []
    for (let i = 0; i < 500; i++) {
      const vertex = new Vector3();
      vertex.x = 800 * Math.random() - 300;
      vertex.y = 800 * Math.random() - 300;
      vertex.z = 800 * Math.random() - 300;
      vertices.push(vertex.x, vertex.y, vertex.z);
      colors.push(new Color(1, 1, 1));
    }

    this.around.setAttribute("position", new BufferAttribute(new Float32Array(vertices), 3));
    this.around.setAttribute("color", new BufferAttribute(new Float32Array(colors), 3));

    const aroundMaterial = new PointsMaterial({
      size: 2,
      sizeAttenuation: true, // 尺寸衰减
      color: 0x4d76cf,
      transparent: true,
      opacity: 1,
      map: this.options.textures.gradient,
    });

    this.aroundPoints = new Points(this.around, aroundMaterial);
    this.aroundPoints.name = "星空";
    this.aroundPoints.scale.set(0.5, 0.5, 0.5);
    this.group.add(this.aroundPoints);
  }

  createEarthAperture() {
    const R = this.options.earth.radius; //地球半径

    // TextureLoader创建一个纹理加载器对象，可以加载图片作为纹理贴图
    const texture = this.options.textures.earth_aperture; //加载纹理贴图

    // 创建精灵材质对象SpriteMaterial
    const spriteMaterial = new SpriteMaterial({
      map: texture, //设置精灵纹理贴图
      color: 0x4390d1,
      transparent: true, //开启透明
      opacity: 0.7, //可以通过透明度整体调节光圈
      depthWrite: false, //禁止写入深度缓冲区数据
    });

    // 创建表示地球光圈的精灵模型
    const sprite = new Sprite(spriteMaterial);
    sprite.scale.set(R * 3.0, R * 3.0, 1); //适当缩放精灵
    this.group.add(sprite);
  }

  createEarthGlow() {

    const vertexShader = [
      "varying vec3	vVertexWorldPosition;",
      "varying vec3	vVertexNormal;",
      "varying vec4	vFragColor;",
      "void main(){",
      "	vVertexNormal	= normalize(normalMatrix * normal);", //将法线转换到视图坐标系中
      "	vVertexWorldPosition	= (modelMatrix * vec4(position, 1.0)).xyz;", //将顶点转换到世界坐标系中
      "	// set gl_Position",
      "	gl_Position	= projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
      "}",
    ].join("\n");

    //大气层效果
    const AeroSphere = {
      uniforms: {
        coeficient: {
          type: "f",
          value: 1.0,
        },
        power: {
          type: "f",
          value: 2,
        },
        glowColor: {
          type: "c",
          value: new Color(0x4390d1),
        },
      },
      vertexShader: vertexShader,
      fragmentShader: [
        "uniform vec3	glowColor;",
        "uniform float	coeficient;",
        "uniform float	power;",

        "varying vec3	vVertexNormal;",
        "varying vec3	vVertexWorldPosition;",

        "varying vec4	vFragColor;",

        "void main(){",
        "	vec3 worldCameraToVertex= vVertexWorldPosition - cameraPosition;", //世界坐标系中从相机位置到顶点位置的距离
        "	vec3 viewCameraToVertex	= (viewMatrix * vec4(worldCameraToVertex, 0.0)).xyz;", //视图坐标系中从相机位置到顶点位置的距离
        "	viewCameraToVertex	= normalize(viewCameraToVertex);", //规一化
        "	float intensity		= pow(coeficient + dot(vVertexNormal, viewCameraToVertex), power);",
        "	gl_FragColor		= vec4(glowColor, intensity);",
        "}",
      ].join("\n"),
    };
    //球体 辉光 大气层
    const material1 = new ShaderMaterial({
      uniforms: AeroSphere.uniforms,
      vertexShader: AeroSphere.vertexShader,
      fragmentShader: AeroSphere.fragmentShader,
      blending: NormalBlending,
      transparent: true,
      depthWrite: false,
    });
    const sphere = new SphereBufferGeometry(
      this.options.earth.radius + 0,
      50,
      50
    );
    const mesh = new Mesh(sphere, material1);
    this.group.add(mesh);
  }

  createMarkupPoint() {

    this.options.data.forEach((item) => {
      const radius = this.options.earth.radius;
      const lon = item.startArray.E; //经度
      const lat = item.startArray.N; //纬度

      this.punctuationMaterial = new MeshBasicMaterial({
        color: this.options.punctuation.circleColor,
        map: this.options.textures.label,
        transparent: true, //使用背景透明的png贴图，注意开启透明计算
        depthWrite: false, //禁止写入深度缓冲区数据
      });

      const mesh = createPointMesh({ radius, lon, lat, material: this.punctuationMaterial }); //光柱底座矩形平面
      this.markupPoint.add(mesh);
      const LightPillar = createLightPillar({
        radius: this.options.earth.radius,
        lon,
        lat,
        index: 0,
        textures: this.options.textures,
        punctuation: this.options.punctuation,
      }); //光柱
      this.markupPoint.add(LightPillar);
      const WaveMesh = createWaveMesh({ radius, lon, lat, textures: this.options.textures }); //波动光圈
      this.markupPoint.add(WaveMesh);
      this.waveMeshArr.push(WaveMesh);
      item.endArray.forEach((obj) => {
        const lon = obj.E; //经度
        const lat = obj.N; //纬度
        const mesh = createPointMesh({ radius, lon, lat, material: this.punctuationMaterial }); //光柱底座矩形平面
        this.markupPoint.add(mesh);
        const LightPillar = createLightPillar({
          radius: this.options.earth.radius,
          lon,
          lat,
          index: 1,
          textures: this.options.textures,
          punctuation: this.options.punctuation
        }); //光柱
        this.markupPoint.add(LightPillar);
        const WaveMesh = createWaveMesh({ radius, lon, lat, textures: this.options.textures }); //波动光圈
        this.markupPoint.add(WaveMesh);
        this.waveMeshArr.push(WaveMesh);
      });
      this.group.add(this.markupPoint);
    });
  }

  createCss2DLabel() {

    this.options.data.forEach((item) => {
      let cityArry = [];
      cityArry.push(item.startArray);
      cityArry = cityArry.concat(...item.endArray);
      cityArry.forEach((e) => {
        const p = lon2xyz(this.options.earth.radius * 1.001, e.E, e.N);
        const earthDiv = document.createElement("div");
        earthDiv.className = "css3d-monitor"; // 添加class类名
        earthDiv.innerHTML = `
        <div class="fire-div">
          ${e.name}
        </div>`;
        const popLabel = new CSS2DObject(earthDiv);
        popLabel.scale.set(0.1, 0.1, 0.1);
        popLabel.rotateY(Math.PI);
        popLabel.position.set(p.x * 1.05, p.y * 1.05, p.z * 1.05);
        this.earth.add(popLabel);
        this.labelRenderer = new CSS2DRenderer()
        this.labelRenderer.setSize(window.innerWidth, window.innerHeight)
        this.labelRenderer.domElement.style.position = "absolute"
        this.labelRenderer.domElement.style.top = '0'
        this.labelRenderer.domElement.className = "css3d-wapper"
        this.options.dom.appendChild(this.labelRenderer.domElement)
      });
    });
  }

  createSpriteLabel() {

    this.options.data.forEach((item) => {
      let cityArry = [];
      cityArry.push(item.startArray);
      cityArry = cityArry.concat(...item.endArray);
      cityArry.forEach((e) => {
        const p = lon2xyz(this.options.earth.radius * 1.001, e.E, e.N);
        const div = `<div class="fire-div">${e.name}</div>`;
        const shareContent = document.getElementById("html2canvas");
        shareContent.innerHTML = div;
        const opts = {
          backgroundColor: null, // 背景透明
          scale: 6,
          dpi: window.devicePixelRatio,
        };
        html2canvas(document.getElementById("html2canvas"), opts).then(
          (canvas) => {
            const dataURL = canvas.toDataURL("image/png");
            const map = new TextureLoader().load(dataURL);
            const material = new SpriteMaterial({
              map: map,
              transparent: true,
            });
            const sprite = new Sprite(material);
            const len = 5 + (e.name.length - 2) * 2;
            sprite.scale.set(len, 3, 1);
            sprite.position.set(p.x * 1.1, p.y * 1.1, p.z * 1.1);
            this.earth.add(sprite);
          }
        );
      });
    });
  }

  createAnimateCircle() {
    // 创建 圆环 点
    const list = getCirclePoints({
      radius: this.options.earth.radius + 15,
      number: 150, //切割数
      closed: true, // 闭合
    });
    const mat = new MeshBasicMaterial({
      color: "#0c3172",
      transparent: true,
      opacity: 0.4,
      side: DoubleSide,
    });
    const line = createAnimateLine({
      type: "pipe",
      pointList: list,
      material: mat,
      number: 100,
      radius: 0.1,
    });
    this.group.add(line);

    const l2 = line.clone();
    l2.scale.set(1.2, 1.2, 1.2);
    l2.rotateZ(Math.PI / 6);
    this.group.add(l2);

    const l3 = line.clone();
    l3.scale.set(0.8, 0.8, 0.8);
    l3.rotateZ(-Math.PI / 6);
    this.group.add(l3);

    /**
     * 旋转的球
     */
    const ball = new Mesh(
      new SphereBufferGeometry(this.options.satellite.size, 32, 32),
      new MeshBasicMaterial({
        color: "#e0b187", // 745F4D
      })
    );

    const ball2 = new Mesh(
      new SphereBufferGeometry(this.options.satellite.size, 32, 32),
      new MeshBasicMaterial({
        color: "#628fbb", // 324A62
      })
    );

    const ball3 = new Mesh(
      new SphereBufferGeometry(this.options.satellite.size, 32, 32),
      new MeshBasicMaterial({
        color: "#806bdf", //6D5AC4
      })
    );

    this.circleLineList.push(line, l2, l3);
    ball.name = "卫星";
    ball2.name = "卫星";
    ball3.name = "卫星";
    // ball.layers = this.bloomLayer;
    // ball2.layers = this.bloomLayer;
    // ball3.layers = this.bloomLayer;

    for (let i = 0; i < this.options.satellite.number; i++) {
      // const ball01 = ball.clone();
      console.log(this.options.satellite.number, list.length)
      // const num = parseInt(list.length / this.options.satellite.number);
      // ball01.position.set(
      //   list[num * (i + 1)][0] * 1,
      //   list[num * (i + 1)][1] * 1,
      //   list[num * (i + 1)][2] * 1
      // );
      // line.add(ball01);

      // const ball02 = ball2.clone();
      // const num02 = parseInt(list.length / this.options.satellite.number);
      // ball02.position.set(
      //   list[num02 * (i + 1)][0] * 1,
      //   list[num02 * (i + 1)][1] * 1,
      //   list[num02 * (i + 1)][2] * 1
      // );
      // l2.add(ball02);

      // const ball03 = ball2.clone();
      // const num03 = parseInt(list.length / this.options.satellite.number);
      // ball03.position.set(
      //   list[num03 * (i + 1)][0] * 1,
      //   list[num03 * (i + 1)][1] * 1,
      //   list[num03 * (i + 1)][2] * 1
      // );
      // l3.add(ball03);
    }
  }

  // createFlyLine() {
  //   const flyArcGroup = new Group();
  //   const flyArr = []

  //   this.options.data.forEach((item) => {
  //     item.endArray.forEach((coord) => {
  //       //   /*调用函数flyArc绘制球面上任意两点之间飞线圆弧轨迹*/
  //       const arcline = flyArc(
  //         this.options.earth.radius,
  //         item.startArray.E,
  //         item.startArray.N,
  //         coord.E,
  //         coord.N
  //       );

  //       const material = new MeshBasicMaterial({
  //         side: DoubleSide,
  //         transparent: true,
  //       });
  //       const mesh = new Mesh(new PlaneGeometry(5, 5), material);
  //       // mesh.positionCount = 0;
  //       // mesh.positionVertices = arcline.geometry.vertices;
  //       mesh.position.copy(arcline.geometry.vertices[10]);
  //       mesh.rotateY(Math.PI / 2);
  //       mesh.rotateX(360);
  //       mesh.name = "飞机";
  //       if (this.options.flyLine.showAircraft) {
  //         arcline.add(mesh);
  //       }

  //       flyArcGroup.add(arcline); //飞线插入flyArcGroup中
  //       // flyArr.push(arcline.flyLine); //获取飞线段
  //     });
  //   })




  //   // this.group.add(flyArcGroup);
  // }

  show() {
    this.group.scale.set(1, 1, 1)
  }

  render() {

    // console.log('render', this.timeValue)
    // console.log(this.uniforms.time.value)
    this.uniforms.time.value =
      this.uniforms.time.value < -this.timeValue
        ? this.timeValue
        : this.uniforms.time.value - 1;
  }

}