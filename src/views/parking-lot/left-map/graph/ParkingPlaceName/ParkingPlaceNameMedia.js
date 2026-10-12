// @ts-ignore
import i18n from '@/localization';
// import { baseUtils } from '@yushu/three-base';
import { CSS2DObject } from '@yushu/three-base/three-extends/jsm/renderers/CSS2DRenderer';
import BaseMedia from '@/views/GraphMVC/core/View/BaseMedia';
import { createVNode, render } from 'vue';
import * as THREE from '@yushu/three-base';

// const { setMeshUpToY, outlineParseToMesh } = THREE.baseUtils;

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
// 工具函数
import ParkingPlaceNameComponent from './ParkingPlaceName.vue';
export default class ParkingPlaceNameMedia extends BaseMedia {
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
        this.vueApp = vueApp(ParkingPlaceNameComponent, { model: this.model, currentStyle: null, rootMedia: this.rootMedia });
        const rootDom = this.vueApp.getDom();
        const object3D = new CSS2DObject(rootDom);
        // console.log('normalDom: ', normalDom);
        this.addMouseEvent(rootDom);

        return object3D;
    }

    addMouseEvent(labelDom) {
        labelDom.addEventListener('mousemove', event => {
            event.stopPropagation();
            this.rootMedia.emit('css2dobjectmousemove', { event, model: this.model.parent });
        });

        labelDom.addEventListener('pointerdown', event => {
            this.rootMedia.emit('css2dobjectclick', { event, model: this.model.parent });
        });
    }

    onObject3DLayout() {
        if (this.model?.relationModel?.box3) {
            const { box3 } = this.model.relationModel;
            const boxSize = new THREE.Vector3();
            const center = new THREE.Vector3();
            box3.getSize(boxSize);
            box3.getCenter(center);
            // setMeshUpToY(this.object3D);
            // center.setY(center.y + boxSize.y / 2);
            center.setZ(center.z + boxSize.z / 2);
            const position = center.clone().applyMatrix4(this.parentMedia.object3D.matrix.clone().invert());
            this.object3D.position.copy(position);
        }
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
        this.vueApp.vm.component.props.currentStyle = currentStyle;
    }
}
