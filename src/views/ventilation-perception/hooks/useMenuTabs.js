// @ts-ignore
import i18n from '@/localization';
import baseStore from '@/store/baseStore';
import { listTemplateType } from '@/apis/lightingRequirements';
import { useRoute } from 'vue-router';

export default function () {
    const route = useRoute();
    const { demandType } = route.query;
    const menusIcon = ref({
        LOGISTICS_VENTILATION: '#icon-machineDogistics', //机房后勤
        PARKING_VENTILATION: '#icon-parkinglotVentilation', //停车场
        TOILET_VENTILATION: '#icon-bathroomVentilation', //卫生间
        DOME_VENTILATION: '#icon-domeVentilation' //穹顶
    });
    const menuData = ref([]);
    const templateType = ref('');
    const templateName = ref('');
    const reloading = ref(false);
    // TODO:待联调接口
    const queryListTemplateType = () => {
        menuData.value = [];
        templateType.value = '';
        listTemplateType({
            projectId: baseStore().projectId,
            demandType: 'VENTILATION'
        }).then(res => {
            const { data, result } = res;
            if (result === 'success') {
                const reg = new RegExp(i18n.global.t('common.meos_home_ventilation'), 'g');
                menuData.value = data.length
                    ? data[0].templateTypes.map(item => {
                          return {
                              id: item.key,
                              name: item.value.replace(reg, ''),
                              icon: menusIcon.value[item.key]
                          };
                      })
                    : null;
                templateType.value = menuData.value?.map(item => item.id).includes(demandType) ? demandType : menuData.value[0]?.id;
                templateName.value = demandType ? menuData.value.filter(item => item.id === demandType)[0]?.name : menuData.value[0]?.name;
            }
        });
    };

    const menusChange = item => {
        if (item.name === templateName?.value) {
            reloading.value = true;
            setTimeout(() => {
                reloading.value = false;
            }, 100);
        } else {
            templateName.value = item.name;
        }
    };

    onMounted(() => {
        queryListTemplateType();
    });

    provide('templateType', templateType);
    provide('templateName', templateName);

    return {
        menuData,
        templateType,
        templateName,
        reloading,
        menusChange
    };
}
