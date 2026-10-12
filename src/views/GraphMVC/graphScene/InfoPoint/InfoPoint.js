import { baseUtils } from '@yushu/three-base';
import BaseModel from '../../core/Model/BaseModel';
import { modelNameEnum, RenderOrder, StatePriority } from '../GraphSceneDefine';
import { FloorEquipIconColor2 } from '@/views/GraphMVC/config/color/FloorIconConfig';
import { parseMajorIdByClassCode, getTextWith } from '@/views/GraphMVC/utils/d2Utils';
import * as _ from 'lodash';

const { getD3PosByBimLocation } = baseUtils;

const getMainColor = data => {
    const { classCode, objType } = data;
    if (objType === 'space') {
        return '#626c78';
    }
    const majorId = parseMajorIdByClassCode(classCode);
    const color = FloorEquipIconColor2[majorId];
    if (color) return color;
    return '#2EA121';
};

const generateStyle = data => {
    const { objType } = data;
    let selectTranslateY = -38;
    if (objType === 'space') {
        selectTranslateY = -58;
    }
    const mainColor = getMainColor(data);
    return {
        normal: {
            bgColor: mainColor,
            show: true,
            joinCollide: true,
            showList: false,
            showSetting: false,
            renderOrder: RenderOrder.space + 1,
            translateY: -32,
            opacity: 0.8
        },
        subCollided: {
            // 碰撞状态
            show: false,
            priority: 4
        },
        hover: {
            show: true,
            opacity: 1,
            bgColor: '#246FE5',
            renderOrder: RenderOrder.hover,
            showSetting: true,
            priority: StatePriority.hover,
            translateY: -32
        },
        activeList: {
            show: true,
            opacity: 1,
            renderOrder: RenderOrder.hover + 1,
            showList: true,
            bgColor: '#246FE5',
            showSetting: true,
            priority: StatePriority.hover + 1
        },
        selected: {
            show: true,
            opacity: 1,
            bgColor: '#246FE5',
            showSetting: true,
            renderOrder: RenderOrder.selected,
            priority: StatePriority.selected,
            translateY: selectTranslateY
        },
        absorb: {
            show: false,
            priority: StatePriority.selected + 1
        },
        relationMode: {
            // 关系模式不显示 信息点
            show: false,
            priority: Infinity
        },
        hide: {
            show: false,
            priority: Infinity
        },
        closeInfoPoint: {
            show: false,
            priority: Infinity
        }
    };
};

export default class InfoPoint extends BaseModel {
    constructor(data, { height, floorHeight }, mapScene) {
        super();
        this.data = data;
        this.key = data.id;
        this.show = true;
        this.name = modelNameEnum.InfoPoint;
        this.floorHeight = floorHeight;
        this.height = height;
        this.bimLocation = getD3PosByBimLocation(data.bimLocation);
        this.data._infoCode = '';
        this.infoTxt = '';
        this.wordWidth = 0;
        this.mapScene = mapScene;

        if (data.rwdInfoVos?.length) {
            this.data._infoCode = data.rwdInfoVos[0].code;
            this.setInfoTxt();
        }

        const defaultStyles = generateStyle(data);
        this.defineStyles = _.assign(this.defineStyles, defaultStyles);
        this.normalStyle = this.defineStyles.normal;
        this.styles.add(this.defineStyles.normal);
    }

    setInfoTxt() {
        const { data } = this;
        const { rwdInfoVos } = data;
        const info = rwdInfoVos.find(item => item.code === data._infoCode);
        let val = info?.value;
        const dataSource = info?.dataSource;
        if (dataSource?.length) {
            const findDa = dataSource.find(item => item.code === val);
            if (findDa) {
                val = findDa.name;
            } else {
                val = '';
            }
        }
        this.infoTxt = `${info?.name}:${val || '--'} ${val ? info?.units || '' : ''}`;
        this.wordWidth = getTextWith(this.infoTxt, '12px serif');
    }

    switchShowInfo(infoCode) {
        this.data._infoCode = infoCode;
        this.setInfoTxt();
        this.emit('infoCodeChange', infoCode);
    }

    getRect() {
        const wordWidth = this.wordWidth || getTextWith(this.infoTxt, '12px serif');
        let width = wordWidth + 24;
        if (width > 200) {
            width = 200;
        }
        return {
            width,
            height: 30
        };
    }
}
