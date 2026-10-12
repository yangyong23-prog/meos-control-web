<template>
    <Header
        v-show="systemList?.length > 0"
        v-model:system-id="systemId"
        v-model:current-system="currentSystem"
        v-model:is-refresh="isRefresh"
        v-model:view-mode="viewMode"
        :system-list="systemList"
        :view-mode-tabs="viewModeTabs"
        :is-fit-wrap-layout="false"
        v-bind="$attrs"
    >
        <template #left-content="data">
            <slot
                name="left-content"
                v-bind="data"
            ></slot>
        </template>
        <template #subHeader="data">
            <slot
                name="subHeader"
                v-bind="data"
            ></slot>
        </template>
        <template #right-content="data">
            <slot
                name="right-content"
                v-bind="data"
            ></slot>
        </template>
        <template #right-tabs="data">
            <slot
                name="right-tabs"
                v-bind="data"
            ></slot>
        </template>
    </Header>
</template>
<script setup lang="ts">
import i18n from '@/localization';
import Header from '@/components/systemGraphHeader/index.vue';
import { SystemControlNode, ViewModeEnum } from './types';
import { PropType } from 'vue';
import { HeaderProps } from './types/props';
const props = withDefaults(defineProps<HeaderProps>(), {
    viewModeTabs: () => [
        {
            id: ViewModeEnum.GRAPH_CODE,
            name: i18n.global.t('meos_control_web.relationship_view'),
            slotName: 'name'
        },
        {
            id: ViewModeEnum.MAP_VIEW,
            name: i18n.global.t('meos_control_web.model_view_angle'),
            slotName: 'name'
        }
    ]
});

const systemId = defineModel('systemId', {
    type: String as PropType<string>,
    default: ''
});

const currentSystem = defineModel<SystemControlNode | null>('currentSystem', {
    type: Object as PropType<SystemControlNode | null>,
    default: null
});
const isRefresh = defineModel('isRefresh', {
    type: Boolean as PropType<boolean>,
    default: true
});
const viewMode = defineModel('viewMode', {
    type: String as PropType<ViewModeEnum>,
    default: ViewModeEnum.GRAPH_CODE
});

const maxWidth = ref(130);

let resizeObserver: ResizeObserver | null = null;
onMounted(() => {
    resizeObserver = new ResizeObserver(([{ contentRect }]) => {
        const { width } = contentRect;
        if (width < 1440) {
            maxWidth.value = 32;
        } else if (width > 1600) {
            maxWidth.value = 132;
        } else {
            maxWidth.value = 72;
        }
    });

    resizeObserver.observe(document.body);
});
onUnmounted(() => {
    resizeObserver?.disconnect?.();
});
</script>
<style lang="less" scoped>
.right-content {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 100%;
}
.map-space-name {
    display: flex;
    min-width: 56px;
    align-items: center;
    justify-content: center;
    height: 100%;
    .label {
        color: var(--Grey-Grey-0, #fff);
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px; /* 157.143% */
        opacity: 0.8;
    }
    .name {
        overflow: hidden;
        color: var(--Grey-Grey-0, #fff);
        text-overflow: ellipsis;
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: 22px; /* 157.143% */
    }
}
</style>
