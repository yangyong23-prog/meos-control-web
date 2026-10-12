import { baseUtils } from '@yushu/three-base';
import { CSS2DObject } from '@yushu/three-base/three-extends/jsm/renderers/CSS2DRenderer';
import { Css2dobjectClick, Css2dobjectMouseMove } from '../RootNode/RootNodeMedia';
import BaseMedia from '@/views/GraphMVC/core/View/BaseMedia';
import { wrapperDom } from '@/views/GraphMVC/core/utils';
import { RenderOrder } from '@/views/GraphMVC/graphScene/GraphSceneDefine';
import { createDom } from '@/views/GraphMVC/utils/d2Utils';
import './equipDot.less';
import i18n from '@/localization';
import { Css2dobjectdblClick } from '@/views/GraphMVC/core/View/ObjectPicker';

// 工具函数
const { getD3PosByBimLocation } = baseUtils;

const bgSvg = `<svg class="bg-svg" width="38" height="40" viewBox="0 0 38 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19.5646 2.51709C10.1493 2.51709 2.5166 10.1497 2.5166 19.5651C2.5166 27.1631 7.48714 33.6002 14.3539 35.8021C15.7473 36.2489 17.0593 36.9797 17.9713 38.124L19.2509 39.7295C19.4115 39.9309 19.7177 39.9309 19.8783 39.7295L21.1579 38.124C22.07 36.9797 23.3819 36.2489 24.7753 35.8021C31.6421 33.6002 36.6126 27.1631 36.6126 19.5651C36.6126 10.1497 28.98 2.51709 19.5646 2.51709Z" fill="#246FE5"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M19.3836 3.03351C10.3537 3.03351 3.03351 10.3537 3.03351 19.3836C3.03351 26.6698 7.79991 32.8441 14.3861 34.956C15.825 35.4174 17.225 36.1858 18.2113 37.4232L19.3836 38.894L20.5559 37.4232C21.5422 36.1858 22.9423 35.4174 24.3812 34.956C30.9674 32.8441 35.7338 26.6698 35.7338 19.3836C35.7338 10.3537 28.4136 3.03351 19.3836 3.03351ZM2 19.3836C2 9.78292 9.78292 2 19.3836 2C28.9844 2 36.7673 9.78292 36.7673 19.3836C36.7673 27.132 31.6982 33.6951 24.6967 35.9402C23.3785 36.3629 22.1825 37.0406 21.3641 38.0674L20.0981 39.6558C19.7323 40.1147 19.035 40.1147 18.6692 39.6558L17.4032 38.0674C16.5847 37.0406 15.3888 36.3629 14.0705 35.9402C7.06906 33.6951 2 27.132 2 19.3836Z" fill="white"/>
</svg>
`;

export default class EquipDotInfoMedia extends BaseMedia {
    constructor(equipData, rootMedia) {
        super(equipData, rootMedia);
        this.init();
        this.model.addObserver('ChangeState', e => this.equipDotInfoStateChanged(e));
    }

    makeObject3D() {
        const {
            equipData: { localName },
            svg
        } = this.model;
        this.$dom = createDom({
            tagName: 'div',
            classList: ['equip-dot-info-container'],
            style: { display: 'block', transform: 'translateY(calc(50% - 4px))' }
        });

        this.$container = createDom({
            tagName: 'div',
            classList: ['equip-dot-normal-dom'],
            appendTo: this.$dom
        });

        this.$dot = createDom({
            tagName: 'div',
            classList: ['equip-dot-dot'],
            appendTo: this.$container
        });

        this.$bubble = createDom({
            tagName: 'div',
            classList: ['equip-dot-bubble'],
            innerHTML: `<div
                            class="detail"
                        >${i18n.global.t('meos_control_web.details')}</div>
                        <div class="card-before" />`,
            appendTo: this.$container
        });

        if (svg) {
            this.$svg = createDom({
                tagName: 'div',
                classList: ['equip-dot-selected'],
                innerHTML: svg + bgSvg,
                appendTo: this.$container
            });
        }

        this.$info = createDom({
            tagName: 'span',
            classList: ['equip-dot-name'],
            innerHTML: localName ?? '--',
            appendTo: this.$container
        });

        this.addMouseEvent();

        const wrapper = wrapperDom(this.$dom);
        const infoMesh = new CSS2DObject(wrapper);
        infoMesh.renderOrder = RenderOrder.equip;
        return infoMesh;
    }

    addMouseEvent() {
        this.$container.addEventListener('mousemove', event => {
            // event.stopPropagation();
            this.rootMedia.emit(Css2dobjectMouseMove, { event, model: this.model.parent });
        });

        this.$container.addEventListener('dblclick', event => {
            // event.stopPropagation();
            this.rootMedia.emit(Css2dobjectdblClick, { event, model: this.model.parent });
        });

        this.$container.addEventListener('pointerdown', event => {
            // event.stopPropagation();
            const detailTrigger = event.target === this.$bubble || this.$bubble.contains(event.target);
            this.rootMedia.emit(Css2dobjectClick, { event, model: this.model.parent, detailTrigger });
        });
    }

    onObject3DLayout() {
        const {
            equipData: { bimLocation }
        } = this.model;
        const infoLocation = getD3PosByBimLocation(bimLocation);
        const position = infoLocation.clone().applyMatrix4(this.parentMedia.object3D.matrix.clone().invert());
        this.object3D.position.copy(position);
    }

    onObject3DMounted() {
        this.equipDotInfoStateChanged();
    }

    equipDotInfoStateChanged() {
        const curStyle = this.model.caclCurrentStyle();
        const { show, dotColor, textShow, dotShow, textColor, priority, cssName, bubbleShow, dotVisible } = curStyle;

        let _show = show;
        if (!this.model.getParentsShow()) {
            _show = false;
            // const parentStyle = this.model.parent.caclCurrentStyle();
            // if (!this.model.parent.show || (parentStyle && !parentStyle.show)) {
            //     _show = false;
            // }
        }
        _show = _show && !this.model.isRemoved();
        this.model.show = _show;

        // console.log('_show: ', _show, this.model._state, this.model.equipData.localName, this.model.caclCurrentStyle());
        if (_show) {
            this.$dom.style.display = '';
            this.object3D.renderOrder = priority;
            if (this.$info) {
                this.$info.style.display = textShow ? '' : 'none';
                if (textColor) {
                    this.$info.style.color = textColor;
                } else {
                    this.$info.style.color = '';
                }
            }

            if (this.$bubble) {
                this.$bubble.style.display = bubbleShow ? '' : 'none';
            }

            if (this.$dot) {
                this.$dot.style.display = dotShow ? '' : 'none';
                this.$dot.style.backgroundColor = dotColor;
                if (dotVisible) {
                    this.$dot.style.opacity = 1;
                } else {
                    this.$dot.style.opacity = 0;
                }
            }
        } else {
            this.$dom.style.display = 'none';
        }

        if (this.lastStyle && this.lastStyle.cssName) {
            this.$dom.classList.remove(this.lastStyle.cssName);
        }
        if (cssName) {
            this.$dom.classList.add(cssName);
        }

        this.lastStyle = curStyle;
    }

    dispose() {
        super.dispose();

        this.$dom = null;
        this.$container = null;
        this.$dot = null;
        this.$bubble = null;
        this.$info = null;
        this.$svg = null;
    }
}
