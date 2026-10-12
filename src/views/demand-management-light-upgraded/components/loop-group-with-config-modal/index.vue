<template>
    <m-modal
        v-model:visible="showModal"
        :append-to="$modalAppendTo"
        :escable="false"
        type="default"
        :content-class-name="'loopGroupWithConfigModalCustom'"
        :title="`${i18n.global.t('meos_control_web.configuration')}`"
        :footer="!isPreview"
        :width="1260"
        :height="626"
        :need-scrollbar="false"
        @close="close('cancel')"
    >
        <template #content>
            <div class="content-container">
                <div class="header">
                    <div v-if="props.isPreview || props.isSpace" class="header-title">
                        {{
                            props.isSpace
                                ? i18n.global.t('meos_control_web.loop_configuration')
                                : showType === 'group'
                                ? i18n.global.t('meos_control_web.group_config')
                                : i18n.global.t('meos_control_web.loop_configuration')
                        }}
                    </div>
                    <div v-else class="radio-group-wrapper">
                        <m-radio-group v-model="showType">
                            <m-radio v-for="item in configRadioOptions" :key="item.label" :label="item.value" :disabled="item.disabled" :size="14">
                                {{ item.label }}
                            </m-radio>
                        </m-radio-group>
                    </div>
                    <div class="filter-warp">
                        <template v-if="showType === 'group'">
                            <m-select
                                v-model="groupOpenCloseDemands"
                                :size="219"
                                :options="SETTING_MODE_GROUP_OPTIONS"
                                :prefix="i18n.global.t('meos_control_web.group_switch_demand')"
                                multiple
                                has-confirm
                                has-check-all
                                clearable
                            ></m-select>
                            <m-search
                                :width="206"
                                immediate
                                type="enter"
                                :placeholder="i18n.global.t('meos_control_web.press_enter_search_loop_name')"
                                @change="val => (groupLoopName = val)"
                                @clear="groupLoopName = ''"
                            >
                            </m-search>
                            <m-search
                                :width="206"
                                immediate
                                type="enter"
                                :placeholder="i18n.global.t('meos_control_web.press_enter_search_group_name')"
                                @change="val => (groupName = val)"
                                @clear="groupName = ''"
                            >
                            </m-search>
                        </template>
                        <template v-else>
                            <!-- 仅展示回路列表中有的灯具类型 -->
                            <m-select
                                v-model="loopLampTypes"
                                :size="168"
                                :options="loopLampTypesList"
                                :prefix="i18n.global.t('meos_control_web.luminaire_type_colon')"
                                multiple
                                clearable
                                has-confirm
                                has-check-all
                                panel-searchable
                            ></m-select>
                            <!-- 按建筑-楼层-空间层级，仅展示回路列表中有的控制模块 -->
                            <m-tree-select
                                v-model="loopLinkedControlItems"
                                :size="205"
                                :data="loopLinkedControlItemsList"
                                :prefix="i18n.global.t('meos_control_web.related_lighting_controller_colon')"
                                multiple
                                clearable
                                :show-parent-name="false"
                                has-confirm
                                has-check-all
                                panel-searchable
                            >
                            </m-tree-select>
                            <!-- 按建筑-楼层-空间层级，仅展示回路列表中有的服务空间 -->
                            <m-tree-select
                                v-if="publicAreaVisible"
                                v-model="loopServiceSpaces"
                                :size="185"
                                :data="loopServiceSpacesList"
                                :prefix="i18n.global.t('meos_control_web.served_space_colon')"
                                multiple
                                clearable
                                :show-parent-name="false"
                                has-confirm
                                has-check-all
                                panel-searchable
                            >
                            </m-tree-select>
                            <m-select
                                v-model="loopOpenCloseDemands"
                                :size="190"
                                mode="tags"
                                :options="SETTING_MODE_LOOP_OPTIONS"
                                :prefix="i18n.global.t('meos_control_web.loop_onoff_demand_colon')"
                                :placeholder="i18n.global.t('meos_control_web.please_select')"
                                has-confirm
                                has-check-all
                                multiple
                                clearable
                            ></m-select>
                            <m-search
                                :width="206"
                                immediate
                                type="enter"
                                :placeholder="i18n.global.t('meos_control_web.press_enter_search_loop_name')"
                                @change="val => (loopName = val)"
                                @clear="loopName = ''"
                            >
                            </m-search>
                        </template>
                    </div>
                </div>

                <div class="table-wrap">
                    <template v-if="showType === 'group'">
                        <!-- <template v-if="groupLoading"></template>
                        <template v-else-if="!currentGroupList?.length">
                            <m-illustration class="empty-content-wrap" :title="i18n.global.t('meos_control_web.no_content')" type="noContent"></m-illustration>
                        </template> -->
                        <LoopGroupContent
                            v-model:open-close-demands="groupOpenCloseDemands"
                            v-model:loop-name="groupLoopName"
                            v-model:group-name="groupName"
                            v-model="curGroupList"
                            :is-preview="isPreview"
                        />
                    </template>
                    <template v-else-if="showType === 'loop'">
                        <LoopConfigContent
                            v-model:lamp-types="loopLampTypes"
                            v-model:control-items="loopLinkedControlItems"
                            v-model:service-spaces="loopServiceSpaces"
                            v-model:open-close-demands="loopOpenCloseDemands"
                            v-model:loop-name="loopName"
                            v-model="curLoopList"
                            :is-preview="isPreview"
                        />
                    </template>
                </div>
            </div>
        </template>
        <template v-if="!isPreview" #footer>
            <m-button type="default" @click.stop="close('cancel')">{{ i18n.global.t('common.cancel') }}</m-button>
            <m-button type="primary" :loading="isSaveLoading" @click.stop="saveData">{{ i18n.global.t('common.save') }}</m-button>
        </template>
    </m-modal>
    <LoopRepeatTipsModal v-model="showRepeatTips" :repeat-tips="repeatTips" @close="showRepeatTips = false" @submit="handleSaveGroup(groupCount)"></LoopRepeatTipsModal>
