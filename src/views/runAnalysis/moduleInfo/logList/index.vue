<template>
    <div class="module-info-log-list h100">
        <header>
            <div class="title">{{ i18n.global.t('meos_control_web.log_list') }}</div>
            <div class="btns" @click="isOpen = !isOpen">
                {{ i18n.global.t('meos_control_web.filter') }}
                <IconMeriComponentChevronDown v-if="!isOpen" :size="16" color="#8B949E" />
                <IconMeriComponentChevronUp v-else :size="16" color="#8B949E" />
            </div>
        </header>
        <div v-show="isOpen" class="selects">
            <m-select
                v-model="markValue"
                :size="system.classCode === 'ACAC' ? 320 : 160"
                :options="selectMarkList"
                :prefix="i18n.global.t('meos_control_web.identifier')"
                clearable
                @change="queryListRunningLogByDate('reset')"
                @clear="queryListRunningLogByDate('reset')"
            ></m-select>
            <m-select
                v-if="system.classCode !== 'ACAC'"
                v-model="levelValue"
                :size="160"
                :options="selectLevelList"
                :prefix="i18n.global.t('meos_control_web.category_colon')"
                clearable
                @change="queryListRunningLogByDate('reset')"
                @clear="queryListRunningLogByDate('reset')"
            ></m-select>
        </div>
        <Empty
            v-if="logData?.length === 0 && !logLoading"
            class="empty"
            :style="{ height: isOpen ? 'calc(100% - 76px)' : 'calc(100% - 32px)' }"
            :text="i18n.global.t('meos_control_web.no_content')"
            width="90px"
            height="76px"
        />
        <div v-else class="content" :style="{ height: isOpen ? 'calc(100% - 76px)' : 'calc(100% - 32px)' }">
            <m-list-skeleton v-if="logLoading" style="padding-right: 16px" />
            <m-virtual-list v-else :item-size="76" item-resizable :items="logList" :scrollbar-props="{ onScrollToBoundary: throttleScroll }">
                <template #default="{ item }">
                    <LogItem :key="item.key" :data="item" :color-dict="colorDict" @hover="hover" @unhover="unhover" />
                    <div v-if="showMore" class="loading-more">
                        <IconMeriComponentButtonGrey color="#626C78" class="loading-more__icon" />
                    </div>
                </template>
            </m-virtual-list>
            <!-- <m-scrollbar @scroll-to-boundary="throttleScroll">
                <m-list-skeleton v-if="logLoading" style="padding-right: 16px" />
                <template v-else>
                    <LogItem v-for="item in logData" :key="item.id" :data="item" :color-dict="colorDict" @hover="hover" @unhover="unhover" />
                    <div v-if="showMore" class="loading-more">
                        <IconMeriComponentButtonGrey color="#626C78" class="loading-more__icon" />
                    </div>
                </template>
            </m-scrollbar> -->
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { IconMeriComponentChevronDown, IconMeriComponentChevronUp, IconMeriComponentButtonGrey } from 'meri-icon';
import Empty from '@/components/common/Empty.vue';
import LogItem from './logItem.vue';
import useLogList from '../../hooks/useLogList';
import { systemKey } from '../../hooks/useBaseData';
const emits = defineEmits(['hover', 'unhover']);
const system = inject(systemKey);
const {
    isOpen,
    logData,
    logList,
    logLoading,
    showMore,
    colorDict,
    selectMarkList,
    selectLevelList,
    markValue,
    levelValue,
    hover,
    unhover,
    queryListRunningLogByDate,
    scrollToBoundary,
    throttleScroll
} = useLogList(emits);
</script>
<style lang="less" scoped>
.module-info-log-list {
    width: 360px;
    padding: 12px 0 12px 16px;
    background-color: var(--gray-50);
    border-left: 1px solid var(--gray-200);
    position: relative;
    z-index: 2;
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        padding-right: 16px;
        .title {
            color: #2e3742;
            font-size: 16px;
            font-style: normal;
            font-weight: 700;
            line-height: 24px;
            user-select: none;
        }
        .btns {
            color: #626c78;
            font-size: 14px;
            font-weight: var(--platform-font-weight);
            line-height: 22px;
            display: flex;
            align-items: center;
            user-select: none;
            cursor: pointer;
            padding: 0 4px;
            border-radius: 4px;
            svg {
                cursor: pointer;
                margin-left: 4px;
            }
            &:hover {
                background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
            }
        }
    }
    .selects {
        padding-right: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
    }
    .content {
        overflow: hidden;
        .loading-more {
            height: 40px;
            color: #626c78;
            display: flex;
            align-items: center;
            justify-content: center;

            &__icon {
                animation: rotate 0.7s linear infinite;
            }
        }
    }
    .empty {
        display: flex;
        justify-content: center;
    }
}
</style>
