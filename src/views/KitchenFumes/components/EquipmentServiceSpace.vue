<template>
    <div class="Equipment-service-space">
        <m-scrollbar v-if="spaceList?.relInfoCodeConfigs?.[0].dataValue?.length" box-class="control-scrollbar">
            <div v-for="(item, index) in spaceList?.relInfoCodeConfigs?.[0].dataValue" :key="index" class="item-list cp" @click.stop="openSpaceDetail(item, 'moreList')">
                <div class="fc" style="position: relative">
                    <div class="fc">
                        <div v-ellipsis class="f16 m-ellipsis">{{ item.localName ?? '--' }}</div>
                        <m-tag color="#1B4ACC" bg-color="#D9EBFF" size="small" class="ml8"> {{ item.inFloor.localName ?? '--' }} </m-tag>
                    </div>
                    <iconBox :type="'detail'" :list="item.relObjects" :select-module-info-id="selectObj?.id" />
                </div>
                <div class="ft f14 mt8">{{ i18n.global.t('meos_control_web.located_building_colon') }}{{ item.inBuilding?.localName ?? '--' }}</div>
                <div class="ft f14 mt4">{{ i18n.global.t('meos_control_web.demand_time_range_placeholder') }}</div>
            </div>
        </m-scrollbar>
        <div v-else class="nodata fcc">
            <m-illustration :title="i18n.global.t('meos_control_web.no_content')" type="noContent"></m-illustration>
        </div>
    </div>
</template>
<script setup>
import iconBox from '../left-grids/iconBox.vue';
import { MLoading } from 'meri-plus';
import { listInfoCodeConfigsByObject } from '@/apis/airterminalxplantrunmonitor';
import { DETAIL } from '@/utils/globalVariables';
import i18n from '@/localization';

const emits = defineEmits('openSpaceDetail');
const props = defineProps({
    runningMonitorType: {
        type: String,
        default: ''
    },
    selectObj: {
        type: Object,
        default: () => {}
    }
});
const spaceList = ref([]);
const spaceId = ref('');
const openSpaceDetail = (item, type) => {
    emits('openSpaceDetail', item, type, spaceId.value);
};
const initModule = loading => {
    let mloading = null;
    if (loading) {
        mloading = MLoading.service({
            target: '.Equipment-service-space',
            fullscreen: false,
            duration: 30000,
            lottieName: 'ball',
            loadIconStyle: {
                width: '100px',
                height: '100px'
            }
        });
    }
    listInfoCodeConfigsByObject({ runningMonitorType: props.runningMonitorType, objectIds: [props.selectObj?.id], templateCode: DETAIL, groupCodes: ['equipmentServiceSpace'] })
        .then(res => {
            res.data[0]?.relInfoCodeGroupConfigs?.map(item => {
                spaceId.value = res.data[0].id;
                if (item.groupCode === 'equipmentServiceSpace') {
                    spaceList.value = item;
                }
            });
            mloading?.destroy();
        })
        .catch(() => {
            mloading?.destroy();
        });
};

onMounted(() => {
    initModule(true);
});

watch(
    () => props.selectObj,
    () => {
        if (props.selectObj?.id) {
            initModule(true);
        }
    }
);
</script>
<style lang="less" scoped>
.Equipment-service-space {
    height: 100%;
    width: 100%;
}
:deep(.control-scrollbar) {
    padding: 4px 24px;
}
.nodata {
    height: 100%;
}
.item-list {
    padding: 12px 8px;
    overflow: hidden;
    height: 101px;
    // border-bottom: 1px solid var(--gray-200, #e8ecf0);
}
.item-list:hover {
    background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
    :deep(.detail-hover),
    :deep(.icon-box) {
        background: linear-gradient(90deg, rgba(239, 241, 243, 0) 0%, rgba(239, 241, 243, 0.98) 67.37%);
    }
}
</style>
