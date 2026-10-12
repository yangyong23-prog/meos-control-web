// @ts-ignore
import i18n from '@/localization';
export default (renderDomList, infoPlanes) => {
    // 名字闪动
    const shakeName = (ids = []) => {
        renderDomList.value?.forEach(item => {
            const { dataObject } = item;
            if (ids.indexOf(dataObject.id) > -1) {
                item.renderData.shake = true;
            } else {
                item.renderData.shake = false;
            }
        });
    };

    const clearShakeName = () => {
        shakeName();
    };

    let lastChoose = null,
        lastHover = null,
        lastChooseInfoPlane = null;
    const chooseDomItem = id => {
        const target = renderDomList.value.find(it => it.id === id);
        if (target) {
            target.renderData.selected = true;
            lastChoose = target;
        }
        const infoPlane = infoPlanes.value.find(it => it.relObj.id === id);
        if (infoPlane) {
            infoPlane.clickSelected = true;
            lastChooseInfoPlane = infoPlane;
        }
    };

    const removeDomItemChoose = () => {
        if (lastChoose) {
            lastChoose.renderData.selected = false;
            lastChoose = null;
        }
        if (lastChooseInfoPlane) {
            lastChooseInfoPlane.clickSelected = false;
            lastChooseInfoPlane = null;
        }
    };

    const hoverDomItem = id => {
        const target = renderDomList.value.find(it => it.id === id);
        if (target) {
            target.renderData.hover = true;
            lastHover = target;
        }
    };
    const removeHoverDomItem = () => {
        if (lastHover) {
            lastHover.renderData.hover = false;
            lastHover = null;
        }
    };

    // 更新异常事件状态
    const updateAbnormalData = abnormalListData => {
        renderDomList.value.forEach(domData => {
            const { dataObjectId } = domData;
            const target = abnormalListData.find(({ instances = [] }) => {
                return instances.some(ins => {
                    return ins.instanceId === dataObjectId;
                });
            });
            if (target) {
                domData.renderData.abnormal = true;
            } else {
                domData.renderData.abnormal = false;
            }
        });
        infoPlanes.value.forEach(infoPlane => {
            const { dataObject } = infoPlane.relObj;
            const target = abnormalListData.find(({ instances = [] }) => {
                return instances.some(ins => {
                    return ins.instanceId === dataObject.id;
                });
            });
            if (target) {
                infoPlane.abnormal = true;
            } else {
                infoPlane.abnormal = false;
            }
        });
    };

    return {
        shakeName,
        clearShakeName,
        chooseDomItem,
        removeDomItemChoose,
        updateAbnormalData,
        hoverDomItem,
        removeHoverDomItem
    };
};
