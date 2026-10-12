<template>
    <AuxiliaryLine
        ref="AuxiliaryLineRef"
        v-model="time"
        class="space-list-aabbcc"
        :times="fiveMinuteTimes"
        :show="true"
        :default-left="172"
        :default-right="20"
        :default-top="-32"
        :precision="5"
    >
        <div class="time-line fc">
            <div v-for="item in 7" :key="item" class="time-line-item" :class="{ start: item === 1, end: item === 7 }" :style="{ left: (((item - 1) * 4) / 24) * 100 + '%' }">
                {{ ((item - 1) * 4).toString().padStart(2, '0') }}:00
            </div>
        </div>
        <m-scrollbar class="space-wrap">
            <div
                v-for="item in flatBuildingFloorSpaces"
                :key="item.id"
                class="list-item fcc"
                :class="{ 'is-active': item.id === curSelectedSpace?.id, [item.type]: true }"
                @click="clickSpace(item)"
            >
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
import dayjs from 'dayjs';
import AuxiliaryLine from '../../components/AuxiliaryLine.vue';
import { clickSpaceKey, curSelectedSpaceKey, fiveMinuteTimesKey, curSelectedTimeKey } from '../../injectionKey';
import { AIR_SPACE_STATUS, AIR_SPACE_STATUS_CO2, AIR_SPACE_STATUS_TDB } from '../../variable';
import StateProgressBar from './StateProgressBar.vue';
import { generateTimeArrayByMinutes } from '@/utils/tools';
const props = defineProps({
    flatBuildingFloorSpaces: {
        type: Array,
        default: () => []
    },
    currentMapSpaces: {
        type: Array,
        default: () => []
    }
});
const clickSpace = inject(clickSpaceKey); // ==> src\views\runAnalysis\hooks\useSpaceAnalysis.js
const curSelectedSpace = inject(curSelectedSpaceKey); // ==> src\views\runAnalysis\hooks\useSpaceAnalysis.js
const fiveMinuteTimes = inject(fiveMinuteTimesKey); // ==> src\views\runAnalysis\hooks\useSpaceAnalysis.js
// const time = ref('12:00');
const time = inject(curSelectedTimeKey);
const AuxiliaryLineRef = ref();
const AIR_SPACE_STATUS_OBJ = { ...AIR_SPACE_STATUS_CO2, ...AIR_SPACE_STATUS_TDB };
const getStateBars = data => {
    let bars = [];
    const minutes = generateTimeArrayByMinutes(5);
    bars = data.timeRanges.map(item => {
        item.startStr = dayjs(item.start).format('HH:mm');
        item.endStr = dayjs(item.end).format('HH:mm');
        const startIndex = minutes.findIndex(val => val === item.startStr);
        let endIndex = minutes.findIndex(val => val === item.endStr);
        if (endIndex === minutes.length - 1) {
            endIndex = minutes.length;
        }
        const values = [startIndex / minutes.length, endIndex / minutes.length];
        return { values, startIndex, endIndex, color: AIR_SPACE_STATUS_OBJ[item.status]?.color, zIndex: item.zIndex, start: item.startStr, end: item.endStr };
    });
    console.log(bars);
    return bars;
};
const getTextColor = data => {
    for (let index = 0; index < props.currentMapSpaces.length; index++) {
        const element = props.currentMapSpaces[index];
        if (data.id === element.id) {
            return element.status !== AIR_SPACE_STATUS.APPROPRIATE ? { color: AIR_SPACE_STATUS_OBJ[element.status].textColor } : '';
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
    height: calc(100% - 108px) !important;
    :deep(.auxiliary-line-box-select) {
        z-index: 17;
    }
    .time-line {
        position: absolute;
        top: 0;
        width: calc(100% - 192px);
        left: 172px;
        height: 27px;
        padding-top: 4px;
        border-top: 1px solid var(--gray-200);
        background-color: var(--gray-0);
        z-index: 3;
        .start {
            transform: translateX(0);
        }
        .end {
            transform: translateX(-100%);
        }
        &-item {
            text-align: left;
            position: absolute;
            transform: translateX(-50%);
        }
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
            cursor: pointer;
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
