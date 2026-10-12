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

export const equipIconInfoStyles = (innerStyles, objData, mode) => {
    return {
        normal: {
            ...innerStyles.normal,
            show: true,
            dotColor: '',
            joinCollide: true,
            showText: false,
            iconType: 'medium',
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
        abnormal: {
            dotColor: 'red',
            priority: 2810
        },
        overtime: {
            iconBgColor: '#E68600',
            priority: 2809
        },
        empty: {
            iconBgColor: '#3FBE72',
            priority: 2808
        },
        occupy: {
            iconBgColor: '#ECC00C',
            priority: 2807
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

export const spaceStyles = (innerStyles, objData, mode) => {
    return {
        normal: {
            show: true,
            color: '#84B9E1',
            useAnimate: false,
            opacity: 0.8,
            colorMode: '',
            priority: 20
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

export const customeBubblePrimStyles = (innerStyles, objData, mode) => {
    return {
        normal: {
            show: true,
            joinCollide: true,
            renderOrder: RenderOrder.bubble,
            opacity: 1
        },
        hover: {
            show: true,
            renderOrder: 60,
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
