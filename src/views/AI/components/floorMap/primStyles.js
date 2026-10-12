// @ts-ignore
import i18n from '@/localization';
import { getTemperatureCodeAndColor, getHumidityCodeAndColor } from '../../utils';
import { rangeGenerator } from '@/utils';
import { OBJ_TYPE } from '@/utils/globalVariables';

export const RenderOrder = {
    groupEquip: 0,
    position: 1,
    equip: 10,
    space: 20,
    bubble: 25,
    collided: 30,
    active: 50,
    hover: 60,
    selected: 65,
    card: 70,
    cardTips: 75,
    hide: 80,
    clickOn: 90
};

export const equipIconInfoStyles = (type, innerStyles, airCrewIds) => {
    const defaultStyles = {
        normal: {
            ...innerStyles.normal,
            show: true,
            dotColor: '',
            joinCollide: true,
            showText: true,
            iconType: 'large',
            iconBgColor: '#8B949E',
            renderOrder: RenderOrder.equip,
            textMaxWidth: '120px',
            priority: 0,
            opacity: 1
        },
        hover: {
            show: true,
            joinCollide: false,
            showText: true,
            textColor: '#ffffff',
            textShadow: '',
            textBgColor: '#246FE5',
            textBorder: '1px solid #fff',
            textMaxWidth: 'none',
            opacity: 1,
            renderOrder: 60,
            priority: 2900
        },
        selected: {
            show: true,
            joinCollide: false,
            showText: true,
            opacity: 1,
            textColor: '#ffffff',
            textShadow: '',
            textBgColor: '#246FE5',
            textBorder: '1px solid #fff',
            textMaxWidth: 'none',
            renderOrder: 65,
            iconColor: '#fff',
            iconBgColor: '#246FE5',
            iconBorderColor: 'rgba(255, 255, 255, 0.70)',
            priority: 2901
        },
        collided: {
            show: false,
            priority: 100
        }
    };

    if (airCrewIds?.includes(type)) {
        return { ...defaultStyles, ...stgyEquipStyles() };
    }
};

export const stgyEquipStyles = () => {
    const runStatus = {
        runStatus0: {
            iconBgColor: '#424C59',
            priority: 200
        },
        runStatus1: {
            iconBgColor: '#09B3B5',
            priority: 200
        }
    };
    return runStatus;
};

export const customeBubblePrimStyles = (type, innerStyles, objData, airCrewIds) => {
    let offsetTop = 0;
    if (airCrewIds?.includes(type)) {
        offsetTop = objData.objType === OBJ_TYPE.SPACE ? 15 : 18;
    } else if (type === 'SpaceStrategyDemand') {
        offsetTop = 15;
    } else {
        offsetTop = 32;
    }

    return {
        normal: {
            show: false,
            joinCollide: false,
            renderOrder: RenderOrder.bubble,
            opacity: 1
        },
        hover: {
            show: true,
            renderOrder: 66,
            offsetTop: offsetTop,
            opacity: 1,
            priority: 2800
        },
        selected: {
            show: false,
            renderOrder: 65,
            opacity: 1,
            priority: 2801
        },
        relModeShow: {
            opacity: 0.3,
            priority: 2001
        },
        isRelObject: {
            opacity: 1,
            priority: 2002
        },
        collided: {
            show: false,
            priority: 100
        }
    };
};

// 空间IconInfo
export const spaceIconInfoStyles = (type, airCrewIds) => {
    const defaultStyles = {
        normal: {
            show: false,
            joinCollide: false,
            iconbgColor: '#ffffff',
            svgFillColor: '#ffffff',
            textShadow: '1px 0 0 #ffffff, 0 1px 0 #ffffff, -1px 0 0 #ffffff, 0 -1px 0 #ffffff',
            renderOrder: RenderOrder.space,
            textMaxWidth: '120px',
            priority: 0
        },
        hover: {
            show: true,
            textShow: true,
            joinCollide: false,
            cssName: 'hover',
            textColor: '#246FE5',
            iconbgColor: '#246FE5',
            svgFillColor: '#ffffff',
            textMaxWidth: 'none',
            renderOrder: 500,
            opacity: 1,
            priority: 600
        },
        selected: {
            show: true,
            textShow: true,
            joinCollide: false,
            cssName: 'selected',
            opacity: 1,
            textColor: '#246FE5',
            iconbgColor: '#246FE5',
            svgFillColor: '#ffffff',
            textMaxWidth: 'none',
            renderOrder: 1000,
            priority: 650
        },
        relModeShow: {
            opacity: 0.3,
            priority: 210
        },
        isRelObject: {
            opacity: 1,
            joinCollide: false,
            priority: 220
        },
        collided: {
            show: false,
            priority: 205
        }
    };

    // 200 - 600区间
    if (type === 'SapcetypeTemperature' || type === 'SapcetypeCO2' || type === 'SpaceTypeHumidity') {
        return { ...defaultStyles, ...sapcetypeTemperatureStyles(), ...sapcetypeCO2Styles(), ...spaceTypeHumidityStyles() };
    }
    if (type === 'SpaceStrategyDemand' || type === 'SpaceStrategyDispatch' || type === 'SpaceStrategyHumidity') {
        return { ...defaultStyles, ...spaceStrategyDemandStyles(), ...spaceStrategyDispatchStyles(), ...spaceStrategyHumidityStyles() };
    }
    if (airCrewIds?.includes(type)) {
        const style = {
            normal: {
                show: true,
                joinCollide: true,
                textColor: '#626c78',
                iconbgColor: '#ffffff',
                svgFillColor: '#ffffff',
                textShadow: '1px 0 0 #ffffff, 0 1px 0 #ffffff, -1px 0 0 #ffffff, 0 -1px 0 #ffffff',
                renderOrder: RenderOrder.space,
                textMaxWidth: '120px',
                priority: 0
            }
        };
        return { ...defaultStyles, ...style };
    }
};

