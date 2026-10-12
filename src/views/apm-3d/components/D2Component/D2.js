/**
 * 2d 卡片的基类
 */

import { CSS2DObject } from '@yushu/three-base/three-extends/jsm/renderers/CSS2DRenderer';
import { baseUtils } from '@yushu/three-base';

const { d3PosTod2Pos } = baseUtils;

export default class D2 {
    constructor({ mapInstance, scene, relMesh = null, d3Pos, model, ...other }) {
        // 需要初始化一些对象

        // 一些外部依赖
        this.mapInstance = mapInstance;
        this.scene = scene; // 3d场景
        this.relMesh = relMesh; // 关联的模型

        this.domScale = other.domScale;

        // 一些自身所需要的属性
        this.type = 'd2'; // 卡片类型
        this.model = model; // 原始数据
        this.d3Pos = d3Pos; // 在3纬空间中的坐标
        this.d2Obj = null; // css2dObject 对象
        this.width = 0; // 卡片的宽
        this.height = 0; // 卡片的高

        // 几种状态
        this._hover = false; // hover状态
        this._selected = false; // 选中状态 主要是关联模式下
        this._active = false; // 活跃状态, 卡片会一直显示, 不会参与防碰撞, 优先显示
        this._focus = false; // 聚焦状态
        this._visible = false; // 可见性
        this._inertShow = false; // 惰性显示
        this._abstractShow = false; // 摘要卡片是否显示
    }

    set visible(flag) {
        this._visible = flag;
        if (flag) {
            this.mounte();
        } else {
            if (this.hover) {
                // console.warn('先移除hover状态再将visible置为false');
                return;
            }
            if (this.focus) {
                // console.warn('先移除hover状态再将selected置为false');
                return;
            }
            if (this.active) {
                // console.warn('先移除hover状态再将active置为false');
                return;
            }
            if (this.selected) {
                // console.warn('先移除hover状态再将selected置为false');
                return;
            }
            if (this.inertShow) {
                // console.log('防碰撞显示,不能移除');
                return;
            }
            this.unMounte();
        }
    }

    setHover(flag) {
        if (this._hover === flag) return;
        this._hover = flag;
        if (this.d2Obj) {
            if (flag) {
                this.$dom.classList.add('hover');
                if (this._$txt) {
                    this._$txt.style.display = null;
                }
                if (this._$groupText) {
                    this._$groupText.style.display = null;
                }
            } else {
                this.$dom.classList.remove('hover');
                if (!this.selected && this._$txt && (!this.showTxt || !this._antiShowTxt)) {
                    this._$txt.style.display = 'none';
                }
                if (!this.selected && this._$groupText && (!this.showTxt || !this._antiShowTxt)) {
                    this._$groupText.style.display = 'none';
                }
            }
            this.refreshRenderOrder();
        }
    }

    setActive(flag) {
        if (this._active === flag) return;
        this._active = flag;
        if (this.d2Obj) {
            if (flag) {
                this.$dom.classList.add('active');
                if (this._$txt) {
                    this._$txt.style.display = null;
                }
                if (this._$groupText) {
                    this._$groupText.style.display = null;
                }
            } else {
                this.$dom.classList.remove('active');
                if (!this.selected && this._$txt && (!this.showTxt || !this._antiShowTxt)) {
                    this._$txt.style.display = 'none';
                }
                if (!this.selected && this._$groupText && (!this.showTxt || !this._antiShowTxt)) {
                    this._$groupText.style.display = 'none';
                }
            }
            this.refreshRenderOrder();
        }
    }

    set selected(flag) {
        if (this._selected === flag) return;
        this._selected = flag;
        if (this.d2Obj) {
            if (flag) {
                this.$dom.classList.add('old-selected');
            } else {
                this.$dom.classList.remove('old-selected');
            }
            this.refreshRenderOrder();
        }
    }

    set focus(flag) {
        if (this._focus === flag) return;
        this._focus = flag;
        if (this.d2Obj) {
            if (flag) {
                this.$dom.classList.add('focus');
            } else {
                this.$dom.classList.remove('focus');
            }
            this.refreshRenderOrder();
        }
    }

    /**
     * 惰性显示 设置了 inertShow=true后, 只有 通过设置inertShow=false 才能取消其显示状态
     */
    set inertShow(flag) {
        this._inertShow = flag;
        this.visible = flag;
    }

    get visible() {
        return this._visible;
    }

    get hover() {
        return this._hover;
    }

    get selected() {
        return this._selected;
    }

    get focus() {
        return this._focus;
    }

    get active() {
        return this._active;
    }

    get inertShow() {
        return this._inertShow;
    }

    // 设置一个其他的位置
    setOtherPosition(v3) {
        this._otherD3Pos = v3;
        if (this.d2Obj) {
            this.d2Obj.position.copy(this._otherD3Pos);
        }
    }

    // 移除设置一个其他位置
    removeOtherPosition() {
        this._otherD3Pos = null;
        if (this.d2Obj) {
            this.d2Obj.position.copy(this.d3Pos);
        }
    }

