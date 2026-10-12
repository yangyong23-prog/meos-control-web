import { CSS2DObject } from '@yushu/three-base/three-extends/jsm/renderers/CSS2DRenderer';
import { createDom } from '../../utils/d2Utils';
import BaseMedia from '../../core/View/BaseMedia';
import { Css2dobjectClick, Css2dobjectMouseMove } from '../RootNode/RootNodeMedia';
import { wrapperDom } from '../../core/utils';

export const Dom = {
    group: 0,
    normal: 1
};

const valveSelectSvg = `<svg width="44" height="47" viewBox="0 0 44 47" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M44 21.9963C44 33.1293 35.7279 42.3305 24.9938 43.7907C24.0149 43.9239 22.5 47 22 47C21.5391 47 19.9851 43.9239 19.0062 43.7907C8.27215 42.3305 0 33.1293 0 21.9963C0 9.8481 9.84974 0 22 0C34.1503 0 44 9.8481 44 21.9963Z" fill="#246FE5"/>
<path d="M43.5 21.9963C43.5 32.8758 35.4161 41.8683 24.9264 43.2953C24.6913 43.3273 24.4835 43.4394 24.3147 43.5595C24.1414 43.6828 23.9746 43.8397 23.8183 44.0067C23.5065 44.3397 23.1933 44.7603 22.911 45.1539C22.8261 45.2722 22.7446 45.3873 22.6662 45.4979C22.475 45.7676 22.3028 46.0108 22.1475 46.2089C22.0952 46.2756 22.0485 46.3324 22.0073 46.3797C21.9669 46.3324 21.9213 46.2762 21.8702 46.2104C21.7237 46.0219 21.5616 45.7945 21.3821 45.5425C21.2932 45.4179 21.2001 45.2872 21.1024 45.1522C20.8172 44.758 20.5004 44.3377 20.1854 44.0047C20.0276 43.838 19.8595 43.6814 19.6856 43.5585C19.5162 43.4389 19.3081 43.3272 19.0736 43.2953C8.58393 41.8683 0.5 32.8758 0.5 21.9963C0.5 10.1243 10.1258 0.5 22 0.5C33.8742 0.5 43.5 10.1243 43.5 21.9963Z" stroke="white"/>
<rect x="9" y="11" width="26" height="26" rx="2" fill="#246FE5"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M22.9668 24L12.4696 17.7017L12.4696 30.2983L22.9668 24ZM20.8612 24L13.5529 19.615L13.5529 28.3849L20.8612 24Z" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M21.0371 24L31.5343 17.7017L31.5343 30.2983L21.0371 24ZM23.1427 24L30.451 19.615L30.451 28.3849L23.1427 24Z" fill="white"/>
</svg>
`;
const riserShuiGuanSelectSvg = `<svg width="44" height="47" viewBox="0 0 44 47" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M44 21.9963C44 33.1293 35.7279 42.3305 24.9938 43.7907C24.0149 43.9239 22.5 47 22 47C21.5391 47 19.9851 43.9239 19.0062 43.7907C8.27215 42.3305 0 33.1293 0 21.9963C0 9.8481 9.84974 0 22 0C34.1503 0 44 9.8481 44 21.9963Z" fill="#246FE5"/>
<path d="M43.5 21.9963C43.5 32.8758 35.4161 41.8683 24.9264 43.2953C24.6913 43.3273 24.4835 43.4394 24.3147 43.5595C24.1414 43.6828 23.9746 43.8397 23.8183 44.0067C23.5065 44.3397 23.1933 44.7603 22.911 45.1539C22.8261 45.2722 22.7446 45.3873 22.6662 45.4979C22.475 45.7676 22.3028 46.0108 22.1475 46.2089C22.0952 46.2756 22.0485 46.3324 22.0073 46.3797C21.9669 46.3324 21.9213 46.2762 21.8702 46.2104C21.7237 46.0219 21.5616 45.7945 21.3821 45.5425C21.2932 45.4179 21.2001 45.2872 21.1024 45.1522C20.8172 44.758 20.5004 44.3377 20.1854 44.0047C20.0276 43.838 19.8595 43.6814 19.6856 43.5585C19.5162 43.4389 19.3081 43.3272 19.0736 43.2953C8.58393 41.8683 0.5 32.8758 0.5 21.9963C0.5 10.1243 10.1258 0.5 22 0.5C33.8742 0.5 43.5 10.1243 43.5 21.9963Z" stroke="white"/>
<rect x="9" y="10" width="26" height="26" rx="13" fill="#246FE5"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M12.25 23C12.25 28.3848 16.6152 32.75 22 32.75C27.3848 32.75 31.75 28.3848 31.75 23C31.75 17.6152 27.3848 13.25 22 13.25C16.6152 13.25 12.25 17.6152 12.25 23ZM22 10C14.8203 10 9 15.8203 9 23C9 30.1797 14.8203 36 22 36C29.1797 36 35 30.1797 35 23C35 15.8203 29.1797 10 22 10Z" fill="white"/>
</svg>
`;
const riserFengGuanSelectSvg = `<svg width="44" height="47" viewBox="0 0 44 47" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M44 21.9963C44 33.1293 35.7279 42.3305 24.9938 43.7907C24.0149 43.9239 22.5 47 22 47C21.5391 47 19.9851 43.9239 19.0062 43.7907C8.27215 42.3305 0 33.1293 0 21.9963C0 9.8481 9.84974 0 22 0C34.1503 0 44 9.8481 44 21.9963Z" fill="#246FE5"/>
<path d="M43.5 21.9963C43.5 32.8758 35.4161 41.8683 24.9264 43.2953C24.6913 43.3273 24.4835 43.4394 24.3147 43.5595C24.1414 43.6828 23.9746 43.8397 23.8183 44.0067C23.5065 44.3397 23.1933 44.7603 22.911 45.1539C22.8261 45.2722 22.7446 45.3873 22.6662 45.4979C22.475 45.7676 22.3028 46.0108 22.1475 46.2089C22.0952 46.2756 22.0485 46.3324 22.0073 46.3797C21.9669 46.3324 21.9213 46.2762 21.8702 46.2104C21.7237 46.0219 21.5616 45.7945 21.3821 45.5425C21.2932 45.4179 21.2001 45.2872 21.1024 45.1522C20.8172 44.758 20.5004 44.3377 20.1854 44.0047C20.0276 43.838 19.8595 43.6814 19.6856 43.5585C19.5162 43.4389 19.3081 43.3272 19.0736 43.2953C8.58393 41.8683 0.5 32.8758 0.5 21.9963C0.5 10.1243 10.1258 0.5 22 0.5C33.8742 0.5 43.5 10.1243 43.5 21.9963Z" stroke="white"/>
<g clip-path="url(#clip0_447_27479)">
<rect x="10" y="11" width="24" height="24" rx="1" fill="#246FE5"/>
<path d="M16.9137 18.7092C17.0092 18.385 17.262 18.1309 17.5859 18.0338L31.0042 14.0117L31.0036 32.0216H12.9941L16.9137 18.7092Z" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M31 14H13V32H31V14ZM13 11C11.3431 11 10 12.3431 10 14V32C10 33.6569 11.3431 35 13 35H31C32.6569 35 34 33.6569 34 32V14C34 12.3431 32.6569 11 31 11H13Z" fill="white"/>
</g>
<defs>
<clipPath id="clip0_447_27479">
<rect x="10" y="11" width="24" height="24" rx="1" fill="white"/>
</clipPath>
</defs>
</svg>
`;

