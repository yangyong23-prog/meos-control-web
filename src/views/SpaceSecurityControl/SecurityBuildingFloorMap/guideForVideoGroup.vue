<template>
    <div class="guide-wrap">
        <div class="guide-container">
            <svg xmlns="http://www.w3.org/2000/svg" width="6" height="12" viewBox="0 0 6 12" fill="none" class="arrow-left">
                <g clip-path="url(#clip0_107_37816)">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M6 11L6 1L1 6L6 11Z" fill="#246FE5" />
                </g>
                <defs>
                    <clipPath id="clip0_107_37816">
                        <rect width="12" height="6" fill="white" transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 6 12)" />
                    </clipPath>
                </defs>
            </svg>
            <div class="content">
                {{ i18n.global.t('meos_control_web.need_enter_floor_select_camera_icon_on_map_to_add') }}
            </div>
        </div>
    </div>
</template>

<script setup></script>

<style lang="less" scoped>
.guide-wrap {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 88px;
    z-index: 15;
    pointer-events: none;
}
.guide-container {
    display: flex;
    padding: 8px 20px;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;
    gap: 20px;

    border-radius: 4px;
    background: var(--blue-500, #246fe5);
    position: relative;
}
.arrow-left {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: -5px;
}
.content {
    width: 350px;
    height: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: var(--Grey-Grey-0-Text, #fff);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
}
</style>
