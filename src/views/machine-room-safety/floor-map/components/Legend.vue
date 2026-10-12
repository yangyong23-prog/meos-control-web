<template>
    <div class="legend-container">
        <div class="group-name">{{ i18n.global.t('meos_control_web.space_status_colon') }}</div>
        <template v-for="(item, index) in SPACE_STATUS" :key="index">
            <div class="legend-item-wrap">
                <div class="legend-item" :style="{ background: item.color }"></div>
                <span>{{ item.name }}</span>
            </div>
        </template>

        <div class="divider"></div>

        <div class="group-name">{{ i18n.global.t('meos_control_web.access_control_colon') }}</div>
        <template v-for="(item, index) in doorStatuses" :key="index">
            <div class="legend-item-wrap">
                <div class="legend-item-door" :style="{ background: item.color, borderRadius: item.radius, border: item.border }">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <rect x="11.1729" y="2.73889" width="0.810201" height="8.72524" rx="0.4051" fill="white" />
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M3.07032 2.33337C2.50239 2.33337 2.04199 2.79377 2.04199 3.36171V10.8405C2.04199 11.4084 2.50239 11.8688 3.07032 11.8688H4.94002C5.50795 11.8688 5.96835 11.4084 5.96835 10.8405V3.36171C5.96835 2.79377 5.50795 2.33337 4.94002 2.33337H3.07032ZM4.00533 10.4044C4.31512 10.4044 4.56624 10.1532 4.56624 9.84345C4.56624 9.53367 4.31512 9.28254 4.00533 9.28254C3.69555 9.28254 3.44443 9.53367 3.44443 9.84345C3.44443 10.1532 3.69555 10.4044 4.00533 10.4044Z"
                            fill="white"
                        />
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M7.65822 2.33337C7.09028 2.33337 6.62988 2.79377 6.62988 3.36171V10.8405C6.62988 11.4084 7.09028 11.8688 7.65821 11.8688H9.52791C10.0958 11.8688 10.5562 11.4084 10.5562 10.8405V3.36171C10.5562 2.79377 10.0958 2.33337 9.52791 2.33337H7.65822ZM8.5932 10.4044C8.90298 10.4044 9.15411 10.1532 9.15411 9.84345C9.15411 9.53367 8.90298 9.28254 8.5932 9.28254C8.28342 9.28254 8.03229 9.53367 8.03229 9.84345C8.03229 10.1532 8.28342 10.4044 8.5932 10.4044Z"
                            fill="white"
                        />
                    </svg>
                </div>
                <span>{{ item.name }}</span>
            </div>
        </template>

        <div class="divider"></div>

        <div class="group-name">{{ i18n.global.t('meos_control_web.camera_colon') }}</div>
        <template v-for="(item, index) in cameras" :key="index">
            <div class="legend-item-wrap">
                <div class="legend-item-camera" :style="{ background: item.color, borderRadius: item.radius, border: item.border }">
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                        <path
                            d="M5.78217 9.17885L5.78421 9.17545L4.23675 7.52059C4.12495 7.401 4.06006 7.24509 4.054 7.0815C4.04794 6.91791 4.10113 6.75763 4.20378 6.63011L4.56711 6.17875L10.6846 12.4223L9.97082 12.8584C9.8648 12.9232 9.74302 12.9578 9.61874 12.9582C9.49446 12.9587 9.37243 12.9251 9.26591 12.8611L5.78217 9.17885ZM5.60339 9.48202L6.58802 10.5227L5.95483 11.5947C5.9073 11.6754 5.84357 11.7454 5.76764 11.8003C5.69171 11.8552 5.60523 11.8937 5.51366 11.9135C5.4654 11.9247 5.4151 11.9305 5.36344 11.9305H4.33021V12.9705C4.33023 13.0598 4.31265 13.1482 4.2785 13.2307C4.24434 13.3132 4.19428 13.3881 4.13115 13.4512C4.06803 13.5144 3.99309 13.5645 3.91061 13.5986C3.82813 13.6328 3.73973 13.6504 3.65046 13.6504C3.56118 13.6504 3.47278 13.6328 3.3903 13.5986C3.30782 13.5645 3.23288 13.5144 3.16976 13.4512C3.10664 13.3881 3.05657 13.3132 3.02242 13.2307C2.98826 13.1482 2.97069 13.0598 2.9707 12.9705V10.2515C2.97069 10.1622 2.98826 10.0738 3.02242 9.99134C3.05657 9.90885 3.10664 9.8339 3.16976 9.77077C3.23288 9.70764 3.30782 9.65756 3.3903 9.62339C3.47278 9.58923 3.56118 9.57164 3.65046 9.57164C3.73973 9.57164 3.82813 9.58923 3.91061 9.62339C3.99309 9.65756 4.06803 9.70764 4.13115 9.77077C4.19428 9.8339 4.24434 9.90885 4.2785 9.99134C4.31265 10.0738 4.33023 10.1622 4.33021 10.2515V10.5876H4.95049L5.60339 9.48202ZM4.99399 5.6482L6.55811 3.7041C6.61767 3.63007 6.69209 3.56934 6.77657 3.52585C6.86105 3.48235 6.9537 3.45705 7.04856 3.45157C7.14343 3.44609 7.23838 3.46057 7.3273 3.49405C7.41623 3.52754 7.49714 3.5793 7.56482 3.64598L13.6354 9.62884C13.7089 9.7013 13.765 9.78955 13.7994 9.88691C13.8337 9.98428 13.8454 10.0882 13.8337 10.1908C13.8219 10.2933 13.7869 10.3919 13.7313 10.4789C13.6757 10.5659 13.6011 10.6391 13.513 10.693L11.2766 12.06L4.99399 5.6482Z"
                            fill="#8252E3"
                        />
                    </svg>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { SPACE_STATUS } from '../../variable';

