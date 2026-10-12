import { MLoading } from 'meri-plus';
import { listConifgs } from '@/apis/LightingDetail';
import { SUCCESSCODE } from '@/utils/globalVariables';

export const useIntervene = props => {
    const show = ref(false);
    const interventionList = ref([]);
    const templateType = inject('templateType');
    const curFloorId = inject('curFloorId');
    const initIntervene = loading => {
        interventionList.value = [];
        show.value = true;
        // 项目未配置当前照明需求模板类型时 runningMonitorSecondType 为空，接口会返回「无效的用户输入」，此时不发起请求
        if (!templateType?.value) {
            return;
        }
        let Mloading = null;
        if (loading) {
            Mloading = MLoading.service({
                target: '.intervention-scrollbar',
                fullscreen: false,
                duration: 30000,
                lottieName: 'ball',
                loadIconStyle: {
                    width: '100px',
                    height: '100px'
                }
            });
            const obj = {
                runningMonitorSecondType: templateType.value,
                instanceType: props.instanceType,
                instanceIds: props.instanceIds,
                beginDateTime: props.beginDateTime,
                endDateTime: props.endDateTime
            };
            listConifgs(obj).then(res => {
                if (res.code === SUCCESSCODE) {
                    interventionList.value = res.data?.[0]?.configList?.map(v => ({
                        ...v,
                        configId: v.id,
                        instanceId: props.instanceIds?.[0],
                        instanceType: props.instanceType,
                        runningMonitorSecondType: templateType.value
                    }));
                }
            });
            Mloading?.destroy();
        }
    };
    onMounted(() => {
        initIntervene(true);
    });
    watch(
        () => templateType.value,
        () => {
            initIntervene(true);
        }
    );
    watch(
        () => curFloorId.value,
        () => {
            initIntervene(true);
        }
    );
    provide('initIntervene', initIntervene);

    return {
        show,
        interventionList,
        initIntervene,
        templateType
    };
};
