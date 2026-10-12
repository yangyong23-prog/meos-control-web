<template>
    <div class="right-actions">
        <EquipSelect
            :max-width="maxWidth"
            size="auto"
            :space-id="props.spaceId"
            :system-id="props.systemId"
            :system-equips-ids="props.systemEquipsIds"
            :is-chart-base-system="props.isChartBaseSystem"
            @init="handleInit"
            @select-change="handleEquipSelectChange"
            @all-data="handleEquipAllChange"
        ></EquipSelect>
        <m-select
            v-if="(props.mapSpaceList?.length ?? 0) > 1"
            ref="select"
            v-model="curSelectSpaceId"
            :max-width="maxWidth"
            size="auto"
            :options="props.mapSpaceList"
            :prefix="i18n.global.t('meos_control_web.current_machine_room_colon')"
        ></m-select>
        <div v-if="props?.mapSpaceList?.length === 1" class="map-space-name">
            <span class="label">{{ i18n.global.t('meos_control_web.current_machine_room_colon') }}</span>
            <span v-ellipsis class="m-ellipsis name">{{ props?.mapSpaceList[0]?.localName ?? '--' }}</span>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import EquipSelect from './EquipSelect.vue';

const props = defineProps({
    spaceId: {
        type: String,
        default: null
    },
    systemId: {
        type: String,
        default: null
    },
    mapSpaceList: {
        type: Array,
        default: () => []
    },
    systemEquipsIds: {
        type: Array,
        default: () => []
    },
    isChartBaseSystem: {
        type: Boolean,
        default: true
    }
});

const emits = defineEmits(['equip-init', 'equip-select-change', 'equip-all-change', 'space-select-change']);
const curSelectSpaceId = ref('');

const handleInit = () => {
    emits('equip-init');
};
const handleEquipSelectChange = data => {
    emits('equip-select-change', data);
};

const handleEquipAllChange = data => {
    emits('equip-all-change', data);
};
const handleSpaceSelectChange = data => {
    emits('space-select-change', data);
};

watchEffect(() => {
    curSelectSpaceId.value = props.spaceId;
});

watchEffect(() => {
    handleSpaceSelectChange(curSelectSpaceId.value);
});

const maxWidth = ref(130);
let resizeObserver = null;
onMounted(() => {
    resizeObserver = new ResizeObserver(([{ contentRect }]) => {
        const { width } = contentRect;
        if (width < 1440) {
            maxWidth.value = 32;
        } else if (width > 1600) {
            maxWidth.value = 132;
        } else {
            maxWidth.value = 72;
        }
    });

    resizeObserver.observe(document.body);
});
onUnmounted(() => {
    resizeObserver?.stop?.();
});
</script>

<style lang="less" scoped>
.right-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 100%;
}

.map-space-name {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    .label {
        color: var(--Grey-Grey-0, #fff);
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px; /* 157.143% */
        opacity: 0.8;
        min-width: fit-content;
    }
    .name {
        overflow: hidden;
        color: var(--Grey-Grey-0, #fff);
        text-overflow: ellipsis;

        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: 22px;

        max-width: 500px;
    }
}
</style>
