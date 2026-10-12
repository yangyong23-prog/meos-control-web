<template>
    <m-scrollbar box-class="space-detail-scrollbar" :height="'100%'">
        <div class="space-detail-manage">
            <div v-if="equipsLength" class="title f16 fb7">{{ i18n.global.t('meos_control_web.related_equipment') }}</div>
            <RelationEquips v-for="group in relEquipGroups" v-bind="$attrs" :key="group.groupCode" :select-obj="selectObj" :rel-equip-group="group"></RelationEquips>
        </div>
    </m-scrollbar>
</template>
<script setup>
import i18n from '@/localization';
import { listInfoCodeConfigsByObject } from '@/apis/airterminalxplantrunmonitor';
import { DETAIL, SUCCESSCODE } from '@/utils/globalVariables';
import RelationEquips from './RelationEquips.vue';
import { MLoading } from 'meri-plus';
import dataDockHandling from '@/hooks/dataDockHandling';
import DockSingleton from '@/hooks/responsiveDock';
import { iterateObjct4InstanceInfo } from '@/utils/index';
import { commonDrawerRootContextKey } from '@/components/common/CommonDrawer/constant';

const props = defineProps({
    selectObj: {
        type: Object,
        default: () => {}
    },
    runningMonitorType: {
        type: String,
        default: ''
    }
});

const { writeDataToResponsiveDock } = dataDockHandling();
const detailWithAbnormalList = defineModel({ type: Object });
const commonDrawerRoot = inject(commonDrawerRootContextKey);
const { setAbnormalEvent, clearAbnormalEventsList, getAbnormalEventsList } = DockSingleton.getInstance();

const emits = defineEmits(['loadedRelationObjs']);

const equipsLength = ref(0);

const getEquipList = groups => {
    let equipIds = [];

    groups.forEach(g => {
        const items = g.relInfoCodeConfigs.reduce((arr, config) => {
            if (config.dataValue?.length) return [...arr, ...config.dataValue.map(item => item.id)];
            return arr;
        }, []);
        equipIds.push(...items);
    });

    equipsLength.value = equipIds.length;

    emits('loadedRelationObjs', equipIds);
};

const relEquipGroups = ref([]);
let loadingService;

const getData = async () => {
    if (!props.selectObj?.id || !props.runningMonitorType) return;
    loadingService = MLoading.service({
        target: '.space-detail-scrollbar',
        fullscreen: false,
        duration: 30000,
        lottieName: 'ball',
        background: '#fff',
        loadIconStyle: {
            width: '100px',
            height: '100px'
        }
    });
    detailWithAbnormalList.value.abnormalEventListLoading = true;
    // 测试关联模式
    // emits('loadedRelationObjs', ['Eq6101122010f5c64d1ad54d4eb28aa8f07f001f6865']);
    listInfoCodeConfigsByObject({ runningMonitorType: props.runningMonitorType, objectIds: [props.selectObj.id], templateCode: DETAIL })
        .then(res => {
            if (res.code === SUCCESSCODE) {
                res.data[0]?.relInfoCodeGroupConfigs?.forEach(item => {
                    if (item.groupCode === 'riskEvent') {
                        //异常事件
                        // _abnormalEventList.value = item?.relInfoCodeConfigs[0].dataValue || [];
                        // 按需订阅时收集sse订阅参数
                        clearAbnormalEventsList([props?.selectObj?.id]);
                        item?.relInfoCodeConfigs?.[0]?.dataValue?.forEach(ab => {
                            setAbnormalEvent(ab);
                        });
                        detailWithAbnormalList.value.abnormalEventList = getAbnormalEventsList([props?.selectObj?.id]);
                    }
                    if (item.groupCode === 'relEquipment') {
                        relEquipGroups.value = item.groupChildren || [];
                        // 获取设备列表
                        getEquipList(relEquipGroups.value);
                    }
                });
                try {
                    if (commonDrawerRoot?.props.isSubscriptOnDemand) {
                        writeDataToResponsiveDock(res.data);
                        const { classCodeIds } = iterateObjct4InstanceInfo(res.data);
                        commonDrawerRoot.setClass2Ids(props.selectObj?.id, classCodeIds);
                    }
                } catch (err) {
                    console.log(err, 'errerr');
                }
            }
            loadingService?.destroy();
            loadingService = null;
        })
        .catch(() => {
            loadingService?.destroy();
            loadingService = null;
        })
        .finally(() => {
            detailWithAbnormalList.value.abnormalEventListLoading = false;
        });
};

watch(
    () => props.selectObj,
    () => {
        getData();
    },
    {
        immediate: true
    }
);
</script>
<style lang="less" scoped>
:deep(.space-detail-scrollbar) {
    padding: 0 24px 0 24px;
}

.title {
    padding-left: 12px;
    position: relative;
    color: var(--gray-800, #2e3742);
    height: 22px;
    line-height: 22px;
    margin: 16px 0;
    &::after {
        position: absolute;
        top: 4px;
        left: 0;
        width: 3px;
        height: 14px;
        background: var(--blue-500, #246fe5);
        content: '';
    }
}

.space-detail-manage {
    height: 100%;
}
</style>
