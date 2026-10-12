// @ts-ignore
import i18n from '@/localization';
export default function (hideUnpack, headerModelView) {
    const showDemandFulfillment = ref(false);
    const showDemandDeviationList = ref(false);
    const showDemandTargetList = ref(false);

    const demandFulfillmentData = ref({});
    const demandDeviationListData = ref({});
    const demandTargetListData = ref({});

    const zIndexCounter = ref(55);

    const unwatcher0 = watch(headerModelView, val => {
        // 切换模型关闭弹窗
        if (val === 'model') {
            showDemandFulfillment.value = false;
            showDemandDeviationList.value = false;
            showDemandTargetList.value = false;
        }
    });
    const unwatcher1 = watch([showDemandFulfillment, showDemandDeviationList, showDemandTargetList], ([fulfillmentVal, deviationVal, targetVal]) => {
        if (fulfillmentVal) {
            showDemandDeviationList.value = false;
            showDemandTargetList.value = false;
        } else if (deviationVal) {
            showDemandFulfillment.value = false;
            showDemandTargetList.value = false;
        } else if (targetVal) {
            showDemandFulfillment.value = false;
            showDemandDeviationList.value = false;
        }

        nextTick(() => {
            hideUnpack.value = fulfillmentVal || deviationVal || targetVal;
        });
    });

    // const unwatcher1 = watch(showDemandFulfillment, val => {
    //     if (!val) {
    //         demandFulfillmentData.value = {};
    //     } else {
    //         showDemandDeviationList.value = false;
    //         showDemandTargetList.value = false;
    //     }

    //     nextTick(() => {
    //         hideUnpack.value = val;
    //     });
    // });

    // const unwatcher2 = watch(showDemandDeviationList, val => {
    //     if (!val) {
    //         demandDeviationListData.value = {};
    //     } else {
    //         showDemandTargetList.value = false;
    //         showDemandFulfillment.value = false;
    //     }
    //     nextTick(() => {
    //         hideUnpack.value = val;
    //     });
    // });

    // const unwatcher3 = watch(showDemandTargetList, val => {
    //     if (!val) {
    //         demandTargetListData.value = {};
    //     } else {
    //         showDemandDeviationList.value = false;
    //         showDemandFulfillment.value = false;
    //     }

    //     nextTick(() => {
    //         hideUnpack.value = val;
    //     });
    // });
    onUnmounted(() => {
        unwatcher0();
        unwatcher1();
    });
    return {
        demandFulfillmentData,
        showDemandFulfillment,
        demandDeviationListData,
        showDemandDeviationList,
        demandTargetListData,
        showDemandTargetList,
        zIndexCounter
    };
}
