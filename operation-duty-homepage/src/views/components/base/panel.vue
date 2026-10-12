<template>
    <div class="woperating-monitor-panel">
        <div class="operation-monitor-panel-header">
            <div class="operationi-select-l">
                <Title size="L" :path="titlePath" :params="titleParams" :prefix="titlePathPrefix" class="operation-monitor-panel-title m-ellipsis">
                    <span v-ellipsis class="title m-ellipsis"> {{ title }}</span>
                </Title>
                <StateTag v-if="cardTag" state="error" :number="cardTag.errorEventTotal" />
                <m-tag v-if="modeName" color="#1B2129" bg-color="#E8ECF0" size="small"> {{ modeName }} </m-tag>
                <Title v-if="templateName" v-ellipsis class="running-monitor-title m-ellipsis" :class="dayType" style="display: block">
                    {{ templateName }}
                </Title>
            </div>
            <m-select
                v-if="selectOptions.length && selectOptions.length > 1"
                v-model="selectValue"
                class="operationi-select-r"
                size="auto"
                :noborder="true"
                :options="selectOptions"
                @change="onSelectChange"
            >
            </m-select>
            <span v-else-if="selectOptions.length && selectOptions.length === 1" v-ellipsis class="m-ellipsis system-name">
                {{ selectOptions[0].name }}
            </span>
        </div>
        <div v-if="loading" class="woperating-monitor-row">
            <m-list-skeleton :item-num="3" />
        </div>
        <slot v-else></slot>
    </div>
</template>
<script setup>
import Title from '@/components/Title.vue';
import StateTag from '@/components/StateTag.vue';
const emit = defineEmits(['update:modelValue', 'change']);
const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    loading: {
        type: Boolean,
        default: true
    },
    cardTag: {
        type: Object,
        default: () => ({})
    },
    selectOptions: {
        type: Array,
        default: () => []
    },
    templateName: {
        type: String,
        default: ''
    },
    templateTag: {
        type: String,
        default: ''
    },
    modelValue: {
        type: String,
        default: ''
    },
    titlePath: {
        type: String,
        default: ''
    },
    titlePathPrefix: {
        type: String,
        default: ''
    },
    titleParams: {
        type: Object,
        default: () => {}
    },
    modeName: {
        type: String,
        default: ''
    }
});
const selectValue = ref('');
const dayType = computed(() => {
    if (props.templateTag) {
        switch (props.templateTag) {
            case 'WORKDAY':
                return 'title-bl';
            case 'DAYOFF':
                return 'title-og';
            case 'ANNIVERSARY':
                return 'title-red';
            default:
                return 'title-custom';
        }
    }
    return 'title-bl';
});
watch(
    () => props.modelValue,
    newValue => {
        selectValue.value = newValue;
    }
);
const onSelectChange = item => {
    console.log(item, selectValue.value);
    emit('change', item);
    emit('update:modelValue', item);
    selectValue.value = item;
};
</script>
<style lang="less" scoped>
.woperating-monitor-panel {
    height: 100%;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    flex-shrink: 0;
    border-radius: 12px;
    background: var(--gray-0);
    white-space: nowrap;
    padding: 16px 4px;
    gap: 12px;
    .woperating-monitor-row {
        padding: 12px 12px;
        .m-list-skeleton {
            /deep/ .m-list-skeleton-item:nth-child(3) {
                width: 55.5%;
                align-self: flex-start;
            }
        }
    }
    /deep/ .bc {
        background: #246fe50f;
        border-radius: 8px;
        padding: 12px;
        overflow: hidden;
        min-width: 0;
    }

    .operation-monitor-panel-header {
        width: 100%;
        display: flex;
        white-space: nowrap;
        height: 26px;
        padding: 0px 12px 0px 8px;
        align-items: center;
        .operationi-select-l {
            display: flex;
            flex-direction: row;
            align-items: center;
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .running-monitor-title {
            font-weight: 700;
        }
        .operation-monitor-panel-title {
            margin-right: 4px;
            max-width: calc(100% - 100px);
            width: max-content;
            display: flex;
            align-items: center;
            justify-content: flex-start;
        }
        :deep(.operationi-select-r) {
            align-self: flex-end;
            justify-self: flex-end;
            display: flex;
            align-items: center;
            overflow: hidden;
            text-overflow: ellipsis;
            height: 100%;
            color: var(--gray-800, #2e3742);
            text-align: center;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 26px; /* 157.143% */
            flex-shrink: 0;
            flex-shrink: 0;
            display: flex;
            max-width: 150px;
            .m-select {
                max-width: calc(100%);
            }
        }
        .system-name {
            max-width: 150px;
        }
    }
}
</style>
