// @ts-ignore
import i18n from '@/localization';
import { Rectangle } from './types';

export const mockSpaceTreeData = [
    {
        id: 'SE',
        name: i18n.global.t('meos_control_web.hv_specialty'),
        children: [
            {
                id: 'TT',
                name: 'TEST',
                isCustomizedSetting: true
            }
        ]
    },
    {
        id: 'EL',
        name: i18n.global.t('meos_control_web.elevator_specialty'),
        children: []
    }
];

export const mockZero: Rectangle[] = [
    { timeRange: ['09:30', '09:40'], name: i18n.global.t('meos_control_web.lighting_scene'), type: 'auto' },
    { timeRange: ['09:40', '09:50'], name: i18n.global.t('meos_control_web.lighting_scene'), type: 'auto' },
    { timeRange: ['10:00', '13:10'], name: i18n.global.t('meos_control_web.lighting_scene'), type: 'auto' },
    { timeRange: ['13:10', '13:15'], name: i18n.global.t('meos_control_web.lighting_scene'), type: 'auto' },
    { timeRange: ['23:00', '23:20'], name: i18n.global.t('meos_control_web.lighting_scene'), type: 'auto' }
];

export const mockOne: Rectangle[] = [
    { timeRange: ['09:50', '10:00'], type: 'project' },
    { timeRange: ['11:00', '12:00'], type: 'project' },
    { timeRange: ['12:00', '15:00'], type: 'project' }
];

export const mockTwo: Rectangle[] = [
    { timeRange: ['09:50', '09:55'], type: 'building' },
    { timeRange: ['09:55', '10:00'], type: 'building' },
    { timeRange: ['10:00', '10:55'], type: 'building' },
    { timeRange: ['11:00', '12:00'], type: 'building' },
    { timeRange: ['12:00', '15:00'], type: 'building' }
];

export const mockThree: Rectangle[] = [
    { timeRange: ['09:50', '10:00'], type: 'floor' },
    { timeRange: ['10:00', '12:00'], type: 'floor' },
    { timeRange: ['12:00', '15:00'], type: 'floor' }
];

export const mockFour: Rectangle[] = [
    { timeRange: ['09:50', '10:00'], type: 'space' },
    { timeRange: ['10:00', '12:00'], type: 'space' },
    { timeRange: ['12:00', '15:00'], type: 'space' }
];

export const mockConfigList = [
    {
        title: '',
        isGlobal: true,
        summary: {},
        listData: [
            {
                title: '照明回路1',
                arr: [
                    { name: i18n.global.t('meos_control_web.loop_on'), openCount: 2, total: 10 },
                    { name: i18n.global.t('meos_control_web.feedback_adjustment'), feedback: 3 }
                ],
                status: 'ALL_OPEN'
            },
            {
                title: '照明回路2',
                arr: [
                    { name: i18n.global.t('meos_control_web.loop_on'), openCount: 2, total: 10 },
                    { name: i18n.global.t('meos_control_web.feedback_adjustment'), feedback: 3 }
                ],
                status: 'PARTIAL_OPEN'
            }
        ]
    },
    {
        title: i18n.global.t('meos_control_web.space_config'),
        isGlobal: false,
        summary: {},
        listData: [
            {
                title: '照明回路1',
                arr: [
                    { name: i18n.global.t('meos_control_web.loop_on'), openCount: 2, total: 10 },
                    { name: i18n.global.t('meos_control_web.feedback_adjustment'), feedback: 3 }
                ],
                status: 'ALL_CLOSE'
            },
            {
                title: '照明回路2',
                arr: [
                    { name: i18n.global.t('meos_control_web.loop_on'), openCount: 2, total: 10 },
                    { name: i18n.global.t('meos_control_web.feedback_adjustment'), feedback: 3 }
                ],
                status: 'NONE'
            }
        ]
    }
];

export const mockInterventionList = [
    {
        timeScope: ['2024.03.20 17:00', '2024.03.22 17:00'],
        curParentNode: { name: '大楼' },
        isActive: true,
        isDone: false,
        reason: i18n.global.t('meos_control_web.intervention_due_to_ambient_temperature_and_weather_changes'),
        listData: [mockConfigList[0]]
    },
    {
        timeScope: ['2024.03.20 17:00', '2024.03.22 17:00'],
        curParentNode: undefined,
        isActive: true,
        isDone: false,
        reason: i18n.global.t('meos_control_web.intervention_due_to_ambient_temperature_and_weather_changes'),
        listData: [mockConfigList[1]]
    },
    {
        timeScope: ['2024.03.20 17:00', '2024.03.22 17:00'],
        curParentNode: { name: '禹数大楼' },
        isActive: false,
        isDone: true,
        reason: i18n.global.t('meos_control_web.intervention_due_to_ambient_temperature_and_weather_changes'),
        listData: [mockConfigList[1]]
    }
];
