<template>
    <div class="half-section-page">
        <div v-show="!showEmpty" class="view-wrapper">
            <HalfSectionView
                v-model:show="showHalfView"
                :target-data="displayTargetData"
                :template-data="curTemplate"
                :info-groups="infoGroups"
                :is-loading="isLoading"
                :use-scale="true"
            />
        </div>
        <div v-show="showEmpty" class="empty-wrapper">
            <Empty :text="i18n.global.t('meos_control_web.no_content')" />
        </div>
    </div>
</template>
<script setup>
import { useRoute } from 'vue-router';
import HalfSectionView from '@/components/HalfSectionView/index.vue';
import useHalfViewDataHook from '@/components/HalfSectionView/hooks/useHalfViewDataHook';
import Empty from '@/components/common/Empty.vue';
import useLoading from '@/hooks/useLoading';
import useHalfSectionSSE from './hooks/useHalfSectionSSE';
import { AIR_TERMINAL } from '@/utils/globalVariables';
import i18n from '@/localization';

const route = useRoute();

const isValidParams = computed(() => {
    return !!(route.query.id && route.query.classCode);
});

// 传给 hook 的稳定对象：不能随 curStaticInfo 变化，否则会触发静态信息重复请求
const baseTargetData = computed(() => {
    if (!isValidParams.value) return null;
    return {
        id: String(route.query.id),
        classCode: String(route.query.classCode)
    };
});

// 传给组件的展示对象：localName 优先取 URL，兜底取 hook 暴露的 getEquipStaticInfo 返回
const displayTargetData = computed(() => {
    if (!baseTargetData.value) return {};
    const urlLocalName = route.query.localName ? String(route.query.localName) : '';
    return {
        ...baseTargetData.value,
        localName: urlLocalName || curStaticInfo.value?.localName || undefined
    };
});

const { showHalfView, hasHalfSectionView, infoGroups, curTemplate, isLoading, curStaticInfo } = useHalfViewDataHook(baseTargetData, AIR_TERMINAL, ref(false), { force: true });

const showEmpty = computed(() => {
    if (!isValidParams.value) return true;
    if (isLoading.value) return false;
    return !hasHalfSectionView.value || !curTemplate.value || !infoGroups.value?.length;
});

const { openLoading, closeLoading } = useLoading('half-section-page', '#fff', 'ball', { width: '100px', height: '100px' }, 0);

watch(
    isLoading,
    val => {
        if (val) {
            openLoading();
        } else {
            closeLoading();
        }
    },
    { immediate: true }
);

// 建立 SSE 连接，按当前设备订阅
const { setHalfSectionSSEClientOption } = useHalfSectionSSE();

watch(
    baseTargetData,
    val => {
        if (val?.id) {
            setHalfSectionSSEClientOption({ [val.classCode]: [val.id] });
        }
    },
    { immediate: true }
);
</script>
<style scoped lang="less">
.half-section-page {
    width: 100%;
    height: 100%;
    position: relative;
    background: var(--Grey-Grey-100, #f1f4f6);
    .view-wrapper,
    .empty-wrapper {
        width: 100%;
        height: 100%;
    }
    .empty-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff;
        border-radius: 8px;
    }
}
</style>
