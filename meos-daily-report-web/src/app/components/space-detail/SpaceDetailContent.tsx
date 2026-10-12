// @ts-nocheck
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { SpaceTempChart } from './SpaceTempChart';
import { OperationStatusChart } from './OperationStatusChart';
import { ExceptionLog } from './ExceptionLog';
import { SimpleLineChart, SimpleLineChartSeries } from './SimpleLineChart';
import svgPaths from '@/imports/svg-3yvktca649';
dayjs.extend(isBetween);
// --- Dropdown Components (Copied from EnvQualitySection) ---

const SearchIcon = () => (
    <div className="relative shrink-0 size-[16px]">
        <svg className="block size-full" fill="none" viewBox="0 0 15 15">
            <path d={svgPaths.p31c5baf0} fill="#8B949E" />
            <path d={svgPaths.p2f80fb00} fill="#1B2129" />
        </svg>
    </div>
);

const ExpandIcon = () => (
    <div className="relative shrink-0 size-[16px]">
        <svg className="block size-full" fill="none" viewBox="0 0 16 16">
            <path clipRule="evenodd" d={svgPaths.p2211cd00} fill="#8B949E" fillRule="evenodd" />
        </svg>
    </div>
);

const CollapseIcon = () => (
    <div className="relative shrink-0 size-[16px]">
        <svg className="block size-full" fill="none" viewBox="0 0 16 16">
            <path clipRule="evenodd" d={svgPaths.p2ad65d40} fill="#8B949E" fillRule="evenodd" />
        </svg>
    </div>
);

