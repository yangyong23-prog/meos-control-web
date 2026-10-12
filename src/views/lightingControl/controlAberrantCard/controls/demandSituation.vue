<!--
 * @Author: guoxiaohuan
 * @Date: 2024-04-28 15:34:04
 * @LastEditors: guoxiaohuan
 * @LastEditTime: 2024-05-10 17:47:38
 * @Description:
-->
<template>
    <div style="margin-bottom: 24px">
        <template v-if="demandData?.length">
            <div
                v-for="(item, index) in demandData"
                :key="index + 'd'"
                :class="{ demand: index !== demandData?.length - 1 }"
                @mouseenter="mouseenterDemand(item, index)"
                @mouseleave="mouseleaveDemand(item, index)"
                @click.stop="item.funcTypeOpen = !item.funcTypeOpen"
            >
                <div class="demand-container">
                    <div class="demand-container-img">
                        <img
                            v-if="item.funcType === lightingFuncType.generalLighting"
                            src="@/assets/imgs/demand/pt.png"
                            :alt="i18n.global.t('meos_control_web.general_lighting')"
                        />
                        <img
                            v-else-if="item.funcType === lightingFuncType.decorateLighting"
                            src="@/assets/imgs/demand/zs.png"
                            :alt="i18n.global.t('meos_control_web.decorative_lighting')"
                        />
                        <img
                            v-else-if="item.funcType === lightingFuncType.adLighting"
                            src="@/assets/imgs/demand/gg.png"
                            :alt="i18n.global.t('meos_control_web.advertising_lighting')"
                        />
                        <img
                            v-else-if="item.funcType === lightingFuncType.markLighting"
                            src="@/assets/imgs/demand/bs.png"
                            :alt="i18n.global.t('meos_control_web.signage_lighting')"
                        />
                        <img
                            v-else-if="item.funcType === lightingFuncType.permanentLighting"
                            src="@/assets/imgs/demand/cl.png"
                            :alt="i18n.global.t('meos_control_web.always_on_lighting')"
                        />
                        <img
                            v-else-if="item.funcType === lightingFuncType.backupLighting"
                            src="@/assets/imgs/demand/by.png"
                            :alt="i18n.global.t('meos_control_web.backup_lighting')"
                        />
                        <img v-else src="@/assets/imgs/demand/default.png" alt="" />
                    </div>
                    <div class="demand-container-list">
                        <div class="demand-container-list-item demand-container-list-left">
                            <div class="demand-container-list-text">
                                <span class="title">{{ item.funcTypeName }}</span>
                                <m-tag v-if="item.moreOpenNumber" class="tag" color="#FFFFFF" bg-color="#E6B407" size="small">{{
                                    i18n.global.t('meos_control_web.more_open_num', {
                                        totalMoreOpenCount: item.moreOpenNumber
                                    })
                                }}</m-tag>
                                <m-tag v-if="item.lessOpenNumber" class="tag" color="#FFFFFF" bg-color="#FF9D2D" size="small">{{
                                    i18n.global.t('meos_control_web.less_open_num', { totalMoreLessCount: item.lessOpenNumber })
                                }}</m-tag>
                            </div>
                            <m-button
                                v-if="item?.children?.length"
                                class="icon-btn"
                                type="icon"
                                :icon="!item.funcTypeOpen ? 'IconMeriComponentChevronDown' : 'IconMeriComponentChevronUp'"
                                size="small"
                                @click.stop="item.funcTypeOpen = !item.funcTypeOpen"
                            ></m-button>
                        </div>
                        <div class="demand-container-list-item demand-container-list-bottom">
                            <div class="demand-container-list-text">
                                {{ i18n.global.t('meos_control_web.need_start_colon') }}<span class="value">{{ item.demandOnNumber || 0 }}</span>
                                <span class="line"></span>
                                {{ i18n.global.t('meos_control_web.currently_on_colon') }}<span class="value">{{ item.realOnNumber || 0 }}</span>
                            </div>
                            <m-button
                                v-if="item.isDetailBtn && isEdge()"
                                type="link"
                                size="medium"
                                :disabled="!isEdge()"
                                @click.stop="
                                    Details({
                                        type: 'loop',
                                        hlInfo: {
                                            funcType: item.funcType,
                                            templateType: templateType,
                                            operatingDeviation:
                                                item.moreOpenNumber && item.lessOpenNumber
                                                    ? ['MORE_OPEN', 'LESS_OPEN']
                                                    : item.moreOpenNumber
                                                    ? ['MORE_OPEN']
                                                    : item.lessOpenNumber
                                                    ? ['LESS_OPEN']
                                                    : ['NO_DEVIATION']
                                        }
                                    })
                                "
                                >{{ i18n.global.t('meos_control_web.details') }}</m-button
                            >
                        </div>
                    </div>
                </div>

                <div v-if="item.funcTypeOpen" class="demand-child">
                    <div v-for="(child, childIndex) in item.children" :key="childIndex + 's'" class="demand-child-list">
                        <div class="demand-container-list-text">
                            <span class="title">{{ child.lampFuncTypeName }}</span>
                            <m-tag v-if="child.moreOpenNumber" class="tag" color="#FFFFFF" bg-color="#E6B407" size="small">{{
                                i18n.global.t('meos_control_web.more_open_num', {
                                    totalMoreOpenCount: child.moreOpenNumber
                                })
                            }}</m-tag>
                            <m-tag v-if="child.lessOpenNumber" class="tag" color="#FFFFFF" bg-color="#FF9D2D" size="small">{{
                                i18n.global.t('meos_control_web.less_open_num', { totalMoreLessCount: child.lessOpenNumber })
                            }}</m-tag>
                        </div>
                        <div class="demand-container-list-item demand-container-list-bottom">
                            <div class="demand-container-list-text">
                                {{ i18n.global.t('meos_control_web.need_start_colon') }}<span class="value">{{ child.demandOnNumber || 0 }}</span>
                                <span class="line"></span>
                                {{ i18n.global.t('meos_control_web.currently_on_colon') }}<span class="value">{{ child.realOnNumber || 0 }}</span>
                            </div>
                            <m-button
                                v-if="isEdge()"
                                type="link"
                                size="medium"
                                :disabled="!isEdge()"
                                @click.stop="
                                    Details({
                                        type: 'loop',
                                        hlInfo: {
                                            funcType: item.funcType,
                                            lampType: child.lampFuncType,
                                            templateType: templateType,
                                            operatingDeviation:
                                                child.moreOpenNumber && child.lessOpenNumber
                                                    ? ['MORE_OPEN', 'LESS_OPEN']
                                                    : child.moreOpenNumber
                                                    ? ['MORE_OPEN']
                                                    : child.lessOpenNumber
                                                    ? ['LESS_OPEN']
                                                    : ['NO_DEVIATION']
                                        }
                                    })
                                "
                                >{{ i18n.global.t('meos_control_web.details') }}</m-button
                            >
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template v-else>
            <I18nSlot html-tag="div" class="no-data" name-key="meos_control_web.current_supreme">
                <template #name>
                    <img src="@/assets/imgs/group.png" alt="" />
                </template>
                <template #status>
                    <span>{{ i18n.global.t('meos_control_web.no_operational_deviation') }}</span>
                </template>
            </I18nSlot>
        </template>
    </div>
