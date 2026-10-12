// @ts-ignore
import i18n from '@/localization';
import { generateBuildFloors } from '../utils/index';

export default ({ floorIdsList, floorIdsAbnormal, currentFloorObj }) => {
    const buildFloors = computed(() => {
        const _building = generateBuildFloors(Array.from(new Set(floorIdsList.value)));
        if (_building?.length) {
            _building.forEach(items => {
                items.floorList.forEach(item => {
                    if (floorIdsAbnormal.value.includes(item.id)) {
                        item.dot = true;
                    }
                });
            });
        }
        if (!currentFloorObj?.value && _building.length > 1) {
            return [{ name: i18n.global.t('meos_control_web.project'), id: 'project', floorList: [] }, ..._building];
        }

        return _building;
    });

    return { buildFloors };
};
