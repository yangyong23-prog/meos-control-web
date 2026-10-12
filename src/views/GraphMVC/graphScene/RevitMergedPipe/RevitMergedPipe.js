import MergedModel from '../../core/Model/MergedModel';
import { modelNameEnum } from '../GraphSceneDefine';

const getPipeStyles = color => {
    const styles = {
        normal: {
            show: true,
            color,
            priority: 1
        },
        hover: {
            color: '#246FE5',
            opacity: 1,
            priority: 20
        },
        relationHover: {
            color: '#246FE5',
            opacity: 1,
            priority: 18
        },
        hoverRelation: {
            color: '#246FE5',
            opacity: 1,
            priority: 18
        },
        // hoverWeaken: {
        //     opacity: 0.3,
        //     priority: 10
        // },
        hide: {
            show: false,
            priority: 90
        },
        hidden: {
            show: false,
            priority: 90
        }
    };
    return styles;
};
export default class RevitMergedPipe extends MergedModel {
    constructor(pipeData, meshs) {
        super();
        this.pipeData = pipeData;
        this.meshs = meshs;
        // this.bimLocation = getD3PosByBimLocation(pipeData.bimLocation);
        this.show = true;
        this.name = modelNameEnum.RevitMergedPipe;
        this.materialColor = pipeData.colorInfo ? pipeData.colorInfo.color : '#ffffff';
        console.log('this.materialColor: ', this.materialColor);
        // const defaultStyles = getPipeStyles(this.materialColor);
        // this.defineStyles = _.assign({}, this.defineStyles, defaultStyles);
        // this.normalStyle = this.defineStyles.normal;
        this.setStateStyles(getPipeStyles(this.materialColor));
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
