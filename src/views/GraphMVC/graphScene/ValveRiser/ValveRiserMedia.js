import * as THREE from '@yushu/three-base';
import { CSS3DObject } from '@yushu/three-base/three-extends/jsm/renderers/CSS3DRenderer';
import BaseMedia from '../../core/View/BaseMedia';
import { Css2dobjectClick, Css2dobjectMouseMove } from '../RootNode/RootNodeMedia';

import { PIPE_SCALE_Y, PIPE_RADIUS } from '../GraphSceneDefine';
import { createDom } from '@/views/GraphMVC/utils/d2Utils';
import './valveRiser.less';

const COLOR_NAME = {
    white: 'white',
    grey: 'grey'
};
const VALVE_SIZE = {
    width: 2,
    height: 2
};
const RISER_SIZE = {
    width: 1,
    height: 1
};
const AIR_OUTLET_SIZE = {
    width: 2,
    height: 2
};

// ACVVEO、ACVVEJ的左边，带M的
const iconFaMenDianDongLeftSvg = () => `<svg width="2" height="2" viewBox="0 0 2 2" fill="none" xmlns="http://www.w3.org/2000/svg">
<path name="${COLOR_NAME.white}" d="M1.07437 1.00011L0.266893 1.4846L0.266893 0.515625L1.07437 1.00011Z" fill="white"/>
<path name="${COLOR_NAME.grey}" fill-rule="evenodd" clip-rule="evenodd" d="M1.07437 1.00011L0.266893 0.515625L0.266893 1.4846L1.07437 1.00011ZM0.9124 1.00011L0.350226 0.662808L0.350226 1.33742L0.9124 1.00011Z" fill="#6F6F6F"/>
<path name="${COLOR_NAME.grey}" fill-rule="evenodd" clip-rule="evenodd" d="M1.04168 0.5L1.04168 1L0.958344 1L0.958344 0.5L1.04168 0.5Z" fill="#6F6F6F"/>
<path name="${COLOR_NAME.white}" d="M1.33332 0.333333C1.33332 0.517428 1.18408 0.666667 0.99999 0.666667C0.815895 0.666667 0.666656 0.517428 0.666656 0.333333C0.666656 0.149238 0.815895 0 0.99999 0C1.18408 0 1.33332 0.149238 1.33332 0.333333Z" fill="white"/>
<path name="${COLOR_NAME.grey}" fill-rule="evenodd" clip-rule="evenodd" d="M0.99999 0.583333C1.13806 0.583333 1.24999 0.471405 1.24999 0.333333C1.24999 0.195262 1.13806 0.0833333 0.99999 0.0833333C0.861919 0.0833333 0.74999 0.195262 0.74999 0.333333C0.74999 0.471405 0.861919 0.583333 0.99999 0.583333ZM0.99999 0.666667C1.18408 0.666667 1.33332 0.517428 1.33332 0.333333C1.33332 0.149238 1.18408 0 0.99999 0C0.815895 0 0.666656 0.149238 0.666656 0.333333C0.666656 0.517428 0.815895 0.666667 0.99999 0.666667Z" fill="#6F6F6F"/>
<path name="${COLOR_NAME.grey}" d="M1.11178 0.477601V0.286742C1.11178 0.270993 1.11271 0.25208 1.11457 0.230006H1.11364C1.11042 0.243895 1.10757 0.253569 1.10509 0.259025L1.01003 0.477601H0.98938L0.894509 0.260699C0.892277 0.255739 0.889424 0.245508 0.885952 0.230006H0.884836C0.886076 0.243399 0.886696 0.26287 0.886696 0.288417V0.477601H0.851166V0.189453H0.901578L0.98659 0.387008C0.993038 0.402138 0.997317 0.413919 0.999425 0.422352H1.00073C1.00718 0.404618 1.0117 0.392589 1.01431 0.386264L1.10081 0.189453H1.1488V0.477601H1.11178Z" fill="#6F6F6F"/>
</svg>`;

// ACVVSB、ACVVDB的左边,带竖线的
const iconFaMenPingHengLeftSvg = () => `<svg width="2" height="2" viewBox="0 0 2 2" fill="none" xmlns="http://www.w3.org/2000/svg">
<path name="${COLOR_NAME.white}" d="M1.07437 1.00011L0.266893 1.4846L0.266893 0.515625L1.07437 1.00011Z" fill="white"/>
<path name="${COLOR_NAME.grey}" fill-rule="evenodd" clip-rule="evenodd" d="M1.07437 1.00011L0.266893 0.515625L0.266893 1.4846L1.07437 1.00011ZM0.9124 1.00011L0.350226 0.662808L0.350226 1.33742L0.9124 1.00011Z" fill="#6F6F6F"/>
<path name="${COLOR_NAME.grey}" fill-rule="evenodd" clip-rule="evenodd" d="M0.790883 1.13379L0.790883 1.65304L0.70755 1.65304L0.70755 1.13379L0.790883 1.13379Z" fill="#6F6F6F"/>
</svg>`;

