/* eslint-disable camelcase */
export interface BaseResponse<T> {
    [x: string]: any;
    result: string;
    code: string;
    traceId: string;
    timestamp: string;
    data: T;
    content: T;
    message?: string;
}
export type HttpResponse<T> = Promise<BaseResponse<T>>;
/**
 * 用户项目
 */
export interface Project extends Record<string, any> {
    detailAddress: string;
    functionType: string;
    groupCode: string;
    latitude: string;
    liveStatus: string;
    longitude: string;
    partitionAbbr: string;
    productLine: string;
    projName: string;
    projectId: string;
    projectLocalID: string;
    projectLocalName: string;
    projectName: string;
    projectPicture: string;
    totalArea: string;
}
/**
 * 用户权限R1
 */
export interface AuthorizationR1 extends Record<string, any> {
    authorizationName: string;
    authorizationParentId: string;
    authorizationId: string;
    objType: string;
}
/**
 * 用户权限F2
 */
export interface AuthorizationF2 extends AuthorizationR1 {
    productId: string;
    productIconKey: string;
    productOrder: string;
    iconKey: string;
    functionUrl: string;
    type: string;
    productName: string;
    menuIconKey: string;
    productUrl: string;
}
/**
 * 用户信息
 */
export interface UserInfo extends Record<string, any> {
    pd: string;
    user_id: string;
    person_id: string;
    userName: string;
    account: string;
    name: string;
    userId: string;
    groupCode: string;
    group_code: string;
    isAdmin: string;
    resultType: string;
    projects: Project[];
    authorizations: Array<AuthorizationR1 | AuthorizationF2>;
}
/**
 * 基础Store
 */
export interface BaseStore extends Record<string, any> {
    userInfo: UserInfo;
    projectId: string;
    authId: string[] | [];
}

export type Method = 'post' | 'get' | 'delete' | 'put';

export type Unit = 'C' | 'kpa' | 'RH' | 'dra' | '台' | '℃' | '';

export enum UnitEnum {
    C = '℃',
    '℃' = '℃',
    kPa = 'kpa',
    RH = '%RH',
    dra = 'kJ/kg.dra',
    '台' = '台',
    'null' = ''
}

// eslint-disable-next-line no-shadow
export enum BooleanEnum {
    True = 0,
    False = 1
}

export interface TabList {
    id: string;
    name: string;
}

export interface MenuItem {
    icon: string;
    name: string;
    id: string;
}

export type DemandType = 'AIRCONDITIONING' | 'LIGHTING' | 'VENTILATION' | 'PARKING_VENTILATION' | 'DOME_VENTILATION' | 'ROOM_VENTILATION' | string;

/**
 * 对象类型枚举
 * @property {BUILDING} Building 建筑
 * @property {FLOOR} Floor 楼层
 * @property {PROJECT} Project 项目
 * @property {SPACE} Space 空间
 */
export enum ObjectTypeEnum {
    Building = 'BUILDING',
    Floor = 'FLOOR',
    Project = 'PROJECT',
    Space = 'SPACE'
}

/**
 * 运行监测二级类型
 * @property {AirCompressor} AirCompressor 空气压缩机
 * @property {AirTerminal} AirTerminal 风机盘管
 * @property {BuildingLighting} BuildingLighting 建筑照明
 * @property {ColdHeatSource} ColdHeatSource 冷热源
 * @property {ComputerRoomSecurity} ComputerRoomSecurity 机房安防
 * @property {DomeVentilation} DomeVentilation 穹顶通风
 * @property {Elevator} Elevator 电梯
 * @property {EnergyManagement} EnergyManagement 能源管理
 * @property {FireFighting} FireFighting 消防
 * @property {HeatSource} HeatSource 热源
 * @property {IndoorEnvironmentMonitoring} IndoorEnvironmentMonitoring 室内环境监测
 * @property {IntelligentBuildingAutomation} IntelligentBuildingAutomation 智能楼宇自动化
 * @property {KitchenRangeHood} KitchenRangeHood 厨房油烟机
 * @property {LandscapeLighting} LandscapeLighting 景观照明
 * @property {LightingMonitoring} LightingMonitoring 照明监测
 * @property {LogisticsVentilation} LogisticsVentilation 物流通风
 * @property {Parking} Parking 停车场
 * @property {ParkingLotLighting} ParkingLotLighting 停车场照明
 * @property {ParkingVentilation} ParkingVentilation 停车场通风
 * @property {PassengerFlow} PassengerFlow 人流量
 * @property {PublicAreaLighting} PublicAreaLighting 公共区域照明
 * @property {RunAnalysisAirTerminal} RunAnalysisAirTerminal 运行分析-风机盘管
 * @property {RunAnalysisCo2} RunAnalysisCo2 运行分析-二氧化碳
 * @property {RunAnalysisTdb} RunAnalysisTdb 运行分析-干球温度
 * @property {RunAnalysisVentilation} RunAnalysisVentilation 运行分析-通风
 * @property {Security} Security 安防
 * @property {SignLighting} SignLighting 标志照明
 * @property {ToiletVentilation} ToiletVentilation 卫生间通风
 */
