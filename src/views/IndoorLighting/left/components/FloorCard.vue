<template>
    <div class="floor-card">
        <div class="floor-card-header fcb" @click="$emit('clickFloor', data)">
            <div class="fw700 fs18 fc" style="padding-left: 4px">
                {{ data.localName }}
                <div v-if="abnormalList?.length" class="abnormal-number fs14 fw500 fc">
                    {{ i18n.global.t('meos_control_web.abnormal_event_colon')
                    }}<span class="fw700">{{ i18n.global.t('meos_control_web.certain_number', { count: abnormalList?.length }) }}</span>
                </div>
            </div>
            <div class="floor-btn">
                <m-button type="link" size="small">{{ i18n.global.t('meos_control_web.enter_floor') }}</m-button>
            </div>
        </div>
        <div class="floor-card-content">
            <div
                v-for="item in statusList"
                v-show="item.rule !== false || item.id !== INFOCODE.localRemoteStatus0.id"
                :key="item.name"
                class="list-item"
                :class="staticDetailInfo?.instanceId === data.id && item.id === staticDetailInfo?.staticId ? 'is-active' : ''"
                :style="{ cursor: item.disabled ? 'default' : 'pointer' }"
                @click="item.disabled ? () => {} : openStaticlDrawer(item.type, data.localName, INSTANCE_TYPE.FLOOR, data.id, undefined, item.id)"
            >
                <!--  -->
                <div
                    v-ellipsis="{ class: ['value-ellipsis'] }"
                    class="ffCP fw600 fs20 m-ellipsis"
                    :style="{ color: item.color }"
                    :class="[item.list.length ? 'has-value' : 'no-value']"
                >
                    <InfoCodeNumber v-model="item.list" v-bind="item" v-model:rule="item.rule" :objects="data.loops" class="fw600 ffCP" style="margin-left: 2px" />
                </div>
                <div v-ellipsis class="m-ellipsis list-item-text" :style="{ color: item.color ? 'var(--gray-600)' : '' }" :class="[item.list.length ? '' : 'no-value']">
                    {{ item.aliasName || item.name }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import InfoCodeNumber from '@/views/IndoorLighting/components/StatusNumber/InfoCodeNumber.vue';
import { INFOCODE, INSTANCE_TYPE } from '../../variables';
import DockSingleton from '@/hooks/responsiveDock';
import { getAbnormalIdsByFloorIdKey, floorLoopListKey } from '../../hooks/useBaseHook';
import { uniqBy } from 'lodash';
import { openStaticlDrawerKey, staticDetailInfoKey } from '../../hooks/useDrawerCommon';
import { useWatchWithCleanup } from '@/hooks/useWatchEffectWithCleanup';

const openStaticlDrawer = inject(openStaticlDrawerKey);
const staticDetailInfo = inject(staticDetailInfoKey, ref({}));
const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    }
});
const { getAbnormalEventsList } = DockSingleton.getInstance();
const floorLoopList = inject(floorLoopListKey, ref(new Map()));
const statusList = ref([
    { ...INFOCODE.runStatus1, color: 'var(--gray-700)', list: [], disabled: true },
    {
        ...INFOCODE.localRemoteStatus0,
        list: [],
        rule: true
    },
    {
        ...INFOCODE.controlDeviationStatus1,
        list: []
    },
    {
        ...INFOCODE.controlDeviationStatus2,
        list: []
    },
    {
        ...INFOCODE.runStatusNull,
        list: []
    }
]);
const getAbnormalIdsByFloorId = inject(getAbnormalIdsByFloorIdKey);
const abnormalIds = computed(() => getAbnormalIdsByFloorId(props.data.id) || []);
const abnormalList = computed(() => {
    const arr = getAbnormalEventsList(abnormalIds.value);
    const list = uniqBy(arr, 'exceptionEventId');
    floorLoopList.value.get(props.data.id)[INFOCODE.abnormalEvent.id] = list.length;
    return list;
});
useWatchWithCleanup(
    () => statusList.value,
    () => {
        statusList.value.forEach(item => {
            floorLoopList.value.get(props.data.id)[item.id] = item.list.length;
        });
    },
    {
        deep: true
    }
);
</script>
<style lang="less" scoped>
.floor-card {
    height: 114px;
    background-color: #ffffff90;
    border-radius: 8px;
    padding: 8px 8px 8px 16px;
    border: 1px solid #ffffff90;
    overflow: hidden;

    &:hover {
        border: 1px solid var(--blue-500);
        .floor-btn {
            opacity: 1;
        }
        .list-item {
            .ffCP {
                color: var(--color);
            }
            .has-value,
            .no-value {
                color: var(--blue-500);
            }
            .list-item-text.no-value {
                color: var(--blue-500);
            }
        }
    }

    &-header {
        height: 26px;
        margin-bottom: 16px;
        cursor: pointer;
        .floor-btn {
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
    &-content {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 8px;
        height: 54px;
        .list-item {
            cursor: pointer;
            transition: all 0.3s ease;
            padding: 4px;
            border-radius: 4px;
            &:hover {
                background-color: var(--alpha-30);
            }
            .list-item-text {
                color: var(--gray-600);
                margin-top: 2px;
                &.no-value {
                    color: var(--gray-600);
                }
            }
            .has-value {
                color: #ff992d;
            }
            .no-value {
                color: var(--gray-400);
            }
            &.is-active {
                color: var(--blue-500);
                background-color: var(--blue-100);
                .has-value,
                .no-value {
                    color: var(--blue-500);
                }
            }
        }
    }
}
</style>
<style lang="less">
.value-ellipsis {
    .info-code-number {
        color: #fff !important;
        font-weight: 400;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'PingFang SC', 'Noto Sans', 'Noto Sans CJK SC', 'Microsoft YaHei', sans-serif;
    }
}
</style>
