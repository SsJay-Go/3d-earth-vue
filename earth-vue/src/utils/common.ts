import * as THREE from "three";
import { punctuation } from "../world/Earth";
// 城市的光圈平面
export const createCityCirclePlane = (radius: number, lon: number, lat: number, material: THREE.MeshBasicMaterial ) => {
    const geometry = new THREE.PlaneGeometry(1, 1);
    const mesh = new THREE.Mesh(geometry, material);
    // 经纬度转球面坐标
    const coord = lonLatToVector3(radius, lon, lat);
    const size = radius * 0.05; // 平面大小
    mesh.scale.set(size, size, size);

    // 设置平面位置
    mesh.position.set(coord.x, coord.y, coord.z);
    const coordVec3 = new THREE.Vector3(coord.x, coord.y, coord.z).normalize();  // 归一化坐标
    const meshNormal = new THREE.Vector3(0, 0, 1); // 平面法线向上
    mesh.quaternion.setFromUnitVectors(meshNormal, coordVec3); // 设置平面朝向
    return mesh;
}

export const createLightPillar = (opation: {radius: number, lon: number, lat: number, index: number, textures: Record<string, THREE.Texture>, punctuation: punctuation}) => {
    const height = opation.radius * 0.3; 
    const geometry = new THREE.PlaneGeometry(opation.radius * 0.05, height);
    geometry.rotateX(Math.PI / 2); // 将平面旋转90度，使其垂直于地球表面
    geometry.translate(0, 0, height / 2); // 将平面位置调整到地球表面上方
    const material = new THREE.MeshBasicMaterial({
        map: opation.textures.light_column,
        color: opation.index === 0 ? opation.punctuation.lightColumn.startColor : opation.punctuation.lightColumn.endColor,
        transparent: true,
        side: THREE.DoubleSide, // 双面渲染
        depthWrite: false, // 不写入深度缓冲区
    });
    const mesh = new THREE.Mesh(geometry, material);
    const group = new THREE.Group();
    group.add(mesh, mesh.clone().rotateZ(Math.PI / 2)); // 添加两个平面，分别朝向两侧

    // 经纬度转球面坐标
    const coord = lonLatToVector3(opation.radius, opation.lon, opation.lat);
    group.position.set(coord.x, coord.y, coord.z);
    const coordVec3 = new THREE.Vector3(coord.x, coord.y, coord.z).normalize(); 
    const meshNormal = new THREE.Vector3(0, 0, 1); // 平面法线向上
    group.quaternion.setFromUnitVectors(meshNormal, coordVec3); // 设置平面
    return group;
    
}

export const createWaveMesh = (opation: {radius:number, lon:number, lat:number, textures:Record<string, THREE.Texture>}) => {
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({
        color: 0xe99f68,
        map: opation.textures.aperture,
        transparent: true,
        opacity: 1,
        depthWrite: false
    });
    const mesh = new THREE.Mesh(geometry, material);
    // 经纬度转球面坐标
    const coord = lonLatToVector3(opation.radius, opation.lon, opation.lat);
    const size = opation.radius * 0.12; // 平面大小
    mesh.scale.set(size, size, size);
    //userData 一个用于存储Object3D自定义数据的对象
    mesh.userData['size'] = size;
    mesh.userData['scale'] = Math.random() * 1.0;

    mesh.position.set(coord.x, coord.y, coord.z);
    const coordVec3 = new THREE.Vector3(coord.x, coord.y, coord.z).normalize();  // 归一化坐标
    const meshNormal = new THREE.Vector3(0, 0, 1); // 平面法线向上
    mesh.quaternion.setFromUnitVectors(meshNormal, coordVec3); // 设置平面朝向
    return mesh;
}

/**
 * 经纬度坐标转球面坐标  
 * @param {经度(角度值)} longitude 
 * @param {维度(角度值)} latitude
 *  */  
export function lonLatToVector3(radius: number, longitude: number, latitude: number) {
    let lon = longitude * Math.PI / 180; // 将经度转换为弧度
    let lat = latitude * Math.PI / 180; // 将纬度转换为弧度
    lon = -lon; // 因为threejs的坐标系z轴向前，对应经度-90度，而不是90度
    //球面坐标可以通过以下公式转换为笛卡尔坐标
    const x = radius * Math.cos(lat) * Math.cos(lon);
    const y = radius * Math.sin(lat);
    const z = radius * Math.cos(lat) * Math.sin(lon);
    return new THREE.Vector3(x, y, z);
}
// 生成圆环路径的点位
export const getCirclePoints = (obj: {radius:number, number:number, close:boolean}) => {
    const list:THREE.Vector3[] = [];
    for(let i = 0; i <= 2 * Math.PI; i += 2 * Math.PI / (obj.number || 100)) {
        list.push(new THREE.Vector3(
            parseFloat((Math.cos(i) * (obj.radius || 10)).toFixed(2)),
            0,
            parseFloat((Math.sin(i) * (obj.radius || 10)).toFixed(2))
        ));
    }
    if(obj.close) list.push(list[0]);
    return list; 
}
/** 
 * 创建线
 * @param radialSegments:表面细分
 * */ 
export const createAnimateLine = (obj: {pointList:THREE.Vector3[], radius:number, number:number, radialSegments:number, material:THREE.MeshBasicMaterial}) => {
    const list:THREE.Vector3[] = [];
    obj.pointList.forEach((item) => list.push(item));
    const curve = new THREE.CatmullRomCurve3(list);

    // 构建平滑管道体
    const tubeGeometry = new THREE.TubeGeometry(
        curve,
        obj.number ||50,
        obj.radius || 1,
        obj.radialSegments,
    );
    return new THREE.Mesh(tubeGeometry, obj.material)
}