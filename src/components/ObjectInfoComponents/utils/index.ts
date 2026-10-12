import DockSingleton from '@/hooks/responsiveDock';
import { isIotInfoType } from '@/utils/infoTemplate';

const { getIotData } = DockSingleton.getInstance();

/**
 * 解析 item.showStyle（JSON 字符串或对象），判断是否不受手自动状态设定限制
 * 读取 showStyle.controlCondition.unrelatedToManualAutoSet
 */
export const isUnrelatedToManualAutoSet = (item: { showStyle?: string | Record<string, any> }): boolean => {
    try {
        const showStyle = typeof item.showStyle === 'string' ? JSON.parse(item.showStyle) : item.showStyle;
        return showStyle?.controlCondition?.unrelatedToManualAutoSet === true;
    } catch {
        console.log('showStyle-error', item);
        return false;
    }
};

export const handleRelInfoCode = (
    item: { objectId: string },
    dataSourceItem: { code?: string },
    config: { linkageControl?: { infoCodeType?: string; infoCodes?: string[]; whenValueOr?: string[] } }
): any[] => {
    const linkageControl = config.linkageControl || {};
    const { infoCodeType = '', infoCodes = [], whenValueOr = [] } = linkageControl;
    const arr: any[] = [];
    if (dataSourceItem?.code && whenValueOr.includes(dataSourceItem.code)) {
        infoCodes.forEach((code: string) => {
            let data: any = {};
            if (isIotInfoType(infoCodeType)) {
                data = getIotData(item.objectId, code);
            }
            if (data.existsIotRule === true) {
                arr.push(data);
            }
        });
    }
    return arr;
};
