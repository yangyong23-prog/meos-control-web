<template>
    <div class="set-value-box wh100">
        <SetDiv v-bind="$attrs" @click="click">
            {{ name }}
            <SetIntervene v-if="data.additionalMapValue?.recoveryDateTime" v-bind="$attrs" @intervene-click="interveneClick" />
        </SetDiv>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import SetDiv from '@/components/common/SetDiv.vue';
import { getValueStr } from '@/utils/viewUtils';
import SetIntervene from './SetIntervene.vue';
import { openControlFormKey, openRecoveryDateTimeControlFormKey, openReleaseInterventionControlFormKey } from '../../hooks/useControlHook';
import { isEmptyNoReturn } from '@/utils/tools';
const openControlForm = inject(openControlFormKey);
const openRecoveryDateTimeControlFormFn = inject(openRecoveryDateTimeControlFormKey);
const openReleaseInterventionControlFormFn = inject(openReleaseInterventionControlFormKey);

const props = defineProps({
    data: {
        type: Object,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    value: {
        type: String,
        default: ''
    }
});
/**
 * 计算属性：根据不同的条件返回对应的名称值
 *
 * @returns {string} 返回计算后的名称字符串
 *                  - 当value为空时返回'设置'
 *                  - 当dataSource存在且有匹配的code时返回对应name
 *                  - 否则返回getValueStr函数处理后的结果
 */
const name = computed(() => {
    // 如果value为空则返回默认值'设置'
    if (isEmptyNoReturn(props.value)) {
        return i18n.global.t('meos_control_web.settings');
    }
    // 如果dataSource存在且有数据，则查找匹配的code并返回对应name
    if (props.data?.dataSource?.length) {
        return props.data?.dataSource.find(item => item.code === props.value)?.name || '';
    }
    // 默认情况下返回getValueStr函数处理的结果
    return getValueStr(props.data).text;
});
const click = e => {
    console.log(props.data);

    openControlForm({ el: e, data: { ...props.data, id: props.id }, needSelfComponent: true });
};
const interveneClick = (e, type) => {
    if (type === 'time') {
        openRecoveryDateTimeControlForm(e);
    } else {
        openReleaseInterventionControlForm(e);
    }
};
const openRecoveryDateTimeControlForm = e => {
    openRecoveryDateTimeControlFormFn({ el: e, data: { ...props.data, id: props.id } });
};
const openReleaseInterventionControlForm = e => {
    openReleaseInterventionControlFormFn({ el: e, data: { ...props.data, id: props.id } });
};
</script>
<style lang="less" scoped>
.set-value-box {
    :deep(.set-div) {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
    }
}
</style>
