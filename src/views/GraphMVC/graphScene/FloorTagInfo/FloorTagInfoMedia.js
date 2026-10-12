import { CSS2DObject } from '@yushu/three-base/three-extends/jsm/renderers/CSS2DRenderer';
import { createDom } from '../../utils/d2Utils';
import BaseMedia from '../../core/View/BaseMedia';
import { Css2dobjectClick, Css2dobjectMouseMove } from '../RootNode/RootNodeMedia';
import { wrapperDom } from '../../core/utils';
import './floorTagInfoMedia.less';
import _, { isUndefined } from 'lodash';

// eslint-disable-next-line import/order
import * as THREE from '@yushu/three-base';

const CLASS_NAME_MAP = {
    name: 'floor_tag_name',
    svgLine: 'floor_tag_svg_line',
    svgTriangle: 'floor_tag_svg_triangle'
};

export default class FloorTagInfoMedia extends BaseMedia {
    constructor(linkLineInfo, rootMedia) {
        super(linkLineInfo, rootMedia);
        this.init();
        this.model.addObserver('ChangeState', e => this.stateChanged(e));
        this.model.addObserver('ChangeAbnormal', e => this.setAbnormaldatamodification(e));
    }

    // 重写父类方法，生成模型
    makeObject3D() {
        // console.log('LinkLineInfoMedia');
        const { floorInfoData, parent } = this.model;
        const svg = `<svg width="41" height="7" viewBox="0 0 41 7" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path class="${CLASS_NAME_MAP.svgLine}" d="M40.505 3.62079L1.471 3.62079" stroke="#424C59" stroke-width="0.8" stroke-dasharray="1.5 1.5"/>
        <path class="${CLASS_NAME_MAP.svgTriangle}" fill-rule="evenodd" clip-rule="evenodd" d="M0.873833 3.82392C0.678322 3.6522 0.678322 3.34773 0.873832 3.176L3.33348 1.01556C3.6121 0.770828 4.04922 0.968677 4.04922 1.33952L4.04922 5.6604C4.04922 6.03125 3.6121 6.2291 3.33348 5.98436L0.873833 3.82392Z" fill="#424C59"/>
        </svg>`;
        const fgx = `|`;
        // const svg = `<svg  viewBox="0 0 17 9" fill="none" xmlns="http://www.w3.org/2000/svg">
        // <path class="${CLASS_NAME_MAP.svgLine}" d="M16.8838 4.32715L4.88379 4.32715" stroke="#424C59" stroke-width="1.4" stroke-dasharray="1.5 1.5"/>
        // <path class="${CLASS_NAME_MAP.svgTriangle}" fill-rule="evenodd" clip-rule="evenodd" d="M0.61814 4.78892C0.328934 4.549 0.328935 4.1053 0.61814 3.86537L3.89995 1.14274C4.29099 0.818328 4.88305 1.09643 4.88305 1.60451L4.88305 7.04978C4.88305 7.55787 4.29099 7.83597 3.89995 7.51156L0.61814 4.78892Z" fill="#424C59"/>
        // </svg>`;
        let htmlMapFloorTag = ``;
        const $dom = createDom({
            tagName: 'div',
            classList: ['_map_floor_tag'],
            innerHTML: htmlMapFloorTag
        });
        this.subsetDom = createDom({
            tagName: 'span',
            classList: floorInfoData.subset?.length < 10 ? ['floor_promptBall'] : ['floor_promptBall_tow'],
            innerHTML: floorInfoData.subset?.length || '',
            appendTo: $dom
        });
        this.floorNameDom = createDom({
            tagName: 'span',
            classList: ['floor_tag_name'],
            innerHTML: floorInfoData.floorName,
            appendTo: $dom
        });
        this.floorSvgDom = createDom({
            tagName: 'span',
            classList: ['floor_tag_svg'],
            innerHTML: svg,
            appendTo: $dom
        });
        this.floorFgxDom = createDom({
            tagName: 'span',
            innerHTML: fgx,
            appendTo: $dom
        });
        this.targetDataDom = createDom({
            tagName: 'span',
            classList: ['floor_tag_name'],
            innerHTML: floorInfoData.avgData,
            appendTo: $dom
        });
        this.floorUnitsDom = createDom({
            tagName: 'span',
            classList: ['floor_tag_name'],
            innerHTML: floorInfoData.units,
            appendTo: $dom
        });
        $dom.style.display = 'none';

        if (floorInfoData.tabType === 'dispatchMonitoring' && floorInfoData.subset?.length > 0 && floorInfoData.tabType !== 'dispatchMonitoring') {
            this.floorUnitsDom.style.display = 'none';
            this.floorFgxDom.style.display = 'none';
            $dom.style.display = 'inline-block';
            if (floorInfoData.avgData == null) {
                this.floorFgxDom.style.display = 'none';
                this.floorUnitsDom.style.display = 'none';
            } else {
                this.floorFgxDom.style.display = 'inline-block';
                this.floorUnitsDom.style.display = 'inline-block';
            }
        } else {
            $dom.style.display = 'inline-block';
            if (floorInfoData.subset?.length > 0) {
                this.subsetDom.style.display = 'inline-block';
            } else {
                this.subsetDom.style.display = 'none';
            }
            if (!isUndefined(floorInfoData.avgData) && floorInfoData.avgData != null) {
                this.floorUnitsDom.style.display = 'inline-block';
            } else {
                this.floorUnitsDom.style.display = 'none';
            }
            if (floorInfoData.avgData == null) {
                this.floorFgxDom.style.display = 'none';
            } else {
                this.floorFgxDom.style.display = 'inline-block';
            }
            if (floorInfoData.tabType === 'dispatchMonitoring') {
                this.subsetDom.style.display = 'none';
                this.targetDataDom.style.display = 'none';
                this.floorUnitsDom.style.display = 'none';
                this.floorFgxDom.style.display = 'none';
            }
        }
        $dom.addEventListener('mousemove', event => {
            // 阻止mousemove事件穿透
            event.stopPropagation();
            this.rootMedia.emit(Css2dobjectMouseMove, {
                event,
                model: this.model
            });
        });

        $dom.addEventListener('pointerdown', event => {
            // event.preventDefault();
            event.stopPropagation();
            this.rootMedia.emit(Css2dobjectClick, {
                event,
                model: this.model
            });
        });
        this.$dom = $dom;
        const wrapper = wrapperDom($dom);
        const css2d = new CSS2DObject(wrapper);

        // css2d.position.copy(position);
        return css2d;
    }

