// @ts-ignore
import i18n from '@/localization';
/* eslint-disable camelcase */
import { defineStore } from 'pinia';
import { BaseStore } from '@/types/common';
import { getAuth, useErrorMessage } from '@/utils/tools';
import { openWebsite } from '@/utils/websiteNavigation';
import { isEdge } from '@/utils/envUtils';
import { CLOUD_ORIGIN } from '@/config';
import { fetchUpdateTime } from '@/utils/helper';
import type { PrecisionModuleRule } from '@/apis/precisionWhitelist';
export interface HeaderConfig {
    runningMonitorType?: string;
    IPDataStartTime?: string;
    IPDataEndTime?: string;
    IPType?: string;
}

const baseStore = defineStore('base', {
    state: (): BaseStore => ({
        userInfo: {
            pd: '',
            user_id: '1',
            person_id: '',
            userName: '',
            account: '',
            name: '',
            userId: '',
            groupCode: '',
            group_code: '',
            isAdmin: '',
            resultType: '',
            projects: [],
            authorizations: []
        },
        projectId: '',
        projectName: '',
        groupCode: '',
        authId: [],
        BASE_URL: '/',
        templateTag: '',
        templateType: '',
        templateId: '',
        templateList: [],
        showACBlockModal: false,
        firstloadingAc: true,
        nextFunction: null,
        headerConfig: {},
        headerConfigRefreshId: '',
        // 壳配置「持久化数据查询逻辑」= latest（默认 false = 显示更新时间，维持旧行为）
        queryLatestDataMode: false,
        // 路由导航解析出的当前模块规则，拦截器据此打标
        precisionCurrentRule: null as PrecisionModuleRule | null,
        // 控制融合-当前是冷热源系统
        isCoolHotSystem: true,
        token: '',
        productType: ''
    }),
    getters: {
        getShowACBlockModal(state) {
            return state.showACBlockModal;
        },
        getFirstLoadingAc(state) {
            return state.firstloadingAc;
        },
        getProjectName(state) {
            return state.userInfo.projects.find((item: { projectId: any }) => item.projectId === state.projectId)?.projectName;
        },
        getTemplateName(state) {
            return state.templateList?.find((item: any) => state.templateId === item.templateId)?.name;
        },
        hasAuth: (state: any) => (key: string) => {
            try {
                if (!key) {
                    return true;
                }
                let authId: Set<string> = new Set();

                if (state.userInfo?.authorizations.length > 0) {
                    authId = new Set([...state.userInfo.authorizations.map(({ authorizationId }: any) => authorizationId).filter((item: any) => item)]);
                }
                // return state.userInfo?.authorizations.some((item: any) => item.authorizationId === key);
                return [...authId].includes(key);
            } catch (error) {
                return false;
            }
        },
        getToken(state) {
            return state.token;
        },
        getProductType(state) {
            return state.productType;
        },
        /** 「更新时间」显隐：启用运行监控头 && 云端 && 壳配置非「查询距离当前最新的数据」 */
        getShowUpdateTime(state) {
            return Boolean(state.headerConfig?.runningMonitorType) && !isEdge() && !state.queryLatestDataMode;
        }
    },
    actions: {
        setTemplateList(list: any) {
            this.templateList = list;
        },
        setPrecisionCurrentRule(rule: PrecisionModuleRule | null) {
            this.precisionCurrentRule = rule;
        },
        // 壳配置「持久化数据查询逻辑」= latest 时为 true（控制「更新时间」显隐）
        setQueryLatestDataMode(mode: boolean) {
            this.queryLatestDataMode = mode;
        },
        openACBlockModal() {
            this.firstloadingAc = false;
            this.showACBlockModal = true;
        },
        resetFirstLoading() {
            this.firstloadingAc = true;
        },
        // 控制末端弹窗显示
        closeACBlockModal() {
            this.firstloadingAc = false;
            this.showACBlockModal = false;
        },
        setHeaderConfig(config?: HeaderConfig) {
            if (config) {
                this.headerConfig = { ...this.headerConfig, ...config };
                if (!this.headerConfigRefreshId) {
                    this.headerConfigRefreshId = setInterval(() => {
                        fetchUpdateTime();
                    }, 60 * 1000);
                }
            } else {
                this.headerConfig = {};
                clearInterval(this.headerConfigRefreshId);
                this.headerConfigRefreshId = null;
            }
        },
        toMeoi(objId: string, auth: 'MEOI_CatalogList' | 'MEOI_DataAnalysis' = 'MEOI_CatalogList', toUrl = '/meoi-aim-web/fullScreenDetail', query = '&type=all') {
            if (getAuth(auth)) {
                openWebsite(toUrl, {
                    params: `objId=${objId}&f=${auth}${query}`,
                    origin: CLOUD_ORIGIN || ''
                });
            } else {
                useErrorMessage(i18n.global.t('meos_control_web.account_no_permission_contact_admin'));
            }
        },
        setToken(token: string) {
            this.token = token;
        },
        setProductType(productType: string) {
            this.productType = productType;
        }
    }
});

export default baseStore;
