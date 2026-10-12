import { getMenuConfig } from '@/apis/duty';
import { SUCCESSCODE } from '@/utils/globalVariables';

export const useMenuDataHook = () => {
    const menuloading = ref(true);
    const menuloaded = ref(false);

    const menus = ref();
    const getMenuData = async () => {
        menuloading.value = true;
        try {
            const res = await getMenuConfig({
                menuCode: 'SE'
            });
            if (res.code === SUCCESSCODE) {
                if (res.data && res.data.length) {
                    menus.value = res.data[0];
                }
            }
        } catch (err) {
            console.log(err);
        } finally {
            menuloading.value = false;
        }
    };
    return {
        menuloaded,
        menuloading,
        getMenuData,
        menus
    };
};
