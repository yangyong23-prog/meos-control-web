import { ApmWebsite } from 'yushu-js-utils';
import useMidFrameStore from '@/store/midFrameStore';
import { getMicroBasePath, isMeosFrame } from '@/utils/envUtils';
import { findDestinationPage, getDestinationDefaultParams } from './destinationPageRegistry';

export const openWebsite = (url, options = {}) => {
    if (!isMeosFrame()) {
        return ApmWebsite.openWebsite(getMicroBasePath(), url, options);
    }

    const { props } = useMidFrameStore();
    if (!props?.destinationNavigation?.openDestination) {
        console.warn('[openWebsite] 主应用未注入 destinationNavigation，无法跳转。');
        return;
    }

    // 将旧调用的查询字符串转换为主应用接收的参数对象。
    const params = Object.fromEntries(new URLSearchParams(options.params || ''));
    return Promise.resolve()
        .then(() => {
            // 直接使用主应用本次挂载传入的目的页列表，不再请求或缓存注册表。
            const pages = props.destinationConfig;
            if (!Array.isArray(pages)) {
                console.warn('[openWebsite] 主应用未注入有效的 destinationConfig，无法跳转。');
                return false;
            }
            const destination = findDestinationPage(pages, url, params);
            if (!destination) {
                console.warn('[openWebsite] 主应用未登记对应目的页或存在多个匹配项，无法跳转。', url);
                return false;
            }
            const destinationParams = { ...getDestinationDefaultParams(destination), ...params };
            // meos-frame 统一处理鉴权，跳转参数不携带 token。
            delete destinationParams.token;
            return props.destinationNavigation.openDestination({
                id: destination.id,
                title: destination.title,
                params: destinationParams,
                projectId: props.projectId
            });
        })
        .catch(error => {
            console.warn('[openWebsite] 目的页匹配或导航失败。', error);
            return false;
        });
};
