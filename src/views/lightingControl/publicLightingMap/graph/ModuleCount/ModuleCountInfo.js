// @ts-ignore
import i18n from '@/localization';
import { baseUtils } from '@yushu/three-base';
import BaseModel from '@/views/GraphMVC/core/Model/BaseModel';
import { modelNameEnum, RenderOrder } from '@/views/GraphMVC/graphScene/GraphSceneDefine';
const { getD3PosByBimLocation } = baseUtils;

export default class ModuleCountInfo extends BaseModel {
    // hoverList :[ name:'B3_强电井_4', id:"1"]
    constructor(data, hoverList) {
        super();
        this.data = data;
        this.name = modelNameEnum.ModuleCount;
        this.bimLocation = getD3PosByBimLocation(data.bimLocation);
        this.show = true;
        this.hoverList = hoverList || [];
        this.setStateStyles({
            normal: {
                show: false,
                priority: RenderOrder.equip,
                color: '#424c59'
            },
            // hover
            hover: {
                show: true,
                priority: RenderOrder.hover,
                color: '#246fe5'
            },
            // 选中
            selected: {
                show: true,
                selectedIcon: true,
                priority: RenderOrder.clickOn,
                color: '#246fe5',
                renderOrder: 3000
            },
            floorMode: {
                show: true,
                priority: 1000
            },
            // 关联模式下
            isRelMode: {
                show: false,
                priority: 2000
            },
            // 关联模式下显示
            relModeShow: {
                show: true,
                opacity: 0.5,
                priority: 2001
            },
            // 是关联对象
            isRelObject: {
                opacity: 1,
                priority: 2002
            },
            hide: {
                show: false,
                priority: Infinity
            }
        });
        // this.setState('hover', true);
    }
}
