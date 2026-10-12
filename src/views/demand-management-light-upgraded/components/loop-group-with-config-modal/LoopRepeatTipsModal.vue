<template>
    <m-modal
        v-model:visible="show"
        :append-to="$modalAppendTo"
        :escable="false"
        type="default"
        :title="`${i18n.global.t('meos_control_web.loop_inventory')}`"
        :width="600"
        :content-class-name="'loopRepeatTipsModalCustom'"
        :need-scrollbar="false"
        @close="close"
        @submit="saveData"
    >
        <template #content="{ maxHeight }">
            <div class="tips-header-wrap">
                <div class="tips-header">{{ i18n.global.t('meos_control_web.loop_in_multiple_groups_open_first_logic') }}</div>
            </div>
            <m-scrollbar :max-height="`${parseFloat(maxHeight) - 110}px`">
                <div class="tips-content">
                    <template v-for="(item, index) in props.repeatTips" :key="index">
                        <div class="tips-row">
                            <span class="loop-name">{{ item.loopName }}</span>
                            <span>{{ `（${item.groupNames?.join('、')}）` }}</span>
                        </div>
                    </template>
                </div>
            </m-scrollbar>
        </template>
    </m-modal>
</template>

<script setup>
import i18n from '@/localization';
const props = defineProps({
    repeatTips: {
        type: Array,
        default: () => []
    }
});
const emits = defineEmits(['close', 'submit']);
const show = defineModel({ type: Boolean, default: false });

const close = () => {
    show.value = false;
    nextTick(() => {
        emits('close');
    });
};
const saveData = () => {
    nextTick(() => {
        emits('submit');
    });
};
</script>

<style lang="less" scoped>
.tips-header-wrap {
    width: 100%;
    padding-right: 24px;
}
.tips-header {
    width: 100%;
    padding: 8px;
    border-radius: 4px;
    background: var(--gray-100, #f1f4f6);

    color: var(--gray-600, #626c78);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
    margin-bottom: 12px;
}
.tips-content {
    display: flex;
    flex-direction: column;
    row-gap: 10px;
    padding-right: 24px;
}
.tips-row {
    color: var(--gray-600, #626c78);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;

    .loop-name {
        color: var(--gray-900, #1b2129);
    }
}
</style>
<style lang="less">
.m-modal-bg .m-modal-main {
    .m-modal-main-content.loopRepeatTipsModalCustom {
        padding-block: 20px;
        padding-right: 0px;
    }
}
</style>
