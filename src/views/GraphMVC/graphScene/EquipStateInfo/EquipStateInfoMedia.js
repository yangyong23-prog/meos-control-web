import { baseUtils, Box3, Vector3 } from '@yushu/three-base';
import { CSS2DObject } from '@yushu/three-base/three-extends/jsm/renderers/CSS2DRenderer';
import { Css2dobjectClick, Css2dobjectMouseMove } from '@/views/GraphMVC/graphScene/RootNode/RootNodeMedia';
import BaseMedia from '@/views/GraphMVC/core/View/BaseMedia';
import { wrapperDom } from '@/views/GraphMVC/core/utils';
import { RenderOrder } from '@/views/GraphMVC/graphScene/GraphSceneDefine';
import { createDom } from '@/views/GraphMVC/utils/d2Utils';
import './equipStateInfo.less';
import { Css2dobjectdblClick } from '@/views/GraphMVC/core/View/ObjectPicker';
import i18n from '@/localization';

// 工具函数
const { getD3PosByBimLocation } = baseUtils;

const bgSvg = `<svg class="bg-svg" width="38" height="40" viewBox="0 0 38 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19.5646 2.51709C10.1493 2.51709 2.5166 10.1497 2.5166 19.5651C2.5166 27.1631 7.48714 33.6002 14.3539 35.8021C15.7473 36.2489 17.0593 36.9797 17.9713 38.124L19.2509 39.7295C19.4115 39.9309 19.7177 39.9309 19.8783 39.7295L21.1579 38.124C22.07 36.9797 23.3819 36.2489 24.7753 35.8021C31.6421 33.6002 36.6126 27.1631 36.6126 19.5651C36.6126 10.1497 28.98 2.51709 19.5646 2.51709Z" fill="#246FE5"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M19.3836 3.03351C10.3537 3.03351 3.03351 10.3537 3.03351 19.3836C3.03351 26.6698 7.79991 32.8441 14.3861 34.956C15.825 35.4174 17.225 36.1858 18.2113 37.4232L19.3836 38.894L20.5559 37.4232C21.5422 36.1858 22.9423 35.4174 24.3812 34.956C30.9674 32.8441 35.7338 26.6698 35.7338 19.3836C35.7338 10.3537 28.4136 3.03351 19.3836 3.03351ZM2 19.3836C2 9.78292 9.78292 2 19.3836 2C28.9844 2 36.7673 9.78292 36.7673 19.3836C36.7673 27.132 31.6982 33.6951 24.6967 35.9402C23.3785 36.3629 22.1825 37.0406 21.3641 38.0674L20.0981 39.6558C19.7323 40.1147 19.035 40.1147 18.6692 39.6558L17.4032 38.0674C16.5847 37.0406 15.3888 36.3629 14.0705 35.9402C7.06906 33.6951 2 27.132 2 19.3836Z" fill="white"/>
</svg>
`;
const DefaultIconSvg = `<svg class="default-svg"   width="18" height="25" viewBox="0 0 18 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.98748 0.0405273C10.1838 0.0405273 11.3078 0.268757 12.36 0.724462C13.4116 1.18047 14.3234 1.79664 15.0954 2.57249C15.8865 3.36826 16.5089 4.28948 16.9626 5.3372C17.4157 6.38493 17.6428 7.51035 17.6428 8.71311C17.6428 10.3427 17.1891 12.1035 16.2823 13.9951C15.375 15.8868 14.3812 17.6379 13.3006 19.248C12.2196 20.8588 10.7821 22.7308 8.98742 24.8649C7.19265 22.7308 5.75486 20.8588 4.67415 19.248C3.59315 17.6379 2.59949 15.8868 1.69262 13.9951C0.785312 12.1035 0.332031 10.3427 0.332031 8.71311C0.332031 7.51035 0.558627 6.38493 1.01233 5.3372C1.46546 4.28948 2.08781 3.36826 2.87932 2.57249C3.6511 1.79661 4.56291 1.18044 5.61491 0.724462C6.66674 0.268757 7.79059 0.0405273 8.98748 0.0405273ZM8.98748 11.8269C9.41182 11.8269 9.81253 11.7447 10.1889 11.5796C10.5652 11.4149 10.8881 11.1967 11.1586 10.9248C11.448 10.6338 11.6748 10.2991 11.8389 9.92066C12.0027 9.54241 12.0849 9.13995 12.0849 8.71296C12.0849 8.2865 12.0027 7.8835 11.8389 7.50525C11.6748 7.12682 11.448 6.80224 11.1586 6.5303C10.8882 6.23928 10.5652 6.01646 10.1889 5.86097C9.81253 5.70582 9.41182 5.62807 8.98748 5.62807C8.56291 5.62807 8.16259 5.70582 7.7862 5.86097C7.40993 6.01646 7.08654 6.23925 6.81644 6.5303C6.52697 6.80227 6.29999 7.12697 6.13629 7.50525C5.97206 7.88365 5.89021 8.2865 5.89021 8.71296C5.89021 9.13995 5.97206 9.54241 6.13629 9.92066C6.29999 10.2991 6.52697 10.6338 6.81644 10.9248C7.08654 11.1967 7.40993 11.415 7.7862 11.5796C8.16244 11.7447 8.56291 11.8269 8.98748 11.8269Z" fill="white"/>
                    </svg>`;

