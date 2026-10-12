import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS } from '@/config';

/**
 * 信息点配置表-通用接口-查询项目下建筑下的空间（按照楼层分组）空间客流统计使用
 */
export const listBuildingAndSpaceByProjectIdGroupFloor = postData =>
    http.post(`${INTERFACE_PREFIX_MEOS}/equipment/infoCodeConfig/listBuildingAndSpaceByProjectIdGroupFloor`, postData);

/**
 * 门组出入口人数统计
 */
export const getPassengerFlowHeadCountData = postData => http.post(`${INTERFACE_PREFIX_MEOS}/passengerFlow/getPassagewayHeadCount`, postData);

/**
 * 异常事件列表: 按系统划分异常事件
 */
export const getAbnormalList = postData => http.post(`${INTERFACE_PREFIX_MEOS}/abnormalEvent/getAbnormalDataListDivideSystem`, postData);
