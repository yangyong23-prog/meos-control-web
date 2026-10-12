<template>
    <div v-if="currentItem" class="acequip-card-wrap">
        <EquipmentCardItem :item="currentItem" />
        <div v-if="!sideLayout" class="ac-paginator-wrap">
            <Paginator v-model="currentIndex" :total-pages="statisticsList?.length" />
        </div>
    </div>
</template>
<script setup>
import Paginator from './Paginator.vue';
import EquipmentCardItem from './EquipmentCardItem.vue';

const emits = defineEmits(['change']);
const currentIndex = ref(0);

const props = defineProps({
    statisticsList: {
        type: Object,
        default: () => {}
    }
});
const currentItem = computed(() => {
    if (props.statisticsList?.length > 0) {
        return props.statisticsList[currentIndex.value];
    }
    return null;
});
watch(
    currentIndex,
    () => {
        emits('change', currentItem.value);
    },
    { immediate: true }
);
</script>
<style lang="less" scoped>
.acequip-card-wrap {
    margin-top: 10px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    &.acequip-side-layout {
        .aceuip-card-bottom {
            grid-template-columns: repeat(3, 132px);
        }
    }
    .ac-paginator-wrap {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
    }
}

.loading-wrap {
    margin-top: 20px;
    width: 100%;
    display: flex;
    flex-direction: column;
}
</style>