const returnAirOutletSelectSvg = `<svg width="36" height="38" viewBox="0 0 36 38" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18.1826 0.517578C8.70426 0.517578 1.02051 8.15024 1.02051 17.5656C1.02051 25.1636 6.02432 31.6007 12.9371 33.8026C14.3398 34.2494 15.6605 34.9802 16.5787 36.1245L17.8669 37.7299C18.0285 37.9314 18.3368 37.9314 18.4984 37.7299L19.7866 36.1245C20.7048 34.9802 22.0255 34.2494 23.4282 33.8026C30.341 31.6007 35.3448 25.1636 35.3448 17.5656C35.3448 8.15024 27.661 0.517578 18.1826 0.517578Z" fill="#246FE5"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M18 1.03351C8.90963 1.03351 1.54043 8.35371 1.54043 17.3836C1.54043 24.6698 6.33873 30.8441 12.969 32.956C14.4176 33.4174 15.8269 34.1858 16.8199 35.4232L18 36.894L19.1801 35.4232C20.1731 34.1858 21.5824 33.4174 23.031 32.956C29.6613 30.8441 34.4596 24.6698 34.4596 17.3836C34.4596 8.35371 27.0904 1.03351 18 1.03351ZM0.5 17.3836C0.5 7.78292 8.33502 0 18 0C27.665 0 35.5 7.78292 35.5 17.3836C35.5 25.132 30.397 31.6951 23.3487 33.9402C22.0216 34.3629 20.8176 35.0406 19.9937 36.0674L18.7192 37.6558C18.351 38.1147 17.649 38.1147 17.2808 37.6558L16.0063 36.0674C15.1824 35.0406 13.9784 34.3629 12.6513 33.9402C5.60299 31.6951 0.5 25.132 0.5 17.3836Z" fill="white"/>
<rect x="12.54" y="12.54" width="10.92" height="10.92" stroke="white" stroke-width="1.08"/>
<g opacity="0.5">
<path d="M16.1484 16.1719L12.8906 12.9141" stroke="white" stroke-width="1.08"/>
<path d="M19.6406 20.3672L22.8984 23.625" stroke="white" stroke-width="1.08"/>
<path d="M19.6406 16.1719L22.8984 12.9141" stroke="white" stroke-width="1.08"/>
<path d="M16.1484 20.3672L12.8906 23.625" stroke="white" stroke-width="1.08"/>
</g>
<rect x="15.8681" y="15.8681" width="4.26375" height="4.26375" stroke="white" stroke-width="1.08"/>
</svg>
`;

