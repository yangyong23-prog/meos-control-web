<template>
    <Entry>
        <template #viewMode="{ mode, setSseConsoleClient }">
            <Layout :view-mode="mode?.viewMode">
                <template #left>
                    <Left></Left>
                </template>
                <template #right>
                    <Right :set-sse-console-client="setSseConsoleClient"></Right>
                </template>
            </Layout>
        </template>
    </Entry>
</template>
<script setup>
import Entry from './Entry.vue';
import Layout from './Layout.vue';
import Left from './Left/index.vue';
import Right from './Right/index.vue';
import dataDockHandling from '@/hooks/dataDockHandling';
import {
    ABSORPTION_CHILLER_CLASSCODE,
    AIR_SOURCE_HEAT_PUMP_CLASSCODE,
    AIR_SOURCE_HEAT_PUMP_CONTROL_CLASSCODE,
    BOILER_CLASSCODE,
    COLD_HOT_COMMON_WATER_PUMP_CONTROL_CLASSCODE,
    ELECTRIC_VALVE_CLASSCODE,
    GROUND_SOURCE_HEAT_PUMP_CLASSCODE,
    HEAT_EXCHANGER_CLASSCODE,
    HEAT_PUMP_CLASSCODE,
    showSystemInfoKey,
    SUPPLY_HOT_WATER_PUMP_CONTROL_CLASSCODE,
    SYSTEM_CLASS_CODE,
    WATER_SOURCE_HEAT_PUMP_CLASSCODE
} from './constant/variable';
const showSystemInfo = ref(false);
const { loadBdtpDataHandling } = dataDockHandling();
loadBdtpDataHandling({
    classCodes: [
        SYSTEM_CLASS_CODE,
        ...AIR_SOURCE_HEAT_PUMP_CLASSCODE,
        ...WATER_SOURCE_HEAT_PUMP_CLASSCODE,
        ...GROUND_SOURCE_HEAT_PUMP_CLASSCODE,
        ...BOILER_CLASSCODE,
        ...HEAT_PUMP_CLASSCODE,
        ...HEAT_EXCHANGER_CLASSCODE,
        ...ABSORPTION_CHILLER_CLASSCODE,
        ...AIR_SOURCE_HEAT_PUMP_CONTROL_CLASSCODE,
        ...ELECTRIC_VALVE_CLASSCODE,
        ...SUPPLY_HOT_WATER_PUMP_CONTROL_CLASSCODE,
        ...COLD_HOT_COMMON_WATER_PUMP_CONTROL_CLASSCODE
    ]
});
provide(showSystemInfoKey, showSystemInfo);
</script>
<style lang="less" scoped></style>
