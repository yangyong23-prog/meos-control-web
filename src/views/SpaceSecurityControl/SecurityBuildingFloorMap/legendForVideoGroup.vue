<template>
    <div class="video-group-legend">
        <span class="label">{{ i18n.global.t('meos_control_web.camera_status_colon') }}</span>
        <div class="status-wrap">
            <template v-for="item in videoStatusItems" :key="item.name">
                <div class="status-item">
                    <div class="status-item-icon" :style="{ border: `1px solid ${item.borderColor}`, background: item.backgroundColor }">
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                            <path
                                d="M5.78022 9.1786L5.78225 9.1752L4.23479 7.52034C4.12299 7.40076 4.0581 7.24485 4.05205 7.08126C4.04599 6.91767 4.09917 6.75738 4.20182 6.62986L4.56515 6.17851L10.6826 12.4221L9.96886 12.8581C9.86284 12.923 9.74107 12.9575 9.61679 12.958C9.49251 12.9585 9.37048 12.9249 9.26396 12.8608L5.78022 9.1786ZM5.60144 9.48177L6.58606 10.5225L5.95287 11.5944C5.90535 11.6752 5.84161 11.7452 5.76569 11.8001C5.68976 11.8549 5.60328 11.8935 5.51171 11.9133C5.46345 11.9245 5.41315 11.9302 5.36149 11.9302H4.32826V12.9703C4.32827 13.0595 4.3107 13.148 4.27655 13.2304C4.24239 13.3129 4.19232 13.3879 4.1292 13.451C4.06608 13.5141 3.99114 13.5642 3.90866 13.5984C3.82618 13.6325 3.73778 13.6501 3.6485 13.6501C3.55923 13.6501 3.47083 13.6325 3.38835 13.5984C3.30587 13.5642 3.23093 13.5141 3.16781 13.451C3.10469 13.3879 3.05462 13.3129 3.02046 13.2304C2.98631 13.148 2.96874 13.0595 2.96875 12.9703V10.2513C2.96874 10.162 2.98631 10.0736 3.02046 9.99109C3.05462 9.90861 3.10469 9.83366 3.16781 9.77053C3.23093 9.7074 3.30587 9.65732 3.38835 9.62315C3.47083 9.58898 3.55923 9.5714 3.6485 9.5714C3.73778 9.5714 3.82618 9.58898 3.90866 9.62315C3.99114 9.65732 4.06608 9.7074 4.1292 9.77053C4.19232 9.83366 4.24239 9.90861 4.27655 9.99109C4.3107 10.0736 4.32827 10.162 4.32826 10.2513V10.5874H4.94854L5.60144 9.48177ZM4.99204 5.64796L6.55616 3.70386C6.61572 3.62982 6.69014 3.5691 6.77461 3.5256C6.85909 3.48211 6.95175 3.4568 7.04661 3.45133C7.14147 3.44585 7.23643 3.46032 7.32535 3.49381C7.41427 3.52729 7.49519 3.57905 7.56287 3.64574L13.6334 9.6286C13.707 9.70105 13.7631 9.78931 13.7974 9.88667C13.8318 9.98403 13.8435 10.0879 13.8317 10.1905C13.8199 10.2931 13.7849 10.3916 13.7293 10.4786C13.6738 10.5657 13.5991 10.6389 13.5111 10.6928L11.2747 12.0597L4.99204 5.64796Z"
                                :fill="item.fill"
                            />
                        </svg>
                    </div>
                    <span class="status-item-name">{{ item.name }}</span>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
const videoStatusItems = [
    { name: i18n.global.t('meos_control_web.not_selected'), borderColor: '#8252E3', backgroundColor: '#FCF5FF', fill: '#8252E3' },
    { name: i18n.global.t('meos_control_web.selected'), borderColor: '#FFF', backgroundColor: '#09B3B5', fill: 'white' }
];
</script>

<style lang="less" scoped>
.video-group-legend {
    display: flex;
    align-items: center;

    padding: 11px 20px;

    border-radius: 4px 4px 0px 0px;
    background: linear-gradient(180deg, #e1e7ee 0%, #d6dde5 100%);
}

.label {
    color: var(--gray-800, #2e3742);
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 18px;
}

.status-wrap {
    display: flex;
    align-items: center;
    gap: 12px;
}

.status-item {
    display: flex;
    align-items: center;
    gap: 4px;
}

.status-item-icon {
    display: flex;
    width: 18px;
    height: 18px;
    justify-content: center;
    align-items: center;
    border-radius: 3px;
}

.status-item-name {
    color: var(--gray-600, #626c78);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
}
</style>
