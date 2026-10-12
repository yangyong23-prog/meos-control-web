// @ts-ignore
import i18n from '@/localization';
import dayjs from 'dayjs';
import { MLoading } from 'meri-plus';
import { IOT_SETTING } from '@/utils/globalVariables';

export const getTableHeader = dataSource => {
    const firstItem = dataSource?.[0];
    const baseColumn = [
        {
            dataIndex: 'objectName',
            title: i18n.global.t('meos_control_web.equipment_name'),
            resizable: true,
            minWidth: 180,
            fixed: 'left'
        }
    ];
    // 表格的自定义渲染栏配置列表 -> 用于便利生成 template
    const tableRenderList = [];

    if (!firstItem) return baseColumn;
    // 一级表头
    firstItem?.relInfoCodeGroupConfigs?.forEach?.((res, index) => {
        const headerItem = {
            dataIndex: String(index),
            title: res.groupName ?? '--',
            resizable: true,
            children: []
        };
        // 二级表头
        if (res.relInfoCodeConfigs && res.relInfoCodeConfigs?.length > 0) {
            res.relInfoCodeConfigs?.forEach((item, num) => {
                const secondItem = {
                    dataIndex: String(`${index}-${num}`),
                    title: item?.infoCodeName ?? '--',
                    resizable: true
                };
                tableRenderList.push(secondItem);
                // 根据ux:最后一项的宽度是140px;最后一项的最后一个元素最小宽度150px https://www.figma.com/design/CSeJISOpQMwCS2S9H2X0bK/%E9%80%9A%E9%A3%8E%E6%8E%A7%E5%88%B6?node-id=657-35934&m=dev
                if (index === firstItem.relInfoCodeGroupConfigs.length - 1) {
                    if (num === res.relInfoCodeConfigs.length - 1) {
                        secondItem.minWidth = 150;
                    } else {
                        secondItem.width = 140;
                    }
                } else {
                    let width = item?.relInfoCodeConfig ? 140 : 80;
                    const { infoCode, infoCodeType } = item;
                    // 手自动按钮宽度为140
                    if (infoCode === 'manualAutoSet' || infoCodeType === IOT_SETTING || infoCode === 'manualAutoStatus') {
                        width = 140;
                    }
                    secondItem.width = width;
                }
                headerItem.children.push(secondItem);
            });
        } else {
            // 如果没有二级表头,则使用一级表头数据渲染
            tableRenderList.push(headerItem);
        }

        baseColumn.push(headerItem);
    });
    return {
        column: JSON.parse(JSON.stringify(baseColumn)),
        tableRenderList: tableRenderList
    };
};

export const getTableData = dataSource => {
    if (!dataSource || dataSource?.length === 0) return [];
    let copyData = JSON.parse(JSON.stringify(dataSource));
    copyData.forEach((dataItem, parentNUm) => {
        const customData = {};
        dataItem.onlineStatus = false;
        dataItem.id = dataItem.objectId ?? parentNUm;
        //一级表头
        dataItem.relInfoCodeGroupConfigs?.forEach?.((res, index) => {
            const dataIndex = String(index);
            // 存在二级表头
            if (res.relInfoCodeConfigs && res.relInfoCodeConfigs?.length > 0) {
                res.relInfoCodeConfigs?.forEach((item, num) => {
                    if (item.infoCode === 'onlineStatus') {
                        // 在离线状态设置
                        dataItem.onlineStatus = String(item.dataValue) === '1' ? true : false;
                        // 单元格单选框是否禁用
                        dataItem.disable = !dataItem.onlineStatus;
                    }
                    if (item.infoCode === 'manualAutoStatus') {
                        // 手自动状态
                        dataItem.model = item.dataValue;
                        // 手动控制设备，hover单元格显示的   恢复为自动
                        dataItem.autoRecoveryDateTime =
                            item?.relInfoCodeConfig?.additionalMapValue?.recoveryDateTime || item?.relInfoCodeConfig?.additionalMapValue?.dataTime || '';
                    }
                    item.parentCode = res.groupCode;
                    const secondIndex = String(`${index}-${num}`);
                    customData[secondIndex] = item;
                    customData[secondIndex].isSecond = true;
                });
            } else {
                customData[dataIndex] = res;
                customData[dataIndex].isSecond = false;
            }
        });
        dataItem.customData = customData;
    });
    // return testData;
    return copyData;
};

