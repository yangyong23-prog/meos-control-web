<template>
    <div class="abnormal-statistics-item">
        <div class="water-icon">
            <svg v-if="iconType === 'super-high'" xmlns="http://www.w3.org/2000/svg" width="26" height="40" viewBox="0 0 26 40" fill="none">
                <path
                    d="M0 3C0 1.34315 1.34315 0 3 0H23C24.6569 0 26 1.34315 26 3V37C26 38.6569 24.6569 40 23 40H3C1.34315 40 0 38.6569 0 37V3Z"
                    fill="url(#paint0_linear_1736_10500)"
                />
                <path
                    d="M26 40L26 7.40002C23.0351 8.46121 18.3882 10.4899 12.9145 7.8653C9.34532 6.15393 2.90791 6.649 1.34167e-05 7.40001L0 40H26Z"
                    fill="url(#paint1_linear_1736_10500)"
                />
                <defs>
                    <linearGradient id="paint0_linear_1736_10500" x1="13" y1="0" x2="13" y2="26.5" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#FFD1A9" stop-opacity="0.6" />
                        <stop offset="1" stop-color="#FFE3C2" />
                    </linearGradient>
                    <linearGradient id="paint1_linear_1736_10500" x1="0.469448" y1="40" x2="27.5575" y2="36.601" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#FFB777" />
                        <stop offset="1" stop-color="#FF8419" stop-opacity="0.2" />
                    </linearGradient>
                </defs>
            </svg>
            <svg v-if="iconType === 'high'" xmlns="http://www.w3.org/2000/svg" width="26" height="40" viewBox="0 0 26 40" fill="none">
                <path
                    d="M0 3C0 1.34315 1.34315 0 3 0H23C24.6569 0 26 1.34315 26 3V37C26 38.6569 24.6569 40 23 40H3C1.34315 40 0 38.6569 0 37V3Z"
                    fill="url(#paint0_linear_1736_10506)"
                />
                <path
                    d="M26 40L26 16C23.0351 17.0612 18.3882 19.0898 12.9145 16.4653C9.34532 14.7539 2.90791 15.249 1.34167e-05 16L0 40H26Z"
                    fill="url(#paint1_linear_1736_10506)"
                />
                <defs>
                    <linearGradient id="paint0_linear_1736_10506" x1="13" y1="0" x2="13" y2="26.5" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#FFD1A9" stop-opacity="0.6" />
                        <stop offset="1" stop-color="#FFE3C2" />
                    </linearGradient>
                    <linearGradient id="paint1_linear_1736_10506" x1="0.469448" y1="40" x2="27.2184" y2="35.4745" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#FFB777" />
                        <stop offset="1" stop-color="#FF8419" stop-opacity="0.2" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
        <div :class="['water-statistics', [iconType]]">
            <div v-ellipsis :ellipsis-disabled="count?.toString()?.length < 5" :class="['water-count', 'm-ellipsis', 'ffCustom-M']">
                {{ count }}
            </div>
            <div class="water-title">{{ iconTypeTitleMap[iconType] || '--' }}</div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
defineProps({
    iconType: {
        type: String,
        default: ''
    },
    count: {
        type: Number,
        default: 0
    }
});

const iconTypeTitleMap = {
    'super-high': i18n.global.t('meos_control_web.ultra_high_level'),
    high: i18n.global.t('meos_control_web.high_level')
};
</script>

<style lang="less" scoped>
.abnormal-statistics-item {
    display: flex;
    align-items: center;
    column-gap: 12px;
    height: 100%;
}

.water-icon {
    display: flex;
    align-items: flex-end;
    height: 100%;
}

.water-statistics {
    height: 100%;
    display: flex;
    width: fit-content;
    flex-direction: column;
    row-gap: 8px;
}

.water-count {
    font-size: 28px;
    font-style: normal;
    font-weight: 700;
    line-height: 100%;
    width: 70px;
    max-width: 70px;
}

.super-high {
    .water-count {
        color: #ff8419;
    }
}

.high {
    .water-count {
        color: #ff8419;
    }
}

.water-title {
    color: @grey-600;
    font-size: 14px;
    font-style: normal;
    font-weight: var(--platform-font-weight);
    line-height: 100%;
}
</style>
