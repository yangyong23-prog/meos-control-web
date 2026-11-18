// @ts-ignore
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable camelcase */
import qs from 'qs';
import axios, { CreateAxiosDefaults, AxiosInstance } from 'axios';
import { isEmpty, isNull } from 'lodash';
import { systemInstance, jsonStringServerNames } from '@/utils/persagyTools';
import { HttpResponse } from '@/types/common';
import { closeLoading } from './tools';
import useStore from '@/store';
import { $Message } from 'meri-plus';
import { isEdge } from '@/utils/envUtils';
import { applyPrecisionMarker } from '@/apis/precisionWhitelist';
import iotExpireManager from '@/utils/iotExpireManager';
import { useRoute, useRouter } from 'vue-router';
import i18n, { getLocaleLang, DEFAULT_LANG } from '@/localization';
import { INTERFACE_PREFIX_MEOS } from '@/config';
import { isMissingPrefixUrl, missingPrefixKeyOf } from '@/utils/opt/strictPrefix';
import { isReadonlyWriteUrl, isStandardsReadonly, READONLY_MESSAGE } from '@/utils/opt/standardsModeState';

/** opt W1：同一前缀只提示一次，避免页面轮询刷屏 */
const notifiedMissingPrefix = new Set<string>();

/**
 * opt W1/W2：请求发出前的拦截。返回拒绝原因；不需要拦截时返回 null。
 * - W1：前缀未在 meosEnv 配置（OPT_STRICT_EDGE_PREFIX 打开时）→ 不发请求；
 * - W2：项目已切新运行标准且 OPT_STANDARDS_READONLY 打开 → 配置写接口不发请求（后端 B2 也会拦，这里提前给提示）。
 */
function optBlockReason(url: string, projectId: string): { code: string; message: string; silent?: boolean } | null {
    if (isMissingPrefixUrl(url)) {
        const key = missingPrefixKeyOf(url);
        const message = `主框架未配置接口前缀 ${key}，请求已拦截`;
        // 同一前缀只在第一次提示，之后静默失败，避免轮询刷屏
        const first = !notifiedMissingPrefix.has(key);
        notifiedMissingPrefix.add(key);
        return { code: 'OPT_PREFIX_MISSING', message, silent: !first };
    }
    if (INTERFACE_PREFIX_MEOS && url.startsWith(INTERFACE_PREFIX_MEOS) && isReadonlyWriteUrl(url) && isStandardsReadonly(projectId)) {
        return { code: 'A0403', message: READONLY_MESSAGE };
    }
    return null;
}

const jsonStringArray = jsonStringServerNames([]);
/**
 *  判断请求是否需要 formdata 提交
 * @param url 请求的地址
 */
function diffPost(url: string): boolean {
    // console.log(jsonStringArray, 'jsonStringArray');
    jsonStringArray.push('getProjectByIdService', 'listClimateZoneService');
    return jsonStringArray.some(item => url.includes(item));
}

/**
 * 获取需合并到请求头中的参数
 * @returns params
 */
function getMergeReqParams() {
    const { base } = useStore();
    const userInfoStr = systemInstance.queryUser();
    const userInfo = isNull(userInfoStr) ? base.userInfo : JSON.parse(userInfoStr);
    const { pd = '', user_id = '', userId = '', person_id = '', userName = '', userId: userCode = '' } = userInfo;
    const groupCode = base.groupCode || userInfo.groupCode || '';
    const token = base.token || '';

    const { projectId } = base;

    // const nacosCluster = 'meos'
    if (import.meta.env.VITE_DEV_MODE) {
        return {
            user_id: import.meta.env.VITE_DEV_USER,
            userId: import.meta.env.VITE_DEV_USER,
            pd,
            person_id,
            userName,
            userCode,
            groupCode: import.meta.env.VITE_DEV_GROUPCODE,
            'group-code': import.meta.env.VITE_DEV_GROUPCODE,
            token,
            projectId: import.meta.env.VITE_DEV_PROJECTID,
            'project-id': import.meta.env.VITE_DEV_PROJECTID
        };
    }
    return {
        user_id,
        userId,
        pd,
        person_id,
        userName,
        userCode,
        groupCode,
        token,
        projectId,
        ['group-code']: import.meta.env.VITE_DEV_GROUPCODE,
        ['project-id']: import.meta.env.VITE_DEV_PROJECTID
    };
}

/**
 * 错误统一处理
 */
function errHandle(err: any) {
    switch (err.status) {
        case 403:
            $Message.error({
                title: i18n.global.t('meos_control_web.server_rejected_request')
            });
            break;
        case 404:
            $Message.error({
                title: i18n.global.t('meos_control_web.page_or_method_not_found')
            });
            break;
        case 405:
            $Message.error({
                title: i18n.global.t('meos_control_web.request_method_error')
            });
            break;
        case 500:
            $Message.error({
                title: i18n.global.t('meos_control_web.server_internal_error')
            });
            break;
        case 503:
            $Message.error({
                title: i18n.global.t('meos_control_web.server_internal_error')
            });
            break;
        case 504:
            $Message.error({
                title: i18n.global.t('meos_control_web.request_timeout')
            });
            break;
        default:
            $Message.error({
                title: i18n.global.t('meos_control_web.error_try_again_later')
            });
    }
}

const iotInterceptor = (data: any) => {
    if (data?.extra?.expiringIots?.length) {
        data.extra.expiringIots.forEach((iot: any) => {
            iotExpireManager?.addIot(iot, 'API');
        });
    }
};

class Http {
    private config: CreateAxiosDefaults<any>;
    private instance: AxiosInstance;
    public constructor(config: CreateAxiosDefaults) {
        this.config = config;
        this.instance = axios.create(this.config);
        this.init();
    }

