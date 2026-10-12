<template>
    <AuxiliaryLine
        ref="AuxiliaryLineRef"
        v-model="time"
        class="space-list-aabbcc"
        :times="fifteenMinuteTimes"
        :show="true"
        :default-left="172"
        :default-right="20"
        :default-top="-28"
    >
        <TimeIntervalLines :start-time="startTime" :end-time="endTime" />
        <m-scrollbar class="space-wrap">
            <div v-for="item in flatBuildingFloorSpaces" :key="item.id + spaceType" class="list-item fcc" :class="{ [item.type]: true }">
                <div v-ellipsis class="list-item-name m-ellipsis" :style="getTextColor(item)">{{ item.name }}</div>
                <div v-if="item.type === 'building'" style="flex: 1"></div>
                <div v-if="item.type === 'floor'" class="list-item-line"></div>
                <div v-if="item.type === 'space'" class="list-item-states fc">
                    <div class="w100" style="height: 10px">
                        <StateProgressBar :bars="getStateBars(item)" />
                    </div>
                </div>
            </div>
        </m-scrollbar>
    </AuxiliaryLine>
</template>

<script setup>
import AuxiliaryLine from './AuxiliaryLine.vue';
import { AIR_SPACE_STATUS, AIR_SPACE_STATUS_CO2, AIR_SPACE_STATUS_TDB, AIR_SPACE_STATUS_HUMIDITY } from '../variable';
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
const AIR_SPACE_STATUS_OBJ = { ...AIR_SPACE_STATUS_CO2, ...AIR_SPACE_STATUS_TDB, ...AIR_SPACE_STATUS_HUMIDITY };

const getStateBars = data => {
    let bars = [];
    bars = data.timeRanges.map(item => {
        return { color: AIR_SPACE_STATUS_OBJ[item.status]?.color, start: item.startStr, end: item.endStr };
    });
    return bars;
};
const getTextColor = data => {
    for (let index = 0; index < props.currentMapSpaces.length; index++) {
        const element = props.currentMapSpaces[index];
        if (data.id === element.id) {
            return element.status !== AIR_SPACE_STATUS.NORMAL ? { color: AIR_SPACE_STATUS_OBJ[element.status]?.textColor } : '';
        }
    }
};

onMounted(() => {
    AuxiliaryLineRef.value.hidePanel();
});
</script>
<style lang="less">
.space-list-aabbcc {
    position: relative;
    height: calc(100% - 122px) !important;
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
