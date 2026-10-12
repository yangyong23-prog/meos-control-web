export interface ChartDataPoint {
  time: string;
  actualTemp?: number;
  aiTemp?: number;
  targetTemp?: number;
  operatingHours?: boolean;

  // Limits
  overcoolLimit?: number;
  comfortLower?: number;
  comfortUpper?: number;
  overheatLimit?: number;

  // Operation Status (0 = Off/Stopped, 1 = On/Running)
  ac1Setting?: number;
  ac1Status?: number;
  ac2Setting?: number;
  ac2Status?: number;

  // Service area / supply air (per unit + style)
  unit1Setting?: number;
  unit1Actual?: number;
  unit2Setting?: number;
  unit2Actual?: number;

  [key: string]: any;
}

export interface ExceptionLogItem {
  time: string;
  device: string;
  message: string;
}

export interface StatusSegment {
  label: string;
  type: 'standard' | 'overheat' | 'overcool' | 'longHeat' | 'longCool';
  startHour: number;
  endHour: number;
}

export const MOCK_CHART_DATA: ChartDataPoint[] = Array.from({ length: 25 }, (_, i) => {
  const hour = i; // 0 to 24
  const time = `${hour.toString().padStart(2, '0')}:00`;

  // Operating hours: 07:30 - 19:30.
  // For chart highlighting, we treat 07:30-19:30.
  // Data points are hourly. 08:00 is inside. 07:00 is outside.
  const isOperating = hour >= 8 && hour <= 19;

  // Temp simulation
  const baseTemp = isOperating ? 24 : 28;
  const actualTemp = baseTemp + Math.sin(hour / 3) * 2 + Math.random();
  const aiTemp = actualTemp + (Math.random() - 0.5) * 0.5;
  const targetTemp = 24 + Math.sin(hour / 6); // Vary slightly

  return {
    time,
    actualTemp: Number(actualTemp.toFixed(1)),
    aiTemp: Number(aiTemp.toFixed(1)),
    targetTemp: Number(targetTemp.toFixed(1)),
    operatingHours: isOperating,

    overcoolLimit: 20.5,
    comfortLower: 22.5,
    comfortUpper: 26.5,
    overheatLimit: 28.5,

    // AC Status
    ac1Setting: isOperating ? 1 : 0,
    ac1Status: isOperating && hour !== 12 ? 1 : 0,
    ac2Setting: isOperating && hour > 14 ? 1 : 0,
    ac2Status: isOperating && hour > 14 ? 1 : 0,
  };
});

export const MOCK_EXCEPTION_LOGS: ExceptionLogItem[] = [
  { time: "00:15:00", device: "1#冷机", message: "发生 冷冻侧水阀开关状态反馈与指令不符报警" },
  { time: "00:30:00", device: "1#冷冻水泵", message: "发生 变频器状态反馈与指令不符报警" },
  { time: "00:45:00", device: "3#冷却水泵", message: "发生 变频器状态反馈与指令不符报警" },
  { time: "01:00:00", device: "5#冷却塔风机", message: "发生 控制失能报警" },
  { time: "01:15:00", device: "2#电动通断水阀", message: "发生 控制失能报警" },
];

export const MOCK_STATUS_SEGMENTS: StatusSegment[] = [
  { label: "达标", type: "standard", startHour: 7, endHour: 10 },
  { label: "过热", type: "overheat", startHour: 10, endHour: 12 },
  { label: "过冷", type: "overcool", startHour: 12, endHour: 14.5 },
  { label: "持续偏热", type: "longHeat", startHour: 14.5, endHour: 18.5 },
];