// 空间
export const spaceStyles = (type, airCrewIds) => {
    const defaultStyles = {
        normal: {
            show: false,
            color: '#84B9E1',
            useAnimate: false,
            opacity: 0.8,
            colorMode: '',
            priority: 200
        },
        hover: {
            show: true,
            useAnimate: true,
            opacity: 1,
            colorMode: 'dark',
            priority: 600
        },
        active: {
            show: true,
            color: '#4FB2FF',
            priority: 500
        },
        grey: {
            show: true,
            color: '#DFE6EE',
            priority: 640
        },
        selected: {
            show: true,
            color: '#246FE5',
            opacity: 1,
            priority: 650
        },
        relModeShow: {
            opacity: 0.3,
            priority: 210
        },
        isRelObject: {
            opacity: 1,
            priority: 220
        },
        hide: {
            show: false,
            priority: null
        }
    };

    // 200 - 600区间
    if (type === 'SapcetypeTemperature' || type === 'SapcetypeCO2' || type === 'SpaceTypeHumidity') {
        return { ...defaultStyles, ...sapcetypeTemperatureStyles(), ...sapcetypeCO2Styles(), ...spaceTypeHumidityStyles() };
    }
    if (type === 'SpaceStrategyDemand' || type === 'SpaceStrategyDispatch' || type === 'SpaceStrategyHumidity') {
        return { ...defaultStyles, ...spaceStrategyDemandStyles(), ...spaceStrategyDispatchStyles(), ...spaceStrategyHumidityStyles() };
    }

    if (airCrewIds?.includes(type)) {
        const style = {
            normal: {
                show: true,
                color: '#CCCCCC',
                useAnimate: false,
                opacity: 0.8,
                colorMode: '',
                priority: 200
            }
        };
        return { ...defaultStyles, ...style };
    }
};

export const sapcetypeTemperatureStyles = () => {
    // 温度预测 tdb
    // 0在舒适区内,1超舒适区上限,2超过热门限,-1超舒适区下限,-2超温度过冷门限
    const temp = {
        tdbType0: {
            show: true,
            joinCollide: true,
            color: '#3FBE72',
            priority: 200
        },
        tdbType1: {
            show: true,
            joinCollide: true,
            color: '#FFAD33',
            priority: 200
        },
        tdbType2: {
            show: true,
            joinCollide: true,
            color: '#F55047',
            priority: 200
        },
        'tdbType-1': {
            show: true,
            joinCollide: true,
            color: '#61D5E5',
            priority: 200
        },
        'tdbType-2': {
            show: true,
            joinCollide: true,
            color: '#699BE9',
            priority: 200
        }
    };
    return temp;
};

export const spaceTypeHumidityStyles = () => {
    // 湿度预测 rh
    // 0在舒适区内,1超舒适区上限,2超过高门限,-1超舒适区下限,-2超过低门限
    const humidity = {
        humidityType0: {
            show: true,
            joinCollide: true,
            color: '#3FBE72',
            priority: 200
        },
        humidityType1: {
            show: true,
            joinCollide: true,
            color: '#FFAD33',
            priority: 200
        },
        humidityType2: {
            show: true,
            joinCollide: true,
            color: '#F55047',
            priority: 200
        },
        'humidityType-1': {
            show: true,
            joinCollide: true,
            color: '#61D5E5',
            priority: 200
        },
        'humidityType-2': {
            show: true,
            joinCollide: true,
            color: '#699BE9',
            priority: 200
        }
    };
    return humidity;
};

export const sapcetypeCO2Styles = () => {
    // CO2预测 cO2
    const cO2Type = {
        cO2Type0: {
            show: true,
            joinCollide: true,
            color: '#3FBE72',
            priority: 200
        },
        cO2Type1: {
            show: true,
            joinCollide: true,
            color: '#FFAD33',
            priority: 200
        },
        cO2Type2: {
            show: true,
            joinCollide: true,
            color: '#F55047',
            priority: 200
        }
    };

    return cO2Type;
};

export const spaceStrategyDemandStyles = () => {
    // 空间需求
    // acNeed空间是否有空调需求：0无，1有
    const acNeed = {
        acNeed1: {
            show: true,
            joinCollide: true,
            color: '#246FE5',
            priority: 200
        },
        acNeed0: {
            show: true,
            joinCollide: true,
            color: '#CCCCCC',
            priority: 200
        }
    };
    return acNeed;
};

export const spaceStrategyDispatchStyles = () => {
    const arr = getTemperatureCodeAndColor([17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29]);
    const dispatch = arr.reduce((pre, { code, color }) => {
        pre[`${code}`] = { color, priority: 200, show: true, joinCollide: true };
        return pre;
    }, {});
    return dispatch;
};

export const spaceStrategyHumidityStyles = () => {
    const arr = getHumidityCodeAndColor([...rangeGenerator(100, 0, 10)]);
    const dispatch = arr.reduce((pre, { code, color }) => {
        pre[`${code}`] = { color, priority: 200, show: true, joinCollide: true };
        return pre;
    }, {});
    return dispatch;
};
