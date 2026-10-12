import { CSS2DObject } from '@yushu/three-base/three-extends/jsm/renderers/CSS2DRenderer';
import { createDom } from '../../utils/d2Utils';
import BaseMedia from '../../core/View/BaseMedia';
import { Css2dobjectClick, Css2dobjectGeneral, Css2dobjectMouseMove } from '../../core/View/ObjectPicker';
import { wrapperDom } from '../../core/utils';
import './InfoPoint.less';
import { showListVm, hideListVm } from './showInfoListHandle';
import { modelNameEnum } from '@/views/GraphMVC/graphScene/GraphSceneDefine';

const settingSvgString = `<svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.986328" y="1.42188" width="21" height="21" rx="10.5" fill="#246FE5"/>
<rect x="0.986328" y="1.42188" width="21" height="21" rx="10.5" stroke="white"/>
<path d="M9.81419 7.88499L11.1295 6.56967C11.3266 6.37261 11.6461 6.37261 11.8432 6.56967L13.1585 7.88499H15.0186C15.2973 7.88499 15.5232 8.11092 15.5232 8.3896V10.2497L16.8385 11.5651C17.0356 11.7621 17.0356 12.0816 16.8385 12.2787L15.5232 13.594V15.4542C15.5232 15.7329 15.2973 15.9588 15.0186 15.9588H13.1585L11.8432 17.2741C11.6461 17.4711 11.3266 17.4711 11.1295 17.2741L9.81419 15.9588H7.95405C7.67536 15.9588 7.44944 15.7329 7.44944 15.4542V13.594L6.13413 12.2787C5.93706 12.0816 5.93706 11.7621 6.13413 11.5651L7.44944 10.2497V8.3896C7.44944 8.11092 7.67536 7.88499 7.95405 7.88499H9.81419ZM8.45866 8.89421V10.6678L7.20457 11.9219L8.45866 13.176V14.9495H10.2322L11.4863 16.2037L12.7404 14.9495H14.514V13.176L15.7681 11.9219L14.514 10.6678V8.89421H12.7404L11.4863 7.64011L10.2322 8.89421H8.45866ZM11.4863 13.9403C10.3716 13.9403 9.46788 13.0366 9.46788 11.9219C9.46788 10.8071 10.3716 9.90343 11.4863 9.90343C12.6011 9.90343 13.5048 10.8071 13.5048 11.9219C13.5048 13.0366 12.6011 13.9403 11.4863 13.9403ZM11.4863 12.9311C12.0437 12.9311 12.4956 12.4793 12.4956 11.9219C12.4956 11.3645 12.0437 10.9127 11.4863 10.9127C10.929 10.9127 10.4771 11.3645 10.4771 11.9219C10.4771 12.4793 10.929 12.9311 11.4863 12.9311Z" fill="white"/>
</svg>
`;

export default class InfoPointMedia extends BaseMedia {
    constructor(linkLineInfo, rootMedia) {
        super(linkLineInfo, rootMedia);
        this.init();
        this.model.addObserver('ChangeState', e => this.stateChanged(e));
        this.model.addObserver('infoCodeChange', e => this.infoCodeChange(e));
    }