// ACVVSB、ACVVDB的右边,带竖线的
const iconFaMenPingHengRightSvg = () => `<svg width="2" height="2" viewBox="0 0 2 2" fill="none" xmlns="http://www.w3.org/2000/svg">
<path name="${COLOR_NAME.white}" d="M0.925629 1.00011L1.73311 1.4846L1.73311 0.515625L0.925629 1.00011Z" fill="white"/>
<path name="${COLOR_NAME.grey}" fill-rule="evenodd" clip-rule="evenodd" d="M0.925629 1.00011L1.73311 0.515625L1.73311 1.4846L0.925629 1.00011ZM1.0876 1.00011L1.64977 0.662808L1.64977 1.33742L1.0876 1.00011Z" fill="#6F6F6F"/>
<path name="${COLOR_NAME.grey}" fill-rule="evenodd" clip-rule="evenodd" d="M1.20912 1.13379L1.20912 1.65304L1.29245 1.65304L1.29245 1.13379L1.20912 1.13379Z" fill="#6F6F6F"/>
</svg>`;

// 通用的三角形 ACVVNO、ACVVNJ等
const iconFaMenTongYongSvg = () => `<svg width="2" height="2" viewBox="0 0 2 2" fill="none" xmlns="http://www.w3.org/2000/svg">
<path name="${COLOR_NAME.white}" d="M1.07455 0.999888L0.267076 0.515401L0.267076 1.48438L1.07455 0.999888Z" fill="white"/>
<path name="${COLOR_NAME.grey}" fill-rule="evenodd" clip-rule="evenodd" d="M1.07455 0.999888L0.267076 1.48438L0.267076 0.515401L1.07455 0.999888ZM0.912584 0.999888L0.35041 1.33719L0.35041 0.662584L0.912584 0.999888Z" fill="#6F6F6F"/>
</svg>`;

// 风管
const iconGuanDaoFengGuanSvg = () => `<svg width="1" height="1" viewBox="0 0 1 1" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_1427_413)">
<path name="${COLOR_NAME.white}" fill-rule="evenodd" clip-rule="evenodd" d="M0.125 0C0.0559644 0 0 0.0559644 0 0.125V0.875C0 0.944036 0.0559644 1 0.125 1H0.875C0.944036 1 1 0.944036 1 0.875V0.125C1 0.0559644 0.944036 0 0.875 0H0.125Z" fill="white"/>
<path name="${COLOR_NAME.grey}" d="M0.141387 0.819413C0.236868 0.495122 0.489728 0.241024 0.81355 0.143961L0.875177 0.125488L0.875151 0.875901H0.124756L0.141387 0.819413Z" fill="#6F6F6F"/>
<path name="${COLOR_NAME.grey}" fill-rule="evenodd" clip-rule="evenodd" d="M0.875 0.125H0.125V0.875H0.875V0.125ZM0.125 0C0.0559644 0 0 0.0559644 0 0.125V0.875C0 0.944036 0.0559644 1 0.125 1H0.875C0.944036 1 1 0.944036 1 0.875V0.125C1 0.0559644 0.944036 0 0.875 0H0.125Z" fill="#6F6F6F"/>
</g>
<defs>
<clipPath id="clip0_1427_413">
<rect name="${COLOR_NAME.white}" width="1" height="1" fill="white"/>
</clipPath>
</defs>
</svg>`;

// 水管
const iconGuanDaoShuiGuanSvg = () => `<svg width="1" height="1" viewBox="0 0 1 1" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect name="${COLOR_NAME.white}" width="1" height="1" rx="0.5" fill="white"/>
<path name="${COLOR_NAME.grey}" fill-rule="evenodd" clip-rule="evenodd" d="M0.125 0.5C0.125 0.707107 0.292893 0.875 0.5 0.875C0.707107 0.875 0.875 0.707107 0.875 0.5C0.875 0.292893 0.707107 0.125 0.5 0.125C0.292893 0.125 0.125 0.292893 0.125 0.5ZM0.5 0C0.223858 0 0 0.223858 0 0.5C0 0.776142 0.223858 1 0.5 1C0.776142 1 1 0.776142 1 0.5C1 0.223858 0.776142 0 0.5 0Z" fill="#6F6F6F"/>
</svg>`;

