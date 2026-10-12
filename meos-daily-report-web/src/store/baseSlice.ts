import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './index';

interface UserInfo {
    pd?: string;
    user_id?: string;
    userId?: string;
    person_id?: string;
    userName?: string;
    groupCode?: string;
    group_code?: string;
    isAdmin?: string;
    resultType?: string;
    projects?: any[];
    authorizations?: any[];
    [key: string]: any;
}

interface BaseState {
    userInfo: UserInfo;
    projectId: string;
    projectName: string;
    groupCode: string;
    token: string;
    authId: string[];
    BASE_URL: string;
    templateTag: string;
    templateType: string;
    templateId: string;
    templateList: any[];
    showACBlockModal: boolean;
    firstloadingAc: boolean;
    nextFunction: any;
    headerConfig: any;
    headerConfigRefreshId: any;
    isCoolHotSystem: boolean;
}

const initialState: BaseState = {
    userInfo: {
        pd: '',
        user_id: '1',
        person_id: '',
        userName: '',
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
    token: '',
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
    isCoolHotSystem: true
};

export const baseSlice = createSlice({
    name: 'base',
    initialState,
    reducers: {
        setUserInfo: (state, action: PayloadAction<UserInfo>) => {
            state.userInfo = { ...state.userInfo, ...action.payload };
        },
        setProjectId: (state, action: PayloadAction<string>) => {
            state.projectId = action.payload;
        },
        setProjectName: (state, action: PayloadAction<string>) => {
            state.projectName = action.payload;
        },
        setGroupCode: (state, action: PayloadAction<string>) => {
            state.groupCode = action.payload;
        },
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
        },
        setHeaderConfig: (state, action: PayloadAction<any>) => {
            state.headerConfig = { ...state.headerConfig, ...action.payload };
        },
        resetFirstLoading: state => {
            state.firstloadingAc = true;
        }
    }
});

export const { setUserInfo, setProjectId, setProjectName, setGroupCode, setToken, setHeaderConfig, resetFirstLoading } = baseSlice.actions;

export const baseSelector = (state: { base: BaseState }) => state.base;

// 检查用户是否有指定权限
export const hasAuthorization = (state: { base: BaseState }, permission: string): boolean => {
    const { authorizations } = state.base.userInfo;
    if (!authorizations || !Array.isArray(authorizations)) {
        return false;
    }
    return authorizations.some((auth: any) => auth?.authorizationId === permission);
};

export const hasAuthorizationByKey = (key?: string) => (state: RootState) => hasAuthorization(state, key);

export default baseSlice.reducer;
