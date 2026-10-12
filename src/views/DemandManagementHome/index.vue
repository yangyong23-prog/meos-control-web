<template>
    <div class="demand-management-container" :class="{ 'demand-management-container-bg': templateDemandType === 'AIRCONDITIONING' }">
        <m-scrollbar style="width: 100%">
            <template v-if="isLoading">
                <frame-management
                    v-if="menusData?.length"
                    ref="templateTabsElementRef"
                    v-model="templateType"
                    v-model:active-id="activeId"
                    :show-menu="!hideLeftMenus"
                    :menus="menusData"
                    :template-demand-type="templateDemandType"
                >
                    <template v-if="templateDemandType === 'AIRCONDITIONING'" #pre-btns>
                        <m-popover
                            v-if="base.hasAuth('editingStandards')"
                            :disabled="!isDisableRightHeaderBtns"
                            :content="i18n.global.t('meos_control_web.cannot_operate_in_edit_mode')"
                            theme="darkTransparent"
                            :show-arrow="false"
                        >
                            <m-button size="medium" :disabled="isDisableRightHeaderBtns" @click="openCopyTemplate">
                                {{ i18n.global.t('meos_control_web.copy_template') }}
                            </m-button>
                        </m-popover>
                        <m-popover
                            :disabled="!isDisableRightHeaderBtns"
                            :content="i18n.global.t('meos_control_web.cannot_operate_in_edit_mode')"
                            theme="darkTransparent"
                            :show-arrow="false"
                        >
                            <m-button v-if="base.hasAuth('editingStandards')" size="medium" :disabled="isDisableRightHeaderBtns" @click="openShieldListModal">{{
                                `${i18n.global.t('meos_control_web.space_mask')}${defaultSelected?.length ? `(${defaultSelected?.length})` : ''}`
                            }}</m-button>
                        </m-popover>
                        <m-popover
                            :disabled="!isDisableRightHeaderBtns"
                            :content="i18n.global.t('meos_control_web.cannot_operate_in_edit_mode')"
                            theme="darkTransparent"
                            :show-arrow="false"
                        >
                            <m-button v-if="base.hasAuth('editingStandards')" size="medium" :disabled="isDisableRightHeaderBtns" @click="openBlacklistModal">{{
                                `${i18n.global.t('meos_control_web.blacklist_config')}${blackListRuleCount ? `(${blackListRuleCount})` : ''}`
                            }}</m-button>
                        </m-popover>
                    </template>
                    <div class="demand-management-home">
                        <!-- 空调运行标准 -->
                        <OptimizationOfAc v-if="templateDemandType === 'AIRCONDITIONING'" ref="acConfigRef" />
                        <template v-else>
                            <div ref="leftRef" style="height: 100%">
                                <div v-if="!leftTreeDragEnable" class="stable-left-container">
                                    <LeftFloorTreeNew
                                        :hide-left-footer="hideLeftFooter"
                                        :hide-left-black-list="hideLeftBlackList"
                                        :hide-left-shield-list="hideLeftShieldList"
                                        @change-tree-data="changeTreeData"
                                        @after-selected-node="afterSelectedNode"
                                    />
                                </div>
                                <template v-else>
                                    <m-sidebar-custom width="336" :change-size="true" :show="true" :resident="true">
                                        <template v-if="leftTreeWidth < 20">
                                            <div></div>
                                        </template>
                                        <LeftFloorTree
                                            v-else
                                            :building-select-id="buildingSelectId"
                                            :hide-left-footer="hideLeftFooter"
                                            :hide-left-black-list="hideLeftBlackList"
                                            :hide-left-shield-list="hideLeftShieldList"
                                            @change-tree-data="changeTreeData"
                                            @after-selected-node="afterSelectedNode"
                                        />
                                    </m-sidebar-custom>
                                </template>
                            </div>
                            <div :class="{ 'demand-management-home-center': true }" :style="{ left: `${leftTreeWidth}px`, right: `${rightConfigWidth}px` }">
                                <BuildingFloorMap ref="buildFloorMapRef" :hide-model="isExpand" />
                            </div>
                            <div ref="rightRef" :class="{ 'demand-management-home-right': true }" :style="{ width: isExpand ? `calc(100% - 336px)` : '400px' }">
                                <RightToLeftExpand v-if="rightConfigExpandEnable" v-model="rightConfigExpand" :disable-text="rightConfigExpandDisabledTxt" />
                                <SECRightDemandConfig v-if="templateDemandType === 'SECURITY'" />
                                <VentRightDemandConfig v-if="templateDemandType === 'VENTILATION'" />
                                <!-- 原空调运行标准 -->
                                <!-- <ACRightDemandConfig v-if="templateDemandType === 'AIRCONDITIONING'" /> -->
                            </div>
                        </template>
                    </div>
                </frame-management>
            </template>
            <div v-else class="empty">
                <m-illustration :title="i18n.global.t('meos_control_web.no_content')" type="noContent"></m-illustration>
            </div>
        </m-scrollbar>
    </div>
    <template v-if="templateDemandType === 'AIRCONDITIONING'">
        <TreeWithMapForSpaceSelectModal
            v-model="showShieldListModal"
            :title="i18n.global.t('meos_control_web.shielded_zone')"
            :tree-data-loading="treeLoading"
            :tree-data="treeData"
            :default-selected="defaultSelected"
            :empty-text="i18n.global.t('meos_control_web.no_space_can_be_masked')"
            :open-clear-cache="true"
            @submit="submitShieldListModal"
        ></TreeWithMapForSpaceSelectModal>
        <BlacklistModalAC
            v-if="showBlackListModal"
            :template-type="templateType"
            :template-demand-type="templateDemandType"
            @close="closeBlackListModal"
            @after-submit="afterSubmit"
        ></BlacklistModalAC>
        <CopyModal v-if="showCopyModal" :template-list="templateList" @close="closeCopyModal" @after-submit="copyAfterSubmit"> </CopyModal>
    </template>
