import { baseUtils } from '@yushu/three-base';

import { equipIcon, equipIconBackgroundColor, getTextWith } from '@/views/GraphMVC/utils/d2Utils';
import BaseCollisionModel from '../CollisionModel/BaseCollisionModel';
import { modelNameEnum, RenderOrder, StatePriority, CollidedOrder } from '../GraphSceneDefine';
import * as _ from 'lodash';

const { getD3PosByBimLocation } = baseUtils;

const getEquipIconInfoStyles = equipData => ({
    normal: {
        show: true,
        absorbShow: false,
        iconShow: true,
        joinCollide: true,
        textColor: '#1b2129',
        iconbgColor: equipIconBackgroundColor(equipData.classCode),
        renderOrder: RenderOrder.equip,
        priority: 0,
        weight: CollidedOrder.equip
    },
    hover: {
        show: true,
        isMustShow: true,
        updatePos: true,
        textShow: true,
        iconShow: true,
        joinCollide: false,
        textColor: '#246FE5',
        iconbgColor: '#246FE5',
        // cssName: 'hover',
        renderOrder: RenderOrder.hover,
        priority: StatePriority.hover
    },
    selected: {
        show: true,
        textShow: true,
        isMustShow: true,
        joinCollide: false,
        iconShow: true,
        textColor: '#246FE5',
        iconbgColor: '#246FE5',
        cssName: 'selected',
        renderOrder: RenderOrder.selected,
        priority: StatePriority.selected
    },
    active: {
        show: true,
        textShow: true,
        joinCollide: false,
        iconShow: true,
        textColor: '#246FE5',
        iconbgColor: '#246FE5',
        cssName: 'active',
        renderOrder: RenderOrder.active,
        priority: StatePriority.active
    },
    absorb: {
        normalShow: false,
        absorbShow: true,
        renderOrder: RenderOrder.card
    },
    scaleShow: {
        show: true,
        absorbShow: false,
        textShow: true,
        iconShow: true,
        priority: 1
    },
    collided: {
        textShow: false,
        priority: 2
    },
    textCollided: {
        textShow: false,
        priority: 2
    },
    iconCollided: {
        iconShow: false,
        priority: 2
    }
});
export default class EquipIconInfo extends BaseCollisionModel {
    constructor(equipData, { height, floorHeight, iconCatgory = 'map', scale = 1 }, mapScene) {
        super();
        this.key = equipData.id;
        this.equipData = equipData;
        this.weight = equipData.weight; // 权重
        this.floorHeight = floorHeight;
        this.height = height;
        this.mapScene = mapScene;
        this.scale = scale;

        this.bgColor = equipIconBackgroundColor(equipData.classCode);
        this.svg = equipIcon(equipData.classCode, iconCatgory, 18, '#ffffff');

        this.bimLocation = getD3PosByBimLocation(equipData.bimLocation);

        this._hasIcon = this.svg != null; // 是否有icon

        this.absorbs = new Set([this]); // 被吸收进来的数据

        this.absorbTo = null; // 次对象被吸收到 某个对象中 TYPE  EquipIconInfo
        this._showGroupDom = null;

        this.needAbsorbRender = false;
        this.absorbEnable = true;
        this.map = null; // 地图实例
        this.absorbsLines = []; // 碰撞吸收合并的线
        this.absorbsCreateLines = []; // 碰撞吸收新创建的线
        this.absorbsRemoveLines = []; // 碰撞删除的线
        this.name = modelNameEnum.EquipIconInfo;

        const defaultStyles = getEquipIconInfoStyles(equipData);
        this.defineStyles = _.assign({}, this.defineStyles, defaultStyles);
        this.normalStyle = this.defineStyles.normal;
        this.styles.add(this.defineStyles.normal);
    }

    getData() {
        return this.equipData;
    }

    /**
     * 吸收一个 EquipIconInfo 对象
     * @param {EquipIconInfo} otherEquipIconInfo
     */
    collisionAbsorb(otherEquipIconInfo, map) {
        // console.log('collisionAbsorb');
        this.map = map;
        this.needAbsorbRender = true;
        if (otherEquipIconInfo.haveAbsorb) {
            otherEquipIconInfo.absorbs.forEach(equipIconInfo => {
                this.absorbs.add(equipIconInfo);
            });
            otherEquipIconInfo.clearAbsorb();
        } else {
            this.absorbs.add(otherEquipIconInfo);
        }
        // 设置状态应该放在后面
        otherEquipIconInfo.collisionTxtShow = false;
        otherEquipIconInfo.absorbTo = this;
        otherEquipIconInfo.show = false;
        // this.collisionAbsorbLinkLine(otherEquipIconInfo);
        this.absorbRenderTimer();
    }

    /**
     * 清楚掉 聚合对象
     */
    clearAbsorb() {
        this.needAbsorbRender = true;
        this.absorbs = new Set([this]);
        this.collisionTxtShow = true;
        this.absorbTo = null;
        this.absorbRenderTimer();
    }

