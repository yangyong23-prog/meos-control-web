<template>
    <m-popover>
        <template #content>
            <div class="control-item">{{ i18n.global.t('meos_control_web.configuration_manually_adjusted') }}</div>
            <div class="control-item" style="color: #626c78">{{ i18n.global.t('meos_control_web.valid_until') }}</div>
            <div class="control-item" style="margin-top: 4px">2023.08.18-2023.08.24</div>
            <div class="control-item fcc">
                <m-button>{{ i18n.global.t('meos_control_web.release_adjustment') }}</m-button>
            </div>
        </template>
        <m-tag color="#D72824" bg-color="#FFE6E5" size="small">{{ i18n.global.t('meos_control_web.adjust') }}</m-tag>
    </m-popover>
</template>

<script lang="ts" setup></script>
<style lang="less" scoped>
.m-tag {
    margin-left: 4px;
}
.control-item {
    & + .control-item {
        margin-top: 12px;
    }
}
</style>
