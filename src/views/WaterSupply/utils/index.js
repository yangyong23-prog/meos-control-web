import { EQUIPS_CLASS_CODE_MAP } from '../constant/index';

export const filterEquipsClassCodes = equipsClassCodes => {
    const queryEquipsClassCodes = EQUIPS_CLASS_CODE_MAP.map(v => v.classCode);
    const finalClassCodes = {};

    Object.entries(equipsClassCodes || {}).forEach(([classCode, ids]) => {
        if (queryEquipsClassCodes.includes(classCode)) {
            finalClassCodes[classCode] = ids;
        }
    });
    return finalClassCodes;
};