const iconReturnAirOutlet = equipData => `<svg width="2" height="2" viewBox="0 0 2 2" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_${equipData.id})">
<rect name="return-air-outlet" x="0.545" y="0.545" width="0.91" height="0.91" fill="white" stroke="#6F6F6F" stroke-width="0.09"/>
<g opacity="0.5">
<path name="return-air-outlet" d="M0.845703 0.847656L0.574219 0.576172" stroke="#6F6F6F" stroke-width="0.09"/>
<path name="return-air-outlet" d="M1.13672 1.19727L1.4082 1.46875" stroke="#6F6F6F" stroke-width="0.09"/>
<path name="return-air-outlet" d="M1.13672 0.847656L1.4082 0.576172" stroke="#6F6F6F" stroke-width="0.09"/>
<path name="return-air-outlet" d="M0.845703 1.19727L0.574219 1.46875" stroke="#6F6F6F" stroke-width="0.09"/>
</g>
<rect name="return-air-outlet" x="0.822344" y="0.822344" width="0.355312" height="0.355312" stroke="#6F6F6F" stroke-width="0.09"/>
</g>
<defs>
<clipPath id="clip0_${equipData.id}">
<rect width="2" height="2" fill="white"/>
</clipPath>
</defs>
</svg>
`;

const getSvgElement = str => {
    const $temp = createDom({
        tagName: 'div',
        innerHTML: str
    });
    return $temp.firstChild;
};
const changeElAttr = (el, val) => {
    let attrName = 'fill';
    if (el.hasAttribute('stroke')) {
        attrName = 'stroke';
    }
    el.setAttribute(attrName, val);
};
export default class ValveRiserMedia extends BaseMedia {
    constructor(model, rootMedia) {
        super(model, rootMedia);
        this.init();

        this.model.addObserver('ChangeState', e => this.stateChanged(e));
    }

    makeObject3D() {
        const { height, floorHeight, bimLocation } = this.model;
        if (!bimLocation) return;
        this.$container = createDom({ tagName: 'div' });
        this.$container.append(this.buildValveRiser());

        const object3d = new CSS3DObject(this.$container);

        //  把svg放到中心位置
        const iconInfoLocation = bimLocation;
        iconInfoLocation.setY(floorHeight + height + 0.1 + bimLocation.y * PIPE_SCALE_Y + 2.1 * PIPE_RADIUS * PIPE_SCALE_Y); // 把2写成2.1是为了解决场景地图里面hover管道，阀门上还是有一点点穿透的管道
        object3d.position.copy(iconInfoLocation);
        object3d.rotateX(Math.PI * 0.5);
        this.addMouseEvent();
        return object3d;
    }

    addMouseEvent() {
        this.$container.addEventListener('mousemove', event => {
            event.stopPropagation();
            this.rootMedia.emit(Css2dobjectMouseMove, { event, model: this.model });
        });

        this.$container.addEventListener('pointerdown', event => {
            event.stopPropagation();
            this.rootMedia.emit(Css2dobjectClick, { event, model: this.model });
        });

        this.$container.addEventListener('mouseup', event => {
            event.stopPropagation();
        });
        this.$container.addEventListener('mousedown', event => {
            event.stopPropagation();
        });
    }

