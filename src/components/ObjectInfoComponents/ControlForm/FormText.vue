<template>
    <div class="tips-item mb16" :style="data.style">
        <template v-if="data.defaultText">
            {{ data.defaultText }}
        </template>
        <template v-else>
            <div class="f mb16">
                <span>{{ data.infoCodeName }}</span>
                <m-popover :content="i18n.global.t('meos_control_web.auto_cooling_tower_outlet_temp_min_applied')" theme="darkTransparent" :show-arrow="false">
                    <div class="fcc ml4 bgc">
                        <IconMeriActionTips style="cursor: pointer" />
                    </div>
                </m-popover>
            </div>
            <div class="f12 ft">{{ data.defaultValue }}={{ i18n.global.t('meos_control_web.outdoor_wb_plus_ct_approach') }}</div>
            <div v-if="data.isStation" class="f12 mt8" style="color: #e68600">{{ i18n.global.t('meos_control_web.outdoor_wb_temp_missing_cannot_adjust') }}</div>
        </template>
    </div>
</template>

<script setup lang="ts">
import i18n from '@/localization';
import { IconMeriActionTips } from 'meri-icon';
import type { CSSProperties } from 'vue';

interface TextSetData {
    defaultText?: string;
    infoCodeName: string;
    defaultValue?: string;
    style?: CSSProperties;
    isStation?: boolean;
}

interface Props {
    data?: TextSetData;
}

withDefaults(defineProps<Props>(), {
    data: () => ({ infoCodeName: '' }),
    isStation: false
});
</script>

<style scoped lang="less">
.bgc {
    padding: 1px;
}
.bgc:hover {
    border-radius: 2px;
    background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
    padding: 1px;
}
.tips-item {
    padding: 8px;
    border-radius: 8px;
    background: var(--gray-100);
}
</style>
