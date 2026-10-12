<template>
    <m-drawer :append-to="$drawerAppendTo" :show="drawerStatus" shadow-click drawer-class="risk-drawer" :z-index="67" @close="closeDrawer">
        <template #title>
            <div v-ellipsis class="risk-drawer-title">{{ data?.classCodeName }} {{ i18n.global.t('meos_control_web.status_unknown_risk') }}</div>
        </template>
        <template #content>
            <div class="risk-drawer-container">
                <m-virtual-list style="height: 100%" :item-size="44" :items="virtualList" item-resizable>
                    <template #default="{ item }">
                        <div v-if="item.isTitle" class="risk-value-popver-title">{{ item.localName }}</div>
                        <m-tips v-else :content="i18n.global.t('meos_control_web.open_new_tab_risk_hazard_tree')" theme="darkTransparent">
                            <div
                                class="risk-value-popver-item"
                                :style="{ padding: !item.followMark ? '12px 8px 12px 8px' : '12px 8px 12px 2.5px' }"
                                @click="riskInfo(item, item.fatherData)"
                            >
                                <Interest v-if="item.followMark" class="interest" />
                                <div :style="{ marginLeft: isMargin && !item.followMark ? '9px' : '0', width: '100%' }">
                                    <span class="risk-value-popver-item-title">{{ item.name }}</span>
                                    <div class="risk-value-popver-item-time">{{ i18n.global.t('meos_control_web.update_time_colon') }}{{ item.updateTime }}</div>
                                </div>
                            </div>
                        </m-tips>
                    </template>
                </m-virtual-list>
            </div>

            <!-- <m-scrollbar>
                <div class="risk-drawer-container">
                    <div v-for="item in data?.equipments" :key="item.id" class="risk-drawer-content">
                        <div class="risk-value-popver-title">{{ item.localName }}</div>
                        <m-tips v-for="value in orderByList(item.danegerEventList)" :key="value.dangerEventId" :content="i18n.global.t('meos_control_web.open_new_tab_risk_hazard_tree')" theme="darkTransparent">
                            <div
                                class="risk-value-popver-item"
                                :style="{ padding: !value.followMark ? '12px 8px 12px 8px' : '12px 8px 12px 2.5px' }"
                                @click="riskInfo(value, item)"
                            >
                                <Interest v-if="value.followMark" class="interest" />
                                <div :style="{ marginLeft: isMargin && !value.followMark ? '9px' : '0', width: '100%' }">
                                    <span class="risk-value-popver-item-title">{{ value.name }}</span>
                                    <div class="risk-value-popver-item-time">{{ i18n.global.t('meos_control_web.update_time_colon') }}{{ value.updateTime }}</div>
                                </div>
                            </div>
                        </m-tips>
                    </div>
                </div>
            </m-scrollbar> -->
        </template>
    </m-drawer>
</template>
<script setup>
import i18n from '@/localization';
import Interest from '@/assets/svg/interest.svg';
import { riskJumpFun } from '@/utils/envUtils';
import { orderBy } from 'lodash';
import { drawerVisibleStateKey } from '@/hooks/useDrawerVisible';

const data = ref({});
const drawerVisibleState = inject(drawerVisibleStateKey);

const getProblemCount = dataList => {
    const { equipments } = dataList;
    if (!Array.isArray(equipments) || equipments.length === 0) {
        return 0;
    }
    // 计算存在 import 为 true 的问题的数量
    const flagCount = equipments.reduce((count, item) => {
        if (item.danegerEventList && Array.isArray(item.danegerEventList)) {
            const followMark = item.danegerEventList.some(child => child.followMark);
            return count + (followMark ? 1 : 0);
        }
        return count;
    }, 0);
    return flagCount;
};
const orderByList = list => {
    if (list?.length) {
        return orderBy(list, ['followMark'], ['desc']);
    } else {
        return [];
    }
};
const isMargin = computed(() => {
    return getProblemCount(data?.value);
});

const riskInfo = (value, item) => {
    riskJumpFun(Object.assign(value, { localName: item.localName || item.name }));
};
const drawerStatus = ref(false);
const virtualList = ref([]);
const open = item => {
    drawerStatus.value = true;
    data.value = item;
    virtualList.value = [];
    data.value.equipments.forEach(element => {
        element.isTitle = true;
        virtualList.value.push(element);
        const list = orderByList(element.danegerEventList) || [];
        list.forEach(item => {
            item.fatherData = element;
            virtualList.value.push(item);
        });
    });
    console.log(virtualList.value);
};

onMounted(() => {
    const otherDrawerItem = {
        drawerId: `other-drawer`,
        visible: computed(() => drawerStatus.value)
    };
    if (drawerVisibleState?.value) {
        drawerVisibleState.value.push(otherDrawerItem);
    }
});

const closeDrawer = () => {
    virtualList.value = [];
    drawerStatus.value = false;
};
defineExpose({
    open
});
</script>

<style lang="less" scoped>
.risk-drawer-title {
    color: var(--gray-900, #1b2129);
    font-size: 18px;
    font-weight: 700;
    line-height: 26px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;
    user-select: none;
}
.risk-drawer-container {
    overflow: auto;
    height: 100%;
    width: 100%;
    padding-top: 0;
    :deep(.v-vl) {
        padding: 0 24px;
    }
    .risk-drawer-content {
        margin-bottom: 16px;
    }
    .risk-value-popver-title {
        color: var(--gray-900, #1b2129);
        font-size: 14px;
        font-weight: 700;
        line-height: 24px;
        padding-bottom: 4px;
        padding-top: 16px;
        background-color: white;
    }
    .risk-value-popver-item {
        width: 100%;
        font-size: 14px;
        display: flex;
        color: #1b2129;
        justify-content: flex-start;
        border-bottom: 1px solid var(--gray-300, #e1e5eb);
        .interest {
            width: 13px;
            height: 13px;
            margin-right: 2.5px;
            margin-top: 3px;
        }
        &-title {
            display: inline-block;
            margin-bottom: 4px;
            word-break: break-all;
        }
        &-time {
            color: #626c78;
        }
        .line {
            width: 100%;
            height: 1px;
            background: #e1e5eb;
            margin: 12px 0;
        }
        &:hover {
            border-bottom: 1px solid #fff;
            border-radius: 4px;
            background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
            cursor: pointer;
        }
    }
    &:last-child {
        margin-bottom: 0;
    }
}
</style>

<style lang="less">
@media screen and (min-width: 1600px) {
    .risk-drawer {
        .m-drawer-container {
            width: 480px !important;
        }
    }
}
@media screen and (max-width: 1600px) {
    .risk-drawer {
        .m-drawer-container {
            width: 400px !important;
        }
    }
}

.risk-drawer {
    .m-drawer-container {
        height: calc(100% - 48px) !important;
    }
    .m-drawer-container-content {
        width: 100%;
        height: 100%;
        // padding-right: 24px;
        padding: 0 !important;
    }
}
</style>
