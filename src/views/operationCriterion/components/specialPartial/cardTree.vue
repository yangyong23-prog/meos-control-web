<template>
    <div class="ocg-card-tree">
        <div class="ocg-card-tree-root">
            <PartialCard :item="system"></PartialCard>
        </div>
        <div class="ocg-card-tree-branch">
            <div class="ocg-card-tree-branch-title">
                <span class="ocg-card-tree-branch-tag">{{ i18n.global.t('meos_control_web.system_pump_group') }}</span>
            </div>
            <div class="ocg-card-tree-branch-brack">
                <div class="ocg-card-tree-branch-arrows">
                    <div class="ocg-card-tree-branch-arrow">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="10" viewBox="0 0 24 10" fill="none">
                            <path d="M24 5L17 0.958548V9.04145L24 5ZM0 5.7H17.7V4.3H0V5.7Z" fill="#C4C9CF" />
                        </svg>
                    </div>
                    <div class="ocg-card-tree-branch-arrow">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="10" viewBox="0 0 24 10" fill="none">
                            <path d="M24 5L17 0.958548V9.04145L24 5ZM0 5.7H17.7V4.3H0V5.7Z" fill="#C4C9CF" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
        <div class="ocg-card-tree-leafs">
            <PartialCard v-for="(item, index) in items" :key="index" :item="item" :show-divider="false" class="ocg-crad-tree-leaf"> </PartialCard>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import PartialCard from './partialCard.vue';
const props = defineProps({
    system: {
        type: Object,
        default: () => {}
    },
    items: {
        type: Array,
        default: () => []
    }
});
</script>
<style lang="less" scoped>
.ocg-card-tree {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    gap: 12px;
    .ocg-card-tree-root {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 430px;
    }
    .ocg-card-tree-branch {
        display: flex;
        flex-direction: row;
        align-items: center;
        position: relative;
        flex-grow: 0;
        gap: 0;
        .ocg-card-tree-branch-title {
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            flex-grow: 0;
            &::before {
                width: 16px;
                height: 1.4px;
                display: block;
                content: ' ';
                background-color: var(--gray-400, #c4c9cf);
            }
            &::after {
                width: 19px;
                height: 1.4px;
                display: block;
                content: ' ';
                background-color: var(--gray-400, #c4c9cf);
            }
        }
        .ocg-card-tree-branch-brack {
            height: 100%;
            display: flex;
            flex-grow: 1;
            border-left: 1.4px solid var(--gray-400, #c4c9cf);
            .ocg-card-tree-branch-arrows {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                .ocg-card-tree-branch-arrow {
                    width: 100%;
                    height: 1px;
                    display: flex;
                    align-items: center;
                }
            }
        }
        .ocg-card-tree-branch-tag {
            display: inline-block;
            z-index: 2;
            color: var(--gray-900, #1b2129);
            font-size: 14px;
            font-style: normal;
            border-radius: 4px;
            background: #dfe3e7;
            position: relative;
            padding: 0 4px;
            font-weight: var(--platform-font-weight);
            line-height: 22px; /* 157.143% */
        }
    }
    .ocg-card-tree-leafs {
        width: 1130px;
        display: grid;
        gap: 12px;
        grid-template-columns: repeat(auto-fill, 460px);
        .ocg-crad-tree-leaf {
            width: 460px;
        }
    }
}
</style>
