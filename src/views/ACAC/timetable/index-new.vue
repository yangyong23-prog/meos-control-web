<template>
    <Timetable
        :system-info="currentSystem"
        :default-view-type="'weeks'"
        :show-back-button="true"
        :show-create-button="true"
        :show-batch-delete="true"
        :disabled="disabled"
        :button-type="getButtonType"
        :dropdown-options="dropdownOptions"
        :data-loader="handleDataLoader"
        :project-id="projectId"
        system-type="ACAC"
        @go-back="goBack"
        @create="handleCreate"
        @edit="handleEdit"
        @delete="handleDelete"
        @view-type-change="handleViewTypeChange"
        @date-change="handleDateChange"
        @data-loaded="handleDataLoaded"
    >
        <!-- 自定义删除表单 -->
        <template #deleteForm="{ onCancel, onSubmit }">
            <DelFormItem :current-system="currentSystem" @show-popover-fuc="onCancel" @sumbit-popover-fuc="onSubmit" />
        </template>
    </Timetable>
</template>

<script setup>
import { computed, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import Timetable from '@/components/Timetable/index.vue';
import DelFormItem from './components/delFormItem.vue';
import { listStrategy } from '@/apis/ACAC';
import { SUCCESSCODE } from '@/utils/globalVariables';
import baseStore from '@/store/baseStore';
import { currentSystemKey } from '../hooks/useBaseHook';
import { isEdge } from '@/utils/envUtils';

const { t } = useI18n();
const base = baseStore();
const currentSystem = inject(currentSystemKey);

// 项目 ID
const projectId = computed(() => base.projectId);

// 权限判断
const hasPermission = computed(() => base.hasAuth('coldControl'));
const disabled = computed(() => !isEdge() || !hasPermission.value);

// 下拉选项
const dropdownOptions = computed(() => [
    { label: t('meos_control_web.create_new_cooling_schedule'), key: 'COOL_SUPPLY' },
    { label: t('meos_control_web.create_new_thermal_storage_schedule'), key: 'COOL_INPUT' }
]);

// 按钮类型判断
const getButtonType = computed(() => {
    if (currentSystem.value.isShowCoolStore && currentSystem.value.unHideCoolingControl && currentSystem.value.consoleTypes !== 'AIR_TERMINAL_ZONE') {
        return 'dropdown';
    } else if (currentSystem.value.isShowCoolStore && !currentSystem.value.unHideCoolingControl && currentSystem.value.consoleTypes === 'COOL_INPUT') {
        return 'coolInput';
    } else if (!currentSystem.value.isShowCoolStore && currentSystem.value.unHideCoolingControl && currentSystem.value.consoleTypes === 'COOL_SUPPLY') {
        return 'coolSupply';
    } else if (currentSystem.value.consoleTypes === 'AIR_TERMINAL_ZONE') {
        return 'airTerminalZone';
    }
    return null;
});

// 数据加载函数
const handleDataLoader = async params => {
    try {
        const res = await listStrategy({
            projectId: params.projectId,
            consoleTypes: params.consoleTypes,
            systemType: params.systemType,
            objectId: params.objectId,
            beginDate: params.beginDate,
            endDate: params.endDate
        });

        if (res.code === SUCCESSCODE) {
            return { data: res.data || [], total: res.data?.length || 0 };
        }
        return { data: [], total: 0 };
    } catch (error) {
        console.error('Failed to load timetable data:', error);
        return { data: [], total: 0 };
    }
};

// 事件处理
const emit = defineEmits(['goBack']);

const goBack = () => {
    emit('goBack');
};

const handleCreate = type => {
    console.log('Create timetable:', type);
};

const handleEdit = params => {
    console.log('Edit timetable:', params);
};

const handleDelete = ids => {
    console.log('Delete timetable:', ids);
};

const handleViewTypeChange = type => {
    console.log('View type changed:', type);
};

const handleDateChange = date => {
    console.log('Date changed:', date);
};

const handleDataLoaded = data => {
    console.log('Data loaded:', data);
};
</script>

<style lang="less" scoped>
// 可以添加自定义样式覆盖
</style>
