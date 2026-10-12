<template>
    <div class="floor-select-warp">
        <div v-if="floors?.length" class="floor-warp">
            <slot name="top" />
            <span v-if="$slots.top" class="split up" />
            <div v-if="floors.length > 7" class="arrow-up arrow" :class="{ disabled: upDisable }" @click="turnPage('up')">
                <Arrow />
            </div>
            <span v-if="floors.length > 7" class="split up" />
            <div ref="floorList" class="floor-list">
                <template v-for="floor in floors" :key="floor.id + (floor.disabled ? 'disabled' : '')">
                    <div
                        v-if="floor.disabledTip && floor.disabled"
                        :id="`floor_${floor.id}`"
                        :key="floor.id + (floor.disabled ? 'disabled' : '')"
                        class="floor-item"
                        :class="{ selected: floor.id === selectId, disabled: floor.disabled, dot: floor.dot }"
                        @click="onChooseFloor(floor)"
                    >
                        {{ floor.localName || floor.localId }}
                    </div>
                    <div
                        v-else
                        :id="`floor_${floor.id}`"
                        class="floor-item"
                        :class="{ selected: floor.id === selectId, disabled: floor.disabled, dot: floor.dot }"
                        @click="onChooseFloor(floor)"
                    >
                        {{ floor.localName || floor.localId }}
                    </div>
                </template>
            </div>
            <span v-if="floors.length > 7" class="split bottom" />
            <div v-if="floors.length > 7" class="arrow-down arrow" :class="{ disabled: downDisable }" @click="turnPage('down')">
                <Arrow />
            </div>
            <span v-if="$slots.bottom" class="split bottom" />
            <slot name="bottom" />
        </div>
        <m-select v-if="buildingOptions.length > 1" id="floor-select-m-select" v-model="buildingId" :options="buildingOptions" :size="128" @change="handleChange"></m-select>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { ref, watch, unref, nextTick, computed } from 'vue';
import Arrow from '@/assets/images/common/arrow.svg';

const PageSize = 7;

const props = defineProps({
    floorId: {
        // 被选中的楼层id
        type: String,
        default: ''
    },
    buildingFloors: {
        type: Array,
        default: () => []
    },
    autoChooseFloor: {
        // 切换建筑时自动选择最后楼层
        type: Boolean,
        default: true
    }
});

const emit = defineEmits(['change']);

const floorList = ref();

const buildingId = ref(''); // 建筑id
const selectId = ref('');
const floors = ref([]);
const scrollTargetIndex = ref();

const buildingOptions = computed(() => {
    return props.buildingFloors?.map(obj => {
        return { ...obj, name: obj.localName || obj.name };
    });
});

// 旋转楼层
const chooseFloor = floor => {
    if (floor) {
        selectId.value = floor.id;
    } else {
        selectId.value = '';
    }
    emit('change', selectId.value, floor);
};

// 选择楼层事件
const onChooseFloor = floor => {
    if (!floor || floor.disabled) return;
    chooseFloor(floor);
};

// 初始化楼层选择器
const initFloors = () => {
    const { floorId, buildingFloors } = unref(props);
    let building;
    if (floorId) {
        building = buildingFloors.find(b => {
            const floor = b.floorList.find(f => f.id === floorId);
            if (floor) return true;
            return false;
        });
    } else if (buildingId.value) {
        building = buildingFloors.find(b => b.id === buildingId.value);
    }
    selectId.value = floorId;

    if (!building) {
        building = buildingFloors.find(b => !b.disabled); // 选中第一个不禁用的建筑
    }

    if (building) {
        buildingId.value = building.id;
        floors.value = building.floorList;
        if (!selectId.value && props.autoChooseFloor) {
            // 选中最后一个不禁用的 楼层
            const floor = [...floors.value].reverse().find(f => !f.disabled);
            chooseFloor(floor);
        }
    } else {
        buildingId.value = '';
        selectId.value = '';
        floors.value = [];
    }
};

const isElementOutOfParent = element => {
    const parent = element.parentNode,
        parentHeight = parent.offsetHeight,
        parentScrollTop = parent.scrollTop,
        elementTop = element.offsetTop,
        elementHeight = element.offsetHeight;

    if (elementTop < parentScrollTop || elementTop + elementHeight > parentScrollTop + parentHeight) {
        return true;
    }
    return false;
};

// 滚动视图层操作
const scroll = (floor, index, byTurnPage = true) => {
    nextTick(() => {
        if (!floorList.value) return;
        const $target = floorList.value.querySelector(`#floor_${floor.id}`);
        const $choose = floorList.value.querySelector(`#floor_${selectId.value}`);
        if (byTurnPage || scrollTargetIndex.value === undefined || isElementOutOfParent($choose)) {
            $target?.scrollIntoView({ block: 'start', behavior: byTurnPage ? 'smooth' : 'instant' });
            scrollTargetIndex.value = index;
        }
    });
};

// 计算初始滚动位置
const cacalScroll = () => {
    const rFloors = [...floors.value].reverse();
    let index = rFloors.findIndex(floor => floor.id === selectId.value);
    index = index > -1 ? index : 0;
    if (index > -1) {
        const diff = (index + 1) % PageSize;
        let targeIndex = index - diff + (diff > 0 ? PageSize : 0);
        if (targeIndex >= rFloors.length) {
            targeIndex = rFloors.length - 1;
        }
        scroll(rFloors[targeIndex], targeIndex, false);
    } else {
        scrollTargetIndex.value = undefined;
        // console.log('rFloors[0]: ', rFloors[0]);
        // scroll(rFloors[0], 0, false);
    }
};

