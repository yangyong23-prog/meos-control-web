<template>
    <div>
        <m-select
            v-model="selectValue"
            :prefix="i18n.global.t('meos_control_web.equipment_scope_colon')"
            :style="{ visibility: selectOptions?.length > 0 ? 'visible' : 'hidden' }"
            :options="selectOptions"
            :size="size"
            :max-width="maxWidth"
        >
        </m-select>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { getlistEquipmentsToModuleView } from '@/apis/ACAC';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { isMachineRoomCF } from '@/views/GraphMVC/utils/classCodeJudge';
import UseCancelTokenHooks from '../../../../hooks/UseCancelTokenHooks';

const props = defineProps({
    spaceId: {
        type: String,
        default: null
    },
    systemId: {
        type: String,
        default: null
    },
    size: {
        type: String,
        default: 'medium'
    },
    maxWidth: {
        type: Number,
        default: 100
    }
});

const emits = defineEmits(['selectChange', 'allData']);

const selectValue = ref(1);
const selectOptions = ref();

const c1 = UseCancelTokenHooks();
const c2 = UseCancelTokenHooks();
const c3 = UseCancelTokenHooks();

watch([selectValue, selectOptions], () => {
    if (selectOptions.value) {
        const { data } = selectOptions.value.find(s => s.id === selectValue.value) || {};
        emits('selectChange', data);
    }
});
watch(
    [() => props.spaceId, () => props.systemId],
    () => {
        // 过滤
        emits('selectChange', []);
        selectValue.value = 1;
        selectOptions.value = [];
        const withColumns = ['floorId', 'bimLocation', 'className'];
        if (props.spaceId && props.systemId) {
            c1.cancelQuest();
            c2.cancelQuest();
            c3.cancelQuest();
            const p1 = getlistEquipmentsToModuleView(
                'SYSTEM_RELATED_EQUIPMENT',
                {
                    filterEquipmentInSpaceIds: [props.spaceId],
                    withColumns
                },
                { cancelToken: c1.cancelToken() }
            );
            const p2 = getlistEquipmentsToModuleView(
                'EQUIPMENT_IN_SYSTEM',
                {
                    filterEquipmentInSystemIds: [props.systemId],
                    filterEquipmentInSpaceIds: [props.spaceId],
                    withColumns
                },
                { cancelToken: c2.cancelToken() }
            );
            const p3 = getlistEquipmentsToModuleView(
                'EQUIPMENT_IN_SPACE',
                {
                    filterEquipmentInSpaceIds: [props.spaceId],
                    withColumns
                },
                { cancelToken: c3.cancelToken() }
            );
            // 过滤土建等设备
            const filterFun = e => !isMachineRoomCF(e.classCode);
            Promise.allSettled([p1, p2, p3]).then(([{ value: v1 }, { value: v2 }, { value: v3 }]) => {
                selectOptions.value = [
                    {
                        id: 1,
                        name: i18n.global.t('meos_control_web.system_related_equipment'),
                        data: (v1 && v1.code === SUCCESSCODE ? v1.data : []).filter(filterFun)
                    },
                    {
                        id: 2,
                        name: i18n.global.t('meos_control_web.system_equipment'),
                        data: (v2 && v2.code === SUCCESSCODE ? v2.data : []).filter(filterFun)
                    },
                    {
                        id: 3,
                        name: i18n.global.t('meos_control_web.all_equipment_in_machine_room'),
                        data: (v3 && v3.code === SUCCESSCODE ? v3.data : []).filter(filterFun)
                    }
                ];

                const uniqueData = Array.from(
                    selectOptions.value
                        .flatMap(item => item.data)
                        .reduce((map, item) => map.set(item.id, item), new Map())
                        .values()
                );

                emits('allData', uniqueData);
            });
        }
    },
    {
        immediate: true
    }
);
</script>

<style lang="scss" scoped></style>
