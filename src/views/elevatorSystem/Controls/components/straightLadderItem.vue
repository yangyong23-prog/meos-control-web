<template>
    <div
        v-for="(item, index) in data"
        :key="index"
        :class="['card-item', 'cp', hasControls && type == 'ELELEL' ? 'min-h' : hasControls && type == 'ELELES' ? 'min-h2' : 'min-h1']"
        :style="{
            backgroundColor: getColorInfo(item).color
        }"
        @mouseenter="emits('hoverEquip', item)"
        @mouseleave="emits('unhoverEquip')"
        @click="emits('clickEquip', item)"
    >
        <div>
            <div v-ellipsis :class="['f14', 'm-ellipsis', 'localName', hasControls ? '' : 'mr4']" :style="{ color: getColorInfo(item).fontColor }">
                {{ item.localName ?? '--' }}
            </div>
            <!-- 做隐藏需要把父元素包进去计算 -->
            <TemplateObjectTags
                class="tags-container"
                :status-data="item.relInfoCodeGroupConfigs[0]"
                :template-type="DETAIL"
                :filter-arr="filterArr"
                @tags-amount-change="handleTagsAmountChange"
            />
        </div>
        <div v-if="hasControls && type == 'ELELEL'" class="mt4">
            <span class="f14 ft1">{{ i18n.global.t('meos_control_web.current_floor_colon') }}</span>
            <span class="f14">{{ floorLocalName(item) }}</span>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { isEdge } from '@/utils/envUtils';
import TemplateObjectTags from '@/components/templateObjectHiddenTags/index.vue';
import { DETAIL } from '@/utils/globalVariables';
const emits = defineEmits('unhoverEquip', 'hoverEquip', 'clickEquip');
const props = defineProps({
    data: {
        type: Array,
        default: () => []
    },
    type: {
        type: String,
        default: () => ''
    }
});

const filterArr = ['stopFloor'];
const hasControls = computed(() => {
    if (!isEdge()) {
        return false;
    }
    return true;
});
const floorLocalName = item => {
    return item?.relInfoCodeGroupConfigs?.find(io => io.groupCode === 'equipStatus')?.relInfoCodeConfigs?.find(f => f.infoCode === 'stopFloor')?.dataValue || '--';
};
const getColorInfo = item => {
    const colorInfo = {};
    let hasFinded = false;
    item.relInfoCodeGroupConfigs.forEach(io => {
        if (io.groupCode === 'equipStatus' && io.relInfoCodeConfigs?.length) {
            io.relInfoCodeConfigs.forEach(obj => {
                if (obj?.dataSource?.length) {
                    obj.dataSource.forEach(objitem => {
                        if (obj.dataValue) {
                            if (objitem.code === obj.dataValue && !hasFinded) {
                                if (obj.infoCode === 'alarmstatus' && obj.dataValue === 'alarmstatus') {
                                    //异常
                                    colorInfo.color = 'rgba(245, 80, 71, 0.14)';
                                    colorInfo.fontColor = '#1B2129';
                                    hasFinded = true;
                                    return;
                                }
                                if (obj.infoCode === 'isOverLoad' && obj.dataValue === '1') {
                                    //超载
                                    colorInfo.color = 'rgba(242, 159, 0, 0.14)';
                                    colorInfo.fontColor = '#1B2129';
                                    return;
                                }
                                if (obj.infoCode === 'lockStatus' && obj.dataValue === '1') {
                                    //锁梯
                                    colorInfo.color = '#E8ECF0';
                                    colorInfo.fontColor = '#8B949E';
                                    return;
                                }
                            }
                        }
                    });
                }
            });
        }
    });
    return colorInfo;
};
</script>
<style lang="less" scoped>
.card-item {
    border-radius: 4px;
    background: var(--gray-50, #f7f9fa);
    padding: 8px 12px;
    width: 48%;
    border: 1px solid transparent;
    .tags-container {
        margin-top: 4px;
        height: 20px;
    }
    .floor-container {
        margin-top: 8px !important;
    }
}
.card-item:hover {
    border: 1px solid var(--blue-500, #246fe5);
    box-shadow: 0px 2px 10px 0px rgba(27, 33, 41, 0.1);
}
.min-h {
    min-height: 85px;
}
.min-h1 {
    min-height: 36px;
}
.min-h2 {
    min-height: 60px;
}
.localName {
    max-width: calc(100%);
}
.title-tag {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
}
.title-tag-item {
    display: flex;
    gap: 4px;
}
</style>
