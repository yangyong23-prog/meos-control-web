<template>
    <m-form-item :label="data.infoCodeName" class="cooler-set" :rules="rules" style="--m-form-item-margin: 0">
        <m-form-item
            v-for="item in params[data.infoCode]"
            :key="item.infoCode"
            :item-model="item.infoCodeValue"
            class="cooler-select"
            :style="`width: ${params[data.infoCode].length > 2 ? '33.33%' : '50%'}`"
            :rules="rules"
            :prop="item.infoCode"
        >
            <div class="fc w100">
                <m-tips theme="darkTransparent" :disabled="!lockStatus" :content="i18n.global.t('meos_control_web.dual_mode_chiller_count_locked')" placement="top">
                    <div class="fc w100">
                        <m-select v-model="item.infoCodeValue" clearable :disabled="lockStatus" :options="getOptions(item.coolerType?.id)" menu-size="min"></m-select>
                    </div>
                </m-tips>
                <span style="margin: 0 6px"> {{ item.coolerType?.shortName }}</span>
            </div>
        </m-form-item>
    </m-form-item>
</template>

<script setup>
import i18n from '@/localization';
import { paramsKey } from '@/views/ACAC/hooks/useSetFormHook';
import { chillerDataKey } from '@/views/ACAC/hooks/useBaseHook';
import DockSingleton from '@/hooks/responsiveDock';
import { orderBy } from 'lodash';
import { EMPTYTEXT } from '../../variables';
import { isLockV2 } from '@/components/SystemControl/config';
const { getIotData } = DockSingleton.getInstance();

// 定义组件的 props
const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    },
    id: {
        type: String,
        default: ''
    },
    controlListData: {
        type: Array,
        default: () => []
    },
    isClear: {
        type: Boolean,
        default: false
    }
});

// 注入依赖
const chillerData = inject(chillerDataKey);
const params = inject(paramsKey);

// 定义表单验证规则
const rules = ref([{ required: props.data.noRequired ? false : true, message: EMPTYTEXT, trigger: [] }]);
/**
 * 获取选项列表
 * @param {string} key - 冷机类型的 ID
 * @returns {Array} 选项列表
 */
const getOptions = key => {
    const id = props.data.id ? props.data.id : props.id;
    const num = chillerData?.value?.[props.data.infoCode + id]?.[key];

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
    const id = props.data.id ? props.data.id : props.id;
    const data = [...props.controlListData];
    props.controlListData.forEach(item => {
        item.pumpGroups?.forEach(pumpGroup => {
            if (pumpGroup.pumpGroupInfoCodes) {
                data.push(...pumpGroup.pumpGroupInfoCodes);
            }
        });
        if (item.pumpGroupInfoCodes) {
            data.push(...item.pumpGroupInfoCodes);
        }
    });
    let foundItem = data.find(item => item.infoCode === props.data.infoCode && (item.id === id || item.airId === id));

    if (foundItem) {
        const arr = structuredClone(foundItem.unitsNumberSetValue || []);
        arr.forEach(item => {
            item.infoCodeValue = props.isClear ? '' : getIotData(id, item.infoCode).dataValue;
        });
        params.value[props.data.infoCode] = orderBy(arr, ['order'], 'asc');
    }
};
const lockStatus = computed(() => {
    if (props.data.lockStatus) {
        const lock = getIotData(props.id, props.data.lockStatus?.infoCode);
        return isLockV2(lock);
    }
    return false;
});
// 初始化冷机参数数据
onMounted(() => {
    if (params && props.data.infoCode) {
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
        .m-select-inner {
            min-width: inherit;
            .m-select-inner-value {
                width: auto;
            }
        }
    }
}
</style>
