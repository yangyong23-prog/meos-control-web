<template>
    <div :class="['space-card-item f', status, isActive ? 'is-active' : '']" :style="cssVars" @click="openSpaceInfo">
        <div class="space-card-item-title fs16 fc">
            <div class="title-left">
                <div v-ellipsis class="title-text m-ellipsis">{{ data.name || '--' }}</div>
                <m-tag v-if="doorUnclosed.dataValue" size="small" color="#fff" bg-color="rgba(242, 159, 0, 1)">{{ doorUnclosed.infoCodeName }} </m-tag>
            </div>
            <div class="title-btn fs14" @click.stop="toMachineRoom(data)">{{ i18n.global.t('meos_control_web.enter_machine_room') }}</div>
        </div>
        <div class="space-card-item-info">
            <template v-if="equipmentsWithStatus.length || runningParameter.length">
                <DataValueName
                    v-for="item in equipmentsWithStatus"
                    :key="item.status"
                    :name="item.text"
                    :value="item.number"
                    :unit="i18n.global.t('common.unit')"
                    :class="isActive ? 'is-active' : ''"
                />
                <template v-for="(item, i) in runningParameter" :key="item.infoCode">
                    <DataValueName
                        v-if="i + equipmentsWithStatus.length <= 2"
                        :name="item.aliasName || item.infoCodeName"
                        :value="getIotData(data.id, item.infoCode).dataValue"
                        :unit="item.unit"
                        :class="isActive ? 'is-active' : ''"
                    />
                </template>
            </template>
            <div v-else class="no-infoCode fc">{{ i18n.global.t('common.no_data') }}</div>
        </div>
    </div>
</template>

<script setup>
import DockSingleton from '@/hooks/responsiveDock';
import { SPACE_STATUS } from '../variable';
import { currentSpaceIdKey, idDynaDataKey, loadingDangerEventsKey } from '../hooks/useBaseDataHook';
import { openDetailDrawerInjectKey, goToSpace3DViewInjectKey } from '../constant/injectKey';
import DataValueName from './DataValueName.vue';
import { orderBy } from 'lodash';
import i18n from '@/localization';

const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    }
});
const loangerEvents = inject(loadingDangerEventsKey);
const openDetailDrawer = inject(openDetailDrawerInjectKey);
const goToSpace3DView = inject(goToSpace3DViewInjectKey);
const { getObjectDanegerStatus, getIotData, getObjectDanegerEventsList } = DockSingleton.getInstance();
const currentSpaceId = inject(currentSpaceIdKey);
const idDynaData = inject(idDynaDataKey);
const status = computed(() => (loangerEvents?.value ? SPACE_STATUS.NORMAL.id : getObjectDanegerStatus(props.data.id).code));
const cssVars = computed(() => {
    return {
        '--bg-color': SPACE_STATUS[status.value].bgColor,
        '--bg-hover-color': SPACE_STATUS[status.value].bgHoverColor
    };
});
const isActive = computed(() => {
    return currentSpaceId.value === props.data.id;
});
const doorUnclosed = computed(() => {
    return getIotData(props.data.id, 'IOT_INFO_CODE_HANDLER_doorUnclosed');
});
const toMachineRoom = item => {
    goToSpace3DView(item, 'homeCard');
};
const openSpaceInfo = () => {
    if (props.data.id) {
        openDetailDrawer?.(props.data);
        currentSpaceId.value = props.data.id;
    }
};
const setMap = (mapData, item) => {
    if (item.status) {
        let converStatu = '';
        if (item.status === 'CONJECTURE_EXCEPTION') {
            converStatu = 'EXCEPTION';
        } else if (item.status === 'GENERAL_NORMAL') {
            converStatu = 'NORMAL';
        } else {
            converStatu = item.status;
        }

        if (mapData.get(converStatu)) {
            mapData.get(converStatu).number = mapData.get(converStatu).number + 1;
        } else {
            mapData.set(converStatu, {
                status: converStatu,
                order: SPACE_STATUS[converStatu].order,
                text: SPACE_STATUS[converStatu].name,
                number: 1
            });
        }
    }
};
const equipmentsWithStatus = computed(() => {
    const equipmentsInStatus = new Map();
    const arr = props.data.equipmentsInSpace || [];
    const DanegerEventsList = getObjectDanegerEventsList(props.data.id);
    DanegerEventsList.forEach(item => {
        setMap(equipmentsInStatus, item);
    });
    arr.forEach(item => {
        const list = getObjectDanegerEventsList(item.id);
        list.forEach(v => setMap(equipmentsInStatus, v));
    });
    return orderBy(Array.from(equipmentsInStatus.values()), ['order'], ['asc']);
});
const runningParameter = computed(() => {
    const relInfoCodeGroupConfigs = idDynaData?.value?.[props.data.id]?.relInfoCodeGroupConfigs || [];
    let relInfoCodeConfigs = relInfoCodeGroupConfigs?.find(item => item.groupCode === 'runningParameter')?.relInfoCodeConfigs || [];
    return relInfoCodeConfigs;
});
</script>
<style lang="less" scoped>
.space-card-item {
    height: 99px;
    background-color: var(--bg-color);
    padding: 12px;
    border-radius: 4px;
    color: var(--gray-800);
    border: 1px solid transparent;
    position: relative;
    cursor: pointer;
    flex-direction: column;
    gap: 16px;
    &:hover {
        border-color: var(--blue-500);
        &::before {
            position: absolute;
            content: '';
            left: 0;
            top: 0;
            height: 100%;
            width: 100%;
            background-color: rgba(92, 92, 92, 0.05);
        }
        .title-btn {
            display: block;
        }
    }
    &.is-active {
        border-color: var(--blue-500);
        background-color: var(--blue-500);
        color: var(--gray-0);
        .title-text {
            font-weight: 700;
        }
        &:hover {
            &::before {
                display: none;
            }
        }
        .title-btn {
            display: block;
            color: var(--gray-0);
        }
        .no-infoCode {
            color: var(--gray-0);
        }
    }
    &-title {
        position: relative;
        z-index: 1;
        gap: 4px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .title-left {
            flex: 1;
            min-width: 0;
            display: flex;
        }
        .title-text {
            flex: 1;
        }
        .title-btn {
            display: none;
            width: 72px;
            padding: 0 8px;
            color: var(--blue-500);
            border-radius: 2px;
            flex-shrink: 0;
            width: auto;
            &:hover {
                background-color: var(--alpha-30);
            }
        }
    }
    &-info {
        display: flex;
        gap: 8px;
        overflow: hidden;
        flex-wrap: wrap;
        height: calc(100% - 21px);
        & > div:only-child {
            width: 100%;
        }
        & > div {
            width: calc((100% - 16px) / 3);
        }
        .no-infoCode {
            // background: linear-gradient(90deg, rgba(255, 255, 255, 0.2) 30%, rgba(255, 255, 255, 0) 100%);
            // padding: 0 8px;
            color: var(--gray-600);
        }
    }
}
</style>
