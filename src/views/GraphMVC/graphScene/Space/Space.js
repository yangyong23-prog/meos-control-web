import { baseUtils } from '@yushu/three-base';
import BaseModel from '../../core/Model/BaseModel';
import { modelNameEnum, RenderOrder } from '../GraphSceneDefine';

const { getD3PosByBimLocation } = baseUtils;

export const getSpaceStyles = spaceData => ({
    normal: {
        show: true,
        color: spaceData.color || '#F2F2F2',
        priority: RenderOrder.space
    },
    hover: {
        show: true,
        useAnimate: true,
        color: '#4FB2FF',
        priority: RenderOrder.hover
    },
    active: {
        show: true,
        color: '#4FB2FF',
        priority: RenderOrder.active
    },
    grey: {
        show: true,
        // color: '#E8E8E8',
        color: '#DFE6EE',
        priority: RenderOrder.selected - 1
    },
    selected: {
        show: true,
        priority: RenderOrder.selected
    },
    hide: {
        show: false,
        priority: RenderOrder.hide,
        alpha: 0
    },
    clickOn: {
        actionShow: true,
        priority: RenderOrder.clickOn,
        color: '#246FE5'
    }
});
export default class Space extends BaseModel {
    constructor(spaceData, height, floorHeight, depth = 0.01) {
        super();
        this.spaceData = spaceData;
        this.height = height;
        this.depth = depth;
        this.floorHeight = floorHeight;

        this.bimLocation = getD3PosByBimLocation(spaceData.bimLocation);

        this.spaceBorder = null;
        this.spaceIconInfo = null;
        this.abstractCard = null;
        this.show = true;
        this.name = modelNameEnum.Space;

        this.setStateStyles(getSpaceStyles(spaceData));
    }

    getData() {
        return this.spaceData;
    }

    // 将空间置灰
    setGrey() {
        this.setState('grey', true);
    }

    // 把空间从灰还原
    removeGrey() {
        this.setState('grey', false);
        // const state = shiftRemove(this.state, State.grey);
        // this.changeState(state);
    }

    changeState(state) {
        this.state = state;
        this.emit('ChangeState', {});
        if (this.spaceIconInfo) {
            this.spaceIconInfo.changeState(state);
        }
    }

    addBoder(spaceBorder) {
        super.add(spaceBorder);
        this.spaceBorder = spaceBorder;
        this.emit('AddSpaceBorder', spaceBorder);
    }

    removeBoder(spaceBorder) {
        super.remove(spaceBorder);
        this.spaceBorder = null;
        this.emit('RemoveSpaceBorder', spaceBorder);
    }

    addSpaceIconInfo(spaceIconInfo) {
        super.add(spaceIconInfo);
        this.spaceIconInfo = spaceIconInfo;
        this.emit('AddSpaceIconInfo', spaceIconInfo);
        this.spaceIconInfo.emit('ChangeSpaceIconInfoState', {});
    }

    removeSpaceIconInfo(spaceIconInfo) {
        super.remove(spaceIconInfo);
        this.spaceIconInfo = null;
        this.emit('RemoveSpaceIconInfo', spaceIconInfo);
    }

    isValid() {
        return !this.getState('grey') || this.getState('active');
    }

    updatePositionY(value) {
        this.emit('UpdatePositionY', { value });
    }
}
