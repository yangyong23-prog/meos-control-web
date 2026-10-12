import { isEdge } from '@/utils/envUtils';
import { fetchUpdateTime } from '@/utils/helper';
import { GET_MENU_CONFIG } from '@/utils/globalVariables';

window[GET_MENU_CONFIG] = () => window.menuConfigplmokn;
export const setMenuConfig = async (fun, key) => {
    const res = await fun();
    console.log('menuConfigplmokn-set');
    window.menuConfigplmokn = key ? res.default[key] : res.default;
    console.log(window[GET_MENU_CONFIG]());
};
const routes = [
    {
        path: '/system-status-home',
        name: 'home',
        component: () => import('@/views/home/index.vue'),
        meta: {
            name: '系统状态感知首页'
        }
    },
    {
        path: '/WE',
        name: 'MonitoringWE',
        component: () => import('@/views/MonitoringWE/index.vue'),
        meta: {
            name: '弱电感知'
        }
    },
    {
        path: '/WS',
        name: 'WATER SUPPLY',
        component: () => import('@/views/WaterSupply/index.vue'),
        meta: {
            name: '生活给水'
        },
        beforeEnter: async () => {
            await setMenuConfig(() => import('@/views/WaterSupply/constant/index'));
            return true;
        }
    },
    {
        path: '/fire-electricity',
        name: 'fireElectricity',
        component: () => import('@/views/FireElectricity/index.vue'),
        meta: {
            name: '消防电感知'
        },
        beforeEnter: async () => {
            await setMenuConfig(() => import('@/views/FireElectricity/variables'));
            return true;
        }
    },
    {
        path: '/runLog',
        name: 'runLog',
        component: () => import('@/views/runLog/index.vue'),
        meta: {
            name: '运行日志监测'
        }
    },
    {
        path: '/shellRangeConfiguration',
        name: 'shellRangeConfiguration',
        component: () => import('@/views/xshellConfiguration/index.vue'),
        meta: {
            name: '壳配置'
        }
    },
    {
        path: '/space-security-control',
        name: 'space-security-control',
        component: () => import('@/views/SpaceSecurityControl/index.vue'),
        meta: {
            name: '空间安防'
        },
        beforeEnter: async () => {
            await setMenuConfig(() => import('@/views/SpaceSecurityControl/variables'));
            return true;
        }
    },
    {
        path: '/elevator-system',
        name: 'elevator-system',
        component: () => import('@/views/elevatorSystem/index.vue'),
        meta: {
            name: '电梯系统'
        }
    },
    {
        path: '/ac-operation-control-pre',
        name: 'ac-operation-control-pre',
        component: () => import('@/views/ACOperationControl/preGuardPage.vue'),
        meta: {
            name: '空调末端'
        },
        beforeEnter: async () => {
            await setMenuConfig(() => import('@/views/ACOperationControl/variables'));
            return true;
        }
    },
    {
        path: '/ac-operation-control',
        name: 'ac-operation-control',
        component: () => import('@/views/ACOperationControl/index.vue'),
        meta: {
            name: '空调末端'
        },
        beforeEnter: async () => {
            await setMenuConfig(() => import('@/views/ACOperationControl/variables'));
            return true;
        }
    },
    {
        path: '/ac-operation-control/playback',
        name: 'ac-operation-control-playback',
        component: () => import('@/views/ACOperationControl/ACPlayback/index.vue'),
        meta: {
            name: '空调末端-调度回放'
        },
        beforeEnter: async () => {
            await setMenuConfig(() => import('@/views/ACOperationControl/variables'));
            return true;
        }
    },
    {
        path: '/half-section-page',
        name: 'halfSectionPage',
        component: () => import('@/views/HalfSectionPage/index.vue'),
        meta: {
            name: '半剖图'
        }
    },
    {
        path: '/machine-room-safety',
        name: 'machine-room-safety',
        component: () => import('@/views/machine-room-safety/index.vue'),
        meta: {
            name: '机房安全感知'
        }
    },
    {
        path: '/machine-room-safety/space',
        name: 'machine-room-safety-space',
        component: () => import('@/views/machine-room-safety/machine-room-map-view/index.vue'),
        meta: {
            name: '机房安全感知-空间视图',
            noShow: true
        }
    },
    {
        path: '/meoscontrolalarm',
        name: 'meoscontrolalarm',
        component: () => import('@/views/meoscontrolalarm/index.vue'),
        meta: {
            name: '运行报警'
        }
    },

    {
        path: '/xplantrunmonitor',
        name: 'xplantrunmonitor',
        component: () => import('@/views/xplantrunmonitor/index.vue'),
        meta: {
            name: '运行监测'
        }
    },
    {
        path: '/coolhotxplantrunmonitor',
        name: 'coolhotxplantrunmonitor',
        component: () => import('@/views/coolhotxplantrunmonitor/index.vue'),
        meta: {
            name: '冷热源运行监测'
        }
    },
    {
        path: '/lightxplantrunmonitor',
        name: 'lightxplantrunmonitor',
        component: () => import('@/views/IndoorLighting/index.vue'),
        meta: {
            name: '室内照明'
        },
        beforeEnter: async () => {
            await setMenuConfig(() => import('@/views/IndoorLighting/variables'));
            return true;
        }
    },
    {
        path: '/ws-sewage-treatment',
        name: 'WSSewageTreatment',
        component: () => import('@/views/WSSewageTreatment/index.vue'),
        meta: {
            name: '污水处理'
        },
        beforeEnter: async () => {
            await setMenuConfig(() => import('@/views/WSSewageTreatment/variables'));
            return true;
        }
    },
    {
        path: '/outdoorlighting',
        name: 'outdoorlighting',
        component: () => import('@/views/lightingControl/index.vue'),
        meta: {
            name: '室外照明'
        },
        beforeEnter: async () => {
            await setMenuConfig(() => import('@/views/lightingControl/variables'));
            return true;
        }
    },
    {
        path: '/operation-criterion',
        name: 'operationCriterion',
        component: () => import('@/views/operationCriterion/index.vue'),
        meta: {
            name: '运行标准'
        }
    },
    {
        path: '/operationLog',
        name: 'operationLog',
        component: () => import('@/views/operationLog/index.vue'),
        meta: {
            name: '运行日志'
        }
    },
    {
        path: '/runAnalysis',
        name: 'runAnalysis',
        component: () => import('@/views/runAnalysis/index.vue'),
        meta: {
            name: '运行分析'
        }
    },
    // {
    //     path: '/runretroreport',
    //     name: 'runretroreport',
    //     component: () => import('@/views/report/index.vue'),
    //     meta: {
    //         name: '运行复盘报告'
    //     }
    // },
    {
        path: '/businessCalendar',
        name: 'businessCalendar',
        component: () => import('@/views/businessCalendar/index.vue'),
        meta: {
            name: '营业日历'
        }
    },
    {
        path: '/ventilation-perception',
        name: 'ventilation perception',
        component: () => import('@/views/VentPerceptionUpgraded/index.vue'),
        beforeEnter: async () => {
            await setMenuConfig(() => import('@/views/VentPerceptionUpgraded/variables'));
            return true;
        },
        meta: {
            name: '通风感知'
        }
    },
    {
        path: '/passenger-flow-statistics',
        name: 'passenger flow statistics',
        component: () => import('@/views/passenger-flow-statistics/index.vue'),
        meta: {
            name: '客流统计'
        }
    },
    {
        path: '/parking-lot',
        name: 'parking lot',
        component: () => import('@/views/parking-lot/index.vue'),
        meta: {
            name: '停车场'
        }
    },
    {
        path: '/kitchen-fumes',
        name: 'kitchenFumes',
        component: () => import('@/views/KitchenFumes/index.vue'),
        meta: {
            name: '厨房排油烟'
        },
        beforeEnter: async () => {
            await setMenuConfig(() => import('@/views/KitchenFumes/variables'));
            return true;
        }
    },
    {
        path: '/demandCalendar',
        name: 'demandCalendar',
        component: () => import('@/views/demandCalendar/index.vue'),
        meta: {
            name: '需求日历'
        }
    },
    {
        path: '/lightingDemandManagement',
        name: 'lightingDemandManagement',
        component: () => import('@/views/demand-management-light-upgraded/index.vue'),
        meta: {
            name: '照明需求管理-升级'
        }
    },
    {
        path: '/debug-tools-iot',
        name: 'debugToolsIot',
        component: () => import('@/views/debug-tools-iot/index.vue'),
        meta: {
            name: '调试工具IOT'
        }
    },
    {
        path: '/demand-management/:type/home',
        name: 'demandManagementHome',
        component: () => import('@/views/DemandManagementHome/index.vue'),
        meta: {
            name: '需求管理'
        }
    },
    {
        // 这个路由专为IFC设置，原因在于IFC的x-frame框架不支持多层级路由
        // 为什么标品不用这个路由？ 因为标品的路由已经发布到SAAS，考虑兼容性就不修改标品路由了
        path: '/demand-management-:type',
        name: 'IFCdemandManagementHome',
        component: () => import('@/views/DemandManagementHome/index.vue'),
        meta: {
            name: '需求管理'
        }
    },
    {
        path: '/operation-monitor/:majorCode/graph',
        name: 'operationMonitorGraph',
        component: () => import('@/views/operationMonitoring/index.vue'),
        meta: {
            name: '运行监控-关系图'
        }
    },
    // {
    //     path: '/SE-pre',
    //     name: 'SEEntry',
    //     component: () => import('@/views/SEPre/index.vue'),
    //     meta: {
    //         name: '变配电入口'
    //     }
    // },
    {
        path: '/:majorCode',
        name: 'systemStatusGraph',
        component: () => import('@/views/operationMonitoring/entry.vue'),
        meta: {
            name: '系统状态感知-关系图'
        },
        beforeEnter: async to => {
            const { majorCode } = to.params;
            await setMenuConfig(() => import('@/views/operationMonitoring/variables'), majorCode);
            if (isEdge()) return true;
            if (majorCode === 'AC' || majorCode === 'ACCI') {
                await fetchUpdateTime();
            }
            return true;
        }
    },
    {
        path: '/filter-system-graph/:majorCode',
        name: 'ACsystemStatusGraph',
        component: () => import('@/views/ACoperationMonitoring/entry.vue'),
        meta: {
            name: '系统状态感知-关系图'
        },
        beforeEnter: async to => {
            const { majorCode } = to.params;
            console.log(majorCode);
            await setMenuConfig(() => import('@/views/ACoperationMonitoring/variables'), majorCode);
            if (isEdge()) return true;
            if (majorCode === 'AC' || majorCode === 'ACCI') {
                await fetchUpdateTime();
            }
            return true;
        }
    },
    {
        path: '/system/:majorCode',
        name: 'system',
        component: () => import('@/views/System/index.vue'),
        meta: {
            name: '系统状态感知-关系图'
        },
        beforeEnter: async to => {
            if (isEdge()) return true;
            await fetchUpdateTime();
            return true;
        }
    },
    {
        path: '/system/ACAH',
        name: 'system-ACAH',
        component: () => import('@/views/System-Heat-Source/index.vue'),
        meta: {
            name: '系统状态感知-热源-关系图'
        },
        beforeEnter: async () => {
            await setMenuConfig(() => import('@/views/System-Heat-Source/constant/variable'));
            if (isEdge()) return true;
            await fetchUpdateTime();
            return true;
        }
    },
    {
        path: '/ACAC',
        name: 'ACAC',
        component: () => import('@/views/ACAC/index.vue'),
        meta: {
            name: '系统状态感知-关系图'
        },
        beforeEnter: async () => {
            await setMenuConfig(() => import('@/views/ACAC/variables'));
            if (isEdge()) return true;
            await fetchUpdateTime();

            return true;
        }
    },
    {
        path: '/system/ACAI',
        name: 'system-ACAI',
        component: () => import('@/views/ACAI/index.vue'),
        meta: {
            name: '空调冷热源'
        },
        beforeEnter: async () => {
            await setMenuConfig(() => import('@/views/ACAI/variables'));
            if (isEdge()) return true;
            await fetchUpdateTime();
            return true;
        }
    },

    {
        path: '/strategicinterventions',
        name: 'strategicinterventions',
        component: () => import('@/views/strategicInterventions/index.vue'),
        meta: {
            name: '时间表',
            noShow: true
        },
        beforeEnter: async () => {
            await setMenuConfig(() => import('@/views/strategicInterventions/variables'));
            return true;
        }
    },
    {
        path: '/cold-hot-strategic-interventions',
        name: 'coldHotStrategicInterventions',
        component: () => import('@/views/coldHotStrategicInterventions/index.vue'),
        meta: {
            name: '冷热源时间表',
            noShow: true
        },
        beforeEnter: async () => {
            await setMenuConfig(() => import('@/views/coldHotStrategicInterventions/variables'));
            return true;
        }
    },
    {
        path: '/cold-hot-timetable-strategic-interventions',
        name: 'coldHotAirTableTimePartitionStrategicInterventions',
        component: () => import('@/views/coldHotStrategicInterventions/AirTableTime/index.vue'),
        meta: {
            name: '冷热源分区时间表',
            noShow: true
        },
        beforeEnter: async () => {
            await setMenuConfig(() => import('@/views/coldHotStrategicInterventions/variables'));
            return true;
        }
    },
    {
        path: '/heat-strategic-interventions',
        name: 'HeatStrategicInterventions',
        component: () => import('@/views/HeatStrategicInterventions/index.vue'),
        meta: {
            name: '热站时间表',
            noShow: true
        },
        beforeEnter: async () => {
            await setMenuConfig(() => import('@/views/HeatStrategicInterventions/variables'));
            return true;
        }
    },
    {
        path: '/system/TOILET',
        name: 'Toilet',
        component: () => import('@/views/toilet/index.vue'),
        meta: {
            name: '卫生间',
            noShow: true
        },
        beforeEnter: async () => {
            await setMenuConfig(() => import('@/views/toilet/variables'));
            return true;
        }
    },
    {
        path: '/system/SEEA',
        name: 'Solar',
        component: () => import('@/views/SEEA/index.vue'),
        meta: {
            name: '光伏系统',
            noShow: true
        },
        beforeEnter: async () => {
            await setMenuConfig(() => import('@/views/SEEA/constants/index'));
            if (isEdge()) return true;
            await fetchUpdateTime();
            return true;
        }
    },
    {
        path: '/runretroreport',
        name: '运行复盘报告',
        component: () => import('@/views/operationReviewReport/index.vue'),
        meta: {
            name: '运行复盘报告',
            noShow: true
        }
    },
    {
        path: '/AI',
        name: 'AI',
        component: () => import('@/views/AI/index.vue'),
        meta: {
            name: '运行智能体',
            noShow: true
        }
    },

    {
        path: '/LineTest',
        name: '生长线测试',
        component: () => import('@/views/AI/components/GrowLine/LineTest.vue'),
        meta: {
            name: '运行智能体',
            noShow: true
        }
    }
    // {
    //     path: '/photovoltaic-system',
    //     name: 'Photovoltaic',
    //     component: () => import('@/views/photovoltaicSystem/index.vue'),
    //     meta: {
    //         name: '光伏系统',
    //         noShow: true
    //     }
    // }
];

