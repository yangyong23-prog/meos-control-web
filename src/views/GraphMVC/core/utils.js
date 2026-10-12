import * as THREE from '@yushu/three-base';
import * as _ from 'lodash';
/**
 * 包装一层div
 * @param {*} dom
 * @returns
 */
export const wrapperDom = dom => {
    const wrapper = document.createElement('div');
    wrapper.style.pointerEvents = 'none';
    wrapper.appendChild(dom);
    return wrapper;
};

export const shiftAdd = (orignalState, state) => {
    let mOrignalState = orignalState;
    mOrignalState |= state;
    return mOrignalState;
};

export const shiftRemove = (orignalState, state) => {
    let mOrignalState = orignalState;
    mOrignalState &= ~state;
    return mOrignalState;
};

export const buildFlatSpace = (arr, acc = []) => {
    // 处理地图空间数据
    arr.forEach(res => {
        const isLeaf = !(res.children && res.children.length); // 是否是叶子节点
        // eslint-disable-next-line eqeqeq
        if (res.objType == 'space') {
            const modelData = {
                ...res,
                objType: res.objType
            };
            acc.push(modelData);
        }
        if (!isLeaf) buildFlatSpace(res.children, acc);
    });
    return acc;
};

export const buildFlatEquipment = (arr, acc = []) => {
    // 处理设备数据
    arr.forEach(({ children, instanceList }) => {
        const isLeaf = !(children && children.length); // 是否是叶子节点
        if (instanceList && instanceList.length > 0) {
            instanceList.forEach(data => {
                const modelData = {
                    ...data
                };
                acc.push(modelData);
            });
        }
        if (!isLeaf) buildFlatEquipment(children, acc);
    });
    return acc;
};
export const mergeUnionFun = (objValue, srcValue) => {
    if (_.isArray(objValue, srcValue)) {
        return _.union(objValue, srcValue);
    }
    if (typeof objValue === 'object' && typeof srcValue === 'object') {
        return _.mergeWith(objValue, srcValue, mergeUnionFun);
    }
    return srcValue;
};
export const deepDiffBetweenObjects = (object, base) => {
    const changes = (object, base) =>
        _.transform(object, (result, value, key) => {
            if (!_.isEqual(value, base ? base[key] : undefined)) {
                if (_.isArray(value)) {
                    result[key] = _.difference(value, base[key]);
                } else if (_.isObject(value) && _.isObject(base[key])) {
                    result[key] = changes(value, base[key]);
                } else {
                    result[key] = value;
                }
            }
        });
    return changes(object, base);
};

// 创建几何
export const genGeometry = geoInfo => {
    const {
        attributes: { position, uv, normal, color },
        index,
        boundingSphereData
    } = geoInfo;
    const attributes = {
        position: new THREE.BufferAttribute(position.array, position.itemSize, position.normalized),

        normal: new THREE.BufferAttribute(normal.array, normal.itemSize, normal.normalized)
    };
    if (uv) {
        attributes.uv = uv ? new THREE.BufferAttribute(uv.array, uv.itemSize, uv.normalized) : uv;
    }
    if (color) {
        attributes.color = color ? new THREE.BufferAttribute(color.array, color.itemSize, color.normalized) : color;
    }
    const geom = new THREE.BufferGeometry();
    geom.attributes = attributes;
    if (boundingSphereData) {
        const {
            center: { x, y, z },
            radius
        } = boundingSphereData;
        geom.boundingSphere = new THREE.Sphere(new THREE.Vector3(x, y, z), radius);
    }
    geom.index = index ? new THREE.BufferAttribute(index.array, index.itemSize, index.normalized) : null;
    return geom;
};

// 创建Matrix4
export const genMatrix4 = value => {
    const { elements } = value;
    const m = new THREE.Matrix4();
    m.fromArray(elements);
    return m;
};

// 收集Three BufferGeometry 对象的ArrayBuffer 属性，
// 主要用在Worker中，postMessage时 传引用
export const collectGeometryBuffer = (geo, setObj) => {
    const {
        attributes: { position, uv, normal, color },
        index
    } = geo;
    const attrs = {
        position,
        uv,
        normal,
        index,
        color
    };
    Object.values(attrs).forEach(val => {
        if (val && val.array?.buffer) {
            setObj.add(val.array.buffer);
        }
    });
};
