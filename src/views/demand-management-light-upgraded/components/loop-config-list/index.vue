<template>
    <div v-if="collapseDataList.length" v-show="showLoopConfigList" class="loop-config-list-container" :style="{ marginTop: `${props.marginTop}px` }">
        <TitlePrefix v-if="withTitle" class="mb12">
            <template #title>
                <div class="row-wrap">
                    <div class="left-title">{{ i18n.global.t('meos_control_web.loop_configuration') }}</div>
                    <I18nSlot v-if="isSpace" html-tag="div" class="space-tip" name-key="meos_control_web.num_spaces_has_loop">
                        <template #num>
                            <span class="high-light">{{ instanceCount }}</span>
                        </template>
                    </I18nSlot>
                    <div class="right-statistics">
                        <StatisticsCount :with-gap="false" :un-config-count="unConfigCount" :total="total" :open-count="openCount" />
                    </div>
                </div>
            </template>
        </TitlePrefix>
        <m-collapse v-model="collapseData" class="collapse-container" :hover-style="true" icon-position="left">
            <template v-for="rowItem in collapseDataList" :key="rowItem.id">
                <m-collapse-item :id="rowItem?.id" :title="rowItem?.name">
                    <template #title>
                        <div class="collapse-item-row">
                            <div class="collapse-left">
                                <span> {{ rowItem?.name }}</span>
                                <StatisticsCount :with-hight-light="true" :un-config-count="rowItem.unConfigCount" :total="rowItem.total" :open-count="rowItem.openCount" />
                            </div>
                            <div class="collapse-right">
                                <template v-if="props.isPreview">
                                    <m-tag v-if="rowItem.settingMode === SMD_ALL_OPEN" color="#E68600" bg-color="#FFF0CC">{{ i18n.global.t('meos_control_web.fully_on') }}</m-tag>
                                    <m-tag v-if="rowItem.settingMode === SMD_ALL_CLOSE" color="#626C78" bg-color="#E8ECF0">{{ i18n.global.t('meos_control_web.fully_off') }}</m-tag>
                                    <m-tag v-if="rowItem.settingMode === SMD_PARTIAL_OPEN" color="#D72824" bg-color="#FFE6E5">{{
                                        i18n.global.t('meos_control_web.partial_on')
                                    }}</m-tag>
                                    <m-tag v-if="rowItem.settingMode === NOT_CONFIGURED || !rowItem.settingMode" color="#626C78" bg-color="#E8ECF0">{{
                                        i18n.global.t('meos_control_web.unconfiged')
                                    }}</m-tag>
                                </template>
                                <div v-else class="op-warp">
                                    <div class="btn-item" :class="{ act: rowItem.settingMode === SMD_ALL_OPEN }" @click.stop="switchMode(rowItem, SMD_ALL_OPEN)">
                                        {{ i18n.global.t('meos_control_web.fully_on') }}
                                    </div>
                                    <div class="btn-item" :class="{ act: rowItem.settingMode === SMD_ALL_CLOSE }" @click.stop="switchMode(rowItem, SMD_ALL_CLOSE)">
                                        {{ i18n.global.t('meos_control_web.fully_off') }}
                                    </div>
                                    <div class="btn-item part-open" :class="{ act: rowItem.settingMode === SMD_PARTIAL_OPEN }" @click.stop="switchMode(rowItem, SMD_PARTIAL_OPEN)">
                                        <span>{{ i18n.global.t('meos_control_web.partial_on') }}</span>
                                        <svg class="right-arrow" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                            <path
                                                fill-rule="evenodd"
                                                clip-rule="evenodd"
                                                d="M6.16931 13.3083C5.9312 13.0654 5.94604 12.6858 6.20247 12.4603L10.1377 9L6.20247 5.53968C5.94604 5.3142 5.9312 4.93456 6.16931 4.69173C6.40742 4.44891 6.80832 4.43485 7.06475 4.66033L12 9L7.06475 13.3397C6.80832 13.5652 6.40742 13.5511 6.16931 13.3083Z"
                                                fill="#246FE5"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                    <CollapseTable
                        :is-preview="props.isPreview"
                        :show-type="rowItem.tableShowType"
                        :data-source="
                            rowItem.tableShowType === 'loop'
                                ? rowItem.loopList.slice(0, 10)
                                : rowItem.groupList
                                      .filter(v => {
                                          return v?.settingMode && v?.settingMode !== NOT_CONFIGURED;
                                      })
                                      .slice(0, 10)
                        "
                        :cur-item="rowItem"
                        @view-more-modal="viewMoreModal"
                        @preview-group="previewGroup"
                    />
                    <m-button
                        v-show="
                            rowItem.tableShowType === 'loop'
                                ? rowItem.loopList.length > 10
                                : rowItem.groupList.filter(v => v?.settingMode && v?.settingMode !== NOT_CONFIGURED).length > 10
                        "
                        type="link"
                        size="medium"
                        class="view-more"
                        @click="viewMoreModal(rowItem)"
                    >
                        {{ i18n.global.t('meos_control_web.view_more') }}
                    </m-button>
                </m-collapse-item>
            </template>
        </m-collapse>
    </div>
    <LoopGroupWithConfigModal
        v-model:visible="showViewModal"
        v-model:group-list="currentViewItem.groupList"
        v-model:loop-list="currentViewItem.loopList"
        v-model:show-type="currentViewItem.showType"
        :is-preview="currentViewModeIsPreview"
        :group-loading="groupLoading"
        :is-space="isSpace"
        @close="closeViewModal"
        @save="handleSave"
    />
    <NewGroupModal
        v-if="curPreviewGroupRow?.id"
        :template-type="templateType"
        :tag="curPreviewGroupRow.tag"
        :default-loop-ids="curPreviewGroupRow?.relObjects?.map(item => item.id) || []"
        :data="curPreviewGroupRow"
        disabled-modify
        :is-preview="!!curPreviewGroupRow?.id"
        @close="curPreviewGroupRow = null"
        @success="curPreviewGroupRow = null"
    />
