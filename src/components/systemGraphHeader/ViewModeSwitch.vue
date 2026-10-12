<template>
    <div :key="renderKey" class="view-model-switch">
        <m-tabs v-model="viewModeTab" :data="renderTabs" type="border" size="small"></m-tabs>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { h } from 'vue';
import Model3DSvg from '@/assets/svg/spatial-grid-list/model-3d.svg';
import GraphSvg from '@/assets/svg/spatial-grid-list/graph.svg';
// import GridSvg from '@/assets/svg/spatial-grid-list/grid.svg';
import { MPopover } from 'meri-plus';

const props = defineProps({
    disabledId: {
        type: String,
        default: ''
    },
    disabledTips: {
        type: String,
        default: ''
    },
    tabKeys: {
        type: Array,
        default: () => ['left', 'right']
    }
});
const renderKey = computed(() => `${props.disabledId || ''}` + `${props.disabledTips || ''}`);

const wrappedTipsWithChildren = (children, content) =>
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
        id: 'left',
        disabled: false,
        renderPreSlot: {
            defaultComponent: h(GraphSvg, {
                style: {
                    margin: '8px'
                }
            }),
            component: h(GraphSvg, {
                style: {
                    margin: '8px'
                }
            }),
            iconSize: 16 // 默认为16
        }
    },
    {
        name: '',
        id: 'right',
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

const viewModeTab = defineModel({ default: 'left' });

onMounted(() => {
    if (props.tabKeys?.filter(k => !!k)?.length === 2) {
        tabs.value = tabs.value.map((item, index) => {
            item.id = props.tabKeys[index];
            return item;
        });
        viewModeTab.value = props.tabKeys[0];
    }
});

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
</script>

<style lang="less" scoped>
.view-model-switch {
    position: relative;

    :deep(.m-tabs) {
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
            z-index: var(--z-index-hover-card);
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
}
</style>
