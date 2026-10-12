<template>
    <div class="time-line-show-config-container">
        <TitlePrefix :font-size="14" :show-right="true">
            <template #title>
                <div v-ellipsis :class="['title-wrapper', 'm-ellipsis']">
                    <div v-ellipsis :class="['title-text', 'm-ellipsis']">{{ computedConfigTitle }}</div>
                    <div class="extra">{{ i18n.global.t('meos_control_web.configuration') }}</div>
                </div>
            </template>
            <template #right>
                <m-tips :disabled="!props?.disabled" :content="i18n.global.t('meos_control_web.please_unshield_before_operation')" theme="darkTransparent" trigger="hover">
                    <m-button type="link" :disabled="props?.disabled" @click="editConfig">{{ i18n.global.t('common.edit') }}</m-button>
                </m-tips>
                <div v-if="!props?.isGlobal" class="config-divider"></div>
                <m-tips :disabled="!props?.disabled" :content="i18n.global.t('meos_control_web.please_unshield_before_operation')" theme="darkTransparent" trigger="hover">
                    <m-button v-if="!(props?.isGlobal && props?.isEmpty)" type="link" :disabled="props?.disabled" @click="removeConfig">{{
                        i18n.global.t('common.delete')
                    }}</m-button>
                </m-tips>
            </template>
        </TitlePrefix>
        <div class="time-show-container">
            <div v-if="loading" class="loading-container"></div>
            <div v-else-if="empty" class="empty-container">{{ i18n.global.t('meos_control_web.not_yet_configured') }}</div>
            <div v-else class="content-container">
                <LegendTimeLineItem :list-data="configData" :default-legend-item="defaultConfigItem" />
            </div>
        </div>
        <svg v-if="props?.showDivider" class="bottom-divider" xmlns="http://www.w3.org/2000/svg" width="368" height="2" viewBox="0 0 368 2" fill="none">
            <path d="M0 1H368" stroke="#C4C9CF" stroke-dasharray="4 4" />
        </svg>
        <div v-else-if="props?.showBottomGap" class="bottom-gap"></div>
    </div>
</template>

<script setup>
import TitlePrefix from '@/components/title-prefix/index.vue';
import LegendTimeLineItem from './LegendTimeLineItem.vue';
import { templateTypeToConfigLegendMap } from '../../constant/config';
import i18n from '@/localization';

const props = defineProps({
    itemConfig: {
        type: Object,
        default: () => {}
    },
    configTitle: {
        type: String,
        default: ''
    },
    isGlobal: {
        type: Boolean,
        default: false
    },
    itemData: {
        type: Array,
        default: () => []
    },
    showDivider: {
        type: Boolean,
        default: false
    },
    showBottomGap: {
        type: Boolean,
        default: true
    },
    loading: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    },
    hasReference: {
        type: Boolean,
        default: false
    },
    isEmpty: {
        type: Boolean,
        default: false
    }
});

const emits = defineEmits(['removeConfig', 'editConfig']);
const templateType = inject('templateType');

const loading = computed(() => props?.loading);
const configData = ref([]);

const defaultConfigItem = ref({});

const empty = computed(() => {
    if (props?.isEmpty) {
        return true;
    }
    return false;
});

const computedConfigTitle = computed(() => {
    return props?.isGlobal ? i18n.global.t('meos_control_web.global') : props?.configTitle ? props?.configTitle : '--';
});

watch(
    [() => props?.itemData, () => templateType.value],
    ([curItem, curTemplate]) => {
        if (curItem?.length && curTemplate) {
            let hasAcrossDay = false;
            const currentLegends = templateTypeToConfigLegendMap[curTemplate];
            const res = curItem?.map(v => {
                const legendItem = currentLegends?.find(legendObj => legendObj?.type === v?.type) || {};
                if (!legendItem?.isDefault && v?.acrossDay) {
                    hasAcrossDay = true;
                }
                return { ...v, ...legendItem };
            });
            const finalRes = res?.filter(v => {
                if (hasAcrossDay) {
                    return !v?.isDefault;
                } else {
                    return true;
                }
            });

            const defaultLegend = currentLegends?.find(legendObj => legendObj?.isDefault) || {};
            defaultConfigItem.value = defaultLegend;
            configData.value = finalRes;
        }
    },
    {
        immediate: true
    }
);

const editConfig = () => {
    emits('editConfig', props?.itemConfig);
};
const removeConfig = () => {
    emits('removeConfig', props?.itemConfig);
};
</script>

<style lang="less" scoped>
.time-line-show-config-container {
    display: flex;
    flex-direction: column;

    .config-divider {
        width: 1px;
        height: 17px;
        background: #d9d9d9;
        margin-inline: 4px;
    }

    .time-show-container {
        display: flex;
        flex-direction: column;
        padding-top: 12px;
        .empty-container {
            display: flex;
            height: 68px;
            padding: 5px 12px;
            justify-content: center;
            align-items: center;

            border-radius: 4px;
            background: @grey-100;

            color: @grey-500;
            font-size: 14px;
            font-style: normal;
            font-weight: var(--platform-font-weight);
            line-height: 22px;
        }
    }

    .bottom-divider {
        width: 100%;
        margin-block: 20px;
    }

    .bottom-gap {
        margin-bottom: 24px;
    }
}

.loading-container {
    width: 100%;
    height: 68px;
    background-color: transparent;
    position: relative;
}

.content-container {
    display: flex;
    flex-direction: column;
}

.title-wrapper {
    display: flex;
    min-width: 0;
}

.title-text {
    max-width: 220px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
.extra {
    flex-shrink: 0;
}
</style>