    onObject3DMounted() {
        this.stateChanged();
        // Mounted 阶段父media已创建过，再根据父节点中mesh计算包围盒
        const { floorMesh, object3D } = this.parentMedia;
        if (!floorMesh) {
            return;
        }
        const { floorInfoData } = this.model;
        floorMesh.geometry.computeBoundingBox();
        let position;
        const box = new THREE.Box3();
        box.setFromObject(object3D);
        if (floorInfoData.cameraDirection === 'X') {
            position = new THREE.Vector3((box.max.x + box.min.x) / 2, box.min.y, box.min.z);
        } else {
            position = new THREE.Vector3(box.max.x, box.min.y, (box.max.z + box.min.z) / 2);
        }
        position.applyMatrix4(object3D.matrixWorld.invert());

        this.object3D.position.copy(position);
    }

    stateChanged() {
        const { show, renderOrder, color, nameColor, fontWeight, tagNameClass } = this.model.caclCurrentStyle();
        this.model.show = show;

        if (renderOrder) {
            this.object3D.renderOrder = renderOrder;
        }
        const txtEle = this.object3D.element.getElementsByClassName(CLASS_NAME_MAP.name)[0];
        const triangle = this.object3D.element.getElementsByClassName(CLASS_NAME_MAP.svgTriangle)[0];
        const line = this.object3D.element.getElementsByClassName(CLASS_NAME_MAP.svgLine)[0];
        if (color) {
            if (txtEle) txtEle.style.color = nameColor || color;
            if (triangle) triangle.style.fill = color;
            if (line) line.style.stroke = color;
        } else {
            if (txtEle) txtEle.style.color = '';
            if (triangle) triangle.style.fill = '';
            if (line) line.style.stroke = '';
        }

        if (txtEle) {
            // console.log('...this.$dom?.classList: ', [...this.$dom.classList]);
            if (tagNameClass) {
                txtEle.classList.add(tagNameClass);
            } else {
                txtEle.classList.remove(...txtEle.classList);
                txtEle.classList.add(CLASS_NAME_MAP.name);
            }
        }

        if (fontWeight) {
            if (txtEle) txtEle.style.fontWeight = fontWeight;
        } else {
            if (txtEle) txtEle.style.fontWeight = '';
        }
    }
    // 异常数据修改
    setAbnormaldatamodification(e) {
        const { floorInfoData, parent, subsetNum, changeAbnormal } = this.model;
        // console.log('setAbnormaldatamodification---subsetNum: ', subsetNum);
        if (subsetNum?.length > 0) {
            // console.log('subsetNum: ', subsetNum, changeAbnormal);
            let numBerLength = [],
                flag = subsetNum.find(item => {
                    if (item.abnormalStatus === true) {
                        numBerLength.push(item.abnormalStatus);
                    }
                });
            if (numBerLength.length > 0) {
                this.subsetDom.style.display = 'inline-block';
                this.subsetDom.innerHTML = numBerLength.length;
            } else {
                this.subsetDom.style.display = 'none';
            }
        } else {
            this.subsetDom.style.display = 'none';
        }
        if (changeAbnormal?.avgData) {
            this.targetDataDom.innerHTML = changeAbnormal?.avgData;
            this.targetDataDom.style.display = 'inline-block';
            this.floorUnitsDom.style.display = 'inline-block';
            this.floorFgxDom.style.display = 'inline-block';
        } else {
            this.targetDataDom.style.display = 'none';
            this.floorUnitsDom.style.display = 'none';
            this.floorFgxDom.style.display = 'none';
        }
    }
}
