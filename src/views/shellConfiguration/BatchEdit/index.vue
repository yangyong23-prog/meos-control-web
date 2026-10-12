<template>
    <m-modal
        :append-to="$modalAppendTo"
        :visible="show"
        type="default"
        :title="i18n.global.t('meos_control_web.batch_edit')"
        align-center
        modal-class-name="shell-config-batch-editing"
        @close="close"
    >
        <template #content>
            <div>
                <div class="batch-header">
                    <m-tabs v-model="selectedTab" :data="tabs" type="segment" size="medium" @change="changeTabs"></m-tabs>
                </div>
            </div>
        </template>
        <template #footer>
            <m-button type="default" @click.stop="close">{{ i18n.global.t('common.cancel') }}</m-button>
            <m-button type="primary" @click.stop="close">{{ i18n.global.t('common.confirm') }}</m-button>
        </template>
    </m-modal>
</template>

<script setup>
import { computed } from 'vue';
import i18n from '@/localization';

const props = defineProps({
    show: {
        type: Boolean,
        default: false
    }
});

const testData2 = {
    tabName: i18n.global.t('meos_control_web.algorithm_condition_input'),
    children: [
        {
            group: 'group_alg_cold_hot',
            groupName: i18n.global.t('common.heating_cooling_source_system'),
            items: [
                {
                    code: 'alg_cooling_machine_change_timing',
                    value: '60',
                    objectId: 'Sy99099900071722808118076841985',
                    objectName: i18n.global.t('common.heating_cooling_source_system'),
                    scene: 'alg',
                    group: 'group_alg_cold_hot',
                    tab: i18n.global.t('meos_control_web.algorithm_condition_input'),
                    name: i18n.global.t('meos_control_web.ashp_group_mode_hold_time_after_add_remove'),
                    unit: 'min',
                    defaultValues: '60',
                    step: 0,
                    min: 0,
                    max: 1440,
                    hint: i18n.global.t('meos_control_web.multiples_of_5_range_0_to_1440'),
                    desc: i18n.global.t('meos_control_web.hold_strategy_after_count_change')
                },
                {
                    code: 'alg_cooling_machine_running_max',
                    value: '0',
                    objectId: 'Sy99099900071722808118076841985',
                    objectName: i18n.global.t('common.heating_cooling_source_system'),
                    scene: 'alg',
                    group: 'group_alg_cold_hot',
                    tab: i18n.global.t('meos_control_web.algorithm_condition_input'),
                    name: i18n.global.t('meos_control_web.ashp_group_max_allowed_units'),
                    unit: i18n.global.t('common.tai'),
                    defaultValues: '0',
                    step: 0,
                    min: 0,
                    max: 0,
                    hint: i18n.global.t('meos_control_web.range_0_to_0'),
                    desc: ''
                }
            ]
        },
        {
            group: 'group_alg_project',
            groupName: i18n.global.t('meos_control_web.project'),
            items: [
                {
                    code: 'alg_project_power_on',
                    value: '120',
                    scene: 'alg',
                    group: 'group_alg_project',
                    tab: i18n.global.t('meos_control_web.algorithm_condition_input'),
                    name: i18n.global.t('meos_control_web.earliest_start_duration_set'),
                    unit: 'min',
                    defaultValues: '120',
                    step: 0,
                    min: 0,
                    max: 1440,
                    hint: i18n.global.t('meos_control_web.multiples_of_15_range_0_to_1440'),
                    desc: i18n.global.t('meos_control_web.earliest_start_time_before_business_hours_t')
                },
                {
                    code: 'alg_project_power_off',
                    value: '120',
                    scene: 'alg',
                    group: 'group_alg_project',
                    tab: i18n.global.t('meos_control_web.algorithm_condition_input'),
                    name: i18n.global.t('meos_control_web.earliest_close_duration_set'),
                    unit: 'min',
                    defaultValues: '120',
                    step: 0,
                    min: 0,
                    max: 1440,
                    hint: i18n.global.t('meos_control_web.multiples_of_15_range_0_to_1440'),
                    desc: i18n.global.t('meos_control_web.relative_closing_time_earliest_shutdown_time_t')
                }
            ]
        },
        {
            group: 'group_alg_cooling',
            groupName: i18n.global.t('meos_control_web.central_cooling_system'),
            items: [
                {
                    code: 'alg_cooling_machine_change_timing',
                    value: '60',
                    objectId: 'Sy61011220101538727783620608002',
                    objectName: i18n.global.t('meos_control_web.commercial_cooling'),
                    scene: 'alg',
                    group: 'group_alg_cooling',
                    tab: i18n.global.t('meos_control_web.algorithm_condition_input'),
                    name: i18n.global.t('meos_control_web.chiller_add_remove_mode_hold_time'),
                    unit: 'min',
                    defaultValues: '60',
                    step: 0,
                    min: 0,
                    max: 1440,
                    hint: i18n.global.t('meos_control_web.multiples_of_5_range_0_to_1440'),
                    desc: i18n.global.t('meos_control_web.hold_strategy_after_count_change')
                },
                {
                    code: 'alg_cooling_machine_mix_enabled',
                    value: i18n.global.t('meos_control_web.yes'),
                    objectId: 'Sy61011220101538727783620608002',
                    objectName: i18n.global.t('meos_control_web.commercial_cooling'),
                    scene: 'alg',
                    group: 'group_alg_cooling',
                    tab: i18n.global.t('meos_control_web.algorithm_condition_input'),
                    name: i18n.global.t('meos_control_web.allow_big_small_chiller_together'),
                    unit: '/',
                    defaultValues: i18n.global.t('meos_control_web.yes'),
                    step: -1,
                    hint: '',
                    desc: ''
                },
                {
                    code: 'alg_cooling_machine_large_max',
                    value: '1',
                    objectId: 'Sy61011220101538727783620608002',
                    objectName: i18n.global.t('meos_control_web.commercial_cooling'),
                    scene: 'alg',
                    group: 'group_alg_cooling',
                    tab: i18n.global.t('meos_control_web.algorithm_condition_input'),
                    name: i18n.global.t('meos_control_web.max_chillers_allowed'),
                    unit: i18n.global.t('common.tai'),
                    defaultValues: '1',
                    step: 0,
                    min: 0,
                    max: 1,
                    hint: i18n.global.t('meos_control_web.range_0_to_1'),
                    desc: ''
                },
                {
                    code: 'alg_cooling_machine_small_max',
                    value: '1',
                    objectId: 'Sy61011220101538727783620608002',
                    objectName: i18n.global.t('meos_control_web.commercial_cooling'),
                    scene: 'alg',
                    group: 'group_alg_cooling',
                    tab: i18n.global.t('meos_control_web.algorithm_condition_input'),
                    name: i18n.global.t('meos_control_web.small_chiller_max_start_limit'),
                    unit: i18n.global.t('common.tai'),
                    defaultValues: '1',
                    step: 0,
                    min: 0,
                    max: 1,
                    hint: i18n.global.t('meos_control_web.range_0_to_1'),
                    desc: ''
                },
                {
                    code: 'alg_cooling_machine_change_timing',
                    value: '60',
                    objectId: 'Sy99099900071567042985003003906',
                    objectName: i18n.global.t('meos_control_web.office_cooling'),
                    scene: 'alg',
                    group: 'group_alg_cooling',
                    tab: i18n.global.t('meos_control_web.algorithm_condition_input'),
                    name: i18n.global.t('meos_control_web.chiller_add_remove_mode_hold_time'),
                    unit: 'min',
                    defaultValues: '60',
                    step: 0,
                    min: 0,
                    max: 1440,
                    hint: i18n.global.t('meos_control_web.multiples_of_5_range_0_to_1440'),
                    desc: i18n.global.t('meos_control_web.hold_strategy_after_count_change')
                },
                {
                    code: 'alg_cooling_machine_mix_enabled',
                    value: i18n.global.t('meos_control_web.yes'),
                    objectId: 'Sy99099900071567042985003003906',
                    objectName: i18n.global.t('meos_control_web.office_cooling'),
                    scene: 'alg',
                    group: 'group_alg_cooling',
                    tab: i18n.global.t('meos_control_web.algorithm_condition_input'),
                    name: i18n.global.t('meos_control_web.allow_big_small_chiller_together'),
                    unit: '/',
                    defaultValues: i18n.global.t('meos_control_web.yes'),
                    step: -1,
                    hint: '',
                    desc: ''
                },
                {
                    code: 'alg_cooling_machine_large_max',
                    value: '2',
                    objectId: 'Sy99099900071567042985003003906',
                    objectName: i18n.global.t('meos_control_web.office_cooling'),
                    scene: 'alg',
                    group: 'group_alg_cooling',
                    tab: i18n.global.t('meos_control_web.algorithm_condition_input'),
                    name: i18n.global.t('meos_control_web.max_chillers_allowed'),
                    unit: i18n.global.t('common.tai'),
                    defaultValues: '2',
                    step: 0,
                    min: 0,
                    max: 2,
                    hint: i18n.global.t('meos_control_web.range_0_to_2'),
                    desc: ''
                },
                {
                    code: 'alg_cooling_machine_small_max',
                    value: '1',
                    objectId: 'Sy99099900071567042985003003906',
                    objectName: i18n.global.t('meos_control_web.office_cooling'),
                    scene: 'alg',
                    group: 'group_alg_cooling',
                    tab: i18n.global.t('meos_control_web.algorithm_condition_input'),
                    name: i18n.global.t('meos_control_web.small_chiller_max_start_limit'),
                    unit: i18n.global.t('common.tai'),
                    defaultValues: '1',
                    step: 0,
                    min: 0,
                    max: 1,
                    hint: i18n.global.t('meos_control_web.range_0_to_1'),
                    desc: ''
                },
                {
                    code: 'alg_cooling_machine_change_timing',
                    value: '60',
                    objectId: 'Sy99099900071630831927395246081',
                    objectName: i18n.global.t('meos_control_web.hotel_cooling'),
                    scene: 'alg',
                    group: 'group_alg_cooling',
                    tab: i18n.global.t('meos_control_web.algorithm_condition_input'),
                    name: i18n.global.t('meos_control_web.chiller_add_remove_mode_hold_time'),
                    unit: 'min',
                    defaultValues: '60',
                    step: 0,
                    min: 0,
                    max: 1440,
                    hint: i18n.global.t('meos_control_web.multiples_of_5_range_0_to_1440'),
                    desc: i18n.global.t('meos_control_web.hold_strategy_after_count_change')
                },
                {
                    code: 'alg_cooling_machine_mix_enabled',
                    value: i18n.global.t('meos_control_web.yes'),
                    objectId: 'Sy99099900071630831927395246081',
                    objectName: i18n.global.t('meos_control_web.hotel_cooling'),
                    scene: 'alg',
                    group: 'group_alg_cooling',
                    tab: i18n.global.t('meos_control_web.algorithm_condition_input'),
                    name: i18n.global.t('meos_control_web.allow_big_small_chiller_together'),
                    unit: '/',
                    defaultValues: i18n.global.t('meos_control_web.yes'),
                    step: -1,
                    hint: '',
                    desc: ''
                },
                {
                    code: 'alg_cooling_machine_large_max',
                    value: '0',
                    objectId: 'Sy99099900071630831927395246081',
                    objectName: i18n.global.t('meos_control_web.hotel_cooling'),
                    scene: 'alg',
                    group: 'group_alg_cooling',
                    tab: i18n.global.t('meos_control_web.algorithm_condition_input'),
                    name: i18n.global.t('meos_control_web.max_chillers_allowed'),
                    unit: i18n.global.t('common.tai'),
                    defaultValues: '0',
                    step: 0,
                    min: 0,
                    max: 0,
                    hint: i18n.global.t('meos_control_web.range_0_to_0'),
                    desc: ''
                },
                {
                    code: 'alg_cooling_machine_small_max',
                    value: '0',
                    objectId: 'Sy99099900071630831927395246081',
                    objectName: i18n.global.t('meos_control_web.hotel_cooling'),
                    scene: 'alg',
                    group: 'group_alg_cooling',
                    tab: i18n.global.t('meos_control_web.algorithm_condition_input'),
                    name: i18n.global.t('meos_control_web.small_chiller_max_start_limit'),
                    unit: i18n.global.t('common.tai'),
                    defaultValues: '0',
                    step: 0,
                    min: 0,
                    max: 0,
                    hint: i18n.global.t('meos_control_web.range_0_to_0'),
                    desc: ''
                },
                {
                    code: 'alg_cooling_machine_change_timing',
                    value: '60',
                    objectId: 'Sy99099900071763042604694458369',
                    objectName: i18n.global.t('meos_control_web.ice_storage_system_virtual'),
                    scene: 'alg',
                    group: 'group_alg_cooling',
                    tab: i18n.global.t('meos_control_web.algorithm_condition_input'),
                    name: i18n.global.t('meos_control_web.chiller_add_remove_mode_hold_time'),
                    unit: 'min',
                    defaultValues: '60',
                    step: 0,
                    min: 0,
                    max: 1440,
                    hint: i18n.global.t('meos_control_web.multiples_of_5_range_0_to_1440'),
                    desc: i18n.global.t('meos_control_web.hold_strategy_after_count_change')
                },
                {
                    code: 'alg_cooling_machine_mix_enabled',
                    value: i18n.global.t('meos_control_web.yes'),
                    objectId: 'Sy99099900071763042604694458369',
                    objectName: i18n.global.t('meos_control_web.ice_storage_system_virtual'),
                    scene: 'alg',
                    group: 'group_alg_cooling',
                    tab: i18n.global.t('meos_control_web.algorithm_condition_input'),
                    name: i18n.global.t('meos_control_web.allow_big_small_chiller_together'),
                    unit: '/',
                    defaultValues: i18n.global.t('meos_control_web.yes'),
                    step: -1,
                    hint: '',
                    desc: ''
                },
                {
                    code: 'alg_cooling_machine_large_max',
                    value: '0',
                    objectId: 'Sy99099900071763042604694458369',
                    objectName: i18n.global.t('meos_control_web.ice_storage_system_virtual'),
                    scene: 'alg',
                    group: 'group_alg_cooling',
                    tab: i18n.global.t('meos_control_web.algorithm_condition_input'),
                    name: i18n.global.t('meos_control_web.max_chillers_allowed'),
                    unit: i18n.global.t('common.tai'),
                    defaultValues: '0',
                    step: 0,
                    min: 0,
                    max: 0,
                    hint: i18n.global.t('meos_control_web.range_0_to_0'),
                    desc: ''
                },
                {
                    code: 'alg_cooling_machine_small_max',
                    value: '0',
                    objectId: 'Sy99099900071763042604694458369',
                    objectName: i18n.global.t('meos_control_web.ice_storage_system_virtual'),
                    scene: 'alg',
                    group: 'group_alg_cooling',
                    tab: i18n.global.t('meos_control_web.algorithm_condition_input'),
                    name: i18n.global.t('meos_control_web.small_chiller_max_start_limit'),
                    unit: i18n.global.t('common.tai'),
                    defaultValues: '0',
                    step: 0,
                    min: 0,
                    max: 0,
                    hint: i18n.global.t('meos_control_web.range_0_to_0'),
                    desc: ''
                },
                {
                    code: 'alg_cooling_machine_change_timing',
                    value: '60',
                    objectId: 'Sy9909990007191c471ef0284e238c0ee3ffba71eaa5',
                    objectName: '中央供冷系统#003',
                    scene: 'alg',
                    group: 'group_alg_cooling',
                    tab: i18n.global.t('meos_control_web.algorithm_condition_input'),
                    name: i18n.global.t('meos_control_web.chiller_add_remove_mode_hold_time'),
                    unit: 'min',
                    defaultValues: '60',
                    step: 0,
                    min: 0,
                    max: 1440,
                    hint: i18n.global.t('meos_control_web.multiples_of_5_range_0_to_1440'),
                    desc: i18n.global.t('meos_control_web.hold_strategy_after_count_change')
                },
                {
                    code: 'alg_cooling_machine_mix_enabled',
                    value: i18n.global.t('meos_control_web.yes'),
                    objectId: 'Sy9909990007191c471ef0284e238c0ee3ffba71eaa5',
                    objectName: '中央供冷系统#003',
                    scene: 'alg',
                    group: 'group_alg_cooling',
                    tab: i18n.global.t('meos_control_web.algorithm_condition_input'),
                    name: i18n.global.t('meos_control_web.allow_big_small_chiller_together'),
                    unit: '/',
                    defaultValues: i18n.global.t('meos_control_web.yes'),
                    step: -1,
                    hint: '',
                    desc: ''
                },
                {
                    code: 'alg_cooling_machine_large_max',
                    value: '2',
                    objectId: 'Sy9909990007191c471ef0284e238c0ee3ffba71eaa5',
                    objectName: '中央供冷系统#003',
                    scene: 'alg',
                    group: 'group_alg_cooling',
                    tab: i18n.global.t('meos_control_web.algorithm_condition_input'),
                    name: i18n.global.t('meos_control_web.max_chillers_allowed'),
                    unit: i18n.global.t('common.tai'),
                    defaultValues: '2',
                    step: 0,
                    min: 0,
                    max: 2,
                    hint: i18n.global.t('meos_control_web.range_0_to_2'),
                    desc: ''
                },
                {
                    code: 'alg_cooling_machine_small_max',
                    value: '1',
                    objectId: 'Sy9909990007191c471ef0284e238c0ee3ffba71eaa5',
                    objectName: '中央供冷系统#003',
                    scene: 'alg',
                    group: 'group_alg_cooling',
                    tab: i18n.global.t('meos_control_web.algorithm_condition_input'),
                    name: i18n.global.t('meos_control_web.small_chiller_max_start_limit'),
                    unit: i18n.global.t('common.tai'),
                    defaultValues: '1',
                    step: 0,
                    min: 0,
                    max: 1,
                    hint: i18n.global.t('meos_control_web.range_0_to_1'),
                    desc: ''
                },
                {
                    code: 'alg_cooling_machine_change_timing',
                    value: '60',
                    objectId: 'Sy9909990007b5d92e1f013e496d8a3ee7d6124435f6',
                    objectName: '中央供冷系统#004',
                    scene: 'alg',
                    group: 'group_alg_cooling',
                    tab: i18n.global.t('meos_control_web.algorithm_condition_input'),
                    name: i18n.global.t('meos_control_web.chiller_add_remove_mode_hold_time'),
                    unit: 'min',
                    defaultValues: '60',
                    step: 0,
                    min: 0,
                    max: 1440,
                    hint: i18n.global.t('meos_control_web.multiples_of_5_range_0_to_1440'),
                    desc: i18n.global.t('meos_control_web.hold_strategy_after_count_change')
                },
                {
                    code: 'alg_cooling_machine_mix_enabled',
                    value: i18n.global.t('meos_control_web.yes'),
                    objectId: 'Sy9909990007b5d92e1f013e496d8a3ee7d6124435f6',
                    objectName: '中央供冷系统#004',
                    scene: 'alg',
                    group: 'group_alg_cooling',
                    tab: i18n.global.t('meos_control_web.algorithm_condition_input'),
                    name: i18n.global.t('meos_control_web.allow_big_small_chiller_together'),
                    unit: '/',
                    defaultValues: i18n.global.t('meos_control_web.yes'),
                    step: -1,
                    hint: '',
                    desc: ''
                },
                {
                    code: 'alg_cooling_machine_large_max',
                    value: '1',
                    objectId: 'Sy9909990007b5d92e1f013e496d8a3ee7d6124435f6',
                    objectName: '中央供冷系统#004',
                    scene: 'alg',
                    group: 'group_alg_cooling',
                    tab: i18n.global.t('meos_control_web.algorithm_condition_input'),
                    name: i18n.global.t('meos_control_web.max_chillers_allowed'),
                    unit: i18n.global.t('common.tai'),
                    defaultValues: '1',
                    step: 0,
                    min: 0,
                    max: 1,
                    hint: i18n.global.t('meos_control_web.range_0_to_1'),
                    desc: ''
                },
                {
                    code: 'alg_cooling_machine_small_max',
                    value: '1',
                    objectId: 'Sy9909990007b5d92e1f013e496d8a3ee7d6124435f6',
                    objectName: '中央供冷系统#004',
                    scene: 'alg',
                    group: 'group_alg_cooling',
                    tab: i18n.global.t('meos_control_web.algorithm_condition_input'),
                    name: i18n.global.t('meos_control_web.small_chiller_max_start_limit'),
                    unit: i18n.global.t('common.tai'),
                    defaultValues: '1',
                    step: 0,
                    min: 0,
                    max: 1,
                    hint: i18n.global.t('meos_control_web.range_0_to_1'),
                    desc: ''
                }
            ]
        }
    ]
};
testData2.children.forEach(child => {
    const objectNameMap = {};
    child.items.forEach(it => {
        if (!it.objectId) it.objectId = '_';
        if (!it.objectName) it.objectName = '_';

        if (!objectNameMap[it.objectId])
            objectNameMap[it.objectId] = {
                objectName: it.objectName,
                objectId: it.objectId,
                items: []
            };
        objectNameMap[it.objectId].items.push(it);
    });
    child.items = Object.values(objectNameMap);
});

const batchEditData = ref(testData2.children);

const tabs = computed(() => {
    if (batchEditData.value?.length > 1) {
        return batchEditData.value.map(g => {
            return {
                id: g.groupName,
                name: g.groupName,
                ...g
            };
        });
    }
    return [];
});
const currentGroup = ref(tabs.value[0]);
const selectedTab = ref(tabs.value[0]?.id);
const changeTabs = select => {
    currentGroup.value = select;
};

const emit = defineEmits(['update:show']);

const close = () => {
    emit('update:show', false);
};
</script>
<style lang="less">
.shell-config-batch-editing {
    .m-modal-main {
        position: absolute !important;
        top: 50% !important;
        left: 50% !important;
        width: 1260px !important;
        height: calc(100vh - 120px) !important;
        transform: translate(-50%, -50%) !important;
        .m-scrollbar {
            height: calc(100% - 120px);
        }
    }
}
</style>
<style lang="less" scoped></style>
