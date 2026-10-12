import { getInfoCodeDataTimeAndPrecisionType } from '@/apis/systemDiagram';
import useStore from '@/store';

export const qiankunWindow = typeof window !== 'undefined' ? window.proxy || window : {};
export const renderWithQiankun = qiankunLifeCycle => {
    console.log(qiankunWindow);
    // eslint-disable-next-line no-underscore-dangle, no-void
    if (qiankunWindow === null || qiankunWindow === void 0 ? void 0 : qiankunWindow.__POWERED_BY_QIANKUN__) {
        if (!window.moudleQiankunAppLifeCycles) {
            window.moudleQiankunAppLifeCycles = {};
        }
        window.moudleQiankunAppLifeCycles = qiankunLifeCycle;
    }
};
export const fetchUpdateTime = () => {
    return new Promise(resolve => {
        getInfoCodeDataTimeAndPrecisionType()
            .then(({ data: { startTime, ipTypes, endTime } }) => {
                const { base } = useStore();
                base.setHeaderConfig({
                    IPType: ipTypes[0],
                    startTime,
                    endTime,
                    id: new Date().getTime()
                });
                resolve(startTime);
            })
            .catch(() => {
                resolve();
            });
    });
};
