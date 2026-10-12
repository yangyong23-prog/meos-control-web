<template>
    <div class="right-actions">
        <EquipSelect
            :max-width="maxWidth"
            size="auto"
            :space-id="props.spaceId"
            :system-id="props.systemId"
            @init="handleInit"
            @select-change="handleEquipSelectChange"
            @all-data="handleEquipAllChange"
        ></EquipSelect>
        <m-select
            v-if="!!props?.mapSpaceList?.length"
            ref="select"
            v-model="curSelectSpaceId"
            :max-width="maxWidth"
            size="auto"
            :options="props.mapSpaceList"
            :prefix="i18n.global.t('meos_control_web.current_machine_room_colon')"
        ></m-select>
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
</style>
