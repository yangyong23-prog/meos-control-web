import { baseUtils } from '@yushu/three-base';
import BaseModel from '../../core/Model/BaseModel';
import { modelNameEnum, RenderOrder } from '../GraphSceneDefine';
import { isNil } from 'lodash';

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
    }
});
export default class MultipleSpace extends BaseModel {
    constructor(spaceData, { height, floorHeight, depths, curGeometryIndex = 0 }) {
        super();
        this.spaceData = spaceData;
        this.height = height;
        this.curGeometryIndex = curGeometryIndex;
        this.depths = depths;
        if (!Array.isArray(depths)) {
            this.depths = [depths];
        }
        this.floorHeight = floorHeight;
        this.bimLocation = getD3PosByBimLocation(spaceData.bimLocation);

        this.spaceBorder = null;
        this.spaceIconInfo = null;
        this.abstractCard = null;
        this.show = true;
        this.name = modelNameEnum.MultipleSpace;

        this.setStateStyles(getSpaceStyles(spaceData));
    }

    // 设置当前使用第几个几何体
    setGeometryIndex(index) {
        const geometryIndex = this.depths?.[index];

        if (isNil(geometryIndex)) {
            return false;
        }
        this.curGeometryIndex = index;
        this.emit('ChangeCurrentGeometry', {});
        return true;
    }

    // 获取当前使用的几何体索引
    getCurrentGeometryIndex() {
        return this.curGeometryIndex;
    }

    // 获取集合体数量
    getGeometryCount() {
        return this.depths.length;
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
}