const Dropdown = ({
    value,
    options,
    onChange,
    onClear,
    placeholder = '请选择',
    className = '',
    hasSearch = false,
    onSearch = (val: string) => {},
    label,
    multiSelect = false,
    defaultExpandLevel = 0
}: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());

    // Handle multi-select value normalization
    const selectedValues = useMemo(() => {
        if (Array.isArray(value)) return new Set(value);
        // If value is a string and not empty, it's selected. If empty string, no selection.
        return new Set(value && value !== 'all' ? [value] : value === 'all' ? ['all'] : []);
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Initial expansion
    useEffect(() => {
        if (defaultExpandLevel > 0 && options.length > 0) {
            const keys = new Set<string>();
            const traverse = (nodes: any[], currentLevel: number) => {
                if (currentLevel >= defaultExpandLevel) return;
                nodes.forEach(node => {
                    if (node.children && node.children.length > 0) {
                        keys.add(node.value);
                        traverse(node.children, currentLevel + 1);
                    }
                });
            };
            traverse(options, 0);
            setExpandedKeys(keys);
        }
    }, [options, defaultExpandLevel]);

    const toggleExpand = (key: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const newKeys = new Set(expandedKeys);
        if (newKeys.has(key)) {
            newKeys.delete(key);
        } else {
            newKeys.add(key);
        }
        setExpandedKeys(newKeys);
    };

    const handleSelect = (val: string, e: React.MouseEvent) => {
        e.stopPropagation();

        if (!multiSelect) {
            onChange(val);
            setIsOpen(false);
            return;
        }

        // Multi-select logic
        const newSet = new Set(selectedValues);
        if (newSet.has(val)) {
            newSet.delete(val);
        } else {
            newSet.add(val);
        }

        const newArray = Array.from(newSet);
        if (newArray.length === 0) onChange('');
        else onChange(newArray);
    };

    const renderTree = (nodes: any[], level = 0) => {
        if (!nodes || nodes.length === 0) {
            if (level === 0 && search) {
                return (
                    <div className="mx-3 w-[calc(100%-24px)] rounded-[6px] bg-[#FAFBFC] px-3 py-2 text-center">
                        <p className="text-sm text-[#4E5969] leading-[22px]">暂无数据</p>
                    </div>
                );
            }
            return null;
        }

        const renderedNodes = nodes
            .map(node => {
                const hasChildren = Array.isArray(node?.children) && node.children.length > 0;
                const isLeaf = !hasChildren;
                const isExpanded = expandedKeys.has(node.value);
                const isSelected = selectedValues.has(node.value);
                const renderedChildren = !isLeaf ? renderTree(node.children, level + 1) : null;
                const hasVisibleChildren = Array.isArray(renderedChildren) ? renderedChildren.length > 0 : Boolean(renderedChildren);
                // Indentation: Level 0 = 8px, Level 1 = 32px, Level 2 = 56px...
                const paddingLeft = level === 0 ? 8 : level === 1 ? 32 : 56;

                // Search filtering
                if (search && isLeaf && !node.label.toLowerCase().includes(search.toLowerCase())) {
                    return null;
                }

                if (search && !isLeaf && !hasVisibleChildren) {
                    return null;
                }

                return (
                    <div key={node.value} className="w-full flex flex-col">
                        <div
                            className="flex flex-row items-center w-full hover:bg-[#F2F3F5] cursor-pointer group transition-colors min-h-[40px]"
                            onClick={e => {
                                if (!isLeaf) toggleExpand(node.value, e);
                                else handleSelect(node.value, e);
                            }}
                        >
                            <div className="content-stretch flex gap-[8px] items-center pr-[12px] relative w-full h-full" style={{ paddingLeft: `${paddingLeft}px` }}>
                                {!isLeaf ? (
                                    <div className="relative rounded-[4px] shrink-0 size-[16px] cursor-pointer" onClick={e => toggleExpand(node.value, e)}>
                                        {isExpanded ? <CollapseIcon /> : <ExpandIcon />}
                                    </div>
                                ) : (
                                    multiSelect && (
                                        <div
                                            className={`relative shrink-0 size-[16px] border rounded-[4px] flex items-center justify-center transition-colors ${
                                                isSelected ? 'bg-[#246FE5] border-[#246FE5]' : 'bg-white border-[#C4C9CF]'
                                            }`}
                                        >
                                            {isSelected && <Check className="w-3 h-3 text-white" />}
                                        </div>
                                    )
                                )}

                                <p
                                    className={`flex-[1_0_0] font-['Microsoft_YaHei_UI',sans-serif] leading-[22px] text-[14px] ${
                                        isSelected && !multiSelect ? 'text-[#246FE5] font-bold' : 'text-[#1b2129] ellipsis'
                                    }`}
                                    title={node.label}
                                >
                                    {node.label}
                                </p>
                            </div>
                        </div>
                        {!isLeaf && isExpanded && <div className="w-full">{renderedChildren}</div>}
                    </div>
                );
            })
            .filter(Boolean);

        if (level === 0 && search && renderedNodes.length === 0) {
            return (
                <div className="mx-3 w-[calc(100%-24px)] rounded-[6px] bg-[#FAFBFC] px-3 py-2 text-center">
                    <p className="text-sm text-[#4E5969] leading-[22px]">暂无数据</p>
                </div>
            );
        }

        return renderedNodes;
    };

    const displayOptions = useMemo(() => options, [options]);

    const displayLabel = useMemo(() => {
        if (selectedValues.size === 0) return placeholder;
        if (selectedValues.has('all')) return '全部';
        if (selectedValues.size === 1) {
            const val = Array.from(selectedValues)[0];
            // BFS search for label
            let foundLabel = val;
            const queue = [...options];
            while (queue.length > 0) {
                const node = queue.shift();
                if (node.value === val) {
                    foundLabel = node.label;
                    break;
                }
                if (node.children) queue.push(...node.children);
            }
            return foundLabel;
        }
        return `已选 ${selectedValues.size} 项`;
    }, [selectedValues, options, placeholder]);

    const showClear = useMemo(() => {
        if (!onClear) return false;
        if (multiSelect) {
            return Array.isArray(value) && value.length > 0;
        }
        return value && value !== 'all';
    }, [value, multiSelect, onClear]);

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            <div className="flex items-center gap-2 cursor-pointer outline-none transition-opacity hover:opacity-80">
                <div className="flex items-center gap-2" onClick={() => setIsOpen(!isOpen)}>
                    {label && <span className="text-sm text-[#86909C]">{label}</span>}
                    <span className={`text-sm ${selectedValues.size === 0 ? 'text-[#C4C9CF]' : 'text-[#1B2129]'} max-w-[200px] ellipsis`} title={displayLabel}>
                        {displayLabel}
                    </span>
                </div>

                {showClear ? (
                    <div
                        className="flex items-center justify-center w-4 h-4 rounded-full hover:bg-[#F2F3F5] text-[#C4C9CF] hover:text-[#626C78]"
                        onClick={e => {
                            e.stopPropagation();
                            onClear();
                        }}
                    >
                        <X className="w-3 h-3" />
                    </div>
                ) : (
                    <ChevronDown className={`w-4 h-4 text-[#C4C9CF] transition-transform ${isOpen ? 'rotate-180' : ''}`} onClick={() => setIsOpen(!isOpen)} />
                )}
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-[300px] max-h-[400px] flex flex-col items-start bg-white rounded-[4px] shadow-[0px_3px_12px_0px_rgba(27,33,41,0.12),0px_0.5px_3px_0px_rgba(27,33,41,0.08)] z-[1000] overflow-hidden">
                    {hasSearch && (
                        <div className="flex flex-col items-center justify-center w-full p-[12px] pb-[4px] bg-white border-b border-transparent shrink-0">
                            <div className="bg-white relative rounded-[4px] shrink-0 w-full group border border-[#c4c9cf] focus-within:border-[#246FE5] transition-colors">
                                <div className="flex flex-row items-center size-full">
                                    <div className="content-stretch flex gap-[8px] items-center pl-[12px] pr-[8px] py-[5px] relative w-full">
                                        <SearchIcon />
                                        <input
                                            className="flex-[1_0_0] font-['Microsoft_YaHei_UI',sans-serif] leading-[22px] min-h-px min-w-px not-italic relative text-[#1b2129] text-[14px] outline-none border-none bg-transparent placeholder-[#c4c9cf]"
                                            placeholder="搜索"
                                            value={search}
                                            onChange={e => setSearch(e.target.value)}
                                            autoFocus
                                            onClick={e => e.stopPropagation()}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="w-full overflow-y-auto flex-1 py-[8px]">{renderTree(displayOptions)}</div>
                </div>
            )}
        </div>
    );
};

