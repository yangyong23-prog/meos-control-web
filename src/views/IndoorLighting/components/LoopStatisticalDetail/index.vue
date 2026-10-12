<template>
    <div class="indoor-lighting-sidebar w100 h100">
        <m-scrollbar class="scrollbar w100 h100" content-style="height:100%;">
            <div class="scrollbar-content w100 h100">
                <div v-if="showToolPanel" class="tool-panel">
                    <div class="row1">
                        <div class="desc">
                            {{ i18n.global.t('meos_control_web.already_selected') }} <span class="count">{{ loopCheckedIds?.length ?? 0 }}</span>
                            {{ i18n.global.t('meos_control_web.project') }}
                        </div>
                        <m-button type="text" size="small" @click="clearCheck()">{{ i18n.global.t('meos_control_web.deselect') }}</m-button>
                    </div>
                    <div class="row2">
                        <m-button v-if="loopCheckedIds?.length > 0" type="default" size="small" @click="e => openForm(e.target, getInfoCode('1'), loopCheckedIds)">{{
                            INFOCODE.runStatus1.aliasName
                        }}</m-button>
                        <m-button v-if="loopCheckedIds?.length > 0" type="default" size="small" @click="e => openForm(e.target, getInfoCode('0'), loopCheckedIds)">{{
                            INFOCODE.runStatus0.aliasName
                        }}</m-button>
                        <m-popconfirm
                            v-if="curCheckedGroup?.code === LOOP_STATIC_TYPES.MANUAL.code"
                            :content="curCheckedGroup?.onfirmDesc ?? ''"
                            status="primary"
                            placement="bottom-end"
                            :cancel-button-text="i18n.global.t('common.cancel')"
                            :confirm-button-text="i18n.global.t('common.confirm')"
                            style="--m-popover-border-radius: 8px"
                            width="316px"
                            @confirm="batchReleaseInterventionFun(loopCheckedIds)"
                        >
                            <m-button type="default" size="small" @click="closeForm()">{{ curCheckedGroup.btnName }}</m-button>
                        </m-popconfirm>
                        <m-popconfirm
                            v-if="curCheckedGroup?.code === LOOP_STATIC_TYPES.SYS_AUTO.code"
                            :content="curCheckedGroup?.onfirmDesc ?? ''"
                            status="primary"
                            placement="bottom-end"
                            :cancel-button-text="i18n.global.t('common.cancel')"
                            :confirm-button-text="i18n.global.t('common.confirm')"
                            style="--m-popover-border-radius: 8px"
                            width="316px"
                            @confirm="batchOpenCloseByDemandFun(loopCheckedIds, curSecondTypeCode, curControlType)"
                        >
                            <m-button type="default" size="small" @click="closeForm()">{{ curCheckedGroup.btnName }}</m-button>
                        </m-popconfirm>
                    </div>
                </div>

                <div v-if="needGroup" class="fcol w100 group-container">
                    <GroupItem v-for="group in curLoopGroups" :key="group.code" :data="group" @click="() => controlByGroup(group)">
                        <template v-if="group?.loops?.length > 0">
                            <template v-if="group.code === LOOP_STATIC_TYPES.LOCAL.code">
                                <div class="title-item f16 fb7">{{ i18n.global.t('meos_control_web.loop_inventory') }}</div>
                                <SpaceLoopList :list="group.groupedLoops"></SpaceLoopList>
                            </template>
                            <template v-else>
                                <div class="class-header">
                                    <div class="title-item f16 fb7">{{ i18n.global.t('meos_control_web.loop_inventory') }}</div>
                                    <div v-if="group?.loops?.length > 0" class="right">
                                        <m-tips
                                            :content="!group.allDisabledInfo?.value ? group.allDisabledInfo?.text || '' : ''"
                                            :disabled="group.allDisabledInfo?.value"
                                            trigger="hover"
                                            theme="darkTransparent"
                                        >
                                            <m-checkbox
                                                :disabled="!group.allDisabledInfo?.value"
                                                :model-value="group.allCheckedValue.value"
                                                @click="checkAll(group.allCheckedValue.value, group)"
                                                >{{ i18n.global.t('meos_control_web.select_all1') }}</m-checkbox
                                            >
                                        </m-tips>
                                        <div class="split-line"></div>
                                        <div class="fc unpack" @click="toggleInfoAll(!extpandInfoAllMap[group.code], group)">
                                            <div class="mr4" style="user-select: none">
                                                {{
                                                    extpandInfoAllMap[group.code]
                                                        ? i18n.global.t('meos_control_web.collapse_data_points')
                                                        : i18n.global.t('meos_control_web.expand_information_point')
                                                }}
                                            </div>
                                            <SvgIcon name="unpack" />
                                        </div>
                                    </div>
                                </div>

                                <LampLoopList
                                    :list="group.groupedLoops"
                                    :lamps-checked-map="group.lampsCheckedMap.value"
                                    :loop-checked-map="loopCheckedMap"
                                    :loop-opened-map="loopOpenedMap[group.code]"
                                    :loop-disabled-map="objDisabledInfo"
                                    :use-hover-loop-linkage="useHoverLoopLinkage"
                                    @check-lamp="lamp => clickLampCheckBox(lamp, group)"
                                    @check-loop="loop => clickLoopCheckBox(loop, group)"
                                ></LampLoopList>
                            </template>
                        </template>
                    </GroupItem>
                </div>
                <template v-else>
                    <template v-if="type === STATIC_TYPE.UNKNOW">
                        <div class="offline w100">{{ i18n.global.t('meos_control_web.offline_loop_count') }}:{{ offlineCount }}</div>
                        <div class="fcol w100" style="gap: 12px">
                            <div class="class-header">
                                <div class="title-item f16 fb7">{{ i18n.global.t('meos_control_web.loop_inventory') }}</div>
                            </div>
                            <ControllerLoopList v-if="type === STATIC_TYPE.UNKNOW" :list="controllerLoopList"></ControllerLoopList>
                        </div>
                    </template>
                    <template v-else>
                        <div class="class-header">
                            <div class="title-item f16 fb7">{{ i18n.global.t('meos_control_web.loop_inventory') }}</div>
                        </div>
                        <SpaceLoopList :list="getSpaceLoopList(targetLoopList)"></SpaceLoopList>
                    </template>
                </template>
                <div v-if="!targetLoopList?.length" class="no-data">
                    <m-illustration :title="i18n.global.t('meos_control_web.no_content')" type="noContent" />
                </div>
            </div>
        </m-scrollbar>
        <ControlForm v-model="isControlOpen" width="380px" :virtual-ref="virtualRef" :form-list="formList" @submit="handleSubmit" @close="closeForm" />
        <ErrorList v-if="showErrorList" :error-list="errorList" @close="showErrorList = false" />
    </div>
