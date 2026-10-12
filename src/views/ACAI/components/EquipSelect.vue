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
            <template #nodeSlot="node">
                <div
                    :class="{
                        'custom-select-node': true,
                        'is-active': selectValue === node.id
                    }"
                >
                    <span>{{ node.name }}</span>
                    <m-popover :width="336 + 'px'" :show-arrow="false" theme="darkTransparent" placement="right-start" :content="tips">
                        <svg v-if="node.id === 1" class="custom-tips-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M13.4168 6.99992C13.4168 10.5437 10.544 13.4166 7.00016 13.4166C3.45634 13.4166 0.583496 10.5437 0.583496 6.99992C0.583496 3.45609 3.45634 0.583252 7.00016 0.583252C10.544 0.583252 13.4168 3.45609 13.4168 6.99992ZM1.75016 6.99992C1.75016 9.89941 4.10067 12.2499 7.00016 12.2499C9.89966 12.2499 12.2502 9.89941 12.2502 6.99992C12.2502 4.10042 9.89966 1.74992 7.00016 1.74992C4.10067 1.74992 1.75016 4.10042 1.75016 6.99992Z"
                                fill="currentColor"
                            />
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M6.08601 10.4877C6.89372 10.4877 7.37397 9.9561 7.84552 9.26691C7.84552 9.18472 7.87422 8.96786 7.85642 8.8449L7.22917 9.57997C7.09877 9.71859 6.93731 9.81583 6.86032 9.78956C6.78974 9.76502 6.74779 9.68782 6.76211 9.61179L7.8087 6.24617C7.89552 5.81855 7.65885 5.43008 7.15902 5.38039C6.63291 5.38039 5.85796 5.92424 5.38576 6.61343C5.38576 6.69618 5.37081 6.90078 5.38811 7.02373L6.016 6.2881C6.14576 6.14949 6.29632 6.05281 6.37267 6.07907C6.44966 6.10534 6.49218 6.19308 6.4669 6.27528L5.42771 9.62461C5.3077 10.016 5.53454 10.4005 6.08601 10.4877Z"
                                fill="currentColor"
                            />
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M7.41843 3.49992C7.29774 3.50261 7.17974 3.53425 7.06442 3.59484C6.94909 3.65543 6.85791 3.74362 6.79086 3.85941C6.72381 3.97521 6.69096 4.0984 6.6923 4.22901C6.69364 4.35961 6.72649 4.48146 6.79086 4.59456C6.85523 4.70766 6.94306 4.79652 7.05436 4.86115C7.16566 4.92578 7.28702 4.95809 7.41843 4.95809C7.54716 4.96079 7.66852 4.92915 7.7825 4.86317C7.89648 4.7972 7.98566 4.70766 8.05002 4.59456C8.11439 4.48146 8.14791 4.35894 8.15059 4.22699C8.15059 4.09773 8.11707 3.97521 8.05002 3.85941C7.98297 3.74362 7.89045 3.65476 7.77244 3.59282C7.65444 3.53089 7.53644 3.49992 7.41843 3.49992Z"
                                fill="currentColor"
                            />
                        </svg>
                    </m-popover>
                </div>
            </template>
        </m-select>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { getListEquipmentsToModuleView } from '@/apis/public';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { isMachineRoomCF } from '@/views/GraphMVC/utils/classCodeJudge';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import { SYSTEM_CLASSCODE } from '@/views/ACAI/variables';

const props = defineProps({
    spaceId: {
        type: String,
        default: ''
    },
    systemId: {
        type: String,
        default: ''
    },
    systemEquipsIds: {
        type: Array,
        default: () => []
    },
    isChartBaseSystem: {
        type: Boolean,
        default: true
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

const emits = defineEmits(['selectChange', 'allData', 'init']);

const tips = i18n.global.t('meos_control_web.system_associated_devices_tips');

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

const getParams = (spaceId, systemId) => {
    const rst = {
        filterEquipmentInSpaceIds: [spaceId],
        withColumns: ['floorId', 'bimLocation', 'className']
    };
    if (systemId) {
        rst.filterEquipmentInSystemIds = [systemId];
    }
    return rst;
};
watch(
    [() => props.spaceId],
    () => {
        emits('init');
        // 过滤
        emits('selectChange', []);
        selectValue.value = 1;
        selectOptions.value = [];
        const withColumns = ['floorId', 'bimLocation', 'className'];
        if (props.spaceId && props.systemId) {
            c1.cancelQuest();
            c2.cancelQuest();
            c3.cancelQuest();
            // 关系图基准对象是设备时，增加传参 equipmentIdsInGraph
            const equipmentIdsInGraph = props.isChartBaseSystem ? undefined : props.systemEquipsIds ?? [];

            const p1Parms = getParams(props.spaceId);
            const p2Parms = getParams(props.spaceId, props.systemId);
            const p3Parms = p1Parms;
            const p1 = getListEquipmentsToModuleView(SYSTEM_CLASSCODE, 'SYSTEM_RELATED_EQUIPMENT', p1Parms, { cancelToken: c1.cancelToken() });
            const p2 = getListEquipmentsToModuleView(SYSTEM_CLASSCODE, 'EQUIPMENT_IN_SYSTEM', p2Parms, { cancelToken: c2.cancelToken() });
            const p3 = getListEquipmentsToModuleView(SYSTEM_CLASSCODE, 'EQUIPMENT_IN_SPACE', p3Parms, { cancelToken: c3.cancelToken() });
            // 过滤土建等设备
            const filterFun = e => !isMachineRoomCF(e.classCode);
            const addObjType = e => {
                return { ...e, objType: 'equipment' };
            };
            Promise.allSettled([p1, p2, p3]).then(([{ value: v1 }, { value: v2 }, { value: v3 }]) => {
                selectOptions.value = [
                    {
                        id: 1,
                        name: i18n.global.t('meos_control_web.system_related_equipment'),
                        data: (v1 && v1.code === SUCCESSCODE ? v1.data : []).filter(filterFun).map(addObjType)
                    },
                    {
                        id: 2,
                        name: i18n.global.t('meos_control_web.system_equipment'),
                        data: (v2 && v2.code === SUCCESSCODE ? v2.data : []).filter(filterFun).map(addObjType)
                    },
                    {
                        id: 3,
                        name: i18n.global.t('meos_control_web.all_equipment_in_machine_room'),
                        data: (v3 && v3.code === SUCCESSCODE ? v3.data : []).filter(filterFun).map(addObjType)
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

<style lang="less" scoped>
:deep(.m-popper-trigger) {
    display: flex;
    align-items: center;
}
.custom-select-node {
    display: flex;
    align-items: center;
    gap: 3px;
}

.custom-tips-icon {
    color: #8b949e;
}

.is-active {
    .custom-tips-icon {
        color: #246fe5;
    }
}
</style>