// --- Main Component ---

const SectionTitle = ({ title }: { title: string }) => (
    <div className="flex items-center gap-[9px] mb-4">
        <div className="w-[3px] h-[14px] bg-[#246FE5]" />
        <h3 className="text-base font-bold text-[#2E3742]">{title}</h3>
    </div>
);


const TYPE_OPTIONS = [
    { label: '全部', value: 'all' },
    { label: '过冷', value: 'overCool' },
    { label: '持续偏冷', value: 'longCool' },
    { label: '持续偏热', value: 'longHeat' },
    { label: '过热', value: 'overHeat' }
];

const TYPE_TO_TAG_KEY: Record<string, string> = {
    overCool: 'TOO_COLD',
    longCool: 'COLD',
    longHeat: 'HOT',
    overHeat: 'TOO_HOT'
};

const COLOR_POOL = ['#2481F2', '#33D4D2', '#FFD873', '#B286F5', '#7188A6', '#9FC9FB', '#E9A8E6', '#E6D1FF', '#D3B2FF', '#FCEF7E', '#FFB800', '#FA9B96'];

const INFO_GROUPS = [
    {
        key: 'operationStatus',
        title: '运行状态',
        type: 'status',
        infoCodes: [
            { code: 'equipSwitchSet', label: '设备开关设定' },
            { code: 'runStatus', label: '运行状态' }
        ]
    },
    {
        key: 'serviceAreaTemp',
        title: '服务区域温度(℃)',
        type: 'line',
        unit: '℃',
        infoCodes: [
            { code: 'tTargetSet', label: '服务区域温度设定' },
            { code: 'tTarget', label: '服务区域温度' }
        ]
    },
    {
        key: 'supplyAirTemp',
        title: '送风温度(℃)',
        type: 'line',
        unit: '℃',
        infoCodes: [
            { code: 'supplyAirTempSet', label: '送风温度设定' },
            { code: 'supplyAirTemp', label: '送风温度' }
        ]
    }
];

const getAvailableInfoCodes = (details: any[], infoCodes: Array<{ code: string; label: string }>) => {
    return infoCodes.filter(info =>
        details.some(detail => {
            const values = detail?.infoCode2DateTime2Value?.[info.code];
            return values && Object.keys(values).length > 0;
        })
    );
};

