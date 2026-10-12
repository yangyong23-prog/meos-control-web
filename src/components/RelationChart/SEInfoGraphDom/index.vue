<template>
    <template v-if="!webLayout">
        <template v-for="data in renderDomList" :key="data.id + 'text-map'">
            <template v-for="(item, k) in data.textMap" :key="k">
                <IotTextMapItem v-if="k !== 'localName'" :text-map-data="item" :data-object="data?.dataObject" v-bind="$attrs"></IotTextMapItem>
            </template>
        </template>
    </template>

    <CabinetNumber v-for="cabinetNumber in cabinetNumbers" :key="cabinetNumber.id" :data="cabinetNumber" v-bind="$attrs"></CabinetNumber>

    <CTInfo v-for="ct in ctList" :key="ct.id" :data="ct" v-bind="$attrs"></CTInfo>

    <SelectInfos v-for="infosItem in selectInfos" :key="infosItem.id" :data="infosItem" v-bind="$attrs"></SelectInfos>

    <Name v-for="item in renderDomList" :key="item.id" :web-layout="webLayout" :data="item" v-bind="$attrs"></Name>

    <LinkObject v-for="linkObj in linkObjects" :key="linkObj.id" :data="linkObj" v-bind="$attrs"></LinkObject>

    <!-- iot 列表 -->
    <IotGroupCard v-for="plane in infoPlanes" :key="plane.id" :data="plane" :chart-attr="chartAttr" v-bind="$attrs" />
</template>
<script setup>
import IotTextMapItem from './IotTextMapItem.vue';
import IotGroupCard from './IotGroupCard.vue';
import LinkObject from './LinkObject.vue';
import Name from './Name.vue';
import CabinetNumber from './CabinetNumber.vue';
import SelectInfos from './SelectInfos.vue';
import CTInfo from './CTInfo.vue';

const props = defineProps({
    linkObjects: {
        type: Array,
        default: () => []
    },
    infoPlanes: {
        type: Array,
        default: () => []
    },
    renderDomList: {
        type: Array,
        default: () => []
    },
    chartAttr: {
        type: Object,
        default: null
    },
    cabinetNumbers: {
        type: Array,
        default: () => []
    },
    ctList: {
        type: Array,
        default: () => []
    },
    selectInfos: {
        type: Array,
        default: () => []
    },
    webLayout: {
        // 是否是前端布局
        type: Boolean,
        default: false
    }
});
</script>
