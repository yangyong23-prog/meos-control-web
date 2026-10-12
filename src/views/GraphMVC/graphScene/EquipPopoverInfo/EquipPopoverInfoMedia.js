import { baseUtils } from '@yushu/three-base';
import { CSS2DObject } from '@yushu/three-base/three-extends/jsm/renderers/CSS2DRenderer';
import { Css2dobjectClick, Css2dobjectMouseMove } from '../RootNode/RootNodeMedia';
import BaseMedia from '@/views/GraphMVC/core/View/BaseMedia';
import { wrapperDom } from '@/views/GraphMVC/core/utils';
import { RenderOrder } from '@/views/GraphMVC/graphScene/GraphSceneDefine';
import { createDom } from '@/views/GraphMVC/utils/d2Utils';
import './equipPopoverInfo.less';
import { Css2dobjectdblClick } from '@/views/GraphMVC/core/View/ObjectPicker';

// 工具函数
const { getD3PosByBimLocation } = baseUtils;

const arrowSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="7" viewBox="0 0 13 7" fill="none">
                    <g clip-path="url(#clip0_14614_36478)">
                        <path d="M1.7832 -0.5H0.576096L1.42965 0.353553L6.42965 5.35355L6.7832 5.70711L7.13676 5.35355L12.1368 0.353553L12.9903 -0.5H11.7832H1.7832Z" fill="white" stroke="#E1E5EB"/>
                    </g>
                    <defs>
                        <clipPath id="clip0_14614_36478">
                            <rect width="12" height="7" fill="white" transform="translate(0.783203)"/>
                        </clipPath>
                    </defs>
                </svg>`;

export default class EquipPopoverInfoMedia extends BaseMedia {
    constructor(equipData, rootMedia) {
        super(equipData, rootMedia);
        this.init();
        // this.model.addObserver('ChangeState', e => this.equipDotInfoStateChanged(e));
    }

    makeObject3D() {
        const {
            data: { localName },
            label
        } = this.model;

        const { show, name, color, bgColor } = label;

        const labelDomStr = show
            ? `<span class='equip-popover-status' style='color:${color};background-color:${bgColor}'>
                    ${name}
                </span>`
            : '';

        const domStr = `<div class='equip-popover-dom-box'>
            <div class='equip-popover-inner'>
                <span class='equip-popover-name'>
                    ${localName ?? '--'}
                </span>
                ${labelDomStr}
            </div>
            <div class='equip-popover-dom-box-arrow'>
                ${arrowSvg}
            </div>
        </div>`;

        this.$dom = createDom({
            tagName: 'div',
            classList: ['equip-popover-dom-container'],
            innerHTML: domStr
        });

        this.$dom.style.transform = `translateY(calc(-50% - 10px))`;

        const wrapper = wrapperDom(this.$dom);
        const infoMesh = new CSS2DObject(wrapper);
        infoMesh.renderOrder = RenderOrder.card;
        return infoMesh;
    }

    addMouseEvent() {}

    onObject3DLayout() {
        const {
            data: { bimLocation }
        } = this.model;
        const infoLocation = getD3PosByBimLocation(bimLocation);
        const position = infoLocation.clone().applyMatrix4(this.parentMedia.object3D.matrix.clone().invert());
        this.object3D.position.copy(position);
    }

    onObject3DMounted() {
        this.object3D.renderOrder = RenderOrder.card;
    }
}
