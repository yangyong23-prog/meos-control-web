import { CSS2DObject } from '@yushu/three-base/three-extends/jsm/renderers/CSS2DRenderer';
import { createDom } from '@/views/GraphMVC/utils/d2Utils';
import { StatePriority } from '../GraphSceneDefine';
import BaseMedia from '../../core/View/BaseMedia';
import { Css2dobjectClick, Css2dobjectMouseMove } from '../RootNode/RootNodeMedia';
import { wrapperDom } from '../../core/utils';
import { showGroupVm, hideGroupVm } from './group';
import './equip.less';

export const Dom = {
    group: 0,
    normal: 1
};

// 气球背景
const bgSvg = `<svg class="bg-svg" style="display:none" width="38" height="40" viewBox="0 0 38 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19.5646 2.51709C10.1493 2.51709 2.5166 10.1497 2.5166 19.5651C2.5166 27.1631 7.48714 33.6002 14.3539 35.8021C15.7473 36.2489 17.0593 36.9797 17.9713 38.124L19.2509 39.7295C19.4115 39.9309 19.7177 39.9309 19.8783 39.7295L21.1579 38.124C22.07 36.9797 23.3819 36.2489 24.7753 35.8021C31.6421 33.6002 36.6126 27.1631 36.6126 19.5651C36.6126 10.1497 28.98 2.51709 19.5646 2.51709Z" fill="#246FE5"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M19.3836 3.03351C10.3537 3.03351 3.03351 10.3537 3.03351 19.3836C3.03351 26.6698 7.79991 32.8441 14.3861 34.956C15.825 35.4174 17.225 36.1858 18.2113 37.4232L19.3836 38.894L20.5559 37.4232C21.5422 36.1858 22.9423 35.4174 24.3812 34.956C30.9674 32.8441 35.7338 26.6698 35.7338 19.3836C35.7338 10.3537 28.4136 3.03351 19.3836 3.03351ZM2 19.3836C2 9.78292 9.78292 2 19.3836 2C28.9844 2 36.7673 9.78292 36.7673 19.3836C36.7673 27.132 31.6982 33.6951 24.6967 35.9402C23.3785 36.3629 22.1825 37.0406 21.3641 38.0674L20.0981 39.6558C19.7323 40.1147 19.035 40.1147 18.6692 39.6558L17.4032 38.0674C16.5847 37.0406 15.3888 36.3629 14.0705 35.9402C7.06906 33.6951 2 27.132 2 19.3836Z" fill="white"/>
</svg>
`;

const stopPropagation = dom => {
    dom.addEventListener('mouseup', event => {
        event.stopPropagation();
    });
    dom.addEventListener('mousedown', event => {
        event.stopPropagation();
    });
};

const getListFormAbsorbs = absorbs =>
    absorbs.map((equipIcon, index) => {
        const data = equipIcon.equipData;
        return {
            ...data,
            index,
            svg: equipIcon.svg
        };
    });

export default class EquipIconInfoMedia extends BaseMedia {
    constructor(equipIconInfo, rootMedia) {
        super(equipIconInfo, rootMedia);
        this.transformScale = `scale(${this.model.scale}) `;
        this.init();
        this.model.addObserver('ChangeState', e => this.refreshView(e));
    }

    // 重写父类方法，生成模型
    makeObject3D() {
        const {
            model: { height, floorHeight, bimLocation }
        } = this;
        if (!bimLocation) return;
        this.$dom = createDom({
            tagName: 'div',
            classList: ['ys-equip-icon-warp'],
            style: { transform: `${this.transformScale}translate(0,0)`, 'transform-origin': 'bottom' }
        });

        this.$dom.innerHTML = '';
        this.$dom.appendChild(this._getNormalDom());

        // 创建聚合元素，但不展示
        this.$dom.appendChild(this._getAbsorbDom());
        this.$groupDom.style.display = 'none';

        const wrapper = wrapperDom(this.$dom);
        const iconInfoMesh = new CSS2DObject(wrapper);

        const iconInfoLocation = bimLocation;
        iconInfoLocation.setY(floorHeight + height + 0.1);
        iconInfoMesh.position.copy(iconInfoLocation);
        return iconInfoMesh;
    }

