<template>
    <div class="space-passenger-flow">
        <div v-for="(item, index) in spacePassengerFlowData" :key="index + 'b'" class="bild-box">
            <!-- <div v-if="index === 0" class="bild-box-tag">
                <span class="bild-box-top-tag-title">{{ i18n.global.t('meos_control_web.space_status_colon') }}</span>
                <div v-for="legend in legendData" :key="legend.status" class="tag-list">
                    <i class="tag" :style="{ backgroundColor: legend.color }"></i>
                    <span class="tag-name">{{ legend.name }}</span>
                </div>
            </div> -->
            <div class="bild-box-container">
                <div
                    v-for="(space, spaceIndex) in item.floors"
                    :id="`floor_${item.buildingId}-${space.floorId}`"
                    :key="spaceIndex + 'a'"
                    class="space-passenger-flow-item"
                    @mouseenter.stop="mouseenterFloor(space)"
                    @mouseleave.stop="mouseleaveFloor(space)"
                >
                    <div class="space-passenger-flow-item-top" :style="{ width: '100%' }">
                        {{ item.buildingLocalName }}-{{ space.floorLocalName }}
                        <span class="entry-floor-btn" @click.stop="changeFloors(space, item.buildingLocalName)">{{ i18n.global.t('meos_control_web.enter_floor') }}</span>
                    </div>
                    <div
                        class="space-passenger-flow-item-bottom"
                        :class="{
                            scrollActive: space.floorId === floorId
                        }"
                    >
                        <div v-for="passenger in space.spaces" :key="passenger.name">
                            <FlowItem :passenger="passenger" @change-passenger-flow="changePassengerFlow"></FlowItem>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import FlowItem from './FlowItem.vue';
const props = defineProps({
    spacePassengerFlowData: {
        type: Array,
        default: () => []
    }
});
const emits = defineEmits(['changePassengerFlow', 'changeFloors']);
const legendData = inject('legendData');
const floorId = ref('');
const unitId = ref('');
const activeFloor = ref({ time: '', floorOrder: '' });
const hoverFloor = ref(false);
const changePassengerFlow = item => {
    emits('changePassengerFlow', item);
};
const changeFloors = (item, buildingName) => {
    emits('changeFloors', item, buildingName);
};
const scrollFloor = item => {
    if (item.floorId) {
        floorId.value = item.floorId;
        unitId.value = item.unitId;
        activeFloor.value = {
            floorOrder: `${item.unitId}-${item.floorId}`,
            time: Date().valueOf()?.toString()
        };
        nextTick(() => {
            const ele = document.getElementById(`floor_${activeFloor.value.floorOrder}`);
            ele?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
            });
        });
        setTimeout(() => {
            floorId.value = '';
        }, 2000);
    }
};
const mouseenterFloor = item => {
    item.hoverFloor = true;
};

const mouseleaveFloor = item => {
    item.hoverFloor = false;
};

onUnmounted(() => {
    activeFloor.value = {
        floorOrder: '',
        time: ''
    };
});
defineExpose({
    scrollFloor
});
</script>

<style lang="less" scoped>
.space-passenger-flow {
    width: 100%;
    padding-inline: 16px;
    padding-bottom: 16px;
    margin-top: 8px;
    .bild-box {
        position: relative;
        &-tag {
            color: #626c78;
            font-size: 14px;
            line-height: 22px;
            display: flex;
            position: absolute;
            right: 0;
            top: 8px;
            &-title {
                margin-right: 4px;
            }
            .tag-list {
                display: flex;
                align-items: center;
                margin-right: 12px;
                .tag {
                    display: inline-block;
                    width: 14px;
                    height: 14px;
                    border-radius: 2px;
                    opacity: 0.5;
                    margin-right: 4px;
                }
                .tag-name {
                    color: #1b2129;

                    font-size: 14px;
                    line-height: 22px;
                }
                &:last-of-type {
                    margin-right: 0;
                }
            }
        }
        &-container {
            .space-passenger-flow-item {
                &-top {
                    padding-left: 4px;
                    color: #2e3742;
                    font-size: 18px;
                    height: 40px;
                    line-height: 40px;
                    font-weight: 700;
                    margin: 8px 0;
                    position: sticky;
                    top: 0;
                    background-color: #f1f4f6;
                    display: flex;
                    align-items: center;
                    &:hover {
                        border-radius: 4px;
                        background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
                    }
                    .entry-floor-btn {
                        color: var(--blue-500);
                        font-size: 14px;
                        font-style: normal;
                        font-weight: var(--platform-font-weight);
                        line-height: 22px;
                        padding: 4px;
                        cursor: pointer;
                    }
                }
                &-bottom {
                    flex: 1;
                    display: grid;
                    grid-gap: 12px;
                }
            }
        }
    }
    .scrollActive {
        animation: 850ms cubic-bezier(0.25, 0.1, 0.25, 1) 50ms 2 fadeGray;
    }
}
@media (min-width: 1801px) {
    .space-passenger-flow-item-bottom {
        grid-template-columns: repeat(5, 1fr);
    }
}

@media (min-width: 1601px) and (max-width: 1800px) {
    .space-passenger-flow-item-bottom {
        grid-template-columns: repeat(4, 1fr);
    }
}

@media (max-width: 1600px) {
    .space-passenger-flow-item-bottom {
        grid-template-columns: repeat(3, 1fr);
    }
}
@keyframes fadeGray {
    0% {
        background-color: initial;
    }
    35.29% {
        background-color: @grey-300;
    }
    41.18% {
        background-color: @grey-300;
    }
    100% {
        background-color: initial;
    }
}
</style>
