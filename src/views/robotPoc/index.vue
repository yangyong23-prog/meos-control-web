<template>
    <div class="robot-container-out">
        <div ref="robotWarp" class="container"></div>
        <FloorSelect v-if="!!curFloorId" :floor-id="curFloorId" :building-floors="buildFloors" @change="choseFloor" />
        <DiagramControls :actual-size="false" @reset-view="goDefault" />
        <!-- <SseSendTest @send="testSend"></SseSendTest> -->
        <RobotHoverCard ref="robotHoverCardCom" :pos="hoverCardPosition" :query-data="curHoverObj" :current-track-obj="currentTrackObj" @track="onTrack"></RobotHoverCard>
        <div v-if="currentTrackObj" class="banner-warp">
            <m-banner type="info" :message="i18n.global.t('meos_control_web.robot_tracking_in_progress')" width="500px">
                <template #line>
                    <div class="text-warp">
                        <span class="track-name">{{ currentTrackObj?.name }}</span>
                        <m-button type="link" size="medium" @click="removeTrack">{{ i18n.global.t('meos_control_web.stop_tracking') }}</m-button>
                    </div>
                </template>
            </m-banner>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import RobotFloorScene from './RobotFloorScene';
import useStore from '@/store';
import { Environment, INTERFACE_PREFIX_MEOS_COMPUTE } from '@/config';
import { onMounted } from 'vue';
import { Application } from '@yushu/core3d';
import baseStore from '@/store/baseStore';
import { getListTreeBuildingFloorSpace } from '@/apis/xplantindoorenv3d';
import RobotHoverCard from './RobotHoverCard.vue';
import xplantindoorenvStore from '../../store/xplantindoorenv';
import DiagramControls from '@/components/common/DiagramControls.vue';
import FloorSelect from '@/components/common/FloorSelect.vue';
import SSEClient from '@/utils/SSEClient';
import { robotList } from '@/apis/robotPoc';
import { setTestData } from './testData';
import { OBJ_TYPE } from '@/utils/globalVariables';
import SseSendTest from './SseSendTest.vue';
import { $Message } from 'meri-plus';
import { getFloorInfoByFloorId, getFloorInfoByLocalName } from '@/utils/buildingUtils';
import { IOT_DATA_CHANGE } from '@/utils/SSEEventTypes';

const robotHoverCardCom = ref();

const curFloorId = ref('');

const robotWarp = ref('');
const appSceneInstances = {};
const { base } = useStore();
const buildFloors = ref([]);
const currentTrackObj = ref(null);

const curHoverObj = ref(null);
const hoverCardPosition = ref({
    x: 0,
    y: 0
});

const initScene = () => {
    appSceneInstances.scene = new RobotFloorScene({
        projectId: base.projectId,
        groupCode: base.groupCode,
        env: Environment
    });
    appSceneInstances.app = new Application({
        dom: robotWarp.value,
        webGLScene: appSceneInstances.scene
    });

    appSceneInstances.scene.addEventListener('onHoverCard', obj => {
        if (obj.data) {
            const { instance, pos } = obj.data;
            if (instance && pos) {
                const cardData = {
                    ...instance,
                    classCode: instance.objType === OBJ_TYPE.EQUIPMENT ? instance.classCode : ''
                };
                curHoverObj.value = cardData;
            }
            hoverCardPosition.value = { ...pos, top: pos.top };
        }
    });
    appSceneInstances.scene.addEventListener('onUnHover', obj => {
        // console.log('onUnEquip设备----obj: ', Date.now());
        curHoverObj.value = null;
        if (hoverCardPosition.value) {
            hoverCardPosition.value = null;
        }
        // robotHoverCardCom.value?.hideTipsNow();
    });

    appSceneInstances.scene.initLoader();
};

const getTreeBuildingFloor = () => {
    return new Promise(resove => {
        // 获取建筑信息
        // eslint-disable-next-line one-var
        let parasm = {
            projectId: baseStore().projectId
        };
        getListTreeBuildingFloorSpace(parasm).then(res => {
            const { data, code } = res;
            // eslint-disable-next-line eqeqeq
            if (code == '00000') {
                xplantindoorenvStore().setBuildingData(data);
                const builds = [];
                JSON.parse(JSON.stringify(data)).forEach(item => {
                    const b = {
                        id: item.id,
                        name: item.name,
                        localName: item.localName ?? '--',
                        floorList: item.floors
                            .map(f => {
                                delete f.spaces;
                                return f;
                            })
                            .sort((a, b) => b.floorSequenceId - a.floorSequenceId)
                    };
                    delete b.floors;
                    builds.push(b);
                });
                buildFloors.value = builds;
                curFloorId.value = builds[0].floorList.slice(-1)[0].id;
                initScene();
                resove();
            }
        });
    });

    // getQueryControlObjectTree
};

