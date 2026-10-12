/* eslint-disable complexity */
/* eslint-disable eqeqeq */
import { createDom } from '../../utils/d2Utils';
import { isUndefined } from 'lodash';
import i18n from '@/localization';
export const generateAbstractCardHtml = (abstractData, models) => {
    const { demandInfo, name, localName, model3DMvcRef } = abstractData;
    let listStr;
    if (demandInfo) {
        // 空间品质 - 色值： 10-目标值 ，11-上限值、12、蓄冷值、13-下限值、14-蓄热值
        listStr = `<div class="content-list"><div class="header">
        <span  style="margin-right:12px;">${demandInfo.localName || '--'}</span>
        <span class="dis_header_red" style="display:${demandInfo.upperLimit == true && abstractData.tabType != 'dispatchMonitoring' ? 'flex' : 'none'}">${
            demandInfo.upperLimit == true ? '超上限' : null
        }</span>
        <span class="dis_header_red" style="display:${demandInfo.lowerLimit == true && abstractData.tabType != 'dispatchMonitoring' ? 'flex' : 'none'}">${
            demandInfo.lowerLimit == true ? '超下限' : null
        }</span>
        <span class="dis_header_red" style="display:${demandInfo.offsetTarget == true && abstractData.tabType != 'dispatchMonitoring' ? 'flex' : 'none'}">${
            demandInfo.offsetTarget == true ? '超目标时长' : null
        }</span>
        <span class="dis_header_background" style="color:#0C9B4A;background:#DAF7E1;display:${
            abstractData.tabType == 'dispatchMonitoring' && demandInfo.tdbCurrentValueType == '10' ? 'flex' : 'none'
        };">目标值</span>
        <span class="dis_header_background" style="color:#E68600;background:#FFF0CC;display:${
            abstractData.tabType == 'dispatchMonitoring' && demandInfo.tdbCurrentValueType == '11' ? 'flex' : 'none'
        };">上限值</span>
        <span class="dis_header_background" style="color:#0C9B4A;background:#DAF7E1;display:${
            abstractData.tabType == 'dispatchMonitoring' && abstractData.carbonCurrentValueType == '10' ? 'flex' : 'none'
        };">目标值</span>
        <span class="dis_header_background" style="color:#E68600;background:#FFF0CC;display:${
            abstractData.tabType == 'dispatchMonitoring' && abstractData.carbonCurrentValueType == '11' ? 'flex' : 'none'
        };">上限值</span>
        <span class="dis_header_background" style="color:#00A2A7;background:#CBF7F3;display:${
            abstractData.tabType == 'dispatchMonitoring' && demandInfo.tdbCurrentValueType == '13' ? 'flex' : 'none'
        };">${i18n.global.t('meos_control_web.lower_limit_value')}</span>
        <span class="dis_header_background" style="color:#00A2A7;background:#CBF7F3;display:${
            demandInfo.season == 'ACSeason-2' && demandInfo.tdbCurrentValueType == '12' && demandInfo.unit != 'ppm' ? 'flex' : 'none'
        }">${demandInfo.offsetTarget == true ? '蓄冷值' : null}</span>
        <span class="dis_header_background" style="color:#E68600;background:#FFF0CC;display:${
            demandInfo.season == 'ACSeason-1' && demandInfo.tdbCurrentValueType == '14' && demandInfo.unit != 'ppm' ? 'flex' : 'none'
        }">${demandInfo.offsetTarget == true ? '蓄热值' : null}</span>
        </div>`;
        listStr += `<div class="solid-gap"></div>`;
        listStr += '<div class="iot-container">';
        listStr += `<span class="iot-tag" style="display:${abstractData.tabType != 'dispatchMonitoring' ? 'inline-block' : 'none'}">${
            demandInfo.unit != 'ppm' ? '实时温度：' : '实时CO₂：'
        }${demandInfo.currentData ? demandInfo.currentData + demandInfo.unit : '--'}</span>`;
        listStr += `<span class="iot-tag" style="display:${abstractData.tabType == 'dispatchMonitoring' && demandInfo.unit == 'ppm' ? 'inline-block' : 'none'}">${
            demandInfo.unit != 'ppm' ? '目标温度：' : '目标CO₂：'
        }${demandInfo.carbonCurrentValue ? demandInfo.carbonCurrentValue + 'ppm' : '--'}</span>`;
        listStr += `<span class="iot-tag" style="display:${abstractData.tabType == 'dispatchMonitoring' && demandInfo.unit != 'ppm' ? 'inline-block' : 'none'}">${
            demandInfo.unit != 'ppm' ? '目标温度：' : '目标CO₂：'
        }${demandInfo.targetData ? demandInfo.targetData + '℃' : '--'}</span>`;

        listStr += `<span class="iot-tag" style="display:${abstractData.tabType != 'dispatchMonitoring' ? 'inline-block' : 'none'}">${
            demandInfo.unit != 'ppm' ? '目标温度：' : '目标CO₂：'
        }${demandInfo.targetData ? demandInfo.targetData + demandInfo.unit : '--'}</span>`;
        listStr += `<span class="iot-tag" style="display:${abstractData.tabType != 'dispatchMonitoring' && demandInfo.unit == 'ppm' ? 'inline-block' : 'none'}">上限CO₂：${
            demandInfo.upperData ? demandInfo.upperData + demandInfo.unit : '--'
        }</span>`;

        listStr += `<span class="iot-tag" style="display:${
            abstractData.tabType != 'dispatchMonitoring' && demandInfo.season == 'ACSeason-1' && demandInfo.unit != 'ppm' ? 'inline-block' : 'none'
        }">上限温度：${demandInfo.upperData ? demandInfo.upperData + demandInfo.unit : '--'}</span>`;
        listStr += `<span class="iot-tag" style="display:${
            abstractData.tabType != 'dispatchMonitoring' && demandInfo.season == 'ACSeason-2' && demandInfo.unit != 'ppm' ? 'inline-block' : 'none'
        }">${i18n.global.t('meos_control_web.lower_limit_temperature')}${demandInfo.lowerData ? demandInfo.lowerData + demandInfo.unit : '--'}</span>`;
        listStr += `<span class="iot-tag" style="display:${
            abstractData.tabType != 'dispatchMonitoring' && demandInfo.offsetTarget == true ? 'inline-block' : 'none'
        };">偏离目标持续时长：${
            !isUndefined(demandInfo.offsetTargetTime)
                ? demandInfo.offsetTargetTime / 60 + i18n.global.t('meos_control_web.hour')
                : 0 + i18n.global.t('meos_control_web.hour') || '--'
        } (${i18n.global.t('meos_control_web.less_than_hour', { num: demandInfo.continuousScheduledHour })})</span>`;
        listStr += '</div>';
        // listStr += `<div class="content">${demandInfo.name || '--'}</div>`;
        // listStr += '</div>';
    } else {
        listStr = '<div class="no-data">' + i18n.global.t('meos_control_web.data_not_yet_acquired') + '</div>';
    }
    const $dom = createDom({
        tagName: 'div',
        classList: ['abstract-card'],
        innerHTML: `${listStr}`,
        style: { pointerEvents: 'none', display: 'block' }
    });
    return $dom;
};