export enum RunningMonitorSecondTypeEnum {
    AirCompressor = 'AIR_COMPRESSOR',
    AirTerminal = 'AIR_TERMINAL',
    BuildingLighting = 'BUILDING_LIGHTING',
    ColdHeatSource = 'COLD_HEAT_SOURCE',
    ComputerRoomSecurity = 'COMPUTER_ROOM_SECURITY',
    DomeVentilation = 'DOME_VENTILATION',
    Elevator = 'ELEVATOR',
    EnergyManagement = 'ENERGY_MANAGEMENT',
    FireFighting = 'FIRE_FIGHTING',
    HeatSource = 'HEAT_SOURCE',
    IndoorEnvironmentMonitoring = 'INDOOR_ENVIRONMENT_MONITORING',
    IntelligentBuildingAutomation = 'INTELLIGENT_BUILDING_AUTOMATION',
    KitchenRangeHood = 'KITCHEN_RANGE_HOOD',
    LandscapeLighting = 'LANDSCAPE_LIGHTING',
    LightingMonitoring = 'LIGHTING_MONITORING',
    LogisticsVentilation = 'LOGISTICS_VENTILATION',
    Parking = 'PARKING',
    ParkingLotLighting = 'PARKING_LOT_LIGHTING',
    ParkingVentilation = 'PARKING_VENTILATION',
    PassengerFlow = 'PASSENGER_FLOW',
    PublicAreaLighting = 'PUBLIC_AREA_LIGHTING',
    RunAnalysisAirTerminal = 'RUN_ANALYSIS_AIR_TERMINAL',
    RunAnalysisCo2 = 'RUN_ANALYSIS_CO2',
    RunAnalysisTdb = 'RUN_ANALYSIS_TDB',
    RunAnalysisVentilation = 'RUN_ANALYSIS_VENTILATION',
    Security = 'SECURITY',
    SignLighting = 'SIGN_LIGHTING',
    ToiletVentilation = 'TOILET_VENTILATION'
}

/**
 * 运行监测类型
 * @property {AI} AI 人工智能
 * @property {AirCompressor} AirCompressor 空气压缩机
 * @property {AirConditioningColdSource} AirConditioningColdSource 空调冷源
 * @property {AirTerminal} AirTerminal 风机盘管
 * @property {ColdHeatSource} ColdHeatSource 冷热源
 * @property {ColdSource} ColdSource 冷源
 * @property {ComputerRoomSecurity} ComputerRoomSecurity 机房安防
 * @property {Elevator} Elevator 电梯
 * @property {FireFighting} FireFighting 消防
 * @property {FireFightingElectricity} FireFightingElectricity 消防用电
 * @property {HeatSource} HeatSource 热源
 * @property {KitchenRangeHood} KitchenRangeHood 厨房油烟机
 * @property {Lighting} Lighting 照明
 * @property {Parking} Parking 停车场
 * @property {PassengerFlow} PassengerFlow 客流
 * @property {PowerDistribution} PowerDistribution 变配电
 * @property {RunAnalysis} RunAnalysis 运行分析
 * @property {Security} Security 安防
 * @property {Sewage} Sewage 排水
 * @property {Ventilation} Ventilation 通风
 * @property {WaterSupply} WaterSupply 给水
 * @property {WeakPower} WeakPower 弱电
 */
export enum RunningMonitorTypeEnum {
    AI = 'AI',
    AirCompressor = 'AIR_COMPRESSOR',
    AirConditioningColdSource = 'AIR_CONDITIONING_COLD_SOURCE',
    AirTerminal = 'AIR_TERMINAL',
    ColdHeatSource = 'COLD_HEAT_SOURCE',
    ColdSource = 'COLD_SOURCE',
    ComputerRoomSecurity = 'COMPUTER_ROOM_SECURITY',
    Elevator = 'ELEVATOR',
    FireFighting = 'FIRE_FIGHTING',
    FireFightingElectricity = 'FIRE_FIGHTING_ELECTRICITY',
    HeatSource = 'HEAT_SOURCE',
    KitchenRangeHood = 'KITCHEN_RANGE_HOOD',
    Lighting = 'LIGHTING',
    Parking = 'PARKING',
    PassengerFlow = 'PASSENGER_FLOW',
    PowerDistribution = 'POWER_DISTRIBUTION',
    RunAnalysis = 'RUN_ANALYSIS',
    Security = 'SECURITY',
    Sewage = 'SEWAGE',
    Ventilation = 'VENTILATION',
    WaterSupply = 'WATER_SUPPLY',
    WeakPower = 'WEAK_POWER'
}

export enum OriginDataTypeEnum {
    Boolp = 'Boolp',
    Boolv = 'Boolv',
    Enump = 'Enump'
}

export interface BaseObject {
    id: string;
    name: string;
}