</template>

<script setup>
import LampLoopList from '../LampLoopList/index.vue';
import ControllerLoopList from '../ControllerLoopList/index.vue';
import SpaceLoopList from '../SpaceLoopList/index.vue';
import SvgIcon from '@/components/common/SvgIcon.vue';
import useStatisticalDetails from '@/views/IndoorLighting/hooks/useStatisticalDetails';
import ControlForm from '@/components/ObjectInfoComponents/ControlForm/index.vue';
import ErrorList from '@/views/IndoorLighting/components/ErrorList.vue';
import { STATIC_TYPE, LOOP_STATIC_TYPES, INFOCODE } from '@/views/IndoorLighting/variables';
import i18n from '@/localization';
import useBatchControlHandler from '@/views/IndoorLighting/hooks/useBatchControlHandler';
import GroupItem from './GroupItem.vue';

const props = defineProps({
    type: {
        type: String,
        default: ''
    },
    instanceType: {
        type: String,
        default: ''
    },
    instanceId: {
        type: String,
        default: ''
    },
    serviceAreaType: {
        type: String,
        default: ''
    },
    title: {
        type: String,
        default: ''
    },
    useHoverLoopLinkage: {
        type: Boolean,
        default: false
    }
});

const equipSwitchSetItem = {
    additionalMapValue: {},
    dataSource: [
        {
            code: '0',
            name: i18n.global.t('meos_control_web.off')
        },
        {
            code: '1',
            name: i18n.global.t('meos_control_web.on')
        }
    ],
    dataValue: '0',
    infoCode: 'equipSwitchSet',
    infoCodeName: i18n.global.t('meos_control_web.equipment_switch_setting'),
    aliasName: i18n.global.t('meos_control_web.switch_setpoint'),
    existsIotRule: true,

    sequence: 3,
    unit: ''
};
const curControlType = computed(() => {
    return props.type === STATIC_TYPE.OPEN_MORE ? 'CLOSE' : props.type === STATIC_TYPE.OPEN_LESS ? 'OPEN' : '';
});
const getInfoCode = dataValue => {
    return {
        ...equipSwitchSetItem,
        dataValue
    };
};
const { handleSubmit, openForm, closeForm, batchReleaseInterventionFun, batchOpenCloseByDemandFun, isControlOpen, virtualRef, formList, showErrorList, errorList } =
    useBatchControlHandler();
