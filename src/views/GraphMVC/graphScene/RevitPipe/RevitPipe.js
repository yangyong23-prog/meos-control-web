import { baseUtils } from '@yushu/three-base';
import { modelNameEnum } from '../GraphSceneDefine';
import BaseModel from '../../core/Model/BaseModel';
import * as _ from 'lodash';

const { getD3PosByBimLocation } = baseUtils;

const getPipeStyles = pipeData => {
    const styles = {
        normal: {
            show: true,
            color: pipeData.color || '#ffffff'
        },
        hover: {
            show: true,
            // color: '#3B93FF'
            effectTypes: ['outline']
        },
        hide: {
            show: false,
            priority: 1000
        }
    };
    return styles;
};
export default class Pipe extends BaseModel {
    constructor(pipeData, meshs) {
        super();
        this.pipeData = pipeData;
        this.meshs = meshs;
        this.bimLocation = getD3PosByBimLocation(pipeData.bimLocation);
        this.show = true;
        this.name = modelNameEnum.RevitPipe;
        const defaultStyles = getPipeStyles(pipeData);
        this.defineStyles = _.assign({}, this.defineStyles, defaultStyles);
        this.normalStyle = this.defineStyles.normal;
        this.styles.add(this.defineStyles.normal);
    }

    addPipeInfo(pipeInfo) {
        super.addChild(pipeInfo);
        this.pipeInfo = pipeInfo;
    }

    removePipeInfo() {
        super.removeChild(this.pipeInfo);
        this.pipeInfo = null;
    }
}
