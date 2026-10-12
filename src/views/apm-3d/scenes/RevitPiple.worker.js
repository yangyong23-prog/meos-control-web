import { mergeGeometries } from '@yushu/three-base/three-extends/jsm/utils/BufferGeometryUtils';
import { BufferAttribute } from '@yushu/three-base';
import { MeshBVH } from 'three-mesh-bvh';
import { genGeometry, genMatrix4, collectGeometryBuffer } from '@/views/GraphMVC/core/utils';

const addColorAttribute = (geometry, geometryArr) => {
    const { count } = geometry.attributes.normal;
    geometry.setAttribute('color', new BufferAttribute(new Float32Array(count * 4), 4)); // we'll change this color attribute
    geometry.cacheGroup = {};
    geometry.groups.forEach((o, i) => {
        const pipeId = geometryArr[i]._pipeId;
        const { cacheGroup } = geometry;
        if (!cacheGroup[pipeId]) cacheGroup[pipeId] = [];
        cacheGroup[pipeId].push(o);
    });
    geometry.clearGroups();
};
let isWorking = false,
    startWorkingTime = 0;
onmessage = event => {
    if (!event.data) return;
    const { channel, data, taskId } = event.data;
    const { geoArr, matrixArr, pipeIds, useColorAttr = false } = data?.data || {};
    switch (channel) {
        case 'task':
            startWorkingTime = Date.now();
            isWorking = true;
            // const { geoArr } = event.data;
            if (geoArr && geoArr.length) {
                const geometryArr = [];
                for (let i = 0; i < geoArr.length; i++) {
                    const geo = genGeometry(geoArr[i]);
                    const matrix = genMatrix4(matrixArr[i]);
                    // console.log('matrix: ', matrix);
                    if (geo) {
                        const newGeometry = geo.clone().applyMatrix4(matrix);
                        if (pipeIds) {
                            newGeometry._pipeId = pipeIds[i];
                        }
                        geometryArr.push(newGeometry);
                    }
                }

                // console.log('pipeGeos: ', geoArr);
                if (geometryArr.length > 0) {
                    // console.log('geometryArr: ', geometryArr);
                    const geometry = mergeGeometries(geometryArr, true);
                    if (!geometry) {
                        // console.log('geometryArr: ', geometryArr);
                        postMessage({ threadCode: 2, channel: 'task', taskId });
                        isWorking = false;
                        startWorkingTime = 0;
                        return;
                    }
                    if (useColorAttr) {
                        addColorAttribute(geometry, geometryArr);
                    }
                    const transferList = new Set();
                    collectGeometryBuffer(geometry, transferList);
                    const a = [...transferList];
                    geometry.computeBoundingSphere();
                    const {
                        center: { x, y, z },
                        radius
                    } = geometry.boundingSphere;
                    geometry.boundingSphereData = { center: { x, y, z }, radius };
                    const bvh = new MeshBVH(geometry);
                    const serialized = MeshBVH.serialize(bvh, { copyIndexBuffer: false });

                    try {
                        // postMessage({ geometry }, [...transferList]);
                        postMessage(
                            {
                                threadCode: 0,
                                channel: 'task',
                                taskId,
                                threadData: { data: { geometry, serialized } }
                            },
                            [...transferList, ...serialized.roots, serialized.index.buffer]
                        );
                    } catch (e) {
                        console.log('postMessageError', a[0].array, a[0].buffer, e);
                    }
                } else {
                    postMessage({ threadCode: 2, channel: 'task', taskId });
                }
            } else {
                postMessage({ threadCode: 2, channel: 'task', taskId });
            }
            isWorking = false;
            startWorkingTime = 0;
            break;
        case 'inspection':
            // console.log('inspection: ping-p');
            postMessage({
                threadCode: 0,
                channel: 'inspection',
                threadData: {
                    isWorking,
                    startWorkingTime,
                    workTimeElapse: isWorking ? Date.now() - startWorkingTime : 0
                }
            });
            break;
        default:
            break;
    }
};
