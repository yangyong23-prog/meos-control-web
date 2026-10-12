import { baseUtils } from '@yushu/three-base';
import BaseModel from '../../core/Model/BaseModel';
import { modelNameEnum } from '../GraphSceneDefine';
import * as _ from 'lodash';

const { getD3PosByBimLocation } = baseUtils;

const getLinkLineStyles = color => ({
    normal: {
        show: true,
        color: color || '#ffb800'
    },
    hover: {
        show: true,
        useAnimate: true,
        color: '#246FE5',
        priority: 30
    },
    relationHover: {
        show: true,
        color: '#246FE5',
        priority: 30
    },
    hoverWeaken: {
        opacity: 0.05,
        priority: 10
    }
});
export default class SimpleLinkLine extends BaseModel {
    constructor(linkLineData, floorHeight, color) {
        super();
        this.linkLineData = linkLineData;
        this.floorHeight = floorHeight || 10;
        this.color = color || '#ffb800';
        this.bimLocationFrom = getD3PosByBimLocation(linkLineData.from.bimLocation);
        this.bimLocationTo = getD3PosByBimLocation(linkLineData.to.bimLocation);
        if (!this.bimLocationFrom || !this.bimLocationTo) {
            console.warn('飞行线相关数据没有bimLocation!');
        } else {
            this.bimLocationFrom.setY(floorHeight);
            this.bimLocationTo.setY(floorHeight);
            this.linkLineInfo = null;
            this.show = true;
            this.name = modelNameEnum.SimpleLinkLine;

            const defaultStyles = getLinkLineStyles(this.color);
            this.defineStyles = _.assign({}, this.defineStyles, defaultStyles);
            this.normalStyle = this.defineStyles.normal;
            this.styles.add(this.defineStyles.normal);
        }
    }

    addLinkLineInfo(linkLineInfo) {
        super.add(linkLineInfo);
        this.linkLineInfo = linkLineInfo;
        this.emit('AddLinkLineInfo', linkLineInfo);
    }

    removeLinkLineInfo(linkLineInfo) {
        super.remove(linkLineInfo);
        this.linkLineInfo = null;
        this.emit('RemoveLinkLineInfo', linkLineInfo);
    }
}
