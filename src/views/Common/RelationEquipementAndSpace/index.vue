<template>
    <div class="safe-container-right">
        <div v-if="associatedSpace?.dataValue?.length || associatedEquipment?.dataValue?.length" class="safe-container-right-content">
            <div style="height: 100%">
                <m-scrollbar box-class="control-console-scrollbar">
                    <div v-if="associatedSpace?.dataValue?.length">
                        <div class="title-item f16 fb7 mt12 mb8">{{ i18n.global.t('meos_control_web.related_space') }}</div>
                        <CorrelationSpace
                            :associated-space="associatedSpace"
                            :select-obj="selectObj"
                            @hover-obj="
                                item => {
                                    emits('hoverObj', item);
                                }
                            "
                            @unhover-obj="
                                () => {
                                    emits('unhoverObj');
                                }
                            "
                            @click-obj="
                                item => {
                                    emits('clickObj', item);
                                }
                            "
                        />
                    </div>
                    <div v-if="associatedEquipment?.dataValue?.length">
                        <div class="title-item f16 fb7 mt32 mb8">{{ i18n.global.t('meos_control_web.related_equipment') }}</div>
                        <CorrelationEquipment
                            :associated-equipment="associatedEquipment"
                            :select-obj="selectObj"
                            @hover-obj="
                                item => {
                                    emits('hoverObj', item);
                                }
                            "
                            @unhover-obj="
                                () => {
                                    emits('unhoverObj');
                                }
                            "
                            @click-obj="
                                item => {
                                    emits('clickObj', item);
                                }
                            "
                        />
                    </div>
                </m-scrollbar>
            </div>
        </div>
        <div v-else class="no-data">
            <m-illustration :title="i18n.global.t('meos_control_web.no_content')" type="noContent" />
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import CorrelationSpace from './CorrelationSpace/index.vue';
import CorrelationEquipment from './CorrelationEquipment/index.vue';
import { listInfoCodeConfigsByObject } from '@/apis/airterminalxplantrunmonitor';
import { MLoading } from 'meri-plus';
import { DETAIL } from '@/utils/globalVariables';
const emits = defineEmits('unhoverObj', 'hoverObj', 'clickObj', 'loadedRelationObjIds');
const props = defineProps({
    selectObj: {
        type: Object,
        default: () => {}
    }
});
onMounted(() => {
    // initData(true);
    watch(
        () => props?.selectObj,
        () => {
            if (props.selectObj.id) {
                initData(true);
            }
        },
        {
            immediate: true
        }
    );
});

// eslint-disable-next-line vue/no-setup-props-destructure
const { floorLocalName, floorId } = props.selectObj;
provide('floorLocalName', floorLocalName);
provide('floorId', floorId);
const associatedEquipment = ref({});
const associatedSpace = ref({});
const initData = loading => {
    let Mloading = null;
    if (loading) {
        Mloading = MLoading.service({
            target: '.control-console-scrollbar',
            fullscreen: false,
            duration: 30000,
            lottieName: 'ball',
            loadIconStyle: {
                width: '100px',
                height: '100px'
            }
        });
    }
    listInfoCodeConfigsByObject({
        runningMonitorType: 'SECURITY',
        objectIds: [props.selectObj.id],
        templateCode: DETAIL,
        notFilterIotInfoCodeRule: true,
        groupCodes: ['relSpaceEquipment', 'relEquipment']
    })
        .then(res => {
            const relationIds = [];
            if (res.data?.length) {
                res.data?.[0]?.relInfoCodeGroupConfigs?.map(item => {
                    if (item.groupCode === 'relSpaceEquipment') {
                        //关联空间
                        item.relInfoCodeConfigs?.forEach(obj => {
                            if (obj.infoCode === 'relSpace') {
                                associatedSpace.value = obj;
                            } else {
                                associatedEquipment.value = obj;
                            }
                            obj.dataValue?.forEach(it => {
                                relationIds.push(it.id);
                            });
                        });
                    }
                    if (item.groupCode === 'relEquipment') {
                        //关联设备
                        item.relInfoCodeConfigs?.forEach(obj => {
                            if (obj.infoCode === 'relEquipment') {
                                associatedEquipment.value = obj;
                            }
                            obj.dataValue?.forEach(it => {
                                relationIds.push(it.id);
                            });
                        });
                    }
                });
            } else {
                associatedEquipment.value = {};
                associatedSpace.value = {};
            }
            emits('loadedRelationObjIds', relationIds);

            Mloading?.destroy();
        })
        .catch(() => {
            Mloading?.destroy();
        });
};
</script>
<style lang="less" scoped>
.safe-container-right {
    width: var(--broken-width);
    padding: 16px 16px 16px 0;
    height: 100%;
    float: right;
    &-content {
        height: 100%;
        border-radius: 8px;
        background: #fff;
        box-shadow: 0 8px 10px 0 rgba(27, 33, 41, 0.03);
        .tab {
            padding: 12px 16px 8px 16px;
        }
    }
    .abnormal-list-warp {
        margin-top: 8px;
        padding: 0 0 0 16px;
        height: calc(100% - 76px);
    }
    .bt {
        border-bottom: 1px solid var(--gray-200, #e8ecf0);
        height: 42px;
    }
    .title-item {
        position: relative;
        margin-left: 10px;

        &::before {
            position: absolute;
            width: 3px;
            height: 14px;
            background: #246fe5;
            left: -10px;
            top: 4px;
            content: '';
        }
    }
}
:deep(.m-tabs.m-tabs-segment) {
    width: 100%;
    .m-tabs-item {
        flex: 1;
    }
    .m-tabs-body {
        padding-right: 0 !important;

        .m-tabs-trigger {
            display: none !important;
        }
    }
}
:deep(.control-console-scrollbar) {
    padding: 0 16px 0px 16px;
}
.no-data {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