// 翻页
const turnPage = type => {
    if (type === 'down' && !downDisable.value) {
        const rFloors = [...floors.value].reverse();
        const diff = (scrollTargetIndex.value + 1) % PageSize;
        const targeIndex = scrollTargetIndex.value - (diff || PageSize);
        scroll(rFloors[targeIndex], targeIndex);
    }

    if (type === 'up' && !upDisable.value) {
        const rFloors = [...floors.value].reverse();
        let targetIndex = scrollTargetIndex.value + PageSize;
        if (targetIndex >= rFloors.length) {
            targetIndex = rFloors.length - 1;
        }
        const targeIndex = targetIndex;
        scroll(rFloors[targeIndex], targeIndex);
    }
};

// 禁用上翻
const upDisable = computed(() => {
    if (scrollTargetIndex.value !== undefined) {
        if (floors.value.length - 1 <= scrollTargetIndex.value) return true;
        return false;
    }
    return false;
});

// 禁用下翻
const downDisable = computed(() => {
    if (scrollTargetIndex.value !== undefined) {
        if (scrollTargetIndex.value / PageSize < 1) return true;
        return false;
    }
    return false;
});

watch(
    [() => props.floorId, () => props.buildingFloors],
    ([newFloorId, nb], [oldFlooId, ob]) => {
        if (newFloorId === selectId.value && nb === ob) return;
        if (nb !== ob) scrollTargetIndex.value = undefined;
        initFloors();
        cacalScroll();
    },
    { immediate: true }
);

const handleChange = buildId => {
    const { buildingFloors } = unref(props);

    const building = buildingFloors.find(b => {
        return b.id === buildId;
    });

    buildingChange(building.id, building);
    emit('changeBuilding', building.id, building);
};

// 切换建筑
const buildingChange = (id, obj) => {
    scrollTargetIndex.value = undefined;
    buildingId.value = id;
    floors.value = obj.floorList;

    // 默认选中最后一个楼层
    if (props.autoChooseFloor) {
        const floor = [...floors.value].reverse().find(f => !f.disabled);
        chooseFloor(floor);
    }
    if (!floors.value?.length) {
        chooseFloor();
    }
    cacalScroll();
};

defineExpose({
    buildingId
});
</script>
<style lang="less">
#floor-select-m-select {
    position: absolute;
    bottom: 8px;
}
</style>

<style lang="less" scoped>
.floor-select-warp {
    height: 100%;
    position: absolute;
    top: 0;
    left: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    z-index: 15;

    .floor-warp {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 6px 4px;
        background: @white;
        box-shadow: 0 22px 40px rgba(98, 108, 120, 0.08), 0 14px 26px rgba(98, 108, 120, 0.04), 0 0 4px rgba(98, 108, 120, 0.15);
        border-radius: 4px;
        pointer-events: auto;

        .arrow {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 16px;
            cursor: pointer;
            border-radius: 2px;
            width: calc(100% - 4px);

            svg {
                path {
                    fill: @grey-500;
                }
            }

            &:hover {
                background-color: @grey-200;
            }

            &.arrow-up {
                margin-bottom: 4px;

                svg {
                    transform: rotateZ(180deg);
                }
            }

            &.arrow-down {
                margin-top: 4px;

                svg {
                    path {
                        fill: @grey-500;
                    }
                }
            }

            &.disabled {
                cursor: no-drop;

                svg {
                    path {
                        fill: @grey-300;
                    }
                }
            }
        }

        .split {
            width: 20px;
            height: 1px;
            background-color: @grey-400;

            &.up {
                margin-bottom: 2px;
            }

            &.bottom {
                margin-top: 2px;
            }
        }

        .floor-list {
            display: flex;
            flex-direction: column;
            gap: 4px;
            max-height: 252px;
            overflow: hidden;
            // padding: 2px 0;
            position: relative;

            .floor-item {
                flex-shrink: 0;
                padding: 0 4px;
                gap: 10px;
                // width: 36px;
                // min-width: 32px;
                // max-width: 48px;
                white-space: nowrap;
                overflow: hidden;
                height: 32px;
                border-radius: 4px;
                color: @grey-900;
                font-weight: var(--platform-font-weight);
                font-size: 14px;
                line-height: 32px;
                text-align: center;
                cursor: pointer;
                position: relative;

                &.dot::after {
                    content: '';
                    box-sizing: border-box;
                    position: absolute;
                    right: 0;
                    top: 0;
                    width: 8px;
                    height: 8px;
                    border: 1px solid @white;
                    border-radius: 8px;
                    background-color: @red-500;
                }

                &:hover {
                    background-color: @grey-200;
                }

                &.selected {
                    background-color: var(--blue-500);
                    color: @white;
                }

                &.disabled {
                    cursor: no-drop;
                    color: @grey-400;
                    background-color: unset;

                    &.selected {
                        background-color: @grey-400;
                        color: @white;
                    }
                }
            }
        }
    }
}
</style>
