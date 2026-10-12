// @ts-ignore
import i18n from '@/localization';
import { baseUtils } from '@yushu/three-base';
import BaseModel from '@/views/GraphMVC/core/Model/BaseModel';
import { modelNameEnum } from '@/views/GraphMVC/graphScene/GraphSceneDefine';

import { registerMedia } from '@/views/GraphMVC/core/Graph';

import LampLightGroupMedia from './LampLightGroupMedia';

modelNameEnum.LampLightGroup = Symbol('LampLightGroup');

/**
 * 按灯具类型分组图元
 */
export default class LampLightGroup extends BaseModel {
    constructor(lampData, group) {
        super();
        this.data = lampData;
        this.group = group;

        this.name = modelNameEnum.LampLightGroup;
        this.show = true;

        this.setStateStyles({
            normal: { show: true },
            hide: {
                show: false,
                priority: 90
            }
        });
    }

    getData() {
        return this.data;
    }

    isFloorType() {
        return !!this.data?.floorId;
    }
    hasLampFuncType() {
        return !!this.data?.lampStatus?.some(obj => !!obj.lampFuncType);
    }
    getFuncTypeFilterVal(filterVal) {
        return this.data?.lampStatus?.some(obj => obj.relFuncTypes?.includes(filterVal));
    }
    getLampTypeFilterVal(filterVal) {
        return this.data?.lampStatus?.some(obj => obj.lampFuncType === filterVal);
    }
    getIntervenedFilterVal(filterVal) {
        return this.data?.lampStatus?.some(obj => obj.tag?.interventionTypes?.includes(filterVal));
    }
    getAbnormalFilterVal(filterVal) {
        return this.data?.lampStatus?.some(obj => obj.tag?.abnormalStatuses?.some(v => v === filterVal));
    }
}

registerMedia(modelNameEnum.LampLightGroup, LampLightGroupMedia);
