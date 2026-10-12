<template>
    <div class="app-home">
        <div style="height: 294px; width: 400px">
            <RunHome code="airConditioningHeatAndColdSource" v-bind="data"></RunHome>
        </div>
        <div style="height: 294px; min-width: 400px">
            <RunHome code="airConditioningHeatSource" v-bind="data"></RunHome>
        </div>
        <!-- <div style="height: 300px; min-width: 400px">
            <RunHome code="elevator" v-bind="data"></RunHome>
        </div> -->
        <div style="height: 294px; min-width: 400px">
            <RunHome code="airConditioningColdSource" v-bind="data"></RunHome>
        </div>
        <div style="height: 300px; min-width: 400px">
            <RunHome code="air_conditioning_terminal" v-bind="data"></RunHome>
        </div>
        <div style="height: 300px; min-width: 400px">
            <RunHome code="ventilation_system" v-bind="data"></RunHome>
        </div>
        <!-- <div style="height: 300px; min-width: 400px">
            <RunHome code="ventilation_system" v-bind="data"></RunHome>
        </div>
        <div style="height: 300px; min-width: 400px">
            <RunHome code="run_broadcast" v-bind="data"></RunHome>
        </div> -->
        <!-- <div style="height: 300px; min-width: 400px">
            <RunHome code="cold_station" v-bind="data"></RunHome>
        </div> -->
        <!-- <div style="height: 300px; min-width: 400px">
            <RunHome code="water_drainage" v-bind="data"></RunHome>
        </div> -->
        <!-- <div style="height: 300px; min-width: 400px">
            <RunHome code="airConditioningColdSource" v-bind="data"></RunHome>
        </div>
        <div style="height: 300px; min-width: 400px">
            <RunHome code="elevator" v-bind="data"></RunHome>
        </div>
        <div style="height: 300px; min-width: 400px">
            <RunHome code="park_lot" v-bind="data"></RunHome>
        </div>
        <div style="height: 300px; min-width: 400px">
            <RunHome code="space_security" v-bind="data"></RunHome>
        </div>

        <div style="height: 300px; min-width: 400px">
            <RunHome code="water_drainage" v-bind="data"></RunHome>
        </div>
        <div style="height: 300px; min-width: 400px">
            <RunHome code="passenger_flow" v-bind="data"></RunHome>
        </div>
        <div style="height: 612px; min-width: 400px">
            <RunHome code="env_quality" v-bind="data" size="1*2"></RunHome>
        </div>
        <div style="height: 300px; min-width: 400px">
            <RunHome code="cold_station" v-bind="data"></RunHome>
        </div>
        <div style="height: 300px; min-width: 400px">
            <RunHome code="ventilation_system" v-bind="data"></RunHome>
        </div>
        <div style="height: 300px; min-width: 400px">
            <RunHome code="ACCH" v-bind="data"></RunHome>
        </div>
        <div style="height: 300px; min-width: 400px">
            <RunHome code="air_conditioning_terminal" v-bind="data"></RunHome>
        </div>
        <div style="height: 300px; min-width: 400px">
            <RunHome code="lighting" v-bind="data"></RunHome>
        </div>
        <div style="height: 300px; min-width: 400px">
            <RunHome code="exhaust_system" v-bind="data"></RunHome>
        </div>
        <div style="height: 300px; min-width: 400px">
            <RunHome code="run_broadcast" v-bind="data"></RunHome>
        </div> -->
    </div>
</template>

