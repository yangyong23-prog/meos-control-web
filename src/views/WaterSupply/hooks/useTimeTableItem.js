export default props => {
    const coolingMode = ref([]);

    const reset = () => {
        coolingMode.value = [];
    };

    const sysSwitchSetData = ref('');

    // const pointRuleInfoFields = computed(() => props.slotParams?.pointRuleInfoFields);
    const pointRuleInfoFields = obj => {
        if (!obj) {
            return;
        }
        const fields = ['chillWaterOutTempSet', 'chillWaterDetaTempSet'];
        return fields.filter(k => {
            return obj[k];
        });
    };
    const hasField = computed(() => props.slotParams?.hasField);
    const defaultDataByCode = computed(() => props.slotParams?.defaultDataByCode);

    const needInitRendered = computed(() => props.slotParams?.needInitRendered);

    const getFieldDefine = computed(() => props.slotParams?.getFieldDefine);
    const isEditDisabled = computed(() => props.slotParams?.isEditDisabled?.value);
    const isOpen = computed(() => props.slotParams?.isOpen?.value);
    const currentStrategyRule = computed(() => props.slotParams?.currentStrategyRule?.value);
    const curMainClassCode = computed(() => props.slotParams?.curMainClassCode?.value);
    const registerRef = computed(() => props.slotParams?.registerRef);
    const index = computed(() => props.slotParams?.index);
    const baseData = computed(() => props.slotParams?.baseData);

    const isSysSwitchSetDataClose = computed(() => {
        return sysSwitchSetData.value === 'CLOSE';
    });

    watch(
        () => props.data,
        () => {
            if (props.slotParams?.resetCore && typeof props.slotParams.resetCore === 'function') {
                props.slotParams.resetCore();
            }
            reset();
            if (props.data?.isOld && props.data?.coolModes) {
                coolingMode.value = props.data.coolModes;
            }
        },
        { immediate: true }
    );

    return {
        sysSwitchSetData,
        isSysSwitchSetDataClose,

        pointRuleInfoFields,
        hasField,
        defaultDataByCode,

        needInitRendered,

        getFieldDefine,
        isEditDisabled,
        isOpen,
        currentStrategyRule,
        curMainClassCode,
        registerRef,
        index,
        baseData
    };
};