</template>

<script setup>
import I18nSlot from '@/components/I18nSlot.vue';
import i18n from '@/localization';
import { loopControlList } from '@/store/loopControlList';
import { isEdge } from '@/utils/envUtils';
import baseStore from '@/store/baseStore';
const demandData = inject('demandData');
const curFloorId = inject('curFloorId');
const templateType = inject('templateType');
const loopListStore = loopControlList();
const mouseenterDemand = (item, index) => {
    let elements = document.querySelectorAll('.demand-container');
    item.isDetailBtn = true;
    // if (!item.funcTypeOpen) {
    elements[index].style.backgroundColor = 'rgba(196, 201, 207, 0.30)';
    elements[index].style.cursor = 'pointer';
    // } else {
    //     elements[index].style.backgroundColor = '';
    // }
};
const mouseleaveDemand = (item, index) => {
    let elements = document.querySelectorAll('.demand-container');
    item.isDetailBtn = false;
    elements[index].style.backgroundColor = '';
};

const Details = data => {
    if (curFloorId?.value) {
        data.hlInfo.instanceType = 'FLOOR';
        data.hlInfo.instanceId = curFloorId.value;
    } else {
        data.hlInfo.instanceType = 'PROJECT';
        data.hlInfo.instanceId = baseStore().projectId;
    }
    loopListStore.setList(data);
    loopListStore.setVisible(true);
};
watch(
    () => demandData?.value,
    val => {
        demandData.value = val;
    },
    {
        deep: true
    }
);
</script>

<style lang="less" scoped>
.demand {
    border-bottom: 1px solid #f1f4f6;
}
.demand-container {
    display: flex;
    padding: 12px 4px;
    align-items: top;
    border-radius: 4px;
    &-img {
        width: 41.872px;
        height: 41.872px;
        background-color: #ebf6ff;
        border-radius: 90px;
        margin-right: 12px;
        position: relative;
        img {
            width: 28.5px;
            height: 28.5px;
            position: absolute;
            top: 6.5px;
            left: 6.5px;
        }
    }
    &-list {
        flex: 1;
        &-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        &-left {
            .icon-btn {
                width: 16px;
                height: 16px;
                margin-right: 14px;
            }
        }
        &-bottom {
            height: 32px;
            line-height: 32px;
        }
        &-text {
            color: #626c78;
            display: flex;
            align-items: center;
            .title {
                color: #2e3742;

                font-size: 14px;
                font-weight: 700;
                margin-right: 8px;
            }
            .tag {
                margin-right: 4px;
            }
            .line {
                display: inline-block;
                width: 1px;
                height: 13px;
                background: #d9d9d9;
                margin: 0 8px;
            }
            .value {
                color: #1b2129;
            }
        }
    }
}
.demand-child {
    border-radius: 4px;
    background: #f7f9fa;
    padding: 12px 4px 8px 58px;
    margin-bottom: 12px;
    &-list {
        margin-bottom: 12px;
        &:last-child {
            margin-bottom: 0px;
        }
    }
}
.no-data {
    padding: 12px 20px;
    background: #f7f9fa;
    color: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
        width: 22px;
        height: 22px;
        display: inline-block;
        margin-right: 9px;
    }
    span {
        color: #2bb462;
        font-weight: 700;
    }
}
</style>
