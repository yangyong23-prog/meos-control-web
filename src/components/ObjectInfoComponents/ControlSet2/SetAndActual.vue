<template>
    <div class="set-and-actual fcb">
        <div class="set-and-actual-value fc">
            <div v-if="actual.infoCode" class="data-value actual-value fc">
                <span style="flex: 0 0 56px; white-space: nowrap">{{ i18n.global.t('meos_control_web.actual_value_colon') }}</span>
                <div v-ellipsis style="color: var(--gray-900)" class="m-ellipsis">{{ getValueStr(actual).text }}</div>
            </div>
            <div class="data-value fc" style="flex: 1; width: 0">
                <span style="flex: 0 0 56px; white-space: nowrap">{{ i18n.global.t('meos_control_web.setpoint_value_colon') }}</span>
                <div v-ellipsis style="color: var(--gray-900)" class="m-ellipsis">{{ getValueStr(set).text }}</div>
            </div>
        </div>
        <div v-if="showSetButtons" class="set-and-actual-btn">
            <!-- originDataType判断展示 -->
            <div v-if="data.originDataType === 'Boolp' || data.originDataType === 'Boolv'" class="fcc">
                <SetButton
                    v-for="dataSourceItem in data.dataSource.toReversed()"
                    :key="dataSourceItem.code"
                    :class="{ 'is-hover': data.infoCode === curInfoCode?.infoCode && data.objectId === curInfoCode?.objectId && dataSourceItemCode === dataSourceItem.code }"
                    :disabled="disabled"
                    type="link"
                    size="small"
                    :content="disabledText"
                    @click="e => openForm(e, data, dataSourceItem)"
                >
                    {{ dataSourceItem.name }}
                </SetButton>
            </div>
            <SetButton
                v-else
                :class="{ 'is-hover': data.infoCode === curInfoCode?.infoCode && data.objectId === curInfoCode?.objectId }"
                :disabled="disabled"
                type="link"
                size="small"
                :content="disabledText"
                @click="e => openForm(e, data)"
            >
                {{ i18n.global.t('meos_control_web.setpoint') }}
            </SetButton>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import DockSingleton from '@/hooks/responsiveDock';
import SetButton from '@/components/common/SetButton.vue';
import { getValueStr } from '@/utils/viewUtils';

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
    dataSourceItemCode: {
        type: String,
        default: ''
    },
    showSetButtons: {
        type: Boolean,
        default: false
    }
});
const emit = defineEmits(['openForm']);
const openForm = (e, item, dataSourceItem) => {
    emit('openForm', e, item, dataSourceItem);
};

const actual = computed(() => {
    const infoCode = props.data.actualInfoCode || props.data.relInfoCodeConfigs?.[0]?.infoCode;
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
@media screen and (min-width: 1600px) {
    .set-and-actual {
        .actual-value {
            width: 180px;
        }
        &.enableCtrl {
            .actual-value {
                width: 175px;
            }
        }
    }
}
@media screen and (max-width: 1600px) {
    .set-and-actual {
        .actual-value {
            width: 140px;
        }
        &.enableCtrl {
            .actual-value {
                width: 135px;
            }
        }
    }
}

.set-and-actual {
    &-value {
        flex: 1;
    }
    .data-value {
        color: var(--gray-600);
    }
    .set-and-actual-btn {
        display: flex;
        justify-content: flex-end;
    }
    :deep(.m-button) {
        & + .m-button {
            margin-left: 2px;
        }
    }
}
</style>
