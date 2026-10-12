import { baseUtils, Vector3, CurvePath, LineCurve3, TubeGeometry, SphereGeometry, Matrix4 } from '@yushu/three-base';
import { mergeGeometries } from '@yushu/three-base/three-extends/jsm/utils/BufferGeometryUtils';
import { MeshBVH } from 'three-mesh-bvh';
import { collectGeometryBuffer } from '@/views/GraphMVC/core/utils';

const { MM2FOOT } = baseUtils;
const thickness = 0.3;
const bigThickness = thickness * 2;

const createPipe = line => {
    const first = line[0];
    const v1 = new Vector3(first.X * MM2FOOT, first.Z * MM2FOOT, -first.Y * MM2FOOT);
    const second = line[1];
    const v2 = new Vector3(second.X * MM2FOOT, second.Z * MM2FOOT, -second.Y * MM2FOOT);
    const curve = new LineCurve3(v1, v2);
    const sphereV1 = new SphereGeometry(thickness, 6, 3).applyMatrix4(new Matrix4().setPosition(v1)).toNonIndexed();
    const sphereV2 = new SphereGeometry(thickness, 6, 3).applyMatrix4(new Matrix4().setPosition(v2)).toNonIndexed();

    const sphereBigV1 = new SphereGeometry(bigThickness, 6, 3).applyMatrix4(new Matrix4().setPosition(v1)).toNonIndexed();
    const sphereBigV2 = new SphereGeometry(bigThickness, 6, 3).applyMatrix4(new Matrix4().setPosition(v2)).toNonIndexed();
    return {
        g: [sphereV1, sphereV2, new TubeGeometry(curve, 1, thickness, 3, false).toNonIndexed()],
        bigG: [sphereBigV1, sphereBigV2, new TubeGeometry(curve, 1, bigThickness, 3, false).toNonIndexed()]
    };
};

let isWorking = false,
    startWorkingTime = 0;
onmessage = event => {
    const { channel, data, taskId } = event.data;
    switch (channel) {
        case 'task':
            // console.log('childThread event: ', event);
            startWorkingTime = Date.now();
            isWorking = true;
            const pipes = data?.data;
            // console.log('pipes: ', pipes);
            // const { taskId } = data;
            if (pipes && pipes.length) {
                const geometryArr = [];
                const bigGeometryArr = [];
                pipes.forEach(pipe => {
                    if (pipe.connectors && pipe.connectors.length > 0) {
                        pipe.connectors.forEach(con => {
                            if (con.skeletonLine && con.skeletonLine.length) {
                                const { g, bigG } = createPipe(con.skeletonLine[0]);
                                geometryArr.push(...g);
                                bigGeometryArr.push(...bigG);
                            }
                        });
                    }
                    if (pipe.skeletonLine && pipe.skeletonLine.length) {
                        pipe.skeletonLine.forEach(out => {
                            out.forEach(line => {
                                const { g, bigG } = createPipe(line);
                                geometryArr.push(...g);
                                bigGeometryArr.push(...bigG);
                            });
                        });
                    }
                });
                const transferList = new Set();
                if (geometryArr.length > 0) {
                    const geometry = geometryArr.length > 1 ? mergeGeometries(geometryArr, false) : geometryArr[0];
                    const bigGeometry = bigGeometryArr.length > 1 ? mergeGeometries(bigGeometryArr, false) : bigGeometryArr[0];
                    collectGeometryBuffer(geometry, transferList);
                    collectGeometryBuffer(bigGeometry, transferList);
                    geometry.computeBoundingSphere();
                    bigGeometry.computeBoundingSphere();
                    {
                        const {
                            center: { x, y, z },
                            radius
                        } = geometry.boundingSphere;
                        geometry.boundingSphereData = { center: { x, y, z }, radius };
                    }
                    {
                        const {
                            center: { x, y, z },
                            radius
                        } = bigGeometry.boundingSphere;
                        bigGeometry.boundingSphereData = { center: { x, y, z }, radius };
                    }
                    const bvh = new MeshBVH(geometry);
                    const serialized = MeshBVH.serialize(bvh, { copyIndexBuffer: false });
                    postMessage(
                        {
                            threadCode: 0,
                            channel: 'task',
                            taskId,
                            threadData: { data: { geometry, serialized, bigGeometry } }
                        },
                        [...transferList, ...serialized.roots, serialized.index.buffer]
                    );
                } else {
                    postMessage({ threadCode: 2, channel: 'task', taskId });
                }
                // if (geometryArr.length > 1) {
                //     const geometry = mergeGeometries(geometryArr, false);
                //     const bigGeometry = mergeGeometries(bigGeometryArr, false);
                //     collectGeometryBuffer(geometry, transferList);
                //     collectGeometryBuffer(bigGeometry, transferList);

                // } else if (geometryArr.length) {
                //     collectGeometryBuffer(geometryArr[0], transferList);
                //     collectGeometryBuffer(bigGeometryArr[0], transferList);
                //     postMessage({
                //         threadCode: 0,
                //         channel: 'task',
                //         taskId,
                //         threadData: { data: { geometry: geometryArr[0], bigGeometry: bigGeometryArr[0] } }
                //     }, [...transferList]);
                // } else {
                //     postMessage({ threadCode: 2, channel: 'task', taskId });
                // }
            } else {
                postMessage({ threadCode: 1, channel: 'task', taskId });
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
    // return;
    // const pipes = event.data;
    // if (pipes && pipes.length) {
    //     const geometryArr = [];
    //     const bigGeometryArr = [];
    //     pipes.forEach(pipe => {
    //         if (pipe.connectors && pipe.connectors.length > 0) {
    //             pipe.connectors.forEach(con => {
    //                 if (con.skeletonLine && con.skeletonLine.length) {
    //                     const { g, bigG } = createPipe(con.skeletonLine[0]);
    //                     geometryArr.push(...g);
    //                     bigGeometryArr.push(...bigG);
    //                 }
    //             });
    //         }
    //         if (pipe.skeletonLine && pipe.skeletonLine.length) {
    //             pipe.skeletonLine.forEach((out) => {
    //                 out.forEach(line => {
    //                     const { g, bigG } = createPipe(line);
    //                     geometryArr.push(...g);
    //                     bigGeometryArr.push(...bigG);
    //                 });
    //             });
    //         }
    //     });
    //     const transferList = new Set();
    //     if (geometryArr.length > 1) {
    //         const geometry = mergeGeometries(geometryArr, false);
    //         const bigGeometry = mergeGeometries(bigGeometryArr, false);
    //         collectGeometryBuffer(geometry, transferList);
    //         collectGeometryBuffer(bigGeometry, transferList);
    //         postMessage({ geometry, bigGeometry }, [...transferList]);
    //         // postMessage(geometry.toJSON());
    //     } else if (geometryArr.length) {
    //         collectGeometryBuffer(geometryArr[0], transferList);
    //         collectGeometryBuffer(bigGeometryArr[0], transferList);
    //         postMessage({ geometry: geometryArr[0], bigGeometry: bigGeometryArr[0] }, [...transferList]);
    //     } else {
    //         postMessage(null);
    //     }
    // } else {
    //     postMessage(null);
    // }
};
