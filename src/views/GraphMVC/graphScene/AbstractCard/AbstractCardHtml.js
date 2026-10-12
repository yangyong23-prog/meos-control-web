import { createDom } from '../../utils/d2Utils';
import i18n from '../../../../localization';

export const generateAbstractCardHtml = abstractData => {
    const { floorId } = abstractData;
    let listStr;
    const $normalDom = createDom({
        tagName: 'div',
        classList: ['space-normal-dom']
    });
    listStr = `<span  class="filder ${abstractData.box?.isCustomizedSetting ? 'xz' : 'qx'} "></span><div style="margin:10px;">${i18n.global.t('meos_control_web.floor_num', {
        floor: floorId
    })}</div>`;
    const $dom1 = createDom({
        tagName: 'div',
        classList: ['abstract-card-div'],
        innerHTML: `${listStr}`,
        style: { pointerEvents: 'none', display: 'block' },
        appendTo: $normalDom
    });
    // eslint-disable-next-line one-var
    let divs = `<div class="space_popupprompt"><span class="space_popupprompt_h3">${i18n.global.t('meos_control_web.floor_num', { floor: floorId })}</span><span class="${
        abstractData.box?.isCustomizedSetting ? 'space_popupprompt_pz' : 'space_popupprompt_vpz'
    }">${abstractData.box?.isCustomizedSetting ? i18n.global.t('meos_control_web.already_configured') : i18n.global.t('meos_control_web.unconfiged')}</span></div>`;
    const $dom2 = createDom({
        tagName: 'div',
        classList: ['abstract-card-div'],
        innerHTML: `${divs}`,
        style: { pointerEvents: 'none', display: 'block' },
        appendTo: $normalDom
    });
    return $normalDom;
};
