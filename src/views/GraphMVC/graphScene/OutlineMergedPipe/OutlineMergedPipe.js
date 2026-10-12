import MergedModel from '../../core/Model/MergedModel';
import { modelNameEnum } from '../GraphSceneDefine';

const getOutLineStyles = color => ({
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
});
export default class OutlineMergedPipe extends MergedModel {
    constructor(cacheKey, classCode, data, { height, floorHeight }) {
        super();
        this.classCode = classCode;
        this.data = data;
        this.userinteractionEnable = true;
        this.show = true;
        this.name = modelNameEnum.OutlineMergedPipe;
        this.height = height;
        this.floorHeight = floorHeight;
        this.materialColor = data[0].colorInfo ? data[0].colorInfo.color : '#ffffff';
        this.cacheKey = cacheKey;
        this.workerData = null;
        this.pipeInfo = null;
        this.setStateStyles(getOutLineStyles(this.materialColor));
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
