<template>
    <m-form-item :label="data.infoCodeName" class="cooler-set" :rules="rules" style="--m-form-item-margin: 0">
        <template v-if="params[data.infoCode]?.length === 1">
            <m-form-item
                v-for="item in params[data.infoCode]"
                :key="item.infoCode"
                :item-model="item.infoCodeValue"
                class="cooler-select"
                :rules="[{ required: data.required, type: 'number', message: EMPTYTEXT, trigger: [] }]"
                :prop="item.infoCode"
            >
                <div class="fc w100">
                    {{ data.chillerData?.[data.infoCode + id] }}
                    <m-tips theme="darkTransparent" :disabled="!lockStatus" :content="i18n.global.t('meos_control_web.dual_mode_chiller_count_locked')" placement="top">
                        <m-input-number
                            v-model="item.infoCodeValue"
                            :disabled="lockStatus"
                            text-align="left"
                            controls="rightButton"
                            width="100%"
                            :precision="0"
                            :max="data.chillerData?.[data.infoCode + data.id]?.[item.coolerType?.id] || 0"
                            :min="0"
                        >
                            <template #suffix> {{ i18n.global.t('common.tai') }} </template>
                        </m-input-number>
                    </m-tips>
                </div>
            </m-form-item>
        </template>
        <template v-else>
            <m-form-item
                v-for="item in params[data.infoCode]"
                :key="item.infoCode"
                :item-model="item.infoCodeValue"
                class="cooler-select"
                :style="`width: ${params[data.infoCode]?.length > 2 ? '33.33%' : '50%'}`"
                :rules="rules"
                :prop="item.infoCode"
            >
                <div class="fc w100">
                    <m-tips theme="darkTransparent" :disabled="!lockStatus" :content="i18n.global.t('meos_control_web.dual_mode_chiller_count_locked')" placement="top">
                        <div class="fc" style="flex: 1">
                            <m-select
                                v-model="item.infoCodeValue"
                                clearable
                                :disabled="lockStatus"
                                :options="getOptions(item.coolerType?.id)"
                                menu-size="min"
                                size="auto"
                            ></m-select>
                        </div>
                    </m-tips>
                    <span style="margin: 0 6px"> {{ item.coolerType?.shortName || item.coolerType?.name }}</span>
                </div>
            </m-form-item>
        </template>
    </m-form-item>
</template>

<script setup>
import i18n from '@/localization';
import DockSingleton from '@/hooks/responsiveDock';
import { orderBy } from 'lodash';
import { EMPTYTEXT } from '@/utils/globalVariables';
const { getIotData } = DockSingleton.getInstance();

// 定义组件的 props
const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    },
    controlListData: {
        type: Array,
        default: () => []
    },
    params: {
        type: Object,
        default: () => ({})
    }
});

// 定义表单验证规则
const rules = ref([{ required: props.data.required, message: EMPTYTEXT, trigger: [] }]);
/**
 * 获取选项列表
 * @param {string} key - 冷机类型的 ID
 * @returns {Array} 选项列表
 */
const getOptions = key => {
    const num = props.data.chillerData?.[props.data.infoCode + props.data.id]?.[key];
    let arr = [];
    if (num) {
        arr = Array.from({ length: num }, (_, i) => {
            return { id: `${i + 1}`, name: `${i + 1}` };
        });
    }
    return [{ id: '0', name: '0' }, ...arr];
};

/**
 * 设置冷机参数数据
 */
const setCoolerParamsData = () => {
    const data = [...props.data.controlListData];
    props.data.controlListData.forEach(item => {
        item.pumpGroups?.forEach(pumpGroup => {
            if (pumpGroup.pumpGroupInfoCodes) {
                data.push(...pumpGroup.pumpGroupInfoCodes);
            }
        });
        if (item.pumpGroupInfoCodes) {
            data.push(...item.pumpGroupInfoCodes);
        }
    });
    let foundItem = data.find(item => item.infoCode === props.data.infoCode && item.id === props.data.id);

    if (foundItem) {
        const arr = structuredClone(foundItem.unitsNumberSetValue || []);
        arr.forEach(item => {
            item.infoCodeValue = props.isClear ? '' : getIotData(props.data.id, item.infoCode).dataValue;
        });
        props.params[props.data.infoCode] = orderBy(arr, ['order'], 'asc');
    }
};
const lockStatus = computed(() => {
    if (props.data.lockStatus) {
        const lock = getIotData(props.data.id, props.data.lockStatus?.infoCode);
        return props.data.isLock(lock);
    }
    return false;
});
// 初始化冷机参数数据
onMounted(() => {
    if (props.params && props.data.infoCode) {
        setCoolerParamsData();
    } else {
        console.error('Params or infoCode is not defined');
    }
});
</script>

<style lang="less" scoped>
.cooler-select {
    width: 100%;
    :deep(.m-select-wrap) {
        width: 100%;
        .m-select {
            width: 100%;
        }
        .m-select-inner {
            width: 100% !important;
            min-width: 100%;
            .m-select-inner-value {
                width: auto;
            }
        }
    }
}
</style>
