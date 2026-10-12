<template>
    <div class="manage-warp">
        <m-sidebar-custom width="280" :change-size="true" resident="false" show class="sidber-bar">
            <m-scrollbar>
                <m-tree
                    v-if="data.length"
                    ref="tree"
                    v-model="chooseList"
                    :props="{ children: 'childrenVo' }"
                    node-key="classCode"
                    class="tree-box"
                    :data="data"
                    @change="treeChange"
                >
                    <template #nodeSlot="da">
                        <div class="tree-name-warp">
                            <span v-ellipsis class="tree-name">{{ da.name }}</span>
                            <span v-if="da.updateMark" class="update-mark"></span>
                        </div>
                    </template>
                </m-tree>
                <div v-else-if="!treeLoading" class="empty">暂无内容</div>
            </m-scrollbar>
        </m-sidebar-custom>

        <m-scrollbar v-if="nodes.length && !lengendListLoading" class="nodes-warp-scroll">
            <div class="nodes-warp">
                <div v-for="item in nodes" :key="item.id" class="node-item" :class="{ empty: !item.fileUrl }">
                    <NodeVE :node-data="item"></NodeVE>
                    <div class="info-line">
                        <span v-ellipsis class="info-name">{{ item.legendName }}</span>
                        <span class="info-btn"><m-button type="link" @click="toEditor(item)">编辑</m-button></span>
                    </div>
                </div>
            </div>
        </m-scrollbar>

        <m-illustration
            v-else-if="!lengendListLoading"
            class="ill-empty"
            title="暂无内容"
            type="noContent"
        ></m-illustration>
        <div v-show="lengendListLoading" class="loading-warp"></div>
        <NodeEditorModal v-model:visible="show" :node-data="editorObj" @close="close" @save="save"></NodeEditorModal>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import { MTree, MButton, MIllustration, MLoading, $Message } from 'meri-plus';
import NodeVE from '@/views/Common/NodeVE/Index.vue';
import NodeEditorModal from '@/views//Common/NodeEditorModal.vue';
import { queryLengendTree, queryLengend, putLengend } from '@/api/lengendManage';
const data = ref([]);
const chooseList = ref([]);
const chooseObj = ref({});
const treeLoading = ref(true);

treeLoading.value = true;
queryLengendTree().then(async res => {
    chooseObj.value = res[0];

    while (chooseObj.value?.children?.length) {
        chooseObj.value = chooseObj.value.children[0];
    }
    data.value = res;
    if (chooseObj.value) {
        chooseList.value = [chooseObj.value.classCode];
    } else {
        chooseList.value = [];
    }
    await queryLengendByClassCode();
    treeLoading.value = false;
});

const nodes = ref([]);
const lengendListLoading = ref(true);
const queryLengendByClassCode = async () => {
    lengendListLoading.value = true;
    if (chooseObj.value.classCode) {
        const res = await queryLengend({
            classCode: chooseObj.value.classCode
        });
        nodes.value = res;
    } else {
        nodes.value = [];
    }
    lengendListLoading.value = false;
};

const treeChange = (a, obj) => {
    chooseList.value = a;
    chooseObj.value = obj;
    queryLengendByClassCode();
};

const show = ref(false);

const editorObj = ref();
const toEditor = item => {
    editorObj.value = item;
    show.value = true;
};

const close = () => {
    show.value = false;
    editorObj.value = undefined;
};

const save = target => {
    const editorObject = editorObj.value;
    putLengend(target)
        .then(() => {
            $Message.success({
                title: '保存成功',
                showClose: false,
                duration: 3000
            });
            const { fileUrl, anchors } = target;
            editorObject.fileUrl = fileUrl;
            editorObject.anchors = JSON.parse(JSON.stringify(anchors));
            queryLengendByClassCode();
            const mark = nodes.value.some(da => !da.fileUrl);
            chooseObj.value.updateMark = mark;
        })
        .catch(() => {
            $Message.error({
                title: '保存失败',
                showClose: false,
                duration: 3000
            });
        });
    close();
};

MLoading.service({
    target: '.loading-warp',
    fullscreen: false,
    duration: 30000,
    lottieName: 'ball',
    background: 'none',
    loadTextOptions: {
        text: '加载中',
        style: {
            top: '-15px'
        }
    },
    loadIconStyle: {
        width: '100px',
        height: '100px'
    }
});
</script>
<style lang="scss" scoped>
.manage-warp {
    display: flex;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #ffffff;
    align-items: flex-start;
    .sidber-bar {
        height: 100%;
    }
    /* stylelint-disable-next-line selector-class-pattern */
    :deep(.p-SidebarCustomProps-box .p-SidebarCustomProps) {
        margin: 0 13px 0 0;
    }

    /* stylelint-disable-next-line selector-class-pattern */
    :deep(.p-SidebarCustomPropsHide) {
        background: none;
    }
    :deep(.m-loading-mask) {
        background: none;
    }
    .tree-box {
        min-width: 100px;
        width: 100%;
        height: 100%;
        padding: 16px;
        /* stylelint-disable-next-line selector-class-pattern */
        :deep(.nodeSlot) {
            width: 100%;
        }
        .tree-name-warp {
            width: 100%;
            padding-right: 12px;
            display: flex;
            .tree-name {
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                line-height: 24px;
            }
            .update-mark {
                display: inline-block;
                position: absolute;
                right: 8px;
                top: 16px;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background-color: var(--red-500);
            }
        }
        .empty {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            color: var(--grey-600);
        }
    }
    .ill-empty {
        flex: 1;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .loading-warp {
        flex: 1;
        height: 100%;
    }
    .nodes-warp {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        padding: 16px 16px 16px 32px;
        overflow: auto;
        .node-item {
            width: 275px;
            height: 260px;
            display: flex;
            flex-direction: column;
            border-radius: 8px;
            border: 1px solid var(--grey-300);
            overflow: hidden;
            &.empty {
                border-width: 2px;
                border-color: var(--red-500);
            }
            .info-line {
                height: 40px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 4px 12px 4px 16px;
                background-color: #ffffff;
                .info-name {
                    color: var(--grey-800);
                    font-size: 14px;
                    font-weight: bold;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
        }
    }
}
</style>
