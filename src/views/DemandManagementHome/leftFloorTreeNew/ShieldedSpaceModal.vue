<template>
    <m-modal
        v-model:visible="spaceTableModel"
        :append-to="$modalAppendTo"
        type="default"
        :width="600"
        :height="510"
        :title="i18n.global.t('meos_control_web.shielded_zone_list')"
        :footer="false"
        @close="close"
    >
        <template #content>
            <div v-loading="finalLoading" style="height: 100%; padding-bottom: 8px" element-loading-lottiename="circle">
                <template v-if="finalLoading">
                    <div></div>
                </template>
                <m-table v-else :columns="list" :data-source="treeShieldedData">
                    <template #name="row">
                        <span v-if="!row.children" v-ellipsis class="space-name">{{ row.name }}</span>
                        <strong v-else>{{ row.name }}</strong>
                    </template>
                    <template #operation="row">
                        <m-button v-if="!row.children" type="link" size="small" @click="changeUnblock(row)">{{ i18n.global.t('meos_control_web.unshield') }}</m-button>
                    </template>
                </m-table>
            </div>
            <m-modal
                v-model:visible="modelInner"
                :append-to="$modalAppendTo"
                type="info"
                :title="`${i18n.global.t('meos_control_web.unblock_or_not_colon')}${itemObject.name}`"
                :width="420"
                :modal-class-name="'modal-confirm-inner'"
            >
                <template #footer>
                    <div>
                        <div class="footers">
                            <m-button style="margin-right: 12px" @click="modelInner = false">{{ i18n.global.t('common.cancel') }}</m-button>
                            <m-button type="primary" @click="closeModelInner">{{ i18n.global.t('common.confirm') }}</m-button>
                        </div>
                    </div>
                </template>
            </m-modal>
        </template>
    </m-modal>
</template>

<script setup>
import useMessage from '@/components/hooks/useMessage';
import { addInstanceConfig } from '@/apis/DemandManagementHome';
import { staticTreeInjectKey, staticTreeIsLoadingInjectKey, shieldedAndBlackListInjectKey, isShieldedAndBlackListLoadingInjectKey } from '../constant/injectKey';
import emitter from '@/utils/bus';
import i18n from '@/localization';
import { OBJ_TYPE } from '@/utils/globalVariables';

const { useSuccessMessage } = useMessage();
const emits = defineEmits(['close']);
const templateType = inject('templateType');

const staticTreeData = inject(staticTreeInjectKey);
const staticTreeLoading = inject(staticTreeIsLoadingInjectKey);
const isShieldedAndBlackListLoading = inject(isShieldedAndBlackListLoadingInjectKey);
const treeShieldedData = ref([]);
const shieldedAndBlackList = inject(shieldedAndBlackListInjectKey);

const finalLoading = computed(() => staticTreeLoading?.value || isShieldedAndBlackListLoading?.value);

const shieldSpaces = computed(() => {
    const res = shieldedAndBlackList?.value?.filter(v => v?.config?.shielded) || [];
    return res;
});

const spaceTableModel = ref(false);
const modelInner = ref(false);
const itemObject = ref({});
const close = () => {
    spaceTableModel.value = false;
    nextTick(() => {
        emits('close');
    });
};

const list = ref([
    { title: i18n.global.t('meos_control_web.shielded_zone_name'), dataIndex: 'name' },
    { title: i18n.global.t('meos_control_web.operation1'), dataIndex: 'operation', fixed: 'right', width: 140 }
]);
const changeUnblock = row => {
    modelInner.value = true;
    itemObject.value = row;
};
const closeModelInner = () => {
    if (!itemObject.value?.id) {
        return;
    }
    const selectedFloorId = shieldSpaces.value?.find(v => v?.id === itemObject.value?.id)?.floorId;
    addInstanceConfig({
        templateType: templateType.value,
        instanceType: 'SPACE',
        instanceIds: [itemObject.value.id],
        config: { shielded: false }
    }).then(res => {
        if (res.data) {
            useSuccessMessage(i18n.global.t('meos_control_web.unshield_success'));
            const treeNodeConfig = { openFloor: true, selectTreeNoe: { ...itemObject.value } };
            emitter.emit('updateShieldAndBlackList', { floorIds: [selectedFloorId], treeNodeConfig });
            emitter.emit('refreshRightConfigList');
            modelInner.value = false;
        }
    });
};

const generateTreeByLeaf = (tree, shieldData) => {
    const generateNode = node => {
        node.open = true;
        if (node.objType === OBJ_TYPE.FLOOR) {
            const spaces = shieldData?.filter(v => v?.floorId === node.id);
            if (spaces?.length) {
                node.children = spaces?.map(v => ({ ...v, name: v?.localName ?? '--' }));
            } else {
                return null;
            }
        }

        if (node.children?.length) {
            const newChildren = node.children.map(child => generateNode({ ...child }));
            // 过滤掉空的子节点
            node.children = newChildren.filter(child => child !== null);
            // 如果没有子节点，返回 null
            return node.children.length ? node : null;
        }

        return node;
    };

    return tree.map(node => generateNode({ ...node })).filter(node => node !== null); // 过滤掉空节点
};

onMounted(() => {
    spaceTableModel.value = true;

    watch(
        [staticTreeData, shieldSpaces],
        ([curTree, curShield]) => {
            if (curTree.length) {
                const newTree = generateTreeByLeaf(curTree, curShield);
                treeShieldedData.value = newTree;
            }
        },
        {
            immediate: true
        }
    );
});
</script>
<style lang="less" scoped>
.space-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
<style lang="less">
.modal-confirm-inner {
    .m-modal-title {
        min-height: 66px;
    }
}
</style>
