import http from '@/utils/http';
import { INTERFACE_PREFIX_DMP_ALARM } from '@/config';

export interface AlarmTreeParams {
    category: string;
}
/**
 * 获取报警条件
 * @param params
 * @returns
 */
export const getAlarmList = (params: AlarmTreeParams) => http.post(INTERFACE_PREFIX_DMP_ALARM + '/rcProjectAlarmRules/queryTree', params);

/**
 * 获取报警条件详情
 * @param params
 * @returns
 */
export const getAlarmQuery = (params: { id: string; groupId: string }) => http.post(INTERFACE_PREFIX_DMP_ALARM + '/rcProjectAlarmRules/queryPage', params);

export interface AlarmTypeParams {
    list: string;
    user_id: string;
}
/**
 * 获取报警类型
 * @param params
 * @returns
 */
export const getAlarmType = (params: AlarmTypeParams) => http.post(INTERFACE_PREFIX_DMP_ALARM + '/alarm_items/query', params);

export interface QueryRuleObjRel {
    alarmItemCode: string;
    groupId: string;
}
/**
 * 获取报警对象
 * @param params
 * @returns
 */
export const getAlarmObject = (params: QueryRuleObjRel) => http.post(INTERFACE_PREFIX_DMP_ALARM + '/projectAlarmRuleObjRels/run/queryRuleObjRel', params);

export interface AlarmObjectClass {
    category: string;
    groupId: string;
}
/**
 * 获取报警对象类
 * @param params
 * @returns
 */
export const getAlarmObjectClass = (params: AlarmObjectClass) => http.post(INTERFACE_PREFIX_DMP_ALARM + '/rcProjectAlarmRules/queryTree', params);

export interface addAlarmTypeParams {
    category: string;
}
/**
 * 获取添加报警类型
 * @param params
 * @returns
 */
export const getAddAlarmType = (params: addAlarmTypeParams) => http.post(INTERFACE_PREFIX_DMP_ALARM + '/alarm/item/getAlarmItem', params);

export interface addAlarmObjectParams {
    alarmItemCode: string;
    groupId: string;
    classCode: string;
}
/**
 * 获取添加报警对象
 * @param params
 * @returns
 */
export const getAddAlarmObject = (params: addAlarmObjectParams) => http.post(INTERFACE_PREFIX_DMP_ALARM + '/projectAlarmRuleObjRels/run/queryRuleObjRel', params);

export interface addMonitoringIndex {
    category: string;
    classCode: string;
}
/**
 * 获取检测指标
 * @param params
 * @returns
 */
export const getAddMonitoringIndex = (params: addMonitoringIndex) => http.post(INTERFACE_PREFIX_DMP_ALARM + '/monitorIndicators/query', params);

// 删除
export interface delelte {
    alarmConditionId: string;
    id: string;
    classCode: string;
}
/**
 * 删除
 * @param params
 * @returns
 */
export const deleteAlarm = (params: delelte) => http.post(INTERFACE_PREFIX_DMP_ALARM + '/rcProjectAlarmRules/delete', params);

// 新增报警条件时获取报警详情
export interface GetCondition {
    alarmItemCode: string;
    groupId: string;
}
/**
 * 新增报警条件时获取报警详情
 * @param params
 * @returns
 */
export const getCondition = (params: GetCondition) => http.post(INTERFACE_PREFIX_DMP_ALARM + '/alarmConditions/getCondition', params);

// 新增
export interface create {
    alarmConditionId: string;
}
/**
 * 新增
 * @param params
 * @returns
 */
export const createAlarm = (params: any) => http.post(INTERFACE_PREFIX_DMP_ALARM + '/rcProjectAlarmRules/create', params);

/**
 * 更新
 * @param params
 * @returns
 */
export const updateAlarm = (params: any) => http.post(INTERFACE_PREFIX_DMP_ALARM + '/rcProjectAlarmRules/update', params);

/**
 * 屏蔽管理
 * @param params
 * @returns
 */
export const shieldManage = (params: { shieldManageDTOList: any[]; projectAlarmRuleId: string; classCode: string }) =>
    http.post(INTERFACE_PREFIX_DMP_ALARM + '/projectAlarmRuleObjRels/shieldManage', params);

/**
 * 查询项目下的对象
 * @param params
 * @returns
 */
export const queryObjProjectList = () => http.post(INTERFACE_PREFIX_DMP_ALARM + '/rcProjectAlarmRuleObjRels/queryObjProjectList');

/**
 * 查询项目和对象下的报警类别
 * @param params
 * @returns
 */
export const queryObjAlarmItemList = (params: { objId: string }) => http.post(INTERFACE_PREFIX_DMP_ALARM + '/rcProjectAlarmRuleObjRels/queryObjAlarmItemList', params);

export interface UpdateObjOpenList {
    groupCode: string;
    updateObjOpenList: [{ id: string; open: number }];
}
/**
 * 批量修改屏蔽管理
 * @param params
 * @returns
 */
export const updateObjOpenLists = (params: UpdateObjOpenList) =>
    http.post(INTERFACE_PREFIX_DMP_ALARM + '/rcProjectAlarmRuleObjRels/updateObjOpenList', params, { headers: { mergeParams: false } });

// 获取检测指标是否为枚举值
export interface isEnumerationValue {
    id: string;
}
/**
 * 获取检测指标
 * @param params
 * @returns
 */
export const isEnumerationValues = (params: isEnumerationValue) => http.post(INTERFACE_PREFIX_DMP_ALARM + '/monitorIndicators/get', params);

// 获取校验触发条件接口
export interface isTrue {
    frontend: {
        formula: [
            {
                key: string;
                label: string;
                value: string;
            }
        ];
        monitorIndicatorId: string;
        monitorIndicatorName: string;
        operator: string;
    };
}
/**
 * 获取检测指标
 * @param params
 * @returns
 */
export const isValidate = (params: any) => http.post(INTERFACE_PREFIX_DMP_ALARM + '/alarmConditions/validate', params, { autoHandleError: false });

/**
 * 启动算法计算
 * @param params
 * @returns
 */
export const startupAlgorithmCalculation = () => http.post(INTERFACE_PREFIX_DMP_ALARM + '/StartupAlgorithmCCalculation');

/**
 * 切换原因
 * @param params
 * @returns
 */
export const switchReason = (params: { cause: string; type: string }) => http.post('/running-control-saas/cause', params);
