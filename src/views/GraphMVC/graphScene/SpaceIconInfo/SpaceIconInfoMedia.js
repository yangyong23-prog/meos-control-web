import { baseUtils } from '@yushu/three-base';
import { CSS2DObject } from '@yushu/three-base/three-extends/jsm/renderers/CSS2DRenderer';
import { createDom } from '../../utils/d2Utils';
import { RenderOrder } from '../GraphSceneDefine';
import BaseMedia from '../../core/View/BaseMedia';
import { Css2dobjectClick, Css2dobjectMouseMove } from '../RootNode/RootNodeMedia';
import { wrapperDom } from '../../core/utils';
import { isUndefined } from 'lodash';
import i18n from '@/localization';
const { getD3PosByBimLocation } = baseUtils;

// 默认选中图标
const SelectedBgSvg = `<svg class="bg-svg" style="display:none" width="38" height="40" viewBox="0 0 38 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19.5646 2.51709C10.1493 2.51709 2.5166 10.1497 2.5166 19.5651C2.5166 27.1631 7.48714 33.6002 14.3539 35.8021C15.7473 36.2489 17.0593 36.9797 17.9713 38.124L19.2509 39.7295C19.4115 39.9309 19.7177 39.9309 19.8783 39.7295L21.1579 38.124C22.07 36.9797 23.3819 36.2489 24.7753 35.8021C31.6421 33.6002 36.6126 27.1631 36.6126 19.5651C36.6126 10.1497 28.98 2.51709 19.5646 2.51709Z" fill="#246FE5"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M19.3836 3.03351C10.3537 3.03351 3.03351 10.3537 3.03351 19.3836C3.03351 26.6698 7.79991 32.8441 14.3861 34.956C15.825 35.4174 17.225 36.1858 18.2113 37.4232L19.3836 38.894L20.5559 37.4232C21.5422 36.1858 22.9423 35.4174 24.3812 34.956C30.9674 32.8441 35.7338 26.6698 35.7338 19.3836C35.7338 10.3537 28.4136 3.03351 19.3836 3.03351ZM2 19.3836C2 9.78292 9.78292 2 19.3836 2C28.9844 2 36.7673 9.78292 36.7673 19.3836C36.7673 27.132 31.6982 33.6951 24.6967 35.9402C23.3785 36.3629 22.1825 37.0406 21.3641 38.0674L20.0981 39.6558C19.7323 40.1147 19.035 40.1147 18.6692 39.6558L17.4032 38.0674C16.5847 37.0406 15.3888 36.3629 14.0705 35.9402C7.06906 33.6951 2 27.132 2 19.3836Z" fill="white"/>
</svg>`;
const DefaultIconSvg = `<svg class="default-svg" style="display:none" width="18" height="25" viewBox="0 0 18 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.98748 0.0405273C10.1838 0.0405273 11.3078 0.268757 12.36 0.724462C13.4116 1.18047 14.3234 1.79664 15.0954 2.57249C15.8865 3.36826 16.5089 4.28948 16.9626 5.3372C17.4157 6.38493 17.6428 7.51035 17.6428 8.71311C17.6428 10.3427 17.1891 12.1035 16.2823 13.9951C15.375 15.8868 14.3812 17.6379 13.3006 19.248C12.2196 20.8588 10.7821 22.7308 8.98742 24.8649C7.19265 22.7308 5.75486 20.8588 4.67415 19.248C3.59315 17.6379 2.59949 15.8868 1.69262 13.9951C0.785312 12.1035 0.332031 10.3427 0.332031 8.71311C0.332031 7.51035 0.558627 6.38493 1.01233 5.3372C1.46546 4.28948 2.08781 3.36826 2.87932 2.57249C3.6511 1.79661 4.56291 1.18044 5.61491 0.724462C6.66674 0.268757 7.79059 0.0405273 8.98748 0.0405273ZM8.98748 11.8269C9.41182 11.8269 9.81253 11.7447 10.1889 11.5796C10.5652 11.4149 10.8881 11.1967 11.1586 10.9248C11.448 10.6338 11.6748 10.2991 11.8389 9.92066C12.0027 9.54241 12.0849 9.13995 12.0849 8.71296C12.0849 8.2865 12.0027 7.8835 11.8389 7.50525C11.6748 7.12682 11.448 6.80224 11.1586 6.5303C10.8882 6.23928 10.5652 6.01646 10.1889 5.86097C9.81253 5.70582 9.41182 5.62807 8.98748 5.62807C8.56291 5.62807 8.16259 5.70582 7.7862 5.86097C7.40993 6.01646 7.08654 6.23925 6.81644 6.5303C6.52697 6.80227 6.29999 7.12697 6.13629 7.50525C5.97206 7.88365 5.89021 8.2865 5.89021 8.71296C5.89021 9.13995 5.97206 9.54241 6.13629 9.92066C6.29999 10.2991 6.52697 10.6338 6.81644 10.9248C7.08654 11.1967 7.40993 11.415 7.7862 11.5796C8.16244 11.7447 8.56291 11.8269 8.98748 11.8269Z" fill="white"/>
                    </svg>`;

