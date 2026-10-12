<template>
    <div class="In-space-info-container">
        <template v-for="(item, index) in list" :key="index + 'p'">
            <div v-for="(dataItem, itemIndex) in item.dataValue" :key="itemIndex + 'c'" class="In-space-info-item">
                <div class="local-name">{{ dataItem?.localName ?? '--' }}</div>
                <span v-if="dataItem?.relObjects?.length > 0" class="rel-btn" @click="dataItem.isShow = !dataItem.isShow">
                    {{ i18n.global.t('meos_control_web.cameras_in_space') }}
                    <IconMeriComponentChevronDown v-if="!dataItem.isShow" size="14" color="#246FE5" />
                    <IconMeriComponentChevronUp v-else size="14" color="#246FE5" />
                </span>
                <div v-show="dataItem.isShow" class="rel-box">
                    <div
                        v-for="(relItem, relIndex) in dataItem?.relObjects"
                        :key="relIndex + 'l'"
                        :class="[runningMonitorType != PASSENGER_FLOW ? 'rel-item cp' : '', 'rel-box-item']"
                        @mouseenter="hoverObj(relItem)"
                        @mouseleave="unhoverObj"
                    >
                        <div class="rel-box-item-left" @click="clickObj(relItem)">
                            <span v-ellipsis class="name">{{ relItem.localName ?? '--' }}</span>
                            <div class="fc" style="gap: 4px">
                                <moreTemplateObjectTags :status-data="relItem" />
                            </div>
                            <m-tag v-if="currentPlayingObj?.id == relItem.id && runningMonitorType != PASSENGER_FLOW" class="ml4" color="#1B4ACC" bg-color="#D9EBFF" size="small">
                                {{ i18n.global.t('meos_control_web.current') }}
                            </m-tag>
                        </div>
                        <div v-if="runningMonitorType != PASSENGER_FLOW" class="rel-box-item-right" @click="openMonitorPlayer(relItem)">
                            <MointorPlainIcon class="icon" />{{ i18n.global.t('meos_control_web.view_monitor') }}
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import moreTemplateObjectTags from '@/views/Common/moreTemplateObjectTags/index.vue';
import { IconMeriComponentChevronDown, IconMeriComponentChevronUp } from 'meri-icon';
import MointorPlainIcon from '@/assets/svg/monitor-plain-icon.svg';
import { PASSENGER_FLOW } from '@/utils/globalVariables';
const emits = defineEmits(['openMonitorPlayer', 'hoverObj', 'unhoverObj', 'clickObj']);

const indexiItem = ref(0);
const openMonitorPlayer = (obj, index) => {
    indexiItem.value = index;
    const tagConfig = obj?.relInfoCodeGroupConfigs?.find(group => group.groupCode === 'equipStatus');
    emits('openMonitorPlayer', obj, tagConfig);
};
const hoverObj = obj => {
    emits('hoverObj', obj);
};
const clickObj = obj => {
    emits('clickObj', obj);
};
const unhoverObj = () => {
    emits('unhoverObj');
};
const isShow = ref(false);

const props = defineProps({
    list: {
        type: Object,
        default: () => {}
    },
    selectObj: {
        type: Object,
        default: () => {}
    },
    currentPlayingObj: {
        type: Object,
        default: () => {}
    },
    runningMonitorType: {
        type: String,
        default: ''
    }
});
// console.log(props.list, '-----');
</script>

<style lang="less" scoped>
.In-space-info-container {
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE/Edge */
    user-select: none; /* 标准语法 */
    .In-space-info-item {
        border-radius: 4px;
        background: #f7f9fa;
        padding: 12px;
        margin-bottom: 12px;
        .local-name {
            color: #2e3742;
            font-size: 16px;
            font-style: normal;
            font-weight: var(--platform-font-weight);
            line-height: 22px;
        }
        .rel-btn {
            width: 106px;
            height: 28px;
            color: #246fe5;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 8px;
            padding: 3px 4px;
            border-radius: 4px;

            font-size: 14px;
            font-style: normal;
            font-weight: var(--platform-font-weight);
            line-height: 28px;
            cursor: pointer;
            &:hover {
                background-color: rgba(196, 201, 207, 0.3);
            }
        }

        .rel-box {
            border-radius: 8px;
            background: #f1f4f6;
            &-item {
                padding: 0 8px;
                height: 44px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid rgba(196, 201, 207, 0.3);
                &:last-child {
                    border-bottom: none;
                }
                &:hover {
                    background: rgba(196, 201, 207, 0.3);
                }
                &-left {
                    display: flex;
                    justify-content: space-between;
                    max-width: calc(100% - 92px);
                    .name {
                        display: inline-block;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        margin-right: 8px;
                    }
                }
                &-right {
                    width: 80px;
                    min-width: 80px;
                    max-width: 80px;
                    display: flex;
                    align-items: center;
                    color: #626c78;

                    font-size: 14px;
                    padding: 0 2px;
                    font-style: normal;
                    line-height: 22px;
                    margin-left: 12px;
                    border-radius: 4px;
                    cursor: pointer;

                    .icon {
                        margin-right: 4px;
                    }
                    &:hover {
                        background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
                    }
                }
            }
        }
    }
}
</style>
