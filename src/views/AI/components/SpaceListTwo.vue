<template>
    <AuxiliaryLine
        ref="AuxiliaryLineRef"
        v-model="time"
        class="space-list-aabbccdd"
        :times="fifteenMinuteTimes"
        :show="true"
        :default-left="172"
        :default-right="20"
        :default-top="-28"
    >
        <TimeIntervalLines :start-time="startTime" :end-time="endTime" />
        <m-scrollbar class="space-wrap">
            <div v-for="item in flatBuildingFloorSpaces" :key="item.id + spaceType" class="list-item fcc" :class="{ [item.type]: true }">
                <div v-ellipsis class="list-item-name m-ellipsis">{{ item.name }}</div>
                <div v-if="item.type === 'building'" style="flex: 1"></div>
                <div v-if="item.type === 'floor'" class="list-item-line"></div>
                <div v-if="item.type === 'space'" class="list-item-states fc">
                    <div class="w100" style="height: 10px">
                        <StateProgressBar v-if="item.workRanges" :bars="getStateBars(item.workRanges)" style="height: 50%" />
                        <StateProgressBar :bars="getStateBars(item.timeRanges)" :style="{ height: item.workRanges ? '50%' : '100%' }" />
                    </div>
                </div>
            </div>
        </m-scrollbar>
    </AuxiliaryLine>
</template>

<script setup>
import AuxiliaryLine from './AuxiliaryLine.vue';
import { DEMAND, DEMAND_TAGS } from '../variable';
import StateProgressBar from './StateProgressBar.vue';
import TimeIntervalLines from './TimeIntervalLines.vue';

const props = defineProps({
    flatBuildingFloorSpaces: {
        type: Array,
        default: () => []
    },
    currentMapSpaces: {
        type: Array,
        default: () => []
    },
    fifteenMinuteTimes: {
        type: Array,
        default: () => []
    },
    spaceType: {
        type: String,
        default: ''
    },
    startTime: {
        type: String,
        default: ''
    },
    endTime: {
        type: String,
        default: ''
    }
});
const time = defineModel({ type: String, default: '12:00' });
const AuxiliaryLineRef = ref();
const TAGS_OBJ = { ...DEMAND_TAGS };

const getStateBars = timeRanges => {
    let bars = [];
    bars = timeRanges.map(item => {
        if (props.spaceType === DEMAND) {
            return { color: TAGS_OBJ[item.status]?.color, start: item.startStr, end: item.endStr };
        } else {
            return { color: item.status?.color, start: item.startStr, end: item.endStr };
        }
    });
    return bars;
};
onMounted(() => {
    AuxiliaryLineRef.value.hidePanel();
});
</script>
<style lang="less">
.space-list-aabbccdd {
    position: relative;
    height: calc(100% - 132px) !important;
    :deep(.auxiliary-line-box-select) {
        z-index: 17;
    }
    .list-item {
        height: 22px;
        border-radius: 4px;
        padding: 0 0 0 4px;
        &.building {
            font-weight: 700;
            position: sticky;
            top: 0;
            height: 30px;
            padding: 4px;
            background-color: var(--gray-0);
        }
        &.floor {
            font-weight: 700;
            .list-item-name {
                width: max-content;
            }
        }
        &.space {
            margin-bottom: 12px;
            .list-item-name {
                text-align: right;
            }
            &:hover {
                background-color: var(--alpha-30);
            }
            &.is-active {
                .list-item-name {
                    font-weight: 700;
                }
                background-color: var(--blue-100);
                &:hover {
                    background-color: var(--blue-100);
                }
            }
        }
        &-name {
            width: 140px;
            margin-right: 8px;
            text-indent: 4px;
            color: var(--gray-600);
        }
        &-line {
            height: 1px;
            flex: 1;
            background-color: var(--gray-300);
        }
        &-states {
            height: 100%;
            width: calc(100% - 148px);
        }
    }
}
.space-wrap {
    padding: 0 20px;
    :deep(.m-scrollbar__content) {
        padding-bottom: 24px;
    }
}
</style>