    // 重写父类方法，生成模型
    makeObject3D() {
        const { data } = this.model;
        const { bimLocation } = data;
        if (!bimLocation) return;

        this.$dom = createDom({
            tagName: 'div',
            classList: ['map-info-point']
        });

        this.$contentContainer = createDom({
            tagName: 'div',
            classList: ['map-info-point-container']
        });
        this.$dom.appendChild(this.$contentContainer);

        this.$pointInfoContent = createDom({
            tagName: 'span',
            classList: ['map-info-point-content']
        });
        this.$contentContainer.appendChild(this.$pointInfoContent);

        this.$pointTriangle = createDom({
            tagName: 'div',
            classList: ['map-info-point-triangle']
        });
        this.$contentContainer.appendChild(this.$pointTriangle);

        this.$settingSvg = createDom({
            tagName: 'div',
            classList: ['map-info-point-setting-svg'],
            innerHTML: settingSvgString
        });
        this.$dom.appendChild(this.$settingSvg);

        this.$dom.addEventListener('mousemove', event => {
            // 阻止mousemove事件穿透
            event.stopPropagation();
            this.rootMedia.emit(Css2dobjectMouseMove, { event, model: this.model });
        });

        // this.$dom.addEventListener('pointerdown', (event) => {
        //     event.stopPropagation();
        //     this.rootMedia.emit(Css2dobjectClick, { event, model: this.model });
        // });

        this.$dom.addEventListener('pointerdown', event => {
            event.stopPropagation();
            if (this._listVm) return;
            this.rootMedia.emit(Css2dobjectClick, { event, model: this.model });
        });

        const wrapper = wrapperDom(this.$dom);
        const css2d = new CSS2DObject(wrapper);

        return css2d;
    }

    onObject3DLayout() {
        this.infoCodeChange();
        this.stateChanged();
    }

    showInfoList() {
        if (this._listVm) return;
        const { data } = this.model;
        const selected = this.model.getState('selected');

        const transform = window.getComputedStyle(this.object3D.element).getPropertyValue('transform');
        const arr = transform.slice(0, -1).split(',');
        const top = Number(arr.pop()) + (selected ? -5 : 0);
        const left = Number(arr.pop());

        let rootScene = this.model.mapScene;
        while (rootScene.parent) {
            rootScene = rootScene.parent;
        }
        this._listVm = showListVm(
            {
                equipData: data,
                selectedCode: this.model.data._infoCode,
                left,
                top
            },
            rootScene?.app?.dom,
            this
        );

        this.rootMedia.emit(Css2dobjectGeneral, { eventType: 'showInfoPoint', model: this.model });

        this._listVm.$on('hide', () => {
            this.rootMedia.emit(Css2dobjectGeneral, {
                eventType: 'hideInfoPoint',
                model: this.model
            });
            this.hideInfoList();
        });

        this._listVm.$on('click', item => {
            this.rootMedia.emit(Css2dobjectGeneral, {
                eventType: 'switchShowInfoPoint',
                model: this.model,
                codeObj: item,
                classCode: data.classCode
            });
            this.hideInfoList();
        });
    }

    hideInfoList() {
        if (!this._listVm) return;
        hideListVm(this._listVm);
        this._listVm = null;
    }

    infoCodeChange() {
        if (!this.$pointInfoContent) return;
        this.$pointInfoContent.innerHTML = this.model.infoTxt;
        // 为dom 元素 this.$pointInfoContent 设置title属性
        this.$pointInfoContent.title = this.model.infoTxt;
    }

    stateChanged() {
        const { show, renderOrder, bgColor, showSetting, showList, translateY, opacity } = this.model.caclCurrentStyle();

        let _show = show;
        if (!this.model.getParentsShow()) {
            _show = false;
        }

        if (this.model.parent?.name === modelNameEnum.SpaceIconInfo) {
            const parentStyle = this.model.parent.caclCurrentStyle();
            if (!parentStyle.textShow) {
                _show = false;
            }
        }

        _show = _show && !this.model.isRemoved();
        this.model.show = _show;

        if (!this.model.show) return this.hideInfoList();

        if (this.$dom) {
            this.$dom.style.transform = `translateY(${translateY}px)`;
        }

        if (this.$contentContainer) {
            this.$contentContainer.style.backgroundColor = bgColor;
            this.$contentContainer.style.opacity = opacity;
        }
        if (this.$pointTriangle) {
            this.$pointTriangle.style.backgroundColor = bgColor;
        }

        if (showSetting) {
            this.$settingSvg.style.display = 'block';
        } else {
            this.$settingSvg.style.display = 'none';
        }

        if (showList) {
            this.showInfoList();
        } else {
            this.hideInfoList();
        }

        if (renderOrder) {
            this.object3D.renderOrder = renderOrder;
        }
    }
}