// 筛选栏请求
export const getSelectList = dataSource => {
    if (!dataSource) return [];
    if (dataSource?.length > 0) {
        const firstChild = dataSource[0]?.relInfoCodeGroupConfigs || [];
        const findItem = firstChild.find(res => res.groupCode === 'equipStatus');
        if (findItem) {
            if (!findItem.relInfoCodeConfigs) return [];
            return (
                findItem?.relInfoCodeConfigs?.map?.(item => {
                    return {
                        infoCode: item.infoCode,
                        name: item.infoCodeName,
                        value: '',
                        ...item,
                        options: []
                    };
                }) || []
            );
        }
        return [];
    }
    return [];
};

// 暂时回退该问题后续重构解决：https://persagy2021.coding.net/p/apm-aim/bug-tracking/issues/121240/detail
// export const getBtnList = (dataSource, enumList) => {
//     if (!dataSource) return [];
//     if (dataSource?.length > 0) {
//         const allInfoCodesMap = new Map();
//         const cloneData = structuredClone(dataSource);
//         const allGroupConfigs = cloneData?.flatMap?.(item => item?.relInfoCodeGroupConfigs || []);
//         allGroupConfigs.forEach(res => {
//             if (res.relInfoCodeConfigs) {
//                 res.relInfoCodeConfigs?.forEach?.(item => {
//                     if (item.relInfoCodeConfig && item.infoCode !== 'manualAutoSet' && item.infoCode !== 'manualAutoStatus') {
//                         const tempItem = {
//                             ...item,
//                             dataSource: item.relInfoCodeConfig?.dataSource
//                         };
//                         allInfoCodesMap.set(item.infoCode, tempItem);
//                     } else if (item?.showStyle === 'SET_VALUE_SINGLE_COLUMN') {
//                         // 单列设定-允许多选设定
//                         allInfoCodesMap.set(item.infoCode, item);
//                     }
//                 });
//             } else {
//                 if (res.relInfoCodeConfig && res.infoCode !== 'manualAutoSet' && res.infoCode !== 'manualAutoStatus') {
//                     allInfoCodesMap.set(res.infoCode, res);
//                 }
//             }
//         });
//         const allList = [...allInfoCodesMap.values()];

//         allList.forEach((item, index) => {
//             item.name = item.infoCode === 'runStatus' ? i18n.global.t('meos_control_web.switch_setpoint') : item?.infoCodeName || '--';
//             item.id = item?.infoCode || index;
//             // 判断是枚举值还是非枚举值
//             const findEnum = enumList.find(col => col.code === item.infoCode);
//             if (findEnum) {
//                 item.isEnum = true;
//             } else {
//                 item.isEnum = item.unit ? false : true;
//             }
//         });
//         return allList;
//     }
// };