const buildChartData = (details: any[], infoCodes: Array<{ code: string; label: string }>) => {
    details.forEach(detail => {
        infoCodes.forEach(info => {
            const infoCode2DateTime2Value = detail?.infoCode2DateTime2Value;
            if (!infoCode2DateTime2Value) return;

            const values = infoCode2DateTime2Value[info.code] || {};
            // infoCode2DateTime2Value[info.code] 的数据格式为{ '2024-06-01T08:00': '22.5', '2024-06-01T08:15': '22.3' }将其转为{ '08:00': '22.5', '08:15': '22.3' }

            const mergedValues: Record<string, any> = { ...values };
            Object.keys(values).forEach((key: string) => {
                const keyStr = String(key);
                const matched = keyStr.match(/(\d{2}:\d{2})(?::\d{2})?/);
                if (!matched) return;

                const hhmm = matched[1];
                if (!Object.prototype.hasOwnProperty.call(mergedValues, hhmm)) {
                    mergedValues[hhmm] = values[key];
                }
            });

            infoCode2DateTime2Value[info.code] = mergedValues;
        });
    });

    // 默认times是00:00-23:45的完整时间点数组【00:00， 00:15...】,十五分钟间隔
    const times = Array.from({ length: 96 }, (_, i) =>
        dayjs()
            .startOf('day')
            .add(i * 15, 'minutes')
            .format('HH:mm')
    );

    return times.map(time => {
        const row: Record<string, any> = { time: time };
        details.forEach((detail, index) => {
            const deviceKey = `device${index + 1}`;
            infoCodes.forEach(info => {
                const val = detail?.infoCode2DateTime2Value?.[info.code]?.[time];
                const num = val !== undefined && val !== null && val !== '' ? Number(val) : null;
                const dataKey = `${deviceKey}${info.code.charAt(0).toUpperCase()}${info.code.slice(1)}`;
                row[dataKey] = Number.isNaN(num) ? null : num;
            });
        });
        return row;
    });
};