    // 显示摘要卡片
    setAbstractShow(flag, abstractData) {
        if (!this._$abstractCard) return;
        if (flag && this.hover) {
            // hover状态下才显示摘要卡片
            this._abstractShow = true;
            this._$abstractCard.classList.add('abstract-card');
            let listStr = '<div class="content-list">';
            // 测试数据
            // abstractData.keyPointList = [{ name: '测试数据title', value: '测试数据value' }, { name: '测试数据title', value: '测试数据value' }, { name: '测试数据title', value: '测试数据value' }];
            if (abstractData.keyPointList && abstractData.keyPointList.length) {
                abstractData.keyPointList.forEach(one => {
                    listStr += `<div class="one-abstract">
                                     <span class="one-name">${one.name}：</span>
                                     <span class="one-value">${one.value || '--'} ${one.value && one.unit ? one.unit : ''}</span>
                                 </div>`;
                });
            }
            listStr += '</div>';
            this._$abstractCard.innerHTML = `<div class="header">${abstractData.title || '--'}</div>${listStr}`;
            this._$abstractCard.style.display = 'block';
        } else {
            this._abstractShow = false;
            this._$abstractCard.style.display = 'none';
        }
    }

    // 渲染 和 事件
    // 挂载dom
    mounte() {
        if (this.d2Obj) return; // 已经挂载上了
        if (!this.d3Pos) return console.warn(`${this.model.id}没有bimLocation`);
        this.d2Obj = new CSS2DObject(this.renderDom());
        this.d2Obj.transformOrigin = this.transformOrigin || 'translate(-50%,-50%)';
        if (this.domScale) {
            this.d2Obj.transformOrigin += `scale(${this.domScale})`;
        }
        this.d2Obj.position.copy(this._otherD3Pos || this.d3Pos);
        this.d2Obj.myScene = this.scene;
        this.refreshRenderOrder();

        if (this.hover) {
            this.$dom.classList.add('hover');
        } else {
            this.$dom.classList.remove('hover');
        }
        if (this.active) {
            this.$dom.classList.add('active');
        } else {
            this.$dom.classList.remove('active');
        }
        if (this.selected) {
            this.$dom.classList.add('old-selected');
        } else {
            this.$dom.classList.remove('old-selected');
        }
        if (this.focus) {
            this.$dom.classList.add('focus');
        } else {
            this.$dom.classList.remove('focus');
        }
        this.scene.add(this.d2Obj);
    }

    refreshRenderOrder() {
        if (!this.d2Obj) return;
        this.d2Obj.renderOrder = this.renderOrder || 0;
        if (this.hover) this.d2Obj.renderOrder = 4;
        if (this.active) this.d2Obj.renderOrder = 3;
        if (this.focus) this.d2Obj.renderOrder = 2;
        if (this.selected) this.d2Obj.renderOrder = 1;
    }

    // 移除dom
    unMounte() {
        this.scene.remove(this.d2Obj);
        this.d2Obj = null;
    }

    // 获取坐标 用于防碰撞计算
    getPos(domHalfWidth, domHalfHeight, camera, _offset) {
        const offset = _offset || { x: -10, y: -5 };
        if (this.d3Pos) {
            const pos = this.d3Pos.clone();
            pos.project(camera);
            const d2Pos = {
                x: Math.round(pos.x * domHalfWidth + domHalfWidth),
                y: Math.round(-pos.y * domHalfHeight + domHalfHeight)
            };
            const domRect = this.getRect();
            // let { width, height } = domRect;
            let halfW = domRect.width >>> 1,
                halfH = domRect.height >>> 1;
            if (this.domScale) {
                halfW *= this.domScale;
                halfH *= this.domScale;
            }

            // 超出画布的d2将会被移除
            if (d2Pos.x + halfW < 0 || d2Pos.y + halfH < 0) {
                this.inertShow = false;
                return null;
            }
            if (d2Pos.x - halfW > 2 * domHalfWidth || d2Pos.y - halfH > 2 * domHalfHeight) {
                this.inertShow = false;
                return null;
            }

            // 防碰撞偏移量 及 最小碰撞单位
            // eslint-disable-next-line one-var
            let rectHalfWidth = halfW + offset.x,
                rectHalfHeight = halfH + offset.y;
            if (rectHalfWidth < 10) rectHalfWidth = 10;
            if (rectHalfHeight < 10) rectHalfHeight = 10;
            return {
                maxX: d2Pos.x + rectHalfWidth,
                minX: d2Pos.x - rectHalfWidth,
                maxY: d2Pos.y + rectHalfHeight,
                minY: d2Pos.y - rectHalfHeight
            };
        }
        return null;
    }

    /**
     * 获取当前D2实例的包围盒列表
     * @param {*} domHalfWidth dom半宽
     * @param {*} domHalfHeight dom半高
     * @param {*} camera 相机
     * @returns 包围盒数组
     */
    getAntiObject(domHalfWidth, domHalfHeight, camera) {
        if (this.d3Pos) {
            const d2Pos = d3PosTod2Pos(this.d3Pos, camera, domHalfWidth, domHalfHeight);
            return this.getBound(d2Pos, domHalfWidth, domHalfHeight);
        }
        return null;
    }
}
