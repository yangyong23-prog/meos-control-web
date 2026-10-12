<template>
    <div class="associated-equip-wrap">
        <div v-show="!eqInfo || eqInfo.length === 0" class="nodata">
            <m-illustration :title="i18n.global.t('meos_control_web.no_content')" type="noContent"></m-illustration>
        </div>
        <m-scrollbar box-class="associated-equip-scrollbar">
            <div class="scroll-wrap">
                <div v-show="eqInfo.length > 0" v-if="typeName == 'terminal'" class="module-name">{{ i18n.global.t('meos_control_web.terminal_equipment_serving_space') }}</div>
                <div v-show="eqInfo.length > 0" v-else class="title-name f16 fb7 mb16">{{ i18n.global.t('meos_control_web.equipment_serving_this_space') }}</div>
                <equipItem
                    v-for="item in eqInfo"
                    :key="item.id"
                    :data="item"
                    :cur-floor-id="curFloorId"
                    :select-obj="selectObj"
                    :type-name="typeName"
                    @hover-equip="
                        item => {
                            emits('hoverEquip', item);
                        }
                    "
                    @unhover-equip="
                        () => {
                            emits('unhoverEquip');
                        }
                    "
                    @click-equip="
                        item => {
                            emits('clickEquip', item);
                        }
                    "
                    @click-space="
                        item => {
                            emits('clickSpace', item);
                        }
                    "
                >
                </equipItem>
            </div>
        </m-scrollbar>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { queryRelationEquip } from '@/apis/ACOperationControl';
import { MLoading } from 'meri-plus';
import { getFloorInfoByFloorId } from '@/utils/buildingUtils';
import equipItem from './equipItem.vue';

import DockSingleton from '@/hooks/responsiveDock';

import { commonDrawerRootContextKey } from '@/components/common/CommonDrawer/constant';
import { iterateObjct4InstanceInfo } from '@/utils/index';
import { traverseObjectItems, isIotInfoType } from '@/utils/infoTemplate';
import { DETAIL, OBJ_TYPE } from '@/utils/globalVariables';

const { setIotData } = DockSingleton.getInstance();

const commonDrawerRoot = inject(commonDrawerRootContextKey);

const emits = defineEmits('loadedEquips', 'unhoverEquip', 'hoverEquip', 'clickEquip', 'clickSpace');

const props = defineProps({
    id: {
        type: String,
        default: ''
    },
    runningMonitorType: {
        type: String,
        default: ''
    },
    // 如通风、照明；左侧的菜单tab里的模版类型
    runningMonitorSecondType: {
        type: String,
        default: ''
    },
    spaceId: {
        type: String,
        default: ''
    },
    typeName: {
        type: String,
        default: ''
    },
    selectObj: {
        type: Object,
        default: () => {}
    },
    curFloorId: {
        type: String,
        default: ''
    }
});
watch(
    () => props.spaceId,
    () => {
        getEqInfo(false);
    }
);
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
const eqInfo = ref([]);

// TODO: meaning？
const getModel = list => {
    let model = '',
        manualAutoSetItem = list?.relInfoCodeConfigs.find?.(res => res.infoCode === 'manualAutoSet');
    if (manualAutoSetItem) {
        model = manualAutoSetItem?.dataValue;
    }
    return model;
};

const getEqInfo = async (disabledLoading = true) => {
    let loadingInstance = null;
    if (!disabledLoading) {
        loadingInstance = Loading('.associated-equip-wrap');
    }
    try {
        let response = await queryRelationEquip({
            spaceId: props.spaceId,
            runningMonitorSecondType: props.runningMonitorSecondType || props.runningMonitorType,
            templateCode: DETAIL
        });
        if (response.code === '00000') {
            const rawData = response.data || [];
            const objs = [];

            // 按需订阅时收集sse订阅参数
            if (commonDrawerRoot?.props.isSubscriptOnDemand) {
                const { classCodeIds } = iterateObjct4InstanceInfo(rawData);
                commonDrawerRoot.setClass2Ids(props.selectObj?.id, classCodeIds);
                traverseObjectItems(rawData, (ownObj, info) => {
                    if (ownObj?.id && info?.infoCode && isIotInfoType(info?.infoCodeType)) {
                        setIotData(ownObj?.id, info?.infoCode, info);
                    }
                });
            }
            rawData.forEach(res => {
                objs.push({
                    id: res?.id,
                    objType: OBJ_TYPE.EQUIPMENT
                });
            });

            emits('loadedEquips', objs);
            eqInfo.value = rawData || [];
        }
    } catch (error) {
        eqInfo.value = [];
    } finally {
        if (!disabledLoading) {
            loadingInstance?.destroy?.();
        }
    }
};

