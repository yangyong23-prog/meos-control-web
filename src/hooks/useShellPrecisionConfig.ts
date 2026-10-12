import useStore from '@/store';
import { shellConfigQuerySimple } from '@/apis/xshellConfiguration';
import { SUCCESSCODE } from '@/utils/globalVariables';

/**
 * 壳配置「持久化数据查询规则」消费 hook（信息点分精度）
 * 关联文档：docs/信息点分精度前端技术方案.md
 * 不做结果缓存：壳配置的写入（配置页）与消费（冷源/冷热源等系统）可能部署在不同微前端环境、
 * 不同会话/用户，无法保证一次性内存缓存可靠失效，故每次进入模块都重新查询。
 * 仅对同一时刻的并发请求做单飞去重（in-flight dedup），请求 settle 后即清除，不缓存查询结果。
 * 请求失败、或对应场景/配置项缺失时不更新 store（维持默认显隐行为）。
 */
// 后端契约常量（唯一来源）：配置页 PersistentDataRule.vue 也从此处 import
export const QUERY_SCENE_NAME = 'persistent_data_rule';
export const GROUP_NAME = 'group_persistent_data_rule';
export const QUERY_LOGIC_CODE = 'persistent_data_query_logic';
export const QUERY_INTERVAL_CODE = 'persistent_data_time_interval';
export const LATEST_LOGIC_VALUE = 'latest';

// SystemAndControl 为多模块复用组件，其中仅空调冷热源（ACAI）需要查询壳配置控制「更新时间」显隐
export const ACAI_RUNNING_MONITOR_TYPE = 'AIR_CONDITIONING_C_H_SOURCE';

// projectId -> 进行中的请求 Promise；仅作并发单飞去重，settle 后立即清除，不缓存查询结果
const projectIdInFlight = new Map<string, Promise<void>>();

export const useShellPrecisionConfig = () => {
    const { base } = useStore();

    const fetchShellPrecisionConfig = () => {
        const { projectId } = base;
        if (!projectId) return Promise.resolve();

        // 单飞去重：ACAI 模块入口存在多条调用路径（setRunningMonitorType 与 onMounted 都会触发），
        // 同一时刻对同一 projectId 只发一次请求，避免重复请求；但结果不缓存，下次进入模块仍重新查询。
        if (projectIdInFlight.has(projectId)) return projectIdInFlight.get(projectId)!;

        const task = shellConfigQuerySimple({ scene: QUERY_SCENE_NAME })
            .then(res => {
                if (res?.code !== SUCCESSCODE || !Array.isArray(res.data)) {
                    // 业务失败：不更新 store（维持默认显隐行为）
                    console.warn('useShellPrecisionConfig: 查询壳配置返回异常，维持默认显隐行为', res?.code);
                    return;
                }
                let items: any[] = [];
                res.data.forEach((sceneData: any) => {
                    Array.isArray(sceneData?.groups) &&
                        sceneData.groups.forEach((group: any) => {
                            if (group?.group === GROUP_NAME && Array.isArray(group?.items)) {
                                items = [...group.items];
                            }
                        });
                });
                const logicItem = items.find((v: any) => v?.code === QUERY_LOGIC_CODE);
                // 配置项缺失时维持默认显隐，不做隐式 false 判定
                if (!logicItem) return;
                const queryLogic = logicItem.shellConfigValue ?? logicItem.value;
                base.setQueryLatestDataMode(queryLogic === LATEST_LOGIC_VALUE);
            })
            .catch(e => {
                console.warn('useShellPrecisionConfig: 查询壳配置失败，维持默认显隐行为', e);
            })
            .finally(() => {
                // settle（成功或失败）后即清除，不缓存解析结果；下次进入模块重新查询
                projectIdInFlight.delete(projectId);
            });
        projectIdInFlight.set(projectId, task);
        return task;
    };

    return { fetchShellPrecisionConfig };
};