    public get<T>(url: string, data: Record<string, any> = {}, config: Record<string, any> = {}): HttpResponse<T> {
        config.params = data;
        return new Promise((resolve, reject) => {
            this.instance.get(url, config).then(
                res => {
                    iotInterceptor(res.data);
                    resolve(res.data);
                },
                err => {
                    reject(err);
                }
            );
        });
    }

    public post<T>(url: string, data: Record<string, any> = {}, config: Record<string, any> = {}): HttpResponse<T> {
        return new Promise((resolve, reject) => {
            this.instance.post(url, data, config).then(
                res => {
                    iotInterceptor(res.data);
                    resolve(res.data);
                },
                err => {
                    reject(err);
                }
            );
        });
    }

    public download(url: string, data: Record<string, any> = {}, config: Record<string, any> = {}): void {
        config.responseType = 'blob';
        this.post(url, data, config);
    }

    // eslint-disable-next-line class-methods-use-this
    public open(url: any): void {
        try {
            // const e: HTMLButtonElement | null = document.querySelector(`#${url?.split('/').pop()}`);
            // if (e) {
            //     e.classList.add('iconfont');
            //     e.classList.add('icon-jiazai');
            //     e.classList.add('auto-loading');
            //     e.disabled = true;
            // }
        } catch (error) {
            console.error(error);
        }
    }

    private init() {
        this.instance.interceptors.request.use(
            (config: any) => {
                this.open(config.url);
                const needformdata = diffPost(config.url);
                // 公共参数
                const params = getMergeReqParams();
                const blocked = optBlockReason(config.url || '', params.projectId);
                if (blocked) {
                    if (blocked.silent) {
                        config.autoHandleError = false;
                    }
                    // 不发请求，本地返回与后端 B2 拦截同形的失败结果（HTTP 200 + code≠00000），
                    // 调用方照常按 code 判断，错误提示由下面的响应拦截器统一弹出
                    config.adapter = () => Promise.resolve({ data: { code: blocked.code, message: blocked.message }, status: 200, statusText: 'OK', headers: {}, config });
                }
                Object.assign(config.headers, {
                    groupCode: params.groupCode,
                    projectId: params.projectId,
                    userId: params.userId,
                    username: params.userName || params.userId,
                    token: params.token,
                    'group-code': params.groupCode,
                    'project-id': params.projectId,
                    'accept-language': getLocaleLang(DEFAULT_LANG)
                });

                if (!isEdge()) {
                    const { base } = useStore();
                    const { runningMonitorType = '', IPType = '', startTime = '', endTime = '' } = base.headerConfig;
                    Object.assign(config.headers, {
                        runningMonitorType,
                        IPType,
                        IPDataStartTime: startTime,
                        IPDataEndTime: endTime
                    });
                    // 信息点分精度：命中当前模块规则下的接口时打标（见 precisionWhitelist.ts）
                    applyPrecisionMarker(config.url || '', base.precisionCurrentRule, config.headers);
                }

                if (isEdge() && window.location.pathname) {
                    const pathToModelTypeMap = {
                        // lightxplantrunmonitor: 'LIGHT_MONITORING',
                        // 'ac-operation-control': 'AIR_TERMINAL',
                        // 'ventilation-perception': 'VENTILATION',
                        // 'space-security-control': 'SECURITY',
                        // 'kitchen-fumes': 'KITCHEN_RANGE_HOOD'
                    };
                    const path = window.location.pathname;
                    for (const [key, value] of Object.entries(pathToModelTypeMap)) {
                        if (path.includes(key)) {
                            config.headers.modelType = value;
                            break;
                        }
                    }
                }

                // 运维系统需要额外的参数
                if (!isEmpty(config.url) && (config.url as string).includes('EMS_SaaS_Web')) {
                    Object.assign(params, {
                        puser: {
                            loginDevice: 'PC',
                            userId: params.user_id,
                            pd: params.pd
                        }
                    });
                }

                // 合并参数
                if (config.headers.mergeParams !== false) {
                    config.method === 'post'
                        ? (config.data = Object.assign({ projectId: params.projectId }, config.data))
                        : (config.params = Object.assign({ projectId: params.projectId }, config.params));
                }
                // 修改接口请求方式
                if (config.method === 'post' && needformdata) {
                    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
                    config.data = qs.stringify({ jsonString: JSON.stringify(config.data) });
                }
                return config;
            },
            error => Promise.reject(error)
        );
        this.instance.interceptors.response.use(
            (response: any) => {
                if (response.config?.url) {
                    closeLoading(response.config.url);
                }
                console.log(response.config?.autoHandleError);
                // 配置simple时 返回简单格式 不校验code
                if (response.status === 200 && response.config.simple) {
                    return response;
                }
                if (response.data.code === '00000' || response.data.resultCode === '00000' || response.data.respCode === '00000') {
                    return response;
                }

                let message = response.data.message || response.data.cause || response.data.ResultMsg;
                message = message || i18n.global.t('meos_control_web.server_exception');
                // 是否自动处理错误
                if (response.config?.autoHandleError !== false) {
                    $Message.error({
                        title: message
                    });
                }
                return response;
            },
            error => {
                if (error.config?.url) {
                    closeLoading(error.config.url);
                }
                if (error.config?.autoHandleError !== false && error.response) {
                    errHandle(error.response);
                } else {
                    console.log('cancel', error.request);
                    // 控制台不展示取消请求错误
                    if (axios.isCancel(error)) {
                        return new Promise(() => {});
                    }
                }
                return Promise.reject(error.response || error);
            }
        );
    }
}

const config: CreateAxiosDefaults = {
    baseURL: '/',
    timeout: 24 * 60 * 60 * 1000,
    headers: {
        post: {
            'Content-Type': 'application/json'
        }
    }
};
export default new Http(config);
