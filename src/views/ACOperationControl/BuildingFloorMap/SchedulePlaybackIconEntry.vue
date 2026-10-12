<template>
    <div class="schedule-playback-icon-entry-container">
        <m-tips :content="i18n.global.t('meos_control_web.dispatch_replay')" theme="darkTransparent" placement="left" trigger="hover">
            <div class="content-wrapper" @click="handleClick">
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                    <path
                        d="M19.3289 10.5895C19.3289 5.73544 15.394 1.80048 10.5399 1.80048C5.68575 1.80048 1.75079 5.73544 1.75079 10.5895C1.75079 15.4436 5.68575 19.3786 10.5399 19.3786C11.2097 19.379 11.8773 19.303 12.5299 19.152L12.1764 17.63C11.6397 17.754 11.0907 17.8164 10.5399 17.8161C6.54884 17.8161 3.31329 14.5806 3.31329 10.5895C3.31329 6.59852 6.54884 3.36298 10.5399 3.36298C14.5309 3.36298 17.7664 6.59833 17.7664 10.5895C17.7684 11.9428 17.3885 13.2691 16.6705 14.4161L15.2158 12.9612L14.5551 17.5854L19.1795 16.9249L17.7994 15.5448C18.7985 14.0857 19.3318 12.3579 19.3289 10.5895Z"
                        fill="#1B2129"
                    />
                    <path
                        d="M13.1277 10.144L9.47189 7.44401C9.08478 7.15827 8.5379 7.43444 8.5379 7.9153V13.3153C8.5379 13.7962 9.08478 14.0723 9.47189 13.7866L13.1277 11.0866C13.2015 11.0321 13.2614 10.9611 13.3027 10.8792C13.344 10.7974 13.3655 10.707 13.3655 10.6153C13.3655 10.5236 13.344 10.4332 13.3027 10.3514C13.2614 10.2695 13.2015 10.1985 13.1277 10.144Z"
                        fill="#8B949E"
                    />
                </svg>
                <span class="title">{{ i18n.global.t('meos_control_web.playback') }}</span>
            </div>
        </m-tips>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { useRouter } from 'vue-router';

const props = defineProps({
    curEnvParam: {
        type: String,
        default: ''
    }
});

const router = useRouter();
const handleClick = () => {
    const to = router.resolve({
        name: 'ac-operation-control-playback',
        query: {
            curEnvParam: props?.curEnvParam
        }
    });
    window.open(to.href, '_blank');
};
</script>

<style lang="less" scoped>
.schedule-playback-icon-entry-container {
    position: absolute;
    right: 16px;
    bottom: 56px;
}
.content-wrapper {
    display: flex;
    width: 32px;
    padding: 6px 4px 4px 4px;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    border-radius: 4px;
    background: #fff;
    box-shadow: 0px 2px 10px 0px rgba(27, 33, 41, 0.1);
    cursor: pointer;

    .title {
        color: @grey-900;
        text-align: center;
        font-size: 12px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 18px;
    }
}
</style>
