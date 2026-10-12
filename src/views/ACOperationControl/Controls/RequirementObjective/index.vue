<template>
    <m-scrollbar box-class="require-objective-scrollbar" class="temperature-co2-right" :height="'100%'">
        <div>
            <div v-if="!isEmpty" class="header">{{ i18n.global.t('meos_control_web.temp_co2_target_config') }}</div>
            <div id="right-main" class="right-main" :style="{ height: props.spaceId && props.spaceId.length ? '100%' : '' }">
                <div v-if="isEmpty" class="h100 fcc">
                    <Empty :text="i18n.global.t('meos_control_web.no_auto_demand_today')" />
                </div>
                <div v-else>
                    <Details :object-setting="objectSetting" :object-parent-setting="objectParentSetting" />
                </div>
            </div>
        </div>
    </m-scrollbar>
</template>

<script lang="ts" setup>
// @ts-ignore
import i18n from '@/localization';
import { Ref } from 'vue';
import Details from './details/Details.vue';
// import manualIntervention from '../manualIntervention/index.vue';
import { MLoading } from 'meri-plus';
import { listObjectSetting } from '@/apis/ACOperationControl';
import { getQueryString } from '@/utils/tools';
import { ObjectSetting } from './types';
import Empty from '@/components/common/Empty.vue';
import baseStore from '@/store/baseStore';
import { getDayjsTz } from '@/utils/globalVariables';

const instanceType: Ref<string> = inject('instanceType', ref(''));
const objectSetting = ref<any>();
const objectParentSetting = ref<any>();
const realSetting = ref<ObjectSetting>();
const isEmpty = ref(true);
const props = defineProps({
    loading: {
        default: true,
        type: Boolean
    },
    spaceId: {
        default: () => [],
        type: Array
    },
    curFloorId: {
        type: String,
        default: ''
    }
});
const getInfo = (loading: Boolean) => {
    const loadingM =
        loading &&
        MLoading.service({
            target: '.temperature-co2-right',
            fullscreen: false,
            duration: 30000,
            lottieName: 'ball',
            background: 'rgb(255,255,255,1)',
            loadIconStyle: {
                width: '100px',
                height: '100px'
            }
        });

    let params = {
        projectId: baseStore().projectId,
        date: getDayjsTz().format('YYYY-MM-DD'),
        instanceTypeAndIds: {}
    };
    if (props.spaceId.length) {
        params.instanceTypeAndIds = {
            SPACE: [props.spaceId]
        };
    } else if (props.curFloorId) {
        params.instanceTypeAndIds = {
            FLOOR: [props.curFloorId]
        };
    } else {
        params.instanceTypeAndIds = {
            PROJECT: [baseStore().projectId]
        };
    }
    listObjectSetting(params).then((res: any) => {
        objectSetting.value = {};
        objectParentSetting.value = {};
        const { result, data } = res;
        if (result === 'success' && data.length) {
            isEmpty.value = false;
            const objData = data.find((item: { instanceId: string }) => (item.instanceId === props.curFloorId ? props.curFloorId : baseStore().projectId));
            let { setting } = objData;
            if (instanceType.value === 'PROJECT' && !getQueryString('date')) {
                setting = objData.realSetting;
            }
            const keys = Object.keys(setting || {});
            for (const item of keys) {
                if (item.includes('Value') || item.includes('Hour')) {
                    if (setting[item] && item !== 'carbonDioxideTargetValue' && item !== 'carbonDioxideUpperLimitValue') {
                        setting[item] = (setting[item] * 1).toFixed(1);
                    } else {
                        setting[item] = setting[item] * 1;
                    }
                }
            }
            const parentKeys = Object.keys(objData.parentSetting || {});
            for (const item of parentKeys) {
                if (item.includes('Value') || item.includes('Hour')) {
                    if (objData.parentSetting[item] && item !== 'carbonDioxideTargetValue' && item !== 'carbonDioxideUpperLimitValue') {
                        objData.parentSetting[item] = (objData.parentSetting[item] * 1).toFixed(1);
                    } else {
                        objData.parentSetting[item] = objData.parentSetting[item] * 1;
                    }
                }
            }
            objectParentSetting.value = objData.parentSetting || {};
            objectSetting.value = setting || {};
            realSetting.value = objData.realSetting || {};
            objectSetting.value!.isBusinessTimeReferenced = objData.isBusinessTimeReferenced;
            objectSetting.value!.isParticipateInSchedulingReferenced = objData.isParticipateInSchedulingReferenced;
        } else {
            isEmpty.value = true;
        }
        setTimeout(() => {
            loading && loadingM.destroy();
        }, 500);
    });
};

onMounted(() => {
    getInfo(props.loading);
});

watch(
    () => [props.curFloorId, props.spaceId],
    (newFloorId, oldFloorId) => {
        getInfo(props.loading);
    }
);

provide('realSetting', realSetting);
</script>
<style lang="less" scoped>
:deep(.require-objective-scrollbar) {
    padding: 20px 10px 0 24px;
}
.temperature-co2-right {
    width: 100%;
    padding-right: 16px;
    .header {
        color: var(--gray-800, #2e3742);
        font-size: 16px;
        font-weight: 700;
        line-height: 24px;
    }
    .right-main {
        height: calc(100% - 26px);
        :deep(.m-loading-mask) {
            z-index: var(--z-index-ac-operation-control-right-loading-mask) !important;
        }
    }
}
</style>
