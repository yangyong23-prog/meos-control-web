<template>
    <div ref="buildCardRef" class="build-card">
        <div class="build-header">
            <span v-ellipsis class="build-name m-ellipsis">{{ build.buildName }}</span>
        </div>
        <div ref="bodyRef" class="build-body">
            <div v-for="floor in build.floors" :key="floor.name" class="floor-item">
                <span v-ellipsis class="floor-name m-ellipsis">{{ floor.name }}</span>
                <div v-ellipsis class="floor-stats m-ellipsis">
                    <span :class="getOpenCountClass(floor.openCount)">{{ formatOpenCount(floor.openCount) }}</span>
                    /{{ floor.totalCount }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';

const props = defineProps({
    build: {
        type: Object,
        required: true
    }
});

const formatOpenCount = openCount => {
    if (openCount === null || openCount === undefined) {
        return i18n.global.t('common.no_data_short');
    }
    return openCount;
};

const getOpenCountClass = openCount => {
    if (openCount === null || openCount === undefined) {
        return 'open-count no-data';
    }
    return 'open-count normal-data';
};
const bodyRef = ref(null);
const buildCardRef = ref(null);
let resizeOb = null;

const updateCardWidth = () => {
    if (bodyRef.value && buildCardRef.value) {
        buildCardRef.value.style.width = bodyRef.value.scrollWidth + 10 + 'px';
    }
};

onMounted(() => {
    // 将bodyRef的scrollWidth，设置为buildCardRef的width
    updateCardWidth();

    if (bodyRef.value) {
        resizeOb = new ResizeObserver(() => {
            updateCardWidth();
        });
        resizeOb.observe(bodyRef.value);
    }
});

onUnmounted(() => {
    resizeOb?.disconnect();
    resizeOb = null;
});
</script>

<style scoped lang="less">
.build-card {
    background-color: var(--white, #ffffff);
    border-radius: 4px;
    border: 1px solid var(--gray-200, #e8ecf0);
    max-height: 100%;
    min-height: 300px;
    padding: 0 4px;
}

.build-header {
    background-color: var(--gray-200, #f1f4f6);
    border-bottom: 1px solid var(--gray-200, #e1e5eb);
    height: 32px;
    display: flex;
    align-items: center;
    padding: 0 12px;
    margin: 0 -4px;
    .build-name {
        font-size: 14px;
        font-weight: bold;
        color: var(--gray-800, #2e3742);
    }
}

.build-body {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-content: flex-start;
    max-height: calc(100% - 32px);
    width: 100%;
    margin: 4px 0;
}

.floor-item {
    border-radius: 4px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px;
    width: 180px;
    box-sizing: border-box;
    cursor: default;
    .floor-name {
        font-size: 14px;
        color: var(--gray-600, #626c78);
        flex: 0 0 64px;
        margin-right: 4px;
    }

    .floor-stats {
        font-size: 14px;
        width: calc(100% - 64px);

        .open-count {
            &.normal-data {
                color: var(--turquoise-700, #00a3a8);
            }
            &.no-data {
                color: var(--gray-400, #c4c9cf);
            }
        }

        .separator {
            color: var(--gray-500, #8a939e);
            margin: 0 4px;
        }

        .total-count {
            color: var(--gray-900, #1a2028);
            width: 36px;
        }
    }

    &:hover {
        background-color: var(--gray-400-alpha-30, rgba(196, 201, 207, 0.3));
    }
}
</style>
