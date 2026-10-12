<template>
    <ControlSetItem
        :info-code="item.infoCode"
        :type="'is-not-manual-auto-set'"
        :data="item"
        :cur-info-code="curInfoCode"
        :data-source-item-code="curDataSourceItemCode"
        :system-id="systemId"
        :show-set-buttons="showSetButtonsFn(item)"
        v-bind="singleControlDisabledFun(item)"
        @open-form="(...args) => emit('open-form', ...args)"
    >
        <template #name-right>
            <div v-if="item.infoCode === 'enableCtrl' && forcedModel" class="fc">
                <m-tips
                    v-if="showEnableControlTip"
                    :content="ENABLE_CONTROL_TIP[selectObj.classCode] || i18n.global.t('meos_control_web.enable_interlock_related_equipment')"
                    theme="darkTransparent"
                >
                    <div class="fcc info-box" style="width: 16px; height: 16px">
                        <Info style="box-sizing: content-box" />
                    </div>
                </m-tips>
                <SetDiv v-if="item.relInfoCodeConfigs?.length && showSetButtonsFn(item)">
                    <template #default="{ hasPermission, isEdge }">
                        <div class="forced-switch fcc" style="color: var(--gray-600)">
                            <span>{{ i18n.global.t('meos_control_web.single_point_control') }}</span>
                            <m-switch
                                v-model="mForcedModel"
                                :disabled="!isEdge || !hasPermission"
                                :loading="loading"
                                size="small"
                                :before-change="() => beforeChangeFn(item)"
                            ></m-switch>
                        </div>
                    </template>
                </SetDiv>
            </div>
        </template>
    </ControlSetItem>
    <m-collapse
        v-if="item.infoCode === 'enableCtrl' && item.relInfoCodeConfigs?.length && showSetButtonsFn(item)"
        v-model="modelForced"
        :class="['no-collapse-header', mForcedModel]"
    >
        <m-collapse-item id="checked" title="name" class="subItemEnableCtrl">
            <ControlSetItem
                v-for="subItem in item.relInfoCodeConfigs"
                :key="subItem.infoCode"
                :show-set-buttons="showSetButtonsFn(item)"
                :info-code="subItem.infoCode"
                :type="'is-not-manual-auto-set'"
                :data="subItem"
                :cur-info-code="curInfoCode"
                :data-source-item-code="curDataSourceItemCode"
                :system-id="systemId"
                v-bind="disabledFun(subItem)"
                class="enableCtrl"
                @open-form="(...args) => emit('open-form', ...args)"
            >
                <template #left>
                    <Rectangle style="margin-right: 6px; margin-top: 5px"></Rectangle>
                </template>
            </ControlSetItem>
        </m-collapse-item>
    </m-collapse>
</template>

<script setup>
import i18n from '@/localization';
import ControlSetItem from './ControlSetItem.vue';
import { ENABLE_CONTROL_TIP } from '@/utils/globalVariables';
import Rectangle from '@/assets/svg/ACAC/Rectangle.svg';
import Info from '@/assets/svg/info.svg';
import SetDiv from '@/components/common/SetDiv.vue';

const props = defineProps({
    item: {
        type: Object,
        default: () => ({})
    },
    curInfoCode: {
        type: Object,
        default: () => ({})
    },
    curDataSourceItemCode: {
        type: String,
        default: ''
    },
    systemId: {
        type: String,
        default: ''
    },
    forcedModel: {
        type: String,
        default: ''
    },
    showEnableControlTip: {
        type: Boolean,
        default: true
    },
    selectObj: {
        type: Object,
        default: () => ({})
    },
    loading: {
        type: Boolean,
        default: false
    },
    showSetButtonsFn: {
        type: Function,
        required: true
    },
    singleControlDisabledFun: {
        type: Function,
        required: true
    },
    disabledFun: {
        type: Function,
        required: true
    },
    beforeChangeFn: {
        type: Function,
        required: true
    }
});

const emit = defineEmits(['open-form']);

const mForcedModel = defineModel('mForcedModel', { type: String, default: 'uncheck' });

const modelForced = computed(() => [mForcedModel.value]);
</script>

<style lang="less" scoped>
.info-box {
    margin: 0 4px;
    border-radius: 2px;
    &:hover {
        background-color: var(--gray-200);
    }
}
.forced-switch {
    padding-left: 4px;
    height: 22px;
    font-size: 12px;
    border-radius: 4px;
    padding: 2px 4px;
    padding-right: 0;
    background-color: var(--gray-200);
    display: flex;
    gap: 2px;
    padding-right: 4px;
}
.no-collapse-header {
    margin-bottom: 0;
    transition: all 0.5s;
    :deep(.m-collapse-item) {
        &.subItemEnableCtrl {
            background-color: #e1e5eb99;
            .control-set-item::after {
                border-bottom-color: var(--gray-300);
            }
        }
        .m-collapse-item__header {
            display: none;
        }
        .m-collapse-item__content {
            padding-top: 0;
        }
    }
}
</style>
