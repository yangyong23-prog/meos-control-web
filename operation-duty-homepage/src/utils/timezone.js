// utils/timezone.js
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import dayjs from 'dayjs';

export const updateTimeZone = props => {
    let { timeZone } = Intl.DateTimeFormat().resolvedOptions();
    if (import.meta.env.DEV) {
        timeZone = import.meta.env.VITE_DEV_TIME_ZONE || timeZone;
    } else if (props) {
        timeZone = props?.timeZone || timeZone;
    }
    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.tz.setDefault(timeZone);
};