    /** 获取普通DOM */
    _getNormalDom() {
        if (this.$normalDom) return this.$normalDom;
        const {
            equipData: { localName, name },
            bgColor,
            svg
        } = this.model;

        const showName = localName || name || '--';
        /** *********** 普通dom渲染 开始 ************** */

        this.$normalDom = createDom({
            tagName: 'div'
        });

        if (svg) {
            this.$svg = createDom({
                tagName: 'div',
                innerHTML: svg
            }).firstElementChild;

            this.$svgBg = createDom({
                tagName: 'div',
                innerHTML: bgSvg
            }).firstElementChild;

            this.$iconBox = createDom({
                tagName: 'div',
                classList: ['ys-icon-box'],
                style: { backgroundColor: bgColor },
                appendTo: this.$normalDom
            });
            this.$iconBox.appendChild(this.$svgBg);
            this.$iconBox.appendChild(this.$svg);
        }

        this.$txt = createDom({
            tagName: 'span',
            classList: ['ys-equip-icon-txt'],
            innerHTML: showName,
            appendTo: this.$normalDom
        });

        this.$normalDom.addEventListener('mousemove', event => {
            event.stopPropagation();
            this.rootMedia.emit(Css2dobjectMouseMove, { event, model: this.model });
        });

        this.$normalDom.addEventListener('pointerdown', event => {
            event.stopPropagation();
            this.rootMedia.emit(Css2dobjectClick, { event, model: this.model });
        });
        // 阻止mouse相关事件，触发地图click事件
        stopPropagation(this.$normalDom);
        return this.$normalDom;
        /** *********** 普通dom渲染 结束 ************** */
    }

    /** 获取聚合吸收态的dom */
    _getAbsorbDom() {
        if (this.$groupDom) return this.$groupDom;
        const {
            equipData: { className },
            absorbs
        } = this.model;

        this.$groupDom = createDom({
            tagName: 'div'
        });

        this.$groupCount = createDom({
            tagName: 'div',
            classList: ['ys-group-count'],
            appendTo: this.$groupDom,
            innerHTML: absorbs.length
        });

        this.$groupText = createDom({
            tagName: 'div',
            classList: ['ys-equip-icon-txt'],
            innerHTML: `${className}等设备`,
            appendTo: this.$groupDom
        });

        this.$groupDom.addEventListener('mousemove', event => {
            event.stopPropagation();
            this.rootMedia.emit(Css2dobjectMouseMove, { event, model: this.model, isGroup: true });
        });

        const hideGroupView = () => {
            hideGroupVm();
            this._groupVm = null;
            this.model.setState('inGroup', false);
        };

        let showGroupVmTimer = null,
            leaveGroupVmTimer = null;

        this.$groupDom.addEventListener('mouseenter', event => {
            clearTimeout(leaveGroupVmTimer);
            if (this.model.haveAbsorb && !this._groupVm) {
                showGroupVmTimer = setTimeout(() => {
                    let rootScene = this.model.mapScene;
                    while (rootScene.parent) {
                        rootScene = rootScene.parent;
                    }
                    const { offsetWidth: width, offsetHeight: height } = this.$groupCount;
                    const transform = window.getComputedStyle(this.object3D.element).getPropertyValue('transform');
                    const arr = transform.slice(0, -1).split(',');
                    const top = Number(arr.pop()) + height / 2;
                    const left = Number(arr.pop()) + width;
                    const curStyle = this.model.caclCurrentStyle();
                    this._groupVm = showGroupVm(
                        {
                            list: getListFormAbsorbs(this.model.absorbs || []),
                            closeInfoPoint: curStyle.closeInfoPoint,
                            left,
                            top,
                            timer: null
                        },
                        rootScene?.app?.dom
                    );

                    this._groupVm.$on('hide', () => {
                        leaveGroupVmTimer = setTimeout(() => {
                            hideGroupView();
                        });
                    });

                    this._groupVm.$on('click', (e, data) => {
                        const model = this.model.absorbs[data.index];
                        this.rootMedia.emit(Css2dobjectClick, { event: e, model });
                        hideGroupView();
                    });
                }, 300);
                this.model.setState('inGroup', true);
            }
            event.stopPropagation();
        });

        this.$groupDom.addEventListener('mouseleave', event => {
            clearTimeout(showGroupVmTimer);
            if (this._groupVm) {
                this._groupVm.timer = setTimeout(hideGroupView);
            } else {
                this.model.setState('inGroup', false);
            }
            event.stopPropagation();
        });

        // 阻止mouse相关事件，触发地图click事件
        stopPropagation(this.$groupDom);
        return this.$groupDom;
    }

