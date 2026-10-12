<template>
    <m-modal
        v-model:visible="show"
        :append-to="$modalAppendTo"
        modal-class-name="shell-range-configuration-hidden-devices-modal"
        type="default"
        :width="840"
        :height="680"
        :title="i18n.global.t('meos_control_web.add_hidden_devices')"
        :auto-close="false"
        @close="handleClose"
        @submit="handleConfirm"
    >
        <template #content>
            <div class="modal-content">
                <div class="transfer-container">
                    <m-transfer
                        v-model="innerSelectedIds"
                        class="transfer-wrapper"
                        :data="allDevices"
                        :props="transferProps"
                        :show-all-levels="false"
                        :placeholder-search="i18n.global.t('meos_control_web.search_name')"
                        virtual
                        search-as-tree
                        @change="handleIdsChange"
                    >
                    </m-transfer>
                </div>
            </div>
        </template>
        <template #footer>
            <m-button @click="handleClose">{{ i18n.global.t('common.cancel') }} </m-button>
            <m-button type="primary" @click="handleConfirm">{{ i18n.global.t('common.confirm') }} </m-button>
        </template>
    </m-modal>
</template>

<script setup>
import UseModalHooks from '@/hooks/UseModalHooks';
import i18n from '@/localization';
import { $Message } from 'meri-plus';

const props = defineProps({
    // 所有可用设备列表（用于构建树形数据）
    allDevices: {
        type: Array,
        default: () => []
    },
    // 已选择的设备 ID 列表
    selectedIds: {
        type: Array,
        default: () => []
    }
});

const emit = defineEmits(['close', 'confirm']);

const { show, handleModalClose: handleClose } = UseModalHooks(emit);

// 递归遍历树形结构，将所有节点（包括子节点）添加到 Map 中
const traverseTree = (nodes, map) => {
    if (!Array.isArray(nodes)) return;
    nodes.forEach(item => {
        if (item.id) {
            map.set(item.id, item);
        }
        // 递归处理子节点
        if (item.children && Array.isArray(item.children) && item.children.length > 0) {
            traverseTree(item.children, map);
        }
    });
};

const allDevicesMap = computed(() => {
    const map = new Map();
    traverseTree(props.allDevices, map);
    return map;
});

const initSelectids = () => {
    const selectedIds = props.selectedIds.reduce((acc, id) => {
        if (allDevicesMap.value.has(id)) {
            acc.push(id);
        }
        return acc;
    }, []);
    innerSelectedIds.value = selectedIds;
};

onMounted(() => {
    show.value = true;
    initSelectids();
});

// m-transfer 配置
const transferProps = {
    label: 'name',
    key: 'id',
    children: 'children'
};

// 穿梭框内部选中的 ID 集合
const innerSelectedIds = ref([]);
const selectedList = computed(() => {
    return innerSelectedIds.value.map(id => {
        const item = allDevicesMap.value.get(id);
        return {
            id: item.id,
            name: item.name
        };
    });
});

const handleIdsChange = (row, selectNode) => {
    console.log({ row, selectNode });
};

const handleConfirm = () => {
    emit('confirm', selectedList.value);
    if (props.allDevices?.length) {
        $Message.success({ title: i18n.global.t('meos_control_web.add_device_success') });
    }
    handleClose();
};
</script>

<style lang="less">
.shell-range-configuration-hidden-devices-modal {
    .modal-content.modal-content.modal-content {
        padding: 0;
    }
}
</style>
<style scoped lang="less">
.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 32px;
    border-bottom: 1px solid var(--gray-300, #e1e5eb);
}

.modal-content {
    display: flex;
    height: 100%;
    padding: 16px 24px 24px 24px;
}

.transfer-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
}

.selected-count-row {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    color: var(--gray-800, #2e3742);
}

.selected-clear {
    margin-top: 4px;
    font-size: 12px;
    color: var(--blue-400, #036feb);
    cursor: pointer;
}

.transfer-wrapper {
    height: 100%;
    width: 100%;

    :deep(.m-transfer-main) {
        height: 100%;
    }
}
</style>