export const SpaceDetailContent: React.FC<any> = ({ spaceOptions, spaceData, envQualityData, spaceList, reportDate }) => {
    const [selectedType, setSelectedType] = useState('all');
    const [selectedSpace, setSelectedSpace] = useState(spaceData?.id || '');
    const [currentData, setCurrentData] = useState(spaceData);
    const typeOptions = useMemo(() => {
        const dynamicOptions = TYPE_OPTIONS.filter(option => {
            if (option.value === 'all') return true;
            const targetTagKey = TYPE_TO_TAG_KEY[option.value];
            if (!targetTagKey) return false;
            return (spaceList || []).some((item: any) => Array.isArray(item?.timeTag) && item.timeTag.some((tag: any) => tag?.tagKey === targetTagKey));
        });
        return dynamicOptions.length ? dynamicOptions : [{ label: '全部', value: 'all' }];
    }, [spaceList]);

    useEffect(() => {
        if (!typeOptions.some(option => option.value === selectedType)) {
            setSelectedType('all');
        }
    }, [typeOptions, selectedType]);

    const filteredSpaceIdSet = useMemo(() => {
        if (selectedType === 'all') {
            return new Set((spaceList || []).map((item: any) => item.id));
        }

        const targetTagKey = TYPE_TO_TAG_KEY[selectedType];
        if (!targetTagKey) {
            return new Set((spaceList || []).map((item: any) => item.id));
        }

        return new Set(
            (spaceList || []).filter((item: any) => Array.isArray(item?.timeTag) && item.timeTag.some((tag: any) => tag?.tagKey === targetTagKey)).map((item: any) => item.id)
        );
    }, [spaceList, selectedType]);

    const filteredSpaceOptions = useMemo(() => {
        const filterTree = (nodes: any[]): any[] => {
            return (nodes || [])
                .map(node => {
                    const children = Array.isArray(node?.children) ? filterTree(node.children) : undefined;

                    if (children && children.length > 0) {
                        return { ...node, children };
                    }

                    if (!node?.children || node.children.length === 0) {
                        return filteredSpaceIdSet.has(node.value) ? node : null;
                    }

                    return null;
                })
                .filter(Boolean);
        };

        return filterTree(spaceOptions || []);
    }, [spaceOptions, filteredSpaceIdSet]);

    const firstFilteredSpaceId = useMemo(() => {
        const findFirstLeaf = (nodes: any[]): string => {
            for (const node of nodes || []) {
                if (Array.isArray(node?.children) && node.children.length > 0) {
                    const id = findFirstLeaf(node.children);
                    if (id) return id;
                } else if (node?.value) {
                    return node.value;
                }
            }
            return '';
        };
        return findFirstLeaf(filteredSpaceOptions);
    }, [filteredSpaceOptions]);

    useEffect(() => {
        if (!selectedSpace) return;

        if (!filteredSpaceIdSet.has(selectedSpace)) {
            if (firstFilteredSpaceId) {
                const data = (spaceList || []).find((item: any) => item.id === firstFilteredSpaceId);
                if (data) {
                    setSelectedSpace(firstFilteredSpaceId);
                    setCurrentData(data);
                }
            } else {
                setSelectedSpace('');
                setCurrentData(null);
            }
        }
    }, [selectedSpace, filteredSpaceIdSet, firstFilteredSpaceId, spaceList]);

    const tdbQuality = spaceData?.tdbQuality || envQualityData?.chapterData?.space?.tdbQuality;
    const temperatureStandardText = useMemo(() => {
        if (!tdbQuality) return '--';

        const toHourMinute = (value: string) => {
            if (!value || typeof value !== 'string') return '';
            return value.slice(0, 5);
        };

        const unscheduledRanges = Array.isArray(tdbQuality.temperatureUnscheduledTimeRange) ? tdbQuality.temperatureUnscheduledTimeRange : [];
        const unscheduledRangeText = unscheduledRanges
            .map((range: any) => {
                const beginTime = toHourMinute(range?.beginTime?.absoluteTime);
                const endTime = toHourMinute(range?.endTime?.absoluteTime);
                if (!beginTime || !endTime) return '';
                return `${beginTime}~${range?.acrossDay ? `次日${endTime}` : endTime}`;
            })
            .filter(Boolean)
            .join('、');

        const scheduledHourRaw = tdbQuality.temperatureContinuousScheduledHour;
        const scheduledHour = Number(scheduledHourRaw);
        const isZeroOrInvalidHour = Number.isNaN(scheduledHour) || scheduledHour <= 0;

        if (isZeroOrInvalidHour) {
            return '在空间营业时段内，室内温度仅保持在舒适区间';
        }

        let text = `在空间营业时段内，室内温度不可超过过冷/过热门限，允许持续偏冷/偏热不超过${scheduledHourRaw}h`;
        if (unscheduledRangeText) {
            text += `，但其中${unscheduledRangeText}温度仅能保持在舒适区间`;
        }

        return text;
    }, [tdbQuality]);

    const chartData = useMemo(() => {
        if (!currentData) return [];
				const airSeasonType = envQualityData?.chapterData?.space?.airSeasonType;
        const seasonQuality = tdbQuality?.seasonQuality?.find(item => item.airSeason === airSeasonType) || tdbQuality?.seasonQuality?.[0] || {};
        // 默认生成全天 00:00 - 23:45（每15分钟）时间点，缺失数据补 null
        const times = Array.from({ length: 96 }, (_, index) =>
            dayjs()
                .startOf('day')
                .add(index * 15, 'minute')
                .format('HH:mm')
        );

        const tdbMap: Record<string, any> = {};
        Object.entries(currentData.dateTime2Tdb || {}).forEach(([time, value]) => {
            tdbMap[dayjs(time).format('HH:mm')] = value;
        });

        const targetMap: Record<string, any> = {};
        Object.entries(currentData.dateTime2TempTwinControlAim || {}).forEach(([time, value]) => {
            targetMap[dayjs(time).format('HH:mm')] = value;
        });

        const businessTime = currentData.businessTime || []; // ['10:00,20:00']
        const arr = times.map(hourMin => {
            let isOperating = false;
            businessTime.forEach((element: string) => {
                const startTime = element.split(',')[0];
                const endTime = element.split(',')[1];
                // 判断hourMin是否在startTime和endTime之间
                if (dayjs(hourMin, 'HH:mm').isBetween(dayjs(startTime, 'HH:mm'), dayjs(endTime, 'HH:mm'), null, '[)')) {
                    isOperating = true;
                }
            });

            const actualRaw = tdbMap[hourMin];
            const targetRaw = targetMap[hourMin];
            const actualTemp = actualRaw !== undefined && actualRaw !== null && actualRaw !== '' ? Number(actualRaw) : null;
            const targetTemp = targetRaw !== undefined && targetRaw !== null && targetRaw !== '' ? Number(targetRaw) : null;
            const obj = {
                time: hourMin,
                actualTemp,
                aiTemp: null,
                targetTemp,
                operatingHours: isOperating,
                overcoolLimit: seasonQuality?.underCoolingSeasonLimitValue,
                comfortLower: seasonQuality?.lowerComfortSeasonLimitValue,
                comfortUpper: seasonQuality?.upperComfortSeasonLimitValue,
                overheatLimit: seasonQuality?.overHeatingSeasonLimitValue
            };
            return obj;
        });

        return arr;
    }, [currentData, tdbQuality]);
    const infoCodeDefines = useMemo(() => {
        const classCode2InfoCodeDefines = envQualityData.chapterData.space?.classCode2InfoCodeDefines || {};
        const obj: Record<string, any> = {};

        Object.values(classCode2InfoCodeDefines).forEach((item: any) => {
            item.forEach((element: { code: string | number }) => {
                obj[element.code] = element;
            });
        });
        return obj;
    }, [envQualityData]);
    const classCodeDefines = Object.keys(currentData?.relClassCode2Detail || {});
    const changeSelectedSpace = (val: string) => {
        const data = spaceList.find((item: any) => item.id === val);
        setCurrentData(data);
        setSelectedSpace(val);
    };
    return (
        <div className="p-6 space-y-4 bg-[#F1F4F6] min-h-full">
            {/* Section 1: Space Temp */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
                <SectionTitle title="空间温度" />
                <SpaceTempChart
                    data={chartData}
                    businessTime={currentData?.businessTime || []}
                    spaceData={currentData}
                    reportDate={reportDate}
                    filterContent={
                        <div className="flex items-center gap-4">
                            <Dropdown
                                label="类型："
                                value={selectedType}
                                options={typeOptions}
                                onChange={setSelectedType}
                                onClear={() => setSelectedType('all')}
                                multiSelect={false}
                                className="min-w-24"
                            />
                            <div className="w-[1px] h-3 bg-[#E5E6EB]" />
                            <Dropdown
                                label="空间名称："
                                value={selectedSpace}
                                options={filteredSpaceOptions}
                                onChange={changeSelectedSpace}
                                className="min-w-32"
                                hasSearch
                                placeholder="请选择"
                                multiSelect={false}
                                defaultExpandLevel={2}
                            />
                        </div>
                    }
                />
                <div className="mt-4 pt-4 border-t border-[#E5E6EB] text-xs text-[#86909C] leading-relaxed">
                    <p className="mb-1">服务该空间的系统：{currentData?.serviceSystems?.map((item: any) => item.localName).join('、') || '--'}</p>
                    <p>温度标准：{temperatureStandardText}</p>
                </div>
            </div>
            {classCodeDefines.map((classCode: string) => {
                const details = currentData?.relClassCode2Detail?.[classCode] || [];
                const dataSeries: SimpleLineChartSeries[] = details.map((detail: any, index: number) => ({
                    key: `device${index + 1}`,
                    label: detail?.object?.localName || detail?.object?.dynamicName || `设备${index + 1}`,
                    color: COLOR_POOL[index % COLOR_POOL.length],
                    width: 1,
                    group: 'data'
                }));


                return (
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <SectionTitle title={`服务空间的${envQualityData.chapterData.space.classCode2Define?.[classCode]?.name || classCode}`} />
                        {INFO_GROUPS.map((group, idx) => {
                            const availableInfoCodes = group.infoCodes;
                            if (!availableInfoCodes.length || dataSeries.length === 0) return null;
                            const chartSeries: SimpleLineChartSeries[] = [
                                ...availableInfoCodes.map((info, infoIndex) => ({
                                    key: info.code,
                                    label: info.label,
                                    dataSources: infoCodeDefines[info.code],
                                    color: '#86909C',
                                    width: 2,
                                    strokeDasharray: infoIndex === 1 ? '4 4' : undefined,
                                    group: 'style'
                                })),
                                ...dataSeries
                            ];

                            const chartDataByGroup = buildChartData(details, availableInfoCodes);
                            if (classCode !== 'ACATAH' && group.key === 'supplyAirTemp') {
                                return null;
                            }
                            return (
                                <div key={`${classCode}-${group.key}`}>
                                    {idx > 0 && <div className="h-px bg-[#E5E6EB] my-6" />}
                                    {group.type === 'status' ? (
                                        <OperationStatusChart
                                            classCode2InfoCodeDefines={envQualityData.chapterData.space.classCode2InfoCodeDefines || {}}
                                            data={chartDataByGroup}
                                            series={chartSeries}
                                            reportDate={reportDate}
                                            title={group.title}
                                        />
                                    ) : (
                                        <SimpleLineChart
                                            data={chartDataByGroup}
                                            series={chartSeries}
                                            unit={group.unit || '℃'}
                                            reportDate={reportDate}
                                            title={group.title}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                );
            })}
            {/* Section 5: Exception Logs */}
            {currentData?.exceptionRecords?.length > 0 && (
                <div className="bg-white rounded-lg p-4 shadow-sm">
                    <SectionTitle title="设备异常记录" />
                    <ExceptionLog
                        logs={currentData.exceptionRecords}
                        infoCodeDefines={infoCodeDefines}
                        classCode2InfoCodeDefines={envQualityData.chapterData.space.classCode2InfoCodeDefines || {}}
                    />
                </div>
            )}
        </div>
    );
};
