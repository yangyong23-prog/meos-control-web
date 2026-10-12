import { ref, toRaw } from 'vue';

export default ({ request, handleCallback, pageSize = 20, initPage = 1 }) => {
    const current = ref(initPage);
    const size = pageSize;
    const data = ref([]);
    const loading = ref(false);
    const noData = ref(false);
    const noMoreData = ref(false);
    // delete pageDto
    const totalParams = ref({ pageSize: size, page: current });

    const fetchData = ({ params = {}, fresh = false }) => {
        if (fresh) {
            current.value = initPage;
            data.value = [];
            noMoreData.value = false;
        } else {
            current.value += 1;
        }
        if (noMoreData.value) return;
        loading.value = true;
        const queryParams = { ...toRaw(totalParams).value, ...params };
        console.log('queryParams :>> ', queryParams);
        return request(queryParams)
            .then(res => {
                loading.value = false;
                if (res) {
                    console.log('res :>> ', res);
                    try {
                        const { records, current: mCurrent, total } = handleCallback ? handleCallback(res, params) : res;
                        if (mCurrent === 1) {
                            data.value = records;
                            if (records.length === 0) noData.value = true;
                        } else {
                            data.value.push(...records);
                        }
                        if (data.value.length >= total) {
                            noMoreData.value = true;
                        }
                    } catch (error) {
                        console.log('usePage error :>> ', error);
                        loading.value = false;
                    }
                }
            })
            .catch(() => {
                loading.value = false;
            });
    };

    return {
        fetchData,
        data,
        loading,
        noData,
        current,
        noMoreData
    };
};
