// @ts-ignore
import i18n from '@/localization';
import { baseUtils } from '@yushu/three-base';
import BaseModel from '@/views/GraphMVC/core/Model/BaseModel';
import { modelNameEnum, RenderOrder, StatePriority } from '@/views/GraphMVC/graphScene/GraphSceneDefine';
import { getTextWith } from '@/views/GraphMVC/utils/d2Utils';
const { getD3PosByBimLocation } = baseUtils;

const textOffset = {
    x: 0,
    y: 0
};

export default class SpaceLabelInfo extends BaseModel {
    // !这里绑定在this上的所有属性,都会在图元的media视图层的this.model上获取到
    constructor(data, meta) {
        super();
        // # 业务层传递的数据
        this.data = data;
        this.spaceIcon = meta?.spaceIcon || '';
        // ![必须]获取图元名称
        this.name = modelNameEnum.SpaceLabelInfo;
        // *[可选]获取图元位置 ->解析出来是一个Vector3三维坐标
        this.bimLocation = getD3PosByBimLocation(data.bimLocation);
        // ![必须] 展示图元
        this.show = true;

        // * 碰撞检测需要
        this.key = data.id;
        this.setStateStyles({
            normal: {
                show: true,
                priority: StatePriority.normal,
                color: '#1B2129'
            },
            // 碰撞
            collided: {
                show: true,
                priority: RenderOrder.collided,
                hideLabel: true
            },
            // hover
            hover: {
                show: true,
                priority: StatePriority.hover,
                color: '#246FE5',
                hideLabel: false
            },
            // 选中
            selected: {
                show: true,
                priority: StatePriority.selected,
                color: '#246FE5',
                spaceIcon: false,
                selectedIcon: true,
                hideLabel: false,
                renderOrder: 3000
            }
        });

        this.svg =
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" fill="none"><rect y=".5" width="16" height="16" rx="2" fill="#9B6CED"/><path d="M5.675 11.78c-.17-.699-.938-1.27-1.253-1.646-1.5-1.796-1.3-4.396.459-5.96 1.759-1.566 4.48-1.565 6.239 0 1.759 1.566 1.958 4.166.457 5.96-.315.377-1.081.948-1.252 1.646h-4.65zm4.617.574v.548c0 .291-.121.57-.336.776a1.172 1.172 0 01-.81.322H6.854c-.304 0-.595-.116-.81-.322a1.075 1.075 0 01-.336-.776v-.548h4.584zm-1.579-5.52V5.208a.275.275 0 00-.492-.17L6.22 7.6a.275.275 0 00.216.444H7.45V9.85c0 .2.254.287.377.13l2.117-2.703a.275.275 0 00-.217-.445H8.713z" fill="#fff"/></svg>';
    }
    getTextRect() {
        if (this?.textRect) {
            return this.textRect;
        }
        const name = this.data?.localName || this.data?.name;
        const isFeedbackAdjustment = this.data?.demandFeedbackAdjustment;
        if (name) {
            const wordWidth = getTextWith(name, '12px PingFang SC');
            const iconWidth = 16;
            const gapWidth = 4;
            const iconWidthGap = isFeedbackAdjustment ? iconWidth + gapWidth : 0;
            this.textRect = {
                width: wordWidth + textOffset.x + iconWidthGap,
                height: 17 + textOffset.y
            };
            return this.textRect;
        }
        return null;
    }
}