const {
    // allCheckedValue,
    // lampsCheckedMap,
    loopCheckedIds,
    showToolPanel,
    controllerLoopList,
    loopCheckedMap,
    targetLoopList,
    loopOpenedMap,
    checkedInfoList,
    curCheckedGroup,
    objDisabledInfo,
    curSecondTypeCode,
    offlineCount,
    extpandInfoAllMap,
    clickLoopCheckBox,
    clickLampCheckBox,
    checkAll,
    toggleInfoAll,
    clearCheck,
    selStaticItem,
    curLoopGroups,
    getSpaceLoopList
} = useStatisticalDetails(props);

const controlByGroup = group => {
    if (group.code === LOOP_STATIC_TYPES.SYS_AUTO.code) {
        const ids = group.loops?.map(loop => loop.id);
        batchOpenCloseByDemandFun(ids, curSecondTypeCode.value, curControlType.value);
    } else if (group.code === LOOP_STATIC_TYPES.MANUAL.code) {
        const ids = group.loops?.map(loop => loop.id);
        batchReleaseInterventionFun(ids);
    }
};
const needGroup = computed(() => {
    return props.type !== STATIC_TYPE.UNKNOW && props.type !== STATIC_TYPE.LOCAL;
});
watch(showToolPanel, () => {
    if (!showToolPanel.value) {
        isControlOpen.value = false;
    }
});
</script>
<style lang="less" scoped>
.indoor-lighting-sidebar {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    flex: 1 0 0;
    position: relative;
    padding: 16px 24px;

    .scrollbar-content {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 20px;
    }
    .loop-list {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        flex: 1;
        gap: 20px;
    }
    .statistcal-bar {
        width: 100%;
        display: flex;
        padding: 4px;
        justify-content: space-between;
        align-items: flex-start;

        border-radius: 4px;
        background: var(--gray-50, #f7f9fa);
        .item {
            display: flex;
            width: 120px;
            padding: 4px 8px;
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
            cursor: pointer;
            .val {
                color: #000;
                font-size: 20px;
                font-weight: 600;
                line-height: 24px; /* 120% */
            }
            .title {
                color: var(--gray-600, #626c78);
                font-size: 14px;
                font-weight: 400;
                line-height: 24px; /* 171.429% */
            }
            &:hover {
                border-radius: 4px;
                background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
            }
        }
        .active {
            border-radius: 4px;
            background: var(--blue-100, #d9ebff);
        }
    }
    .offline {
        padding: 8px 12px;
        border-radius: 4px;
        background: var(--Grey-Grey-100, #f1f4f6);

        color: var(--Grey-Grey-600, #626c78);
        font-size: 14px;
        font-weight: 400;
        line-height: 24px; /* 171.429% */
    }
    .tool-panel {
        display: flex;
        width: 100%;
        padding: 10px 24px;
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
        position: absolute;
        z-index: 2;
        left: 0;
        top: 0;
        border-radius: 4px;
        border: 1px solid var(--blue-300, #64a6f7);
        background: var(--blue-100, #d9ebff);

        /* Shadow/shadow-3 */
        box-shadow: 0px 22px 40px 0px rgba(98, 108, 120, 0.08), 0px 14px 26px 0px rgba(98, 108, 120, 0.04), 0px 0px 4px 0px rgba(98, 108, 120, 0.15);
        .row1 {
            display: flex;
            width: 100%;
            justify-content: space-between;
            align-items: center;
            .desc {
                color: var(--gray-600, #626c78);
                font-size: 14px;
                font-weight: 400;
                line-height: 22px; /* 157.143% */
                .count {
                    color: var(--gray-900, #1b2129);
                    font-weight: 600;
                }
            }
        }
        .row2 {
            display: flex;
            align-items: center;
            gap: 12px;
            // gap: 12px;
        }
    }
    .group-container {
        gap: 12px;
    }
    .class-header {
        display: flex;
        height: 24px;
        justify-content: space-between;
        align-items: center;
        align-self: stretch;
        .right {
            display: flex;
            width: 239px;
            justify-content: flex-end;
            align-items: center;
            gap: 4px;
            .split-line {
                width: 1px;
                height: 14px;
                background: var(--Grey-Grey-Dividers, #e1e5eb);
            }
        }
        .unpack {
            padding: 4px;
            cursor: pointer;
            &:hover {
                border-radius: 4px;
                background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
            }
        }
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
    .title-item:not(:first-of-type) {
        margin-top: 12px;
    }
    .no-data {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