export const getBtnList = (dataSource, enumList) => {
    if (!dataSource) return [];
    if (dataSource?.length > 0) {
        const firstChild = dataSource[0]?.relInfoCodeGroupConfigs ? JSON.parse(JSON.stringify(dataSource[0]?.relInfoCodeGroupConfigs)) : [];
        console.log('firstChild: ', firstChild);
        const allList = [];
        firstChild?.forEach?.(res => {
            if (res.relInfoCodeConfigs) {
                res.relInfoCodeConfigs?.forEach?.(item => {
                    if (item.relInfoCodeConfig && item.infoCode !== 'manualAutoSet' && item.infoCode !== 'manualAutoStatus') {
                        item.dataSource = item.relInfoCodeConfig?.dataSource;
                        allList.push(item);
                    } else if (item?.showStyle === 'SET_VALUE_SINGLE_COLUMN') {
                        // 单列设定-允许多选设定
                        allList.push(item);
                    }
                });
            } else {
                if (res.relInfoCodeConfig && res.infoCode !== 'manualAutoSet' && res.infoCode !== 'manualAutoStatus') {
                    allList.push(res);
                }
            }
        });
        allList.forEach((item, index) => {
            item.name = item.infoCode === 'runStatus' ? i18n.global.t('meos_control_web.switch_setpoint') : item?.infoCodeName || '--';
            item.id = item?.infoCode || index;
            // 判断是枚举值还是非枚举值
            const findEnum = enumList.find(col => col.code === item.infoCode);
            if (findEnum) {
                item.isEnum = true;
            } else {
                item.isEnum = item.unit ? false : true;
            }
        });
        return allList;
    }
};
// 设置手自动状态
export const getCheckStatus = (value, type = 'auto') => {
    if (value === '0') {
        return type === 'manual' ? 'checked' : 'uncheck';
    } else if (value === '1') {
        return type === 'manual' ? 'uncheck' : 'checked';
    } else {
        return '';
    }
};
export const getInputValue = meta => {
    let text = '';
    if (!isEmpty(meta?.relInfoCodeConfig?.dataValue)) {
        text = meta.relInfoCodeConfig.dataValue;
    }
    if (isEmpty(text) && !isEmpty(meta?.relInfoCodeConfigs?.dataValue)) {
        text = meta.relInfoCodeConfigs.dataValue;
    }
    if (isEmpty(text) && !isEmpty(meta?.dataValue)) {
        text = meta.dataValue;
    }
    return text;
};
export const getInfoCodeName = meta => {
    let text = '';
    // 一级取值
    if (isEmpty(text) && meta?.dataSource?.length > 0) {
        const findItem = meta.dataSource?.find?.(res => res.code === meta.dataValue);
        if (findItem) {
            text = findItem.name;
        }
    }
    if (isEmpty(text)) {
        text = isEmpty(meta?.dataValue) ? '' : meta?.dataValue;
    }
    // 二级取值
    // if (isEmpty(text) && meta?.relInfoCodeConfig?.dataSource?.length > 0) {
    //     const findItem = meta.relInfoCodeConfig.dataSource?.find?.(res => res.code === meta.relInfoCodeConfig?.dataValue);
    //     if (findItem) {
    //         text = findItem.name;
    //     }
    // }
    // if (isEmpty(text) && !isEmpty(meta?.relInfoCodeConfig?.dataValue)) {
    //     text = meta.relInfoCodeConfig.dataValue;
    // }
    // 二级取值兼容其他字段
    // if (meta?.relInfoCodeConfigs?.dataSource?.length > 0) {
    //     const findItem = meta.relInfoCodeConfigs.dataSource?.find?.(res => res.code === meta.relInfoCodeConfigs?.dataValue);
    //     if (findItem) {
    //         text = findItem.name;
    //     }
    // }
    // if (isEmpty(text) && !isEmpty(meta?.relInfoCodeConfigs?.dataValue)) {
    //     text = meta.relInfoCodeConfigs.dataValue;
    // }

    if (isEmpty(text)) {
        text = '--';
    }
    // 单位添加
    if (meta?.unit) {
        text += meta.unit;
    }
    return text;
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

export const isEmpty = value => {
    if (value === null || value === undefined || value === '' || value === ' ') return true;
};
//获取实际值
export const getActualData = meta => {
    if (!meta) return '--';
    let text = '';
    // 二级取值
    if (meta?.relInfoCodeConfig?.dataSource?.length > 0) {
        const findItem = meta.relInfoCodeConfig.dataSource?.find?.(res => res.code === meta.relInfoCodeConfig?.dataValue);
        if (findItem) {
            text = findItem.name;
        }
    }
    if (isEmpty(text) && !isEmpty(meta?.relInfoCodeConfig?.dataValue)) {
        text = meta.relInfoCodeConfig.dataValue;
    }
    // 二级取值兼容其他字段
    if (meta?.relInfoCodeConfigs?.dataSource?.length > 0) {
        const findItem = meta.relInfoCodeConfigs.dataSource?.find?.(res => res.code === meta.relInfoCodeConfigs?.dataValue);
        if (findItem) {
            text = findItem.name;
        }
    }
    if (isEmpty(text) && !isEmpty(meta?.relInfoCodeConfigs?.dataValue)) {
        text = meta.relInfoCodeConfigs.dataValue;
    }
    if (isEmpty(text)) {
        text = '--';
    }
    // 单位添加
    if (meta?.unit) {
        text += meta.unit;
    }
    return text;
};
//获取设定值
export const getSetData = meta => {
    if (!meta) return '--';
    let text = '';
    // 一级取值
    if (isEmpty(text) && meta?.dataSource?.length > 0) {
        const findItem = meta.dataSource?.find?.(res => res.code === meta.dataValue);
        if (findItem) {
            text = findItem.name;
        }
    }
    if (isEmpty(text)) {
        text = isEmpty(meta?.dataValue) ? '--' : meta?.dataValue;
    }
    // 单位添加
    if (meta?.unit) {
        text += meta.unit;
    }
    return text;
};

// 是否有设定值
export const isHaveSetData = meta => {
    if (!meta) return false;
    if (meta?.relInfoCodeConfig || meta?.relInfoCodeConfigs) {
        return true;
    }
    return false;
};

export const getFormatDate = (time, str = '--') => {
    if (!time) return str;
    try {
        const timeStr = dayjs(time).format('YYYY.MM.DD HH:mm');
        if (String(timeStr).includes('NaN') || String(timeStr).includes('invalid')) return str;
        return timeStr;
    } catch (err) {
        return str;
    }
};
