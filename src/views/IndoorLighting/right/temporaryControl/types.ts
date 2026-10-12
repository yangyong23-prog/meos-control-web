import { ObjectTypeEnum, RunningMonitorSecondTypeEnum, RunningMonitorTypeEnum } from '@/types/common';
/**
 * 执行类型
 * @property {Immediately} Immediately 立即执行
 * @property {Manual} Manual 手动执行
 * @property {Multi} Multi 多次执行
 * @property {Once} Once 执行一次
 */
export enum ExecuteTypeEnum {
    Immediately = 'immediately',
    Manual = 'manual',
    Multi = 'multi',
    Once = 'once'
}

/**
 * 照明回路配置
 * @property {Close} Close 关闭
 * @property {NotConfigured} NotConfigured 未配置
 * @property {Open} Open 开启
 */
export enum SettingModeEnum {
    Close = 'CLOSE',
    NotConfigured = 'NOT_CONFIGURED',
    Open = 'OPEN'
}
/**
 * 临时控制任务类型定义
 * @property {string} [taskId] 任务ID
 * @property {string} instanceType 实例类型
 * @property {string} instanceId 实例ID
 * @property {string} runningMonitorType 运行监控类型，例如：LIGHTING
 * @property {string} runningMonitorSecondType 运行监控二级类型，例如：PUBLIC_AREA_LIGHTING
 * @property {ConfigObject} configObject 配置对象
 * @property {ConfigData} configData 详细配置数据
 * @property {string} reason 申请原因
 * @property {string} beginTime 开始时间 (格式：YYYY-MM-DD HH:mm:ss)
 * @property {string} endTime 结束时间 (格式：YYYY-MM-DD HH:mm:ss)
 * @property {string} createTime 创建时间 (格式：YYYY-MM-DD HH:mm:ss)
 * @property {boolean} [isActiveTime] 是否处于激活时间段
 * @property {string} [taskName] 任务名称
 * @property {boolean} [nowDay] 任务是否是今天
 */
export interface TemporaryControlTask {
    taskId: string;
    taskName: string;
    runningMonitorType: RunningMonitorTypeEnum;
    runningMonitorSecondType: RunningMonitorSecondTypeEnum;
    configObject: ConfigObject;
    instance: Instance[];
    configData: ConfigData;
    reason: string;
    beginTime: string;
    endTime: string;
    createTime: string;
    isActiveTime?: boolean;
    nowDay?: boolean;
}

/**
 * 任务配置对象
 * @property {string[]} instanceIds 涉及的实例ID列表
 * @property {string} instanceType 实例类型，例如：SPACE
 */
export interface ConfigObject {
    instanceIds: string[];
    instanceType: string;
}

/**
 * 实例信息
 * @property {string} id 唯一标识 ID
 * @property {string} name 实例名称
 * @property {string} localId 本地编码/ID
 * @property {string} localName 本地名称
 * @property {string} dynamicName 动态显示名称
 */
export interface Instance {
    id: string;
    name: string;
    localId: string;
    localName: string;
    dynamicName: string;
}
/**
 * 任务配置详情
 * @property {string} type 任务类型，例如：manual
 * @property {string} acrossDay 跨天标识
 * @property {object} config 具体配置项
 * @property {string} [controlEndTime] 控制结束时间 (仅当 type 为 manual 时存在，格式：HH:mm)
 * @property {`${string},${string}`[]} [executeTimeRanges] 执行时间范围列表 (仅当 type 为 manual 时存在，格式：HH:mm-HH:mm)
 * @property {string[]} config.circuitIds 涉及回路ID列表
 * @property {SettingModeEnum} config.settingMode 照明回路配置模式，例如：OPEN
 * @property {object} [belong] 归属信息 (仅当 type 为 manual 时存在)
 * @property {string} belong.instanceType 归属实例类型，例如：PROJECT
 * @property {string} belong.instanceId 归属实例ID (注意：接口返回字段拼写可能是 instanceId)
 */
export type ConfigData =
    | {
          type: ExecuteTypeEnum.Manual;
          acrossDay: string;
          config: {
              circuitIds: string[];
              settingMode: SettingModeEnum;
          };
          belong: {
              instanceType: ObjectTypeEnum;
              instanceId: string;
          };
          controlEndTime?: string;
          executeTimeRanges: `${string},${string}`[];
      }
    | {
          type: Exclude<ExecuteTypeEnum, ExecuteTypeEnum.Manual>;
          acrossDay: string;
          config: {
              circuitIds: string[];
              settingMode: SettingModeEnum;
          };
          executeTimeRanges: `${string},${string}`[];
      };

/**
 * 手动任务数据，限定 configData 为手动类型
 */
export type ManualTask = TemporaryControlTask & { configData: Extract<ConfigData, { type: ExecuteTypeEnum.Manual }> };

/**
 * 定时任务数据，限定 configData 为定时相关类型
 */
export type TimedTask = TemporaryControlTask & {
    configData: Extract<ConfigData, { type: ExecuteTypeEnum.Immediately | ExecuteTypeEnum.Once | ExecuteTypeEnum.Multi }>;
};

