<template>
    <m-scrollbar class="space-zone wh100" :max-height="maxHeight">
        <div class="space-zone-name group-name-detail-configuration fc">{{ data.name }}</div>
        <template v-if="!buildList.length && !loading">
            <div v-if="lottieName === 'ball'" class="no-data fc" style="height: calc(100% - 40px); width: 100%; position: absolute; top: 0; left: 0">
                <m-illustration :title="i18n.global.t('common.no_data')" type="noContent"></m-illustration>
            </div>
            <div v-else style="height: 100px; color: var(--gray-500)" class="fcc">{{ i18n.global.t('common.no_data') }}</div>
        </template>
        <template v-else>
            <div v-for="build in buildList" :key="build.id" class="build-list-item">
                <div v-if="treeBuildFloorStore()?.treeBuildFloor?.length > 1" class="build-list-item-name">{{ build.name }}</div>
                <div v-for="space in handleSpaces(build.spaces || [])" :key="space.id" class="space-list-item fc">
                    <div class="space-name">{{ space.localName }}</div>
                    <div class="space-floor">
                        <m-tag color="var(--blue-700)" bg-color="var(--blue-100)" size="small"> {{ space.floorName }} </m-tag>
                    </div>
                </div>
            </div>
        </template>
    </m-scrollbar>
</template>

<script setup>
import useLoading from '@/hooks/useLoading';
import { listObjectsByTackValueLogic } from '@/apis/public';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import treeBuildFloorStore from '@/store/treeBuildFloor';
import i18n from '@/localization';
import { orderBy } from 'lodash';
const { cancelQuest, cancelToken } = UseCancelTokenHooks();

const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    },
    maxHeight: {
        type: String,
        default: undefined
    },
    lottieName: {
        type: String,
        default: 'ball'
    }
});
const buildList = ref([]); // 楼宇列表
// 初始化loading方法
const { openLoading, closeLoading, loading } = useLoading(
    'space-zone',
    '#ffffff',
    props.lottieName,
    {
        width: '100px',
        height: '100px'
    },
    0
);
const getSpaceList = async () => {
    try {
        cancelQuest();
        openLoading();
        // 获取空间列表
        const res = await listObjectsByTackValueLogic(
            {
                takeValueLogic: {
                    queryParam: {
                        relationTo: {
                            graphCode: 'SpaceIncluding',
                            relCode: 'Including',
                            objFrom: [props.data.id]
                        },
                        withColumns: ['id', 'localName', 'floorId', 'buildingId']
                    }
                }
            },
            { cancelToken: cancelToken() }
        );
        const buildMap = {};
        res.data.forEach(item => {
            const build = treeBuildFloorStore().getBuildOrFloor(item.buildingId);
            const floor = treeBuildFloorStore().getBuildOrFloor(item.floorId);
            item.floorName = floor?.localName || '--';
            item.buildingName = build?.localName || '--';
            item.floorSequenceId = floor?.floorSequenceId;
            if (build && floor) {
                if (buildMap[build.id]) {
                    buildMap[build.id].spaces.push(item);
                } else {
                    buildMap[build.id] = {
                        name: build.localName,
                        id: build.id,
                        spaces: [item]
                    };
                }
            }
        });
        buildList.value = Object.values(buildMap) || [];
    } catch (error) {
        console.log(error);
    } finally {
        // loading.value = false;
        closeLoading();
    }
};
const handleSpaces = arr => {
    return orderBy(arr, ['floorSequenceId'], ['desc']);
};
onMounted(() => {
    getSpaceList();
});
</script>
<style lang="less" scoped>
.space-zone {
    min-width: 170px;
    &.pop-space-list {
        .space-list-item {
            .space-name {
                max-width: none;
                min-width: 100px;
            }
        }
    }
    .space-zone-name {
        font-size: 14px;
        height: 40px;
        padding: 9px 0;
        padding-left: 12px;
        margin-bottom: 0;
    }
    .build-list-item-name {
        color: var(--gray-600);
        padding: 5px 12px;
        border-radius: 4px;
        background: linear-gradient(90deg, #f1f4f6 0%, rgba(241, 244, 246, 0) 100%);
    }
    .space-list-item {
        padding: 9px 12px;
        .space-name {
            max-width: calc(100% - 22px);
            padding-right: 8px;
            word-break: break-all;
        }
        .space-floor {
            align-self: start;
        }
    }
    :deep(.el-loading-spinner .path) {
        stroke: var(--gray-500);
    }
}
</style>
