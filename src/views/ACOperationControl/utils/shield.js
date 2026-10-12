import { IS_SHIELD } from '@/utils/globalVariables';

const getRelSetInfoCode = showStyle => {
    if (!showStyle) {
        return '';
    }

    let showStyleObj = {};
    try {
        showStyleObj = JSON.parse(showStyle);
    } catch (error) {
        console.error('showStyle parse error', error);
    }

    return showStyleObj?.relSet || '';
};

export const isSpaceEnvShielded = (spaceId, valObj, getIotData) => {
    const relSetInfoCode = getRelSetInfoCode(valObj?.showStyle);
    if (!relSetInfoCode) {
        return false;
    }

    const shieldObj = getIotData(spaceId, relSetInfoCode);
    return shieldObj?.dataValue === IS_SHIELD;
};
