<template>
    <m-drawer
        :append-to="$drawerAppendTo"
        :show="show"
        :z-index="Z_INDEX.commonDrawer"
        :shadow-click="false"
        :drawer-class="[sidebarHight ? '' : 'noIframe', 'manualIntervention-drawer', showClose ? '' : 'hide-drawer-close-icon']"
        @close="close"
    >
        <template #title>
            <div class="fcb">
                <div class="fcc">
                    <div v-if="!showClose" class="fcc">
                        <div class="go-back-container" @click="close">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path
                                    d="M13.2508 2.3374L5.59046 9.99773L5.589 9.99931L13.2523 17.6626L14.4102 16.5047L7.90129 9.99582L14.4052 3.49186L13.2508 2.3374Z"
                                    fill="#8B949E"
                                />
                            </svg>
                        </div>
                        <div class="get-line ml8 mr8"></div>
                    </div>
                    <div v-ellipsis class="f18 m-ellipsis" style="max-width: 300px">{{ i18n.global.t('meos_control_web.manual_intervention_list') }}&nbsp;&nbsp;</div>
                </div>
                <div class="fc" style="height: 28px; padding: 4px 0 4px 4px">
                    <m-popover :disabled="isEdge()" :content="i18n.global.t('meos_control_web.not_operable_in_cloud')" theme="darkTransparent" :show-arrow="false">
                        <m-button type="link" size="small" :disabled="!isEdge() || !templateType?.value" @click="handleAdd">{{
                            i18n.global.t('meos_control_web.add_intervention')
                        }}</m-button>
                    </m-popover>
                    <div v-if="showClose" class="get-line ml8 mr8"></div>
                </div>
            </div>
        </template>
        <template #content>
            <div class="control-Intervention-wrap">
                <m-scrollbar ref="scrollbarRef" box-class="intervention-scrollbar">
                    <div v-if="interventionList?.length" class="list-container">
                        <div v-for="(item, index) in interventionList" :key="index">
                            <ManualConfigCard
                                :data="item"
                                :default-expand="(interventionList?.length ?? 0) < 2"
                                :expand-scroll="index === interventionList?.length - 1"
                                @edit:intervention="editIntervention"
                                @remove:intervention="removeIntervention"
                            />
                        </div>
                    </div>
                    <div v-else class="empty fcc">
                        <div style="text-align: center">
                            <SvgIcon name="empty" />
                            <div class="f14 ft">{{ i18n.global.t('meos_control_web.no_manual_intervention') }}</div>
                            <m-popover :disabled="isEdge()" :content="i18n.global.t('meos_control_web.not_operable_in_cloud')" theme="darkTransparent" :show-arrow="false">
                                <m-button type="primary" size="small" class="mt8" :disabled="!isEdge() || !templateType?.value" @click="handleAdd">{{
                                    i18n.global.t('meos_control_web.add_intervention')
                                }}</m-button>
                            </m-popover>
                        </div>
                    </div>
                </m-scrollbar>
            </div>
        </template>
    </m-drawer>
    <InterveneModal v-if="showModal" :edit-data="editObj" :lighting-type="templateType" :obj="objdata" @close="showModal = false" @ok="refreshListFucn" />
</template>
<script setup>
import { Z_INDEX } from '@/constants/zIndex';
import { useIntervene } from '../useManualInterventionSidebar';
import SvgIcon from '@/components/common/SvgIcon.vue';
import InterveneModal from '@/views/lightingControl/components/intervene/interveneModal.vue';
import ManualConfigCard from '../manual-intervention/ManualConfigCard.vue';
import { release } from '@/apis/LightingDetail';
import { getInterventionConfigDetail } from '@/apis/lightingDemandIntervention';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { $Message } from 'meri-plus';
import { isEdge } from '@/utils/envUtils';
import i18n from '@/localization';

const props = defineProps({
    instanceType: {
        type: String,
        default: ''
    },
    instanceIds: {
        type: Array,
        default: () => []
    },
    beginDateTime: {
        type: String,
        default: ''
    },
    endDateTime: {
        type: String,
        default: ''
    },
    showClose: {
        type: Boolean,
        default: true
    }
});
const { show, interventionList, initIntervene, templateType } = useIntervene(props);

const emits = defineEmits(['close']);
const showModal = ref(false);
const sidebarHight = ref(false);
const editObj = ref({});
const refRenderKey = ref(0);
const instanceTypeVisible = inject('instanceTypeVisible');
const indIdVisible = inject('indIdVisible');
const objdata = ref({
    id: indIdVisible.value,
    localName: '',
    objType: instanceTypeVisible.value
});
console.log(objdata, 'objdata');
const handleAdd = () => {
    // 云端禁用写入
    if (!isEdge()) {
        return;
    }
    editObj.value = null;
    showModal.value = true;
};
const close = () => {
    // const header = document.querySelector('.saasweb-header');
    // if (header) {
    //     header.style.zIndex = 2;
    // }
    nextTick(() => {
        emits('close');
    });
};
onMounted(() => {
    nextTick(() => {
        const header = document.querySelector('.saasweb-header');
        if (header) {
            // header.style.zIndex = 9999;
            sidebarHight.value = false;
        } else {
            sidebarHight.value = true;
        }
    });
});
//编辑
const editIntervention = item => {
    console.log('item:edit', item);
    const obj = {
        runningMonitorSecondType: item.runningMonitorSecondType,
        configId: item.configId,
        instanceId: item.instanceId,
        instanceType: item.instanceType
    };
    getInterventionConfigDetail(obj).then(res => {
        editObj.value = { id: item.configId, ...res.data };
        showModal.value = true;
    });
};
//解除干预
const removeIntervention = item => {
    console.log('item:remove', item);
    release({ interventionId: item.configId }).then(res => {
        if (res.code === SUCCESSCODE) {
            $Message.success({ title: `${i18n.global.t('meos_control_web.release_intervention_success')}` });
            initIntervene(true);
        }
    });
};
const refreshListFucn = () => {
    initIntervene(true);
};
</script>
<style lang="less">
.intervention-scrollbar {
    padding: 20px 24px;
    .m-scrollbar__content {
        min-height: 100%;
        display: flex;
        flex-direction: column;
    }
}
.hide-drawer-close-icon.manualIntervention-drawer.m-drawer {
    .m-drawer-container-header-icon {
        display: none;
    }
}
.manualIntervention-drawer {
    .m-drawer-container-content.draw_fixed {
        width: 100%;
        padding: 0;
        height: 100%;
    }
}
@media screen and (min-width: 1600px) {
    .manualIntervention-drawer {
        .m-drawer-container {
            width: 480px !important;
        }
    }
}
@media screen and (max-width: 1600px) {
    .manualIntervention-drawer {
        .m-drawer-container {
            width: 400px !important;
        }
    }
}
</style>
<style lang="less" scoped>
.control-Intervention-wrap {
    height: 100%;
    width: 100%;
}
.list-container {
    display: flex;
    flex-direction: column;
    row-gap: 16px;
    // padding-bottom: 20px;
}
.empty {
    height: 100%;
    width: 100%;
    flex: 1;
}

.go-back-container {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 4px;

    &:hover {
        background: rgba(196, 201, 207, 0.3);
    }
}
</style>
