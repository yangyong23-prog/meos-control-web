// @ts-ignore
import i18n from '@/localization';
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
            iconBgColor: '#64a6f7',
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
        // 在线
        online: {
            textColor: '#1B2129', // 字体颜色
            textShadow: TEXT_SHADOW_STRING, // 字体描边
            iconBgColor: '#64a6f7',
            textBgColor: '', // 文字背景
            textBorder: '',
            priority: 100,
            renderOrder: RenderOrder.equip + 2
        },
        // 离线
        offline: {
            textColor: '#1B2129', // 字体颜色
            textShadow: TEXT_SHADOW_STRING, // 字体描边
            textBgColor: '', // 文字背景
            textBorder: '',
            dotColor: '#C4C9CF',
            priority: 100,
            renderOrder: RenderOrder.equip + 2
        },
        relModeShow: {
            opacity: 0.5,
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
