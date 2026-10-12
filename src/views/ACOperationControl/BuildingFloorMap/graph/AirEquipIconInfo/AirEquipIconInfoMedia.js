// @ts-ignore
import i18n from '@/localization';
// import { baseUtils } from '@yushu/three-base';
import { CSS2DObject } from '@yushu/three-base/three-extends/jsm/renderers/CSS2DRenderer';
import BaseMedia from '@/views/GraphMVC/core/View/BaseMedia';
// 工具函数
// const { getD3PosByBimLocation } = baseUtils;
import AirEquipIconInfoComponent from './AirEquipIconInfo.vue';
import { vueApp } from '@/views/GraphMVC/utils/d2Utils';
export default class AirEquipIconInfoMedia extends BaseMedia {
    constructor(model, rootMedia) {
        // ![必须]继承父类
        super(model, rootMedia);
        // ![必须]初始化父类方法
        this.init();
        this.model.addObserver('ChangeState', v => {
            this.updateStyle();
        });
    }
    // ![必须]创建css2d图元
    makeObject3D() {
        this.vueApp = vueApp(AirEquipIconInfoComponent, { model: this.model, currentStyle: null }, this.rootMedia);
        const rootDom = this.vueApp.getDom();
        const object3D = new CSS2DObject(rootDom);
        this.normalDom = rootDom.querySelector('.ac-equip-2d-warp .normal');
        this.groupDom = rootDom.querySelector('.ac-equip-2d-warp .group-wrap');
        // console.log('normalDom: ', normalDom);
        if (this.normalDom) {
            this.addMouseEvent(this.normalDom);
        }
        if (this.groupDom) {
            this.addGroupEvent(this.groupDom);
        }
        return object3D;
    }

    addMouseEvent(labelDom) {
        this.labelDomMousemove = event => {
            event.stopPropagation();
            this.rootMedia.emit('css2dobjectmousemove', { event, model: this.model.parent });
        };
        labelDom.addEventListener('mousemove', this.labelDomMousemove);

        this.labelDomDblclick = event => {
            event.stopPropagation();
            this.rootMedia.emit('css2dobjectclick', { event, model: this.model.parent });
        };
        labelDom.addEventListener('dblclick', this.labelDomDblclick);

        this.labelDomPointerdown = event => {
            this.rootMedia.emit('css2dobjectclick', { event, model: this.model.parent });
        };
        labelDom.addEventListener('pointerdown', this.labelDomPointerdown);
    }
    removeMouseEvent(labelDom) {
        labelDom.removeEventListener('mousemove', this.labelDomMousemove);
        labelDom.removeEventListener('dblclick', this.labelDomDblclick);
        labelDom.removeEventListener('pointerdown', this.labelDomPointerdown);
    }
    addGroupEvent(groupDom) {
        this.groupDomMousemove = event => {
            event.stopPropagation();
            this.rootMedia.emit('css2dobjectmousemove', { event, model: this.model.parent });
        };
        groupDom.addEventListener('mousemove', this.groupDomMousemove);
    }
    removeGroupEvent(groupDom) {
        groupDom.removeEventListener('mousemove', this.groupDomMousemove);
    }

    onObject3DLayout() {
        // #设置图元位置 -> bimLocation是在SpaceLabelInfo model层定义的
        this.object3D.position.copy(this.model.bimLocation);
    }

    onObject3DMounted() {
        this.updateStyle();
    }

    updateStyle() {
        const currentStyle = this.model.caclCurrentStyle();

        const { show, renderOrder } = currentStyle;

        let _show = show;
        if (!this.model.getParentsShow()) {
            _show = false;
        }
        _show = _show && !this.model.isRemoved();
        this.model.show = _show;

        this.object3D.renderOrder = renderOrder;

        this.vueApp.setProps('currentStyle', currentStyle);
        this.vueApp.setProps(
            'absorbList',
            this.model.absorbs?.map(m => {
                const d = m.data || {};
                return {
                    localName: d.localName ?? '--',
                    id: d.id
                };
            })
        );
    }

    dispose() {
        if (this.normalDom) {
            this.removeMouseEvent(this.normalDom);
            this.normalDom = null;
        }
        if (this.groupDom) {
            this.removeGroupEvent(this.groupDom);
            this.groupDom = null;
        }
        this.vueApp.dispose();
        this.vueApp = null;
        super.dispose();
    }
}
