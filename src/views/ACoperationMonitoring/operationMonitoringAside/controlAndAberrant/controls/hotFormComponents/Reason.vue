<template>
    <m-form-item class="reason" :label="i18n.global.t('meos_control_web.reason')" prop="reason" :rules="rules.reason">
        <m-select v-if="currentInfoCodeObject.options" v-model="params.reason" :options="currentInfoCodeObject.options" />
        <template v-else>
            <m-select v-model="params.reason">
                <template v-if="currentInfoCodeObject?.dataValue && params.data >= currentInfoCodeObject?.dataValue">
                    <m-option v-for="el in currentInfoCodeObject.addOptions" :key="el.id" :value="el.id" :label="el.name" />
                </template>

                <template v-if="currentInfoCodeObject?.dataValue && params.data < currentInfoCodeObject?.dataValue">
                    <m-option v-for="el in currentInfoCodeObject.reduceOptions" :key="el.id" :value="el.id" :label="el.name" />
                </template>

                <template v-if="!currentInfoCodeObject?.dataValue">
                    <m-option-group key="1" :label="i18n.global.t('meos_control_web.over_cooled')">
                        <m-option v-for="el in currentInfoCodeObject.addOptions" :key="el.id" :value="el.id" :label="el.name" />
                    </m-option-group>
                    <m-option-group key="1" :label="i18n.global.t('meos_control_web.over_heated')">
                        <m-option v-for="el in currentInfoCodeObject.reduceOptions" :key="el.id" :value="el.id" :label="el.name" />
                    </m-option-group>
                </template>
            </m-select>
        </template>
    </m-form-item>
    <m-form-item v-if="params.reason.includes('OTHER')" label="" prop="content" :rules="rules.content">
        <m-input v-model="params.content" type="textarea" :placeholder="i18n.global.t('common.placeholder_input')" :width="240" :height="100" :maxlength="20" show-word-limit />
    </m-form-item>
    <m-form-item v-if="dataType !== 'TIME'" :label="i18n.global.t('common.remarks')" prop="remark">
        <m-input v-model="params.remark" type="textarea" :placeholder="i18n.global.t('common.placeholder_input')" :width="240" :height="100" :maxlength="100" show-word-limit />
    </m-form-item>
</template>

<script lang="ts" setup>
import { EMPTYTEXT } from '@/utils/globalVariables';
import { IOTObject } from '../types';
import { Ref } from 'vue';
// @ts-ignore
import i18n from '@/localization';
const params: Ref<{ content: string; reason: string; data: string; min: string; remark: string }> = inject(
    'params',
    ref({ content: '', reason: '', data: '', min: '', remark: '' })
);
const rules = ref({
    reason: [{ required: true, message: EMPTYTEXT, trigger: 'change' }],
    content: [
        { required: true, message: EMPTYTEXT, trigger: 'blur' },
        { max: 20, message: i18n.global.t('meos_control_web.max_20_chars'), trigger: ['blur', 'change'] }
    ]
});
const currentInfoCodeObject: Ref<IOTObject> = inject('currentInfoCodeObject')!;
const dataType: any = inject('dataType');
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
