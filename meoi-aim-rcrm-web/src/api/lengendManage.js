/*
 * @Author: wuyangyang
 * @Date: 2024-03-08 15:24:41
 * @LastEditors: wuyangyang
 * @LastEditTime: 2024-03-15 15:57:54
 * @Description:
 */
import Xsync from '@/utils/Xsync';
import { INTERFACE_PREFIX_MEOS } from '@/config';
// const INTERFACE_PREFIX_AIM = 'http://172.16.1.22:8080';
export const queryLengendTree = () =>
    Xsync({
        method: 'get',
        url: `${INTERFACE_PREFIX_MEOS}/graph/legend/type/tree`
    });

export const queryLengend = params => {
    return Xsync({
        method: 'get',
        url: `${INTERFACE_PREFIX_MEOS}/graph/legend/query/${params.classCode}`
        // url: `${INTERFACE_PREFIX_AIM}/graph/legend/query/SETDHI`
    });
};

export const putLengend = params => {
    return Xsync({
        method: 'post',
        url: `${INTERFACE_PREFIX_MEOS}/graph/legend/update/${params.legendId}`,
        params
    });
};