export default class ValveRiserIconInfoMedia extends BaseMedia {
    constructor(equipIconInfo, rootMedia) {
        super(equipIconInfo, rootMedia);
        this.init();
        this.model.addObserver('ChangeState', e => this.stateChanged(e));
    }

    // 重写父类方法，生成模型
    makeObject3D() {
        const { bimLocation } = this.model;
        if (!bimLocation) return;
        this.createdDom();
        this.addMouseEvent();
        const wrapper = wrapperDom(this.$dom);
        const iconInfoMesh = new CSS2DObject(wrapper);
        return iconInfoMesh;
    }

    onObject3DLayout() {
        const { height, floorHeight, bimLocation } = this.model;
        const infoLocation = bimLocation.clone();
        infoLocation.setY(floorHeight + height + 0.1);
        const position = infoLocation.clone().applyMatrix4(this.parentMedia.object3D.matrixWorld.clone().invert());
        this.object3D.position.copy(position);
    }

    createdDom() {
        const { equipData } = this.model;
        this.$dom = createDom({
            tagName: 'div',
            classList: ['valve-riser-info-container']
        });
        let selectSvg = null;
        if (equipData.isValve) {
            // 阀门
            selectSvg = valveSelectSvg;
        } else if (equipData.isSpecialPipeSection) {
            // 立管
            const { type } = equipData;
            if (type === 'WATER_PIPE') {
                // 水管
                selectSvg = riserShuiGuanSelectSvg;
            } else {
                // 风管、气体管等
                selectSvg = riserFengGuanSelectSvg;
            }
        } else {
            selectSvg = returnAirOutletSelectSvg;
        }
        this.$valveSelectIcon = createDom({
            tagName: 'div',
            classList: ['valve-select-icon'],
            appendTo: this.$dom,
            innerHTML: selectSvg
        });
        this.$text = createDom({
            tagName: 'div',
            innerHTML: equipData.localName ?? '--',
            classList: ['valve-riser-text'],
            appendTo: this.$dom
        });
    }

    addMouseEvent() {
        this.$dom.addEventListener('mousemove', event => {
            event.stopPropagation();
            this.rootMedia.emit(Css2dobjectMouseMove, { event, model: this.model.parent });
        });

        this.$dom.addEventListener('pointerdown', event => {
            event.stopPropagation();
            this.rootMedia.emit(Css2dobjectClick, { event, model: this.model.parent });
        });

        this.$dom.addEventListener('mouseup', event => {
            event.stopPropagation();
        });
        this.$dom.addEventListener('mousedown', event => {
            event.stopPropagation();
        });
    }

    parseStyle() {
        const curStyle = this.model.caclCurrentStyle();
        const { show, cssName, renderOrder, textShow } = curStyle;
        let _show = show,
            { model } = this;
        // Css2D 对象，依赖父级显隐
        while (model.parent && model.parent !== model.rootModel) {
            const parentStyle = model.parent.caclCurrentStyle();
            if (!model.parent.show || (parentStyle && !parentStyle.show)) {
                _show = false;
                break;
            }
            model = model.parent;
        }

        this.model.show = _show;
        // if (this.model.equipData.localName === 'B3_70℃防火阀_35') {
        //     console.log(`_show: ${this.model.equipData.localName}`, _show, textShow, [...this.model.styles], this.model);
        // }
        if (_show) {
            this.$dom.style.display = 'block';
            this.object3D.renderOrder = renderOrder;
            if (this.model.getState('selected')) {
                this.$valveSelectIcon.style.display = 'block';
            } else {
                this.$valveSelectIcon.style.display = 'none';
            }
            this.$text.style.display = textShow ? 'block' : 'none';
            this.model.show = show;
        } else {
            this.$dom.style.display = 'none';
        }
        if (this.lastStyle && this.lastStyle.cssName) {
            this.$dom.classList.remove(this.lastStyle.cssName);
        }
        if (cssName) {
            this.$dom.classList.add(cssName);
        }
        this.lastStyle = curStyle;
    }

    stateChanged() {
        this.parseStyle();
    }

    onObject3DMounted() {
        this.parseStyle();
        this.object3D.updateMatrixWorld(true, true);
    }
}
