// @ts-ignore
import i18n from '@/localization';
import { queryWeather } from '@/apis/systemDiagram';
import { SUCCESSCODE } from '@/utils/globalVariables';

export default (setTop, onSetTopHeight, isColdHotControl) => {
    const systemId = inject('systemId', ref(''));
    const weatherList = ref([]);
    const isStation = ref(false);

    const getWeatherList = async () => {
        await queryWeather({
            systemId: systemId.value
        }).then(res => {
            if (res.code === SUCCESSCODE) {
                const list = [];
                const { data } = res;
                if (data?.dryBulb) {
                    list.push({
                        icon: '#icon-gqwd',
                        title: i18n.global.t('meos_control_web.dry_bulb_temp'),
                        dataValue: data.dryBulb === -0.9999 ? '--' : data.dryBulb.toFixed(1),
                        unit: '℃'
                    });
                }
                if (data?.wetBulb) {
                    list.push({
                        icon: '#icon-sqwd',
                        title: i18n.global.t('meos_control_web.wet_bulb_temperature'),
                        dataValue: data.wetBulb === -0.9999 ? '--' : data.wetBulb.toFixed(1),
                        unit: '℃'
                    });
                }
                // 判断是否有湿球温度
                if (data?.wetBulb && data?.wetBulb === -0.9999) {
                    isStation.value = true;
                } else {
                    isStation.value = false;
                }
                if (data?.relativeHumidity) {
                    list.push({
                        icon: '#icon-xdsd',
                        title: i18n.global.t('meos_control_web.relative_humidity'),
                        dataValue: data.relativeHumidity === -0.9999 ? '--' : data.relativeHumidity.toFixed(1),
                        unit: '%RH'
                    });
                }
                if (data?.alkane) {
                    list.push({
                        icon: '#icon-hz',
                        title: i18n.global.t('meos_control_web.enthalpy'),
                        dataValue: data.alkane === -0.9999 ? '--' : data.alkane.toFixed(1),
                        unit: 'kJ/kg.dra'
                    });
                }

                weatherList.value = list;
            }
        });
        await nextTick();
        setTop.value?.update();
        onSetTopHeight();
    };

    return {
        getWeatherList,
        weatherList,
        isStation
    };
};
