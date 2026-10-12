import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { store } from '../store';

// 定义响应数据类型
export interface BaseResponse<T = any> {
    code: string;
    data: T;
    message?: string;
    resultCode?: string;
    respCode?: string;
    [key: string]: any;
}

export type HttpResponse<T = any> = Promise<AxiosResponse<BaseResponse<T>>>;

// 基础配置
const config: AxiosRequestConfig = {
    baseURL: '/',
    timeout: 24 * 60 * 60 * 1000,
    headers: {
        'Content-Type': 'application/json'
    }
};

class Http {
    private instance: AxiosInstance;

    constructor(config: AxiosRequestConfig) {
        this.instance = axios.create(config);
        this.initInterceptors();
    }

    /**
     * 初始化拦截器
     */
    private initInterceptors() {
        // 请求拦截器
        this.instance.interceptors.request.use(
            (config: any) => {
                // 获取合并到请求头中的参数
                const params = this.getMergeReqParams();

                // 设置通用请求头
                Object.assign(config.headers, {
                    groupCode: params.groupCode,
                    projectId: params.projectId,
                    token: params.token,
                    'group-code': params['group-code'],
                    'project-id': params['project-id']
                });

                // 合并参数
                if (config.headers.mergeParams !== false) {
                    config.method === 'post'
                        ? (config.data = Object.assign({ projectId: params.projectId }, config.data))
                        : (config.params = Object.assign({ projectId: params.projectId }, config.params));
                }

                return config;
            },
            error => {
                return Promise.reject(error);
            }
        );

        // 响应拦截器
        this.instance.interceptors.response.use(
            response => {
                // 检查响应状态码
                if (response.status === 200) {
                    const { data } = response;

                    // 如果是 blob 类型响应（如文件下载），直接返回
                    if (data instanceof Blob) {
                        return response;
                    }

                    // 检查业务状态码
                    if (data.code === '00000' || data.resultCode === '00000' || data.respCode === '00000') {
                        return response;
                    } else {
                        // 处理业务错误
                        const errorMessage = data.message || data.ResultMsg || '服务器异常';
                        console.error('请求错误:', errorMessage);
                        return Promise.reject(new Error(errorMessage));
                    }
                }

                return response;
            },
            error => {
                // 处理HTTP错误
                this.handleError(error);
                return Promise.reject(error);
            }
        );
    }

    /**
     * 获取需合并到请求头中的参数
     * @returns params
     */
    private getMergeReqParams() {
        // 从Redux store获取项目信息和token
        const state = store.getState();
        const { groupCode, projectId, token } = state.base;

        return {
            groupCode,
            projectId,
            token: token || '',
            ['group-code']: groupCode,
            ['project-id']: projectId
        };
    }

    /**
     * 错误处理
     */
    private handleError(error: any) {
        if (error.response) {
            const { status } = error.response;
            let message = '未知错误';

            switch (status) {
                case 403:
                    message = '服务器拒绝请求';
                    break;
                case 404:
                    message = '页面或方法未找到';
                    break;
                case 405:
                    message = '请求方法错误';
                    break;
                case 500:
                case 503:
                    message = '服务器内部错误';
                    break;
                case 504:
                    message = '请求超时';
                    break;
                default:
                    message = '请稍后再试';
            }

            console.error(`HTTP错误 ${status}:`, message);
        } else {
            console.error('网络错误:', error.message);
        }
    }

    /**
     * GET请求
     */
    public get<T>(url: string, params?: Record<string, any>, config?: AxiosRequestConfig): HttpResponse<T> {
        return this.instance.get(url, { params, ...config });
    }

    /**
     * POST请求
     */
    public post<T>(url: string, data?: Record<string, any>, config?: AxiosRequestConfig): HttpResponse<T> {
        return this.instance.post(url, data, config);
    }

    /**
     * PUT请求
     */
    public put<T>(url: string, data?: Record<string, any>, config?: AxiosRequestConfig): HttpResponse<T> {
        return this.instance.put(url, data, config);
    }

    /**
     * DELETE请求
     */
    public delete<T>(url: string, config?: AxiosRequestConfig): HttpResponse<T> {
        return this.instance.delete(url, config);
    }

    /**
     * 下载文件
     */
    public download(url: string, params?: Record<string, any>): Promise<Blob> {
        return this.instance({
            method: 'GET',
            url,
            responseType: 'blob',
            params
        }).then(response => response.data);
    }
}

export default new Http(config);
