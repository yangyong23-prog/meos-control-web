import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { SimpleLineChartSeries } from './SimpleLineChart';
import dayjs from 'dayjs';
import { MTipsTooltip } from '../common/MTipsTooltip';

interface OperationStatusChartProps {
    data: Array<Record<string, any>>;
    series: SimpleLineChartSeries[];
    reportDate: string;
    classCode2InfoCodeDefines?: Record<string, any>;
    title?: string;
}

export const OperationStatusChart: React.FC<OperationStatusChartProps> = ({ data, series, reportDate, classCode2InfoCodeDefines, title }) => {
    const chartData = data.map((d, index) => ({
        ...d,
        timeIndex: index
    })) as Array<Record<string, any> & { time?: string }>;

    const hourlyTickIndices = React.useMemo(() => {
        return chartData
            .map((d, idx) => ({ time: d.time, idx }))
            .filter(item => typeof item.time === 'string' && item.time.endsWith(':00'))
            .map(item => item.idx);
    }, [chartData]);

    const hasGroupedLegend = series.some(s => s.group === 'style' || s.group === 'data');
    const styleSeries = hasGroupedLegend ? series.filter(s => s.group === 'style') : [];
    const dataSeries = hasGroupedLegend ? series.filter(s => s.group === 'data') : [];

    const [hiddenKeys, setHiddenKeys] = useState<string[]>([]);
    const [hiddenStyleKeys, setHiddenStyleKeys] = useState<string[]>([]);
    const [hiddenDataKeys, setHiddenDataKeys] = useState<string[]>([]);

    const buildDataKey = (dataKey: string, styleKey: string) => {
        if (!dataKey || !styleKey) return '';
        return `${dataKey}${styleKey.charAt(0).toUpperCase()}${styleKey.slice(1)}`;
    };

    const toggleLine = (key: string) => {
        setHiddenKeys(prev => (prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]));
    };

    const toggleStyle = (key: string) => {
        setHiddenStyleKeys(prev => (prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]));
    };

    const toggleData = (key: string) => {
        setHiddenDataKeys(prev => (prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]));
    };

    const yAxisDomainComputed = React.useMemo(() => {
        let min = Infinity;
        let max = -Infinity;
        let hasData = false;

        if (hasGroupedLegend && styleSeries.length && dataSeries.length) {
            data.forEach(d => {
                dataSeries.forEach(dataItem => {
                    styleSeries.forEach(styleItem => {
                        if (hiddenDataKeys.includes(dataItem.key) || hiddenStyleKeys.includes(styleItem.key)) return;
                        const dataKey = buildDataKey(dataItem.key, styleItem.key);
                        const val = d[dataKey as keyof typeof d];
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
                        const val = d[s.key as keyof typeof d];
                        if (typeof val === 'number' && !isNaN(val)) {
                            if (val < min) min = val;
                            if (val > max) max = val;
                            hasData = true;
                        }
                    }
                });
            });
        }

        if (!hasData) return [-0.2, 1.2];

        if (min === max) {
            return [min - 0.2, max + 0.2];
        }

        const range = max - min;
        const padding = range * 0.1;
        return [min - padding, max + padding];
    }, [data, series, hiddenKeys, hiddenDataKeys, hiddenStyleKeys, hasGroupedLegend, styleSeries, dataSeries]);

    const yAxisTicks = [0, 1];

    const LegendItem = ({ label, active, onClick, color, dotted }: any) => (
        <div className={`flex items-center gap-1.5 cursor-pointer select-none transition-opacity ${!active ? 'opacity-40 grayscale' : ''}`} onClick={onClick}>
            <div
                className={`w-4 h-[3px]`}
                style={{
                    backgroundColor: dotted ? 'transparent' : color || '#626C78',
                    borderTop: dotted ? '3px dotted' : '2px solid',
                    borderColor: color || '#626C78'
                }}
            />
            <span className="text-xs text-[#626C78]">{label}</span>
        </div>
    );

    const StyleLegendItem = ({ s }: { s: SimpleLineChartSeries }) => (
        <LegendItem label={s.label} active={!hiddenStyleKeys.includes(s.key)} onClick={() => toggleStyle(s.key)} color={s.color} dotted={!!s.strokeDasharray} />
    );

    const DataLegendItem = ({ s }: { s: SimpleLineChartSeries }) => (
        <LegendItem label={s.label} active={!hiddenDataKeys.includes(s.key)} onClick={() => toggleData(s.key)} color={s.color} />
    );
    const styleValueMap = React.useMemo(() => {
        const getEnumMap = (source: any) => {
            const defines = Array.isArray(source) ? source : source?.dataSource || source?.dataSources;
            if (!Array.isArray(defines)) return {} as Record<string, string>;
            return defines.reduce((acc: Record<string, string>, item: any) => {
                const code = item?.code;
                if (code !== undefined && code !== null) {
                    acc[String(code)] = item?.aliasName || item?.name || String(code);
                }
                return acc;
            }, {});
        };

        return styleSeries.reduce((acc: Record<string, Record<string, string>>, item: any) => {
            acc[item.key] = getEnumMap(item?.dataSources);
            return acc;
        }, {});
    }, [styleSeries]);

    const yAxisStatusLabel = React.useMemo(() => {
        const collectLabels = (target: string, fallback: string) => {
            const labels = styleSeries.map(item => styleValueMap[item.key]?.[target]).filter(Boolean) as string[];
            console.log(labels);
						console.log(styleSeries)
            return labels.length ? Array.from(new Set(labels)).join('/') : fallback;
        };

        return {
            on: collectLabels('1', '开启/运行'),
            off: collectLabels('0', '关闭/停止')
        };
    }, [styleSeries, styleValueMap]);

    const formatStatusValue = (styleKey: string, value: unknown) => {
        if (value === undefined || value === null || value === '') return '--';
        const num = typeof value === 'number' ? value : Number(value);
        if (Number.isNaN(num)) return '--';

        const valueMap = styleValueMap[styleKey] || {};
        const mapped = valueMap[String(num)] ?? valueMap[String(value)];
        if (mapped) return mapped;

        if (styleKey === 'runStatus') return num ? '运行' : '停止';
        if (styleKey === 'equipSwitchSet') return num ? '开启' : '关闭';
        return String(num);
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const d = payload[0].payload as Record<string, any>;
            return (
                <div className="bg-white border border-[#E1E5EB] shadow-lg rounded p-3 text-xs min-w-[220px]">
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
                                                        <span className="font-medium text-[#1B2129]">{formatStatusValue(styleItem.key, val)}</span>
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
                                    <span className="font-medium text-[#1B2129]">{formatStatusValue(s.key, val)}</span>
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
                        series.map(s => (
                            <LegendItem
                                key={s.key}
                                label={s.label}
                                active={!hiddenKeys.includes(s.key)}
                                onClick={() => toggleLine(s.key)}
                                color={s.color}
                                dotted={!!s.strokeDasharray}
                            />
                        ))
                    )}
                </div>
            </div>

            <div className="h-[200px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100} debounce={200}>
                    <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
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
                        <YAxis
                            type="number"
                            domain={yAxisDomainComputed}
                            ticks={yAxisTicks}
                            tickCount={2}
                            tickFormatter={val => {
                                if (val === 1) return yAxisStatusLabel.on;
                                if (val === 0) return yAxisStatusLabel.off;
                                return val;
                            }}
                            tick={{ fontSize: 12, fill: '#86909C' }}
                            axisLine={false}
                            tickLine={false}
                            width={60}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#2481F2', strokeWidth: 1, strokeDasharray: '4 4' }} wrapperStyle={{ zIndex: 50 }} />

                        {hasGroupedLegend && styleSeries.length && dataSeries.length
                            ? dataSeries.flatMap(dataItem =>
                                  styleSeries.map(styleItem => {
                                      if (hiddenDataKeys.includes(dataItem.key) || hiddenStyleKeys.includes(styleItem.key)) return null;
                                      const dataKey = buildDataKey(dataItem.key, styleItem.key);
                                      return (
                                          <Line
                                              key={dataKey}
                                              type="stepAfter"
                                              dataKey={dataKey}
                                              stroke={dataItem.color}
                                              strokeWidth={styleItem.width || dataItem.width || 2}
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
                                              type="stepAfter"
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
