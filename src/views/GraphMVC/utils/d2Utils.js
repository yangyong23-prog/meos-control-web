import * as aimIcon from 'aim-vue-icon';
import { FloorEquipIconColor, FloorSpaceIconColor } from '@/views/GraphMVC/config/color/FloorIconConfig';
import { createVNode, render } from 'vue';
import i18n from '@/localization';
import { getGlobalVueInstance } from '@/vueInstance';

export const createDom = ({ tagName, classList, innerHTML, appendTo, style }) => {
    const $dom = document.createElement(tagName);
    if (innerHTML) {
        $dom.innerHTML = innerHTML;
    }
    if (classList && classList.length) {
        $dom.classList.add(...classList);
    }
    if (appendTo) {
        appendTo.appendChild($dom);
    }
    Object.assign($dom.style, style);
    return $dom;
};

export const vueApp = (component, props, rootMedia, syncContext = false) => {
    let container = document.createElement('div');
    if (!component) {
        return render(null, container);
    }
    //2、创造虚拟节点
    const app = createVNode(component, props);
    if (syncContext) {
        const context = getGlobalVueInstance()._instance.appContext;
        app.appContext = context;
    }
    //3、将虚拟节点创造成真实DOM
    render(app, container);
    // 不使用props的方式传递rootMedia，防止循环引用
    // 1.在vue中可通过 getCurrentInstance 获取当前实例，从而获取到rootMedia
    // 2.props传递函数，不传入rootMedia到vue中，内部使用emit触发
    app.component.rootMedia = rootMedia;

    const setProps = (key, value) => {
        app.component.props[key] = value;
    };

    const dispose = () => {
        app.component.rootMedia = null;
        render(null, container);
        if (container.firstElementChild) container.removeChild(container.firstElementChild);
        container = null;
    };
    return {
        getDom: () => container.firstElementChild,
        setProps,
        dispose,
        app
    };
};

let helpCanvas = null,
    helpCanvasContext = null;
export const getTextWith = (text, fontStyle) => {
    if (!helpCanvas || !helpCanvasContext) {
        helpCanvas = document.createElement('canvas');
        helpCanvasContext = helpCanvas.getContext('2d');
    }
    helpCanvasContext.font = fontStyle || '14px serif'; // 设置字体样式，当然，也可以在这里给一个默认值
    const dimension = helpCanvasContext.measureText(text);
    return dimension.width;
};

export const equipIcon = (classCode, scene, size, color) => {
    // 特殊图标按照类编码获取，能获取到就是特殊设备
    if (aimIcon[`Iconaim${classCode}${scene}`]) {
        return aimIcon[`Iconaim${classCode}${scene}`]({ size, color });
    }
    // 图标按照专业获取
    const marjorId = classCode.slice(0, 2);
    if (aimIcon[`Iconaim${marjorId}${scene}`]) {
        return aimIcon[`Iconaim${marjorId}${scene}`]({ size, color });
    }
    return aimIcon[`Iconaim${marjorId}placeholder`] ? aimIcon[`Iconaim${marjorId}placeholder`]({ size, color }) : '';
};

export const spaceIcon = (treeCode, scene, size, color) => {
    const numberStr = treeCode ? treeCode.replace(/[-,.]/g, '') : '';
    if (aimIcon[`Iconaim${numberStr}${scene}`]) {
        return aimIcon[`Iconaim${numberStr}${scene}`]({ size, color });
    }
    return null;
};

export const equipIconBackgroundColor = classCode => {
    const marjorId = classCode.slice(0, 2);
    const color = FloorEquipIconColor[marjorId];
    return color || '#15ae55';
};
export const parseMajorIdByClassCode = classCode => classCode.slice(0, 2);
export const spaceIconBackgroundColor = treeCode => {
    const color = FloorSpaceIconColor[treeCode];
    return color || '#8b949e';
};
