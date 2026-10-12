<template>
    <div class="close-text">
        <span>{{ i18n.global.t('meos_control_web.upcoming_shutdown_time_colon') }}</span>
        {{ currentInfoCodeObject.aboutCloseTime || '--' }}
    </div>
</template>

<script lang="ts" setup>
// @ts-ignore
import i18n from '@/localization';
import { Ref } from 'vue';
import { IOTObject } from '../../../types';

const currentInfoCodeObject: Ref<IOTObject> = inject('currentInfoCodeObject')!;
</script>

<style lang="less" scoped>
.close-text {
    span {
        color: var(--gray-600);
    }
}
</style>
