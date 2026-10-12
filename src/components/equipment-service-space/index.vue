<template>
    <div class="equipment-service-space-wrapper">
        <div v-show="!spaceList || spaceList.length === 0" class="nodata">
            <m-illustration :title="i18n.global.t('meos_control_web.no_content')" type="noContent"></m-illustration>
        </div>
        <div class="scroll-wrap">
            <m-scrollbar>
                <div v-for="item in spaceList" :key="item.id" class="item-info-wrap" @click="clickSpace(item)" @mouseenter="hoverSpace(item)" @mouseleave="unHoverSpace(item)">
                    <div class="equipment-title-wrap">
                        <div class="equipment-left">
                            <span v-if="checkSameFloor(item?.floorId)" class="equipment-title">{{ item?.localName ?? '--' }}</span>
                            <m-tips v-else :content="i18n.global.t('meos_control_web.device_not_on_floor_click_jump')" theme="darkTransparent" trigger="hover">
                                <span class="equipment-title">{{ item?.localName ?? '--' }}</span>
                            </m-tips>
                            <span class="tag" :class="{ grey: !checkSameFloor(item?.floorId) }">
                                {{ item?.floorLocalName ?? '--' }}
                            </span>
                            <span v-show="!checkSameFloor(item?.floorId)" class="tag grey">{{ i18n.global.t('meos_control_web.cross_floor') }}</span>
                        </div>
                        <div class="equipment-right">
                            <m-tips :content="i18n.global.t('meos_control_web.open_new_tab_detail')" theme="darkTransparent" trigger="hover">
                                <div class="equipment-icon" @click.stop="jumpTo(item.id)">
                                    <EquipHoverIcon></EquipHoverIcon>
                                </div>
                            </m-tips>
                        </div>
                    </div>
                    <div v-if="!!getCurParams(item.id)?.length" class="params-wrapper">
                        <template v-for="(param, index) in getCurParams(item.id)" :key="param.name">
                            <span class="params-content">{{ `${param.name}：${param.value}${param.unit ?? ''}` }}</span>
                            <span v-show="index < getCurParams(item.id)?.length - 1" class="split"></span>
                        </template>
                    </div>
                </div>
            </m-scrollbar>
        </div>
    </div>
</template>
<script setup lang="ts">
// @ts-ignore
import i18n from '@/localization';
import EquipHoverIcon from '@/assets/svg/equipHoverIcon.svg';
import { MLoading } from 'meri-plus';
import { MEOI_INSTANCE_DETAIL, CLOUD_ORIGIN } from '@/config';
import { getAuthParamsString } from '@/utils/envUtils';
import { openWebsite } from '@/utils/websiteNavigation';
import { getEquipmentServiceSpaceData } from '@/apis/equipmentService';
import { DETAIL, IOT_RUNNING } from '@/utils/globalVariables';

interface SpaceListItem {
    id: string | number;
    floorId?: string;
    localName?: string;
    floorLocalName?: string;
    [key: string]: any;
}

interface EquipmentServiceSpaceProps {
    id: string;
    curFloorId: string;
    runningMonitorType?: string;
    runningMonitorSecondType?: string;
    loadData?: (args: any, config?: any) => Promise<any>;
    namePrefix?: string;
    selectObj?: any;
}

const props = withDefaults(defineProps<EquipmentServiceSpaceProps>(), {
    id: '',
    curFloorId: '',
    selectObj: {},
    runningMonitorType: '',
    runningMonitorSecondType: '',
    loadData: getEquipmentServiceSpaceData,
    namePrefix: i18n.global.t('meos_control_web.current')
});

const emits = defineEmits(['loadedSpaces', 'hoverSpace', 'unhoverSpace', 'clickSpace']);

const spaceList = ref<SpaceListItem[]>([]);

const checkSameFloor = computed(() => (floorId?: string) => {
    const curFloorId = props?.curFloorId || props?.selectObj?.floorId;
    return curFloorId && floorId && curFloorId === floorId;
});

