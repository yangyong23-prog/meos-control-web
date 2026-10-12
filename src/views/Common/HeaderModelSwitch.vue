<template>
    <div :key="renderKey" class="header-model-switch">
        <m-tabs v-model="curTab" :data="renderTabs" type="border" size="small" @change="onTabsChange"></m-tabs>
        <div v-if="showSubTabs" class="popover-container">
            <div class="triangle-tab">
                <m-tabs v-model="curSubTab" :data="props.list" type="segment" @change="onSubTabsChange"></m-tabs>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// @ts-ignore
import i18n from '@/localization';
import { h } from 'vue';
import Model3DSvg from '@/assets/svg/spatial-grid-list/model-3d.svg';
import GridSvg from '@/assets/svg/spatial-grid-list/grid.svg';
import { MPopover } from 'meri-plus';

interface TabItem {
    name: string;
    id: string;
}
interface HeaderModelSwitchProps {
    list?: TabItem[];
    defaultTab?: string;
    disabledId?: string;
    disabledTips?: string;
}

const props = defineProps<HeaderModelSwitchProps>();
const emits = defineEmits(['GridTabChange', 'GridSubTabChange']);
const renderKey = computed(() => `${props.disabledId || ''}` + `${props.disabledTips || ''}`);

const wrappedTipsWithChildren = (children: any, content?: string) =>
    h(
        MPopover,
        {
            theme: 'darkTransparent',
            showArrow: false,
            placement: 'top'
        },
        { default: () => [children], content: () => h('div', { id: content }, content || '') }
    );

const tabs = ref([
    {
        name: '',
        id: 'list',
        disabled: false,
        renderPreSlot: {
            defaultComponent: h(GridSvg, {
                style: {
                    margin: '8px'
                }
            }),
            component: h(GridSvg, {
                style: {
                    margin: '8px'
                }
            }),
            iconSize: 16 // 默认为16
        }
    },
    {
        name: '',
        id: 'model',
        disabled: false,
        renderPreSlot: {
            defaultComponent: h(Model3DSvg, {
                style: {
                    margin: '8px'
                }
            }),
            component: h(Model3DSvg, {
                style: {
                    margin: '8px'
                }
            }),
            iconSize: 16 // 默认为16
        }
    }
]);

const renderTabs = computed(() => {
    return tabs.value.map(item => {
        if (item.id === props.disabledId) {
            item.disabled = true;
        } else {
            item.disabled = false;
        }
        const isDisabledTips = props.disabledTips && props.disabledId && item.id === props.disabledId;
        item.renderPreSlot = {
            defaultComponent: item.renderPreSlot.defaultComponent,
            component: isDisabledTips ? wrappedTipsWithChildren(item.renderPreSlot.defaultComponent, props.disabledTips) : item.renderPreSlot.defaultComponent,
            iconSize: 16
        };
        return item;
    });
});

const curTab = ref();
const showSubTabs = computed(() => {
    return curTab.value === 'list' && props?.list?.length;
});

const curSubTab = ref();

const onTabsChange = (item: TabItem) => {
    emits('GridTabChange', item?.id);
};

const onSubTabsChange = (item: TabItem) => {
    emits('GridSubTabChange', item?.id);
};

watch(
    () => props?.list,
    cur => {
        if (cur?.[0]?.id) {
            curSubTab.value = cur?.[0]?.id;
        }
    },
    { immediate: true }
);

watch(
    () => props?.defaultTab,
    cur => {
        if (cur) {
            curTab.value = cur;
        }
    },
    { immediate: true }
);
</script>

<style lang="less" scoped>
.header-model-switch {
    position: relative;

    .popover-container {
        position: absolute;
        bottom: -56px;
        right: 32px;
        transform: translateX(calc(25% - 12px));
        border-radius: 4px;
        border: 1px solid var(--Grey-Grey-Dividers, #e1e5eb);
        background: var(--Grey-Grey-0, #fff);

        :deep(.m-tabs.m-tabs-segment) {
            padding: 0px;
            .m-tabs-list {
                background-color: #fff;
                padding: 6px;
                border-radius: 4px;
                column-gap: 4px;
                .m-tabs-item {
                    padding: 0;
                    width: fit-content;
                    text-align: center;

                    &--active {
                        border-radius: 4px;
                        background: var(--blue-100);
                    }
                    .m-tabs-name {
                        min-width: none;
                    }
                }
            }
        }
    }

    .triangle-tab {
        border-radius: 4px;
        box-shadow: 0px 3px 12px 0px rgba(27, 33, 41, 0.12), 0px 0.5px 3px 0px rgba(27, 33, 41, 0.08);

        &::after {
            content: '';
            position: absolute;
            width: 0;
            height: 0;
            top: -4px;
            right: calc(25%);
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-bottom: 6px solid #fff;
            transform: translateY(-1px);
        }
    }
}
.header-model-switch > :deep(.m-tabs) {
    height: 32px;
    &.m-tabs-border {
        padding: 0;
    }
    .m-tabs-item {
        flex: 1;
        padding: 0px;
        height: 32px;
        &.m-tabs-item--disabled {
            background-color: var(--gray-300);
            border-color: #c4c9cf;
            svg {
                *[fill] {
                    fill: #c4c9cf;
                }
                *[stroke] {
                    stroke: #c4c9cf;
                }
            }
        }
        .m-tabs-pre-slot {
            margin-right: 0;
            padding: 0px;
        }
        .m-tabs-name {
            min-width: 0;
        }
    }
    .m-tabs-item--active {
        z-index: 999;
        svg {
            *[fill] {
                fill: #246fe5;
            }
            *[stroke] {
                stroke: #246fe5;
            }
        }
    }
    .m-tabs-item:not(.m-tabs-item--disabled, .m-tabs-item--active):hover {
        background-color: #e8ecf0;
    }
}
</style>
