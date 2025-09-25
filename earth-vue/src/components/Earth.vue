<script setup >
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { extend, useTres, useLoader, useLoop  } from '@tresjs/core'
import { reactive, onMounted, shallowRef, watch, computed } from 'vue'
import { TextureLoader, Color, Vector3, BufferAttribute, AdditiveBlending } from 'three'
import {fileSite, earthConfig, citySite} from '../assets/Data'
import earthVertex from "../assets/shaders/vertex.vs?raw"
import earthFragment from "../assets/shaders/fragment.fs?raw";
import apertureVertex from "../assets/shaders/apertureVertex.vs?raw"
import apertureFragment from "../assets/shaders/apertureFragment.fs?raw"
/* 创建 threejs四大天王 的工作，在 TresJS 中场景已经封装好了， 场景、相机、渲染器(在TresJS中为TresCanvas)、控制器 */ 
extend({ OrbitControls })   // 将OrbitControls注册为TresJS的组件
const { camera, renderer } = useTres() // 获取TresJS中的相机和渲染器

/* 创建地球相关 */
const earthRef = shallowRef(null)  // 地球的Group
const { state:earthTexture, isLoading, error } = useLoader(TextureLoader, fileSite.earth);
// 自定义着色器材质
const shader =computed(() => ({
    uniforms: {
        glowColor: {value:new Color(0x0cd1eb)},
        scale: {value:-1.0},
        bias: {value: 1.0},
        power: {value:3.3},
        time: {value:100},
        isHover: {value:false},
        map: {value: earthTexture.value}
    },
    vertexShader: earthVertex,
    fragmentShader: earthFragment,
}));

    //地球辉光
const { state:glowTexture } = useLoader(TextureLoader, fileSite.redCircle);
    // 大气层效果
const aerosphere =  {
    uniforms: {
        coeficient: { value: 1.0 },
        power: { value: 3.0 },
        glowColor: { value: new Color(0x4390d1) },
    },
    vertexShader: apertureVertex,
    fragmentShader: apertureFragment,
    blending: AdditiveBlending,  // 混合模式
    transparent: true,
    depthWrite: false, 
};
/* 创建星空相关 */
const { state:gradient } = useLoader(TextureLoader, fileSite.gradient);
const vertices = reactive([]); // 存储星星顶点数据
const colors = reactive([]); // 存储星星颜色数据
for (let i=0; i< 500; i++) {
    const vertex = new Vector3();
    vertex.x = 800 * Math.random() - 300;
    vertex.y = 800 * Math.random() - 300;
    vertex.z = 800 * Math.random() - 300;
    vertices.push(vertex.x, vertex.y, vertex.z);
    colors.push(1, 1, 1);
}
const starPosition = new Float32Array(vertices);
const starColor = new Float32Array(colors);

/* 创建城市标签 */

</script>
<template>
    <TresPerspectiveCamera :position="[0, 30, -250]" :args="[45, 1, 1, 100000]" />
    <TresOrbitControls v-if="renderer" :args="[camera, renderer?.domElement]" />
    
    <TresGroup :ref="earthRef" >
        <!-- 创建地球球体 -->
        <TresMesh :position="[0, 2, 0]">
            <TresSphereGeometry :args="[earthConfig.earth.radius, 64, 64]" />
            <TresShaderMaterial v-if="earthTexture" v-bind="shader" :needsUpdate="true"/>
            <!-- <TresMeshBasicMaterial v-if="earthTexture" :map="earthTexture"/> --> 
        </TresMesh>
        <!-- 创建球体外侧描点 -->
         <TresPoints>
            <TresSphereGeometry :args="[earthConfig.earth.radius + 10, 64, 64]" />
            <!-- sizeAttenuation: 是否根据相机距离缩放点的大小   vertexColors:是否使用顶点颜色 默认false 如果该选项设置为true，则color属性失效-->
            <TresPointsMaterial :size="0.01" color="#81ffff" :transparent="true" :opacity="0.1" :sizeAttenuation="true" :vertexColors="false"/>
         </TresPoints>
         <!-- 创建地球辉光 -->
          <TresSprite :scale="[earthConfig.earth.radius * 3, earthConfig.earth.radius * 3, 1]">
                <!-- depthWrite: 渲染时不写入深度缓冲区-->
            <TresSpriteMaterial v-if="glowTexture" color="#4390d1" :map="glowTexture" :transparent="true" :opacity="0.2" :depthWrite="false"/>
          </TresSprite>
          <!-- 创建地球大气层效果 -->
            <TresMesh >
                <TresSphereGeometry :args="[earthConfig.earth.radius + 2, 50, 50]" />
                <TresShaderMaterial v-bind="aerosphere"/>
            </TresMesh>
    </TresGroup>
    
    <!-- 创建星空 -->
     <TresPoints>
        <TresBufferGeometry :position="[starPosition, 3]" :color="[starColor, 3]" />
        <TresPointsMaterial v-if="gradient" :size="2" color="#4d76cf" :transparent="true" :opacity="1" :sizeAttenuation="true" :map="gradient"/>
     </TresPoints>
     <!-- 创建城市标识点 -->
      <TresSprite v-for="city in citySite">

      </TresSprite>
</template>