/**
 * 手动控制组件入参
 * @property {TemporaryControlTask[]} taskList 任务列表
 * @property {ObjectTypeEnum | string} instanceType 实例类型
 * @property {RunningMonitorSecondTypeEnum | string} runningMonitorSecondType 运行监控二级类型
 * @property {TemporaryControlTask | null} activeTask 激活任务
 * @property {boolean} showControl 是否允许控制
 */
export interface TaskProps {
    taskList: TemporaryControlTask[];
    activeTask: TemporaryControlTask | null;
    instanceType: ObjectTypeEnum | string;
    runningMonitorSecondType: RunningMonitorSecondTypeEnum | string;
    showControl?: boolean;
}

/**
 * 手动任务列表组件入参
 * @property {ManualTask[]} list 手动任务列表
 */
export interface ManualTaskListProps {
    list: ManualTask[];
    activeTask: TemporaryControlTask | null;
}

/**
 * 定时任务列表组件入参
 * @property {TimedTask[]} list 定时任务列表
 * @property {TemporaryControlTask | null} activeTask 激活任务
 * @property {boolean} showControl 是否允许控制
 */
export interface TimedTaskListProps {
    list: TimedTask[];
    activeTask: TemporaryControlTask | null;
    showControl?: boolean;
}

/**
 * 手动控制组件触发事件
 * @property {EditTask} EditTask 编辑任务
 * @property {DeleteTask} DeleteTask 删除任务
 * @property {ControlTask} ControlTask 控制任务
 * @property {TimeRanges} TimeRanges 时间范围变化
 */
export enum TaskEmit {
    EditTask = 'editTask',
    DeleteTask = 'deleteTask',
    ControlTask = 'controlTask',
    TimeRanges = 'timeRanges'
}

/**
 * 手动控制组件事件处理函数签名
 * @property {(event: TaskEmit.EditTask, task: TemporaryControlTask) => void} EditTask 编辑任务处理函数
 * @property {(event: TaskEmit.DeleteTask, task: ManualTask) => void} DeleteTask 删除任务处理函数
 * @property {(event: TaskEmit.ControlTask, element: HTMLElement, task: ManualTask, needTime: boolean) => void} ControlTask 控制任务处理函数
 */
export type ManualTaskEmitHandlers = {
    (event: TaskEmit.EditTask, task: ManualTask): void;
    (event: TaskEmit.DeleteTask, task: ManualTask): void;
    (event: TaskEmit.ControlTask, element: HTMLElement, task: ManualTask, needTime: boolean): void;
};

/**
 * 定时控制组件事件处理函数签名
 * @property {(event: TaskEmit.EditTask, task: TimedTask) => void} EditTask 编辑任务处理函数
 * @property {(event: TaskEmit.DeleteTask, task: TimedTask) => void} DeleteTask 删除任务处理函数
 * @property {(event: TaskEmit.ControlTask, element: HTMLElement, task: TimedTask) => void} ControlTask 控制任务处理函数
 * @property {(event: TaskEmit.TimeRanges, times: { startTime: string; endTime: string }[]) => void} TimeRanges 时间范围变化处理函数
 */
export type TimedTaskEmitHandlers = {
    (event: TaskEmit.EditTask, task: TimedTask): void;
    (event: TaskEmit.DeleteTask, task: TimedTask): void;
    (event: TaskEmit.ControlTask, element: HTMLElement, task: TimedTask): void;
    (event: TaskEmit.TimeRanges, times: { startTime: string; endTime: string }[]): void;
};

/**
 * 打开定时任务弹窗参数
 * @property {string} instanceType 实例类型
 * @property {string} instanceId 实例ID
 * @property {string} runningMonitorType 运行监控类型
 * @property {string} runningMonitorSecondType 运行监控二级类型
 * @property {string} runningMonitorSecondTypeId 运行监控二级类型ID
 * @property {TemporaryControlTask | null} editData 编辑数据
 */
export interface OpenScheduledTaskModalParams {
    instanceType: string;
    instanceId: string;
    runningMonitorType: RunningMonitorTypeEnum;
    runningMonitorSecondType: RunningMonitorSecondTypeEnum;
    runningMonitorSecondTypeId: string;
    editData: TemporaryControlTask | null;
    spaceIds?: Array<string>;
}

/**
 * 临时控制首页组件入参
 * @property {string} instanceId 实例ID
 * @property {ObjectTypeEnum | string} instanceType 实例类型
 * @property {RunningMonitorTypeEnum} [runningMonitorType] 运行监控类型
 * @property {boolean} [hasPublicLoop] 是否有公共照明回路
 * @property {boolean} [hasParkingLoop] 是否有停车场照明回路
 */
export interface TemporaryControlIndexProps {
    instanceId: string;
    instanceType: ObjectTypeEnum | string;
    runningMonitorType?: RunningMonitorTypeEnum;
    hasPublicLoop?: boolean;
    hasParkingLoop?: boolean;
    currentFloorObj?: { id: string };
    sceneData?: '1' | '2';
    spaceIds?: Array<string>;
    loadingMain: boolean;
}
