<template>
    <div class="light-group-new-content">
        <div class="top-filter-wrap">
            <m-form ref="MFormRef" label-width="80px" :rules="rules" :model="params" class="light-group-form" inline>
                <m-form-item class="light-group-name-input" :label="i18n.global.t('meos_control_web.goupname')" prop="groupName">
                    <m-tips :content="i18n.global.t('meos_control_web.preview_status_not_operable')" :disabled="!isPreview" trigger="hover" theme="darkTransparent">
                        <m-input v-model="params.groupName" :disabled="isPreview" :maxlength="30" @input="onKeyPress" @clear="onKeyPress"> </m-input>
                    </m-tips>
                </m-form-item>
                <m-form-item label-width="68px" class="light-group-purpose-input" :label="i18n.global.t('meos_control_web.group_purpose')" prop="purpose">
                    <m-tips :content="i18n.global.t('meos_control_web.preview_status_not_operable')" :disabled="!isPreview" trigger="hover" theme="darkTransparent">
                        <m-input v-model="params.purpose" width="100%" :disabled="isPreview" :maxlength="50"> </m-input>
                    </m-tips>
                </m-form-item>
            </m-form>
        </div>
        <div class="lighting-group-content-layout">
            <leftTree :grid-data="gridData" :max-height="maxHeight"></leftTree>
            <rightTable :is-preview="isPreview" :disabled-modify="disabledModify" class="right-table"> </rightTable>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import leftTree from './leftTree.vue';
import rightTable from './rightTable.vue';
import useStore from '@/store';
import { trim } from 'lodash';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { checkGroupNameExists } from '@/apis/lightingRequirements';
import { activeFuncTypeKey } from '../../hooks/useLoopGroupHook';
import { curMenuIdKey } from '../../hooks/useGlobalData';
const { base } = useStore();
const MFormRef = ref();
const props = defineProps({
    gridData: {
        type: Array,
        default: () => []
    },
    isPreview: {
        type: Boolean,
        default: false
    },
    disabledModify: {
        type: Boolean,
        default: false
    },
    data: {
        type: Object,
        default: () => ({})
    },
    maxHeight: {
        type: String,
        default: ''
    }
});
const activeFuncType = inject(activeFuncTypeKey, ref());
const templateType = inject(curMenuIdKey);
const params = inject('lightGroupFormParams');
const validateGroupName = (rule, value, callback) => {
    console.log(activeFuncType);
    if (trim(value)) {
        checkGroupNameExists({
            id: props.data.id,
            templateType: templateType.value,
            groupName: value,
            tag: activeFuncType?.value?.code
        }).then(res => {
            if (res.code === SUCCESSCODE) {
                if (res.data) {
                    callback(new Error(i18n.global.t('meos_control_web.group_name_unique_under_same_function_type')));
                } else {
                    callback();
                }
            } else {
                callback(new Error(i18n.global.t('meos_control_web.interface_error')));
            }
        });
    } else {
        callback(new Error(i18n.global.t('meos_control_web.input_required_check_error_4')));
    }
};
const onKeyPress = val => {
    nextTick(() => {
        params.groupName = trim(val);
    });
};
const validataForm = callback => {
    MFormRef.value.validate((valid, error) => {
        callback(valid, error);
    });
};
const rules = ref({
    groupName: [
        {
            required: true,
            message: i18n.global.t('meos_control_web.input_required_check_error_4'),
            trigger: 'blur',
            transform: function (value) {
                return value.trim();
            }
        },
        {
            validator: validateGroupName,
            trigger: ['blur'],
            transform: function (value) {
                return value.trim();
            }
        }
    ]
});
defineExpose({
    validataForm
});
</script>
<style lang="less" scoped>
.m-form.m-form__inline.light-group-form {
    display: flex;
    .m-form-item.light-group-name-input {
        margin-right: 24px;
    }
    .m-form-item.light-group-purpose-input {
        flex-grow: 1;
        margin-right: 0;
    }
}

.light-group-new-content {
    .top-filter-wrap {
        padding: 16px 24px;
        height: 64px;
        display: block;
        border-bottom: 1px solid var(--gray-300);
    }
    .lighting-group-content-layout {
        height: calc(100% - 64px);
        width: 100%;
        position: relative;
        display: flex;
        .right-table {
            display: flex;
            flex-grow: 1;
            position: relative;
            flex-direction: column;
            max-width: calc(100% - 280px);
        }
    }
}
</style>
