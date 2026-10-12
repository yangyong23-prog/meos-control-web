import React, { useState } from 'react';
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';
import { ChartDataPoint } from './mockData';
import dayjs from 'dayjs';

interface SpaceTempChartProps {
    data: ChartDataPoint[];
    filterContent?: React.ReactNode;
    businessTime: string[];
    spaceData?: any;
    reportDate: string;
}

const COLORS = {
    actual: '#2481F2',
    target: '#C04BE7',
    ai: '#33D4D2',

    overcool: '#2481F2', // Blue dashed
    comfortLower: '#F29F00', // Orange dashed
    comfortUpper: '#33D4D2', // Cyan dashed
    overheat: '#F55047', // Red dashed

    operatingBg: '#EBF3FF',

    // Status colors
    statusStandard: '#33D4D2',
    statusOverheat: '#F55047',
    statusOvercool: '#246FE5',
    statusLongHeat: '#F29F00',
    statusLongCool: '#52C41A'
};

const ALL_KEYS = ['targetTemp', 'actualTemp', 'aiTemp', 'overcoolLimit', 'comfortLower', 'comfortUpper', 'overheatLimit'];

const getDashedBgStyle = (color: string) => ({
    backgroundImage: `repeating-linear-gradient(to right, ${color} 0 4px, transparent 4px 7px)`,
    backgroundRepeat: 'repeat-x'
});

