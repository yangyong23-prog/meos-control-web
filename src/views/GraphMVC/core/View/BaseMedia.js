/* eslint-disable class-methods-use-this */
import * as THREE from '@yushu/three-base';
import { acceleratedRaycast, computeBoundsTree, disposeBoundsTree } from 'three-mesh-bvh';

import Observable from '../Base/Observable';
import { genMediaInstance } from '../Graph';

const { ResourceTracker } = THREE.baseUtils;

THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;
export default class BaseMedia extends Observable {
    constructor(model, rootMedia = null) {
        super();
        // 子类中使用
        this.model = model;
        this.option = (model.rootModel || model).option;
        // 使所有子节点获取到根节点
        this.rootMedia = rootMedia || this;
        this.childMedias = new Map();
        this.parentMedia = null; // 父级节点
        this.model.addObserver('showObject3D', () => this.show());
        this.model.addObserver('hideObject3D', () => this.hide());

        this.model.addObserver('addChild', e => this.addChild(e));
        this.model.addObserver('removeChild', e => this.removeChild(e));

        // 垃圾回收
        this.tracker = this.rootMedia?.tracker || new ResourceTracker();
        this.track = this.tracker.track.bind(this.tracker);
    }

    init() {
        this.object3D = this.track(this.makeObject3D());
        if (this.object3D) {
            // 为模型标记实例名称，可用做业务上的区分或调试用
            this.object3D.name = this.model.name;
            // 遍历节点，为Mesh模型设置数据
            this.object3D.traverse(object3D => {
                object3D.media = this;
            });
        }
    }

    show() {
        if (this.parentMedia) {
            this.parentMedia.object3D.add(this.object3D);
        } else if (this.rootMedia === this) {
            // 根节点无法重复添加，只能显隐控制
            this.object3D.visible = true;
        }
    }

    hide() {
        if (this.rootMedia === this) {
            // 根节点无法移除，只能显隐控制
            this.object3D.visible = false;
        } else if (this.object3D) {
            this.object3D.removeFromParent();
        }
    }

    // 子类实现生成模型
    makeObject3D() {
        return new THREE.Object3D();
    }

    // 子类实现，此时Object3D已经创建完成且已经添加进虚拟树
    onObject3DMounted() {}

    // 子类实现设置模型坐标，此时可以拿到父节点的模型，可以做矩阵变化等的操作
    onObject3DLayout() {}

    // 操作数模对象，即可实现对模型的控制
    addChild(object) {
        if (!object) return;
        // 避免重复添加
        if (this.childMedias.get(object)) return;
        // 工厂模式
        const media = genMediaInstance(object.name, [object, this.rootMedia]);
        if (!media) {
            console.error('【工厂模式生成Media失败】', object, this);
            return;
        }
        media.parentMedia = this;
        media.onObject3DLayout();
        if (media.model.show) {
            this.object3D?.add(media.object3D);
        }

        media.onObject3DMounted();
        // 以数模对象为Key，以媒体(mesh)对象为value
        this.childMedias.set(object, media);
    }

    // 操作数模对象，即可实现对模型的控制
    removeChild(object) {
        const media = this.childMedias.get(object);
        if (media) {
            this.object3D?.remove(media.object3D);
            if (media.afterRemoved) {
                media.afterRemoved();
            }
            media.dispose();
            this.childMedias.delete(object);
        }
    }

    // 递归刷新，每帧调用，提供子类重写（如修改位置模型生成动画等）
    onFrameRenderered() {
        // eslint-disable-next-line no-restricted-syntax
        for (const childMedia of this.childMedias.values()) {
            childMedia.onFrameRenderered();
        }
    }

    // 场景框架的对象在此方法中销毁；e.g Media中的材质、纹理、几何体等销毁；Css2d中用于移除监听等
    dispose() {
        // eslint-disable-next-line no-restricted-syntax
        for (const childMedia of this.childMedias.values()) {
            childMedia.dispose();
        }
        this.childMedias.clear();
        this.model.dispose();
        this.tracker.dispose();
        if (this.object3D) {
            this.object3D.traverse(object3D => {
                object3D.media = null;
            });
            this.object3D.parent = null;
            // this.object3D = null;
        }
        this.parentMedia = null;
        this.rootMedia = null;
        this.model = null;
        this.track = null;
        this.tracker = null;
    }
}
