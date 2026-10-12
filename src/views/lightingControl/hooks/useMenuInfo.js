// @ts-ignore
import i18n from '@/localization';
/*
 * @Author: guoxiaohuan
 * @Date: 2024-04-25 15:08:21
 * @LastEditors: guoxiaohuan
 * @LastEditTime: 2024-05-17 10:56:27
 * @Description:
 */
import { listTemplateType } from '@/apis/lightingRequirements';
import baseStore from '@/store/baseStore';
import { useRoute } from 'vue-router';

export default function (isIndoorOutdoor) {
    const route = useRoute();
    const { demandType } = route.query;
    const menusIcon = ref({
        PUBLIC_AREA_LIGHTING: '#icon-activeParking',
        PARKING_LOT_LIGHTING: '#icon-activeDome',
        BUILDING_LIGHTING: '#icon-activeCommonality',
        LANDSCAPE_LIGHTING: '#icon-activeNocturne',
        SIGN_LIGHTING: '#icon-activeParkinglot'
    });
    const menuData = ref([]);
    const templateType = ref('');
    const templateName = ref('');
    const templateTypeLoading = ref(true);
    const queryListTemplateType = () => {
        menuData.value = [];
        templateType.value = '';
        templateTypeLoading.value = true;
        listTemplateType({
            projectId: baseStore().projectId,
            demandType: 'LIGHTING'
        })
            .then(res => {
                const { data, result } = res;
                const templateTypes = data?.[0]?.templateTypes || [];
                if (result === 'success' && templateTypes.length) {
                    if (isIndoorOutdoor.value) {
                        templateTypes.map(item => {
                            // id: item.key,
                            // name: item.value.replace(/照明/g, ''),
                            // icon: menusIcon.value[item.key]
                            if (item.key === 'PUBLIC_AREA_LIGHTING' || item.key === 'PARKING_LOT_LIGHTING') {
                                menuData.value.push({
                                    key: item.key,
                                    label: item.value
                                });
                            }
                        });
                    } else {
                        templateTypes.map(item => {
                            if (item.key === 'BUILDING_LIGHTING' || item.key === 'LANDSCAPE_LIGHTING' || item.key === 'SIGN_LIGHTING') {
                                menuData.value.push({
                                    key: item.key,
                                    label: item.value
                                });
                            }
                        });
                    }
                    // menuData.value =
                    //     data.length &&
                    //     data[0].templateTypes.map(item => {
                    //         return {
                    //             id: item.key,
                    //             name: item.value.replace(/照明/g, ''),
                    //             icon: menusIcon.value[item.key]
                    //         };
                    //     });
                    // templateType.value = menuData.value?.map(item => item.id).includes(demandType) ? demandType : menuData.value[0]?.id;
                    // templateName.value = demandType ? menuData.value.filter(item => item.id === demandType)[0]?.name : menuData.value[0]?.name;
                    // 无任何可用模板类型时兜底为空字符串，避免 undefined 透传到接口入参（runningMonitorSecondType）
                    templateType.value = menuData.value?.map(item => item.key).includes(demandType) ? demandType : menuData.value[0]?.key || '';
                    templateName.value = demandType ? menuData.value.filter(item => item.key === demandType)[0]?.label || '' : menuData.value[0]?.label || '';
                }
            })
            .finally(() => {
                templateTypeLoading.value = false;
            });
    };

    onMounted(() => {
        queryListTemplateType();
    });

    provide('templateType', templateType);
    provide('templateName', templateName);
    provide('menuData', menuData);
    provide('templateTypeLoading', templateTypeLoading);
    return {
        menuData,
        templateType,
        templateName,
        templateTypeLoading
    };
}
