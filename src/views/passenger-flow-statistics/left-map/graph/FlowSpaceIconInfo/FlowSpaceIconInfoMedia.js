// @ts-ignore
import i18n from '@/localization';
// import { baseUtils } from '@yushu/three-base';
import { CSS2DObject } from '@yushu/three-base/three-extends/jsm/renderers/CSS2DRenderer';
import BaseMedia from '@/views/GraphMVC/core/View/BaseMedia';
import { createApp, reactive } from 'vue';
import FlowSpaceIconInfoComponent from './FlowSpaceIconInfo.vue';

const createResponsiveElement = (component, { renderData, mediaStyle, events }) => {
    let dom = document.createElement('span');
    const app = createApp(component, events);
    app.provide('renderData', renderData);
    app.provide('mediaStyle', mediaStyle);
    app.mount(dom);

    return {
        app,
        dom
    };
};

// 工具函数
// const { getD3PosByBimLocation } = baseUtils;
export default class FlowSpaceIconInfoMedia extends BaseMedia {
    constructor(model, rootMedia) {
        // ![必须]继承父类
        super(model, rootMedia);
        this.mediaStyle = reactive({
            cardBgColor: '#fff',
            cardFontColor: '#fff',
            iconColor: '#7188A6',
            nameColor: '#1B2129',
            showCard: true,
            showMark: true
        });
        const personNum = this.model?.data?._infoMap?.accmInPeopleFlow?.dataValue ? Math.round(this.model?.data?._infoMap?.accmInPeopleFlow?.dataValue) : 0;
        this.renderData = reactive({
            localName: this.model?.data?.localName ?? '--',
            num: Number(personNum)
        });
        // ![必须]初始化父类方法
        this.init();
        this.model.addObserver('ChangeState', v => {
            this.updateStyle();
        });

        this.model.addObserver('refreshExsitPeopleNum', () => {
            console.log('refreshExsitPeopleNum>>>', Number(this.model?.data?._infoMap?.accmInPeopleFlow?.dataValue || 0));

            this.renderData.num = this.model?.data?._infoMap?.accmInPeopleFlow?.dataValue ? Math.round(this.model?.data?._infoMap?.accmInPeopleFlow?.dataValue) : 0;
        });
    }

    // ![必须]创建css2d图元
    makeObject3D() {
        const { app, dom } = createResponsiveElement(FlowSpaceIconInfoComponent, {
            renderData: this.renderData,
            mediaStyle: this.mediaStyle,
            events: {
                onMouseMove: event => {
                    this.rootMedia.emit('css2dobjectmousemove', { event, model: this.model.parent });
                },
                onDblclick: event => {
                    this.rootMedia.emit('css2dobjectclick', { event, model: this.model.parent });
                },
                onPointerdown: event => {
                    this.rootMedia.emit('css2dobjectclick', { event, model: this.model.parent });
                }
            }
        });
        const object3D = new CSS2DObject(dom);
        return object3D;
    }

    onObject3DLayout() {
        const { height, floorHeight } = this.model;
        // #设置图元位置 -> bimLocation是在SpaceLabelInfo model层定义的
        const infoLocation = this.model.bimLocation.clone();
        infoLocation.setY(floorHeight + height + 0.1);
        const position = infoLocation.clone().applyMatrix4(this.parentMedia.object3D.matrix.clone().invert());
        this.model.infoLocation = infoLocation; // 用作碰撞的Location
        this.model.iconInfoLocation = position;
        this.object3D.position.copy(position);
    }

    onObject3DMounted() {
        this.updateStyle();
    }

    updateStyle() {
        const currentStyle = this.model.caclCurrentStyle();

        const { show, renderOrder, cardBgColor, cardFontColor, showCard, iconColor, nameColor, showMark } = currentStyle;

        let _show = show;
        if (!this.model.getParentsShow()) {
            _show = false;
        }
        _show = _show && !this.model.isRemoved();
        this.model.show = _show;
        this.object3D.renderOrder = renderOrder;

        this.mediaStyle.cardBgColor = cardBgColor;
        this.mediaStyle.cardFontColor = cardFontColor;
        this.mediaStyle.iconColor = iconColor;
        this.mediaStyle.nameColor = nameColor;
        this.mediaStyle.showMark = showMark;
        this.mediaStyle.showCard = showCard;
    }
}
