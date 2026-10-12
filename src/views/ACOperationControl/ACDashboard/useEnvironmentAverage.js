import { computed } from 'vue';
import DockSingleton from '@/hooks/responsiveDock';
import { preciseAdd, preciseDivide } from '@/utils/tools';

const createAccumulator = () => ({ sum: null, count: 0, unit: null });

const getValidValue = valueObject => {
    const rawValue = valueObject?.dataValue;
    const value = Number(rawValue);
    const hasValue = rawValue !== null && rawValue !== undefined && rawValue !== '' && rawValue !== '--' && Number.isFinite(value);

    if (!hasValue || !valueObject?.existsIotRule) {
        return null;
    }

    return {
        value,
        unit: valueObject.unit
    };
};

const addValue = (accumulator, validValue) => {
    accumulator.sum = accumulator.sum === null ? validValue.value : preciseAdd(accumulator.sum, validValue.value);
    accumulator.count++;
    accumulator.unit = validValue.unit;
};

const formatAverage = accumulator => {
    if (!accumulator.count) {
        return '--';
    }

    return `${preciseDivide(accumulator.sum, accumulator.count).toFixed(1)}${accumulator.unit ?? '--'}`;
};

/**
 * 按完整建筑树一次性计算建筑、楼层环境参数平均值。
 * 展示筛选不会进入依赖链，每个空间在一次计算中只读取一次 IOT 数据。
 */
export const useEnvironmentAverage = (buildingTree, currentEnvironment) => {
    const { getIotData } = DockSingleton.getInstance();

    return computed(() => {
        const buildingAverageMap = {},
            floorAverageMap = {};

        (buildingTree.value || []).forEach(building => {
            const buildingAccumulator = createAccumulator();

            (building.floors || []).forEach(floor => {
                const floorAccumulator = createAccumulator();

                (floor.spaces || []).forEach(space => {
                    const valueObject = getIotData(space.id, currentEnvironment.value);
                    const validValue = getValidValue(valueObject);
                    if (validValue) {
                        addValue(floorAccumulator, validValue);
                        addValue(buildingAccumulator, validValue);
                    }
                });

                floorAverageMap[floor.id] = formatAverage(floorAccumulator);
            });

            buildingAverageMap[building.id] = formatAverage(buildingAccumulator);
        });

        return {
            buildingAverageMap,
            floorAverageMap
        };
    });
};