const choseFloor = (id, floor) => {
    if (id === curFloorId?.value) return;
    if (curFloorId.value) {
        curFloorId.value = id;
        appSceneInstances.scene.switchFloor(id);
        if (currentTrackObj.value) {
            currentTrackObj.value = null;
            $Message.Default({
                title: i18n.global.t('meos_control_web.robot_tracking_auto_released'),
                showClose: true,
                duration: 3000,
                className: 'message_custom'
            });
        }
    }
};

const goDefault = () => {
    appSceneInstances.scene?.restoreCamera();
};

const handleSSEData = event => {
    console.log('sseClient infoCode>>>', event?.data?.infoCode, event?.data?.objectId, event);

    appSceneInstances.scene.iotDataChange(event);
    // 处理追踪对象
    if (event.data && currentTrackObj.value) {
        const { objectId, infoCode, dataValue } = event.data;
        if (currentTrackObj.value.id === objectId && infoCode === 'sysFloor') {
            const { id: floorId } = getFloorInfoByLocalName(dataValue);
            if (curFloorId.value !== floorId) {
                appSceneInstances.scene.switchFloor(floorId);
                curFloorId.value = floorId;
            }
        }
    }
};

const sseClient = new SSEClient({
    url: `${INTERFACE_PREFIX_MEOS_COMPUTE}/server-event/sse/subscribe`,
    params: {
        subscribeType: 'ROBOT',
        projectId: base.projectId,
        instanceId: base.projectId,
        instanceType: 'PROJECT'
    }
});
sseClient.addEventListener(IOT_DATA_CHANGE, handleSSEData);

const equipAllMap = new Map();

const getRobotData = () => {
    robotList({ projectId: base.projectId }).then(({ code, data }) => {
        if (code === '00000') {
            // TODO test to remove
            // setTestData(data);
            // console.log('mock data>>>', data);

            data.forEach(({ floorId, equipmentList }) => {
                equipmentList &&
                    equipmentList.forEach(e => {
                        e.floorId = floorId;
                        console.log('e :>> ', e);
                        equipAllMap.set(e.id, e);
                    });
            });
            appSceneInstances.scene.setAllEquips(equipAllMap);
            appSceneInstances.scene.switchFloor(curFloorId.value);
        }
    });
};

// const testSend = sendData => {
//     // TODO test to remove
//     console.log('sseClient iot testSend>>>', sendData);
//     handleSSEData(sendData);
// };

const onTrack = dateilObj => {
    if (dateilObj) {
        currentTrackObj.value = {
            id: dateilObj.id,
            name: (dateilObj.localName || dateilObj.name) ?? '--'
        };
    } else {
        currentTrackObj.value = null;
    }
};

const removeTrack = () => {
    currentTrackObj.value = null;
};

const windowResize = () => {
    if (appSceneInstances.app) {
        appSceneInstances.app.resize();
        appSceneInstances.scene?.resize();
    }
};

onMounted(() => {
    window.addEventListener('resize', windowResize);

    getTreeBuildingFloor().then(() => {
        getRobotData();
    });
});

onUnmounted(() => {
    window.removeEventListener('resize', windowResize);
    sseClient.destory();
});
</script>

<style lang="less" scoped>
.robot-container-out {
    width: 100%;
    height: 100%;
    position: relative;
    .container {
        width: 100%;
        height: 100%;
    }

    .banner-warp {
        position: absolute;
        top: 20px;
        left: 0;
        width: 100%;
        display: flex;
        justify-content: center;
        z-index: 999;
        :deep(.m-banner) {
            max-width: 500px;
            width: 500px;
        }
    }

    .text-warp {
        display: inline-flex;
        width: 310px;
        justify-content: space-between;
        align-items: center;
        .track-name {
            font-size: 14px;
            color: var(--gray-900);
            font-weight: bold;
        }
    }
}
</style>