getEqInfo(false);
</script>
<style lang="less" scoped>
:deep(.associated-equip-scrollbar) {
    padding-top: 20px;
    padding-bottom: 20px;
}
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
.grey {
    background: @grey-200;
    color: @grey-900;
}
.associated-equip-wrap {
    padding-left: 24px;
    position: relative;
    .nodata {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    height: 100%;
    .module-name {
        color: @grey-600;
        font-size: 14px;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
        margin-bottom: 12px;
    }
    .scroll-wrap {
        height: calc(100% - 34px);
        padding-right: 10px;
        .title-name {
            padding-left: 12px;
            position: relative;
            color: var(--gray-800, #2e3742);
            height: 22px;
            line-height: 22px;

            &::after {
                position: absolute;
                top: 4px;
                left: 0;
                width: 3px;
                height: 14px;
                background: var(--blue-500);
                content: '';
            }
        }
        .associated-content-wrap {
            padding: 12px;
            border-radius: 4px;
            margin-bottom: 16px;
            margin-right: 14px;

            &:last-child {
                margin-bottom: 0;
            }
            background: #f7f9fa;
            display: flex;
            justify-content: space-between;
            flex-direction: column;

            &:hover {
                background: var(--gray-200);
            }
            .title-wrap {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 8px;
                cursor: pointer;
                .left {
                    display: flex;
                    align-items: center;
                    // background: red;
                    flex: 1;
                    overflow: hidden;
                    .title {
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        color: @grey-900;
                        font-size: 16px;
                        font-weight: 700;
                        max-width: 208px;
                        line-height: 22px;
                    }
                    .tag-wrap {
                        flex-shrink: 0;
                    }
                }
                .right {
                    cursor: pointer;
                    width: 18px;
                    height: 18px;
                    margin-left: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    &:hover {
                        border-radius: 2px;
                        background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
                    }
                }
            }
            .open-wrap {
                flex: 1;
                color: @blue-500;
                margin-top: 8px;
                height: 28px;
                text-align: center;
                font-size: 14px;
                font-weight: var(--platform-font-weight);
                line-height: 22px;
                .title {
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    user-select: none;
                    // background: red;
                    > span {
                        line-height: 28px;
                    }
                }
                .open-content {
                    padding-top: 8px;
                    cursor: pointer;
                    .item-wrap {
                        padding: 0 8px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        height: 44px;
                        border-bottom: 1px solid var(--gray-200, #e8ecf0);
                        background: @grey-100;
                        // background: red;
                        .left {
                            display: flex;
                            align-items: center;
                            .text {
                                color: @grey-600;
                                text-align: center;
                                font-size: 14px;
                                font-weight: var(--platform-font-weight);
                                line-height: 22px;
                                margin-right: 4px;
                            }
                        }
                        .right {
                            width: 18px;
                            height: 18px;
                            display: none;
                            &:hover {
                                border-radius: 2px;
                                background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
                            }
                        }
                        &:hover {
                            border-radius: 4px;
                            border-bottom: 1px solid @grey-200;
                            background: rgba(196, 201, 207, 0.3);
                            .right {
                                width: 18px;
                                height: 18px;

                                display: block;
                            }
                        }
                        &:last-child {
                            border-bottom: none;
                        }
                    }
                }
            }
        }
    }

    .arrow {
        transition: transform 0.3s linear;
        font-size: 14px;
    }
    .rotate {
        transform: rotate(180deg);
        transition: transform 0.3s linear;
    }
}
</style>
