import { ref, inject } from 'vue';
import { graphIdKey, copyCompleteKey } from '@/utils/injectionKey';
import { copyDetailData } from '@/api/RelationChartEditor';

export default emits => {
    const graphId = inject(graphIdKey);
    const copyComplete = inject(copyCompleteKey);
    const Mform = ref(null);
    const rules = ref({
        copyName: [{ required: true, message: '必填项未填写', trigger: 'blur' }]
    });
    const params = ref({
        copyName: ''
    });
    // 确认引用
    const checkForm = () => {
        copyComplete.value = false;
        Mform.value.validate(valid => {
            if (valid) {
                copyDetailData({
                    sourceDuplicateId: params.value.copyName,
                    targetDuplicateId: graphId.value
                }).then(res => {
                    if (res.data) {
                        copyComplete.value = true;
                        emits('clearChoose');
                    }
                });
            }
        });
    };
    // 取消引用
    const cancelCopy = () => {
        Mform.value.clearValidate('');
        emits('clearChoose');
    };
    return { Mform, rules, params, checkForm, cancelCopy };
};