const testRoute = [
    {
        path: '/equipment-list',
        name: 'equipment-list',
        component: () => import('@/views/test/equipment-list/index.vue'),
        meta: {
            name: 'equipment-list'
        },
        beforeEnter: async () => {
            await setMenuConfig(() => import('@/views/test/equipment-list/variables'));
        }
    },
    {
        path: '/test-sse',
        name: 'testSSE',
        component: () => import('@/views/test/SSETest/index.vue'),
        meta: {
            name: '测试SSE'
        }
    },
    {
        path: '/test-common-drawer',
        name: 'testCommonDrawer',
        component: () => import('@/views/test/CommonDrawerTest/index.vue'),
        meta: {
            name: '测试CommonDrawer'
        }
    },
    {
        path: '/test',
        name: 'test',
        component: () => import('@/views/test/Test.vue'),
        meta: {
            name: '测试'
        }
    },

    {
        path: '/test-floor-map',
        name: 'testFloorMap',
        component: () => import('@/views/test/DemoFloorMap/index.vue'),
        meta: {
            name: '测试'
        }
    },
    {
        path: '/test-light-abnormal',
        name: 'test-light-abnormal',
        component: () => import('@/views/test/LightAbnormalTest/index.vue'),
        meta: {
            name: 'test-light-abnormal'
        }
    },
    {
        path: '/robot-poc',
        name: 'robot-poc',
        component: () => import('@/views/robotPoc/index.vue'),
        meta: {
            name: '机器人POC'
        }
    },
    {
        path: '/test-shell-config',
        name: 'test-shell-config',
        component: () => import('@/views/test/ShellConfigTest/index.vue'),
        meta: {
            name: 'test-shell-config'
        }
    },
    {
        path: '/test-base-info',
        name: 'test-base-info',
        component: () => import('@/views/test/BaseInfoTest/index.vue'),
        meta: {
            name: 'test-base-info'
        }
    },
    {
        path: '/test/iot/expire',
        name: 'test-iot-expire',
        component: () => import('@/views/test/iotExpireManagerTest/index.vue'),
        meta: {
            name: 'test-iot-expire'
        }
    },
    {
        path: '/monitor-player-test',
        name: 'MonitorPlayerTest',
        component: () => import('@/views/test/MonitorPlayerTest/index.vue'),
        meta: {
            name: 'Controls'
        }
    },
    {
        path: '/mutiple-monitor-player-test',
        name: 'MutipleMonitorPlayerTest',
        component: () => import('@/views/test/MutipleMonitorPlayerTest/index.vue'),
        meta: {
            name: 'mutiple-monitor-player-test'
        }
    },
    {
        path: '/player-ui-test',
        name: 'PlayerUITest',
        component: () => import('@/views/test/PlayerUITest/index.vue'),
        meta: {
            name: 'player-ui-test'
        }
    },
    {
        path: '/player-component-test',
        name: 'playerComponentTest',
        component: () => import('@/views/test/VedioComponent/index.vue'),
        meta: {
            name: 'playerComponentTest'
        }
    },
    {
        path: '/test/floor-select',
        name: 'test-floor-select',
        component: () => import('@/views/test/FloorSelectTest/index.vue'),
        meta: {
            name: 'test-floor-select'
        }
    },
    {
        path: '/demo',
        name: 'demo',
        component: () => import('@/views/demo/index.vue'),
        meta: {
            name: 'demo'
        }
    },
    {
        path: '/test/loading-memory',
        name: 'test-loading-memory',
        component: () => import('@/views/test/LoadingMemoryTest/index.vue'),
        meta: {
            name: 'test-loading-memory'
        }
    },
    {
        path: '/test/dynamic-effect',
        name: 'test-dynamic-effect',
        component: () => import('@/views/test/DynamicEffectTest.vue'),
        meta: {
            name: 'test-dynamic-effect'
        }
    },
    {
        path: '/test/relation-chart',
        name: 'RelationChartMemoryTest',
        component: () => import('@/views/test/RelationChartMemoryTest/index.vue'),
        meta: {
            name: 'RelationChartMemoryTest'
        }
    },
    {
        path: '/test/security-performance',
        name: 'SecurityPerformanceTest',
        component: () => import('@/views/test/testSecurityPerformance/index.vue')
    },
    {
        path: '/test/half-graph',
        name: 'HalfGraph',
        component: () => import('@/views/test/HalfGraph/index.vue')
    },

    {
        path: '/test/topologygraph',
        name: 'Graph3dDemo',
        component: () => import('@/views/test/TopologyGraphTest/TopologyGraphDemo.vue')
    }
];

export { routes };

export default [...routes, ...testRoute];
