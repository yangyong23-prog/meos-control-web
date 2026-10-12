// @ts-ignore
import i18n from '@/localization';
import { onScopeDispose } from 'vue';
import { listManualAutomaticControl } from '@/apis/lightingControl';
import baseStore from '@/store/baseStore';

export default function (config) {
    const templateType = inject('templateType', config?.templateType ?? '');
    const curFloorId = inject('curFloorId', config?.curFloorId ?? '');
    const BatchControlList = ref([]);
    const isLoading = ref(false);
    const queryListLightLoopTotal = loading => {
        isLoading.value = true;
        const params = {
            projectId: baseStore().projectId,
            demandTemplateType: templateType.value,
            instanceType: 'PROJECT',
            instanceId: baseStore().projectId
        };
        if (curFloorId?.value) {
            params.instanceType = 'FLOOR';
            params.instanceId = curFloorId.value;
        }
        listManualAutomaticControl(params)
            .then(res => {
                const { result, data } = res;
                if (result !== 'success') return;
                getListLightLoopTotal(data);
            })
            .finally(() => {
                isLoading.value = false;
            });
    };

    const getListLightLoopTotal = (data, type) => {
        if (type === 'sse') {
            // sse推送时不更新状态
            BatchControlList.value.forEach(item => {
                data &&
                    data.length &&
                    data.forEach(newItem => {
                        if (item.funcType === newItem.funcType) {
                            item.demandOnNumber = newItem.demandOnNumber;
                            item.lessOpenNumber = newItem.lessOpenNumber;
                            item.moreOpenNumber = newItem.moreOpenNumber;
                            item.realOnNumber = newItem.realOnNumber;
                            item.children = newItem.children;
                        }
                    });
            });
        } else {
            // selectedValues初始化
            BatchControlList.value = [];
            data &&
                data.length &&
                data.forEach(item => {
                    item.selectedValues = '1';
                    item.manualOperationLoading = false;
                    item.autoLoading = false;
                    item?.children?.forEach(io => {
                        io.manualOperationLoading = false;
                        io.autoLoading = false;
                    });
                    BatchControlList.value.push(item);
                });
        }
    };
    const stopTemplateTypeWatch = watch(
        () => templateType?.value,
        val => {
            if (val) {
                queryListLightLoopTotal();
            }
        },
        {
            immediate: true
        }
    );
    const stopCurFloorIdWatch = watch(
        () => curFloorId?.value,
        () => {
            queryListLightLoopTotal();
        }
    );
    provide('BatchControlList', BatchControlList);

    onScopeDispose(() => {
        stopTemplateTypeWatch();
        stopCurFloorIdWatch();
    });
    onMounted(() => {});

    return {
        BatchControlList,
        isLoading,
        queryListLightLoopTotal
    };
}
