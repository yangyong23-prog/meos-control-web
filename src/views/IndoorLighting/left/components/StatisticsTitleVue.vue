<template>
    <div class="statistics-item-title fcb">
        <div v-ellipsis class="title-text fs18 fw700 m-ellipsis">{{ title }}</div>
        <div class="title-btn fcc" control-form>
            <template v-for="item in statusList" :key="item.name">
                <div v-show="item.list.length" class="status-item" @click="openStaticDetail(item)">
                    <span v-ellipsis class="status-label m-ellipsis">
                        {{ item.aliasName || item.name }}
                        <InfoCodeNumber v-model="item.list" :objects="data" v-bind="item" class="fw700" style="margin-left: 2px" />
                        ❯
                    </span>
                </div>
            </template>

            <m-button type="default" size="small" @click="openEquipmentPanel(item)">{{ buttonText }}</m-button>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { IconMeriComponentChevronRight } from 'meri-icon';
import InfoCodeNumber from '@/views/IndoorLighting/components/StatusNumber/InfoCodeNumber.vue';
import { INFOCODE, STATIC_TYPE } from '../../variables';
import { openStaticlDrawerKey } from '@/views/IndoorLighting/hooks/useDrawerCommon';
import { openEquipmentListKey } from '@/views/IndoorLighting/hooks/useEquipmentList';
import emitter from '@/utils/bus';
import { CLOSE_CONTROL_FORM } from '@/utils/globalVariables';
import Right from '@/assets/svg/right.svg';

const openStaticlDrawer = inject(openStaticlDrawerKey);
const openEquipmentList = inject(openEquipmentListKey);

const props = defineProps({
    title: {
        type: String,
        default: i18n.global.t('meos_control_web.public_lighting')
    },
    buttonText: {
        type: String,
        default: i18n.global.t('meos_control_web.public_equipment')
    },
    runningMonitorSecondType: {
        type: String,
        default: ''
    },
    data: {
        type: Array,
        default: () => []
    },
    serviceAreaType: {
        type: String,
        default: ''
    }
});
const openEquipmentPanel = () => {
    openEquipmentList({ runningMonitorSecondType: props.runningMonitorSecondType });
    emitter.emit(CLOSE_CONTROL_FORM);
};
const statusList = ref([
    {
        ...INFOCODE.localRemoteStatus0,
        color: '#ffffff',
        type: STATIC_TYPE.LOCAL,
        list: []
    },
    {
        ...INFOCODE.controlDeviationStatus1,
        color: '#ffffff',
        type: STATIC_TYPE.OPEN_MORE,
        list: []
    },
    {
        ...INFOCODE.controlDeviationStatus2,
        color: '#ffffff',
        type: STATIC_TYPE.OPEN_LESS,
        list: []
    },
    {
        ...INFOCODE.runStatusNull,
        color: '#ffffff',
        type: STATIC_TYPE.UNKNOW,
        list: []
    }
]);

const openStaticDetail = item => {
    openStaticlDrawer(item.type, props.title, undefined, undefined, props.serviceAreaType);
    emitter.emit(CLOSE_CONTROL_FORM);
};
</script>
<style lang="less" scoped>
.statistics-item-title {
    height: 28px;
    margin-bottom: 20px;
    .title-btn {
        max-width: calc(100% - 80px);
        gap: 4px;
        .status-item {
            /* 外层负责居中，文字、数量和箭头在同一行内整体溢出省略 */
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 0;
            background-color: #ff992d;
            height: 28px;
            line-height: 28px;
            padding: 0 4px;
            border-radius: 4px;
            color: var(--gray-0);
            cursor: pointer;
            .status-label {
                min-width: 0;
            }
            .status-arrow {
                vertical-align: middle;
            }
            &:hover {
                background-color: #e77800;
            }
        }
    }
}
</style>
