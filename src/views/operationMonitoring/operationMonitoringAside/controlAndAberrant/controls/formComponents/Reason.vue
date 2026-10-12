<template>
    <m-form-item class="reason" :label="i18n.global.t('meos_control_web.reason_for_adjustment')" prop="reason" :rules="rules.reason">
        <m-select v-if="currentInfoCodeObject.options" v-model="params.reason" :options="currentInfoCodeObject.options" />
        <template v-else>
            <span class="reason-type">{{ text }}</span>
            <m-select v-model="params.reason" :class="{ 'reason-select': params.reason }">
                <m-option-group v-if="showAdd === '+' || showAdd === '='" key="1" :label="i18n.global.t('meos_control_web.add_unit')">
                    <m-option v-for="el in currentInfoCodeObject.addOptions" :key="el.id" :value="el.id" :label="el.name" />
                </m-option-group>
                <m-option-group v-if="showAdd === '-' || showAdd === '='" key="2" :label="i18n.global.t('meos_control_web.remove_unit')">
                    <m-option v-for="el in currentInfoCodeObject.reduceOptions" :key="el.id" :value="el.id" :label="el.name" />
                </m-option-group>
            </m-select>
        </template>
    </m-form-item>
    <m-form-item v-if="params.reason.includes('OTHER')" label="" prop="content" :rules="rules.content">
        <m-input
            v-model="params.content"
            type="textarea"
            :placeholder="i18n.global.t('meos_control_web.please_input_specific_reason')"
            :width="240"
            :height="100"
            :maxlength="{ length: 100, errorText: '' }"
            show-word-limit
        />
    </m-form-item>
</template>

<script lang="ts" setup>
// @ts-ignore
import i18n from '@/localization';
import { EMPTYTEXT } from '@/utils/globalVariables';
import { IOTObject } from '../types';
import { toNumber } from 'lodash';
import { Ref } from 'vue';
const params: Ref<{ content: string; reason: string; max: string; min: string }> = inject('params', ref({ content: '', reason: '', max: '', min: '' }));
const rules = ref({
    reason: [{ required: true, message: EMPTYTEXT, trigger: 'change' }],
    content: [
        { required: true, message: EMPTYTEXT, trigger: 'blur' },
        { max: 100, message: i18n.global.t('meos_control_web.max_100_chars'), trigger: ['blur', 'change'] }
    ]
});
const currentInfoCodeObject: Ref<IOTObject> = inject('currentInfoCodeObject')!;
console.log(currentInfoCodeObject, 'currentInfoCodeObject');
const RunningChillerData: any = inject('RunningChillerData');
const text = computed(() => {
    const options = [...(currentInfoCodeObject.value?.addOptions || []), ...(currentInfoCodeObject.value?.reduceOptions || [])];
    const title = options.find(item => item.id === params.value.reason)?.title || '';
    return title;
});
const coldNum: any = inject('coldNum');
const showAdd = computed(() => {
    let reality = 0,
        setNum = 0;
    if (coldNum) {
        if (coldNum.value.small_cooler === 0) {
            const { runningChillerLNum, runningChillerSNum } = RunningChillerData.value;
            reality = runningChillerLNum + runningChillerSNum;
            setNum = toNumber(params.value.max) + toNumber(params.value.min);
        } else {
            const { ratedCoolMax, ratedCoolMin, runningChillerLNum, runningChillerSNum } = RunningChillerData.value;
            reality = ratedCoolMax * runningChillerLNum + ratedCoolMin * runningChillerSNum;
            setNum = ratedCoolMax * toNumber(params.value.max) + ratedCoolMin * toNumber(params.value.min);
        }
        if (currentInfoCodeObject.value.infoCode === 'runStatus' && currentInfoCodeObject.value.dataValue === '1') {
            return '-';
        }
    }
    if (reality === setNum) {
        return '=';
    }
    return setNum < reality ? '-' : '+';
});
</script>
<style lang="less" scoped>
.reason {
    position: relative;
    &-type {
        position: absolute;
        z-index: 1;
        left: 8px;
        top: 6px;
    }
    :deep(.reason-select) {
        .m-select-inner {
            padding-left: 43px;
        }
    }
}
</style>
