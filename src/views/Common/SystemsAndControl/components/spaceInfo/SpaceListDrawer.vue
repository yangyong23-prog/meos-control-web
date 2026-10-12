<template>
    <m-drawer :append-to="$drawerAppendTo" :show="show" drawer-class="space-list-drawer" :z-index="Z_INDEX.commonDrawer" @close="close">
        <template #title>
            {{ data.title }}
        </template>
        <template #content>
            <template v-if="spaceTree.length">
                <div v-if="data.key === 'noData' || data.key === 'isConfiguration'" style="color: var(--gray-600); padding-top: 16px; padding-left: 20px">
                    {{
                        data.key === 'noData'
                            ? i18n.global.t('meos_control_web.some_spaces_no_temper_data', { count: data.data.length })
                            : i18n.global.t('meos_control_web.some_spaces_no_temper_standard', { count: data.data.length })
                    }}
                </div>
                <m-scrollbar>
                    <div style="margin-top: 8px; margin-bottom: 20px">
                        <template v-if="buildIdsArr.length === 1">
                            <template v-for="item in spaceTree" :key="item.buildingId">
                                <SpaceItem v-for="space in item.spaces" :key="space.id" :data="space" :code="data.key" />
                            </template>
                        </template>
                        <m-collapse v-else v-model="collapseData" icon-position="left">
                            <m-collapse-item v-for="item in spaceTree" :id="item.buildingId" :key="item.buildingId" :title="item.buildingName">
                                <template #title>
                                    <span style="color: var(--gray-500)">{{ item.buildingName }}</span>
                                </template>
                                <SpaceItem v-for="space in item.spaces" :key="space.id" :data="space" :code="data.key" />
                            </m-collapse-item>
                        </m-collapse>
                    </div>
                </m-scrollbar>
            </template>
            <template v-else>
                <div class="h100 fcc">
                    <m-illustration :title="i18n.global.t('common.no_data')" type="noContent"></m-illustration>
                </div>
            </template>
        </template>
    </m-drawer>
</template>

<script setup>
import { Z_INDEX } from '@/constants/zIndex';
import { getListTreeBuildingFloorSpace } from '@/apis/xplantindoorenv3d';
import useStore from '@/store';
import { SUCCESSCODE } from '@/utils/globalVariables';
import SpaceItem from './SpaceItem.vue';
import DockSingleton from '@/hooks/responsiveDock';
import i18n from '@/localization';
import { useWatchWithCleanup } from '@/hooks/useWatchEffectWithCleanup';

const { getCustomInfo, getIotData } = DockSingleton.getInstance();
const showEquipmentInfo = inject('showEquipmentInfo', ref(false));
const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    }
});
const collapseData = ref([]);
const buildIdsArr = ref([]);
const { base } = useStore();
const show = ref(false);
const emits = defineEmits(['close']);
const close = () => {
    show.value = false;
    nextTick(() => {
        emits('close');
    });
};
const buildFloorMap = ref(new Map());

const handleTreeBuildingFloorData = async () => {
    buildFloorMap.value = new Map();
    const parasm = {
        projectId: base.projectId,
        isQuerySpace: false
    };
    const { data, code } = await getListTreeBuildingFloorSpace(parasm);

    if (code === SUCCESSCODE) {
        data.forEach(element => {
            buildIdsArr.value.push(element.id);
            buildFloorMap.value.set(element.id, element);
            element.floors.forEach((floor, i) => {
                floor.order = i;
                floor.buildingName = element.localName ?? '--';
                buildFloorMap.value.set(floor.id, floor);
            });
        });
    }
};
const setCollapseData = () => {
    const buildIds = new Set();
    props.data.data?.forEach(element => {
        buildIds.add(element.buildingId);
    });
    collapseData.value = Array.from(buildIds);
};

const spaceTree = computed(() => {
    let arr = [];
    const spaceMap = new Map();
    props.data.data?.forEach(space => {
        space.floorName = buildFloorMap.value.get(space.floorId)?.localName;
        space.sortId = buildFloorMap.value.get(space.floorId)?.floorSequenceId;
        const config = getCustomInfo(space.id, 'DEMAND_TARGET_TYPE', 'tdb');
        const data = config.dataSource?.find(item => item.code === config.dataValue);
        if (data) {
            config.dataValueName = data.name;
            if (data.code === 'TARGET_VALUE') {
                config.dataValueName = i18n.global.t('meos_control_web.un_schedule');
            }
        }
        space.DEMAND_CONFIG = getCustomInfo(space.id, 'DEMAND_CONFIG', 'tdb');
        space.DEMAND_TARGET_TYPE = config;
        space.tdb = getIotData(space.id, 'tdb');
        space.tempTwinControlAim = getIotData(space.id, 'tempTwinControlAim');
        if (spaceMap.get(space.buildingId)) {
            spaceMap.get(space.buildingId).spaces.push(space);
        } else {
            spaceMap.set(space.buildingId, {
                buildingId: space.buildingId,
                buildingName: buildFloorMap.value.get(space.buildingId)?.localName,
                spaces: [space]
            });
        }
    });
    arr = Array.from(spaceMap.values());
    arr.forEach(item => {
        item.spaces.sort((a, b) => a.sortId - b.sortId);
    });
    return arr;
});

onMounted(async () => {
    buildIdsArr.value = [];
    show.value = true;
    await handleTreeBuildingFloorData();
    setCollapseData();
});
useWatchWithCleanup(
    () => showEquipmentInfo.value,
    () => {
        close();
    }
);
</script>
<style lang="less">
@media (max-width: 1600px) {
    .space-list-drawer {
        .m-drawer-container {
            width: 400px !important;
        }
    }
}
@media (min-width: 1600px) {
    .space-list-drawer {
        .m-drawer-container {
            width: 480px !important;
        }
    }
}
.space-list-drawer {
    .m-drawer-mask,
    .m-drawer-container {
        top: 48px;
        z-index: 1;
    }
    .m-drawer-container {
        height: calc(100% - 48px) !important;
    }
    .m-drawer-container-content {
        padding: 0;
        .m-scrollbar {
            padding: 0 20px;
        }
        width: 100%;
        .m-collapse-item {
            --collapse-icon-size: 16px;
        }
        .m-collapse-item__header {
            padding: 4px 0;
        }
    }
}
</style>
