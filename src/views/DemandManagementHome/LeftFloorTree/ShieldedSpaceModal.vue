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
            <div v-loading="ShieldedLoading" style="height: 100%; padding-bottom: 8px" element-loading-lottiename="circle">
                <template v-if="ShieldedLoading">
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
import { templateTagInjectKey } from '../constant/injectKey';
import i18n from '@/localization';

const { useSuccessMessage } = useMessage();
const emits = defineEmits(['close']);
const templateTag = inject(templateTagInjectKey);
const templateType = inject('templateType');
const treeShieldedData = inject('treeShieldedData');
const queryTreeShieldedObject = inject('queryTreeShieldedObject');
const queryDemandTree = inject('queryDemandTree');
const ShieldedLoading = inject('ShieldedLoading');
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
    addInstanceConfig({
        templateType: templateType.value,
        instanceType: 'SPACE',
        instanceIds: [itemObject.value.id],
        config: { shielded: false }
    }).then(res => {
        if (res.data) {
            useSuccessMessage(i18n.global.t('meos_control_web.unshield_success'));
            queryTreeShieldedObject(templateType?.value);
            queryDemandTree(templateType?.value, templateTag?.value);
            modelInner.value = false;
        }
    });
};

onMounted(() => {
    spaceTableModel.value = true;
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
