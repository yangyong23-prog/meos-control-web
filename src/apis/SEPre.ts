import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS } from '@/config';

const urlPrefix = INTERFACE_PREFIX_MEOS;

type UnknownObject = Record<string, any>;

// 根据一级菜单编码获取系统列表
export const getFirstMenuCodeData = (params: UnknownObject, config?: UnknownObject) => {
    return http.post(`${urlPrefix}/dashboard/systemGraph/listSystemByFirstMenuCode/${params.menuCode}`, params, config);
};
