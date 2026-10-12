<template>
    <m-modal v-model:visible="show" :append-to="$modalAppendTo" type="full" :need-scrollbar="false" :footer="false" @close="close">
        <template #header>
            <div class="header-container">
                <span class="main-title">{{ i18n.global.t('meos_control_web.floor_total') }}</span>
                <span class="sub-title">
                    <span class="bracket">(</span>
                    <span class="highlight">{{ i18n.global.t('meos_control_web.equipment_open') }}</span>
                    <span class="separator">/</span>
                    <span class="normal fw500">{{ i18n.global.t('common.total_count') }}</span>
                    <span class="bracket">)</span>
                </span>
            </div>
        </template>
        <template #content>
            <div class="floor-total-content" style="min-height: 300px; overflow-y: auto">
                <BuildCard v-for="build in buildGroups" :key="build.buildId" :build="build" />
            </div>
        </template>
    </m-modal>
</template>

<script setup>
import i18n from '@/localization';
import BuildCard from './BuildCard.vue';

const props = defineProps({
    dataSource: {
        type: Array,
        default: () => []
    }
});
const show = ref(false);
const emits = defineEmits(['close']);

const buildGroups = computed(() => {
    const groupsMap = new Map();
    const data = structuredClone(props.dataSource || []);
    // data.push(...props.dataSource);
    // data.push(...props.dataSource);
    // data.push(...props.dataSource.map(item => ({ ...item, buildId: item.buildId + '32' })));
    // data.push(...props.dataSource.map(item => ({ ...item, buildId: item.buildId + '33' })));
    // data.push(...props.dataSource.map(item => ({ ...item, buildId: item.buildId + '343' })));
    // data.push(...props.dataSource.map(item => ({ ...item, buildId: item.buildId + '3463' })));
    // data.push(...props.dataSource.map(item => ({ ...item, buildId: item.buildId + '34613' })));
    // data.push(...props.dataSource.map(item => ({ ...item, buildId: item.buildId + '346131' })));
    // data.push(...props.dataSource.map(item => ({ ...item, buildId: item.buildId + '346132' })));
    // data.push(...props.dataSource.map(item => ({ ...item, buildId: item.buildId + '346133' })));
    // data.push(...[props.dataSource[0], props.dataSource[1]].map(item => ({ ...item, buildId: item.buildId + '1' })));
    // data.push(...[props.dataSource[0], props.dataSource[1]].map(item => ({ ...item, buildId: item.buildId + '2' })));
    data.forEach(floor => {
        if (!groupsMap.has(floor.buildId)) {
            groupsMap.set(floor.buildId, {
                buildId: floor.buildId,
                buildName: floor.buildName,
                floors: []
            });
        }

        let totalCount = 0,
            openCount = 0,
            hasOpenData = false;

        (floor.statistics || []).forEach(stat => {
            totalCount += stat.totalCount || 0;
            if (stat.openCount !== null && stat.openCount !== undefined) {
                openCount += stat.openCount;
                hasOpenData = true;
            }
        });

        const finalOpenCount = hasOpenData ? openCount : null;

        if (totalCount > 0) {
            groupsMap.get(floor.buildId).floors.push({
                name: floor.name,
                totalCount,
                openCount: finalOpenCount
            });
        }
    });

    const validBuildings = Array.from(groupsMap.values()).filter(group => group.floors.length > 0);
    return validBuildings;
});

const close = () => {
    show.value = false;
    nextTick(() => {
        emits('close');
    });
};
onMounted(() => {
    show.value = true;
});
onUnmounted(() => {});
</script>

<style scoped lang="less">
.header-container {
    display: flex;
    align-items: center;
    width: 100%;
}

.main-title {
    font-size: 16px;
    font-weight: bold;
    color: var(--gray-800, #2e3742);
    margin-right: 8px;
}

.sub-title {
    font-size: 14px;
    display: flex;
    align-items: center;

    .bracket,
    .separator {
        color: var(--gray-500, #8a939e);
    }

    .highlight {
        color: var(--turquoise-700, #00a3a8);
        font-weight: bold;
        margin: 0 4px;
    }

    .normal {
        color: var(--gray-800, #2e3742);
        margin: 0 4px;
    }
}

.floor-total-content {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-content: flex-start;
    height: 100%;
    gap: 16px;
    overflow-x: auto;
}
</style>
