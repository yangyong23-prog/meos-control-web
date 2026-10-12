<template>
    <div class="risk-table">
        <ul>
            <li v-for="(item, index) in riskList" :key="index">
                <div v-ellipsis="{ title: item.classCodeName }" class="m-ellipsis" style="padding-right: 8px">
                    <span class="name">{{ item.classCodeName }} </span>
                    <m-tips :content="i18n.global.t('meos_control_web.risk_event_needs_attention')" theme="darkTransparent">
                        <Interest v-if="item.followMark" class="interest" />
                    </m-tips>
                </div>
                <span class="value">
                    <div @click="openDrawer(item)">{{ item.danegerEventListLength }}</div>
                </span>
            </li>
        </ul>
        <Drawer ref="drawerRef" :data="item" />
    </div>
</template>

<script setup>
import i18n from '@/localization';
import Interest from '@/assets/svg/interest.svg';
import Drawer from './drawer.vue';
defineProps({
    riskList: {
        type: Array,
        default: () => []
    }
});
const drawerRef = ref(null);
const openDrawer = item => {
    if (drawerRef?.value) {
        drawerRef?.value.open(item);
    }
};
</script>

<style lang="less" scoped>
.risk-table {
    padding-left: 1px;
    ul {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        li {
            user-select: none;
            padding: 13px 12px 13px 16px;
            border: 1px solid var(--gray-300, #e1e5eb);
            margin: 0px 0px -1px -1px;
            font-size: 14px;
            font-style: normal;
            font-weight: var(--platform-font-weight);
            line-height: 22px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .name {
                color: var(--gray-900, #1b2129);
            }
            .interest {
                margin-left: 4px;
            }
            .value {
                color: var(--blue-500, #246fe5);
                font-family: Persagy2.0;
                font-weight: 600;
                cursor: pointer;
            }
        }
    }
}
</style>
