import * as aimIcon from 'aim-vue-icon';
import { FloorEquipIconColor, FloorSpaceIconColor } from '../../color/FloorIconConfig';

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

export const parseMajorIdByClassCode = classCode => classCode.slice(0, 2);

export const equipIcon = (classCode, scene, size, color) => {
    // 特殊图标按照类编码获取，能获取到就是特殊设备
    if (aimIcon[`Iconaim${classCode}${scene}`]) {
        return aimIcon[`Iconaim${classCode}${scene}`]({ size, color });
    }
    // 图标按照专业获取
    const marjorId = parseMajorIdByClassCode(classCode);
    if (aimIcon[`Iconaim${marjorId}${scene}`]) {
        return aimIcon[`Iconaim${marjorId}${scene}`]({ size, color });
    }
    return aimIcon[`Iconaim${marjorId}placeholder`] ? aimIcon[`Iconaim${marjorId}placeholder`]({ size, color }) : '';
};

export const equipIconBackgroundColor = classCode => {
    const marjorId = parseMajorIdByClassCode(classCode);
    const color = FloorEquipIconColor[marjorId];
    return color || '#15ae55';
};

export const spaceIcon = (treeCode, scene, size, color) => {
    if (Object.keys(FloorSpaceIconColor).findIndex(o => o === treeCode) === -1) {
        return null;
    }
    const numberStr = treeCode ? treeCode.replace(/[-,.]/g, '') : '';
    if (aimIcon[`Iconaim${numberStr}${scene}`]) {
        return aimIcon[`Iconaim${numberStr}${scene}`]({ size, color });
    }
    return null;
};

export const spaceIconBackgroundColor = treeCode => {
    const color = FloorSpaceIconColor[treeCode];
    return color || '#8b949e';
};
