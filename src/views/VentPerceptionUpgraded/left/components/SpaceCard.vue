<template>
    <div
        :class="{
            'space-card': true,
            selected: selected
        }"
        :style="{
            background: selected ? '' : getSpaceStatusInfo(data?.id)?.bg
        }"
        @click="chooseSpace"
    >
        <div class="space-card-header fcb">
            <div class="fs16 fc title">
                <span v-ellipsis class="m-ellipsis">{{ data.localName }}</span>
                <div v-if="haveAbnormal" class="abnormal-number fs14 fc">
                    {{ i18n.global.t('meos_control_web.abnormal_event_colon')
                    }}<span class="fw700">{{ i18n.global.t('meos_control_web.certain_number', { count: getAbnormalCount(data) }) }}</span>
                </div>
            </div>
        </div>
        <div
            class="space-card-content"
            :style="{
                'grid-template-columns': `repeat(${list.length > 1 ? 3 : 1}, minmax(0, 1fr))`
            }"
        >
            <div v-for="item in list" :key="item.name" class="list-item">
                <div v-ellipsis="{ class: ['value-ellipsis'] }" class="m-ellipsis list-item-val">
                    <span class="ffCP fw600 fs16 info-code-val">{{ item.dataValue || '--' }}</span>
                    <span class="info-code-unit fs12">{{ item.unit }}</span>
                </div>
                <div v-ellipsis class="m-ellipsis fs14 list-item-text">{{ item.name || item.aliasName || '--' }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
// import InfoCodeNumber from '@/views/IndoorLighting/components/StatusNumber/InfoCodeNumber.vue';
// import { INFOCODE, INSTANCE_TYPE } from '../../variables';
import DockSingleton from '@/hooks/responsiveDock';
import { getSpaceInfoListKey, curDashBoardEnvCodeKey, getSpaceStatusInfoKey } from '@/views/VentPerceptionUpgraded/hooks/useBaseHook';
import { selectObjKey } from '@/views/VentPerceptionUpgraded/hooks/useDrawerCommon';
import { uniqBy } from 'lodash';
const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    }
});
const getSpaceStatusInfo = inject(getSpaceStatusInfoKey);
const getSpaceInfoList = inject(getSpaceInfoListKey);
const selectObject = inject(selectObjKey);
const emits = defineEmits(['chooseSpace']);
const chooseSpace = () => {
    emits('chooseSpace', props.data);
};
const curDashBoardEnvCode = inject(curDashBoardEnvCodeKey);
const { getAbnormalEventsList, getObjectAbnormalStatus } = DockSingleton.getInstance();
const haveAbnormal = computed(() => {
    return getObjectAbnormalStatus(props.data.id);
});
const getAbnormalCount = spaceData => {
    const valObj = getAbnormalEventsList([spaceData.id]) || [];
    return valObj?.length;
};
const selected = computed(() => {
    return selectObject?.value?.id === props.data?.id;
});
const list = computed(() => {
    const { envInfoList, windInfoList } = getSpaceInfoList(props.data);
    if (curDashBoardEnvCode.value === 'all') {
        return [...envInfoList, ...windInfoList].slice(0, 3);
    } else {
        const info = envInfoList.find(code => code?.infoCode === curDashBoardEnvCode.value);
        if (info) {
            return [info, ...windInfoList].slice(0, 3);
        } else {
            return [...windInfoList].slice(0, 3);
        }
    }
});
</script>
<style lang="less" scoped>
.space-card {
    height: 106px;
    background-color: #ffffff;
    border-radius: 4px;
    cursor: pointer;
    padding: 12px;
    border: 1px solid transparent;
    &:hover {
        border: 1px solid var(--blue-500);
    }

    &-header {
        height: 26px;
        margin-bottom: 12px;
        cursor: pointer;
        white-space: nowrap;
        .title {
            min-width: 0;
        }
        .floor-btn {
            opacity: 0;
            transition: all 0.3s ease;
        }
        .abnormal-number {
            height: 26px;
            margin-left: 8px;
            padding: 3px 8px;
            background: linear-gradient(270deg, rgba(245, 80, 71, 0.05) 0%, rgba(245, 80, 71, 0.2) 100%);
            color: var(--red-500);
            border-radius: 2px;
        }
    }
    &.selected {
        background-color: var(--blue-500);
        border: 1px solid var(--blue-500);
        color: #fff;
        .space-card-header {
            .abnormal-number {
                background: linear-gradient(270deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.2) 100%);
                color: #fff;
            }
        }
        .space-card-content {
            .list-item {
                .list-item-text {
                    color: #fff;
                }
            }
        }
    }
    &-content {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 8px;
        .list-item {
            cursor: pointer;
            transition: all 0.3s ease;
            line-height: 20px;
            position: relative;
            .list-item-val {
                height: 20px;
                .info-code-val {
                    line-height: 20px;
                }
                .info-code-unit {
                    line-height: 20px;
                    vertical-align: top;
                }
            }
            .list-item-text {
                margin-top: 4px;
                color: var(--gray-500);
            }
        }
    }
}
</style>
