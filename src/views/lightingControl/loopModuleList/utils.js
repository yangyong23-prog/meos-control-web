import { MLoading } from 'meri-plus';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { MEOI_INSTANCE_DETAIL, CLOUD_ORIGIN } from '@/config';
import { openWebsite } from '@/utils/websiteNavigation';
import { getAuthParamsString, jumpToAnalysis } from '@/utils/envUtils';
import { durationTime } from '@/utils/viewUtils';
import { loopControlList } from '@/store/loopControlList';
import { abnormalJumpFun } from '@/utils/envUtils';
import { getDayjsTz } from '@/utils/globalVariables';

dayjs.extend(duration);

export const isHaveData = value => {
    if (value === '--') return false;
    if (value == null || value === undefined) return false;
    return true;
};

export const Loading = className => {
    const loadingOptions = {
        target: className,
        fullscreen: false,
        lottieName: 'ball',
        loadTextOptions: {
            text: '',
            style: {
                top: '-15px'
            }
        },
        duration: 30,
        loadIconStyle: {
            width: '100px',
            height: '100px'
        },
        loadButton: () => location.reload()
    };
    const loadingInstance = MLoading.service(loadingOptions);
    return loadingInstance;
};

export const removeAll = key => {
    if (!key) return '';
    if (key === 'ALL' || key === 'all') return '';
    return key;
};
export const getAutoKey = key => {
    const newKey = removeAll(key);
    if (newKey === 'AUTO') return '1';
    if (newKey === 'MANUAL') return '0';
    return newKey;
};
export const getOnlineKey = key => {
    const newKey = removeAll(key);
    if (newKey === 'ONLINE') return '1';
    if (newKey === 'OFFLINE') return '0';
    return newKey;
};
export const getNameByInfoValue = (code, dataSource) => {
    if (!code || !dataSource || dataSource.length === 0) return '';
    let finItem = dataSource.find(res => res?.code === code);
    return finItem?.name ?? '';
};
export const getBaseInfoName = (obj, key) => {
    if (key === 'relSpace') {
        return getRelSpaceName(obj[key]);
    }
    let item = obj[key] || {},
        name = '';
    if (item.hasOwnProperty('infoCodeValue')) {
        name = getNameByInfoValue(item.infoCodeValue, item?.dataSource);
    }
    if (!name) {
        name = item.localName ?? '';
    }
    return name || '--';
};

export const jumpTo = (server, params) => {
    if (server === 'analysis') {
        jumpToAnalysis(params);
    }
    if (server === 'abnormal') {
        abnormalJumpFun(params);
    }
    if (server === 'detail') {
        openWebsite(MEOI_INSTANCE_DETAIL, {
            params: `objId=${params}&${getAuthParamsString()}&f=MEOI_CatalogList&type=all`,
            newPage: true,
            origin: CLOUD_ORIGIN || ''
        });
    }
};

export const getAnalysisId = info => {
    if (!info) return '';
    return info?.additionalMapValue?.relDemandTemplateId ?? '';
};

export const formatDate = (time, formatstr = 'YYYY.MM.DD hh:mm') => {
    let year = getDayjsTz().format('YYYY');
    try {
        if (year === time.slice(0, 4)) {
            return `${time.slice(0, 4)}.${time.slice(4, 6)}.${time.slice(6, 8)} ${time.slice(8, 10)}:${time.slice(10, 12)}`;
        }
    } catch (err) {
        return '--';
    }
    if (!time) return '--';
    if (String(time)?.includes('.')) return time;
    return dayjs(Number(time)).format(formatstr);
};

export const formatMinutes = minutes => {
    return durationTime(minutes);
    // const duration = dayjs.duration(minutes, 'minutes');
    // const days = Math.floor(duration.asDays());
    // const hours = duration.hours();

    // let result = '';
    // if (days > 0) {
    //     result += `${days}天`;
    // }
    // if (hours > 0 || days > 0) {
    //     result += `${hours}小时`;
    // }

    // return result || '1小时';
};
export const getBuildTreeData = () => {
    const loopListStore = loopControlList();
    const rawData = loopListStore.buildingData || [];
    if (rawData && rawData.length > 0) {
        const treeData = [];
        if (rawData.length === 1) {
            const { floors } = rawData[0];
            floors.forEach(res => {
                const metaItem = { id: res.id, name: res.localName ?? '--', children: [], type: 'FLOOR' };
                res.spaces?.forEach(item => {
                    metaItem.children.push({
                        id: item.id,
                        name: item.localName ?? '--',
                        type: 'SPACE'
                    });
                });
                treeData.push(metaItem);
            });
        } else {
            rawData.forEach(parentRes => {
                const parent = { id: parentRes.id, name: parentRes.localName ?? '--', children: [], type: 'BUILDING' };
                parentRes.floors.forEach(res => {
                    const metaItem = { id: res.id, name: res.localName ?? '--', children: [], type: 'FLOOR' };
                    res.spaces?.forEach(item => {
                        metaItem.children.push({
                            id: item.id,
                            name: item.localName ?? '--',
                            type: 'SPACE'
                        });
                    });
                    parent.children.push(metaItem);
                });
                treeData.push(parent);
            });
        }
        return treeData;
    }
    return [];
};

export const getCheckedIds = list => {
    if (!list) return [];
    return list.map(res => res.id);
};

export const getRelSpaceName = meta => {
    if (Array.isArray(meta)) {
        const list = meta?.map?.(res => res.dynamicName) || [];
        if (list?.length > 0) {
            return list.join('、');
        } else {
            return '--';
        }
    } else {
        return meta?.dynamicName ?? '--';
    }
};
