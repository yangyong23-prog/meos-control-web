<template>
    <div :class="`level-${props.level}`">
        <div v-if="nodeData?.alias || props?.node?.name" class="node-row">
            <div class="node-left" :style="{ width: `calc(100% - ${width}px)` }">
                <slot>
                    <div class="node-drag-icon">
                        <SortSvg />
                    </div>
                </slot>
                <m-checkbox v-model="nodeData.checked" class="node-title" @change="handleChange">
                    <span v-ellipsis class="m-ellipsis title-content">{{ nodeData?.alias || props?.node?.name }}</span>
                </m-checkbox>
            </div>
            <div ref="rightTarget" class="node-right">
                <m-button v-if="nodeData?.linkButton" type="link" size="medium" @click="showModal">{{ nodeData?.linkButton }}</m-button>
                <m-popconfirm placement="bottom" :width="'280px'" @confirm="confirm">
                    <template #main>
                        <div class="confirm-content">
                            <span class="label-top">{{ i18n.global.t('meos_control_web.please_input_name') }}</span>
                            <m-input v-model="aliasName" :type="'textarea'" :placeholder="props?.node?.defaultName" :maxlength="50" show-word-limit :height="144"> </m-input>
                        </div>
                    </template>
                    <m-button type="icon" icon="IconMeriActionEditor" size="small"></m-button>
                </m-popconfirm>
            </div>
        </div>

        <div v-show="nodeChildren?.length" class="children-container">
            <VueDraggable v-model="nodeChildren" animation="200" handle=".node-drag-icon" chosen-class="chosen" force-fallback fallback-on-body>
                <transition-group>
                    <TreeItem
                        v-for="element in nodeChildren"
                        :key="element.code"
                        v-model:node-data="element.data"
                        v-model:node-children="element.children"
                        :node="element"
                        :level="props.level + 1"
                    />
                </transition-group>
            </VueDraggable>
        </div>

        <ModalActualEnergyConsumptionBenchmark
            v-if="props?.node?.code === 'report_chapter_energy_budget'"
            v-model:data="nodeData.modalValue"
            v-model:show="showActualEnergyConsumptionBenchmark"
            :title="nodeData?.linkButton"
        />
        <ModalConfigElectricSubItem
            v-if="props?.node?.code === 'report_chapter_energy_analysis'"
            v-model:data="nodeData.modalValue"
            v-model:show="showConfigElectricSubItem"
            v-model:checked="nodeData.checked"
            :title="nodeData?.linkButton"
        />
        <ModalTemperaturePointConfig
            v-if="props?.node?.code === 'report_chapter_env_quality'"
            v-model:data="nodeData.modalValue"
            v-model:show="showTemperaturePointConfig"
            v-model:checked="nodeData.checked"
            :title="nodeData?.linkButton"
        />
    </div>
</template>

<script setup>
import { useTemplateRef } from 'vue';
import { useElementSize } from '@vueuse/core';
import i18n from '@/localization';
import { VueDraggable } from 'vue-draggable-plus';
import SortSvg from '@/assets/svg/sort.svg';
import ModalActualEnergyConsumptionBenchmark from './common/ModalActualEnergyConsumptionBenchmark.vue';
import ModalConfigElectricSubItem from './common/ModalConfigElectricSubItem.vue';
import ModalTemperaturePointConfig from './common/ModalTemperaturePointConfig.vue';

defineOptions({
    name: 'TreeItem'
});

const props = defineProps({
    node: {
        type: Object,
        default: () => ({
            name: '',
            code: '',
            defaultName: ''
        })
    },
    level: {
        type: Number,
        default: 1,
        validator: value => value >= 1 && value <= 10 // 限制层级深度
    }
});

const nodeChildren = defineModel('node-children', { type: Array, default: () => [] });
const nodeData = defineModel('node-data', {
    type: Object,
    default: () => ({
        checked: '',
        alias: '',
        linkButton: '',
        modalValue: ''
    })
});
const aliasName = ref('');
const showConfigElectricSubItem = ref(false);
const showActualEnergyConsumptionBenchmark = ref(false);
const showTemperaturePointConfig = ref(false);

const rightTargetRef = useTemplateRef('rightTarget');
const { width } = useElementSize(rightTargetRef);

const confirm = () => {
    const inputVal = aliasName.value.trim();
    if (!inputVal) {
        nodeData.value.alias = props?.node?.defaultName || '';
    } else {
        nodeData.value.alias = inputVal;
    }
};

const showModal = () => {
    nextTick(() => {
        if (props?.node?.code === 'report_chapter_energy_analysis') {
            showConfigElectricSubItem.value = true;
        } else if (props?.node?.code === 'report_chapter_energy_budget') {
            showActualEnergyConsumptionBenchmark.value = true;
        } else if (props?.node?.code === 'report_chapter_env_quality') {
            showTemperaturePointConfig.value = true;
        }
    });
};
watch(
    () => props.node.name,
    val => {
        aliasName.value = val;
    },
    {
        immediate: true
    }
);

const isAllChildrenChecked = computed(() => {
    if (!nodeChildren.value.length) return false;
    return nodeChildren.value.every(child => child.data.checked === 'checked');
});

const isSomeChildrenChecked = computed(() => {
    if (!nodeChildren.value.length) return false;
    return nodeChildren.value.some(child => child.data.checked === 'checked' || child.data.checked === 'notNull');
});

watch(
    [isAllChildrenChecked, isSomeChildrenChecked],
    () => {
        if (nodeChildren.value.length) {
            if (isAllChildrenChecked.value) {
                nodeData.value.checked = 'checked';
            } else if (isSomeChildrenChecked.value) {
                nodeData.value.checked = 'notNull';
            } else {
                nodeData.value.checked = 'uncheck';
            }
        }
    },
    {
        immediate: true
    }
);

const handleChange = cur => {
    if (nodeChildren.value.length) {
        const checkedStatus = cur === 'checked' ? 'checked' : 'uncheck';

        const updateCheckedStatus = nodes => {
            nodes.forEach(node => {
                node.data.checked = checkedStatus;
                if (node?.children?.length) {
                    updateCheckedStatus(node.children);
                }
            });
        };

        updateCheckedStatus(nodeChildren.value);
    }
};
</script>

<style scoped lang="less">
.component {
    padding: 10px;
}

.level-1 {
    width: 480px;
    padding: 0px 8px;
    border-radius: 8px;
    border: 1px solid #e1e5eb;

    margin-bottom: 11px;
}

.node-row {
    width: 100%;
    display: flex;
    align-items: center;
    height: 40px;

    .node-title {
        flex: 1;
        max-width: calc(100% - 21px);
        font-size: 14px;
    }
    :deep(.m-checkbox-label) {
        display: inline-flex;
        align-items: center;
        height: 22px;
        line-height: 22px;
        max-width: calc(100% - 22px);
    }
    .title-content {
        display: inline-block;
        max-width: calc(100%);
    }
}

.node-left {
    display: flex;
    align-items: center;
}

.node-right {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-left: auto;
}

.icon-btn {
    cursor: pointer;
}

.node-drag-icon {
    cursor: move;
    margin-right: 8px;
    padding: 2px;
}

.children-container {
    margin-left: 24px;
}

.confirm-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.label-top {
    color: #626c78;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
    position: relative;
    width: fit-content;
    &::before {
        display: inline-block;
        position: absolute;
        width: 6px;
        top: -2px;
        right: -8px;
        content: '*';
        color: #f55047;
        font-size: 10px;
    }
}
.chosen {
    opacity: 0.5;
}
</style>
