<!--
 * @Author: guoxiaohuan
 * @Date: 2024-04-28 20:01:08
 * @LastEditors: guoxiaohuan
 * @LastEditTime: 2024-05-16 16:46:00
 * @Description: 
-->
<template>
    <div class="demand-change-container">
        <div class="title">
            <span class="title-bold">{{ i18n.global.t('meos_control_web.demand_change') }}</span>
            {{
                i18n.global.t('meos_control_web.today_operating_mode_type', {
                    name: relTemplateName || '--'
                })
            }}
        </div>
        <div class="change-card">
            <div
                class="change-card-item"
                :class="[
                    demandChangeList.length === 1 && 'change-card-item-long',
                    demandChangeList.length === 2 && demandChangeList[0]?.isCurrentScene && 'change-card-item-current',
                    demandChangeList.length === 2 && !demandChangeList[0]?.isCurrentScene && demandChangeList[0]?.sceneName && 'change-card-item-next',
                    demandChangeList.length === 2 && !demandChangeList[0]?.isCurrentScene && !demandChangeList[0]?.sceneName && 'change-card-item-pre'
                ]"
                :style="{ width: demandChangeList.length === 1 ? '100%' : '' }"
            >
                <div class="status">
                    {{ demandChangeList[0]?.isCurrentScene ? i18n.global.t('meos_control_web.current_demand') : i18n.global.t('meos_control_web.previous_demand') }}
                </div>
                <div class="name" :title="demandChangeList[0]?.sceneName ? demandChangeList[0]?.sceneName : ''">
                    {{ demandChangeList[0]?.sceneName || i18n.global.t('meos_control_web.no_demand1') }}
                </div>
                <div class="time">
                    {{ i18n.global.t('meos_control_web.time') }}:{{
                        `${convertRangesToToday([demandChangeList[0]?.beginDateTime, demandChangeList[0]?.endDateTime])?.join(' - ')}`
                    }}
                </div>
            </div>
            <img v-if="demandChangeList.length > 1" src="@/assets/imgs/demand/union.png" />
            <div
                v-if="demandChangeList.length > 1"
                class="change-card-item"
                :class="[
                    !demandChangeList[1]?.isCurrentScene && 'change-card-item-next',
                    !demandChangeList[1]?.sceneName && !demandChangeList[1]?.isCurrentScene && 'change-card-item-pre',
                    demandChangeList[1]?.isCurrentScene && 'change-card-item-current'
                ]"
                :style="{ width: demandChangeList.length === 1 ? '100%' : '' }"
            >
                <div class="status">
                    {{ demandChangeList[1]?.isCurrentScene ? i18n.global.t('meos_control_web.current_demand') : i18n.global.t('meos_control_web.next_demand') }}
                </div>
                <div class="name" :title="demandChangeList[1]?.sceneName ? demandChangeList[1]?.sceneName : ''">
                    {{ demandChangeList[1]?.sceneName || i18n.global.t('meos_control_web.no_demand1') }}
                </div>
                <div class="time">
                    {{ i18n.global.t('meos_control_web.time') }}:{{
                        `${convertRangesToToday([demandChangeList[1]?.beginDateTime, demandChangeList[1]?.endDateTime])?.join(' - ')}`
                    }}
                </div>
            </div>
        </div>
        <div v-if="demandChangeList.length > 1" class="bubble">
            {{
                i18n.global.t('meos_control_web.change_scene_loop', {
                    count: (demandChangeList[0].isCurrentScene ? demandChangeList[0].openLoopNumber : demandChangeList[1].openLoopNumber) || 0,
                    num: (demandChangeList[0].isCurrentScene ? demandChangeList[0].offLoopNumber : demandChangeList[1].offLoopNumber) || 0
                })
            }}
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { convertRangesToToday } from '@/utils/index';
const relTemplateName = inject('relTemplateName');
const demandChangeList = inject('demandChangeList');
watch(
    () => demandChangeList?.value,
    val => {
        demandChangeList.value = val;
    },
    {
        deep: true
    }
);
watch(
    () => relTemplateName?.value,
    val => {
        relTemplateName.value = val;
    },
    {
        deep: true
    }
);
</script>
<style lang="less" scoped>
.demand-change-container {
    margin-bottom: 24px;
    .title {
        height: 30px;
        color: #626c78;
        margin-bottom: 12px;
        padding-block: 4px;
        font-size: 12px;
        line-height: 22px;
    }

    .title-bold {
        color: @grey-800;
        text-align: center;
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 22px;
        margin-right: 8px;
    }

    .change-card {
        display: flex;
        align-items: center;
        margin-bottom: 14px;
        justify-content: space-between;
        &-item {
            width: calc(100% / 2 - 9px);
            padding: 12px 8px;
            border-radius: 4px;

            .status {
                font-size: 12px;
                opacity: 0.6;
                font-weight: 700;
            }
            .name {
                font-size: 14px;
                font-weight: 700;
                margin: 4px 0;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .time {
                font-size: 12px;
            }
        }

        .change-card-item-long {
            background: url(../../../../assets/imgs/demand/blue_long_bg.png) no-repeat;
            box-shadow: 0px 3px 5px 0px rgba(36, 111, 229, 0.15);
            background-size: cover;
            color: #fff;
        }
        .change-card-item-current {
            background: url(../../../../assets/imgs/demand/blue_bg.png) no-repeat;
            box-shadow: 0px 3px 5px 0px rgba(36, 111, 229, 0.15);
            background-size: cover;
            color: #fff;
        }
        .change-card-item-next {
            background: url(../../../../assets/imgs/demand/gray_bg.png) no-repeat;
            background-size: cover;
            color: #2e3742;
        }
        .change-card-item-pre {
            background: url(../../../../assets/imgs/demand/gray_bg.png) no-repeat;
            background-size: cover;
            color: #2e3742;
        }
        .change-card-item-grey {
            background: #f1f4f6;
            color: #2e3742;
        }
        img {
            width: 18px;
            height: 16px;
            margin: 0 4px;
        }
    }
    .bubble {
        position: relative;
        width: 100%;
        padding: 4px 8px;
        background: #f1f4f6;
        color: #626c78;
        font-size: 14px;
        font-weight: var(--platform-font-weight);
        &::after {
            content: '';
            position: absolute;
            width: 0;
            height: 0;
            top: -7px;
            right: 60px;
            border-left: 7px solid transparent;
            border-right: 7px solid transparent;
            border-bottom: 7px solid #f1f4f6;
        }
    }
}
</style>
