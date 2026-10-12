<template>
    <m-modal
        v-model:visible="show"
        :append-to="$modalAppendTo"
        modal-class-name="iot-modal"
        :width="385"
        type="default"
        :title="i18n.global.t('meos_control_web.by_iot_monitoring')"
        :escable="false"
        @close="close"
    >
        <template #content>
            <div style="color: var(--gray-500); margin-bottom: 8px">
                {{ i18n.global.t('meos_control_web.checked_spaces_added_to_blacklist')
                }}<m-popover width="403px" :show-arrow="false" theme="darkTransparent">
                    <template #content>
                        {{ i18n.global.t('meos_control_web.checked_spaces_added_to_blacklist_explain') }}
                    </template>
                    <IconMeriComponentDialogLinear style="margin: 0 0 -2px 4px" :size="14" color="#626C78" />
                </m-popover>
            </div>
            <div style="width: 100%">
                <m-checkbox-group v-model="iotDatas">
                    <m-checkbox label="tdb"
                        >{{ i18n.global.t('meos_control_web.not_delivered')
                        }}<span class="fw600" :style="{ marginInline: isCurrentCn() ? '0px' : '2px' }">{{ i18n.global.t('meos_control_web.temperature') }}</span
                        >{{ i18n.global.t('meos_control_web.data_space') }}</m-checkbox
                    >
                    <m-checkbox label="co2"
                        >{{ i18n.global.t('meos_control_web.not_delivered') }}<span class="fw600" :style="{ marginInline: isCurrentCn() ? '0px' : '2px' }">CO₂</span
                        >{{ i18n.global.t('meos_control_web.data_space') }}</m-checkbox
                    >
                    <m-checkbox label="rh"
                        >{{ i18n.global.t('meos_control_web.not_delivered')
                        }}<span class="fw600" :style="{ marginInline: isCurrentCn() ? '0px' : '2px' }">{{ i18n.global.t('meos_control_web.humidity') }}</span
                        >{{ i18n.global.t('meos_control_web.data_space') }}</m-checkbox
                    >
                    <m-checkbox label="relativePressureDiffToOtherSpace"
                        >{{ i18n.global.t('meos_control_web.not_delivered')
                        }}<span class="fw600" :style="{ marginInline: isCurrentCn() ? '0px' : '2px' }">{{ i18n.global.t('meos_control_web.differential_pressure') }}</span
                        >{{ i18n.global.t('meos_control_web.data_space') }}</m-checkbox
                    >
                </m-checkbox-group>
            </div>
        </template>
        <template #footer>
            <m-button type="default" @click.stop="close">{{ i18n.global.t('common.cancel') }}</m-button>
            <m-button type="primary" @click="confirm">{{ i18n.global.t('common.confirm') }}</m-button>
        </template>
    </m-modal>
</template>

<script setup>
import i18n, { isCurrentCn } from '@/localization';
import { IconMeriComponentDialogLinear } from 'meri-icon';

const props = defineProps({
    data: {
        type: Array,
        default: () => []
    }
});
const show = ref(false);
const iotDatas = ref([]);
const emits = defineEmits(['close', 'confirm']);
const close = () => {
    show.value = false;
    nextTick(() => {
        emits('close');
    });
};
const confirm = () => {
    show.value = false;
    emits('confirm', iotDatas.value);
};
onMounted(() => {
    show.value = true;
    iotDatas.value = props.data;
});
</script>
<style lang="less">
.iot-modal .m-modal-main {
    width: 385px;
    .m-checkbox {
        height: 32px;
        width: 100%;
        .m-checkbox-label {
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
}
</style>
