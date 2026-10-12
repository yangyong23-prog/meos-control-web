<template>
    <div class="group-cards-container">
        <TitlePrefix :title="props.title" :font-size="18" :line-height="24" class="mb12" />
        <template v-if="props.loading"> <m-list-skeleton class="loading-container" :item-num="4" /> </template>
        <div v-else-if="props.cards.length" class="cards-wrapper">
            <div v-for="(card, index) in props.cards" :key="index" class="card-info-wrapper">
                <slot v-if="$slots.cardItem" name="cardItem"></slot>
                <template v-else>
                    <div v-if="card?.groupName" class="card-title">{{ card.groupName }}</div>
                    <CardRunningParams
                        :select-obj-id="props.selectObjId"
                        :rel-info-code-configs="card?.relInfoCodeConfigs"
                        :without-info-code="withoutInfoCode"
                    ></CardRunningParams>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup>
import TitlePrefix from '@/components/title-prefix/index.vue';
import CardRunningParams from './CardRunningParams.vue';

const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    cards: {
        type: Array,
        default: () => []
    },
    selectObjId: {
        type: String,
        default: ''
    },
    withoutInfoCode: {
        type: Boolean,
        default: false
    },
    loading: {
        type: Boolean,
        default: false
    }
});
</script>

<style lang="less" scoped>
.loading-container {
    margin-top: 8px;
}
.cards-wrapper {
    margin-top: 8px;
    display: flex;
    flex-direction: column;
    row-gap: 8px;
    margin-bottom: 16px;
}

.card-info-wrapper {
    display: flex;
    padding: 12px;
    flex-direction: column;
    gap: 12px;

    border-radius: 4px;
    background: var(--gray-50, #f7f9fa);
}

.card-title {
    color: var(--gray-900, #1f2429);
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 22px;
}
</style>
