<template>
    <div class="info-codes" :class="{ oneInfoCode: relInfoCodeConfigs?.length === 1 }">
        <template v-for="value in relInfoCodeConfigs" :key="value.infoCode">
            <div class="info-code-item" :class="{ 'is-active': value.infoCode === currentInfoCode, [value.infoCode]: true }">
                <div v-if="specialInfoCodes.includes(value.infoCode)" class="info-code-tag">
                    <slot :name="value.infoCode + 'Tag'" :data="value" :get-info-data="getInfoData">
                        <m-tag v-if="getInfoData(value)?.dataValue?.manualAutoSet + '' === IS_MANUAL" color="#E68600" bg-color="#FFF0CC" size="small">
                            {{ i18n.global.t('meos_control_web.manual1') }}
                        </m-tag>
                        <m-tag v-if="getInfoData(value)?.dataValue?.manualAutoSet + '' === IS_AUTO" color="#683BD6" bg-color="#F1E5FE" size="small">
                            {{ i18n.global.t('meos_control_web.auto') }}
                        </m-tag>
                    </slot>
                </div>
                <div v-ellipsis class="info-code-name m-ellipsis">{{ value.infoCodeName || value.infoCode }}</div>
                <div class="info-code-value fc">
                    <span v-if="!specialInfoCodes.includes(value.infoCode)" style="margin-right: 4px">
                        <span class="value-text" style="margin-right: 4px">{{ getValueStr(getInfoData(value)).text }}</span>
                    </span>
                    <slot v-else :name="value.infoCode" :data="getInfoData(value)" :get-info-data="getInfoData">
                        <span style="margin-right: 4px">
                            <span class="value-text" style="margin-right: 4px">{{ getInfoData(value).infoCodeValue ?? '--' }}</span>
                            <span class="value-unit">{{ getInfoData(value).unit }}</span>
                        </span>
                    </slot>
                    <SetButton type="link" @click="e => onOpenForm(e, value)">{{ i18n.global.t('common.edit') }}</SetButton>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import SetButton from '@/components/common/SetButton.vue';
import { getValueStr } from '@/utils/viewUtils';
import { IS_AUTO, IS_MANUAL } from '@/utils/globalVariables';

const props = defineProps({
    relInfoCodeConfigs: {
        type: Array,
        default: () => []
    },
    specialInfoCodes: {
        type: Array,
        default: () => []
    },
    currentInfoCode: {
        type: String,
        default: ''
    },
    getInfoData: {
        type: Function,
        default: () => ({})
    },
    onOpenForm: {
        type: Function,
        default: () => {}
    }
});
</script>

<style lang="less" scoped>
.info-codes {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    background-color: var(--gray-50);
    border-radius: 8px;
    padding: 8px;
    &.oneInfoCode {
        grid-template-columns: repeat(1, 1fr);
    }
    .info-code-title {
        grid-column: 1 / -1;
    }
    .info-code-item {
        border-radius: 4px;
        padding: 8px;
        .info-code-name {
            color: var(--gray-600);
            margin-bottom: 4px;
        }
        &.is-active {
            .info-code-value {
                :deep(.m-button) {
                    display: inline-flex;
                }
            }
        }
        &:hover {
            background-color: var(--alpha-30);
            .info-code-value {
                :deep(.m-button) {
                    display: inline-flex;
                }
            }
        }
        .info-code-value {
            height: 32px;
            :deep(.m-button) {
                display: none;
            }
        }
    }
}
</style>