    /**
     * 吸收一个 EquipIconInfo 对象的飞行线
     * @param {EquipIconInfo} otherEquipIconInfo
     */
    // eslint-disable-next-line class-methods-use-this
    collisionAbsorbLinkLine(otherEquipIconInfo) {
        const { linkLines, newLinkLines } = this.map;
        const otherEquipId = otherEquipIconInfo.key;
        let piont = null;
        linkLines.forEach(linkLine => {
            if (linkLine.show) {
                if (linkLine.linkLineData.from.id === otherEquipId) {
                    linkLine.show = false;
                    piont = linkLine.linkLineData.to;
                    this.mapScene.createLinkLine(this.equipData, piont, linkLine.linkLineData.text, linkLine.color, linkLine.linkLineData.isDirection, linkLine);
                } else if (linkLine.linkLineData.to.id === otherEquipId) {
                    linkLine.show = false;
                    piont = linkLine.linkLineData.from;
                    this.mapScene.createLinkLine(piont, this.equipData, linkLine.linkLineData.text, linkLine.color, linkLine.linkLineData.isDirection, linkLine);
                }
            }
        });
        for (let i = 0; i < newLinkLines.length; i++) {
            const linkLine = newLinkLines[i];
            if (linkLine.show) {
                if (linkLine.linkLineData.from.id === otherEquipId) {
                    this.map.removeLinkLine(linkLine);
                    newLinkLines.splice(i, 1);
                    piont = linkLine.linkLineData.to;
                    this.mapScene.createLinkLine(
                        this.equipData,
                        piont,
                        linkLine.linkLineData.text,
                        linkLine.color,
                        linkLine.linkLineData.isDirection,
                        linkLine.linkLineData.originLinkLine
                    );
                } else if (linkLine.linkLineData.to.id === otherEquipId) {
                    this.map.removeLinkLine(linkLine);
                    newLinkLines.splice(i, 1);
                    piont = linkLine.linkLineData.from;
                    this.mapScene.createLinkLine(
                        piont,
                        this.equipData,
                        linkLine.linkLineData.text,
                        linkLine.color,
                        linkLine.linkLineData.isDirection,
                        linkLine.linkLineData.originLinkLine
                    );
                }
            }
        }
    }

    /**
     * 异步更行 view 层
     */
    absorbRenderTimer() {
        Promise.resolve().then(() => {
            if (this.needAbsorbRender) {
                // 每轮防碰撞只会 执行一次
                this.emit('EquipAbsorbRender', {});
                this.needAbsorbRender = false;
            }
        });
    }

    // 获取icon rect
    getIconRect() {
        const { collisionCacheData } = this;
        if (collisionCacheData.iconRect) return collisionCacheData.iconRect;
        collisionCacheData.iconRect = {
            width: 19 * this.scale,
            height: 19 * this.scale
        };
        return collisionCacheData.iconRect;
    }

    getPositionYOffset() {
        let height = 0;
        const iconRect = this.getIconRect();
        const textRect = this.getTextRect();
        if (iconRect) {
            height = iconRect && iconRect.height;
        } else if (textRect) {
            height = textRect && textRect.height;
        }
        return { x: 0, y: -height / 2 };
    }

    // 获取text 文字 rect
    getTextRect() {
        const { collisionCacheData } = this;
        if (collisionCacheData.textRect) return collisionCacheData.textRect;
        const wordWidth = getTextWith(this.equipData.name, '14px serif');
        if (!wordWidth) return null;
        collisionCacheData.textRect = {
            width: wordWidth * this.scale,
            height: 22 * this.scale
        };
        return collisionCacheData.textRect;
    }

    /**
     * 返回是否有 聚合
     */
    get haveAbsorb() {
        return this.absorbs.size > 1;
    }

    set collisionIconShow(isAdd) {
        // this.setSubState(SubState.collisionIconShow, isAdd);
        this.emit('ChangeEquipIconInfoSubState', {});
    }

    set collisionTxtShow(isAdd) {
        // this.setSubState(SubState.collisionTxtShow, isAdd);
        this.emit('ChangeEquipIconInfoSubState', {});
    }

    set scaleTxtShow(isAdd) {
        // this.setSubState(SubState.scaleTxtShow, isAdd);
        this.emit('ChangeEquipIconInfoSubState', {});
    }

    set scaleIconShow(isAdd) {
        // this.setSubState(SubState.scaleIconShow, isAdd);
        this.emit('ChangeEquipIconInfoSubState', {});
    }

    // get scaleTxtShow() {
    //     return this.subState & SubState.scaleTxtShow;
    // }

    set showGroupDom(value) {
        this._showGroupDom = value;
        this.emit('ShowGroupDom', value);
    }

    resetTxtIconShow() {
        this.resetSubState();
        this.emit('ChangeEquipIconInfoSubState', {});
    }
}
