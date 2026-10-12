<template>
    <div v-for="(io, iv) in list" :key="iv" class="mt8" style="padding-left: 4px">
        <span class="fb7 f14 f-font">{{ formattedTime(io.strategyTime) }} </span>
        <div v-if="type !== 'AIR_TERMINAL_ZONE'">
            <span v-for="(it, idt) in io?.coolModes" :key="idt">
                <m-tag v-if="it === 'CHILLER_COOL'" color="#1B2129" bg-color="#E8ECF0" size="small" class="mr4 mt4">{{ i18n.global.t('meos_control_web.chiller_cooling') }}</m-tag>
                <m-tag v-if="it === 'DE_ICE_COOL'" color="#1B2129" bg-color="#E8ECF0" size="small" class="mr4 mt4">{{
                    i18n.global.t('meos_control_web.cold_discharge_cooling')
                }}</m-tag>
                <m-tag v-if="it === 'FREE_COOL'" color="#1B2129" bg-color="#E8ECF0" size="small" class="mr4 mt4">{{ i18n.global.t('meos_control_web.free_cooling_supply') }}</m-tag>
            </span>
        </div>
        <div v-for="(it, idt) in io?.pointInfos" :key="idt" class="ft f14 mt4 title-content">
            <span v-if="getFieldDefine(classCode, it?.chillerType)">
                <span> {{ getFieldDefine(classCode, it?.chillerType)?.name + '-' }}</span>
                <span v-if="!it.chillerM1Num && !it.chillerSNum">{{ it.chillerLNum }}{{ i18n.global.t('common.tai') }}</span>
                <span v-else-if="it.chillerLNum !== '--' || it.chillerM1Num !== '--' || it.chillerSNum !== '--'">
                    {{ it.chillerLNum && it.chillerLNum !== '--' ? it.chillerLNum + i18n.global.t('common.large') : ''
                    }}{{ it.chillerM1Num && it.chillerM1Num !== '--' ? it.chillerM1Num + i18n.global.t('common.mid') : ''
                    }}{{ it.chillerSNum && it.chillerSNum !== '--' ? it.chillerSNum + i18n.global.t('common.small') : '' }}</span
                >
            </span>
            <span v-for="(value, key) in it" :key="key">
                <span>{{ getTypeName(classCode, key, value) }}</span>
            </span>
            <span v-if="it?.coolMode && it?.coolMode === 'DE_ICE_COOL' && it.extendInfo">{{
                i18n.global.t('meos_control_web.cold_end', {
                    iceRatio: it.extendInfo.iceRatio
                })
            }}</span>
            <span v-if="it?.coolMode && it?.coolMode === 'FREE_COOL' && it.extendInfo">
                {{
                    i18n.global.t('meos_control_web.free_over_time', {
                        freeCoolTemp: it.extendInfo.freeCoolTemp
                    })
                }}
            </span>
            <span v-if="it?.sustainTime">
                , {{ i18n.global.t('meos_control_web.continuous_duration') }} {{ !isNaN(parseFloat(it?.sustainTime)) ? it?.sustainTime : '--'
                }}{{ i18n.global.t('meos_control_web.minute') }}</span
            >
        </div>
        <div v-for="(its, idts) in io?.objectInfos" :key="idts">
            <div v-if="its?.pointInfos?.length" class="mt4 mb4 f14">{{ its.localName }}</div>
            <div v-for="(it, idt) in its?.pointInfos" :key="idt" class="ft f14 mt4 title-content">
                <span v-if="getFieldDefine(its.classCode, it?.chillerType)">
                    <span> {{ getFieldDefine(its.classCode, it?.chillerType)?.name + '-' }}</span>
                    <span v-if="!it.chillerM1Num && !it.chillerSNum">{{ it.chillerLNum }}{{ i18n.global.t('common.tai') }}</span>
                    <span v-else-if="it.chillerLNum !== '--' || it.chillerM1Num !== '--' || it.chillerSNum !== '--'">
                        {{ it.chillerLNum && it.chillerLNum !== '--' ? it.chillerLNum + i18n.global.t('common.large') : ''
                        }}{{ it.chillerM1Num && it.chillerM1Num !== '--' ? it.chillerM1Num + i18n.global.t('common.mid') : ''
                        }}{{ it.chillerSNum && it.chillerSNum !== '--' ? it.chillerSNum + i18n.global.t('common.small') : '' }}</span
                    >
                </span>

                <span v-for="(value, key) in it" :key="key">
                    <span>{{ getTypeName(its.classCode, key, value) }}</span>
                </span>
                <span v-if="it?.coolMode && it?.coolMode === 'DE_ICE_COOL' && it.extendInfo">
                    {{
                        i18n.global.t('meos_control_web.cold_end', {
                            iceRatio: it.extendInfo.iceRatio
                        })
                    }}
                </span>
                <span v-if="it?.sustainTime">
                    , {{ i18n.global.t('meos_control_web.continuous_duration') }} {{ !isNaN(parseFloat(it?.sustainTime)) ? it?.sustainTime : '--'
                    }}{{ i18n.global.t('meos_control_web.minute') }}</span
                >
            </div>
        </div>
    </div>