</template>

<script setup>
import { globalModuleListMapKey, globalSpaceModuleMapKey, publicAreaVisibleKey } from '../../hooks/useGlobalData';
import { SETTING_MODE_GROUP_OPTIONS, SETTING_MODE_LOOP_OPTIONS, SMD_OPEN, NOT_CONFIGURED } from '../../constant';
import { setSpaceTreeData, getLoopTreeIds, getRepeatLoopsConfigByGroup } from '../../utils/index';
import { $Message } from 'meri-plus';
import { SMD_PARTIAL_OPEN } from '@/views/demand-management-light-upgraded/constant';
import LoopGroupContent from './LoopGroupContent.vue';
import LoopConfigContent from './LoopConfigContent.vue';
import LoopRepeatTipsModal from './LoopRepeatTipsModal.vue';
import i18n from '@/localization';

const props = defineProps({
    isPreview: {
        type: Boolean,
        default: true
    },
    isSpace: {
        type: Boolean,
        default: false
    },
    groupLoading: {
        type: Boolean,
        default: false
    }
});
const emits = defineEmits(['close', 'save']);
// 弹窗显隐
const showModal = defineModel('visible', { type: Boolean, default: false });
// 编组列表回显
const curGroupList = defineModel('groupList', { type: Array, default: [] });
// 回路列表回显
const curLoopList = defineModel('loopList', { type: Array, default: [] });
// 默认配置分类radio
const showType = defineModel('showType', { type: String, default: 'loop' });

const close = cancel => {
    showModal.value = false;
    nextTick(() => {
        emits('close', cancel);
    });
};

// 加载动画相关
// const { openLoading, closeLoading } = useLoading(
//     'table-wrap',
//     '#fff',
//     'ball',
//     {
//         width: '100px',
//         height: '100px'
//     },
//     0
// );

// watch(
//     () => props.groupLoading,
//     cur => {
//         if (cur && showType.value === 'group') {
//             openLoading();
//         } else {
//             closeLoading();
//         }
//     },
//     {
//         immediate: true
//     }
// );

const showRepeatTips = ref(false);
const repeatTips = ref([]);
const groupCount = ref({});

const isSaveLoading = ref(false);

// 配置单选项
const configRadioOptions = ref([
    {
        label: i18n.global.t('meos_control_web.group_config'),
        value: 'group'
    },
    {
        label: i18n.global.t('meos_control_web.loop_configuration'),
        value: 'loop'
    }
]);

const globalModuleListMap = inject(globalModuleListMapKey);
const globalSpaceModuleMap = inject(globalSpaceModuleMapKey);
const publicAreaVisible = inject(publicAreaVisibleKey);

// 编组筛选框
const groupOpenCloseDemands = ref([]);
const groupLoopName = ref('');
const groupName = ref('');