export default class EquipStateInfoMedia extends BaseMedia {
    constructor(equipData, rootMedia) {
        super(equipData, rootMedia);
        this.init();
        this.model.addObserver('ChangeState', e => this.equipStateInfoStateChanged(e));
        this.listenerAbortController = new AbortController();
    }

    makeObject3D() {
        const {
            equipData: { localName },
            svg
        } = this.model;

        this.$dom = createDom({
            tagName: 'div',
            classList: ['equip-state-info-container'],
            style: { display: 'block', transform: 'translateY(calc(50% - 4px))' }
        });

        this.$container = createDom({
            tagName: 'div',
            classList: ['equip-dot-normal-dom'],
            appendTo: this.$dom
        });

        this.$svg = createDom({
            tagName: 'div',
            classList: ['equip-dot-selected'],
            innerHTML: (svg ? svg : DefaultIconSvg) + bgSvg,
            appendTo: this.$container
        });
        // if (svg) {
        // }

        this.$dotWarp = createDom({
            tagName: 'div',
            classList: ['equip-dot-warp'],
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

        this.$infoContainer = createDom({
            tagName: 'span',
            classList: ['equip-dot-name-container'],
            appendTo: this.$container
        });

        this.$textTag = createDom({
            tagName: 'span',
            classList: ['equip-dot-text-tag'],
            innerHTML: localName ?? '--',
            appendTo: this.$infoContainer
        });
        this.$info = createDom({
            tagName: 'span',
            classList: ['equip-dot-name'],
            innerHTML: localName ?? '--',
            appendTo: this.$infoContainer
        });

        this.addMouseEvent();

        const wrapper = wrapperDom(this.$dom);
        const infoMesh = new CSS2DObject(wrapper);
        infoMesh.renderOrder = RenderOrder.equip;
        return infoMesh;
    }

    addMouseEvent() {
        this.$container.addEventListener(
            'mousemove',
            event => {
                // event.stopPropagation();
                this.rootMedia.emit(Css2dobjectMouseMove, { event, model: this.model.parent });
            },
            { signal: this.listenerAbortController?.signal }
        );

        this.$container.addEventListener(
            'dblclick',
            event => {
                // event.stopPropagation();
                this.rootMedia.emit(Css2dobjectdblClick, { event, model: this.model.parent });
            },
            { signal: this.listenerAbortController?.signal }
        );

        this.$container.addEventListener(
            'pointerdown',
            event => {
                // event.stopPropagation();
                const detailTrigger = event.target === this.$bubble || this.$bubble.contains(event.target);
                this.rootMedia.emit(Css2dobjectClick, { event, model: this.model.parent, detailTrigger });
            },
            { signal: this.listenerAbortController?.signal }
        );
    }

    onObject3DLayout() {
        const {
            equipData: { bimLocation }
        } = this.model;
        if (bimLocation) {
            const infoLocation = getD3PosByBimLocation(bimLocation);
            const position = infoLocation.clone().applyMatrix4(this.parentMedia.object3D.matrix.clone().invert());
            this.object3D.position.copy(position);
        } else {
            // 对于无bimLocation的，以父模型的几何中心点坐标为坐标
            const box = new Box3();
            box.setFromObject(this.parentMedia?.object3D);
            const centerP = new Vector3();
            box.getCenter(centerP);
            const position = centerP.clone().applyMatrix4(this.parentMedia.object3D.matrix.clone().invert());
            this.object3D.position.copy(position);
        }
    }

    onObject3DMounted() {
        this.equipStateInfoStateChanged();
    }

    equipStateInfoStateChanged() {
        const curStyle = this.model.caclCurrentStyle();
        const {
            show,
            dotColor,
            dotCssName,
            textShow,
            dotShow,
            textColor,
            textBgColor,
            tagText,
            tagBgColor,
            tagColor = '#ffffff',
            renderOrder,
            textBorder,
            cssName,
            bubbleShow,
            dotVisible,
            opacity
        } = curStyle;

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
            this.$dom.style.opacity = opacity ?? 1;
            this.object3D.renderOrder = renderOrder;
            if (this.$textTag) {
                this.$textTag.style.display = tagText ? '' : 'none';
                if (tagText) {
                    this.$textTag.innerHTML = tagText;
                    this.$infoContainer.style.removeProperty('padding');
                } else {
                    this.$infoContainer.style.padding = '0 4px';
                }
                if (tagColor) {
                    this.$textTag.style.color = tagColor;
                }
                if (tagBgColor) {
                    this.$textTag.style.backgroundColor = tagBgColor;
                    this.$textTag.style.borderRadius = '2px';
                    if (textBgColor) {
                        this.$textTag.style.borderWidth = '0px';
                    } else {
                        this.$textTag.style.borderWidth = '1px';
                    }
                }
            }
            if (this.$infoContainer) {
                this.$infoContainer.style.display = textShow ? '' : 'none';
                this.$infoContainer.style.border = textBorder ? textBorder : '';
                if (this.$info) {
                    if (textColor) {
                        this.$info.style.color = textColor;
                    } else {
                        this.$info.style.color = '';
                    }
                }
                if (textBgColor) {
                    this.$infoContainer.style.backgroundColor = textBgColor;
                    this.$infoContainer.style.textShadow = 'none';
                    // this.$info.style.backgroundColor = textBgColor;
                    this.$info.style.textShadow = 'none';
                } else {
                    this.$infoContainer.style.backgroundColor = '';
                    this.$info.style.backgroundColor = '';
                    this.$info.style.textShadow = '1px 0 0 #ffffff, 0 1px 0 #ffffff, -1px 0 0 #ffffff, 0 -1px 0 #ffffff';
                }
            }

            if (this.$bubble) {
                this.$bubble.style.display = bubbleShow ? '' : 'none';
            }

            if (this.$dotWarp) {
                this.$dotWarp.style.display = dotShow ? '' : 'none';
                const dotColors = dotColor?.split(';') || [];
                const dotCssNames = dotCssName?.split(';') || [];
                if (dotColors.length > 1) {
                    this.$dotWarp.classList.add('equip-dot-more');
                } else {
                    this.$dotWarp.classList.remove('equip-dot-more');
                }
                const dotsHtmlStr = dotColors
                    .map((color, index) => `<span class="dot-out" style="--bg-color:${color}"><span class="equip-dot-dot ${dotCssNames[index] || ''}" ></span></span>`)
                    .join('');
                this.$dotWarp.innerHTML = dotsHtmlStr;
                if (dotVisible) {
                    this.$dotWarp.style.opacity = 1;
                } else {
                    this.$dotWarp.style.opacity = 0;
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
        this.listenerAbortController?.abort();
        this.listenerAbortController = null;
        this.object3D.element = null;
        super.dispose();

        this.$dom = null;
        this.$container = null;
        this.$svg = null;
        this.$dotWarp = null;
        this.$bubble = null;
        this.$infoContainer = null;
        this.$textTag = null;
        this.$info = null;
    }
}
