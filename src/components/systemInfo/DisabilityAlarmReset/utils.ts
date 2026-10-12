import DockSingleton from '@/hooks/responsiveDock';

const { setIotData } = DockSingleton.getInstance();

export const handleRwdObjectDetail = (res: any) => {
    try {
        const d = res?.data;
        if (d && Array.isArray(d)) {
            d.forEach(({ objectConfigs }) => {
                Object.keys(objectConfigs).forEach(objectId => {
                    objectConfigs[objectId].forEach((info: { infoCodeType: string; dataValue: any[] }) => {
                        // 判断是否为值为iot数组类型
                        if (info.infoCodeType === 'RWD_OBJECT_DETAIL') {
                            if (Array.isArray(info.dataValue)) {
                                info.dataValue.forEach((item: { relInfoCodeGroupConfigs: any[]; id: any }) => {
                                    item.relInfoCodeGroupConfigs?.forEach(group => {
                                        group.relInfoCodeConfigs?.forEach((infoCode: { infoCode: any }) => {
                                            setIotData(item.id, infoCode.infoCode, infoCode);
                                        });
                                    });
                                });
                            }
                        }
                    });
                });
            });
        }
    } catch (e) {
        console.log('customConfigEventHandle: 推送数据解析失败', e);
    }
};
