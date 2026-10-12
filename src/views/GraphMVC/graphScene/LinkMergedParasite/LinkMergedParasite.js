import MergedParasiteModel from '../../core/Model/MergedParasiteModel';
import { modelNameEnum } from '../GraphSceneDefine';

const getLinkOutLineStyles = () => ({
    normal: {
        show: true,
        priority: 0
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
    selectedRelation: {
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
// 管道Link寄生model
export default class LinkMergedParasite extends MergedParasiteModel {
    constructor(pipeIds, data) {
        super(pipeIds);

        this.data = data;
        this.userinteractionEnable = true;
        this.show = true;
        this.name = modelNameEnum.LinkMergedParasite;

        this.pipeInfo = null;
        this.setStateStyles(getLinkOutLineStyles());
    }
}
