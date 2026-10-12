<template>
    <div class="config-card-wrapper">
        <div :class="{ card: true, subCard: props?.theme === 'subCard', done: props?.done }" :style="{ padding: props?.card?.arr?.length ? '0px 8px 8px 8px' : '0px' }">
            <div class="title">
                <div v-ellipsis class="m-ellipsis text">{{ props?.card?.isGlobal ? i18n.global.t('meos_control_web.global_configuration') : props?.card?.title || '--' }}</div>
                <div class="statics">
                    <span class="label">{{ i18n.global.t('meos_control_web.loop_on_colon') }}</span>
                    <span class="amount">{{ props?.card?.summary?.openCount ?? '--' }}</span>
                    <span class="separator">/</span>
                    <span class="amount">{{ props?.card?.summary?.total ?? '--' }}</span>
                </div>
            </div>
            <div v-if="props?.card?.arr?.length" class="list">
                <div v-for="(item, index) in props?.card?.arr || []" :key="index" class="list-item">
                    <div class="list-item-left">
                        <div v-ellipsis class="m-ellipsis text">{{ item?.funcTypeName || '--' }}</div>
                        <div class="statics">
                            <div class="statics-item">
                                <div class="label">{{ i18n.global.t('meos_control_web.loop_on') }}</div>
                                <div class="label-value">
                                    <span class="amount highLight">{{ item?.summary?.openCount ?? '--' }}</span>
                                    <span class="separator">/</span>
                                    <span class="amount">{{ item?.summary?.total ?? '--' }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="list-item-right">
                        <m-tag :color="getStatusColor(item?.settingMode)" :bg-color="getStatusBg(item?.settingMode)" size="small">
                            {{ getStatusName(item?.settingMode) }}
                        </m-tag>
                    </div>
                </div>
            </div>
        </div>
        <!-- <div v-if="props?.data?.spaceFeedbackAdjust" class="mt12">
            <FeedbackRegulation :obj="props?.data?.spaceFeedbackAdjust" :show-btn="false" />
        </div> -->
    </div>
</template>

<script lang="ts" setup>
// @ts-ignore
import i18n from '@/localization';
import { ListItem } from './types';

interface ConfigCardProps {
    card: ListItem;
    theme?: 'subCard' | 'card';
    done?: boolean;
    data: Object | any;
}

const props = defineProps<ConfigCardProps>();

const statusMap: Record<string, Record<string, string>> = {
    ALL_OPEN: {
        name: i18n.global.t('meos_control_web.all_on'),
        color: '#E68600',
        background: '#FFF0CC'
    },
    PARTIAL_OPEN: {
        name: i18n.global.t('meos_control_web.partial_on'),
        color: '#1B4ACC',
        background: '#D9EBFF'
    },
    ALL_CLOSE: {
        name: i18n.global.t('meos_control_web.all_off'),
        color: '#1B2129',
        background: 'rgba(196, 201, 207, 0.30)'
    },
    NOT_CONFIGURED: {
        name: i18n.global.t('meos_control_web.unconfiged'),
        color: '#8B949E',
        background: 'transparent'
    }
};

// 抽离全局配置空间数据整合
// const setSpaceFuncTypes = (list: any[]) => {
//     if (Array.isArray(list) && list?.length) {
//         const tempList = list.map((space: any) => {
//             const { funcTypeName, lampFuncTypeSettings, funcTypeSettings } = space || {};
//             const curTime = new Date().getTime();
//             const curSpace = { ...space, name: funcTypeName, open: true, id: curTime };

//             if (Array.isArray(lampFuncTypeSettings) && lampFuncTypeSettings.length > 0) {
//                 if (space.settingMode === 'ALL_OPEN' || space.settingMode === 'ALL_CLOSE') {
//                     return curSpace;
//                 }
//             }
//             if (Array.isArray(funcTypeSettings) && funcTypeSettings.length > 0) {
//                 if (space.settingMode === 'ALL_OPEN' || space.settingMode === 'ALL_CLOSE') {
//                     return curSpace;
//                 } else {
//                     const newChildren = funcTypeSettings?.map((item: any) => ({
//                         ...item,
//                         id: new Date().getTime(),
//                         name: item.funcTypeName,
//                         open: true
//                     }));
//                     const other = { children: newChildren, open: true };
//                     return { ...curSpace, ...other };
//                 }
//             }
//         });
//         return tempList;
//     }
// };

const getStatusColor = (status?: string) => {
    return statusMap[status ?? '']?.color ?? '#8B949E';
};

const getStatusBg = (status?: string) => {
    return statusMap[status ?? '']?.background ?? 'transparent';
};

const getStatusName = (status?: string) => {
    return statusMap[status ?? '']?.name ?? '--';
};
</script>

<style lang="less" scoped>
.config-card-wrapper {
    width: 100%;
}
.card {
    display: flex;
    // min-height: 46px;
    padding: 0px 8px 8px 8px;
    flex-direction: column;

    border-radius: 8px;
    background: var(--gray-100, #f1f4f6);
}

.title {
    display: flex;
    padding: 9px 8px 9px 12px;
    align-items: center;
    column-gap: 12px;
    overflow: hidden;

    .text {
        color: var(--gray-900, #1b2129);
        font-weight: 700;
        line-height: 22px;
    }

    .statics {
        flex-shrink: 0;
        color: var(--gray-600, #626c78);
        font-size: 12px;
        line-height: 20px;
    }

    .amount,
    .separator {
        color: var(--gray-900, #1b2129);
    }
}

.list {
    display: flex;
    padding: 4px;
    flex-direction: column;

    border-radius: 4px;
    background: var(--Grey-Grey-0, #fff);

    .list-item {
        display: flex;
        padding: 9px 8px;
        align-items: center;
        justify-content: space-between;
        column-gap: 8px;
    }

    .list-item-left {
        display: flex;
        align-items: center;
        column-gap: 12px;
        overflow: hidden;

        .title {
            color: var(--gray-900, #1b2129);
            line-height: 22px;
        }

        .statics {
            display: flex;
            align-items: center;
            column-gap: 8px;

            color: var(--gray-600, #626c78);
            font-size: 12px;
            font-weight: var(--platform-font-weight);
            line-height: 20px;
        }

        .statics-item {
            display: flex;
            align-items: center;
        }

        .gap {
            width: 1px;
            height: 12px;
            background: var(--gray-400, #c4c9cf);
            margin-right: 8px;
        }

        .label {
            display: flex;
            margin-right: 4px;
        }
        .label-value {
            display: flex;
        }

        .highLight {
            color: var(--gray-900, #1b2129);
        }
    }
}

.subCard {
    display: flex;
    min-height: 46px;
    padding: 0px;
    flex-direction: column;
    border-radius: 4px;
    background: #f1eeda;

    .list {
        border-top: 1px solid #ece8cd;
        border-radius: 4px;
        background: #f1eeda;
    }
}

.done {
    background: #e8ecf0;

    .list {
        border-top: 1px solid #e1e5eb;
        background: #e8ecf0;
    }
}
</style>
