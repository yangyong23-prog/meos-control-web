<template>
    <div
        class="info-card"
        :data="item.code"
        :class="{ hovered: hovered, 'some-has-intervention': someHasIntervention }"
        @mouseenter="emit('onHover')"
        @mouseleave="emit('unHover')"
    >
        <div v-for="(info, index) in item.cardInfoList" :key="index" class="info-card-item">
            <div class="info-item">
                <div class="title">{{ info.infoCodeName }}:</div>
                <div class="content">{{ itemValueText(getIotData(equipId, info.infoCode)) }}</div>
            </div>
            <div v-if="hasIntervention(info)" class="tags-container">
                <m-tag color="#E68600" size="small" bg-color="#FFF0CC">{{ i18n.global.t('meos_control_web.manual_intervention1') }}</m-tag>
            </div>
        </div>
        <div class="arrow" :class="hovered ? 'hovered' : ''" :data-placement="item?.infoCard?.placement" :style="arrowStyle"></div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import responsiveDock from '@/hooks/responsiveDock';
import { itemValueText } from '@/components/HalfSectionView/utils';
const props = defineProps({
    equipId: { type: String, default: '' },
    item: { type: Object, default: () => ({}) },
    hovered: { type: Boolean, default: false }
});
const emit = defineEmits(['onHover', 'unHover']);

const { getIotData } = responsiveDock.getInstance();

const isManualMode = computed(() => {
    const manualAutoStatusInfo = getIotData(props.equipId, 'manualAutoStatus');

    return manualAutoStatusInfo?.dataValue === '1';
});
// 单个信息点是否有干预
const hasIntervention = info => {
    if (isManualMode.value) {
        const targetInfo = info.relInfoCodeConfigs?.find(info => true);
        if (targetInfo) {
            const curInfoData = getIotData(props.equipId, targetInfo.infoCode);

            return !!curInfoData?.additionalMapValue?.recoveryDateTime;
        }
    }
    return false;
};

// 整体是否有干预
const someHasIntervention = computed(() => {
    return props.item.cardInfoList.some(hasIntervention);
});
const arrowStyle = computed(() => {
    const placement = props.item?.infoCard?.placement;
    if (placement) {
        let left = 0,
            top = 0,
            transform = 'translate(-50%, -50%) rotate(45deg) ';
        switch (placement) {
            case 'top':
                left = '50%';
                top = 'calc(100% + 1px)';

                break;
            case 'bottom':
                left = '50%';
                top = '-1px';
                break;
            case 'right':
                left = '-1px';
                top = '50%';
                break;
            case 'left':
                left = 'calc(100% + 1px)';
                top = '50%';
                break;
            default:
        }
        return {
            top,
            left,
            transform
        };
    }
    return {
        top: '0',
        left: '0'
    };
});
</script>
<style lang="less" scoped>
.info-card {
    position: absolute;
    display: flex;
    padding: 8px;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    // white-space: nowrap;

    border-radius: 4px;
    border: 1px solid var(--Grey-Grey-0-Text, #fff);
    background: #fff;
    // box-shadow: 0 12px 17.1px 0 rgba(204, 204, 204, 0.15);
    /* Shadow/shadow-1 */
    box-shadow: 0px 2px 10px rgba(27, 33, 41, 0.1);

    &.hovered {
        z-index: 10;
        border: 1px solid var(--Palette-Blue-500, #246fe5);
        background: var(--Palette-Blue-50, #ebf6ff);
        box-shadow: 0 12px 17.1px 0 rgba(204, 204, 204, 0.15);
    }
    &.some-has-intervention {
        background: #f1eadb;
        box-shadow: 0 10.849px 15.459px 0 rgba(204, 204, 204, 0.15);
    }
    .info-card-item {
        position: relative;
        display: flex;
        // flex-direction: column;
        align-items: flex-start;
        gap: 8px;
        z-index: 2;
        .info-item {
            display: flex;
            width: max-content;
            align-items: flex-start;
            flex: 1 0 auto;
            gap: 4px;
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
        }
        .tags-container {
            margin-top: -2px;
            width: 100%;
            justify-content: center;
            display: inline-flex;
            align-items: center;
        }
    }
    .arrow[data-placement^='top'] {
        border-top-color: transparent;
        border-left-color: transparent;
        &.hovered {
            border-bottom: 1px solid var(--Palette-Blue-500, #246fe5);
            border-right: 1px solid var(--Palette-Blue-500, #246fe5);
        }
    }

    .arrow[data-placement^='bottom'] {
        border-bottom-color: transparent;
        border-right-color: transparent;
        &.hovered {
            border-top: 1px solid var(--Palette-Blue-500, #246fe5);
            border-left: 1px solid var(--Palette-Blue-500, #246fe5);
        }
    }

    .arrow[data-placement^='right'] {
        border-top-color: transparent;
        border-right-color: transparent;
        &.hovered {
            border-bottom: 1px solid var(--Palette-Blue-500, #246fe5);
            border-left: 1px solid var(--Palette-Blue-500, #246fe5);
        }
    }

    .arrow[data-placement^='left'] {
        border-bottom-color: transparent;
        border-left-color: transparent;
        &.hovered {
            border-top: 1px solid var(--Palette-Blue-500, #246fe5);
            border-right: 1px solid var(--Palette-Blue-500, #246fe5);
        }
    }

    .arrow {
        position: absolute;
        width: 8px;
        height: 8px;
        transform: rotate(45deg);
        background-color: inherit;
        z-index: 1;
        &.hovered {
            background-color: #ebf6ff;
        }
    }
}
</style>
