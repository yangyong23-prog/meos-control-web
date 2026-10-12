import { modelNameEnum } from '../GraphSceneDefine';
import BaseModel from '../../core/Model/BaseModel';

const getOutLineStyles = () => ({
    normal: {
        show: true,
        bigGeometry: false,
        priority: 1
    },
    hover: {
        show: true,
        bigGeometry: true,
        priority: 2
    },
    hidden: {
        show: false,
        priority: 3
    }
});

export default class OutlinePipe extends BaseModel {
    constructor(cacheKey, classCode, data, { height, floorHeight }) {
        super();
        this.classCode = classCode;
        this.data = data;
        this.userinteractionEnable = true;
        this.show = true;
        this.name = modelNameEnum.OutlinePipe;
        this.height = height;
        this.floorHeight = floorHeight;
        this.materialColor = data[0].colorInfo ? data[0].colorInfo.color : '#ffffff';
        this.cacheKey = cacheKey;
        this.workerData = null;
        this.pipeInfo = null;
        this.setStateStyles(getOutLineStyles());
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