const stopPropagation = dom => {
    dom.addEventListener('mouseup', event => {
        event.stopPropagation();
    });
    dom.addEventListener('mousedown', event => {
        event.stopPropagation();
    });
};
export default class SpaceIconInfoMedia extends BaseMedia {
    stateCssClass = {
        selected: 'selected',
        active: 'active',
        hover: 'hover'
    };

    constructor(spaceIconInfo, rootMedia) {
        super(spaceIconInfo, rootMedia);
        this.spaceIconInfo = spaceIconInfo;
        this.transformScale = `scale(${this.model.scale}) `;
        this.init();
        this.model.addObserver('ChangeState', e => this.spaceIconInfoMediaStateChanged(e));
        this.lastParentMatrix = null;
    }

    // 重写父类方法，生成模型
    makeObject3D() {
        // this.$dom = null;
        const {
            model: { spaceData, floorHeight, svg, bgColor }
        } = this;

        this.$dom = createDom({
            tagName: 'div',
            classList: ['space-info-container'],
            style: { transform: `${this.transformScale}translate(0,0)` }
        });
        this.$dom.appendChild(this._getNormalDom());
        const wrapper = wrapperDom(this.$dom);
        const iconInfoMesh = new CSS2DObject(wrapper);

        iconInfoMesh.renderOrder = RenderOrder.clickOn;
        return iconInfoMesh;
    }

    onObject3DLayout() {
        const {
            model: { spaceData, height = 0, floorHeight, svg, bgColor, bimLocation }
        } = this;
        const infoLocation = this.model.bimLocation.clone();
        infoLocation.setY(floorHeight + height + 0.1);
        const position = infoLocation.clone().applyMatrix4(this.parentMedia.object3D.matrix.clone().invert());
        this.model.infoLocation = infoLocation; // 用作碰撞的Location
        this.model.iconInfoLocation = position;
        this.object3D.position.copy(position);
    }

    _getNormalDom() {
        if (this.$normalDom) return this.$normalDom;
        const {
            model: { spaceData, floorHeight, svg, bgColor }
        } = this;
        const showName = spaceData.localName || spaceData.name || '--';
        this.$normalDom = createDom({
            tagName: 'div',
            classList: ['space-normal-dom']
        });
        this.$divsname = createDom({
            tagName: 'span',
            classList: ['space-name'],
            innerHTML: showName,
            appendTo: this.$normalDom
        });
        const divs = `<div class="space_popupprompt"><span class="space_popupprompt_h3">${showName}</span><span  class="isCustomizedSetting ${
            spaceData.isCustomizedSetting ? 'space_popupprompt_pz' : 'space_popupprompt_vpz'
        }">${spaceData.isCustomizedSetting ? i18n.global.t('meos_control_web.already_configured') : i18n.global.t('meos_control_web.unconfiged')}</span></div>`;
        this.$divs = createDom({
            tagName: 'span',
            classList: ['space-name'],
            innerHTML: divs,
            appendTo: this.$normalDom
        });
        this.$normalDom.addEventListener('mousemove', event => {
            // 阻止mousemove事件穿透
            event.stopPropagation();
            this.rootMedia.emit(Css2dobjectMouseMove, { event, model: this.model.parent });
        });

        this.$normalDom.addEventListener('pointerdown', event => {
            // event.preventDefault();
            event.stopPropagation();
            this.rootMedia.emit(Css2dobjectClick, { event, model: this.model.parent });
        });
        // 阻止mouse相关事件，触发地图click事件
        stopPropagation(this.$normalDom);

        return this.$normalDom;
    }

    onObject3DMounted() {
        this.spaceIconInfoMediaStateChanged();
    }