const doorStatuses = [
    { color: '#00A2A7', name: i18n.global.t('common.status_open'), radius: '3.333px', border: '0.833px solid rgba(255, 255, 255, 0.40)' },
    { color: '#424C59', name: i18n.global.t('common.status_close'), radius: '4px', border: '1px solid rgba(255, 255, 255, 0.40)' },
    { color: '#8B949E', name: i18n.global.t('meos_control_web.no_data1'), radius: '3.333px', border: ' 0.833px solid rgba(255, 255, 255, 0.40)' }
];

const cameras = [{ color: '#FCF5FF', radius: '3px', border: '1px solid #8252E3' }];
</script>

<style lang="less" scoped>
.legend-container {
    display: flex;
    flex-wrap: wrap;
    row-gap: 8px;
    padding: 11px 20px;
    align-items: flex-start;

    border-radius: 4px 4px 0px 0px;
    background: linear-gradient(180deg, #e1e7ee 0%, #d6dde5 100%);
}

.legends-wrap {
    display: flex;
    align-items: center;
    gap: 12px;
}

.group-name {
    color: @grey-800;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 18px;
}

.divider {
    display: flex;
    align-items: center;
    margin-inline: 12px;
    margin-block: auto;
    width: 1px;
    height: 14px;
    background: #b1b9c2;
}

.legend-item-wrap {
    display: flex;
    align-items: center;
    gap: 4px;

    color: var(--gray-600, #626c78);
    font-size: 14px;
    font-style: normal;
    font-weight: var(--platform-font-weight);
    line-height: 18px;

    & + .legend-item-wrap {
        margin-left: 12px;
    }

    .legend-item {
        width: 14px;
        height: 14px;
        border-radius: 2px;
    }

    .legend-item-door {
        display: flex;
        justify-content: center;
        align-items: center;

        width: 20px;
        height: 20px;
        padding: 3px;
    }

    .legend-item-camera {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 18px;
        height: 18px;
        padding: 0.9px 0.899px 1.8px 1.801px;
    }
}
</style>
