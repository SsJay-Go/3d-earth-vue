<script setup>
import { ref, computed, watch } from 'vue'
import * as THREE from 'three'
import { useLoader } from '@tresjs/core'
import { createCityCirclePlane, createLightPillar, createWaveMesh, lonLatToVector3, getCirclePoints, createAnimateLine } from "../utils/common";
import { earthConfig, fileSite } from '../assets/Data';

const props = defineProps({
    item: {
        type: Object,
        required: true
    }
})
const radius = earthConfig.earth.radius
/*  start city */
const { state: cityCirclePlaneTexture } = useLoader(THREE.TextureLoader, fileSite.label)
const startCoord = lonLatToVector3(radius, props.item.startArray.E, props.item.startArray.N);
//// start city circle plane 计算四元数
const startCityQuaternion = computed(() => {
    const startCoordVec3 = startCoord.clone().normalize()
    const circlePlanNormal = new THREE.Vector3(0, 0, 1); // 平面法线，向上
    const quaternion = new THREE.Quaternion().setFromUnitVectors(circlePlanNormal, startCoordVec3);
    return [quaternion.x, quaternion.y, quaternion.z, quaternion.w];
});
// start light pillar 
const height = radius * 0.3;
const { state: lightPillarTexture } = useLoader(THREE.TextureLoader, fileSite.light_column);
// wave circle
const { state: waveCircleTexture } = useLoader(THREE.TextureLoader, fileSite.aperture);

/* end city */
let endCityArray = ref([]);
for (let endCity of props.item.endArray) {
    const endCoord = lonLatToVector3(radius, endCity.E, endCity.N);
    const endCityQuaternion = computed(() => {
        const endCoordVec3 = endCoord.clone().normalize()
        const circlePlanNormal = new THREE.Vector3(0, 0, 1); // 平面法线，向上
        const quaternion = new THREE.Quaternion().setFromUnitVectors(circlePlanNormal, endCoordVec3);
        return [quaternion.x, quaternion.y, quaternion.z, quaternion.w];
    });
    endCityArray.value.push({ coord: endCoord, quaternion: endCityQuaternion });
}

</script>
<template>
    <!-- startCity -->
    <TresGroup name="cityCirclePlane">
        <TresMesh :scale="[radius * 0.05, radius * 0.05, radius * 0.05]"
            :position="[startCoord.x, startCoord.y, startCoord.z]" :quaternion="startCityQuaternion">
            <TresPlaneGeometry :args="[1, 1]" />
            <TresMeshBasicMaterial :color="earthConfig.punctuation.color" transparent :map="cityCirclePlaneTexture"
                :depthWrite="false" />
        </TresMesh>
    </TresGroup>>
    <TresGroup name="startLightPillar" :position="[startCoord.x, startCoord.y, startCoord.z]"
        :quaternion="startCityQuaternion">
        <TresMesh>
            <TresPlaneGeometry :args="[radius * 0.05, height]" :rotateX="Math.PI / 2" :translate="[0, 0, height / 10]" />
            <TresMeshBasicMaterial :map="lightPillarTexture" :color="earthConfig.punctuation.lightColumn.startColor"
                :transparent="true" :side="THREE.DoubleSide" :depthWrite="false" />
        </TresMesh>
        <!-- 第二个光柱 mesh，旋转 90 度 -->
        <TresMesh :rotation="[0, 0, Math.PI / 2]">
            <TresPlaneGeometry :args="[radius * 0.05, height]" :rotateX="Math.PI / 2" :translate="[0, 0, height / 10]" />
            <TresMeshBasicMaterial :map="lightPillarTexture" :color="earthConfig.punctuation.lightColumn.startColor"
                :transparent="true" :side="THREE.DoubleSide" :depthWrite="false" />
        </TresMesh>
    </TresGroup>
    <TresGroup name="startCityWaveCircle">
        //Mesh对象中userData 一个用于存储Object3D自定义数据的对象
        <TresMesh :position="[startCoord.x, startCoord.y, startCoord.z]" :scale="[radius * 0.12, radius * 0.12, radius * 0.12]"
            :quaternion="startCityQuaternion" :userData="{ 'size': radius * 0.12, 'scale': Math.random() * 1.0 }">
            <TresPlaneGeometry :args="[1, 1]" />
            <TresMeshBasicMaterial :color="0xe99f68" :map="waveCircleTexture" transparent :opacity="1"
                :depthWrite="false" />
        </TresMesh>
    </TresGroup>

    <!-- endCity -->
    <template v-for="endCity in endCityArray" :key="endCity.coord">
        <TresGroup name="cityCirclePlane">
            <TresMesh :scale="[radius * 0.05, radius * 0.05, radius * 0.05]"
                :position="[endCity.coord.x, endCity.coord.y, endCity.coord.z]" :quaternion="endCity.quaternion">
                <TresPlaneGeometry :args="[1, 1]" />
                <TresMeshBasicMaterial :color="earthConfig.punctuation.color" transparent :map="cityCirclePlaneTexture"
                    :depthWrite="false" />
            </TresMesh>
        </TresGroup>>
        <TresGroup name="startLightPillar" :position="[endCity.coord.x, endCity.coord.y, endCity.coord.z]"
            :quaternion="endCity.quaternion">
            <TresMesh>
                <TresPlaneGeometry :args="[radius * 0.05, height]" :rotateX="Math.PI / 2" :translate="[0, 0, height / 10]" />
                <TresMeshBasicMaterial :map="lightPillarTexture" :color="earthConfig.punctuation.lightColumn.endColor"
                    :transparent="true" :side="THREE.DoubleSide" :depthWrite="false" />
            </TresMesh>
            <!-- 第二个光柱 mesh，旋转 90 度 -->
            <TresMesh :rotation="[0, 0, Math.PI / 2]">
                <TresPlaneGeometry :args="[radius * 0.05, height]" :rotateX="Math.PI / 2" :translate="[0, 0, height / 10]" />
                <TresMeshBasicMaterial :map="lightPillarTexture" :color="earthConfig.punctuation.lightColumn.endColor"
                    :transparent="true" :side="THREE.DoubleSide" :depthWrite="false" />
            </TresMesh>
        </TresGroup>
        <TresGroup name="startCityWaveCircle">
            <TresMesh :position="[endCity.coord.x, endCity.coord.y, endCity.coord.z]"
                :scale="[radius * 0.12, radius * 0.12, radius * 0.12]" :quaternion="endCity.quaternion"
                :userData="{ 'size': radius * 0.12, 'scale': Math.random() * 1.0 }">
                <TresPlaneGeometry :args="[1, 1]" />
                <TresMeshBasicMaterial :color="0xe99f68" :map="waveCircleTexture" transparent :opacity="1"
                    :depthWrite="false" />
            </TresMesh>
        </TresGroup>
    </template>
</template>