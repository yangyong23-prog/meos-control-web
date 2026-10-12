<template>
    <div>
        <m-tips v-if="pipes.length === 0" :content="i18n.global.t('meos_control_web.no_pipeline')" theme="darkTransparent" placement="left" trigger="hover">
            <div class="fc fcol pipe-switch-warp disabled">
                <div class="text">{{ i18n.global.t('meos_control_web.pipeline') }}</div>
            </div>
        </m-tips>
        <m-popover v-else placement="left-end" popover-class="pipe-switch-popover-select" width="280px" :show-arrow="false" trigger="click">
            <div class="fc fcol pipe-switch-warp">
                <div v-if="allChecked !== 'uncheck'" class="dot-blue"></div>
                <div class="text" :class="openPop && 'open'">{{ i18n.global.t('meos_control_web.pipeline') }}</div>
            </div>
            <template #content>
                <m-scrollbar :max-height="460">
                    <div>
                        <m-checkbox v-model="allChecked" class="pipe-switch-warp-checkall" @change="toggleAll">{{ i18n.global.t('meos_control_web.select_all1') }}</m-checkbox>
                        <m-tree ref="treeRef" v-model="currentModel" class="pipe-switch-warp-tree" multiple :data="pipes" @change="treeChange">
                            <template #rowSuffix="node">
                                <div class="suffix-bar" :style="{ backgroundColor: node.color }"></div>
                            </template>
                        </m-tree>
                    </div>
                </m-scrollbar>
            </template>
        </m-popover>
    </div>
</template>
<script setup>
import i18n from '@/localization';
const props = defineProps({
    pipes: {
        type: Array,
        default: () => []
    }
});
const openPop = ref(false);
const togglePop = () => {
    openPop.value = !openPop.value;
};
const currentModel = ref([]);
const emit = defineEmits(['change']);
const treeRef = ref();
const allChecked = ref('checked');
const toggleAll = all => {
    if (all === 'checked') {
        treeRef.value?.checkAll(true);
    } else {
        treeRef.value?.checkAll(false);
    }
};

watch(
    () => props.pipes,
    () => {
        currentModel.value = props.pipes.map(p => p.id);
    },
    { immediate: true }
);

const treeChange = (selectedList, selected) => {
    if (selectedList.length === 0) {
        allChecked.value = 'uncheck';
    } else if (selectedList.length === props.pipes.length) {
        allChecked.value = 'checked';
    } else {
        allChecked.value = 'notNull';
    }
    emit('change', selectedList);
};
</script>
<style lang="less" scoped>
.pipe-switch-warp {
    width: 32px;
    position: absolute;
    right: 16px;
    bottom: 56px;
    padding: 5px 0 5px 0;
    border-radius: 4px;
    cursor: pointer;
    background: #fff;
    /* Shadow/shadow-1 */
    box-shadow: 0px 2px 10px 0px rgba(27, 33, 41, 0.1);
    .dot-blue {
        width: 10px;
        height: 10px;
        border-radius: 10px;
        background: #246fe5;
        position: absolute;
        right: -3px;
        top: -3px;
        border: 1px solid #fff;
    }
    .text {
        color: var(--Gray-900);
        font-size: 12px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        text-align: center;
        line-height: 22px;
        &:hover,
        &.open {
            color: #246fe5;
        }
    }

    &.disabled {
        cursor: not-allowed;
        background: var(--gray-300, #e1e5eb);
        box-shadow: 0px 2px 10px 0px rgba(27, 33, 41, 0.1);
        .text {
            color: var(--gray-400, #c4c9cf);
        }
    }
}
</style>
<style lang="less">
.pipe-switch-popover-select.m-popover.m-flexible-overlay {
    padding: 4px 0;
    .m-scrollbar__content {
        padding: 0px 8px;
    }
    .pipe-switch-warp-checkall {
        padding-left: 12px;
        height: 40px;
        width: 100%;
        border-radius: 4px;
        cursor: pointer;
        &:hover,
        &:active {
            background-color: var(--alpha-30);
        }
    }

    .suffix-bar {
        width: 20px;
        height: 6px;
        border-radius: 1px;
        background-color: #09b3b5;
    }
    .pipe-switch-warp-tree {
        padding: 0;
    }
}
</style>
