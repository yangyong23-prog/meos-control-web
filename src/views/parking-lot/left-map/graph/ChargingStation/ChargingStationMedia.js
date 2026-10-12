// @ts-ignore
import i18n from '@/localization';
import { baseUtils } from '@yushu/three-base';
import * as THREE from '@yushu/three-base';
import BaseMedia from '@/views/GraphMVC/core/View/BaseMedia';
import ChargingStationComponent from './ChargingStation.vue';
import { CSS3DObject } from '@yushu/three-base/three-extends/jsm/renderers/CSS3DRenderer';

import { createVNode, render } from 'vue';

const { setMeshUpToY, outlineParseToMesh } = baseUtils;

const vueApp = (component, props) => {
    //1、创造包裹虚拟节点的div元素
    let container = document.createElement('div');
    if (!component) {
        return render(null, container);
    }
    //2、创造虚拟节点
    const vm = createVNode(component, props);
    //3、将虚拟节点创造成真实DOM
    render(vm, container);
    return {
        vm,
        getDom: () => container.firstElementChild,
        removeDom: () => {
            render(null, container);
            container.removeChild(container.firstElementChild);
            container = null;
        }
    };
};
export default class ChargingStationMedia extends BaseMedia {
    constructor(model, rootMedia) {
        // console.log('ChargingStationMedia---constructor: ');
        super(model, rootMedia);
        this.init();

        this.model.addObserver('ChangeState', e => this.stateChanged(e));
    }

    // 重写父类方法，生成模型
    makeObject3D() {
        // console.log('ChargingStationMedia---makeObject3D: ');
        const { data, floorHeight = 0, depth = 0.01 } = this.model;

        let { outline } = data;
        if (typeof outline === 'string') {
            outline = JSON.parse(outline);
        }

        this.vueApp = vueApp(ChargingStationComponent, { model: this.model, currentStyle: null, rootMedia: this.rootMedia });
        const rootDom = this.vueApp.getDom();

        const object3d = new CSS3DObject(rootDom);

        this.addMouseEvent(rootDom);

        return object3d;
    }

    addMouseEvent(labelDom) {
        labelDom.addEventListener('mousemove', event => {
            event.stopPropagation();
            this.rootMedia.emit('css2dobjectmousemove', { event, model: this.model });
        });

        labelDom.addEventListener('pointerdown', event => {
            this.rootMedia.emit('css2dobjectclick', { event, model: this.model });
        });
    }

    onObject3DLayout() {
        // 对于无bimLocation的，以父模型的几何中心点坐标为坐标
        // const baseMesh = this.parentMedia?.object3D?.children?.find(obj3d => obj3d.isBasic);
        // console.log('this.parentMedia: ', this.parentMedia.model?.centerPointer);
        if (this.model?.relationModel?.centerPointer) {
            const { centerPointer } = this.model.relationModel;
            setMeshUpToY(this.object3D);
            this.object3D.position.copy(centerPointer);

            // model.box3是为名字定位用的，size里是调试的经验值
            const size = new THREE.Vector3(7, 0.01, 9);
            const box = new THREE.Box3();
            box.setFromCenterAndSize(centerPointer, size);
            this.model.box3 = box;
        }
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
        this.vueApp.vm.component.props.currentStyle = currentStyle;
    }

    stateChanged(e) {
        this.updateStyle();
    }

    onObject3DMounted() {
        this.updateStyle();
        this.object3D.updateMatrixWorld(true, true);
    }
}