// businessTime ['10:00,20:00']
export const SpaceTempChart: React.FC<SpaceTempChartProps> = ({ data, filterContent, businessTime, spaceData, reportDate }) => {
    const chartData = data.map((d, index) => ({
        ...d,
        hourIndex: index
    }));

    const businessRanges = React.useMemo(() => {
        if (!businessTime || businessTime.length === 0) return [] as Array<{ startIndex: number; endIndex: number }>;

        const parseMinutes = (time: string | undefined) => {
            if (!time || typeof time !== 'string') return null;
            const [h, m] = time.split(':');
            const hour = Number(h);
            const minute = Number(m);
            if (Number.isNaN(hour) || Number.isNaN(minute)) return null;
            return hour * 60 + minute;
        };

        const timeMinutes = chartData.map(d => parseMinutes(d.time)).map(v => (v === null ? -1 : v));

        return businessTime
            .map(rangeStr => {
                if (typeof rangeStr !== 'string') return null;
                const [startStr, endStr] = rangeStr.split(',');
                const startMinutes = parseMinutes(startStr?.trim());
                const endMinutes = parseMinutes(endStr?.trim());
                if (startMinutes === null || endMinutes === null) return null;

                const startIndex = timeMinutes.findIndex(v => v >= startMinutes);
                const endIndexFromEnd = [...timeMinutes].reverse().findIndex(v => v <= endMinutes && v >= 0);
                const endIndex = endIndexFromEnd >= 0 ? timeMinutes.length - 1 - endIndexFromEnd : -1;
                if (startIndex < 0 || endIndex < 0 || startIndex > endIndex) return null;
                return { startIndex, endIndex };
            })
            .filter(Boolean) as Array<{ startIndex: number; endIndex: number }>;
    }, [businessTime, chartData]);

    const hourlyTickIndices = React.useMemo(() => {
        return chartData
            .map((d, idx) => ({ time: d.time, idx }))
            .filter(item => typeof item.time === 'string' && item.time.endsWith(':00'))
            .map(item => item.idx);
    }, [chartData]);

    const statusSegments = React.useMemo(() => {
        const parseMinutes = (time: string | undefined) => {
            if (!time || typeof time !== 'string') return null;
            const [h, m] = time.split(':');
            const hour = Number(h);
            const minute = Number(m);
            if (Number.isNaN(hour) || Number.isNaN(minute)) return null;
            return hour * 60 + minute;
        };

        const toStatusType = (tagKey: string | undefined) => {
            if (tagKey === 'TOO_HOT') return 'overheat';
            if (tagKey === 'TOO_COLD') return 'overcool';
            if (tagKey === 'HOT') return 'longHeat';
            if (tagKey === 'COLD') return 'longCool';
            if (tagKey === 'APPROPRIATE') return 'comfortable';
            return '';
        };

        const toStatusLabel = (type: string) => {
            if (type === 'overheat') return '过热';
            if (type === 'overcool') return '过冷';
            if (type === 'longHeat') return '持续偏热';
            if (type === 'longCool') return '持续偏冷';
            if (type === 'comfortable') return '达标';
            return '';
        };

        const timeTagList = Array.isArray(spaceData?.timeTag) ? spaceData.timeTag : [];
        const timeMinutes = chartData.map(d => parseMinutes(d.time));

        const statusByIndex = Array.from({ length: chartData.length }, () => 'standard');

        timeTagList.forEach((item: any) => {
            const [startStr, endStr] = (item?.time || '').split(',');
            const startMinutes = parseMinutes(startStr?.trim());
            const endMinutes = parseMinutes(endStr?.trim());
            if (startMinutes === null || endMinutes === null) return;

            const endMinutePart = endMinutes % 60;
            // 左闭右开：[start, endExclusive)
            // 特殊要求：xx:59 过渡到下一小时整点（例如 10:00,10:59 => [10:00,11:00)）
            const endExclusive = endMinutePart === 59 ? (Math.floor(endMinutes / 60) + 1) * 60 : endMinutes + 1;
            const type = toStatusType(item?.tagKey);

            timeMinutes.forEach((pointMinute, idx) => {
                if (pointMinute === null) return;
                if (pointMinute >= startMinutes && pointMinute < endExclusive) {
                    statusByIndex[idx] = type;
                }
            });
        });

        const segments: Array<{ startIndex: number; endIndex: number; type: string; label: string }> = [];
        let currentType: string | null = null;
        let currentStart = 0;

        statusByIndex.forEach((type, idx) => {
            if (currentType === null) {
                currentType = type;
                currentStart = idx;
                return;
            }

            if (type !== currentType) {
                segments.push({
                    startIndex: currentStart,
                    endIndex: idx - 1,
                    type: currentType,
                    label: toStatusLabel(currentType)
                });
                currentType = type;
                currentStart = idx;
            }
        });

        if (currentType !== null) {
            segments.push({
                startIndex: currentStart,
                endIndex: chartData.length - 1,
                type: currentType,
                label: toStatusLabel(currentType)
            });
        }

        return segments;
    }, [chartData, spaceData]);

    const [hiddenKeys, setHiddenKeys] = useState<string[]>([]);

    const toggleLine = (key: string) => {
        setHiddenKeys(prev => (prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]));
    };

    // Calculate Y-axis domain based on visible data
    const yAxisDomainComputed = React.useMemo(() => {
        let min = Infinity;
        let max = -Infinity;
        let hasData = false;

        data.forEach(d => {
            ALL_KEYS.forEach(key => {
                if (!hiddenKeys.includes(key)) {
                    const val = d[key as keyof ChartDataPoint];
                    if (typeof val === 'number' && !isNaN(val)) {
                        if (val < min) min = val;
                        if (val > max) max = val;
                        hasData = true;
                    }
                }
            });
        });

        if (!hasData) return [0, 50]; // Default fallback

        // Add padding (approx 10-20% of range)
        const range = max - min;
        const padding = range === 0 ? 5 : range * 0.1;

        // Round to nice numbers (e.g. nearest 5)
        const floorMin = Math.floor((min - padding) / 5) * 5;
        const ceilMax = Math.ceil((max + padding) / 5) * 5;

        return [floorMin, ceilMax];
    }, [data, hiddenKeys]);

    const LegendItem = ({ label, color, type, dataKey, dashed }: any) => (
        <div
            className={`flex items-center gap-1.5 cursor-pointer select-none transition-opacity ${hiddenKeys.includes(dataKey) ? 'opacity-40 grayscale' : ''}`}
            onClick={() => toggleLine(dataKey)}
        >
            {type === 'rect' ? (
                <div className="w-3 h-3" style={{ backgroundColor: color }} />
            ) : (
                <div className="w-3 h-[2px]" style={dashed ? getDashedBgStyle(color) : { backgroundColor: color }} />
            )}
            <span className="text-xs text-[#626C78] whitespace-nowrap">{label}</span>
        </div>
    );

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const d = payload[0].payload as ChartDataPoint;
            const formatVal = (val: number | undefined | null) => (val !== undefined && val !== null ? `${val}℃` : '--');
            return (
                <div className="bg-white border border-[#E1E5EB] shadow-lg rounded p-3 text-xs min-w-[220px] z-50">
                    <div className="font-bold text-[#2E3742] mb-1">
                        {dayjs(reportDate).format('YYYY年M月D日')} {d.time}
                    </div>
                    <div className="text-[#626C78] mb-3">营业时间：{spaceData.businessTime.length ? spaceData.businessTime.join('、') : '--'}</div>

                    <div className="space-y-1.5">
                        {!hiddenKeys.includes('actualTemp') && (
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-2 text-[#626C78]">
                                    <div className="w-2.5 h-[2px] bg-[#2481F2]"></div> 实际温度 :
                                </span>
                                <span className="font-medium text-[#1B2129]">{formatVal(d.actualTemp)}</span>
                            </div>
                        )}
                        {/* {!hiddenKeys.includes("aiTemp") && (
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 text-[#626C78]">
                   <div className="w-2.5 h-[2px] bg-[#33D4D2]"></div> AI预测温度 :
                </span>
                <span className="font-medium text-[#1B2129]">{formatVal(d.aiTemp)}</span>
              </div>
            )} */}
                        {!hiddenKeys.includes('targetTemp') && (
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-2 text-[#626C78]">
                                    <div className="w-2.5 h-[2px] bg-[#C04BE7]"></div> 目标温度 :
                                </span>
                                <span className="font-medium text-[#1B2129]">{formatVal(d.targetTemp)}</span>
                            </div>
                        )}

                        <div className="h-px bg-[#E1E5EB] my-2" />

                        {!hiddenKeys.includes('overcoolLimit') && (
                            <div className="flex justify-between items-center text-[#626C78]">
                                <span className="flex items-center gap-2">
                                    <div className="w-2.5 h-[2px]" style={getDashedBgStyle(COLORS.overcool)}></div> 过冷门限 :
                                </span>
                                <span>{formatVal(d.overcoolLimit)}</span>
                            </div>
                        )}
                        {!hiddenKeys.includes('comfortLower') && (
                            <div className="flex justify-between items-center text-[#626C78]">
                                <span className="flex items-center gap-2">
                                    <div className="w-2.5 h-[2px]" style={getDashedBgStyle(COLORS.comfortLower)}></div> 舒适区下限 :
                                </span>
                                <span>{formatVal(d.comfortLower)}</span>
                            </div>
                        )}
                        {!hiddenKeys.includes('comfortUpper') && (
                            <div className="flex justify-between items-center text-[#626C78]">
                                <span className="flex items-center gap-2">
                                    <div className="w-2.5 h-[2px]" style={getDashedBgStyle(COLORS.comfortUpper)}></div> 舒适区上限 :
                                </span>
                                <span>{formatVal(d.comfortUpper)}</span>
                            </div>
                        )}
                        {!hiddenKeys.includes('overheatLimit') && (
                            <div className="flex justify-between items-center text-[#626C78]">
                                <span className="flex items-center gap-2">
                                    <div className="w-2.5 h-[2px]" style={getDashedBgStyle(COLORS.overheat)}></div> 过热门限 :
                                </span>
                                <span>{formatVal(d.overheatLimit)}</span>
                            </div>
                        )}
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full">
            {/* Header Row: Filters (Left) + Legend (Right) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pr-4 pl-0">
                {/* Left: Filter Content */}
                <div className="flex-shrink-0">{filterContent}</div>

                {/* Right: Legend */}
                <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-2">
                    <LegendItem label="目标温度" color={COLORS.target} dataKey="targetTemp" />
                    <LegendItem label="实际温度" color={COLORS.actual} dataKey="actualTemp" />
                    {/* <LegendItem label="AI预测温度" color={COLORS.ai} dataKey="aiTemp" /> */}
                    <LegendItem label="营业时间范围" color={COLORS.operatingBg} type="rect" dataKey="operatingHours" />
                    <LegendItem label="过冷门限" color={COLORS.overcool} dashed dataKey="overcoolLimit" />
                    <LegendItem label="舒适区下限" color={COLORS.comfortLower} dashed dataKey="comfortLower" />
                    <LegendItem label="舒适区上限" color={COLORS.comfortUpper} dashed dataKey="comfortUpper" />
                    <LegendItem label="过热门限" color={COLORS.overheat} dashed dataKey="overheatLimit" />
                </div>
            </div>

            <div className="relative">
                <div className="h-[280px] w-full relative min-w-0">
                    {/* Unit Label */}
                    <div className="absolute top-[-10px] left-[10px] text-[10px] text-[#86909C]">℃</div>

                    <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100} debounce={200}>
                        <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                            {/* Dotted Grid Lines */}
                            <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="#E5E6EB" />

                            <XAxis
                                dataKey="hourIndex"
                                type="number"
                                domain={[0, Math.max(chartData.length - 1, 0)]}
                                ticks={hourlyTickIndices}
                                tickCount={Math.max(hourlyTickIndices.length, 1)}
                                tickFormatter={idx => chartData[idx as number]?.time ?? ''}
                                tick={{ fontSize: 12, fill: '#86909C' }}
                                axisLine={false}
                                tickLine={false}
                                interval={0}
                            />
                            <YAxis domain={yAxisDomainComputed} tickCount={7} tick={{ fontSize: 12, fill: '#86909C' }} axisLine={false} tickLine={false} width={40} />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#2481F2', strokeWidth: 1, strokeDasharray: '4 4' }} />

                            {!hiddenKeys.includes('operatingHours') &&
                                businessRanges.map((range, idx) => (
                                    <ReferenceArea
                                        key={`operating-${range.startIndex}-${range.endIndex}-${idx}`}
                                        x1={range.startIndex}
                                        x2={range.endIndex}
                                        fill={COLORS.operatingBg}
                                        fillOpacity={1}
                                    />
                                ))}

                            {/* Limits */}
                            {!hiddenKeys.includes('overcoolLimit') && (
                                <Line
                                    type="monotone"
                                    dataKey="overcoolLimit"
                                    stroke={COLORS.overcool}
                                    strokeDasharray="4 4"
                                    dot={false}
                                    strokeWidth={1}
                                    activeDot={false}
                                    isAnimationActive={false}
                                />
                            )}
                            {!hiddenKeys.includes('comfortLower') && (
                                <Line
                                    type="monotone"
                                    dataKey="comfortLower"
                                    stroke={COLORS.comfortLower}
                                    strokeDasharray="4 4"
                                    dot={false}
                                    strokeWidth={1}
                                    activeDot={false}
                                    isAnimationActive={false}
                                />
                            )}
                            {!hiddenKeys.includes('comfortUpper') && (
                                <Line
                                    type="monotone"
                                    dataKey="comfortUpper"
                                    stroke={COLORS.comfortUpper}
                                    strokeDasharray="4 4"
                                    dot={false}
                                    strokeWidth={1}
                                    activeDot={false}
                                    isAnimationActive={false}
                                />
                            )}
                            {!hiddenKeys.includes('overheatLimit') && (
                                <Line
                                    type="monotone"
                                    dataKey="overheatLimit"
                                    stroke={COLORS.overheat}
                                    strokeDasharray="4 4"
                                    dot={false}
                                    strokeWidth={1}
                                    activeDot={false}
                                    isAnimationActive={false}
                                />
                            )}

                            {/* Data Lines */}
                            {!hiddenKeys.includes('targetTemp') && (
                                <Line
                                    type="monotone"
                                    dataKey="targetTemp"
                                    stroke={COLORS.target}
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 4, fill: 'white', stroke: COLORS.target, strokeWidth: 2 }}
                                />
                            )}
                            {!hiddenKeys.includes('aiTemp') && (
                                <Line
                                    type="monotone"
                                    dataKey="aiTemp"
                                    stroke={COLORS.ai}
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 4, fill: 'white', stroke: COLORS.ai, strokeWidth: 2 }}
                                />
                            )}
                            {!hiddenKeys.includes('actualTemp') && (
                                <Line
                                    type="monotone"
                                    dataKey="actualTemp"
                                    stroke={COLORS.actual}
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 4, fill: 'white', stroke: COLORS.actual, strokeWidth: 2 }}
                                />
                            )}
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>

                {/* Bottom Status Strip */}
                <div className="relative mt-1 w-[calc(100%-70px)] ml-[40px] h-auto flex">
                    {statusSegments.map((seg, i) => {
                        const totalSlots = Math.max(chartData.length, 1);
                        const leftPct = (seg.startIndex / totalSlots) * 100;
                        const widthPct = ((seg.endIndex - seg.startIndex + 1) / totalSlots) * 100;

                        let color = COLORS.statusStandard;
                        if (seg.type === 'overheat') color = COLORS.statusOverheat;
                        if (seg.type === 'overcool') color = COLORS.statusOvercool;
                        if (seg.type === 'longHeat') color = COLORS.statusLongHeat;
                        if (seg.type === 'longCool') color = COLORS.statusLongCool;
                        if (!seg.label) {
                            color = 'transparent';
                        }
                        return (
                            <div
                                key={`${seg.type}-${seg.startIndex}-${i}`}
                                className="h-full flex flex-col items-center"
                                style={{
                                    left: `${leftPct}%`,
                                    width: `${widthPct}%`
                                }}
                            >
                                {/* Line and Dots */}
                                <div className="w-full flex items-center relative h-3 justify-center">
                                    <div className="h-[1px] w-full" style={{ backgroundColor: color }} />
                                    <div className="absolute left-0 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color, marginLeft: '-3px' }} />
                                    <div className="absolute right-0 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color, marginRight: '-3px' }} />
                                </div>
                                {/* Label */}
                                <div
                                    className="text-[10px] rounded-sm mt-[-2px]"
                                    style={{
                                        color: color,
                                        backgroundColor: 'rgba(255,255,255,0.8)'
                                    }}
                                >
                                    {seg.label}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
