import { store } from './index';
import { setUserInfo, setProjectId, setProjectName, setGroupCode, setToken, setHeaderConfig } from './baseSlice';
import { isEmpty } from 'lodash';
import { PERMISSIONS } from '@/constants/permissions';
import { Environment } from '@/config';

// 初始化store的函数，参考主项目的路由守卫逻辑
export const initializeStore = (props?: any) => {
    let meosSystem = null;
    if (props) {
        meosSystem = props;
    } else {
        const stored = sessionStorage.getItem('meosSystem');
        if (stored) {
            meosSystem = JSON.parse(stored);
        }
    }

    if (meosSystem || import.meta.env.MODE === 'development') {
        let projectId, groupCode, projectName, token;

        // 从微前端props或sessionStorage获取数据
        projectId = meosSystem?.projectItem?.projectId;
        groupCode = meosSystem?.projectItem?.groupCode || meosSystem?.getGlobalState?.system?.user?.groupCode;
        projectName = meosSystem?.projectItem?.projectName;
        token = meosSystem?.token;

        // 开发环境使用环境变量
        if (import.meta.env.MODE === 'development') {
            projectId = import.meta.env.VITE_DEV_PROJECTID;
            groupCode = import.meta.env.VITE_DEV_GROUPCODE;

            if (Environment === 'qa' || Environment === 'test') {
                token =
                    'eyJhbGciOiJIUzI1NiJ9.eyJkZXZpY2VUeXBlIjoxLCJhdWQiOiJ5dXNodS1zYWFzLWNsaWVudCIsInN1YiI6Inl1c2h1LXVzZXIiLCJhY2NvdW50SWQiOiIxNTA5ODMyMjM3NjE3MTgwNjc0IiwiYWNjb3VudE5hbWUiOiIxODA4ODg4ODEwMCIsImFjY291bnRUeXBlIjoiMiIsImlzcyI6Inl1c2h1IiwianRpIjoiNTMyNjY5MDMtNWQ2Zi00MDUyLWJmNzYtMzQ2YTI2YTUzOTExIn0.wM1XXhdqjFxvkIu6xCEnlcINfzkvSEtEtLKlQtmdoKY';
            } else {
                // dev环境的默认token
                token =
                    'eyJhbGciOiJIUzI1NiJ9.eyJkZXZpY2VUeXBlIjoxLCJhdWQiOiJ5dXNodS1zYWFzLWNsaWVudCIsInN1YiI6Inl1c2h1LXVzZXIiLCJhY2NvdW50SWQiOiIxNTA5MDU2ODI1MTgwNjgwMTkzIiwiYWNjb3VudE5hbWUiOiLmtYvor5XkurrlkZgyIiwiaXNzIjoieXVzaHUiLCJqdGkiOiJlNDkyMmEzMC00ODI3LTRhZDUtYWU1Yy1iYjcwOTI4YjIxZDYifQ.xf4lOWEXGmvMmOl0Z5tGr8FdnAHOAfF10WCyhSg7jek';
            }

            // 设置开发环境的默认用户信息
            const devUserInfo = {
                pd: '',
                user_id: '1',
                person_id: '',
                userName: '',
                userId: '',
                groupCode: groupCode || '',
                group_code: groupCode || '',
                isAdmin: '',
                resultType: '',
                projects: [],
                authorizations: [
                    { authorizationId: PERMISSIONS.RUNRETROREPORT_EDIT },
                    { authorizationId: PERMISSIONS.HEAT_CONTROL },
                    { authorizationId: PERMISSIONS.CONCERN_SPACE },
                    { authorizationId: PERMISSIONS.COLD_CONTROL },
                    { authorizationId: PERMISSIONS.MONITOR_GROUP_ACCESS },
                    { authorizationId: PERMISSIONS.PUBLIC_LIGHTING },
                    { authorizationId: PERMISSIONS.COOL_HOT_SYS_EQ_CONTROL },
                    { authorizationId: PERMISSIONS.AIR_CONDITIONING_COLD_SOURCE },
                    { authorizationId: PERMISSIONS.ACCC },
                    { authorizationId: PERMISSIONS.ACCH_MANUAL_INTERVENTION },
                    { authorizationId: PERMISSIONS.COOL_HOT_SYS_CONTROL },
                    { authorizationId: PERMISSIONS.STATUS_AND_CONTROL_SPEVCD },
                    { authorizationId: PERMISSIONS.STATUS_AND_CONTROL_AC },
                    { authorizationId: PERMISSIONS.LIGHT_MONITORING },
                    { authorizationId: PERMISSIONS.AIR_CONDITIONING_HEAT_SOURCE },
                    { authorizationId: PERMISSIONS.EDITING_STANDARDS },
                    { authorizationId: PERMISSIONS.DOWNLOAD_DAILY_REPORT }
                ]
            };

            store.dispatch(setUserInfo(devUserInfo));
        }

        // 更新store状态
        if (projectId) {
            store.dispatch(setProjectId(projectId));
        }

        if (projectName) {
            store.dispatch(setProjectName(projectName));
        } else if (import.meta.env.MODE === 'development') {
            store.dispatch(setProjectName('开发环境'));
        }

        if (groupCode) {
            store.dispatch(setGroupCode(groupCode));
        }

        // 设置token
        if (token) {
            store.dispatch(setToken(token));
        }

        // 设置用户信息
        if (meosSystem?.getGlobalState?.system?.user) {
            const userInfo = {
                ...meosSystem.getGlobalState.system.user,
                groupCode: groupCode || meosSystem.getGlobalState.system.user.groupCode
            };
            if (!isEmpty(userInfo)) {
                store.dispatch(setUserInfo(userInfo));
            }
        }

        console.log('Store initialized with:', {
            projectId,
            groupCode,
            projectName,
            userInfo: store.getState().base.userInfo
        });
    }
};
