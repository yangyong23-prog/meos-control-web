/*
 * @Author: wuyangyang
 * @Date: 2024-03-08 15:24:41
 * @LastEditors: wuyangyang
 * @LastEditTime: 2024-03-20 14:04:47
 * @Description:
 */
import { ref, nextTick } from 'vue';
import { $Message } from 'meri-plus';

import { uploadFile } from '@/api/chartUpload';

export default updateFileId => {
    const upFileCom = ref();
    const showFileCom = ref(true);
    const loading = ref(false);

    const upFile = async files => {
        if (files[0]) {
            loading.value = true;
            try {
                const res = await uploadFile(files[0].file);
                const { id } = res;
                updateFileId(id);
            } catch (e) {
                $Message.error({
                    title: '上传失败',
                    showClose: false,
                    duration: 3000
                });
            }
            loading.value = false;
            showFileCom.value = false;
            nextTick(() => {
                // 刷新上传组件
                showFileCom.value = true;
            });
        }
    };

    const triggerUpload = () => {
        upFileCom.value?.input?.click();
    };
    return {
        loading,
        showFileCom,
        upFileCom,
        upFile,
        triggerUpload
    };
};
