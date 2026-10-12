import * as THREE from '@yushu/three-base';
import { throttle } from 'lodash';
import Observable from '../Base/Observable';

export const Css2dobjectClick = 'css2dobjectclick';
export const Css2dobjectdblClick = 'css2dobjectdblclick';
export const Css2dobjectMouseMove = 'css2dobjectmousemove';
export const Css2dobjectGeneral = 'Css2dobjectGeneral';

export default class ObjectPicker extends Observable {
    constructor(mapMedia, renderingContext) {
        super();
        this.mapMedia = mapMedia;
        this.renderingContext = renderingContext;
        this.evnetDom = this.renderingContext.css3dRender.domElement;

        this.hasMove = false;
        this.mouseDown = false;

        this.throttleViewOnMouseMove = throttle(this.viewOnMouseMove, 60);
        this.listenerAbortController = new AbortController();
    }

    initialize() {
        this.raycaster = new THREE.Raycaster();
        this.raycaster.firstHitOnly = true;

        this.evnetDom.addEventListener('dblclick', e => this.viewOnDoubleClick(e), { signal: this.listenerAbortController?.signal });
        // 无法监听CSS2DObject的click事件
        this.evnetDom.addEventListener('mouseup', e => this.viewMouseUp(e), { signal: this.listenerAbortController?.signal });
        this.evnetDom.addEventListener('mousedown', e => this.viewMouseDown(e), { signal: this.listenerAbortController?.signal });
        this.evnetDom.addEventListener(
            'mousemove',
            e => {
                if (e.target !== this.evnetDom) return;
                this.throttleViewOnMouseMove(e);
            },
            { signal: this.listenerAbortController?.signal }
        );
        this.evnetDom.addEventListener(
            'mouseleave',
            event => {
                this.throttleViewOnMouseMove(event, true);
                this.mouseDown = false;
            },
            { signal: this.listenerAbortController?.signal }
        );

        this.mapMedia.addObserver(
            Css2dobjectClick,
            params => {
                this.emit('click', params);
            },
            { signal: this.listenerAbortController?.signal }
        );

        this.mapMedia.addObserver(
            Css2dobjectdblClick,
            params => {
                this.emit('doubleclick', params);
            },
            { signal: this.listenerAbortController?.signal }
        );

        this.mapMedia.addObserver(
            Css2dobjectMouseMove,
            params => {
                this.throttleViewOnMouseMove(params, true);
            },
            { signal: this.listenerAbortController?.signal }
        );

        this.mapMedia.addObserver(
            Css2dobjectGeneral,
            params => {
                this.emit('general', params);
            },
            { signal: this.listenerAbortController?.signal }
        );
    }

    emit(label, e) {
        const { model } = e;
        if (model) {
            if (model.userinteractionEnable === true) {
                super.emit(label, e);
            }
        } else {
            super.emit(label, e);
        }
    }

    viewOnDoubleClick(event) {
        if (event.target !== this.evnetDom) return;
        const obj = this.getIntersection(event) || {};
        const { model, point } = obj;
        this.emit('doubleclick', { event, model, point });
    }

    viewMouseDown(event) {
        if (event.target !== this.evnetDom) return;
        this.hasMove = false;
        this.mouseDown = true;
    }

    viewMouseUp(event) {
        if (event.target !== this.evnetDom) return;
        if (this.hasMove === false && this.mouseDown) {
            const obj = this.getIntersection(event) || {};
            const { model, point } = obj;
            this.emit('click', { event, model, point });
        }
        this.mouseDown = false;
    }

    viewOnMouseMove(event, fromDom) {
        if (fromDom) {
            this.emit('mousemove', event);
        } else {
            this.hasMove = true;
            if (this.mouseDown === false) {
                const obj = this.getIntersection(event) || {};
                const { model, point } = obj;
                this.emit('mousemove', { event, model, point });
            }
        }
    }

    getIntersection(e) {
        const { left, top } = this.renderingContext.css3dRender.domElement.getBoundingClientRect();
        const offsetX = e.clientX - left;
        const offsetY = e.clientY - top;
        const movePointer = new THREE.Vector2([0, 0]); // 移动事件的pointer
        movePointer.x = (offsetX / this.renderingContext.canvasWidth) * 2 - 1;
        movePointer.y = -(offsetY / this.renderingContext.canvasHeight) * 2 + 1;
        this.raycaster.setFromCamera(movePointer, this.renderingContext.camera);
        const intersectsMeshs = [];
        this.mapMedia.object3D.traverse(object => {
            if (!object.isHelper && object.geometry && object.media && object.media.model && object.media.model.userinteractionEnable) intersectsMeshs.push(object);
        });
        const intersects = intersectsMeshs.length > 0 ? this.raycaster.intersectObjects(intersectsMeshs) : [];
        if (intersects && intersects.length === 0) {
            return null;
        }
        const rayObject = intersects.find(element => {
            const { object } = element;
            return object.id && object.media && object.media.model && object.media.model.userinteractionEnable;
        });
        if (rayObject && rayObject.object && rayObject.object.media.model) {
            return { model: rayObject.object.media.model, point: rayObject.point };
        }
    }

    dispose() {
        this.throttleViewOnMouseMove?.flush();
        this.throttleViewOnMouseMove = null;
        this.listenerAbortController?.abort();
        this.listenerAbortController = null;
        this.mapMedia = null;
        this.evnetDom = null;
    }
}
