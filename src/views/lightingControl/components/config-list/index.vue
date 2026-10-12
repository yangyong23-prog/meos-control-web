<template>
    <div class="config-list-wrapper">
        <div class="config-list-content-items">
            <template v-for="(item, index) in listData" :key="index">
                <ConfigCard :card="item" :theme="theme" :done="isDone" :data="props?.data" />
                <div v-if="item.isGlobal && (listData?.length ?? 0) > 1 && themeStyle !== 'subCard'" class="separator"></div>
            </template>
            <FeedbackCard v-if="isSpaceDetail && FeedbackCardData?.length && FeedbackCardData[0]?.lightingCircuitsNum > 0" :item="FeedbackCardData[0]" />
        </div>
        <div v-if="themeStyle !== 'subCard' && !listData.length && !props?.isLoading" class="empty">
            <SvgIcon name="empty" />
            <div class="text">{{ i18n.global.t('meos_control_web.no_demand2') }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
// @ts-ignore
import i18n from '@/localization';
import ConfigCard from './ConfigCard.vue';
import { ConfigDataItem, ListItem } from './types';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { MLoading } from 'meri-plus';
import FeedbackCard from './feedbackCard.vue';
const FeedbackCardData = ref([]);
interface ConfigListProps {
    data?: ConfigDataItem;
    isSpaceDetail?: boolean;
    theme?: 'subCard' | 'card';
    done?: boolean;
    isLoading?: boolean;
}
const props = defineProps<ConfigListProps>();

// TODO 接口联调：数据录入
const listData = ref<ListItem[]>([]);
const isDone = ref();
const themeStyle = ref('card');
const loadingRef = ref();

watch(
    () => props?.isLoading,
    cur => {
        if (cur) {
            loadingRef.value = MLoading.service({
                target: '.config-list-wrapper',
                fullscreen: false,
                duration: 2000,
                lottieName: 'ball',
                loadIconStyle: {
                    width: '100px',
                    height: '100px'
                }
            });
        } else {
            loadingRef.value?.destroy?.();
        }
    }
);

watch(
    [() => props?.theme, () => props?.done, () => props?.data],
    ([theme, done, data]) => {
        const { global, space, spaceFeedbackAdjust } = data || {};
        let temArr: ListItem[] = [];
        if (global?.configId || (Array.isArray(global?.funcTypeSettings) && global?.funcTypeSettings?.length)) {
            const { summary, funcTypeSettings } = global || {};
            temArr.push({ title: i18n.global.t('meos_control_web.global_configuration'), summary, arr: funcTypeSettings ?? [], isGlobal: true });
        }
        if (Array.isArray(space?.settings) && space?.settings?.length) {
            space?.settings.forEach(item => {
                const { summary, funcTypeSettings, spaceFuncTypes } = item || {};
                const title = spaceFuncTypes?.reduce((acc, cur) => `${acc}${acc ? '、' : ''}${cur?.value || '--'}`, '');
                temArr.push({ title, summary, arr: funcTypeSettings ?? [], isGlobal: false });
            });
        }
        if (spaceFeedbackAdjust?.lightingCircuits?.length && spaceFeedbackAdjust?.spaceFeedbackAdjustSetting) {
            const { overtopDuration, overtopOutdoorIlluminance, underDuration, underOutdoorIlluminance } = spaceFeedbackAdjust?.spaceFeedbackAdjustSetting || {};
            FeedbackCardData.value.push({
                lightingCircuitsNum: spaceFeedbackAdjust?.lightingCircuits.length,
                overtopDuration: overtopDuration || '--',
                overtopOutdoorIlluminance: overtopOutdoorIlluminance || '--',
                underDuration: underDuration || '--',
                underOutdoorIlluminance: underOutdoorIlluminance || '--'
            });
        }
        isDone.value = done ?? false;
        themeStyle.value = theme ?? 'card';
        listData.value = temArr;
    },
    { immediate: true }
);

onUnmounted(() => {
    loadingRef.value?.destroy?.();
});
</script>

<style lang="less" scoped>
.config-list-wrapper {
    position: relative;
    height: 100%;
}
.config-list-content-items {
    display: flex;
    flex-direction: column;
    row-gap: 12px;
}
.separator {
    width: 100%;
    height: 1px;
    background-color: rgba(196, 201, 207, 0.3);
}
.empty {
    width: 100%;
    flex: 1 0 0;
    min-height: 280px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .text {
        color: var(--gray-600, #626c78);
        text-align: center;

        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        margin-top: 8px;
    }
}
</style>