// 回路筛选框
const loopLampTypesList = computed(() => {
    const optionsMap = new Map();
    curLoopList.value.forEach(item => {
        if (item.lampFuncType) {
            optionsMap.set(item.lampFuncType, { id: item.lampFuncType, name: item.lampFuncTypeName });
        }
    });

    return [...optionsMap.values()];
});
const loopLampTypes = ref([]);
const loopLinkedControlItemsList = ref([]);
const curLoopModuleSpaceList = computed(() => {
    const moduleIdsSet = new Set();
    const optionsMap = new Map();
    const collator = new Intl.Collator('zh-CN', { sensitivity: 'case', numeric: true });

    curLoopList.value.forEach(item => {
        // 一条回路只会关联一个控制模块或者一个ddc，只取一个, 此处兼容多个
        item?.relController?.forEach(controller => {
            if (controller.id && controller.localName) {
                const moduleId = controller.id;
                moduleIdsSet.add(moduleId);
                // 控制模块的所在空间
                const relSpace = globalModuleListMap.value.get(moduleId)?.relSpace || {};
                if (relSpace?.id) {
                    // 所在空间下的全量控制模块
                    const linkedItems = globalSpaceModuleMap.value.get(relSpace.id)?.toSorted((a, b) => {
                        return collator.compare(b?.name, a?.name);
                    });
                    optionsMap.set(relSpace.id, {
                        id: relSpace.id,
                        name: relSpace.localName,
                        floorId: relSpace.floorId,
                        children: linkedItems.filter(v => moduleIdsSet.has(v.id))
                    });
                }
            }
        });
    });

    return [...optionsMap.values()];
});
const loopLinkedControlItems = ref([]);
const loopServiceSpacesList = ref([]);
const curLoopServiceSpaces = computed(() => {
    const { spacesInfo } = getLoopTreeIds(curLoopList.value);
    return spacesInfo?.map(v => ({ ...v, name: v?.localName }));
});
const loopServiceSpaces = ref([]);
const loopOpenCloseDemands = ref([]);
const loopName = ref('');

watch(showType, () => {
    // 切换radio重置筛选条件
    if (showType.value === 'group') {
        loopLampTypes.value = [];
        loopLinkedControlItems.value = [];
        loopServiceSpaces.value = [];
        loopOpenCloseDemands.value = [];
        loopName.value = '';
    } else {
        groupOpenCloseDemands.value = [];
        groupLoopName.value = '';
        groupName.value = '';
    }
});

watch(showModal, () => {
    // 弹窗显隐时重置筛选条件

    loopLampTypes.value = [];
    loopLinkedControlItems.value = [];
    loopServiceSpaces.value = [];
    loopOpenCloseDemands.value = [];
    loopName.value = '';

    groupOpenCloseDemands.value = [];
    groupLoopName.value = '';
    groupName.value = '';
});

watch(
    () => curLoopModuleSpaceList.value,
    spaceList => {
        if (spaceList.length) {
            loopLinkedControlItemsList.value = setSpaceTreeData(spaceList);
        }
    },
    {
        immediate: true
    }
);

watch(
    () => curLoopServiceSpaces.value,
    spaceList => {
        if (spaceList.length) {
            loopServiceSpacesList.value = setSpaceTreeData(spaceList);
        }
    },
    {
        immediate: true
    }
);

const handleSaveGroup = ({ openCount, closeCount, unConfigCount }) => {
    const newData = {
        groupList: curGroupList.value,
        loopList: curLoopList.value,
        showType: showType.value,
        tableShowType: structuredClone(showType.value),
        total: curLoopList.value.length,
        openCount,
        unConfigCount
    };
    emits('save', newData);
    close();
};

const saveData = () => {
    if (showType.value === 'group') {
        const { configuredGroups, repeatItems, openCount, closeCount, unConfigCount } = getRepeatLoopsConfigByGroup(curLoopList.value, curGroupList.value);
        if (configuredGroups.length === 0) {
            const errorMsg = curGroupList.value.length === 0 ? i18n.global.t('meos_control_web.no_available_group') : i18n.global.t('meos_control_web.no_group_configured');
            $Message.error({ title: errorMsg, duration: 1500 });
            return;
        }
        if (repeatItems?.length) {
            showRepeatTips.value = true;
            repeatTips.value = repeatItems;
            groupCount.value = { openCount, closeCount, unConfigCount };
            return;
        }
        handleSaveGroup({ openCount, closeCount, unConfigCount });
    } else {
        const configuredLoops = curLoopList.value.filter(item => item.settingMode && item.settingMode !== NOT_CONFIGURED);
        const isAllEmpty = configuredLoops.length === 0;

        const newData = {
            groupList: curGroupList.value,
            loopList: curLoopList.value,
            showType: showType.value,
            tableShowType: structuredClone(showType.value),
            // 回路未配置直接重置父级模式为部分开启
            settingMode: isAllEmpty ? NOT_CONFIGURED : SMD_PARTIAL_OPEN,
            total: curLoopList.value.length,
            openCount: curLoopList.value.filter(item => item.settingMode === SMD_OPEN).length,
            unConfigCount: curLoopList.value.filter(item => item.settingMode === NOT_CONFIGURED || !item.settingMode).length
        };
        emits('save', newData);
        close();
    }
};
</script>
<style lang="less" scoped>
.content-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
    max-height: 602px;
    gap: 12px;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .header-title {
            color: var(--gray-900, #1b2129);
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px;
        }

        .radio-group-wrapper {
            display: flex;
        }

        .filter-warp {
            display: flex;
            align-items: center;
            gap: 12px;
        }
    }

    .table-wrap {
        height: calc(100% - 44px);
    }
}
</style>
<style lang="less">
.m-modal-bg .m-modal-main {
    .m-modal-main-content.loopGroupWithConfigModalCustom {
        padding-block: 12px;
    }
}
</style>