</template>

<script setup>
import I18nSlot from '@/components/I18nSlot.vue';
import i18n from '@/localization';
import TitlePrefix from '@/components/title-prefix/index.vue';
import CollapseTable from './CollapseTable.vue';
import StatisticsCount from '../../widget/StatisticsCount.vue';
import LoopGroupWithConfigModal from '../loop-group-with-config-modal/index.vue';
import NewGroupModal from '../new-group-modal/index.vue';
import { SMD_ALL_OPEN, SMD_ALL_CLOSE, SMD_PARTIAL_OPEN, NOT_CONFIGURED } from '../../constant';
import { useConfigDynamicModal } from '../../hooks/useConfigDynamicModal';

const props = defineProps({
    isPreview: {
        type: Boolean,
        default: true
    },
    list: {
        type: Array,
        default: () => []
    },
    marginTop: {
        type: Number,
        default: 0
    },
    belongInstance: {
        type: Array,
        default: () => []
    },
    withTitle: {
        type: Boolean,
        default: true
    },
    showLoopConfigList: {
        type: Boolean,
        default: true
    },
    groupLoading: {
        type: Boolean,
        default: false
    }
});

const isSpace = computed(() => props.belongInstance?.[0]?.instanceType === 'SPACE');
const instanceCount = computed(() => props.belongInstance?.length ?? 0);

const collapseDataList = defineModel({ type: Array, default: [] });
const collapseData = defineModel('collapsed-ids', { type: Array, default: [] });
const isFirstCollapsed = ref(false);

const total = computed(() => collapseDataList.value.reduce((acc, cur) => acc + cur.total, 0));
const openCount = computed(() => collapseDataList.value.reduce((acc, cur) => acc + cur.openCount, 0));
const unConfigCount = computed(() => collapseDataList.value.reduce((acc, cur) => acc + cur.unConfigCount, 0));

const { viewMoreModal, closeViewModal, previewGroup, handleSave, switchMode, templateType, currentViewItem, currentViewModeIsPreview, curPreviewGroupRow, showViewModal } =
    useConfigDynamicModal(collapseDataList);

watch(
    () => props.list,
    cur => {
        if (cur.length) {
            collapseDataList.value = cur;
        }
    },
    {
        immediate: true
    }
);

watch(
    () => collapseDataList.value,
    cur => {
        if (cur.length && !isFirstCollapsed.value) {
            // 展开收起规则：当回路设定为「全开」、「全关」时，回路默认收起；如果是部分开启的回路，则会默认展开；
            collapseData.value = collapseDataList.value.filter(s => s?.settingMode === SMD_PARTIAL_OPEN)?.map(s => s?.id);
            isFirstCollapsed.value = true;
        }
    },
    {
        immediate: true
    }
);
</script>

<style lang="less" scoped>
.loop-config-list-container {
    display: flex;
    flex-direction: column;
}

.row-wrap {
    display: flex;
    align-items: center;
    gap: 12px;
}

.left-title {
    color: var(--gray-800, #2e3742);

    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 24px;
}
.space-tip {
    color: var(--gray-600, #626c78);

    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;

    .high-light {
        color: var(--gray-900, #1b2129);
        font-weight: 700;
    }
}
.right-statistics {
    display: flex;
    align-items: center;
    gap: 4px;

    color: var(--gray-600, #626c78);
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
}

:deep(.m-collapse) {
    display: flex;
    flex-direction: column;
    row-gap: 12px;
}

:deep(.m-collapse-item) {
    display: flex;
    padding: 0px;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 4px;

    border-radius: 4px;
    background: var(--gray-50, #f7f9fa);

    .m-collapse-item__header {
        padding: 12px 8px;
    }

    .m-collapse-item__content {
        padding: 12px 8px;
        padding-top: 0px;
    }
}
.collapse-item-row {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 28px;
}
.collapse-left {
    display: flex;
    align-items: center;
    gap: 14px;
    color: var(--gray-900, #1b2129);

    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
}
.collapse-right {
    display: flex;
    align-items: center;
}

.op-warp {
    display: flex;
    align-items: center;
    gap: 8px;

    .btn-item {
        display: flex;
        align-items: center;
        padding: 3px 4px;
        color: var(--blue-500);
        text-align: center;
        font-size: 14px;
        font-weight: var(--platform-font-weight);
        line-height: 22px; /* 157.143% */
        border-radius: 4px;
        cursor: pointer;
        .right-arrow {
            visibility: hidden;
        }
        &.act {
            background: var(--blue-100);

            .right-arrow {
                visibility: visible;
            }
        }
        &:hover {
            background: var(--alpha-30);
            .right-arrow {
                visibility: visible;
            }
        }
    }
    .part-open {
        width: 82px;
    }
}
.view-more {
    margin-top: 4px;
}
</style>