<script setup>
import i18n from '@/localization';
import RunHome from '@/views/run-home/index.vue';
const data = {
    groupCode: 'TYXK',
    projectId: 'Pj9522457558',
    // groupCode: 'TYIFC',
    // projectId: 'Pj9999999100',
    // token: 'eyJhbGciOiJIUzI1NiJ9.eyJkZXZpY2VUeXBlIjoxLCJhdWQiOiJ5dXNodS1zYWFzLWNsaWVudCIsInN1YiI6Inl1c2h1LXVzZXIiLCJhY2NvdW50SWQiOiIxNTA5MDU2ODI1MTgwNjgwMTkzIiwiYWNjb3VudE5hbWUiOiLmtYvor5XkurrlkZgyIiwiaXNzIjoieXVzaHUiLCJqdGkiOiJlNDkyMmEzMC00ODI3LTRhZDUtYWU1Yy1iYjcwOTI4YjIxZDYifQ.xf4lOWEXGmvMmOl0Z5tGr8FdnAHOAfF10WCyhSg7jek'
    token: 'eyJhbGciOiJIUzI1NiJ9.eyJkZXZpY2VUeXBlIjoxLCJhdWQiOiJ5dXNodS1zYWFzLWNsaWVudCIsInN1YiI6Inl1c2h1LXVzZXIiLCJhY2NvdW50SWQiOiIxNTA5ODMyMjM3NjE3MTgwNjc0IiwiYWNjb3VudE5hbWUiOiIxODA4ODg4ODEwMCIsImFjY291bnRUeXBlIjoiMiIsImlzcyI6Inl1c2h1IiwianRpIjoiNTMyNjY5MDMtNWQ2Zi00MDUyLWJmNzYtMzQ2YTI2YTUzOTExIn0.wM1XXhdqjFxvkIu6xCEnlcINfzkvSEtEtLKlQtmdoKY'
};
import.meta.env.DEV &&
    (window.WebEnv = {
        PREFIX: '/mid-frame-web',
        SAAS_LOGIN_HOST: 'https://tyxk.dev.meos.net.cn/login',
        INNER_LOFIN_HOST: 'https://tyxk.dev.meos.net.cn/login',
        API_BASE_URL: '',
        SERVER_URL: 'https://qa-gw.meos.net.cn',
        // SERVER_URL: 'https://qa-jtzg5.meosedge.com',
        MID_FRAME_SERVER_URL: 'https://tyxk.dev.meos.net.cn/mid-frame-server',
        RWD_URL: 'https://dev.ysbdtp.com',
        LOGIN_URL: 'https://tyxk.dev.meos.net.cn/login',
        INNER_LOGIN: false,
        Edge: false,
        PRODUCT_TYPE: 'APC',
        PLATFORM: 'APC',
        HTML_TITLE: i18n.global.t('operation_duty_homepage.meos_home_yushu_building_digital_twin_intelligent_management_platform'),
        MESSAGE_CENTER: 'https://dev-saas.yushu.center/out/message/',
        MESSAGE_ORIGIN: 'apm',
        APC_BTN_URL: 'https://tyxk.dev.meos.net.cn/mid-frame-web/mid-meeting-web/apc/work-space',
        BOSS_MALL: 'https://dev-saas.yushu.center/microservice/child-enterprise/account/enterpriseManage',
        WEBFUNNY_BURIED_POINT: '',
        HELP_CENTER: {
            SHOW: true,
            HELP_DOCUMENT: '',
            ONLINE_SERVICE: {
                SRC: 'https://yushuservice.s4.udesk.cn/im_client/js/udeskApi.js',
                CODE: '1d1ab3fa',
                LINK: 'https://yushuservice.s4.udesk.cn/im_client/?web_plugin_id=34004'
            },
            FEEDBACK_COMPLAINT: 'https://1868321.s4.udesk.cn/im_client/feedback_tab/new.html'
        },
        COMMON_APP: [
            'https://tyxk.dev.meos.net.cn/meeting/',
            'https://tyxk.dev.meos.net.cn/mid-meeting-web/',
            'https://tyxk.dev.meos.net.cn/yiheng-facility-ops-web/',
            'https://tyxk.dev.meos.net.cn/yiheng-unattended-report-matters-web/'
        ],
        groupCode: 'TYXK'
    });
</script>
<style lang="less" scoped></style>