    /**
     * 切换组件container样式
     * @param {*} cssName
     * @param {*} type  1为add样式class否则为remove
     */
    _toggleContainerCss(cssName, type = 1) {
        if (this.object3D.element) {
            if (type === 1) {
                this.$dom.classList.add(cssName);
            } else {
                this.$dom.classList.remove(cssName);
            }
        }
    }

    refreshView() {
        const { haveAbsorb, absorbs, absorbOtherMajor } = this.model;
        const curStyle = this.model.caclCurrentStyle();

        const {
            show,
            svgShow,
            bgColor,
            color,
            bgIconShow,
            borderColor,

            groupView,
            textShow,
            textColor,
            textMaxWidth,
            renderOrder,
            outSize,
            innerSize,
            otherPos,
            borderRadius,
            priority
        } = curStyle;

        const { $normalDom, $groupDom, $groupCount, $groupText, $txt, $svg, $svgBg, $iconBox } = this;

        let _show = show;
        if (!this.model.getParentsShow()) {
            _show = false;
        }
        _show = _show && !this.model.isRemoved();
        this.model.show = _show;
        if (!this.model.show) return;
        if (!$normalDom) return;

        if (groupView && haveAbsorb) {
            /** ************* 聚合视图 ************* */
            $normalDom.style.display = 'NONE';
            $groupDom.style.display = null;
            $groupCount.innerHTML = absorbs.length;
            if (absorbOtherMajor && priority <= StatePriority.absorb) {
                $groupCount.style.backgroundColor = '#a5b4d0';
            } else {
                $groupCount.style.backgroundColor = bgColor;
            }
            if (textShow) {
                $groupText.style.display = null;
                $groupText.style.maxWidth = textMaxWidth;
                $groupText.style.color = textColor;
            } else {
                $groupText.style.display = 'NONE';
            }
        } else {
            /** ************* 一般视图 ************* */
            $normalDom.style.display = null;
            $groupDom.style.display = 'NONE';
            if (textShow) {
                $txt.style.display = null;
                $txt.style.maxWidth = textMaxWidth;
                $txt.style.color = textColor;
            } else {
                $txt.style.display = 'NONE';
            }
            if ($svg) {
                // 定义尺寸
                if (bgIconShow) {
                    $svg.style.display = null;
                    $svg.style.position = 'absolute';

                    $svgBg.style.display = null;
                    $iconBox.style.border = null;
                    $iconBox.style.backgroundColor = null;
                    $iconBox.style.width = null;
                    $iconBox.style.height = null;
                } else {
                    $svg.style.position = null;
                    $svgBg.style.display = 'NONE';
                    if (svgShow) {
                        $svg.style.display = null;
                    } else {
                        $svg.style.display = 'NONE';
                    }
                    $iconBox.style.borderRadius = `${borderRadius}px`;
                    $iconBox.style.width = `${outSize}px`;
                    $iconBox.style.height = `${outSize}px`;
                    $iconBox.style.border = `1px solid ${borderColor}`;
                    $iconBox.style.backgroundColor = bgColor;
                }
                $svg.setAttribute('width', innerSize);
                $svg.setAttribute('height', innerSize);
                $svg.setAttribute('fill', color);
            }
        }

        this.object3D.renderOrder = renderOrder;

        const lastOtherPos = this.lastStyle?.otherPos;
        if (otherPos || lastOtherPos) {
            const isReset = !otherPos && lastOtherPos;
            this.setOtherPosition(isReset);
        }
        this.lastStyle = curStyle;
    }

    onObject3DMounted() {
        this.refreshView();
    }

    // 设置一个其他的位置
    setOtherPosition(isReset) {
        const { absorbTo, bimLocation } = this.model;
        if (absorbTo && !isReset) {
            this.object3D.position.copy(absorbTo.bimLocation);
        } else {
            this.object3D.position.copy(bimLocation);
        }
    }

    dispose() {
        super.dispose();

        this.$dom = null;
        this.$normalDom = null;
        this.$svg = null;
        this.$svgBg = null;
        this.$iconBox = null;
        this.$txt = null;
        this.$groupDom = null;
        this.$groupCount = null;
        this.$groupText = null;
    }
}
