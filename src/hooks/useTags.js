import i18n from '@/localization';
import { MEOS_TMP_TAG_STYLES } from '@/config';
import { INFO_TAG_DEFINE } from '@/utils/infoTemplate';
import DockSingleton from '@/hooks/responsiveDock';
import { isEmpty } from 'lodash';

export const getTagList = (objId, codeList) => {
    const { getIotData, getObjectAbnormalStatus } = DockSingleton.getInstance();

    // console.log('statusList: ', codeList);
    const defineInfo = ref(MEOS_TMP_TAG_STYLES || INFO_TAG_DEFINE);
    const arr =
        codeList
            ?.map(code => {
                // console.log('obj: ', obj);
                // const code = obj.infoCode;
                const bft = defineInfo.value.base || {};
                const tmp = defineInfo.value['detail'.toLowerCase()] || {};

                const statusMap = {
                    ...bft,
                    ...tmp
                };
                const infoDefine = statusMap[code];
                if (code === 'alarmstatus' || code === 'alarmeventdetail' || code === 'riskEventDetailSpaceWithEquipments') {
                    const isAbnormal = getObjectAbnormalStatus(objId);

                    return isAbnormal ? infoDefine.value : null;
                } else {
                    // 剩下的当IOT信息点
                    const latestIot = getIotData(objId, code);

                    if (!isEmpty(latestIot)) {
                        return infoDefine[latestIot.dataValue];
                    }
                }
            })
            .filter(Boolean) || [];

    // console.log('arr: ', arr);
    return arr;
};
