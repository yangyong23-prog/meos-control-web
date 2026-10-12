// @ts-ignore
import i18n from '@/localization';
import { baseUtils } from '@yushu/three-base';
import { CSS2DObject } from '@yushu/three-base/three-extends/jsm/renderers/CSS2DRenderer';
import { Css2dobjectClick, Css2dobjectMouseMove } from '@/views/GraphMVC/graphScene/RootNode/RootNodeMedia';
import BaseMedia from '@/views/GraphMVC/core/View/BaseMedia';
import { wrapperDom } from '@/views/GraphMVC/core/utils';
import { RenderOrder } from '@/views/GraphMVC/graphScene/GraphSceneDefine';
import { createDom } from '@/views/GraphMVC/utils/d2Utils';
import TWEEN from '@tweenjs/tween.js';
import { convertCoordinateByBluetoothSignCalLocation } from '@/apm-3d/utils/buildingTools';
import './robotInfo.less';

// 工具函数
const { getD3PosByBimLocation } = baseUtils;

export default class RobotInfoMedia extends BaseMedia {
    constructor(equipData, rootMedia) {
        super(equipData, rootMedia);
        this.init();
        this.model.addObserver('ChangeState', e => this.equipDotInfoStateChanged(e));
        this.model.addObserver('iotDataChange', e => this.iotDataChange(e));

        this.moveTween = null;
        this.animate = time => {
            if (this.moveTween) {
                this.moveTween.update(time);
                requestAnimationFrame(this.animate);
            }
        };
        this.tweenRAF = null;
    }

    makeObject3D() {
        const {
            equipData: { localName, name }
        } = this.model;
        this.$dom = createDom({
            tagName: 'div',
            classList: ['robot-info-container'],
            style: { display: 'block', transform: 'translateY(calc(50% - 4px))' }
        });

        this.$container = createDom({
            tagName: 'div',
            classList: ['robot-info-normal-dom'],
            appendTo: this.$dom
        });

        this.$normalDom = createDom({
            tagName: 'div',
            classList: ['robot-info-dot'],
            appendTo: this.$container
        });

        this.$robotIcon = createDom({
            tagName: 'div',
            classList: ['robot-icon'],
            style: {},
            innerHTML: '',
            appendTo: this.$normalDom
        });

        this.$info = createDom({
            tagName: 'span',
            classList: ['robot-info-name'],
            innerHTML: (localName || name) ?? '--',
            appendTo: this.$container
        });

        this.addMouseEvent();
        const wrapper = wrapperDom(this.$dom);
        const infoMesh = new CSS2DObject(wrapper);
        infoMesh.renderOrder = RenderOrder.equip;
        return infoMesh;
    }

    addMouseEvent() {
        const {
            equipData: { classCode }
        } = this.model;
        if (classCode === 'PDPDRB') {
            // 只有机器人才支持交互
            this.$container.addEventListener('mousemove', event => {
                // event.stopPropagation();
                this.rootMedia.emit(Css2dobjectMouseMove, { event, model: this.model });
            });
            this.$container.addEventListener('pointerdown', event => {
                // event.stopPropagation();
                const detailTrigger = event.target === this.$bubble || this.$bubble.contains(event.target);
                this.rootMedia.emit(Css2dobjectClick, { event, model: this.model, detailTrigger });
            });
        }
    }

    onObject3DLayout() {
        const {
            equipData: { bluetoothSignCalLocation },
            floorHeight,
            height
        } = this.model;
        const infoLocation = getD3PosByBimLocation(convertCoordinateByBluetoothSignCalLocation(bluetoothSignCalLocation));
        const position = infoLocation.clone().applyMatrix4(this.parentMedia.object3D.matrix.clone().invert());
        position.setY(floorHeight + height + 0.1);
        this.object3D.position.copy(position);
    }

    onObject3DMounted() {
        this.equipDotInfoStateChanged();
    }

    equipDotInfoStateChanged() {
        const curStyle = this.model.caclCurrentStyle();
        const { bgc, svg, show } = curStyle;
        let _show = show;
        if (!this.model.getParentsShow()) {
            _show = false;
        }
        _show = _show && !this.model.isRemoved();
        this.model.show = _show;
        if (!this.model.show) return;

        this.$robotIcon.innerHTML = svg;
        this.$normalDom.style.backgroundColor = bgc;
    }

    iotDataChange({ infoCode, dataValue }) {
        const { floorHeight, height } = this.model;
        if (infoCode === 'bluetoothSignCalLocation') {
            this.model.equipData.bluetoothSignCalLocation = dataValue;
            const newPosition = getD3PosByBimLocation(convertCoordinateByBluetoothSignCalLocation(dataValue));
            newPosition.setY(floorHeight + height + 0.1);
            if (this.tweenRAF) {
                cancelAnimationFrame(this.tweenRAF);
                this.tweenRAF = null;
            }
            this.moveTween = new TWEEN.Tween(this.object3D.position)
                .to(newPosition, 500)
                .easing(TWEEN.Easing.Cubic.InOut)
                .start()
                .onComplete(() => {
                    this.moveTween = null;
                });
            this.tweenRAF = requestAnimationFrame(this.animate);
        }
    }
}
