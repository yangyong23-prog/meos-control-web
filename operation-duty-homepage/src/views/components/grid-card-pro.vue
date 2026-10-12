<template>
    <div class="running-monitor-procard-layout">
        <div class="running-monitor-procard-top">
            <div class="running-monitor-procard-left">
                <Title class="running-monitor-title" :path="jumpPath" :params="jumpParams">
                    <span v-ellipsis class="title">{{ item.name }}</span>
                </Title>
            </div>
            <div class="running-monitor-procard-right">
                <div class="running-monitor-procard-right-top">
                    <div class="running-monitor-procard-right-top-l">
                        <RunNumber :value="item.runningTotal" :total="item.equipmentTotal" />
                    </div>
                    <div class="running-monitor-procard-right-top-r">
                        <m-tag v-if="item.moreOpenTotal" v-ellipsis color="#FFFFFF" bg-color="#E6B407" size="small"
                            >{{ i18n.global.t('common.over_on') }}{{ item.moreOpenTotal }}
                        </m-tag>
                        <m-tag v-if="item.lessOpenTotal" v-ellipsis color="#FFFFFF" bg-color="#FF9D2D" size="small"
                            >{{ i18n.global.t('common.drive_less') }}{{ item.lessOpenTotal }}
                        </m-tag>
                    </div>
                </div>
            </div>
        </div>
        <div class="running-monitor-procard-bottom">
            <div class="running-monitor-procard-left">
                <Title class="running-monitor-title" :class="templateClass">{{ item?.demandTemplate?.templateName }}</Title>
            </div>
            <div class="running-monitor-procard-right">
                <ProgressBar :ratio="(item.runningTotal ?? 0) / item.equipmentTotal" />
            </div>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import Title from '@/components/Title.vue';
import RunNumber from '@/components/RunNumber.vue';
import IntersectionObserverBox from '@/components/IntersectionObserverBox.vue';
import ProgressBar from '@/components/ProgressBar.vue';
import { NameCodeToPath, NameCodeToParams } from '@/utils/globalVariables';
const props = defineProps({
    item: {
        type: Object,
        default: () => ({})
    }
});
const jumpPath = computed(() => {
    if (props.item && props.item.nameCode && props.item.canJump) {
        return NameCodeToPath[props.item.nameCode] || '';
    }
    return '';
});
const jumpParams = computed(() => {
    if (props.item && props.item.nameCode) {
        return NameCodeToParams[props.item.nameCode] || {};
    }
    return {};
});
const templateClass = computed(() => {
    if (props.item && props.item.demandTemplate) {
        switch (props.item.demandTemplate.templateTag) {
            case 'WORKDAY':
                return 'title-bl';
            case 'DAYOFF':
                return 'title-og';
            case 'ANNIVERSARY':
                return 'title-red';
            default:
                return 'title-custom';
        }
    }
    return 'title-bl';
});
</script>
<style lang="less" scoped>
.running-monitor-procard-layout {
    display: flex;
    flex-direction: column;
    white-space: nowrap;
    height: 100%;
    margin-top: -3px;
    flex-grow: 1;
    margin-bottom: -3px;
    .running-monitor-procard-top {
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .running-monitor-procard-bottom {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 100%;
    }
    .running-monitor-procard-left {
        display: flex;
        flex-direction: column;
        width: 96px;
        flex-shrink: 0;
        .running-monitor-title {
            padding: 0;
            width: 95%;
            display: flex;
            justify-content: flex-start;
            .title {
                width: 100%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                display: inline-block;
            }
        }
    }
    .running-monitor-procard-right {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        .running-monitor-procard-right-top {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            .running-monitor-procard-right-top-l {
                display: flex;
                flex-direction: row;
                gap: 12px;
                align-items: center;
            }
            .running-monitor-procard-right-top-r {
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 4px;
                :deep(.m-tag-small) {
                    max-width: 60px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: inline-block;
                }
            }
        }
    }
}
.title-bl {
    color: #58a9ff;
}
</style>
