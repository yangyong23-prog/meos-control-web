<template>
    <div class="group-tree h100">
        <div class="group-tree-header fcb">
            <div class="fs18 fw700">{{ activeFuncType.name }}</div>
            <div class="fcc" style="gap: 12px">
                <template v-if="publicAreaVisible">
                    <m-button v-if="isAllOpen" type="text" size="medium" icon-position="right" @click="changeCollapseData">
                        <template #icon>
                            <SvgIcon name="unpack" />
                        </template>
                        {{ i18n.global.t('meos_control_web.expand_all1') }}
                    </m-button>
                    <m-button v-else type="text" size="medium" icon-position="right" @click="changeCollapseData">
                        <template #icon>
                            <SvgIcon name="pack" />
                        </template>
                        {{ i18n.global.t('meos_control_web.collapse_all') }}
                    </m-button>
                </template>
                <m-search v-model="keyword" :placeholder="i18n.global.t('meos_control_web.search_group_name_purpose')" type="enter" @change="handleChange"> </m-search>
                <m-button v-if="activeFuncType?.code" type="primary" size="medium" @click="showNewGroup = true">{{ i18n.global.t('meos_control_web.create_new_group') }}</m-button>
            </div>
        </div>
        <m-scrollbar height="calc(100% - 64px)">
            <m-collapse v-if="treeData.length" v-model="collapseData" only-icon-click :hover-style="false" icon-position="left">
                <m-collapse-item v-for="item in treeData" :id="item.instanceId" :key="item.instanceId" :title="item.localName">
                    <template #title="{ title }">
                        <span class="fw700 fs16"
                            >{{ item.instanceType === 'FLOOR' ? title + `（${item.buildingName}）` : title
                            }}<span class="fs14" style="color: var(--gray-600); font-weight: 400">{{ titleFn(item) }}</span></span
                        >
                    </template>
                    <div class="group-tree-box">
                        <LoopGroupCardPanel
                            v-for="val in item.children"
                            :key="val.id"
                            :data="val"
                            :active-func-type="activeFuncType"
                            @preview="handlePreview"
                            @edit="handleFun"
                            @copy="handleFun"
                        ></LoopGroupCardPanel>
                    </div>
                </m-collapse-item>
            </m-collapse>
            <div v-else :style="`height: calc(${height} - 64px);`" class="fcc">
                <m-illustration :title="i18n.global.t('meos_control_web.no_content')" type="noContent" />
            </div>
        </m-scrollbar>
    </div>
    <NewGroupModal
        v-if="showNewGroup"
        :template-type="templateType"
        :tag="activeFuncType.code"
        :default-loop-ids="defaultLoopIds"
        :data="activeData"
        :is-preview="!!previewGroupId"
        @close="closeNewGroup"
        @success="handleSuccess"
    />
</template>

<script setup>
import i18n from '@/localization';
import SvgIcon from '@/components/common/SvgIcon.vue';
import LoopGroupCardPanel from './LoopGroupCardPanel.vue';
import { sleep } from '@/utils/index';
import NewGroupModal from '../new-group-modal/index.vue';
import { uniq } from 'lodash';
import { changeActiveFuncTypeKey } from '../../hooks/useLoopGroupHook';
import { publicAreaVisibleKey, updateGroupListTimeKey } from '../../hooks/useGlobalData';
const props = defineProps({
    groupList: {
        type: Array,
        default: () => []
    },
    activeFuncType: {
        type: Object,
        default: () => ({})
    },
    templateType: {
        type: String,
        default: ''
    },
    height: {
        type: String,
        default: ''
    }
});
const showNewGroup = ref(false);
const isAllOpen = ref(false);
const defaultLoopIds = ref([]);
const collapseData = ref([]);
const activeData = ref({});
const changeActiveFuncType = inject(changeActiveFuncTypeKey);
const publicAreaVisible = inject(publicAreaVisibleKey);
const updateGroupListTime = inject(updateGroupListTimeKey);

const treeData = computed(() => {
    const treeMap = new Map();
    const arr = props.groupList.filter(item => {
        if (keyword.value) {
            return item.name.toLowerCase().includes(keyword.value.toLowerCase()) || item.purpose.toLowerCase().includes(keyword.value.toLowerCase());
        }
        return true;
    });
    arr.forEach(item => {
        item.show = false;
        if (treeMap.get(item.instanceId)) {
            treeMap.get(item.instanceId).children.push(item);
        } else {
            treeMap.set(item.instanceId, {
                ...item,
                children: [item]
            });
        }
    });
    return Array.from(treeMap.values());
});

const previewGroupId = ref('');
const keyword = ref('');
const handleChange = val => {
    keyword.value = val;
};
const closeNewGroup = () => {
    showNewGroup.value = false;
    defaultLoopIds.value = [];
    activeData.value = {};
    previewGroupId.value = '';
};
const titleFn = data => {
    if (data.instanceType === 'PROJECT') {
        return i18n.global.t('meos_control_web.only_available_for_project_level_config');
    }
    if (data.instanceType === 'BUILDING') {
        return i18n.global.t('meos_control_web.only_support_project_name', {
            name: data.localName
        });
    }
    return i18n.global.t('meos_control_web.only_support_building_name', {
        name: data.localName
    });
};
const changeCollapseData = () => {
    isAllOpen.value = !isAllOpen.value;
    if (!isAllOpen.value) {
        collapseData.value = treeData.value.map(item => item.instanceId);
    } else {
        collapseData.value = [];
    }
};

const openGroup = data => {
    defaultLoopIds.value = data.relObjects?.map(item => item.id) || [];
    activeData.value = data;
    nextTick(() => {
        showNewGroup.value = true;
    });
};

const handlePreview = data => {
    previewGroupId.value = data.id;
    openGroup(data);
};
const handleFun = (data, callback) => {
    openGroup(data);
    sleep().finally(() => {
        callback();
    });
};
const handleSuccess = () => {
    updateGroupListTime.value = new Date().toISOString();
    changeActiveFuncType(props.activeFuncType);
};
watch(collapseData, val => {
    isAllOpen.value = val.length === 0;
});
watch(
    () => props.groupList,
    val => {
        if (props.groupList.length) {
            const arr = [];
            props.groupList.forEach(item => {
                arr.push(item.instanceId);
            });
            collapseData.value = uniq(arr);
        }
    }
);
</script>
<style lang="less" scoped>
.group-tree {
    flex: 1;
    &-header {
        padding: 8px 16px;
    }
    &-box {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 8px;
    }
    :deep(.m-collapse-item__header) {
        padding: 8px 0;
        cursor: default;
        .m-collapse-item__header-icon {
            cursor: pointer;
        }
    }
    :deep(.m-scrollbar) {
        padding: 0 16px;
    }
}

.collapse-container {
    height: 100%;
    padding-inline: 16px;
    padding-top: 12px;
    padding-bottom: 80px;

    :deep(.m-collapse-item__header) {
        width: fit-content;
        padding-left: 0px;
        padding-block: 0px;
        margin-bottom: 12px;

        color: @grey-800;
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 26px;
        cursor: default;

        .m-collapse-item__header-icon {
            cursor: pointer;
        }

        .tips {
            color: var(--gray-600, #626c78);
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 26px;
        }
    }
    :deep(.m-collapse-item) {
        & + .m-collapse-item {
            margin-top: 12px;
        }
    }
}

.group-tree-cards-container {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}
</style>
