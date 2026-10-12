import { baseUtils } from '@yushu/three-base';
import BaseModel from '@/views/GraphMVC/core/Model/BaseModel';
import { modelNameEnum } from '@/views/GraphMVC/graphScene/GraphSceneDefine';

import { registerMedia } from '@/views/GraphMVC/core/Graph';

import EnterSpacePopoverMedia from './EnterSpacePopoverMedia';

const { getD3PosByBimLocation } = baseUtils;
modelNameEnum.EnterSpacePopover = Symbol('EnterSpacePopover');

export default class EnterSpacePopover extends BaseModel {
    constructor(spaceData, floorElevation) {
        super();
        this.spaceData = spaceData;
        this.floorElevation = floorElevation;

        this.bimLocation = getD3PosByBimLocation(spaceData.bimLocation);

        this.name = modelNameEnum.EnterSpacePopover;
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
        return this.spaceData;
    }
}

registerMedia(modelNameEnum.EnterSpacePopover, EnterSpacePopoverMedia);
