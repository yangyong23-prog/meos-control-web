<template>
    <div class="air-table-time">
        <Timetable
            :system-type="systemType"
            :cur-console-type="curConsoleType"
            :current-system="currentSystem"
            :enable-console-types="enableConsoleTypes"
            :console-type-map="consoleTypeMap"
            @go-back="goBack"
        />
        <m-drawer
            :append-to="$drawerAppendTo"
            :show="showAirConditionSpaceList"
            :shadow-click="true"
            width="480px"
            drawer-class="control-space-drawer"
            :z-index="Z_INDEX.equipmentList"
            :title="i18n.global.t('meos_control_web.guan_lian_space')"
            @close="showAirConditionSpaceList = false"
        >
            <template #content>
                <SpaceList v-if="showAirConditionSpaceList" :data="airConditionSpaceListData" style="padding: 8px 24px" />
            </template>
        </m-drawer>
    </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import Timetable from './components/timetable/index.vue';
import SpaceList from '@/views/Common/SystemsAndControl/components/control/SpaceList.vue';
import { chillerDataKey, codeDefineKey, openAirConditionSpaceListKey } from './injectKeys';
import { parseJsonQuery, queryString } from './utils/query';
import { ConsoleTypesEnum } from '@/views/Common/SystemsAndControl/types';
import { getChillerAxios, listScheduleInfoCodeDefine } from '@/apis/control';
import i18n from '@/localization';
import { Z_INDEX } from '@/constants/zIndex';
import treeBuildFloorStore from '@/store/treeBuildFloor';
import { setModelType } from '@/utils/tools';
const route = useRoute();
const router = useRouter();

const systemType = ref('ACCI');
const curConsoleType = ref('AIR_TERMINAL_ZONE');
const enableConsoleTypes = ref([]);
const currentSystem = computed(() => {
    const queryCurrentSystem = parseJsonQuery(route.query.currentSystem, {});
    const systemName = queryString(route.query.systemName, queryCurrentSystem.systemName || queryCurrentSystem.localName || '');
    return {
        ...queryCurrentSystem,
        systemId: queryString(route.query.systemId, queryCurrentSystem.systemId || ''),
        systemName,
        localName: systemName,
        classCode: queryCurrentSystem.classCode || ''
    };
});
const consoleTypeMap = {
    [ConsoleTypesEnum.AIR_TERMINAL_ZONE]: {
        id: ConsoleTypesEnum.AIR_TERMINAL_ZONE,
        name: i18n.global.t('meos_control_web.hvac_zone'),
        timeTableName: i18n.global.t('meos_control_web.zone_schedule')
    }
};
const codeDefine = ref({});
const chillerData = ref({});
const showAirConditionSpaceList = ref(false);
const airConditionSpaceListData = ref({});

// 打开空调分区关联空间抽屉
const openAirConditionSpaceList = data => {
    console.log(data);
    airConditionSpaceListData.value = {
        id: data.objectId,
        name: data.airTerminalZoneName || data.localName || data.infoCodeName
    };
    showAirConditionSpaceList.value = true;
};

treeBuildFloorStore().handleTreeBuildingFloorData();

// 根据系统类型查询时间表信息点定义
watch(
    systemType,
    async classCode => {
        codeDefine.value = {};
        if (!classCode) return;

        try {
            const { data } = await listScheduleInfoCodeDefine({ classCode });
            const result = {};
            Object.keys(data || {}).forEach(key => {
                result[key] = {};
                (data[key] || []).forEach(item => {
                    if (item?.aliasCode) {
                        result[key][item.aliasCode] = item;
                        result[key][`${item.aliasCode}${item.consoleType ?? ''}`] = item;
                    }
                    if (item?.code) {
                        result[key][item.code] = item;
                    }
                });
            });
            codeDefine.value = result;
        } catch (error) {
            console.error('查询时间表信息点定义失败:', error);
        }
    },
    { immediate: true }
);

// 根据系统 ID 查询时间表使用的冷机台数数据
watch(
    () => currentSystem.value.systemId,
    async systemId => {
        chillerData.value = {};
        if (!systemId) return;

        try {
            const { data } = await getChillerAxios({ objectId: systemId });
            Object.keys(data || {}).forEach(key => {
                chillerData.value[`${key}${systemId}`] = data[key];
            });
        } catch (error) {
            console.error('查询时间表冷机数据失败:', error);
        }
    },
    { immediate: true }
);

provide(codeDefineKey, codeDefine);
provide(chillerDataKey, chillerData);
provide(openAirConditionSpaceListKey, openAirConditionSpaceList);

// 独立路由页返回原控制台
const goBack = () => {
    router.back();
};
onMounted(() => {
    setModelType(route.query.systemId);
});
</script>

<style lang="less" scoped>
.air-table-time {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: var(--gray-100);
}
</style>
<style lang="less">
.control-space-drawer {
    .m-drawer-container-content.draw_fixed {
        width: 100%;
        padding: 0;
    }
}
.control-space-drawer {
    .m-drawer-mask,
    .m-drawer-container {
        top: 48px;
        z-index: 1;
    }
    .m-drawer-container {
        height: calc(100% - 48px) !important;
    }
}
// 断点适配
@media screen and (max-width: 1600px) {
    .control-space-drawer {
        .m-drawer-container {
            width: 400px !important;
        }
    }
}
</style>
