import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartDataPoint } from './mockData';
import dayjs from 'dayjs';
import { MTipsTooltip } from '../common/MTipsTooltip';

export interface SimpleLineChartSeries {
    key: string;
    label: string;
    color: string;
    strokeDasharray?: string;
    width?: number;
    group?: 'style' | 'data';
}

interface SimpleLineChartProps {
    data: ChartDataPoint[];
    series: SimpleLineChartSeries[];
    yAxisDomain?: [number, number];
    unit?: string;
    reportDate: string;
    title?: string;
}

export const SimpleLineChart: React.FC<SimpleLineChartProps> = ({ data, series, yAxisDomain, unit = '℃', reportDate, title }) => {
    const chartData = data.map((d, index) => ({
        ...d,
        timeIndex: index
    }));

    const hourlyTickIndices = React.useMemo(() => {
        return chartData
            .map((d, idx) => ({ time: d.time, idx }))
            .filter(item => typeof item.time === 'string' && item.time.endsWith(':00'))
            .map(item => item.idx);
    }, [chartData]);

    const [hiddenKeys, setHiddenKeys] = useState<string[]>([]);
    const [hiddenStyleKeys, setHiddenStyleKeys] = useState<string[]>([]);
    const [hiddenDataKeys, setHiddenDataKeys] = useState<string[]>([]);

    const hasGroupedLegend = series.some(s => s.group === 'style' || s.group === 'data');
    const styleSeries = hasGroupedLegend ? series.filter(s => s.group === 'style') : [];
    const dataSeries = hasGroupedLegend ? series.filter(s => s.group === 'data') : [];

    const buildDataKey = (dataKey: string, styleKey: string) => {
        if (!dataKey || !styleKey) return '';
        return `${dataKey}${styleKey.charAt(0).toUpperCase()}${styleKey.slice(1)}`;
    };

    // Calculate Y-axis domain based on visible data
    const yAxisDomainComputed = React.useMemo(() => {
        // If a manual domain is provided, use it
        if (yAxisDomain && yAxisDomain.length === 2 && yAxisDomain[0] !== yAxisDomain[1]) {
            return yAxisDomain;
        }

        // Otherwise calculate from data
        let min = Infinity;
        let max = -Infinity;
        let hasData = false;

        if (hasGroupedLegend && styleSeries.length && dataSeries.length) {
            data.forEach(d => {
                dataSeries.forEach(dataItem => {
                    styleSeries.forEach(styleItem => {
                        if (hiddenDataKeys.includes(dataItem.key) || hiddenStyleKeys.includes(styleItem.key)) return;
                        const dataKey = buildDataKey(dataItem.key, styleItem.key);
                        const val = d[dataKey as keyof ChartDataPoint];
                        if (typeof val === 'number' && !isNaN(val)) {
                            if (val < min) min = val;
                            if (val > max) max = val;
                            hasData = true;
                        }
                    });
                });
            });
        } else {
            data.forEach(d => {
                series.forEach(s => {
                    if (!hiddenKeys.includes(s.key)) {
                        const val = d[s.key as keyof ChartDataPoint];
                        if (typeof val === 'number' && !isNaN(val)) {
                            if (val < min) min = val;
                            if (val > max) max = val;
                            hasData = true;
                        }
                    }
                });
            });
        }

        if (!hasData) return [0, 50]; // Default fallback

        // Add padding (approx 10-20% of range)
        const range = max - min;
        const padding = range === 0 ? 5 : range * 0.1;

        // Round to nice numbers (e.g. nearest 5 or 10)
        const floorMin = Math.floor((min - padding) / 5) * 5;
        const ceilMax = Math.ceil((max + padding) / 5) * 5;

        return [floorMin, ceilMax];
    }, [data, series, hiddenKeys, hiddenDataKeys, hiddenStyleKeys, yAxisDomain, hasGroupedLegend]);

    const toggleLine = (key: string) => {
        setHiddenKeys(prev => (prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]));
    };

    const toggleStyle = (key: string) => {
        setHiddenStyleKeys(prev => (prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]));
    };

    const toggleData = (key: string) => {
        setHiddenDataKeys(prev => (prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]));
    };

    const LegendItem = ({ s }: { s: SimpleLineChartSeries }) => (
        <div
            className={`flex items-center gap-1.5 cursor-pointer select-none transition-opacity ${hiddenKeys.includes(s.key) ? 'opacity-40 grayscale' : ''}`}
            onClick={() => toggleLine(s.key)}
        >
            <div
                className="w-4 h-[3px]"
                style={{
                    backgroundColor: s.strokeDasharray ? 'transparent' : s.color,
                    borderTop: s.strokeDasharray ? '3px dotted' : '2px solid',
                    borderColor: s.color
                }}
            />
            <span className="text-xs text-[#626C78]">{s.label}</span>
        </div>
    );

    const StyleLegendItem = ({ s }: { s: SimpleLineChartSeries }) => (
        <div
            className={`flex items-center gap-1.5 cursor-pointer select-none transition-opacity ${hiddenStyleKeys.includes(s.key) ? 'opacity-40 grayscale' : ''}`}
            onClick={() => toggleStyle(s.key)}
        >
            <div
                className="w-4 h-[3px]"
                style={{
                    backgroundColor: s.strokeDasharray ? 'transparent' : s.color,
                    borderTop: s.strokeDasharray ? '3px dotted' : '2px solid',
                    borderColor: s.color
                }}
            />
            <span className="text-xs text-[#626C78]">{s.label}</span>
        </div>
    );

    const DataLegendItem = ({ s }: { s: SimpleLineChartSeries }) => (
        <div
            className={`flex items-center gap-1.5 cursor-pointer select-none transition-opacity ${hiddenDataKeys.includes(s.key) ? 'opacity-40 grayscale' : ''}`}
            onClick={() => toggleData(s.key)}
        >
            <div
                className="w-4 h-[3px]"
                style={{
                    backgroundColor: s.color,
                    borderTop: 'none'
                }}
            />
            <span className="text-xs text-[#626C78]">{s.label}</span>
        </div>
    );

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const d = payload[0].payload as ChartDataPoint;
            return (
                <div className="bg-white border border-[#E1E5EB] shadow-lg rounded p-3 text-xs min-w-[200px] z-50">
                    <div className="font-bold text-[#2E3742] mb-2">
                        {dayjs(reportDate).format('YYYY年M月D日')} {d.time}
                    </div>
                    {hasGroupedLegend && styleSeries.length && dataSeries.length ? (
                        <div className="space-y-2">
                            {styleSeries.map(styleItem => {
                                if (hiddenStyleKeys.includes(styleItem.key)) return null;
                                return (
                                    <div key={styleItem.key}>
                                        <div className="font-bold text-[#2E3742] mb-1">{styleItem.label}</div>
                                        <div className="space-y-1">
                                            {dataSeries.map(dataItem => {
                                                if (hiddenDataKeys.includes(dataItem.key)) return null;
                                                const dataKey = buildDataKey(dataItem.key, styleItem.key);
                                                const val = payload.find((p: any) => p.dataKey === dataKey)?.value;
                                                return (
                                                    <div key={dataKey} className="flex justify-between items-center">
                                                        <span className="flex items-center gap-2 text-[#626C78]">
                                                            <div
                                                                className="w-2.5 h-[2px]"
                                                                style={{
                                                                    backgroundColor: dataItem.color,
                                                                    borderTop: styleItem.strokeDasharray ? '2px dashed' : '2px solid',
                                                                    borderColor: dataItem.color
                                                                }}
                                                            />{' '}
                                                            {dataItem.label} :
                                                        </span>
                                                        <span className="font-medium text-[#1B2129]">{val !== undefined ? `${val}${unit}` : '--'}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        series.map(s => {
                            if (hiddenKeys.includes(s.key)) return null;
                            const val = payload.find((p: any) => p.dataKey === s.key)?.value;
                            return (
                                <div key={s.key} className="flex justify-between items-center mb-1">
                                    <span className="flex items-center gap-2 text-[#626C78]">
                                        <div
                                            className="w-2.5 h-[2px]"
                                            style={{
                                                backgroundColor: s.strokeDasharray ? 'transparent' : s.color,
                                                borderTop: s.strokeDasharray ? '2px dashed' : '2px solid',
                                                borderColor: s.color
                                            }}
                                        />{' '}
                                        {s.label} :
                                    </span>
                                    <span className="font-medium text-[#1B2129]">{val !== undefined ? `${val}${unit}` : '--'}</span>
                                </div>
                            );
                        })
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full">
            {/* Title and Legend */}
            <div className="flex items-start justify-between gap-4 mb-2 pr-4">
                {title && (
                    <MTipsTooltip
                        text={title}
                        className="text-sm font-bold text-[#1B2129]"
                        wrapperClassName="max-w-[240px] min-w-0 shrink-0"
                    />
                )}
                <div className="flex flex-wrap items-center justify-end gap-4 flex-1 pt-[2px]">
                    {hasGroupedLegend && styleSeries.length && dataSeries.length ? (
                        <>
                            {styleSeries.map(s => (
                                <StyleLegendItem key={s.key} s={s} />
                            ))}
                            {dataSeries.map(s => (
                                <DataLegendItem key={s.key} s={s} />
                            ))}
                        </>
                    ) : (
                        series.map(s => <LegendItem key={s.key} s={s} />)
                    )}
                </div>
            </div>

            <div className="h-[200px] w-full relative min-w-0">
                {unit && <div className="absolute top-0 left-[10px] text-[10px] text-[#86909C]">{unit}</div>}

                <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100} debounce={200}>
                    <LineChart data={chartData} margin={{ top: 30, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E6EB" />
                        <XAxis
                            dataKey="timeIndex"
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
                        <YAxis domain={yAxisDomainComputed} tickCount={6} tick={{ fontSize: 12, fill: '#86909C' }} axisLine={false} tickLine={false} width={40} />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#2481F2', strokeWidth: 1, strokeDasharray: '4 4' }} wrapperStyle={{ zIndex: 50 }} />

                        {hasGroupedLegend && styleSeries.length && dataSeries.length
                            ? dataSeries.flatMap(dataItem =>
                                  styleSeries.map(styleItem => {
                                      if (hiddenDataKeys.includes(dataItem.key) || hiddenStyleKeys.includes(styleItem.key)) return null;
                                      const dataKey = buildDataKey(dataItem.key, styleItem.key);
                                      const strokeWidth = styleItem.width || dataItem.width || 2;
                                      return (
                                          <Line
                                              key={dataKey}
                                              type="monotone"
                                              dataKey={dataKey}
                                              stroke={dataItem.color}
                                              strokeWidth={strokeWidth}
                                              strokeDasharray={styleItem.strokeDasharray}
                                              dot={false}
                                              activeDot={{ r: 4 }}
                                          />
                                      );
                                  })
                              )
                            : series.map(
                                  s =>
                                      !hiddenKeys.includes(s.key) && (
                                          <Line
                                              key={s.key}
                                              type="monotone"
                                              dataKey={s.key}
                                              stroke={s.color}
                                              strokeWidth={s.width || 2}
                                              strokeDasharray={s.strokeDasharray}
                                              dot={false}
                                              activeDot={{ r: 4 }}
                                          />
                                      )
                              )}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
