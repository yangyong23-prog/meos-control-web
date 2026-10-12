<template>
    <div class="associated-device">
        <div v-for="(item, index) in data" :key="index" :class="[runningMonitorType === 'PARKING' ? 'equip-item-h cp' : '', 'equip-item']">
            <m-tips
                :disabled="item.classCode !== 'WEGMGL'"
                :content="i18n.global.t('meos_control_web.open_new_tab_to_detail')"
                theme="darkTransparent"
                placement="top"
                trigger="hover"
            >
                <div :class="['equip-title', 'fcb']" @click="clickObj(item)" @mouseleave="unhoverObj(item)" @mouseenter="hoverObj(item)">
                    <div class="fc" style="max-width: calc(100% - 92px)">
                        <span v-ellipsis class="f14 fb7 mr4 equip-name">{{ item.localName ?? '--' }}</span>
                        <m-tag v-if="runningMonitorType === 'PARKING'" color="#1B4ACC" bg-color="#D9EBFF" size="small" class="mr4"> {{ item.inFloor?.localName ?? '--' }} </m-tag>
                        <div class="fc" style="gap: 4px">
                            <moreTemplateObjectTags :status-data="item" />
                        </div>
                        <m-tag v-if="currentPlayingObj?.id === item.id && runningMonitorType !== 'PARKING'" color="#1B4ACC" bg-color="#D9EBFF" size="small" class="ml4">
                            {{ i18n.global.t('meos_control_web.current') }}
                        </m-tag>
                    </div>
                    <div v-if="runningMonitorType !== 'PARKING'" class="to-vedio-icon cp fc" @click.stop="openPlayer(item, index)">
                        <MointorPlainIcon></MointorPlainIcon>
                        <span class="f14 ft ml4">{{ i18n.global.t('meos_control_web.view_monitor') }}</span>
                    </div>
                </div>
            </m-tips>
        </div>
    </div>
</template>
<script setup>
import { openWebsite } from '@/utils/websiteNavigation';
import { getAuthParamsString } from '@/utils/envUtils';
import { MEOI_INSTANCE_DETAIL, CLOUD_ORIGIN } from '@/config';
import MointorPlainIcon from '@/assets/svg/monitor-plain-icon.svg';
import moreTemplateObjectTags from '@/views/Common/moreTemplateObjectTags/index.vue';
import i18n from '@/localization';

const emits = defineEmits(['openMonitorPlayer', 'unhoverObj', 'hoverObj', 'clickObj']);
const props = defineProps({
    data: {
        type: Array,
        default: () => []
    },
    currentPlayingObj: {
        type: Object,
        default: () => {}
    },
    runningMonitorType: {
        type: String,
        default: ''
    },
    selectObj: {
        type: Object,
        default: () => {}
    }
});
// PARKING_LOT  ELEVATOR
const indexItem = ref(0);
const jumpTo = id => {
    openWebsite(MEOI_INSTANCE_DETAIL, {
        params: `objId=${id}&${getAuthParamsString()}&f=MEOI_CatalogList&type=all`,
        newPage: true,
        origin: CLOUD_ORIGIN || ''
    });
};

const clickObj = item => {
    if (props.runningMonitorType !== 'PARKING') {
        return;
    }
    //充电桩进入详情  灯跳转数据分析  WEGMGL灯  SEGECP充电桩
    if (item.classCode === 'SEGECP') {
        emits('clickObj', item);
    } else {
        if (!item?.id) return;
        jumpTo(item.id);
    }
};
const hoverObj = item => {
    if (item.classCode === 'SEGECP') {
        emits('hoverObj', item);
    }
};
const unhoverObj = item => {
    if (item.classCode === 'SEGECP') {
        emits('unhoverObj');
    }
};
// watch(
//     () => props.data,
//     () => {
//         if (props.data?.length) {
//             props.data?.forEach(item => {
//                 item.relInfoCodeGroupConfigs?.forEach(io => {
//                     if (io.groupCode === 'equipStatus' && io.relInfoCodeConfigs?.length) {
//                         tagsValue.value = io;
//                     }
//                 });
//             });
//         }
//     },
//     { immediate: true }
// );

const openPlayer = (item, index) => {
    indexItem.value = index;
    const tagConfig = item?.relInfoCodeGroupConfigs?.find(group => group.groupCode === 'equipStatus');
    emits('openMonitorPlayer', item, tagConfig);
};
</script>
<style lang="less" scoped>
.associated-device {
    background: var(--gray-50, #f7f9fa);
    border-radius: 4px;
    .equip-item {
        .equip-title {
            height: 46px;
            padding: 0 12px;
            .current-playing {
                display: inline-block;
                padding: 0 4px;
                border-radius: 2px;
                background-color: var(--blue-100);
                color: var(--blue-700);
                margin-left: 4px;
            }
            .equip-name {
                display: inline-block;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                // margin-right: 8px;
            }
            .to-vedio-icon {
                padding: 2px;
            }
            .to-vedio-icon:hover {
                border-radius: 4px;
                background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
                padding: 2px;
            }
        }
    }
    .equip-item:not(:last-child) {
        border-bottom: 1px solid var(--gray-300, #e1e5eb);
    }
    .equip-item-h {
        border-radius: 4px;
    }
    .equip-item-h:hover {
        background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
    }
}
</style>
-
