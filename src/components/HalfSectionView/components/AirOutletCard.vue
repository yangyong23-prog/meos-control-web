<template>
    <div v-show="infoItems?.length > 0" class="air-outlet-card" :class="{ 'some-has-intervention': someHasIntervention }">
        <div v-for="info in infoItems" :key="info.objectId + info.infoCode" class="card-item">
            <div class="item fc w100">
                <div class="title">{{ info.name ?? '' }}:</div>
                <div class="content">{{ itemValueText(getIotData(info.objectId, info.infoCode)) }}</div>
            </div>
            <div v-if="hasIntervention(info)" class="tags-container">
                <m-tag color="#E68600" size="small" bg-color="#FFF0CC">{{ i18n.global.t('meos_control_web.manual_intervention1') }}</m-tag>
            </div>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import responsiveDock from '@/hooks/responsiveDock';
import { itemValueText } from '@/components/HalfSectionView/utils';
const props = defineProps({
    data: {
        type: Object,
        default: () => {}
    },
    equipId: {
        type: String,
        default: ''
    }
});

const { getIotData } = responsiveDock.getInstance();

const isObjManualMode = objId => {
    const manualAutoStatusInfo = getIotData(objId, 'manualAutoStatus');
    return manualAutoStatusInfo?.dataValue === '1';
};
const isMainObjManualMode = computed(() => {
    return isObjManualMode(props.equipId);
});
// 单个信息点是否有干预
const hasIntervention = info => {
    const isManualMode = info.objectId === props.equipId ? isMainObjManualMode.value : isObjManualMode(info.objectId);

    if (isManualMode) {
        const targetInfo = info.relInfoCodeConfigs?.find(info => true);
        if (targetInfo) {
            const curInfoData = getIotData(info.objectId, targetInfo.infoCode);

            return !!curInfoData?.additionalMapValue?.recoveryDateTime;
        }
    }
    return false;
};

const infoItems = computed(() => {
    return props.data?.infoList;
});

// 整体是否有干预
const someHasIntervention = computed(() => {
    return infoItems.value?.some(hasIntervention);
});
</script>
<style lang="less" scoped>
.air-outlet-card {
    position: absolute;

    display: flex;
    padding: 12px 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;

    white-space: nowrap;

    border-radius: 8px;
    border: 1px solid var(--Grey-Grey-0-Text, #fff);
    background: #e3eff9;
    box-shadow: 0 12px 17.1px 0 rgba(184, 203, 234, 0.15);

    &.some-has-intervention {
        background: #f1eadb;
        box-shadow: 0 10.849px 15.459px 0 rgba(204, 204, 204, 0.15);
    }

    .card-item {
        display: flex;
        align-items: center;
        gap: 4px;
        align-self: stretch;

        align-items: flex-start;

        .item {
            display: flex;
            width: max-content;
            align-items: flex-start;
            gap: 4px;
            flex: 1 0 auto;
        }
        .title {
            max-width: 160px;
            white-space: break-spaces;
            color: var(--Grey-Grey-600, #626c78);
            font-weight: 400;
        }
        .content {
            color: var(--Grey-Grey-900, #1b2129);
            font-weight: 400;
        }
        .tags-container {
            margin-top: -2px;
            width: 100%;
            justify-content: center;
            display: flex;
            align-items: center;
        }
    }
}
</style>