const environmentParams = computed(() => {
    const tofixed = (v: unknown) => {
        if (v && v === '') {
            return '--';
        }
        if (typeof v === 'string') {
            return Number(v).toFixed(2);
        }
        // 如果是对象或数组，需确认处理
        return '--';
    };

    let tempArr: any[] = [];

    for (const item of spaceList.value) {
        const { relInfoCodeGroupConfigs, id } = item || {};
        if (Array.isArray(relInfoCodeGroupConfigs)) {
            for (const config of relInfoCodeGroupConfigs) {
                const { groupCode, groupChildren } = config || {};
                // 曲线统计、实时数据统计
                if (['curveStatistic', 'currentStatistic'].includes(groupCode) && Array.isArray(groupChildren)) {
                    for (const child of groupChildren) {
                        const { groupName, groupOrder, relInfoCodeConfigs } = child || {};
                        if (Array.isArray(relInfoCodeConfigs)) {
                            // IOT 运行数据
                            for (const relInfoCodeConfig of relInfoCodeConfigs) {
                                if (relInfoCodeConfig.infoCodeType === IOT_RUNNING) {
                                    const { unit, dataValue, infoCodeName } = relInfoCodeConfig || {};
                                    tempArr.push({
                                        id,
                                        name: infoCodeName || groupName,
                                        groupOrder,
                                        value: tofixed(dataValue),
                                        unit: unit ?? ''
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    return tempArr;
});

const getCurParams = computed(() => (spaceId: number | string) => {
    const currentSpaceParams = environmentParams.value.filter(v => v.id === spaceId);
    const showTwoMaxFilter = (arr: any[]) => {
        const tempArr = [...arr];
        const max = tempArr.length > 2 ? 2 : tempArr.length;
        return tempArr.slice(0, max);
    };
    return showTwoMaxFilter(currentSpaceParams);
});

const getLoadingIns = (className: string) => {
    const loadingOptions = {
        target: className,
        fullscreen: false,
        lottieName: 'ball',
        loadTextOptions: {
            text: '',
            style: {
                top: '-15px'
            }
        },
        duration: 30,
        loadIconStyle: {
            width: '100px',
            height: '100px'
        },
        loadButton: () => location.reload()
    };
    const loadingInstance = MLoading.service(loadingOptions);
    return loadingInstance;
};

const getSpaceCurrentInfo = async (config: { equipmentId: string; runningMonitorSecondType: string }) => {
    const { equipmentId, runningMonitorSecondType } = config;
    const loadingInstance = getLoadingIns('.equipment-service-space-wrapper');
    try {
        // await querySpaceCurrentInfo({ equipmentId });
        let response = await props?.loadData({ equipmentId, runningMonitorSecondType, templateCode: DETAIL });
        if (response.code === '00000') {
            if (Array.isArray(response.data)) {
                spaceList.value = response.data;
                emits('loadedSpaces', response.data);
            }
        }
    } finally {
        loadingInstance.destroy();
    }
};

watch(
    [() => props.id, () => props?.runningMonitorType, () => props.runningMonitorSecondType],
    ([curId, curType, curSecondType]) => {
        if (curId) {
            getSpaceCurrentInfo({ equipmentId: curId, runningMonitorSecondType: curSecondType || curType });
        }
    },
    {
        immediate: true
    }
);

const jumpTo = (id: string | number) => {
    openWebsite(MEOI_INSTANCE_DETAIL, {
        params: `objId=${id}&${getAuthParamsString()}&f=MEOI_CatalogList&type=all`,
        newPage: true,
        origin: CLOUD_ORIGIN || ''
    });
};

const hoverSpace = (item: any) => {
    emits('hoverSpace', item);
};

const unHoverSpace = (item: any) => {
    emits('unhoverSpace', item);
};

const clickSpace = (item: any) => {
    emits('clickSpace', item);
};
</script>
<style lang="less" scoped>
.tag {
    padding: 0 4px;
    display: inline-block;
    border-radius: 2px;
    line-height: 20px;
    background: @blue-100;
    color: @blue-700;
    font-size: 12px;
    font-weight: var(--platform-font-weight);
    margin-left: 4px;
}

.flex-ce {
    display: flex;
    align-items: center;
}

.equipment-service-space-wrapper {
    height: calc(100% + 8px);
    overflow: hidden;
    position: relative;
    padding-left: 20px;
    padding-top: 20px;
    transform: translateY(-16px);

    .scroll-wrap {
        height: calc(100% + 24px);
    }

    .nodata {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}

.item-info-wrap {
    padding: 16px 12px;
    margin-right: 24px;
    border-bottom: 1px solid @grey-200;
    position: relative;
    cursor: pointer;

    .equipment-title-wrap {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .equipment-left {
            display: flex;
            align-items: center;

            .equipment-title {
                color: @grey-900;
                font-size: 14px;
                line-height: 20px;
                font-weight: var(--platform-font-weight);
            }

            .grey {
                background: @grey-200;
                color: @grey-900;
            }
        }

        .equipment-right {
            width: 18px;
            height: 18px;
            align-items: center;

            .equipment-icon {
                width: 18px;
                height: 18px;
                position: absolute;
                right: 12px;
                top: 16px;
            }

            &:hover {
                border-radius: 2px;
                background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
            }
        }
    }

    .params-wrapper {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
        color: @grey-600;
        font-size: 14px;
        font-weight: var(--platform-font-weight);
        line-height: 18px;
        margin-top: 7px;

        .params-content {
            display: flex;
            min-width: fit-content;
        }

        .split {
            width: 1px;
            display: inline-block;
            height: 12px;
            background: #d9d9d9;
        }
    }

    &:hover {
        cursor: pointer;
        border-radius: 2px;
        border-bottom: 1px solid @grey-200;
        background: rgba(196, 201, 207, 0.3);

        .equipment-right {
            display: flex;
        }
    }
}
</style>
