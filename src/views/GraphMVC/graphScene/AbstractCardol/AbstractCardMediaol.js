import { baseUtils } from '@yushu/three-base';
import { CSS2DObject } from '@yushu/three-base/three-extends/jsm/renderers/CSS2DRenderer';
import { createDom } from '../../utils/d2Utils';
import { RenderOrder } from '../GraphSceneDefine';
import { wrapperDom } from '../../core/utils';
import BaseMedia from '../../core/View/BaseMedia';
import { generateAbstractCardHtml } from './AbstractCardHtml';
// 工具函数
const { setMeshUpToY, getD3PosByBimLocation } = baseUtils;
export default class AbstractCardMediaol extends BaseMedia {
    constructor(abstractCard, rootMedia) {
        super(abstractCard, rootMedia);
        this.init();
    }

    // 重写父类方法，生成模型
    makeObject3D() {
        const {
            model: { data: abstractData, positionOffset }
        } = this;
        const $dom = generateAbstractCardHtml(abstractData);

        $dom.style.transform = `translate(-50%, ${positionOffset.y}px)`;

        const wrapper = wrapperDom($dom);
        const abstractCardMesh = new CSS2DObject(wrapper);

        abstractCardMesh.renderOrder = RenderOrder.card;
        return abstractCardMesh;
    }

    onObject3DLayout() {
        const { floorHeight } = this.model;
        const {
            data: { bimLocation, floorId }
        } = this.model;
        const infoLocation = getD3PosByBimLocation(bimLocation);
        // 一般楼层平面图会改坐标Y值，若真3D模型hover就用bimlocation的
        if (floorHeight !== undefined) {
            infoLocation.setY((floorHeight || 0) + 0.1);
        }
        // infoLocation.setY(floorHeight + 0.1);
        // const position = infoLocation.clone().applyMatrix4(this.parentMedia.object3D.matrix.clone().invert());
        this.object3D.position.copy(infoLocation);
    }
}
