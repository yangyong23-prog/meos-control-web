/* eslint-disable camelcase */
/*
 * @Author: wuyangyang
 * @Date: 2024-01-17 16:11:42
 * @LastEditors: wulong wulong@yushu.biz
 * @LastEditTime: 2026-05-13 17:33:09
 * @Description:
 */
/* eslint-disable no-param-reassign */
import { createRouter, createWebHistory } from 'vue-router';
import { isEmpty } from 'lodash';
import useStore from '@/store';
import { resolvePrecisionModule } from '@/apis/precisionWhitelist';
import routes from './routes';
import { Environment } from '@/config';
import { isMeosFrame } from '@/utils/envUtils';

// Define QiankunProps locally if not found in the package
type QiankunProps = {
    container?: HTMLElement;
    name?: string;
    entry?: string;
    props?: Record<string, any>;
    actions?: {
        setGlobalState?: (state: any) => void;
        [key: string]: any;
    };
    [key: string]: any;
};
// import { QiankunProps } from 'vite-plugin-qiankun/dist/helper';
import { qiankunWindow } from '@/utils/helper';

const createrRouters = (props?: QiankunProps) => {
    let meosSystemProps = null;
    if (qiankunWindow.__POWERED_BY_QIANKUN__) {
        meosSystemProps = props || JSON.parse(sessionStorage.getItem('meosSystem')!);
    }
    const routeBase = qiankunWindow.__POWERED_BY_QIANKUN__
        ? `${meosSystemProps?.microBasePath || '/mid-frame-web'}/${import.meta.env.VITE_PACKAGE_NAME}`
        : `/${import.meta.env.VITE_PACKAGE_NAME}`;

    const history = createWebHistory(routeBase);

    const router = createRouter({
        history,
        routes
    });
    // 信息点分精度：仅在导航成功后（afterEach）解析模块规则写入 store；
    // beforeEach 预设会在导航取消/重定向时留下与实际页面不一致的规则，故不采用
    router.afterEach(to => {
        const { base } = useStore();
        base.setPrecisionCurrentRule(resolvePrecisionModule(to.path, to.params));
    });
    const obj: any = {
        ac: '空调运行标准'
    };
    router.beforeEach(async (to, _from, next) => {
        sessionStorage.removeItem('modelType');
        console.log('router.beforeEach to :>> ', to, _from);

        if (to.path !== _from.path) {
            console.log('menuConfigplmokn-clear');
            (window as any).menuConfigplmokn = {};
        }
        const typeString: string = Array.isArray(to.params.type) ? '' : to.params.type;
        // console.log(props, to, obj[typeString], 'props');
        const { base } = useStore();
        if (to.name !== _from.name) {
            base.setHeaderConfig();
            if (to.meta.runningMonitorType) {
                base.setHeaderConfig({ runningMonitorType: (to.meta.runningMonitorType as string) || '' });
            }
        }
        let meosSystem = null,
            webEnv = null;
        if (!import.meta.env.VITE_DEV_MODE) {
            meosSystem = props || JSON.parse(sessionStorage.getItem('meosSystem')!);
            webEnv = JSON.parse(sessionStorage.getItem('webEnv') || '{}');
        }
        // 孤岛页面打开
        if (to.query?.islandPage) {
            // 使用title优先级： 1、使用URL中携带的title， 2、如果在obj配置来了使用配置， 3、使用to.meta?.name
            const title = to.query.title ? to.query.title : obj[typeString] ? obj[typeString] : to.meta?.name;
            props?.actions?.setGlobalState?.({
                customTitle: {
                    type: '1',
                    params: {
                        title
                    }
                }
            });
        }
        // meos-frame 跳过空调预检查页，兼容旧入口并保留地址参数。
        if (isMeosFrame() && to.name === 'ac-operation-control-pre') {
            return next({ path: '/ac-operation-control', query: to.query, hash: to.hash, replace: true });
        }
        if (!isMeosFrame() && to.name === 'ac-operation-control' && base.getFirstLoadingAc) {
            console.log(_from, to);
            return next({ path: '/ac-operation-control-pre', replace: true });
        }
        if (to.name !== 'ac-operation-control' && to.name !== 'ac-operation-control-pre') {
            base.resetFirstLoading();
        }

        const system: any = {
            user: meosSystem?.getGlobalState.system.user,
            project: { ...meosSystem?.projectItem, groupCode: meosSystem?.getGlobalState.system.user.groupCode },
            token: meosSystem?.token,
            productType: webEnv?.PLATFORM || ''
        };
        if (system || import.meta.env.VITE_DEV_MODE) {
            let projectId, groupCode, token, productType;
            projectId = system?.project?.projectId;
            groupCode = system?.project?.groupCode;
            token = system?.token;
            productType = system?.productType;

            const projectName = system?.project?.projectName;

            if (import.meta.env.VITE_DEV_MODE) {
                if (Environment === 'qa' || Environment === 'test') {
                    token =
                        'eyJhbGciOiJIUzI1NiJ9.eyJkZXZpY2VUeXBlIjoxLCJhdWQiOiJ5dXNodS1zYWFzLWNsaWVudCIsInN1YiI6Inl1c2h1LXVzZXIiLCJhY2NvdW50SWQiOiIxNTA5ODMyMjM3NjE3MTgwNjc0IiwiYWNjb3VudE5hbWUiOiIxODA4ODg4ODEwMCIsImFjY291bnRUeXBlIjoiMiIsImlzcyI6Inl1c2h1IiwianRpIjoiNTMyNjY5MDMtNWQ2Zi00MDUyLWJmNzYtMzQ2YTI2YTUzOTExIn0.wM1XXhdqjFxvkIu6xCEnlcINfzkvSEtEtLKlQtmdoKY';
                } else {
                    // dev环境
                    token =
                        'eyJhbGciOiJIUzI1NiJ9.eyJkZXZpY2VUeXBlIjoxLCJhdWQiOiJ5dXNodS1zYWFzLWNsaWVudCIsInN1YiI6Inl1c2h1LXVzZXIiLCJhY2NvdW50SWQiOiIxNTA5MDU2ODI1MTgwNjgwMTkzIiwiYWNjb3VudE5hbWUiOiLmtYvor5XkurrlkZgyIiwiaXNzIjoieXVzaHUiLCJqdGkiOiJlNDkyMmEzMC00ODI3LTRhZDUtYWU1Yy1iYjcwOTI4YjIxZDYifQ.xf4lOWEXGmvMmOl0Z5tGr8FdnAHOAfF10WCyhSg7jek';
                }
                productType = 'APC';
                projectId = import.meta.env.VITE_DEV_PROJECTID;
                groupCode = import.meta.env.VITE_DEV_GROUPCODE;
                system.user = {
                    pd: '',
                    user_id: '1',
                    person_id: '',
                    userName: '',
                    account: '1234556679',
                    name: '本地人士',
                    userId: '',
                    groupCode: '',
                    group_code: '',
                    isAdmin: '',
                    resultType: '',
                    projects: [],
                    authorizations: [
                        { authorizationId: 'heatControl' },
                        { authorizationId: 'Concernspace' },
                        { authorizationId: 'Consernspace' },
                        { authorizationId: 'coldControl' },
                        { authorizationId: 'MonitorGroupAccess' },
                        { authorizationId: 'xPublicLighting' },
                        { authorizationId: 'xpruncseqcontrol' },
                        { authorizationId: 'airConditioningColdSource' },
                        { authorizationId: 'ACCC' },
                        { authorizationId: 'ACCHManual intervention' },
                        { authorizationId: 'coolhotsyseqcontrol' },
                        { authorizationId: 'StatusAndControl_SPEVCD' },
                        { authorizationId: 'StatusAndControl_AC' },
                        { authorizationId: 'LIGHT_MONITORING' },
                        // 空调热源
                        { authorizationId: 'airConditioningHeatSource' },
                        // 空调冷热源
                        { authorizationId: 'airConditioningHeatAndColdSource' },
                        { authorizationId: 'editingStandards' },
                        // 										 'ventilatexplantrunmonitor', // 通风
                        // 'StatusAndControl_KEF', // 油烟机
                        // 'space_Security', // 安防
                        // 'wsSewageTreatment' // 污水处理
                        { authorizationId: 'ventilatexplantrunmonitor' },
                        { authorizationId: 'StatusAndControl_KEF' },
                        { authorizationId: 'KetManual intervention' },
                        { authorizationId: 'space_Security' },
                        { authorizationId: 'wsSewageTreatment' },
                        { authorizationId: 'wsSewageTreatment' },
                        { authorizationId: 'heatcoldControl' },
                        { authorizationId: 'runretroreportedit' },
                        { authorizationId: 'WSHotWaterControl' },
                        { authorizationId: 'StatusAndControl_WS' }
                    ]
                };
            }

            if (base.projectId !== projectId) {
                base.projectId = projectId;
            }

            if (base.projectName !== projectName) {
                base.projectName = projectName;
            }

            if (base.groupCode !== groupCode) {
                base.groupCode = groupCode;
            }

            const userInfo: any = system?.user;
            if (!isEmpty(userInfo) && base.userInfo !== userInfo) {
                base.userInfo = userInfo;
            }

            if (base.token !== token) {
                base.setToken(token);
            }
            if (base.productType !== productType) {
                base.setProductType(productType);
            }
            return next();
        }
        const { user_id: userId } = base.userInfo;
        if (!userId) {
            return next();
        }
        return next();
    });
    return router;
};

export default createrRouters;
