<template>
    <div class="floor-anchor-scroll-wrapper">
        <template v-for="(item, index) in floors" :key="item.id">
            <div
                :id="`floor_scroll_anchor_${item.id}`"
                :class="{
                    row: true,
                    abnormal: item.abnormal,
                    'has-name': show(index),
                    first: index === 0,
                    last: index === floors.length - 1
                }"
                @click="handleClick(item)"
            >
                <div v-show="show(index) || !!isHoverMap[index]" v-ellipsis :class="['name', 'm-ellipsis']">{{ item.name || item.floorLocalId }}</div>

                <div class="mark-container" @mouseenter="handleMouse(index, true)" @mouseleave="handleMouse(index, false)">
                    <div class="circle"></div>
                    <div class="mark" />
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
const props = defineProps({
    floors: {
        type: Array,
        default: () => []
    }
});

const isHoverMap = ref({});

const handleMouse = (index, hover) => {
    isHoverMap.value[index] = hover;
};

const show = index => {
    return props.floors.length < 10 || index % 5 === 0 || index === 0 || index === props.floors.length - 1;
};

const emit = defineEmits(['floor-select']);
const handleClick = item => {
    emit('floor-select', item);
};

const scrollTo = obj => {
    const floorObj = props.floors.find(floor => {
        return floor.id === obj.id;
    });
    if (floorObj) {
        const floorObjDom = document.getElementById(`floor_scroll_anchor_${floorObj.id}`);
        if (floorObjDom) {
            floorObjDom.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest'
            });
        }
        handleClick(floorObj);
    }
};
defineExpose({
    scrollTo
});
</script>

<style lang="less" scoped>
.floor-anchor-scroll-wrapper {
    width: 58px;
    padding-top: 30px;
    padding-right: 8px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    .row {
        position: relative;
        width: 50px;
        height: 24px;
        border-right: 1px solid #c4c9cf;
        display: flex;
        column-gap: 2px;
        align-items: center;
        justify-content: flex-end;
        cursor: pointer;
        user-select: none;

        &:hover {
            .name {
                color: #246fe5;
            }
            .mark {
                background-color: #246fe5;
            }
        }

        .name {
            color: @grey-700;
            font-size: 14px;
            font-weight: 700;
            line-height: 100%;
            text-align: right;
            cursor: pointer;
        }

        .mark-container {
            min-width: 12px;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            column-gap: 0px;
        }

        .circle {
            width: 5px;
            height: 5px;
            background-color: #f55047;
            border-radius: 50%;
            cursor: pointer;
            visibility: hidden;
        }

        .mark {
            width: 12px;
            height: 1px;
            background-color: #c4c9cf;
            cursor: pointer;
        }
    }

    .has-name {
        height: 48px;
    }

    .first {
        border-right: none;
        .mark-container {
            &::after {
                position: absolute;
                content: '';
                bottom: 0px;
                right: 0px;
                width: 1px;
                height: 50%;
                background-color: #c4c9cf;
            }
        }
    }

    .last {
        border-right: none;

        .mark-container {
            &::after {
                position: absolute;
                content: '';
                top: 0px;
                right: 0px;
                width: 1px;
                height: 50%;
                background-color: #c4c9cf;
            }
        }
    }

    .abnormal {
        .name {
            color: #f55047;
        }
        .circle {
            visibility: visible;
        }
        .mark {
            background-color: #f55047;
        }
    }
}
</style>