</template>
<script setup>
import dayjs from 'dayjs';
import { codeDefineKey } from '../../hooks/useBaseHook';
import i18n from '@/localization';
import { dayTz } from '@/utils/dayjsTools';

const props = defineProps({
    list: {
        type: Array,
        default: () => []
    },
    type: {
        type: String,
        default: () => ''
    },
    classCode: {
        type: String,
        default: () => ''
    }
});
const formattedTime = time => {
    const currentDate = dayTz().format('YYYY-MM-DD');
    const combinedDateTime = `${currentDate} ${time}`;
    // 解析为 dayjs 对象并格式化
    return dayjs(combinedDateTime).format('HH:mm');
};
const codeDefine = inject(codeDefineKey);
console.log('codeDefine: ', props);
//温度名称
// const TEMPERATURE_NAME = {
//     chillWaterOutTempSet: '冷冻水供水温度',
//     chillWaterDetaTempSet: '冷冻水供回水温差',
//     chillWaterDetaPressSet: '冷冻水供回水压差',
//     worstTerminalDetaTempSet: '最不利末端供回水压差',
//     worstTerminalDetaPressSet: '最不利末端压差',
//     equipFreqSet: '设备频率'
// };
const getFieldDefine = (classCode, field) => {
    const classDefine = codeDefine.value[classCode];
    if (classDefine) {
        return classDefine[field];
    }
};
const SWITCH_VALUE = {
    OPEN: i18n.global.t('common.status_open'),
    CLOSE: i18n.global.t('common.status_close')
};
const getTypeName = (classCode, key, value) => {
    let name = '';
    const defineObj = getFieldDefine(classCode, key);

    if (defineObj) {
        const valText = SWITCH_VALUE[value] ? SWITCH_VALUE[value] : value;
        name = `${defineObj.name} ${valText ? valText : ''}${defineObj.unit ? defineObj.unit : ''}`;
    }

    return name;
};
</script>
<style scoped lang="less">
.title-content {
    line-height: 22px;
    position: relative;
    padding-left: 8px;
}
.title-content::before {
    content: ''; /* 使用content属性来创建伪元素 */
    position: absolute;
    left: 0; /* 圆圈位于容器的左侧 */
    top: 0.6em; /* 调整圆圈的垂直位置，以使其与基线对齐 */
    width: 4px; /* 圆圈的宽度 */
    height: 4px; /* 圆圈的高度 */
    border-radius: 50%; /* 使得圆角变为圆形 */
    background-color: #8b949e; /* 圆圈的颜色 */
}
:hover .title-icon {
    z-index: 1;
}
// 媒体查询 1440一下
@media screen and (max-width: 1440px) {
    .f-font {
        font-size: 12px;
    }
    .title-content {
        font-size: 12px;
    }
}
// 媒体查询 1440 以上
@media screen and (min-width: 1440px) {
    .f-font {
        font-size: 14px;
    }
    .title-content {
        font-size: 14px;
    }
}
</style>
