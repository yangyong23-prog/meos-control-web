<template>
    <div>
        <!-- 第一部分：UX内容区域 -->
        <div class="device-selector-trigger" :class="{ disabled: !enabled }" @click="handleTriggerClick">
            <div class="device-selector-content">
                <span class="add-device-text">{{ i18n.global.t('meos_control_web.add_hidden_devices') }}</span>
                <div v-if="displayDeviceNames" class="divider"></div>
                <span class="device-names">{{ displayDeviceNames }}</span>
            </div>
        </div>

        <!-- 第二部分：弹窗（独立组件，内部使用 m-transfer） -->
        <HiddenDevicesModal v-if="showModal" :all-devices="instanceTreeData" :selected-ids="selectedIds" @confirm="handleModalConfirm" @close="showModal = false" />
    </div>
</template>

<script setup>
import i18n from '@/localization';
import HiddenDevicesModal from './HiddenDevicesModal.vue';
import { HALF_SECTION_VISIBILITY_ENUM } from '@/views/xshellConfiguration/constants/constant';

const props = defineProps({
    // 是否启用
    enabled: {
        type: Boolean,
        default: true
    },
    // 设备列表（用于显示已选择的设备名称）
    selectedDevices: {
        type: Array,
        default: () => []
    },
    // 所有可用设备列表（用于构建树形数据）
    allDevices: {
        type: Array,
        default: () => []
    },
    // 设备类型
    classCode: {
        type: String,
        default: ''
    }
});

const emit = defineEmits(['change', 'update:selectedDevices']);

const showModal = ref(false);

const injectKey = computed(() => {
    const types = {
        [HALF_SECTION_VISIBILITY_ENUM.graphHsecAcatah.classCode]: {
            tree: 'ACATAHInstanceTree',
            map: 'ACATAHInstanceTreeMap'
        },
        [HALF_SECTION_VISIBILITY_ENUM.graphHsecAcatfu.classCode]: {
            tree: 'ACATFUInstanceTree',
            map: 'ACATFUInstanceTreeMap'
        },
        [HALF_SECTION_VISIBILITY_ENUM.graphHsecAcahg.classCode]: {
            tree: 'ACAHGInstanceTree'
        }
    };
    return types[props.classCode] || {};
});
const instanceTreeData = inject(injectKey.value.tree);

// 计算显示的设备名称
const displayDeviceNames = computed(() => {
    if (!props.selectedDevices || props.selectedDevices.length === 0) {
        return '';
    }
    return props.selectedDevices.map(item => item.name).join('、');
});

// 选中的设备 ID 列表（供弹窗使用）
const selectedIds = computed(() => {
    if (!Array.isArray(props.selectedDevices)) return [];
    return props.selectedDevices.map(item => item.id);
});

// 处理触发点击
const handleTriggerClick = () => {
    if (!props.enabled) return;
    showModal.value = true;
};

// 弹窗确认回调（基于 m-transfer 选中的 ID 列表）
const handleModalConfirm = selectedList => {
    if (!Array.isArray(selectedList)) {
        emit('change', []);
        return;
    }

    emit('change', selectedList);
};
</script>

<style scoped lang="less">
.device-selector-trigger {
    background-color: var(--gray-100, #f1f4f6);
    border-radius: 4px;
    padding: 11px 12px;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 8px;

    &:hover:not(.disabled) {
        background-color: var(--gray-200, #e1e5eb);
    }

    &.disabled {
        cursor: not-allowed;
        opacity: 0.6;
    }
}

.device-selector-content {
    display: flex;
    align-items: stretch;
    gap: 12px;
    --text-line-height: 22px;
}

.add-device-text {
    color: var(--blue-400);
    font-size: 14px;
    font-weight: 400;
    line-height: var(--text-line-height);
    white-space: nowrap;
}

.divider {
    flex-shrink: 0;
    width: 1px;
    background-color: #c4c9cf;
}

.device-names {
    color: var(--gray-700, #424c59);
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    flex: 1;
}
</style>
