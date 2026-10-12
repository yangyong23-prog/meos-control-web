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

    const moveToClickMapObj = (obj, callback) => {
        if (currentFloorObj.value?.floorId && currentFloorObj.value?.floorId !== obj.floorId) {
            return;
        }
        appSceneInstances.scene.moveCameraToBox(obj, callback);
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

    return {
        clickMapObj,
        moveToClickMapObj,
        hoverMapObj,
        unhoverMapObj,
        onClickMoreInfo,
        goDefault,
        pauseRender
    };
};
