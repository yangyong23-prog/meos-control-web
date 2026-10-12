// @ts-nocheck
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search, X } from 'lucide-react';

import { TableText } from '@/app/components/common/TableText';
import { SpaceDetailPopup } from '@/app/components/SpaceDetailPopup';
import svgPaths from '@/imports/svg-3yvktca649';
import { useTreeBuildFloor } from '@/app/hooks/useTreeBuildFloor';
import { orderBy } from 'lodash';

interface EnvQualitySectionProps {
    data: any;
    children?: React.ReactNode;
}

const STATUS_CONFIG = {
    0: { label: '达标', color: '#B6E9C7' },
    1: { label: '持续偏热', color: '#FFD873' },
    2: { label: '空间过热', color: '#F8766F' },
    3: { label: '持续偏冷', color: '#7EE2F0' },
    4: { label: '空间过冷', color: '#72ACF3' },
    5: { label: '无法监测', color: '#E1E5EB' }
};

const TYPE_OPTION_DEFS = [
    { label: '过冷', value: 'overCool' }, // Maps to status 4
    { label: '持续偏冷', value: 'longCool' }, // Maps to status 3
    { label: '持续偏热', value: 'longHeat' }, // Maps to status 1
    { label: '过热', value: 'overHeat' } // Maps to status 2
];

// Helper to map type value to status code
const getStatusForType = (type: string): number | null => {
    switch (type) {
        case 'overCool':
            return 4;
        case 'longCool':
            return 3;
        case 'longHeat':
            return 1;
        case 'overHeat':
            return 2;
        default:
            return null;
    }
};

// --- Figma Design Components ---

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
            if (level === 0 && search) return <div className="px-3 py-2 text-xs text-[#86909C] text-center">无匹配项</div>;
            return null;
        }

        return nodes.map(node => {
            const isLeaf = !node.children || node.children.length === 0;
            const isExpanded = expandedKeys.has(node.value);
            const isSelected = selectedValues.has(node.value);
            // Indentation: Level 0 = 8px, Level 1 = 32px, Level 2 = 56px...
            const paddingLeft = level === 0 ? 8 : level === 1 ? 32 : 56;

            // Search filtering
            if (search && isLeaf && !node.label.toLowerCase().includes(search.toLowerCase())) {
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
                    {!isLeaf && isExpanded && <div className="w-full">{renderTree(node.children, level + 1)}</div>}
                </div>
            );
        });
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
                                            className="flex-[1_0_0] font-['Microsoft_YaHei_UI',sans-serif] leading-[22px] min-h-px min-w-px not-italic relative text-[#1b2129] text-[14px] outline-none border-none bg-transparent placeholder-[#c4c9cf] ellipsis"
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

