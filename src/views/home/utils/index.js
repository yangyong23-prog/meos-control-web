import i18n from '@/localization';
export const majorType = [
    { label: i18n.global.t('meos_control_web.high_voltage'), code: 'SE', url: new URL(`@/assets/svg/home/SE.svg`, import.meta.url).href },
    { label: i18n.global.t('meos_control_web.hvac'), code: 'AC', url: new URL(`@/assets/svg/home/AC.svg`, import.meta.url).href },
    { label: i18n.global.t('meos_control_web.low_voltage'), code: 'WE', url: new URL(`@/assets/svg/home/WE.svg`, import.meta.url).href },
    { label: i18n.global.t('common.elevator'), code: 'EL', url: new URL(`@/assets/svg/home/EL.svg`, import.meta.url).href },
    { label: i18n.global.t('meos_control_web.lighting'), code: 'LT', url: new URL(`@/assets/svg/home/LT.svg`, import.meta.url).href },
    { label: i18n.global.t('meos_control_web.fire_protection'), code: 'FF', url: new URL(`@/assets/svg/home/FF.svg`, import.meta.url).href },
    { label: i18n.global.t('common.security'), code: 'SP', url: new URL(`@/assets/svg/home/SP.svg`, import.meta.url).href },
    { label: i18n.global.t('common.water_supply_and_drainage'), code: 'WS', url: new URL(`@/assets/svg/home/WS.svg`, import.meta.url).href },
    { label: i18n.global.t('meos_control_web.gas'), code: 'FG', url: new URL(`@/assets/svg/home/FG.svg`, import.meta.url).href },
    { label: i18n.global.t('meos_control_web.civil_works'), code: 'CF', url: new URL(`@/assets/svg/home/CF.svg`, import.meta.url).href },
    { label: i18n.global.t('meos_control_web.others'), code: 'MR', url: new URL(`@/assets/svg/home/MR.svg`, import.meta.url).href }
];
export const getSvgByCode = code => {
    let codeStr = code ? code : 'MR';
    const findItem = majorType.find(res => res.code === codeStr || res.label.includes(codeStr));
    return findItem?.url || new URL(`@/assets/svg/home/MR.svg`, import.meta.url).href;
};

export const getNameByCode = code => {
    if (!code) return '--';
    const findItem = majorType.find(res => res.code === code || res.label.includes(code));
    return findItem?.label || '--';
};

export const getCardItemList = children => {
    const list = [];
    if (children instanceof Array && children.length > 0) {
        children.forEach(res => {
            if (res.children && res.children instanceof Array) {
                list.push(...res.children);
            }
        });
    }
    return list;
};
export const getAnchorList = moduleList => {
    return moduleList.map(res => {
        return {
            label: res.label,
            id: res.label
        };
    });
};
