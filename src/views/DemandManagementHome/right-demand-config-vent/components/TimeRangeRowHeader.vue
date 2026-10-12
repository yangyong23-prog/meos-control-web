<template>
    <div class="row-title-info">
        <div class="row-left">
            <span>{{ props?.title }}</span>
            <InfoIconTips :tips="props?.tips" />
        </div>
        <div class="row-right">
            <div class="button-extra-wrap">
                <m-button v-if="props?.actionTxt" type="link" size="small" @click="actionRight">{{ props?.actionTxt }}</m-button>
            </div>
        </div>
    </div>
</template>

<script setup>
import InfoIconTips from '@/components/info-icon-tips/index.vue';

const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    tips: {
        type: String,
        default: ''
    },
    actionTxt: {
        type: String,
        default: ''
    }
});

const emits = defineEmits(['action-right']);
const actionRight = () => {
    emits('action-right');
};
</script>

<style lang="less" scoped>
.row-title-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .row-left {
        display: flex;
        align-items: center;
        column-gap: 4px;

        color: @grey-600;
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
    }
    .row-right {
        position: relative;
        height: 100%;

        .button-extra-wrap {
            position: absolute;
            right: 0px;
            top: 50%;
            transform: translateY(-50%);
        }
    }
}
</style>
