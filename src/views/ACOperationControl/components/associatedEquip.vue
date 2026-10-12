<template>
    <div class="associated-equip-wrap">
        <AssociatedDevicesNew
            v-if="eqInfo.length > 0"
            v-bind="$attrs"
            :processed-data="eqInfo"
            collapse
            can-jump
            :title-ellipsis="false"
            :extra-equipment-group-codes="['runningParameter']"
        ></AssociatedDevicesNew>
        <div v-else class="empty-with-scroll"><Empty /></div>
    </div>
</template>
<script setup>
import { queryRelationEquip } from '@/apis/ACOperationControl';
import { DETAIL, OBJ_TYPE } from '@/utils/globalVariables';
import { MLoading } from 'meri-plus';
import AssociatedDevicesNew from '@/components/ObjectInfoComponents/AssociatedDevicesNew/index.vue'; // 关联设备
import DockSingleton from '@/hooks/responsiveDock';
import { commonDrawerRootContextKey } from '@/components/common/CommonDrawer/constant';
import { iterateObjct4InstanceInfo } from '@/utils/index';
import { traverseObjectItems, isIotInfoType } from '@/utils/infoTemplate';
import i18n from '@/localization';
import Empty from '@/components/common/Empty.vue';
import _ from 'lodash';
import { templateDataKey } from '@/hooks/useObjectInfoDataByTemplateHook';

const { setIotData } = DockSingleton.getInstance();

const commonDrawerRoot = inject(commonDrawerRootContextKey);

const emits = defineEmits('loadedEquips', 'unhoverEquip', 'hoverEquip', 'clickEquip', 'clickSpace');

const props = defineProps({
    selectObj: {
        type: Object,
        default: () => ({})
    },
    runningMonitorType: {
        type: String,
        default: ''
    }
});

const Loading = className => {
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

const templateData = inject(templateDataKey);

watch(templateData, val => {
    // console.log('val :>> ', val);
    const objs = [];
    const rawData = val.relation?.groupChildren ?? [];
    if (rawData.length > 0) {
        const grouped = rawData
            .map(group => {
                const equipments = group.relInfoCodeConfigs[0].dataValue;

                equipments.forEach(eq => {
                    objs.push({
                        id: eq.id,
                        objType: OBJ_TYPE.EQUIPMENT
                    });

                    eq.floorId = eq.inFloor?.id;

                    // eq.relInfo = {
                    //     groupName: i18n.global.t('meos_control_web.served_space'),
                    //     objs: eq.serviceSpace
                    // };
                });

                return {
                    groupCode: group.groupCode || '',
                    groupName: group.groupName || '',
                    groupOrder: group.groupOrder || '',
                    equipments
                };
            })
            .filter(g => g.equipments.length > 0);

        // debugger;
        // console.log('grouped :>> ', grouped);

        emits('loadedEquips', objs);

        eqInfo.value = grouped.length > 0 ? grouped : [];

        // loadingInstance?.destroy?.();
    }
});

const eqInfo = ref([]);

const getEqInfo = async (disabledLoading = true) => {
    let loadingInstance = null;
    if (!disabledLoading) {
        loadingInstance = Loading('.associated-equip-wrap');
    }
    try {
        let response = await queryRelationEquip({
            spaceId: props.selectObj?.id,
            runningMonitorSecondType: props.runningMonitorType,
            templateCode: DETAIL
        });
        if (response.code === '00000') {
            const rawData = response.data || [];
            const objs = [];

            // 按需订阅时收集sse订阅参数

            const { classCodeIds } = iterateObjct4InstanceInfo(rawData);
            commonDrawerRoot.setClass2Ids(props.selectObj?.id, classCodeIds);
            traverseObjectItems(rawData, (ownObj, info) => {
                if (ownObj?.id && info?.infoCode && isIotInfoType(info?.infoCodeType)) {
                    setIotData(ownObj?.id, info?.infoCode, info);
                }
            });

            rawData.forEach(res => {
                objs.push({
                    id: res?.id,
                    objType: OBJ_TYPE.EQUIPMENT
                });
                res.relInfo = {
                    groupName: i18n.global.t('meos_control_web.served_space'),
                    objs: res.serviceSpace
                };
            });

            const grouped = Object.values(_.groupBy(rawData, 'classCode')).map(equipArr => {
                const first = equipArr[0] || {};
                return {
                    groupCode: first.classCode || '',
                    groupName: first.className || '',
                    equipments: equipArr
                };
            });

            // debugger;
            // console.log('grouped :>> ', grouped);

            emits('loadedEquips', objs);

            eqInfo.value = grouped.length > 0 ? grouped : [];
        }
    } catch (error) {
        eqInfo.value = [];
    } finally {
        if (!disabledLoading) {
            loadingInstance?.destroy?.();
        }
    }
};
</script>
<style lang="less" scoped>
.associated-equip-wrap {
    width: 100%;
    height: 100%;
    position: relative;
}
.empty-with-scroll {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
