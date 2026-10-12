// @ts-ignore
import i18n from '@/localization';
import { debounce } from 'lodash';
export default ({ appSceneInstances, clickSpaceOrEquip, currentFloorObj }) => {
    const clickMapObj = obj => {
        if (currentFloorObj.value?.floorId && currentFloorObj.value?.floorId !== obj.floorId) {
            return;
        }
        appSceneInstances.scene?.clickMapObj(obj);
    };
    const hoverMapObj = obj => {
        if (currentFloorObj.value?.floorId && currentFloorObj.value?.floorId !== obj.floorId) {
            return;
        }
        appSceneInstances.scene?.hoverMapObj(obj);
    };
    const unhoverMapObj = () => {
        appSceneInstances.scene?.unhoverMapObj();
    };

    const onClickMoreInfo = obj => {
        if (obj) {
            clickSpaceOrEquip({ ...obj, classCode: obj.oriClassCode || obj.classCode });
        }
    };

    const goDefault = () => {
        appSceneInstances.scene?.restoreCamera();
    };

    const pauseRender = pause => {
        appSceneInstances.scene?.pauseRender(pause);
    };

    // 空间气泡防抖
    const spaceBubbleCollisionDebounce = debounce(() => {
        appSceneInstances.scene?.invokeSpaceBubbleCollision();
    }, 5000);
    // 摄像头碰撞防抖
    const cameraCollisionDebounce = debounce(() => {
        appSceneInstances.scene?.invokeCameraInfoCollision();
    }, 60);

    return {
        clickMapObj,
        hoverMapObj,
        unhoverMapObj,
        onClickMoreInfo,
        goDefault,
        pauseRender,
        spaceBubbleCollisionDebounce,
        cameraCollisionDebounce
    };
};