    spaceIconInfoMediaStateChanged() {
        const editState = this.model.getState('editState');
        const curStyle = this.model.caclCurrentStyle();
        const { show, color, textShow, iconShow, priority, textColor, iconbgColor, svgFillColor, cssName, renderOrder, actionShow } = curStyle;
        this.model.show = show;
        let CustomizedSettingDom = this.$divs.querySelector('.isCustomizedSetting');
        CustomizedSettingDom?.classList.remove('space_popupprompt_vpz');
        CustomizedSettingDom?.classList.remove('space_popupprompt_pz');
        if (CustomizedSettingDom) {
            if (editState) {
                CustomizedSettingDom.innerHTML = i18n.global.t('meos_control_web.already_configured');
                CustomizedSettingDom.classList.add('space_popupprompt_pz');
            } else {
                CustomizedSettingDom.classList.add('space_popupprompt_vpz');
                CustomizedSettingDom.innerHTML = i18n.global.t('meos_control_web.unconfiged');
            }
        }
        // if(cssName == 'hover'){
        //     this.$divs.style.display = 'block';
        // this.$divsname.style.display = 'block';
        // }else{
        if (actionShow) {
            this.$divs.style.display = 'block';
            this.$divsname.style.display = 'none';
        } else {
            this.$divs.style.display = 'none';
            this.$divsname.style.display = 'block';
        }
        if (textShow && !isUndefined(textShow)) {
            // this.$divs.style.display = 'none';
            this.$divsname.style.display = 'none';
        } else {
            this.$divs.style.display = 'none';
            this.$divsname.style.display = 'block';
        }
        // this.$divs.style.display = 'none' ;
        // this.$divsname.style.display = 'block';

        // }
        // if(clickOn){
        //     this.$divs.style.display = 'block';
        //     this.$divsname.style.display = 'none';
        // }
        this.object3D.renderOrder = renderOrder;

        this.lastStyle = curStyle;
    }

    // spaceIconInfoSubStateChanged() {
    //     const {
    //         model: {
    //             subState, _hasIcon, state
    //         }
    //     } = this;
    //     const txtEle = this.object3D.element.getElementsByClassName('space-name')[0];
    //     const isTxtShow = false,
    //         isIconShow = false;
    //     this.updateMount();
    // }

    calcCenterOffset(isSelected, isTxtShow, isIconShow) {
        const conEle = this.getContainerDom();

        const txtRect = this.model.getTextRect();
        // icon中心定位
        let domHeight = 0;
        if (isSelected) {
            // eslint-disable-next-line no-undef
            domHeight += bgIconRect.height;
            if (txtRect) {
                domHeight += txtRect.height;
            }
            // eslint-disable-next-line no-undef
            const offsetY = bgIconRect.height - domHeight / 2;
            conEle.style.transform = `${this.transformScale}translate(0,${-(offsetY + 1)}px)`;
        } else {
            if (isTxtShow && isIconShow) {
                // eslint-disable-next-line no-undef
                domHeight += iconRect.height;
                if (txtRect) {
                    domHeight += txtRect.height;
                }
                // eslint-disable-next-line no-undef
                const offsetY = iconRect.height / 2 - domHeight / 2;
                conEle.style.transform = `${this.transformScale}translate(0,${-offsetY}px)`;
            } else if (isTxtShow) {
                conEle.style.transform = `${this.transformScale}translate(0,0px)`;
            } else if (isIconShow) {
                conEle.style.transform = `${this.transformScale}translate(0,0px)`;
            }
        }
    }

    /**
     * 检测更新挂载/卸载对象
     */
    updateMount() {
        const {
            model: { subState, _hasIcon, disabledCollision, disabledScale }
        } = this;
    }

    getContainerDom() {
        const ele = this.object3D.element.getElementsByClassName('space-info-container');
        if (ele && ele.length > 0) {
            return ele[0];
        }
        return null;
    }

    /**
     * 切换组件container样式
     * @param {*} cssName
     * @param {*} type  1为add样式class否则为remove
     */
    toggleContainerCss(cssName, type = 1) {
        const containerDom = this.getContainerDom();
        if (containerDom) {
            if (type === 1) {
                containerDom.classList.add(cssName);
            } else {
                containerDom.classList.remove(cssName);
            }
        }
    }

    changeColor(textColor, iconbgColor, svgFillColor) {
        this.object3D.element.getElementsByClassName('space-name')[0].style.color = textColor;
        const spaceIconDom = this.object3D.element.getElementsByClassName('space-icon')[0];
        const svg = this.object3D.element.getElementsByTagName('svg')[0];
        if (spaceIconDom) {
            spaceIconDom.style.backgroundColor = iconbgColor;
            svg.style.fill = svgFillColor;
        }
    }
}