    buildValveRiser() {
        const { equipData, bimLocation } = this.model;

        if (!bimLocation) return;

        const groupDiv = createDom({ tagName: 'div' });

        if (equipData.isValve) {
            // 阀门
            const { classCode, vectorQuantityList } = equipData;
            const result = new THREE.Vector3();
            const base = new THREE.Vector3(0, 0, -1);
            const vectorList = (vectorQuantityList || []).map(vector => ({
                x: Number(vector.x),
                y: 0,
                z: -Number(vector.y)
            }));
            vectorList.forEach(vector => {
                let $svg = null;
                const curVector = new THREE.Vector3(vector.x, vector.y, vector.z);
                result.crossVectors(curVector, base);

                const angle = base.angleTo(curVector) * (180 / Math.PI);
                if (result.y > 0 || (vectorList.length === 2 && vectorList[0].x === 0 && vectorList[1].x === 0 && vector.z === 1)) {
                    // 竖直方向的阀门把，z===1的当成右边
                    if (classCode === 'ACVVSB' || classCode === 'ACVVDB') {
                        $svg = getSvgElement(iconFaMenPingHengRightSvg());
                    } else {
                        $svg = getSvgElement(iconFaMenTongYongSvg());
                    }
                    $svg.style.position = 'absolute';
                    $svg.style.top = '0';
                    $svg.style.left = '0';
                    $svg.style.transform = '';
                    if (classCode !== 'ACVVSB' && classCode !== 'ACVVDB') {
                        // 不是通用三角形，不需要把左边转180到右边，只需要转向量角度
                        $svg.style.transform += ' rotateZ(180deg)';
                    }
                    $svg.style.transform += ` rotateZ(${90 - angle}deg)`;
                } else {
                    if (classCode === 'ACVVEO' || classCode === 'ACVVEJ') {
                        $svg = getSvgElement(iconFaMenDianDongLeftSvg());
                    } else if (classCode === 'ACVVSB' || classCode === 'ACVVDB') {
                        $svg = getSvgElement(iconFaMenPingHengLeftSvg());
                    } else {
                        $svg = getSvgElement(iconFaMenTongYongSvg());
                    }
                    $svg.style.position = 'absolute';
                    $svg.style.top = '0';
                    $svg.style.left = '0';
                    $svg.style.transform = ` rotateZ(${angle - 90}deg)`;
                }
                $svg.style.cursor = 'pointer';
                $svg.style.transform += ` rotateZ(${180}deg)`;
                groupDiv.append($svg);
            });
            groupDiv.style.transform = `translate(${-VALVE_SIZE.width / 2}px, ${-VALVE_SIZE.height / 2}px)`;
        } else if (equipData.isSpecialPipeSection) {
            // 立管
            const { type } = equipData;
            let $svg = null;

            if (type === 'WATER_PIPE') {
                // 水管
                $svg = getSvgElement(iconGuanDaoShuiGuanSvg());
            } else {
                // 风管、气体管等
                $svg = getSvgElement(iconGuanDaoFengGuanSvg());
            }
            $svg.style.position = 'absolute';
            $svg.style.top = '0';
            $svg.style.left = '0';
            $svg.style.transform = '';
            $svg.style.cursor = 'pointer';
            groupDiv.append($svg);
            groupDiv.style.transform = `translate(${-RISER_SIZE.width / 2}px, ${-RISER_SIZE.height / 2}px)`;
        } else {
            // 回风口
            const $svg = getSvgElement(iconReturnAirOutlet(equipData));

            $svg.style.position = 'absolute';
            $svg.style.top = '0';
            $svg.style.left = '0';
            $svg.style.transform = '';
            $svg.style.cursor = 'pointer';
            groupDiv.append($svg);
            groupDiv.style.transform = `translate(${-AIR_OUTLET_SIZE.width / 2}px, ${-AIR_OUTLET_SIZE.height / 2}px)`;
        }
        return groupDiv;
    }

    parseStyle() {
        // if (!this.object3d) {
        //     return;
        // }
        const { color } = this.model;
        const curStyle = this.model.caclCurrentStyle();
        const { show } = curStyle;
        let _show = show;
        if (!this.model.getParentsShow()) {
            _show = false;
        }
        _show = _show && !this.model.isRemoved();
        this.model.show = _show;

        const cssNames = this.model.getCurrentStyleValues('cssName');

        if (this.$container) {
            this.$container.classList.forEach(name => {
                if (cssNames.indexOf(name) === -1) {
                    this.$container.classList.remove(name);
                }
            });
        }

        cssNames.forEach(name => {
            if (!this.$container.classList.contains(name)) {
                this.$container.classList.add(name);
            }
        });

        if (this.model.getState('hover') || this.model.getState('active')) {
            this.$container.querySelectorAll('[name="white"]').forEach(el => {
                changeElAttr(el, '#246fe5');
                // el.setAttribute('fill', '#246fe5');
            });
            this.$container.querySelectorAll('[name="grey"]').forEach(el => {
                changeElAttr(el, 'white');
                // el.setAttribute(attrName, 'white');
                // el.setAttribute('fill', 'white');
            });
        } else {
            this.$container.querySelectorAll('[name="white"]').forEach(el => {
                changeElAttr(el, 'white');
                // el.setAttribute('fill', 'white');
            });
            this.$container.querySelectorAll('[name="grey"]').forEach(el => {
                changeElAttr(el, color);
                // el.setAttribute('fill', color);
            });
        }

        this.model.show = show;
        this.lastStyle = curStyle;
    }

    stateChanged() {
        this.parseStyle();
    }

    onObject3DMounted() {
        this.parseStyle();
        this.object3D?.updateMatrixWorld(true, true);
    }
}
