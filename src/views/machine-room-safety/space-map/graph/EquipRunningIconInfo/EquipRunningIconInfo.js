// @ts-ignore
import i18n from '@/localization';
import { registerMedia } from '@/views/GraphMVC/core/Graph';
import EquipRunningIconInfoMedia from './EquipRunningIconInfoMedia';

import { baseUtils } from '@yushu/three-base';
import BaseModel from '@/views/GraphMVC/core/Model/BaseModel';
import { modelNameEnum, StatePriority } from '@/views/GraphMVC/graphScene/GraphSceneDefine';
import { getTextWith } from '@/views/GraphMVC/utils/d2Utils';
const { getD3PosByBimLocation } = baseUtils;

export default class EquipRunningIconInfo extends BaseModel {
    // !这里绑定在this上的所有属性,都会在图元的media视图层的this.model上获取到
    constructor(data, height = 0, floorHeight = 0) {
        super();
        // # 业务层传递的数据
        this.data = data;
        this.height = height;
        this.floorHeight = floorHeight;
        // ![必须]获取图元名称
        this.name = modelNameEnum.EquipRunningIconInfo;
        // *[可选]获取图元位置 ->解析出来是一个Vector3三维坐标
        if (!data.bimLocation) {
            return;
        }
        this.bimLocation = getD3PosByBimLocation(data.bimLocation);

        // ![必须] 展示图元
        this.show = true;

        // * 碰撞检测需要
        this.collisionCacheData = {};

        this.key = data.id;
        this.setStateStyles({
            normal: {
                show: true // 是否显示
            },
            // 整个被碰撞
            collided: {
                show: false,
                priority: StatePriority.hover + 2
            }
        });
    }

    getTextRect() {
        // if (this?.textRect) {
        //     return this.textRect;
        // }
        // const name = this.data?.localName || this.data?.name;
        // if (name) {
        //     const wordWidth = getTextWith(name, '12px PingFang SC');
        //     this.textRect = {
        //         width: wordWidth,
        //         height: 17 + 4
        //     };
        //     return this.textRect;
        // }
        return null;
    }

    setDetailRect(model, detail = {}) {
        if (model?.data?.id !== this.key) {
            return;
        }
        // TODO 待调整
        const infoCodes = Object.values(detail)
            .filter(val => {
                return val?.groupCode === 'fixedBubbleCard';
            })
            ?.slice(0, 4);

        if (!infoCodes?.length) {
            return;
        }

        const computedRes = infoCodes?.map(obj => {
            const finalVal = (obj?.dataSource || [])?.length ? obj?.dataSource?.find(v => v?.code === obj.dataValue)?.name : obj?.dataValue;
            return {
                ...obj,
                name: `${obj.infoCodeName || ''}：`,
                valText: `${finalVal || '--'}${obj.unit || ''}`
            };
        });
        const rowsRenderString = computedRes.map(row => {
            return `${row.name}${row.valText}`;
        });

        const allWidth = rowsRenderString.map(s => {
            const wordWidth = getTextWith(s, '12px PingFang SC');
            return wordWidth;
        });
        const maxWidth = Math.max(...allWidth);

        this.cardSize = {
            width: maxWidth + 4 + 16, //row gap + padding
            height: computedRes.length * 20 + 12 + 20 // padding + column gap
        };
        return this.cardSize;
    }

    getIconRect() {
        if (this?.cardSize) {
            return this.cardSize;
        }
        const { _infoMap } = this.data || {};
        const res = this.setDetailRect(this, _infoMap);
        return res;
    }

    /**
     * 吸收一个 EquipIcon 对象
     * @param {EquipIcon} otherEquipIcon
     */
    collisionAbsorb(otherEquipIcon) {
        if (otherEquipIcon.haveAbsorb) {
            otherEquipIcon.absorbs.forEach(one => {
                this.absorbs.push(one);
                const other = one.majorId !== this.majorId;
                if (other) {
                    this.absorbOtherMajor = true;
                }
            });
            otherEquipIcon.clearAbsorb();
        } else {
            const other = otherEquipIcon.majorId !== this.majorId;
            if (other) {
                this.absorbOtherMajor = true;
            }
            this.absorbs.push(otherEquipIcon);
        }
        // 设置状态应该放在后面
        otherEquipIcon.absorbTo = this;
        this.setAsyncState('absorb', true);
    }

    /**
     * 清楚掉 聚合对象
     */
    clearAbsorb() {
        this.absorbs = [this];
        this.absorbTo = null;
        this.absorbOtherMajor = false;
        this.setAsyncState('absorb', false);
    }

    /**
     * 返回是否有 聚合
     */
    get haveAbsorb() {
        return this.absorbs.length > 1;
    }

    // TODO 待调整
    updateIot(data) {
        this.emit('UpdateIot', data);
    }
}

registerMedia(modelNameEnum.EquipRunningIconInfo, EquipRunningIconInfoMedia);
