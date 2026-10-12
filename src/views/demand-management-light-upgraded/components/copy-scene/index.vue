<template>
    <m-modal
        v-model:visible="show"
        :append-to="$modalAppendTo"
        :escable="false"
        modal-class-name="copy-scene-modal"
        type="default"
        :title="i18n.global.t('meos_control_web.duplicate_scene')"
        :width="420"
        :need-scrollbar="false"
        @close="close"
    >
        <template #content="{ maxHeight }">
            <template v-if="data.length !== 0">
                <div class="copy-scene-tip">
                    {{ i18n.global.t('meos_control_web.one_click_copy_other_scenario_circuit_config_to_current_will_overwrite') }}
                </div>
                <div class="copy-scene-content">
                    <m-scrollbar class="h100" :height="`calc(${maxHeight} - 80px)`">
                        <m-tree ref="tree" v-model="ids" :data="data" last-stage searchable> </m-tree>
                    </m-scrollbar>
                </div>
            </template>
            <div v-else class="copy-scene-modal-empty">
                <m-illustration :title="i18n.global.t('meos_control_web.no_copyable_scene')" type="noContent"></m-illustration>
            </div>
        </template>
        <template #footer>
            <m-button type="default" @click.stop="close">{{ i18n.global.t('common.cancel') }}</m-button>
            <m-button type="primary" :loading="loading" @click.stop="submit">{{ i18n.global.t('common.confirm') }}</m-button>
        </template>
    </m-modal>
</template>

<script setup>
import { copySceneConfig, listAllScene } from '@/apis/lightingRequirements';
import useLoading from '@/hooks/useLoading';
import { SUCCESSCODE } from '@/utils/globalVariables';
import baseStore from '@/store/baseStore';
import { useSuccessMessage } from '@/utils/tools';
import i18n from '@/localization';

const props = defineProps({
    templateType: {
        type: String,
        default: ''
    },
    curSelectedPeriodId: {
        type: String,
        default: ''
    },
    templateId: {
        type: String,
        default: ''
    }
});
const emits = defineEmits(['close', 'success']);
const ids = ref([]);
const show = ref(false);
const data = ref([]);
const loading = ref(false);
// 加载动画相关
const { openLoading, closeLoading } = useLoading(
    'copy-scene-modal-empty',
    '#ffffff',
    'ball',
    {
        width: '100px',
        height: '100px'
    },
    0
);
const getListAllScene = async () => {
    openLoading();
    try {
        const res = await listAllScene({
            projectId: baseStore().projectId,
            templateType: props.templateType,
            excludeSceneIds: [props.curSelectedPeriodId]
        });
        data.value = res.data.map(item => {
            const obj = {
                id: item.template.templateId,
                name: item.template.templateName,
                isEnabled: item.template.isEnabled
            };
            if (props.templateId === item.template.templateId) {
                obj.open = true;
            }
            return {
                children: item.scenes.map(scene => {
                    return {
                        id: scene.id,
                        name: scene.sceneName
                    };
                }),
                ...obj
            };
        });
        data.value = data.value.filter(item => item.isEnabled && item.children.length > 0);
    } catch (error) {
        console.log(error);
    } finally {
        closeLoading();
    }
};
const submit = async () => {
    if (ids.value?.length === 0 || ids.value?.[0] === props.curSelectedPeriodId) {
        return;
    }
    loading.value = true;
    try {
        const res = await copySceneConfig({
            fromSceneId: ids.value[0],
            sceneId: props.curSelectedPeriodId
        });
        if (res.code === SUCCESSCODE) {
            useSuccessMessage(i18n.global.t('meos_control_web.duplicate_success'));
            emits('success');
        }
    } catch (error) {
        console.log(error);
    }
    loading.value = false;
    close();
};
onMounted(() => {
    show.value = true;
    getListAllScene();
});
const close = () => {
    show.value = false;
    nextTick(() => {
        emits('close');
    });
};
</script>
<style lang="less">
.copy-scene-tip {
    border-radius: 4px;
    padding: 8px 12px;
    background-color: var(--blue-100);
    color: var(--gray-600);
    height: 60px;
    line-height: 22px;
}
</style>
