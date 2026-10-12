<template>
    <div class="equip-item" @mouseenter="emits('hoverObj', data)" @mouseleave="emits('unhoverObj', data)">
        <m-tips :content="i18n.global.t('meos_control_web.device_not_on_floor_click_jump')" theme="darkTransparent" placement="left" :disabled="!showOtherFloorTips">
            <div :class="['equip-title', !showOtherFloorTips ? 'cp' : '']" @click="emits('clickObj', data)">
                <span class="equip-name">
                    <span class="equip-name-text">{{ data.localName ?? '--' }}</span>
                    <span v-if="currentPlayingObj?.id === data.id && showToCamera" class="current-playing">{{ i18n.global.t('meos_control_web.current') }}</span>
                    <TemplateObjectTags :status-data="tagsValue" :select-obj="data" :template-type="DETAIL" />
                </span>
                <span v-if="showToCamera" class="to-vedio-icon cp" @click.stop="openPlayer"
                    ><MointorPlainIcon></MointorPlainIcon><span>{{ i18n.global.t('meos_control_web.view_monitor') }}</span></span
                >
            </div>
        </m-tips>

        <div class="equip-setting">
            <IndependentSetting :list="listObjForIndependentSetting" :select-obj="data"></IndependentSetting>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import IndependentSetting from '@/components/independentSetting/index.vue';
import useEquipInfoSSEHandle from '@/components/hooks/useEquipInfoSSEHandle';
import MointorPlainIcon from '@/assets/svg/monitor-plain-icon.svg';
import { CAMERA_CLASS_CODES } from '@/constants/camera';
import TemplateObjectTags from '@/components/templateObjectTags/index.vue';
import DockSingleton from '@/hooks/responsiveDock';
import { DETAIL } from '@/utils/globalVariables';
const { getIotData } = DockSingleton.getInstance();
const props = defineProps({
    data: {
        type: Object,
        default: () => {}
    },
    selectObj: {
        type: Object,
        default: () => {}
    },
    currentPlayingObj: {
        type: Object,
        default: () => {}
    },
    currentFloorObj: {
        type: Object,
        default: () => null
    },
    type: {
        type: String,
        default: ''
    }
});

const showToCamera = computed(() => CAMERA_CLASS_CODES.indexOf(props.data?.classCode) !== -1);
const showOtherFloorTips = computed(() => props.currentFloorObj && props.data?.inFloor && props.currentFloorObj?.id !== props.data?.inFloor?.id);

const tagsValue = computed(() => {
    const filterInfoCode = ['onlineStatus', 'orderFailAlarm', 'alarmeventdetail'];
    const { relInfoCodeGroupConfigs } = props.data || {};
    const equipStatusObj = relInfoCodeGroupConfigs?.find(i => i.groupCode === 'equipStatus');
    if (equipStatusObj) {
        equipStatusObj.relInfoCodeConfigs = equipStatusObj.relInfoCodeConfigs.filter(d => {
            if (d.infoCode === 'onlineStatus' && getIotData(props.data.id, 'onlineStatus')?.dataValue === '1') return false;
            return filterInfoCode.includes(d.infoCode);
        });
    }
    return equipStatusObj;
});

// const isOnlineStatus = computed(() => {
//     return props.data?.relInfoCodeGroupConfigs?.find(i => i.groupCode === 'equipStatus')?.relInfoCodeConfigs?.find(d => d.infoCode === 'onlineStatus')?.dataValue === '1';
// });

const emits = defineEmits(['openMonitorPlayer', 'hoverObj', 'unhoverObj', 'clickObj']);

// eslint-disable-next-line vue/no-setup-props-destructure
const equipmentId = ref(props.data.id);

// eslint-disable-next-line vue/no-setup-props-destructure
const relInfoCodeGroupConfigs = ref(props.data.relInfoCodeGroupConfigs);
const equipStatus = ref(relInfoCodeGroupConfigs.value?.find(i => i.groupCode === 'equipStatus'));
const equipParameterSet = ref(relInfoCodeGroupConfigs.value?.find(i => i.groupCode === 'equipParameterSet'));

useEquipInfoSSEHandle(
    equipmentId,
    {
        equipStatus: equipStatus,
        equipParameterSet: equipParameterSet
    },
    true,
    DETAIL
);

const listObjForIndependentSetting = computed(() => {
    const { data } = props;
    // 转化为independentSetting所需要的格式
    return {
        ...data,
        // 待验证
        ...equipParameterSet.value
        // relInfoCodeConfigs: equipParameterSet.value?.relInfoCodeConfigs
    };
});

const openPlayer = () => {
    emits('openMonitorPlayer', props.data, equipStatus.value);
};
</script>
<style lang="less" scoped>
.equip-item {
    border-bottom: 1px solid var(--gray-200);
    &:last-child {
        border: none;
    }

    &:hover {
        background-color: var(--gray-300);
        .equip-title .equip-name-text {
            color: var(--blue-500);
        }
    }

    .equip-title {
        display: flex;
        justify-content: space-between;
        // cursor: pointer;
        padding: 12px;
        gap: 4px;

        .equip-name {
            display: flex;
            align-items: center;
            gap: 8px;

            .equip-name-text {
                font-weight: bold;
            }
        }

        .current-playing {
            display: inline-block;
            padding: 0 4px;
            border-radius: 2px;
            background-color: var(--blue-100);
            color: var(--blue-700);
        }

        .to-vedio-icon {
            display: flex;
            padding: 0px 2px;
            justify-content: flex-end;
            align-items: center;
            gap: 4px;
            font-size: 14px;
            font-weight: var(--platform-font-weight);
            line-height: 22px;
            color: var(--gray-600);
            border-radius: 2px;
            &:hover {
                background-color: var(--gray-400);
            }
        }
    }

    .equip-setting {
        padding: 0 0px;
        :deep(.setting-item) {
            /* border-bottom: none; */
            &:first-child {
                > .pd {
                    padding-top: 0 !important;
                }
            }
        }
    }
}
.cd {
    cursor: default;
}
</style>
