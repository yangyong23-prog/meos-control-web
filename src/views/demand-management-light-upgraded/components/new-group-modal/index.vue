<template>
    <m-modal
        v-model:visible="show"
        :append-to="$modalAppendTo"
        :escable="false"
        type="default"
        modal-class-name="lighting-new-group-wrap"
        :width="1260"
        :title="title"
        :footer="!disabledModify"
        :need-scrollbar="false"
        @close="close"
    >
        <template #content="{ maxHeight }">
            <NewGroupMain
                ref="mainFormRef"
                :is-preview="preview"
                :disabled-modify="disabledModify"
                :max-height="maxHeight"
                :style="{ height: `calc(${maxHeight})` }"
                :grid-data="gridData"
                :data="data"
            />
        </template>
        <template v-if="!disabledModify" #footer>
            <Footer
                :loading="loading"
                :is-preview="preview"
                :data="data"
                :disabled-modify="disabledModify"
                @confirm="saveOrEdit"
                @cancel="close"
                @edit="startEdit"
                @remove="removeGroup"
                @close="close"
            />
        </template>
    </m-modal>
</template>
<script setup>
import i18n from '@/localization';
import NewGroupMain from './newGroupMain.vue';
import Footer from './footer.vue';
import { $Message } from 'meri-plus';
import { useAddGroup } from '../../hooks/useAddGroupHook';
import { activeFuncTypeKey, changeActiveFuncTypeKey } from '../../hooks/useLoopGroupHook';
import { addInstanceGroup, editInstanceGroup } from '@/apis/lightingRequirements';
import { SUCCESSCODE } from '@/utils/globalVariables';
const mainFormRef = ref();
const emits = defineEmits(['close', 'success']);
const props = defineProps({
    templateType: {
        type: String,
        default: ''
    },
    defaultLoopIds: {
        type: Array,
        default: () => []
    },
    isPreview: {
        type: Boolean,
        default: false
    },
    disabledModify: {
        type: Boolean,
        default: false
    },
    data: {
        type: Object,
        default: () => ({})
    },
    tag: {
        type: String,
        default: ''
    }
});
const changeActiveFuncType = inject(changeActiveFuncTypeKey, () => {});
const activeFuncType = inject(activeFuncTypeKey, ref());
const formParams = ref({
    groupName: props.data.name || '',
    purpose: props.data.purpose || ''
});
const { gridData, loopListMap, viewSelect } = useAddGroup(props);
const show = ref(false);
provide('lightGroupFormParams', formParams);
const preview = ref(props.isPreview);
watch(
    () => props.isPreview,
    () => {
        preview.value = props.isPreview;
    }
);
const title = computed(() => {
    if (props.data.id) {
        if (preview.value) {
            return i18n.global.t('meos_control_web.preview_group');
        }
        return i18n.global.t('meos_control_web.edit_group');
    }
    return i18n.global.t('meos_control_web.create_new_group');
});
const startEdit = () => {
    preview.value = false;
};
onMounted(() => {
    if (props.isPreview) {
        viewSelect.value = 'checked';
    } else {
        viewSelect.value = 'uncheck';
    }
    show.value = true;
});
const close = () => {
    show.value = false;
    nextTick(() => {
        emits('close');
    });
};
const removeGroup = () => {
    changeActiveFuncType(activeFuncType.value);
    close();
};
const loading = ref(false);
const saveOrEdit = async () => {
    mainFormRef.value.validataForm(async (valid, error) => {
        if (!valid) return;
        const instanceIds = [];
        loopListMap.value.forEach(val => {
            if (val.isSelected) {
                instanceIds.push(val.id);
            }
        });
        if (instanceIds.length <= 0) {
            $Message.error({ title: i18n.global.t('meos_control_web.at_least_one_loop') });
            return;
        }
        if (loading.value) return;
        loading.value = true;
        try {
            const params = {
                templateType: props.templateType,
                groupName: formParams.value.groupName,
                purpose: formParams.value.purpose,
                tag: props.tag,
                instanceType: 'CIRCUIT',
                instanceIds
            };
            if (props.data.id) {
                const res = await editInstanceGroup({
                    id: props.data.id,
                    ...params
                });
                if (res.code === SUCCESSCODE) {
                    $Message.success({ title: i18n.global.t('common.operation_success') });
                    close();
                } else if (res.code !== 'A0400') {
                    $Message.error({ title: i18n.global.t('meos_control_web.input_field_error') });
                }
            } else {
                const res = await addInstanceGroup(params);
                if (res.code === SUCCESSCODE) {
                    $Message.success({ title: i18n.global.t('common.operation_success') });
                    close();
                } else {
                    $Message.error({ title: i18n.global.t('meos_control_web.input_field_error') });
                }
            }
            emits('success');
        } catch (err) {
            console.log(err);
        }
        loading.value = false;
    });
};
</script>
<style lang="less">
.lighting-new-group-wrap.m-modal-bg {
    .m-modal-main .m-modal-main-content {
        padding: 0;
    }
}
</style>
