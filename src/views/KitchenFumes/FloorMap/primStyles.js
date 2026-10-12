// @ts-ignore
import i18n from '@/localization';
import { useMapEqIconAnim } from '@/config';
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

const TEXT_SHADOW_STRING = '1px 0 0 #ffffff, 0 1px 0 #ffffff, -1px 0 0 #ffffff, 0 -1px 0 #ffffff';

export const equipIconInfoStyles = (innerStyles, objData, mode) => {
    return {
        normal: {
            ...innerStyles.normal,
            show: true,
            dotColor: '',
            joinCollide: true,
            showText: true,
            iconType: 'medium',
            iconBgColor: '#8B949E',
            renderOrder: RenderOrder.equip,
            textMaxWidth: '120px',
            priority: 0,
            opacity: 1
        },
        filterHide: {
            show: false,
            joinCollide: false,
            priority: 1000
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
            textMaxWidth: 'none',
            textShadow: '',
            textBgColor: '#246FE5',
            textBorder: '1px solid #fff',
            renderOrder: 65,
            iconColor: '#fff',
            iconBgColor: '#246FE5',
            iconBorderColor: 'rgba(255, 255, 255, 0.70)',
            priority: 2901
        },
        abnormal: {
            dotColor: 'red',
            priority: 2802
        },
        // 关闭
        closed: {
            textColor: '#1B2129', // 字体颜色
            textShadow: TEXT_SHADOW_STRING, // 字体描边
            textBgColor: '', // 文字背景
            textBorder: '',
            iconBgColor: '#424C59', // 图标背景
            priority: RenderOrder.equip + 2,
            renderOrder: RenderOrder.equip + 1
        },
        // 开启
        opened: {
            textColor: '#1B2129', // 字体颜色
            textShadow: TEXT_SHADOW_STRING, // 字体描边
            textBgColor: '', // 文字背景
            textBorder: '',
            iconBgColor: '#09B3B5', // 图标背景
            runStatusAnimate: useMapEqIconAnim,
            priority: RenderOrder.equip + 2,
            renderOrder: RenderOrder.equip + 1
        },
        // 在线
        online: {
            textColor: '#1B2129', // 字体颜色
            textShadow: TEXT_SHADOW_STRING, // 字体描边
            iconBgColor: '#64a6f7',
            textBgColor: '', // 文字背景
            textBorder: '',
            priority: RenderOrder.equip + 2,
            renderOrder: RenderOrder.equip + 2
        },
        // 离线
        offline: {
            textColor: '#1B2129', // 字体颜色
            textShadow: TEXT_SHADOW_STRING, // 字体描边
            textBgColor: '', // 文字背景
            textBorder: '',
            dotColor: '#C4C9CF',
            priority: RenderOrder.equip + 2,
            renderOrder: RenderOrder.equip + 2
        },
        // 控反不一致
        orderFail: {
            textColor: '#ffffff', // 字体颜色
            textShadow: '', // 字体描边
            textBgColor: '#FFB800', // 文字背景
            textBorder: '1px solid #fff',
            dotColor: '#FFB800',
            priority: RenderOrder.equip + 5,
            renderOrder: RenderOrder.equip + 4
        },
        // 异常和控反不一致
        abnormalOrderFail: {
            textColor: '#ffffff', // 字体颜色
            textShadow: '', // 字体描边
            textBgColor: '#F55047', // 文字背景
            textBorder: '1px solid #fff',
            dotColor: '#F55047,#FFB800',
            priority: RenderOrder.equip + 6,
            renderOrder: RenderOrder.equip + 5
        },
        relModeShow: {
            show: true,
            opacity: 0.5,
            priority: 2001
        },
        isRelObject: {
            opacity: 1,
            joinCollide: false,
            priority: 2002
        },
        collided: {
            // show: true,
            showText: false,
            priority: 100
        }
    };
};

export const spaceStyles = (innerStyles, objData, mode) => {
    return {
        normal: {
            show: true,
            color: '#CACFD4',
            useAnimate: false,
            opacity: 0.8,
            colorMode: '',
            priority: 20
        },
        open: {
            show: true,
            color: '#9BD6DE',
            useAnimate: false,
            opacity: 0.8,
            colorMode: '',
            priority: 40
        },
        close: {
            show: true,
            color: '#EDD4A1',
            useAnimate: false,
            opacity: 0.8,
            colorMode: '',
            priority: 40
        },
        hover: {
            show: true,
            useAnimate: true,
            opacity: 1,
            colorMode: 'dark',
            priority: 60
        },
        active: {
            show: true,
            color: '#4FB2FF',
            priority: 50
        },
        grey: {
            show: true,
            color: '#DFE6EE',
            priority: 64
        },
        selected: {
            show: true,
            color: '#246FE5',
            opacity: 1,
            priority: 65
        },
        relModeShow: {
            opacity: 0.3,
            priority: 21
        },
        isRelObject: {
            opacity: 1,
            priority: 22
        },
        hide: {
            show: false,
            priority: null
        }
    };
};
export const spaceIconInfoStyles = (innerStyles, objData, mode) => {
    return {
        normal: {
            show: true,
            joinCollide: true,
            iconbgColor: '#ffffff',
            svgFillColor: '#ffffff',
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
            priority: 2549
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
            priority: 2500
        },
        relModeShow: {
            opacity: 0.3,
            priority: 2001
        },
        isRelObject: {
            opacity: 1,
            joinCollide: false,
            priority: 2002
        },
        collided: {
            show: false,
            priority: 100
        }
    };
};
