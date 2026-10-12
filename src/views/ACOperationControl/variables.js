import { AIR_TERMINAL } from '@/utils/globalVariables';

export const CONTROL_API_TYPE = 'new';
export const PRODUCT_CODE = 'StatusAndControl_SPEVCD';
export const SUBSCRIBE_TYPE = AIR_TERMINAL;
export const RUNNING_MONITOR_TYPE = AIR_TERMINAL;
export const PERMISSION = '';
export const INSTANCE_TYPE = {
    PROJECT: 'PROJECT',
    BUILDING: 'BUILDING',
    FLOOR: 'FLOOR',
    SPACE: 'SPACE'
};

export const SPACE_GRID_PREFIX = 'spaceGrid';

export const envToScheduleStatusMap = {
    tdb: 'tdbTargetType',
    cO2: 'cO2targetType'
};
export const envToControlAimMap = {
    tdb: 'tempTwinControlAim',
    cO2: 'cO2ControlAim',
    rH: 'humidityTwinsControlTarget',
    relativePressureDiffToOtherSpace: 'pressureDiffDigitalTwinTarget'
};
export const NEW_CLASS_CODE_LIST = ['ACAHG', 'ACATAH'];

export const envToParamsMap = Object.entries(envToControlAimMap).reduce((acc, [env, controlAimKey]) => {
    const scheduleStatusKey = envToScheduleStatusMap[env];
    const addScheduleStatus = scheduleStatusKey ? [scheduleStatusKey] : [];
    acc[env] = [controlAimKey, ...addScheduleStatus];
    return acc;
}, {});

export default { CONTROL_API_TYPE, PRODUCT_CODE, RUNNING_MONITOR_TYPE, SUBSCRIBE_TYPE, PERMISSION };
