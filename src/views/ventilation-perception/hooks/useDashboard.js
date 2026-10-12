// @ts-ignore
import i18n from '@/localization';
import DockSingleton from '@/hooks/responsiveDock';

// IOT 监测空间
export const dashboardOnlyShowIOTMonitorSpaceInjectKey = Symbol('dashboardOnlyShowIOTMonitorSpace');

// 异常空间过滤
export const dashboardAbnormalSpaceFilterInjectKey = Symbol('dashboardAbnormalSpaceFilter');

// 当前环境 co2 or tdb
export const dashboardCurrentEnvInjectKey = Symbol('dashboardCurrentEnv');

const { getIotData, getObjectAbnormalStatus } = DockSingleton.getInstance();

export default (templateName, templateType) => {
    const subTabsList = computed(() => {
        const indicators = {
            [i18n.global.t('meos_control_web.meos_home_computer_room_logistics')]: [
                { id: 'tdb', name: i18n.global.t('meos_control_web.temperature') },
                { id: 'o2', name: 'O₂' }
            ],
            [i18n.global.t('common.meos_home_parking_lot')]: [{ id: 'cO', name: 'CO' }],

            [i18n.global.t('meos_control_web.meos_home_the_bathroom')]: [
                { id: 'nH3', name: 'NH₃' },
                { id: 'h2S', name: 'H₂S' }
            ],
            [i18n.global.t('meos_control_web.dome')]: [{ id: 'tdb', name: i18n.global.t('meos_control_web.temperature') }]
        };

        if (templateName?.value) {
            return indicators[templateName?.value];
        }
        return [];
    });
    const dashboardOnlyShowIOTMonitorSpace = ref(true);
    const dashboardAbnormalSpaceFilter = ref('');
    const dashboardCurrentEnv = ref(subTabsList?.value[0]?.id);
    watchEffect(() => {
        dashboardCurrentEnv.value = subTabsList?.value[0]?.id;
    });
    watch(
        () => templateType?.value,
        () => {
            dashboardOnlyShowIOTMonitorSpace.value = true;
            dashboardAbnormalSpaceFilter.value = '';
        },
        { immediate: true }
    );
    provide(dashboardOnlyShowIOTMonitorSpaceInjectKey, dashboardOnlyShowIOTMonitorSpace);
    provide(dashboardAbnormalSpaceFilterInjectKey, dashboardAbnormalSpaceFilter);
    provide(dashboardCurrentEnvInjectKey, dashboardCurrentEnv);

    const writeFloorInfoComputed = floor => {
        // 温度平均值
        floor.avgTdbStr = computed(() => {
            let tdbSum = null,
                tdbCount = 0,
                unit = null;
            floor.spaces.forEach(sp => {
                const valObj = getIotData(sp.id, dashboardCurrentEnv.value);
                if (valObj?.dataValue) {
                    tdbCount++;
                    if (tdbSum == null) tdbSum = 0;
                    tdbSum += Number(valObj.dataValue);
                    // eslint-disable-next-line prefer-destructuring
                    unit = valObj.unit || '';
                }
            });
            if (tdbCount > 0) return (tdbSum / tdbCount).toFixed(1) + unit;
            return '--';
        });

        // 异常状态
        floor.abnormal = computed(() => {
            for (let i = 0; i < floor.spaces.length; i++) {
                const valObj = getObjectAbnormalStatus(floor.spaces[i].id);
                if (valObj) {
                    return true;
                }
            }
            return false;
        });
    };

    return {
        dashboardOnlyShowIOTMonitorSpace,
        dashboardAbnormalSpaceFilter,
        dashboardCurrentEnv,
        writeFloorInfoComputed
    };
};
