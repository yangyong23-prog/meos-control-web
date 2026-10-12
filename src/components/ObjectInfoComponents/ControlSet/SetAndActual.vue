<template>
    <div class="set-and-actual fcb">
        <div class="set-and-actual-value fc">
            <div v-if="actual.infoCode" class="data-value fc">
                <span style="flex: 0 0 60px; white-space: nowrap">{{ i18n.global.t('meos_control_web.actual_value_colon') }}</span>
                <div v-ellipsis style="color: var(--gray-900)" class="m-ellipsis">{{ getValueStr(actual).text }}</div>
            </div>
            <div class="data-value fc">
                <span style="flex: 0 0 60px; white-space: nowrap">{{ i18n.global.t('meos_control_web.setpoint_value_colon') }}</span>
                <div v-ellipsis style="color: var(--gray-900)" class="m-ellipsis">{{ getValueStr(set).text }}</div>
            </div>
        </div>
        <div v-if="showControlBtnFn ? showControlBtnFn(data, objectId) : true" class="set-and-actual-btn">
            <SetButton
                v-if="!showDataSource"
                :class="{ 'is-hover': data.infoCode === curInfoCode?.infoCode && data.objectId === curInfoCode?.objectId }"
                :disabled="disabled"
                type="link"
                size="small"
                :content="disabledText"
                @click="e => openForm(e)"
            >
                {{ i18n.global.t('meos_control_web.setpoint') }}
            </SetButton>
            <div v-else class="fcc">
                <template v-if="data.originDataType === OriginDataTypeEnum.Boolp || data.originDataType === OriginDataTypeEnum.Boolv">
                    <SetButton
                        v-for="item in (data?.dataSource || data.dataSources || []).toReversed()"
                        :key="item.code"
                        :class="{
                            'is-hover': item.code === curInfoCode?.dataSourceItem?.code && data.infoCode === curInfoCode?.infoCode && data.objectId === curInfoCode?.objectId
                        }"
                        :disabled="disabled"
                        type="link"
                        size="small"
                        :content="disabledText"
                        @click="e => openForm(e, item)"
                    >
                        {{ item.name }}
                    </SetButton>
                </template>
                <SetButton
                    v-else
                    :class="{ 'is-hover': data.infoCode === curInfoCode?.infoCode && data.objectId === curInfoCode?.objectId }"
                    :disabled="disabled"
                    type="link"
                    size="small"
                    :content="disabledText"
                    @click="e => openForm(e)"
                >
                    {{ i18n.global.t('meos_control_web.setpoint') }}
                </SetButton>
            </div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import DockSingleton from '@/hooks/responsiveDock';
import SetButton from '@/components/common/SetButton.vue';
import { getValueStr } from '@/utils/viewUtils';
import { OriginDataTypeEnum } from '@/types/common';

const { getIotData } = DockSingleton.getInstance();

const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    },
    disabled: {
        type: Boolean,
        default: false
    },
    disabledText: {
        type: String,
        default: ''
    },
    curInfoCode: {
        type: Object,
        default: () => ({})
    },
    showDataSource: {
        type: Boolean,
        default: false
    },
    showControlBtnFn: {
        type: Function,
        default: null
    },
    objectId: {
        type: String,
        default: ''
    }
});
const emit = defineEmits(['openForm']);
const openForm = (e, item = false) => {
    emit('openForm', e, item);
};

const actual = computed(() => {
    const infoCode = props.data.relInfoCodeConfigs?.[0]?.infoCode;
    if (infoCode === undefined) {
        return {};
    }
    const iotData = getIotData(props.data.objectId, infoCode);
    return iotData;
});
const set = computed(() => {
    const iotData = getIotData(props.data.objectId, props.data.infoCode);
    return iotData;
});
</script>
<style lang="less" scoped>
.set-and-actual {
    &-value {
        width: calc(100% - 36px);
    }
    .data-value {
        width: 50%;
        color: var(--gray-600);
    }
}
</style>
