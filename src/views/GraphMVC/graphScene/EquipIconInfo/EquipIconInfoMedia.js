import { CSS2DObject } from '@yushu/three-base/three-extends/jsm/renderers/CSS2DRenderer';
import { createDom, equipIcon, equipIconBackgroundColor } from '../../utils/d2Utils';
import { RenderOrder } from '../GraphSceneDefine';
import BaseMedia from '../../core/View/BaseMedia';
import { Css2dobjectClick, Css2dobjectMouseMove } from '../RootNode/RootNodeMedia';
import { wrapperDom } from '../../core/utils';

export const Dom = {
    group: 0,
    normal: 1
};

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

export default class EquipIconInfoMedia extends BaseMedia {
    constructor(equipIconInfo, rootMedia) {
        super(equipIconInfo, rootMedia);
        this.transformScale = `scale(${this.model.scale}) `;
        this.init();
        this.model.addObserver('ChangeState', e => this.equipIconInfoMediaStateChanged(e));
        this.model.addObserver('EquipAbsorbRender', e => this.equipAbsorbRenderDone(e));
        this.model.addObserver('ShowGroupDom', e => this.showGroupDom(e));
    }

    // 重写父类方法，生成模型
    makeObject3D() {
        const {
            model: { height, floorHeight, bimLocation }
        } = this;
        if (!bimLocation) return;
        this.$dom = createDom({
            tagName: 'div',
            classList: ['equip-info-container'],
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
            model: {
                equipData: { localName, name },
                bgColor,
                svg
            }
        } = this;
        const showName = localName || name || '--';
        const { iconInnerHTML } = this.model.caclCurrentStyle();
        /** *********** 普通dom渲染 开始 ************** */

        this.$normalDom = createDom({
            tagName: 'div',
            classList: ['equip-normal-dom']
        });

        // 创建icon + 文字
        if (iconInnerHTML) {
            createDom({
                tagName: 'div',
                innerHTML: iconInnerHTML,
                appendTo: this.$normalDom
            });
        }
        if (svg) {
            createDom({
                tagName: 'div',
                classList: ['equip-icon'],
                style: { backgroundColor: bgColor },
                innerHTML: svg + bgSvg,
                appendTo: this.$normalDom
            });
        }

        createDom({
            tagName: 'span',
            classList: ['equip-name'],
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
            model: {
                equipData: { className },
                absorbs
            }
        } = this;
        this.$groupDom = createDom({
            tagName: 'div',
            classList: ['equip-group-dom']
        });

        this.$groupCount = createDom({
            tagName: 'div',
            classList: ['group-count'],
            appendTo: this.$groupDom,
            innerHTML: absorbs.size
        });
        this.$groupText = createDom({
            tagName: 'div',
            classList: ['group-text'],
            innerHTML: `${className}等设备`,
            appendTo: this.$groupDom
        });

        // 处理 聚合对象事件
        this.$groupDom.addEventListener('mouseenter', event => {
            this._toggleContainerCss('hover');
            this.object3D.renderOrder = RenderOrder.card;
            event.stopPropagation();
            if (this.$groupText) this.$groupText.style.display = null;
            this.rootMedia.emit(Css2dobjectMouseMove, { event });
            this._groupHover = setTimeout(() => {
                // 聚合对象列表容器
                this.$groupCard = createDom({
                    tagName: 'div',
                    classList: ['group-card'],
                    appendTo: this.$groupDom
                });
                this.$groupUl = createDom({
                    tagName: 'div',
                    classList: ['group-list'],
                    appendTo: this.$groupCard
                });
                // 阻止鼠标缩放冒泡
                this.$groupCard.addEventListener(
                    'wheel',
                    evt => {
                        evt.stopPropagation();
                    },
                    { passive: false }
                );
                this.model.setState('groupHover', true);
                // rootModel.lightLinkLine(equipData.id, true);
                this._renderGroupCard();
            }, 300);
        });
        this.$groupDom.addEventListener('mousemove', event => {
            event.stopPropagation();
            this.rootMedia.emit(Css2dobjectMouseMove, { event, model: null });
        });
        this.$groupDom.addEventListener('mouseleave', event => {
            this.object3D.renderOrder = RenderOrder.groupEquip;
            this._toggleContainerCss('hover', 0);
            // rootModel.normalLinkLine(equipData.id, true);
            if (this.$groupText) this.$groupText.style.display = 'NONE';

            this._removeGroupCard();
            event.stopPropagation();
            this.model.setState('groupHover', false);
        });
        this.$groupDom.addEventListener('pointerdown', event => {
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

    // 渲染聚合对象卡片（列表）
    _renderGroupCard() {
        this.$groupUl.innerHTML = '';
        const equipIconInfoMap = this._filterAbsorbs();
        Object.values(equipIconInfoMap).forEach(equipIconInfoArr => {
            // console.log(equipIconInfoArr);
            const $className = createDom({
                tagName: 'div',
                innerHTML: equipIconInfoArr[0].equipData.className,
                classList: ['class-name'],
                appendTo: this.$groupUl
            });
            $className.addEventListener('pointerdown', event => {
                event.stopPropagation();
            });
            equipIconInfoArr.forEach(equipIconInfo => {
                const { equipData } = equipIconInfo;
                const svg = equipIcon(equipData.groupId || equipData.classCode, 'map', this._iconSize, '#FFFFFF');
                const bgColor = equipIconBackgroundColor(equipData.groupId || equipData.classCode);
                const $li = createDom({
                    tagName: 'div',
                    classList: ['class-item'],
                    appendTo: this.$groupUl
                });
                createDom({
                    tagName: 'div',
                    innerHTML: svg,
                    classList: ['class-item-icon'],
                    style: { backgroundColor: bgColor },
                    appendTo: $li
                });
                createDom({
                    tagName: 'div',
                    innerHTML: equipData.name,
                    classList: ['class-item-name'],
                    appendTo: $li,
                    style: { fontSize: '14px' }
                });
                $li.addEventListener('pointerdown', event => {
                    event.stopPropagation();
                    this.model.setState('groupHover', false);
                    this._toggleContainerCss('hover', 0);
                    this._removeGroupCard();
                    this.rootMedia.emit(Css2dobjectClick, { event, model: equipIconInfo });
                });
            });
        });
    }

    // 移除聚合对象卡片
    _removeGroupCard() {
        if (!this._groupHover) return;
        clearTimeout(this._groupHover);
        if (this.$groupCard) {
            this.$groupCard.remove();
        }
    }

    // 聚合对象 分组数据处理
    _filterAbsorbs() {
        const {
            model: { absorbs }
        } = this;
        const equipIconInfoMap = {};
        Array.from(absorbs).forEach(equipIconInfo => {
            const { equipData } = equipIconInfo;
            if (!equipIconInfoMap[equipData.classCode]) {
                equipIconInfoMap[equipData.classCode] = [];
            }
            equipIconInfoMap[equipData.classCode].push(equipIconInfo);
        });
        return equipIconInfoMap;
    }

    switchDom(dom) {
        const {
            model: { haveAbsorb, absorbTo }
        } = this;
        if (haveAbsorb) {
            this.$groupDom.style.display = dom === Dom.normal ? 'none' : null;
            this.$normalDom.style.display = dom === Dom.normal ? null : 'none';
            this.object3D.renderOrder = dom === Dom.normal ? RenderOrder.equip : RenderOrder.groupEquip;
        } else {
            this.object3D.renderOrder = RenderOrder.equip;
        }
        if (absorbTo) {
            absorbTo.showGroupDom = !(dom === Dom.normal);
            this.$normalDom.style.display = dom === Dom.normal ? null : 'none';
            if (dom === Dom.normal) {
                this.object3D.renderOrder = RenderOrder.equip;
            }
        }
    }

    switchDomShow() {
        const {
            model: { haveAbsorb, absorbTo }
        } = this;
        const { isMustShow, renderOrder } = this.model.caclCurrentStyle();

        if (haveAbsorb) {
            this.$groupDom.style.display = isMustShow ? 'none' : null;
            this.$normalDom.style.display = isMustShow ? null : 'none';

            this.object3D.renderOrder = renderOrder;
            // this.object3D.renderOrder = isMustShow ? renderOrder : RenderOrder.card;
        } else {
            this.object3D.renderOrder = renderOrder;
        }
        if (absorbTo) {
            absorbTo.showGroupDom = !isMustShow;
            this.$normalDom.style.display = isMustShow ? null : 'none';

            if (isMustShow) {
                this.object3D.renderOrder = renderOrder;
            }
        }
    }

    equipIconInfoMediaStateChanged(e) {
        // console.log('equipIconInfoMediaStateChanged', e);
        if ((e && e.name === 'groupHover') || this.model.getState('groupHover')) {
            // 聚合hover不走此方法
            return;
        }

        const curStyle = this.model.caclCurrentStyle();

        // console.log('curStyle: ', curStyle, this.model._state, e, haveAbsorb, absorbTo);

        const {
            show,

            textShow,
            iconShow,

            updatePos,
            textColor,
            iconbgColor,

            cssName,
            iconInnerHTML
        } = curStyle;
        let _show = show;

        if (!this.model.getParentsShow()) {
            _show = false;
            // const parentStyle = this.model.parent.caclCurrentStyle();
            // if (parentStyle && !parentStyle.show) {
            //     _show = false;
            // }
        }
        _show = _show && !this.model.isRemoved();

        this.model.show = _show;

        const txtEle = this.object3D.element.getElementsByClassName('equip-name')[0];
        if (txtEle) {
            txtEle.style.color = textColor;
            if (textShow && _show) {
                txtEle.style.display = null;
                if (this.$groupText) this.$groupText.style.display = null;
            } else {
                txtEle.style.display = 'NONE';
                if (this.$groupText) this.$groupText.style.display = 'NONE';
            }
        }

        const iconEle = this.object3D.element.getElementsByClassName('equip-icon')[0];
        if (iconEle) {
            iconEle.style.backgroundColor = iconbgColor;
            // 有自定义Icon的初始隐藏默认icon,默认icon会在做选中时使用
            if (iconInnerHTML) {
                // 自定义icon目前未考虑防碰撞/吸收等
                iconEle.style.display = cssName === 'selected' ? null : 'NONE';
            } else if (iconShow && _show) {
                iconEle.style.display = null;
            } else {
                iconEle.style.display = 'NONE';
            }
        }

        if (this.lastStyle && this.lastStyle.cssName) {
            this.$dom.classList.remove(this.lastStyle.cssName);
        }
        if (cssName) {
            this.$dom.classList.add(cssName);
        }
        this.switchDomShow();
        const lastUpdatePos = this.lastStyle?.updatePos;
        if (updatePos || lastUpdatePos) {
            // hover时 聚合被吸收的对象，位置更新为吸收对象的位置
            // unhover 还原位置
            const isReset = !updatePos && lastUpdatePos;
            this.setOtherPosition(isReset);
        }
        this.lastStyle = curStyle;
    }

    onObject3DMounted() {
        this.equipIconInfoMediaStateChanged();
    }

    /**
     * 渲染聚合模式
     */
    equipAbsorbRenderDone() {
        const {
            model: { haveAbsorb, absorbs }
        } = this;

        const { isMustShow, renderOrder } = this.model.caclCurrentStyle();
        // console.log('equipAbsorbRenderDone', renderOrder, this.model._state);
        if (haveAbsorb && !isMustShow) {
            this.$normalDom.style.display = 'none';
            this.$groupDom.style.display = null;
            this.$groupCount.innerHTML = absorbs.size;
            if (this.$groupCard) {
                this._renderGroupCard();
            }

            if (this.$dom && this.$dom.classList.contains('hover')) {
                this.object3D.renderOrder = RenderOrder.card;
            } else {
                this.object3D.renderOrder = RenderOrder.groupEquip;
            }
        } else {
            this.$normalDom.style.display = null;
            this.$groupDom.style.display = 'none';
            this.object3D.renderOrder = renderOrder;
        }
    }

    showGroupDom(value) {
        this.$groupDom.style.display = value ? null : 'none';
        if (value) {
            this.object3D.renderOrder = RenderOrder.groupEquip;
        }
    }

    // 设置一个其他的位置
    setOtherPosition(isReset) {
        const {
            model: { absorbTo }
        } = this;
        const {
            model: { bimLocation }
        } = this;
        if (absorbTo && !isReset) {
            this.object3D.position.copy(absorbTo.bimLocation);
        } else {
            this.object3D.position.copy(bimLocation);
        }
    }
}
