import { baseUtils } from '@yushu/three-base';
import { CSS2DObject } from '@yushu/three-base/three-extends/jsm/renderers/CSS2DRenderer';
import { createDom } from '../../utils/d2Utils';
import { RenderOrder } from '../GraphSceneDefine';
import { wrapperDom } from '../../core/utils';
import BaseMedia from '../../core/View/BaseMedia';
import * as THREE from '@yushu/three-base';
import i18n from '../../../../localization';

import { generateAbstractCardHtml } from './AbstractCardHtml';
// 工具函数
const { setMeshUpToY, getD3PosByBimLocation } = baseUtils;
export default class AbstractCardMedia extends BaseMedia {
    constructor(abstractCard, rootMedia) {
        super(abstractCard, rootMedia);
        this.model.addObserver('ChangeState', e => this.ChangeState(e));

        this.init();
    }

    // 重写父类方法，生成模型
    makeObject3D() {
        const {
            model: { data: abstractData, positionOffset }
        } = this;
        this.$dom = createDom({
            tagName: 'div',
            classList: ['abstract-normal-dom']
        });

        this.$dom.style.transform = `translate(-50%, ${positionOffset.y}px)`;
        this.$dom.appendChild(this.setDom());
        const wrapper = wrapperDom(this.$dom);
        const abstractCardMesh = new CSS2DObject(wrapper);

        abstractCardMesh.renderOrder = RenderOrder.card;
        return abstractCardMesh;
    }
    ChangeState(e) {
        const style = this.model.caclCurrentStyle();
        // const {} = this.rootMedia.renderContext;
        const { show, flow, color, outColor, opacity = 1, width, configuration } = style;
        // eslint-disable-next-line eqeqeq
        if (show == false) {
            this.$dom.style.display = 'none';
        } else {
            this.$dom.style.display = 'block';
        }
    }
    setDom() {
        if (this.$normalDom) return this.$normalDom;
        const {
            model: { data: abstractData }
        } = this;
        const { floorId } = abstractData;
        this.$normalDom = createDom({
            tagName: 'div',
            classList: ['space-normal-dom']
        });
        let listStr;
        listStr = `<span  class="filder ${abstractData.box?.isCustomizedSetting ? 'xz' : 'qx'} "></span><div style="margin:10px;">${i18n.global.t('meos_control_web.floor_num', {
            floor: floorId
        })}</div>`;
        this.$dom1 = createDom({
            tagName: 'div',
            classList: ['abstract-card-div'],
            innerHTML: `${listStr}`,
            style: { pointerEvents: 'none', display: 'block' },
            appendTo: this.$normalDom
        });
        // eslint-disable-next-line one-var
        let divs = `<div class="space_popupprompt"><span class="space_popupprompt_h3">${i18n.global.t('meos_control_web.floor_num', { floor: floorId })}</span><span class="${
            abstractData.box?.isCustomizedSetting ? 'space_popupprompt_pz' : 'space_popupprompt_vpz'
        }">${abstractData.box?.isCustomizedSetting ? i18n.global.t('meos_control_web.already_configured') : i18n.global.t('meos_control_web.unconfiged')}</span></div>`;
        this.$dom2 = createDom({
            tagName: 'div',
            classList: ['abstract-card-div'],
            innerHTML: `${divs}`,
            style: { pointerEvents: 'none', display: 'block' },
            appendTo: this.$normalDom
        });
        this.$dom2.style.display = 'none';
        return this.$normalDom;
    }

    // eslint-disable-next-line no-dupe-class-members
    ChangeState() {
        const style = this.model.caclCurrentStyle();
        const { show, flow, color, outColor, opacity = 1, width, configuration } = style;
        if (show) {
            this.$normalDom.style.display = 'block';
        } else {
            this.$normalDom.style.display = 'none';
        }
    }
    onObject3DLayout() {
        this.ChangeState();
        const { object3D } = this.parentMedia;
        let position;
        const box = new THREE.Box3();
        box.setFromObject(object3D);
        position = new THREE.Vector3(box.min.x, (box.max.y + box.min.y) / 2, box.min.z);
        position.applyMatrix4(object3D.matrixWorld.invert());
        this.object3D.position.copy(position);
    }
}