</template>

<script lang="ts" setup>
// @ts-ignore
import i18n from '@/localization';
import { useElementSize } from '@vueuse/core';
import FrameManagement from '@/components/frameManagement/index.vue';
import LeftFloorTree from './LeftFloorTree/index.vue';
import LeftFloorTreeNew from './leftFloorTreeNew/index.vue';
import BuildingFloorMap from './building-floor-map/index.vue';
import useGlobalData from './hooks/useGlobalData';
import useMenuTemplate from './hooks/useMenuTemplate';
import SECRightDemandConfig from './right-demand-config-sec/index.vue';
import VentRightDemandConfig from './right-demand-config-vent/index.vue';
// import ACRightDemandConfig from './right-demand-config-ac/index.vue';
import RightToLeftExpand from './components/RightToLeftExpand.vue';
import OptimizationOfAc from './optimization-of-ac/index.vue';
import TreeWithMapForSpaceSelectModal from '@/views/Common/TreeWithMapForSpaceSelectModal/index.vue';
import BlacklistModalAC from './components/BlacklistModalAC.vue';
import CopyModal from './components/copyModal.vue';
import useTreeDataEntry from './hooks/useTreeDataEntry';
import useShieldList from './hooks/useShieldList';
import baseStore from '@/store/baseStore';
import { getBlacklist, getListSpaceIdsByRule } from '@/apis/DemandManagementHomeNew';

const base = baseStore();

const leftRef = ref(null);
const rightRef = ref(null);
const acConfigRef = ref<any>(null);
const updateLeftData = () => {
    acConfigRef?.value?.refreshLeftList?.();
};

const buildFloorMapRef = ref();

const templateList = computed(() => {
    return templateTabsData.value
        .map((item: any) => {
            return {
                label: item.name,
                value: item.templateId
            };
        })
        .filter(item => {
            return item.value !== templateId.value;
        });
});

const { width: leftTreeWidth } = useElementSize(leftRef);
const { width: rightConfigWidth } = useElementSize(rightRef);

const isExpand = computed(() => rightConfigExpandEnable.value && rightConfigExpand.value);

const afterSelectedNode = (id: unknown) => {
    nextTick(() => {
        const ele = document.getElementById(`tree_node_${id}`);
        ele?.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    });
};

const openBlacklistModal = () => {
    showBlackListModal.value = true;
};

//打开复制弹窗
const openCopyTemplate = () => {
    showCopyModal.value = true;
};

