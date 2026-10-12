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
    <m-form-item v-if="params.reason.includes('OTHER') || params.reason.includes('50')" label="" prop="content" :rules="rules.content">
        <m-input
            v-model="params.content"
            type="textarea"
            :placeholder="i18n.global.t('meos_control_web.please_input_specific_reason')"
            :width="240"
            :height="70"
            :maxlength="{ length: 200, errorText: '' }"
            show-word-limit
        />
    </m-form-item>
</template>

<script lang="ts" setup>
// @ts-ignore
import { EMPTYTEXT } from '@/utils/globalVariables';
// @ts-ignore
import { IOTObject } from '@/views/systemDiagram/types';
import { toNumber } from 'lodash';
import { Ref } from 'vue';
// @ts-ignore
import i18n from '@/localization';
const params: Ref<{ content: string; reason: string; max: string; min: string }> = inject('params', ref({ content: '', reason: '', max: '', min: '' }));
const rules = ref({
    reason: [{ required: true, message: EMPTYTEXT, trigger: 'change' }],
    content: [
        { required: true, message: EMPTYTEXT, trigger: 'blur' },
        { max: 200, message: i18n.global.t('meos_control_web.max_200_chars'), trigger: ['blur', 'change'] }
    ]
});
const currentInfoCodeObject: Ref<IOTObject> = inject('currentInfoCodeObject')!;
const text = computed(() => {
    const options = [...(currentInfoCodeObject.value?.addOptions || []), ...(currentInfoCodeObject.value?.reduceOptions || [])];
    const title = options.find(item => item.id === params.value.reason)?.title || '';
    return title;
});
const showAdd = computed(() => {
    let reality = 0,
        setNum = 0;
    reality = currentInfoCodeObject.value.actualMax!;
    setNum = toNumber(params.value.max);
    if (currentInfoCodeObject.value.infoCode === 'runStatus' && currentInfoCodeObject.value.dataValue === '1') {
        return '-';
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
