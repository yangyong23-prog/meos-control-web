<template>
    <div class="equipment-item-title fc">
        <div v-ellipsis class="title-name m-ellipsis fs16">
            {{ data.localName }}
        </div>
        <div class="title-tag fc" style="gap: 4px">
            <TemplateObjectTags :status-data="equipstatus" :select-obj="data" :is-subscript-on-demand="true" :template-type="HOVER" />
        </div>
    </div>
    <div v-for="item in relInfoCodeConfigs" :key="item.infoCode" class="fc">
        <span style="color: var(--gray-600); white-space: nowrap">{{ item.infoCodeName }}：</span>
        <span style="white-space: nowrap">{{ getValueStr(getIotData(data.id, item.infoCode)).text }}</span>
    </div>
</template>

<script setup>
import TemplateObjectTags from '@/components/templateObjectTags/index.vue';
import { getValueStr } from '@/utils/tools';
import DockSingleton from '@/hooks/responsiveDock';
import { isObject } from 'lodash';
import { HOVER } from '@/utils/globalVariables';

const { getIotData } = DockSingleton.getInstance();
const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    }
});
const equipstatus = computed(() => {
    let obj = props.data?.equipStatus;
    !isObject(obj) && (obj = {});
    obj.relInfoCodeConfigs = obj?.relInfoCodeConfigs?.filter(item => item.showStyle === 'key') || [];
    return obj;
});
const relInfoCodeConfigs = computed(() => {
    const arr = props.data?.runningParameter?.relInfoCodeConfigs || [];
    return arr.filter(item => item.showStyle === 'key');
});
</script>
<style lang="less" scoped>
.equipment-item-title {
    height: 20px;
    .title-name {
        height: 100%;
        line-height: 20px;
    }
    .title-tag {
        margin-left: 4px;
    }
}
</style>
