import i18n from '@/localization';
import { MEOS_TMP_TAG_STYLES } from '@/config';
import DockSingleton from '@/hooks/responsiveDock';
import { INFO_TAG_DEFINE } from '@/utils/infoTemplate';
import { isEmpty } from 'lodash';
const { getIotData, getObjectDanegerStatus, getObjectAbnormalStatus } = DockSingleton.getInstance();
// import { isEdge } from '@/utils/envUtils';
export default (targetObj, codes, templateType = 'detail') => {
    const defineInfo = ref(MEOS_TMP_TAG_STYLES || INFO_TAG_DEFINE);
    const tagInfoList = computed(() => {
        return codes?.value
            ?.map(code => {
                const bft = defineInfo.value.base || {};
                const tmp = defineInfo.value[(templateType || '').toLowerCase()] || {};

                const statusMap = {
                    ...bft,
                    ...tmp
                };
                const infoDefine = statusMap[code];
                // 当前是异常状态，且从池子里拿到异常，则直接返回异常状态标签
                if (infoDefine) {
                    // alarmeventdetail信息点是针对接入新的异常事件推送，特有配置
                    if (code === 'alarmstatus' || code === 'alarmeventdetail' || code === 'riskEventDetailSpaceWithEquipments') {
                        const isAbnormal = getObjectAbnormalStatus(targetObj?.id);
                        return isAbnormal ? infoDefine.value : null;
                    } else if (code === 'dangerEvent') {
                        if (targetObj?.id) {
                            const dangerStatus = getObjectDanegerStatus(targetObj?.id);
                            return infoDefine[dangerStatus.code];
                        }
                    } else {
                        // 剩下的当IOT信息点
                        const latestIot = getIotData(targetObj?.id, code);
                        if (!isEmpty(latestIot)) {
                            return infoDefine[latestIot.dataValue];
                        }
                    }
                }

                return null;
            })
            .filter(Boolean);
    });
    return { tagInfoList };
};