export const EnvQualitySection: React.FC<EnvQualitySectionProps> = ({ data, children, reportDate }) => {
    console.log('EnvQualitySection', data);

    const { chapterData } = data;
    if (!chapterData) {
        return (
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <div className="bg-[#246FE5] h-[20px] w-[3px] rounded-full" />
                    <h2 className="text-xl font-bold text-[#2E3742]">{data.label}</h2>
                </div>
                <div className="rounded-[8px] border border-white bg-white/50 p-[16px] text-[#86909C] text-[14px]">暂未获取到数据</div>
                {children}
            </div>
        );
    }

    const [onlyAbnormal, setOnlyAbnormal] = useState(true);
    const [selectedType, setSelectedType] = useState('all');
    const [selectedSpace, setSelectedSpace] = useState<string | string[]>('');
    const [showSpacePopup, setShowSpacePopup] = useState(false);
    const [spaceData, setSpaceData] = useState(null);

    const { getBuildOrFloorById, buildData } = useTreeBuildFloor();
    const arr = data.chapterData.space.spaceDetails?.map((item: any) => ({ ...item, floorSequenceId: getBuildOrFloorById(item.floorId)?.floorSequenceId })) || [];
    const spaceDetails = orderBy(arr, ['floorSequenceId'], ['asc']);
    const timeSlots = useMemo(() => {
        const arr: string[] = [];
        spaceDetails.forEach((item: any) => {
            // businessTime数据格式为[]"08:00,10:00" 代表08:00-10:00这个时间段
            // 取整点的数据及 08 、09、10点的数据放入arr数组里面
            item.businessTime.forEach(time => {
                const [startTime, endTime] = time.split(',');
                const startHour = parseInt(startTime.split(':')[0], 10);
                const endHour = parseInt(endTime.split(':')[0], 10);
                for (let hour = startHour; hour <= endHour; hour++) {
                    arr.push(`${hour > 9 ? hour : `0${hour}`}:00`);
                }
            });
        });
        // 去重arr
        const uniqueArr = Array.from(new Set(arr));
        // 排序 按时间段顺序排序
        uniqueArr.sort((a, b) => {
            const [aHour, aMin] = a.split(':').map(Number);
            const [bHour, bMin] = b.split(':').map(Number);
            if (aHour === bHour) {
                return aMin - bMin;
            }
            return aHour - bHour;
        });
        return uniqueArr;
    }, [spaceDetails]);
    const AIR_SPACE_STATUS: any = {
        // 过冷
        TOO_COLD: 4,
        // 偏冷
        COLD: 3,
        // 偏热
        HOT: 1,
        // 过热
        TOO_HOT: 2,
        // 正常/舒适
        APPROPRIATE: 0
    };
    const normalizedData = useMemo(() => {
        return spaceDetails.map((row: any) => {
            const statusMap: Record<string, number> = {};
            row.timeTag?.forEach((item: any) => {
                const time = item.time?.split(',')[0];
                if (!time) return;
                statusMap[time] = AIR_SPACE_STATUS[item.tagKey] ?? 5;
            });

            const status = timeSlots.map(time => statusMap[time] ?? 5);
            return { ...row, status };
        });
    }, [spaceDetails, timeSlots]);

    const spaceOptionsSourceRows = useMemo(() => {
        return normalizedData.filter((row: any) => {
            if (onlyAbnormal) {
                const isAbnormal = row.status?.some((s: number) => s !== 0 && s !== 5);
                if (!isAbnormal) return false;
            }

            const targetStatus = getStatusForType(selectedType);
            if (targetStatus !== null) {
                const hasStatus = row.status?.includes(targetStatus);
                if (!hasStatus) return false;
            }

            return true;
        });
    }, [normalizedData, onlyAbnormal, selectedType]);

    // Extract unique spaces for dropdown (use id as value)
    const spaceOptions = useMemo(() => {
        const floors: Record<string, Map<string, string>> = {};
        spaceOptionsSourceRows.forEach((r: any) => {
            const floor = r.floorId || '其他';
            if (!floors[floor]) floors[floor] = new Map();
            if (r?.id && r?.localName) {
                floors[floor].set(r.id, r.localName);
            }
        });

        const floorNodes = Object.entries(floors)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([floor, spaces]) => ({
                label: getBuildOrFloorById(floor)?.localName,
                value: floor,
                buildingId: getBuildOrFloorById(floor)?.buildingId,
                buildingName: getBuildOrFloorById(floor)?.buildingName,
                children: Array.from(spaces.entries())
                    .sort((a, b) => a[1].localeCompare(b[1]))
                    .map(([id, name]) => ({ label: name, value: id }))
            }));
        // 根据buildingId进行分组 按照这种形式 [{value: 1, label: 'xxx', children: []}]
        const builds = floorNodes.reduce((acc: any[], floor) => {
            const buildingId = floor.buildingId || 'other';
            const buildingName = floor.buildingName || '其他';
            let buildNode = acc.find(b => b.value === buildingId);
            if (!buildNode) {
                buildNode = { label: buildingName, value: buildingId, children: [] };
                acc.push(buildNode);
            }
            buildNode.children.push(floor);
            return acc;
        }, []);

        return builds;
    }, [spaceOptionsSourceRows, getBuildOrFloorById]);

    useEffect(() => {
        if (!selectedSpace || selectedSpace.length === 0) return;

        const validIds = new Set(spaceOptionsSourceRows.map((item: any) => item.id));

        if (Array.isArray(selectedSpace)) {
            const nextSelected = selectedSpace.filter(id => validIds.has(id));
            if (nextSelected.length !== selectedSpace.length) {
                setSelectedSpace(nextSelected.length > 0 ? nextSelected : '');
            }
            return;
        }

        if (!validIds.has(selectedSpace)) {
            setSelectedSpace('');
        }
    }, [spaceOptionsSourceRows, selectedSpace]);

    const statusCounts = useMemo(() => {
        const counts = {
            overCool: 0,
            longCool: 0,
            longHeat: 0,
            overHeat: 0
        };

        normalizedData.forEach((row: any) => {
            const hasOverCool = row.status?.some((s: number) => s === 4);
            const hasLongCool = row.status?.some((s: number) => s === 3);
            const hasLongHeat = row.status?.some((s: number) => s === 1);
            const hasOverHeat = row.status?.some((s: number) => s === 2);

            if (hasOverCool) counts.overCool += 1;
            if (hasLongCool) counts.longCool += 1;
            if (hasLongHeat) counts.longHeat += 1;
            if (hasOverHeat) counts.overHeat += 1;
        });

        return counts;
    }, [normalizedData]);

    const typeOptions = useMemo(() => {
        return [{ label: '全部', value: 'all' }, ...TYPE_OPTION_DEFS.filter(option => statusCounts[option.value] > 0)];
    }, [statusCounts]);

    const statusSummaryItems = useMemo(() => {
        const items = [] as Array<{ key: string; count: number; label: string }>;
        if (statusCounts.overCool) items.push({ key: 'overCool', count: statusCounts.overCool, label: '过冷' });
        if (statusCounts.longCool) items.push({ key: 'longCool', count: statusCounts.longCool, label: '持续偏冷' });
        if (statusCounts.longHeat) items.push({ key: 'longHeat', count: statusCounts.longHeat, label: '持续偏热' });
        if (statusCounts.overHeat) items.push({ key: 'overHeat', count: statusCounts.overHeat, label: '过热' });
        return items;
    }, [statusCounts]);

    useEffect(() => {
        if (!typeOptions.some(option => option.value === selectedType)) {
            setSelectedType('all');
        }
    }, [typeOptions, selectedType]);

    const topSpaces = useMemo(() => {
        let longestLongHeat: { id: string; name: string; count: number } | null = null;
        let mostOverHeat: { id: string; name: string; tagValue: number } | null = null;

        normalizedData.forEach((row: any) => {
            const longHeatCount = row.status?.filter((s: number) => s === 1).length || 0;
            const overHeatTagValues =
                row.timeTag
                    ?.filter((item: any) => item?.tagKey === 'TOO_HOT')
                    .map((item: any) => Number(item?.tagValue))
                    .filter((val: number) => Number.isFinite(val)) || [];
            const maxOverHeatTagValue = overHeatTagValues.length > 0 ? Math.max(...overHeatTagValues) : null;

            if (longHeatCount > 0) {
                if (!longestLongHeat || longHeatCount > longestLongHeat.count) {
                    longestLongHeat = { id: row.id, name: row.localName, count: longHeatCount };
                }
            }
            if (maxOverHeatTagValue !== null) {
                if (!mostOverHeat || maxOverHeatTagValue > mostOverHeat.tagValue) {
                    mostOverHeat = { id: row.id, name: row.localName, tagValue: maxOverHeatTagValue };
                }
            }
        });

        return { longestLongHeat, mostOverHeat };
    }, [normalizedData]);

    // Filter Data
    const filteredData = useMemo(() => {
        return normalizedData.filter((row: any) => {
            // 1. Abnormal Filter
            if (onlyAbnormal) {
                const isAbnormal = row.status?.some((s: number) => s !== 0 && s !== 5);
                if (!isAbnormal) return false;
            }

            // 2. Type Filter
            const targetStatus = getStatusForType(selectedType);
            if (targetStatus !== null) {
                const hasStatus = row.status.includes(targetStatus);
                if (!hasStatus) return false;
            }

            // 3. Space Filter
            if (selectedSpace && selectedSpace.length > 0) {
                const selected = Array.isArray(selectedSpace) ? selectedSpace : [selectedSpace];
                if (!selected.includes(row.id)) {
                    return false;
                }
            }

            return true;
        });
    }, [normalizedData, onlyAbnormal, selectedType, selectedSpace]);

    // Click Handlers for Description
    const handleTypeClick = (type: string) => {
        setSelectedType(type === selectedType ? 'all' : type);
    };

    const handleSpaceClick = (space: any) => {
        setSpaceData(space);
        setShowSpacePopup(true);
    };

    const linkClass = 'font-bold text-[#246FE5] cursor-pointer hover:text-[#374151] transition-colors mx-1';
    const textClass = 'font-bold text-[#1B2129] mx-1';
    const hasLongestLongHeat = Boolean(topSpaces.longestLongHeat?.name);
    const hasMostOverHeat = Boolean(topSpaces.mostOverHeat?.name);

    return (
        <div className="bg-white/50 backdrop-blur-sm p-4 rounded-[8px] space-y-[12px] relative z-20">
            <div className="relative inline-block">
                <h3 className="text-xl font-bold text-[#2E3742] relative z-10">环境品质</h3>
                <div className="absolute bottom-0.5 left-0 right-0 h-3 bg-[#0094FF]/20 z-0" />
            </div>
            {spaceDetails.length ? (
                <>
                    <div className="text-[14px] leading-[26px] text-[#626C78]">
                        管理了 <span className={textClass}>{spaceDetails.length}</span> 个空间的温度数据， 整体温度达标率为{' '}
                        <span className={textClass}>{data.chapterData?.space?.tdbComplianceRate ?? '--'}%</span>；{' '}
                        {statusSummaryItems.length > 0 ? '其中' : null}
                        {statusSummaryItems.map((item, index) => {
                            const isLast = index === statusSummaryItems.length - 1;
                            return (
                                <React.Fragment key={item.key}>
                                    <span
                                        className={selectedType === item.key ? textClass : linkClass}
                                        onClick={() => {
                                            setSelectedType(selectedType === item.key ? 'all' : item.key);
                                            setSelectedSpace('');
                                        }}
                                    >
                                        {item.count}
                                    </span>
                                    {`个空间出现${item.label}${isLast ? '。 ' : '、'}`}
                                </React.Fragment>
                            );
                        })}
                        {hasLongestLongHeat ? `${statusSummaryItems.length > 0 ? '其中' : ''}持续偏热时间最长的空间为` : null}
                        {hasLongestLongHeat ? (
                            <span
                                className={(() => {
                                    const id = topSpaces.longestLongHeat?.id;
                                    return id && (Array.isArray(selectedSpace) ? selectedSpace.includes(id) : selectedSpace === id) ? textClass : linkClass;
                                })()}
                                onClick={() => {
                                    const id = topSpaces.longestLongHeat?.id;
                                    if (!id) return;
                                    const isSelected = Array.isArray(selectedSpace) ? selectedSpace.includes(id) && selectedSpace.length === 1 : selectedSpace === id;
                                    if (isSelected) {
                                        setSelectedSpace('');
                                    } else {
                                        setSelectedSpace([id]);
                                        setSelectedType('all');
                                    }
                                }}
                            >
                                {topSpaces.longestLongHeat?.name || '--'}
                            </span>
                        ) : null}
                        {hasLongestLongHeat && hasMostOverHeat ? '，' : null}
                        {hasMostOverHeat ? '过热最严重的空间（与过热门限相比偏离最远）为' : null}
                        {hasMostOverHeat ? (
                            <span
                                className={(() => {
                                    const id = topSpaces.mostOverHeat?.id;
                                    return id && (Array.isArray(selectedSpace) ? selectedSpace.includes(id) : selectedSpace === id) ? textClass : linkClass;
                                })()}
                                onClick={() => {
                                    const id = topSpaces.mostOverHeat?.id;
                                    if (!id) return;
                                    const isSelected = Array.isArray(selectedSpace) ? selectedSpace.includes(id) && selectedSpace.length === 1 : selectedSpace === id;
                                    if (isSelected) {
                                        setSelectedSpace('');
                                    } else {
                                        setSelectedSpace([id]);
                                        setSelectedType('all');
                                    }
                                }}
                            >
                                {topSpaces.mostOverHeat?.name || '--'}
                            </span>
                        ) : null}
                        {hasLongestLongHeat || hasMostOverHeat ? '。' : null}
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-[#E1E5EB] flex flex-col gap-4">
                        {/* Filter Toolbar */}
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2 cursor-pointer select-none" onClick={() => setOnlyAbnormal(!onlyAbnormal)}>
                                    <div
                                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                            onlyAbnormal ? 'bg-[#246FE5] border-[#246FE5]' : 'bg-white border-[#C9CDD4]'
                                        }`}
                                    >
                                        {onlyAbnormal && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                    <span className="text-sm text-[#1B2129]">仅看品质异常空间</span>
                                </label>

                                <div className="flex items-center gap-3">
                                    <Dropdown
                                        label="类型："
                                        value={selectedType}
                                        options={typeOptions}
                                        onChange={setSelectedType}
                                        onClear={() => setSelectedType('all')}
                                        multiSelect={false}
                                        className="min-w-24"
                                    />

                                    <div className="w-px h-3 bg-[#E5E6EB]"></div>

                                    <Dropdown
                                        label="空间名称："
                                        value={selectedSpace}
                                        options={spaceOptions}
                                        onChange={setSelectedSpace}
                                        onClear={() => setSelectedSpace('')}
                                        className="min-w-32"
                                        hasSearch
                                        placeholder="请选择"
                                        multiSelect={true}
                                        defaultExpandLevel={2}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-xs text-[#626C78]">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-[3px]" style={{ backgroundColor: STATUS_CONFIG[0].color }} />
                                    达标
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-[3px]" style={{ backgroundColor: STATUS_CONFIG[1].color }} />
                                    持续偏热
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-[3px]" style={{ backgroundColor: STATUS_CONFIG[2].color }} />
                                    空间过热
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-[3px]" style={{ backgroundColor: STATUS_CONFIG[3].color }} />
                                    持续偏冷
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-[3px]" style={{ backgroundColor: STATUS_CONFIG[4].color }} />
                                    空间过冷
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-[3px]" style={{ backgroundColor: STATUS_CONFIG[5].color }} />
                                    无法监测
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-hidden rounded-none border border-[#E1E5EB]">
                            <table className="w-full border-collapse table-fixed">
                                <thead>
                                    <tr className="bg-[#F7F8FA] text-[12px] text-[#86909C] h-10">
                                        <th className={`${timeSlots.length === 0 ? 'w-1/2' : 'w-32'} px-2 font-normal border-r border-b border-[#E1E5EB]`}>楼层</th>
                                        <th className={`${timeSlots.length === 0 ? 'w-1/2' : 'w-32'} px-4 font-normal border-r border-b border-[#E1E5EB]`}>空间名称</th>
                                        {timeSlots.map(time => (
                                            <th key={time} className="px-1 font-normal border-r border-b border-[#E1E5EB] text-center">
                                                {time}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.length > 0 ? (
                                        filteredData.map((row: any, i: number) => (
                                            <tr key={`${row.name}-${i}`} className="text-sm h-9 hover:bg-[#F2F3F5] transition-colors">
                                                <td className="border-r border-b border-[#E1E5EB] text-center text-[#1B2129] font-medium bg-white">
                                                    <TableText className="text-center">
                                                        {getBuildOrFloorById(row.floorId)?.localName}
                                                        {buildData.length > 1 ? `(${getBuildOrFloorById(row.floorId)?.buildingName})` : ''}
                                                    </TableText>
                                                </td>
                                                <td
                                                    className="!px-4 border-r border-b border-[#E1E5EB] text-[#246FE5] cursor-pointer hover:text-[#1B4ACC] bg-white"
                                                    onClick={() => handleSpaceClick(row)}
                                                >
                                                    <TableText>{row.localName}</TableText>
                                                </td>
                                                {row.status.map((status: number, j: number) => (
                                                    <td key={j} className="!p-[2px] border-r border-b border-[#E1E5EB]">
                                                        <div
                                                            className="w-full h-8 transition-opacity hover:opacity-80"
                                                            style={{ backgroundColor: STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]?.color || STATUS_CONFIG[0].color }}
                                                        />
                                                    </td>
                                                ))}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={timeSlots.length + 2} className="py-8 text-center text-[#86909C] text-sm w-full h-[50px]">
                                                暂无符合条件的数据
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {showSpacePopup && (
                        <SpaceDetailPopup
                            onClose={() => setShowSpacePopup(false)}
                            spaceData={spaceData}
                            spaceList={spaceDetails}
                            spaceOptions={spaceOptions}
                            envQualityData={data}
                            reportDate={reportDate}
                        />
                    )}
                    {children}
                </>
            ) : (
                <div className="text-[#626C78] text-[14px]">所有空间均无法监测温度数据</div>
            )}
        </div>
    );
};
