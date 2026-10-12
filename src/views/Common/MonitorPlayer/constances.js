// @ts-ignore
import i18n from '@/localization';
// 需要播放的视频类型
export const VIDEO_TYPE = {
    REAL_TIME: {
        id: 'REAL_TIME',
        name: i18n.global.t('meos_control_web.realtime_video')
    },
    PLAY_BACK: {
        id: 'PLAY_BACK',
        name: i18n.global.t('meos_control_web.historical_video')
    }
};

// 请求接口统一日期格式
export const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