// 关闭复制弹窗
const closeCopyModal = () => {
    nextTick(() => {
        showCopyModal.value = false;
    });
};

const copyAfterSubmit = (id: string | number) => {
    showCopyModal.value = false;
    acConfigRef.value.refreshLeftList(id);
};

const clickMapObj = (obj: unknown) => {
    buildFloorMapRef.value?.clickMapObj(obj);
};

const {
    templateDemandType,
    hideLeftFooter,
    hideLeftMenus,
    hideLeftBlackList,
    hideLeftShieldList,
    leftTreeDragEnable,
    rightConfigExpandEnable,
    rightConfigExpandDisabledTxt,
    rightConfigExpand,
    showShieldListModal,
    showBlackListModal,
    showCopyModal,
    isDisableRightHeaderBtns
} = useGlobalData();

const { templateId, templateTabsData, isLoading, activeId, menusData, templateType, templateTabsElementRef, pastDateString } = useMenuTemplate({ templateDemandType });
const { changeTreeData, buildingSelectId } = useTreeDataEntry(activeId, templateType, { clickMapObj, hideLeftBlackList, hideLeftShieldList, pastDateString });
const { treeData, treeLoading, defaultSelected, submitShieldListModal, getFilterBlackListTree, updateShieldCount } = useShieldList(templateType, updateLeftData);

const blackListRuleCount = ref(0);
const openShieldListModal = () => {
    showShieldListModal.value = true;
    getFilterBlackListTree();
};

const updateBlackListCount = async (curTemplateType: string) => {
    const allRules = await getBlacklist({ demandTemplateType: curTemplateType });
    if (allRules?.data) {
        const { configData } = allRules?.data || {};
        const res = await getListSpaceIdsByRule({
            demandTemplateType: curTemplateType,
            configData
        });
        const { data } = res || {};
        if (Array.isArray(data)) {
            blackListRuleCount.value = data?.length ?? 0;
        }
    }
};
const closeBlackListModal = () => {
    nextTick(() => {
        showBlackListModal.value = false;
    });
};

const afterSubmit = async () => {
    // 更新黑名单数量、屏蔽空间数量、左侧空间分组数据
    const promiseList: Promise<any>[] = templateType.value === 'AIRCONDITIONING' ? [updateBlackListCount(templateType.value), updateShieldCount(templateType.value)] : [];
    if (acConfigRef?.value?.refreshLeftList) {
        promiseList.push(acConfigRef.value.refreshLeftList?.());
    }
    await Promise.all(promiseList);
};

watch(
    () => templateType.value,
    async curTemplateType => {
        // 仅空调调用
        if (curTemplateType === 'AIRCONDITIONING') {
            await updateBlackListCount(curTemplateType);
        }
    },
    {
        immediate: true
    }
);
</script>
<style lang="less" scoped>
.demand-management-container {
    height: 100%;
    width: 100%;
    min-width: 1280px;
    /deep/ .m-scrollbar__content {
        height: 100%;
    }
    .demand-management-home {
        position: relative;
        display: flex;
        justify-content: space-between;
        height: 100%;
        overflow: hidden;
        :deep(.p-SidebarCustomProps-box) {
            height: 100%;
            &::before {
                position: absolute;
                width: 100%;
                height: 1px;
                background: #e1e5eb;
                bottom: 59px;
                content: '';
            }
            .p-SidebarCustomProps {
                margin-left: 0px;
                background: #fff;
            }
        }
        &-center {
            position: absolute;
            top: 0;

            height: 100%;
            border-left: 1px solid var(--gray-300);
        }
        &-right {
            position: relative;
            min-width: 400px;
            box-sizing: content-box;
            box-shadow: -1px 0 0 1px #e1e5eb;
            background: #fff;
            z-index: 1;
            transition: all 0.5s;
        }
    }
    .empty {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .footer-wrap {
        width: 100%;
        padding-inline: 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .separator {
            width: 1px;
            height: 13px;
            background: #d9d9d9;
        }
    }
}
.demand-management-container-bg {
    overflow: hidden;
    background-color: #d6dde5;
    position: relative;
    background-size: cover;
    background-image: url(@/assets/imgs/page_bg.png);
}
.stable-left-container {
    width: 336px;
    height: 100%;
}
</style>
