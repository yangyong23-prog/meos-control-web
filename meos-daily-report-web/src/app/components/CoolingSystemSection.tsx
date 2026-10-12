import React, { useState, useMemo, useRef, useLayoutEffect } from "react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import imgBg from "@/assets/ed07366a06320f72100f9b26c58eca5ec52423c3.png";
import { ComposedChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { MTipsTooltip } from "@/app/components/common/MTipsTooltip";
import { SchedulePopup } from "@/app/components/SchedulePopup";
import { AIStrategyPopup } from "@/app/components/AIStrategyPopup";
import { ManualInterventionPopup } from "@/app/components/ManualInterventionPopup";
import { EfficiencySection } from "@/app/components/EfficiencySection";
import { formatTo1Decimal, formatMul100To1Decimal  } from "@/utils/format";
import dayjs from "dayjs";
import { isNil } from "lodash";

interface CoolingSystemSectionProps {
  data?: {
    exceptionLogs?: any[];
    westPlant?: {
      plantName?: string;
      [key: string]: any;
    };
    coolingSystem?: {
      mainRegulation?: any;
      zoneRegulation?: any;
      pumpGroupRegulation?: any;
      energyChart?: any[];
      operationChart?: any[];
      northZoneChart?: any[];
      terminalPumpChart?: any[];
      terminalPumpLogs?: any[];
      [key: string]: any;
    };
    runStatusDescription?: string;
    exceptionLogsEmptyMessage?: string;
    [key: string]: any;
    weather?: {
      maxTemperature?: string;
      minTemperature?: string;
      avgHumidity?: string;
      maxHumidity?: string;
      avgTemperature?: string;
      minHumidity?: string;
    };
  };
}

// --- Toggle Switch Component ---
const ToggleSwitch: React.FC<{ value: "chart" | "list"; onChange: (v: "chart" | "list") => void }> = ({ value, onChange }) => (
  <div className="inline-flex bg-[#E8ECF0] rounded-[4px] p-[2px] ml-3 h-[32px] items-center shrink-0 whitespace-nowrap">
    <div
      onClick={() => onChange("chart")}
      className={`px-[14px] min-w-[56px] shrink-0 flex items-center justify-center h-full text-[14px] rounded-[4px] transition-all leading-none whitespace-nowrap cursor-pointer ${
        value === "chart"
          ? "bg-white text-[#246FE5] font-bold font-['Microsoft_YaHei_UI:Bold',sans-serif] shadow-[0px_2px_10px_0px_rgba(27,33,41,0.1)]"
          : "text-[#1B2129] font-normal font-['Microsoft_YaHei_UI:Regular',sans-serif] hover:text-[#2E3742]"
      }`}
    >
      图表
    </div>
    <div
      onClick={() => onChange("list")}
      className={`px-[14px] min-w-[56px] shrink-0 flex items-center justify-center h-full text-[14px] rounded-[4px] transition-all leading-none whitespace-nowrap cursor-pointer ${
        value === "list"
          ? "bg-white text-[#246FE5] font-bold font-['Microsoft_YaHei_UI:Bold',sans-serif] shadow-[0px_2px_10px_0px_rgba(27,33,41,0.1)]"
          : "text-[#1B2129] font-normal font-['Microsoft_YaHei_UI:Regular',sans-serif] hover:text-[#2E3742]"
      }`}
    >
      列表
    </div>
  </div>
);

// --- Regulation Record Section Components ---

interface TimelineBlockProps {
  start: string; // HH:mm
  end: string;   // HH:mm
  value: string;
  type: 'set' | 'ai';
  category: string;
  timelineStart: number; // e.g., 8
  timelineEnd: number;   // e.g., 22
  isFirst?: boolean;
  isLast?: boolean;
  isEmpty?: boolean;
  unit?: string;
  blockStyle?: string;
}

const TimelineBlock: React.FC<TimelineBlockProps> = ({
  start, end, value, type, category, timelineStart, timelineEnd, isFirst, isLast, isEmpty, unit, blockStyle
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const parseTime = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h + m / 60;
  };

  const startTime = parseTime(start);
  // const endTime = parseTime(end); // Unused variable
  const totalDuration = timelineEnd - timelineStart;

  const left = ((startTime - timelineStart) / totalDuration) * 100;
  const width = ((parseTime(end) - startTime) / totalDuration) * 100;

  // Styles based on category and type
  const getStyles = () => {
    if (type === 'ai') {
       return "bg-[#F5F7FA] text-[#8D9399] border-dashed border border-[#E1E5EB]";
    }
    return blockStyle || "bg-[#EBF4FE] text-[#246FE5] border border-[#D2E2FB]";
  };

  const displayValue = isEmpty ? `--${unit || ''}` : value;
  const tooltipValue = isEmpty ? `-- (暂未获取到数据)` : value;

  return (
    <div
      className="absolute h-full top-0 z-10"
      style={{ left: `${left}%`, width: `${width}%` }}
    >
      <div
        className={`
          h-full flex items-center justify-center px-[1px] text-[12px] transition-all duration-200 rounded-[2px] cursor-pointer overflow-visible group
          ${getStyles()}
          ${isFirst ? '' : 'ml-[2px]'}
          ${isLast ? '' : 'mr-[2px]'}
          ${isHovered ? 'brightness-95 z-50' : ''}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="w-full text-center whitespace-nowrap overflow-visible relative z-20 flex justify-center items-center">
            <span className="relative">{displayValue}</span>
        </div>

        {/* Tooltip */}
        {isHovered && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#2E3742] text-white text-[12px] px-3 py-2 rounded shadow-lg z-[100] pointer-events-none min-w-max">
            <div className="font-normal opacity-80 mb-0.5 whitespace-nowrap">{start}-{end}</div>
            <div className="font-bold whitespace-normal max-w-[180px] leading-tight">{tooltipValue}</div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#2E3742]" />
          </div>
        )}
      </div>
    </div>
  );
};

const RegulationRow: React.FC<{
  label: string;
  category: string;
  setValues: any[];
  aiValues?: any[];
  showAI?: boolean;
  timelineStart: number;
  timelineEnd: number;
  unit?: string;
  subLabel?: string;
  theme?: { bg: string; border: string; blockStyle: string };
}> = ({ label, category, setValues, aiValues, showAI, timelineStart, timelineEnd, unit, subLabel, theme }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [layoutRows, setLayoutRows] = useState<any[][]>([]);

  // Helper to convert float hours (e.g. 9.5) to HH:mm string (e.g. "09:30")
  const floatToTime = (val: number) => {
    const h = Math.floor(val);
    const m = Math.round((val - h) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const parseTime = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h + m / 60;
  };

  // Flatten and Fill Gaps
  const processedValues = useMemo(() => {
    let raw: any[] = [];
    if (!setValues) {
       raw = [];
    } else if (Array.isArray(setValues[0]) && Array.isArray(setValues)) {
      raw = setValues.flat();
    } else {
      raw = [...(setValues as any[])];
    }

    // Sort by start time just in case
    raw.sort((a, b) => parseTime(a.start) - parseTime(b.start));

    const result = [];
    let currentTime = timelineStart;

    for (const block of raw) {
      const start = parseTime(block.start);
      const end = parseTime(block.end);

      // If there is a gap between current time and block start, fill it
      if (start > currentTime + 0.01) { // 0.01 tolerance
         result.push({
           start: floatToTime(currentTime),
           end: floatToTime(start),
           value: '--',
           isEmpty: true,
           type: 'set', // Default props for compatibility
           category: category
         });
      }

      result.push(block);
      currentTime = end;
    }

    // If there is remaining time until timelineEnd, fill it
    if (currentTime < timelineEnd - 0.01) {
       result.push({
         start: floatToTime(currentTime),
         end: floatToTime(timelineEnd),
         value: '--',
         isEmpty: true,
         type: 'set',
         category: category
       });
    }

    return result;
  }, [JSON.stringify(setValues), timelineStart, timelineEnd, category]);

    // Layout Calculation with Greedy Collision Detection
  useLayoutEffect(() => {
    if (!containerRef.current || processedValues.length === 0) {
      setLayoutRows([processedValues, []]);
      return;
    }

    const containerWidth = containerRef.current.clientWidth;
    const totalDuration = timelineEnd - timelineStart;
    const rows: any[][] = [];
    const rowFreeAt: number[] = [];

    processedValues.forEach((block) => {
        const start = parseTime(block.start);
        const end = parseTime(block.end);
        const duration = end - start;
        const blockStartPx = ((start - timelineStart) / totalDuration) * containerWidth;
        const blockWidthPx = (duration / totalDuration) * containerWidth;
        const blockEndPx = blockStartPx + blockWidthPx;

        const text = block.isEmpty ? '' : block.value;

        let textWidth = 0;
        if (!block.isEmpty) {
            // Re-tuned estimation
            for (let char of text) {
                textWidth += char.charCodeAt(0) > 255 ? 12 : 7.5;
            }
            textWidth += 4; // Tight padding
        } else {
            textWidth = 0;
        }

        // Calculate where the text physically sits (centered in block)
        const textStartPx = blockStartPx + (blockWidthPx / 2) - (textWidth / 2);
        const textEndPx = textStartPx + textWidth;

        const PADDING = 2;
        let chosenRow = -1;

        // Find the first available row that fits
        // Check if BOTH block boundary AND text would fit
        // rowFreeAt already includes the visual end position (with padding considered)
        for (let i = 0; i < rows.length; i++) {
            // Block boundary check: block must start after previous visual content ends
            const blockFits = blockStartPx >= rowFreeAt[i];
            // Text overlap check: text must start after previous visual content ends
            // Note: We check textStartPx vs rowFreeAt (without extra padding since rowFreeAt already has it)
            const textFits = textStartPx >= rowFreeAt[i];
            
            // Both conditions must be satisfied to place in this row
            if (blockFits && textFits) {
                chosenRow = i;
                break;
            }
        }

        // If no row available, create a new row
        if (chosenRow === -1) {
            chosenRow = rows.length;
            rows.push([]);
            rowFreeAt.push(0);
        }

        rows[chosenRow].push(block);

        // Update cursor - track the visual end position
        // Use max of: block end, text end + padding (to prevent text overlap)
        rowFreeAt[chosenRow] = Math.max(blockEndPx, textEndPx + PADDING, rowFreeAt[chosenRow]);
    });

    setLayoutRows(rows);
  }, [processedValues, timelineStart, timelineEnd]);

  // If no valid data (fallback logic mostly replaced by processedValues but kept for AI)
  const processValues = (vals: any[]) => {
    // ... logic for AI values which we didn't touch yet (user focused on SET values)
    if (!vals || vals.length === 0) return [];
    return vals;
  };

  // For AI values...
  const finalAiValues = aiValues ? processValues(aiValues) : [];

  const hasMultipleRows = layoutRows.length > 1;

  return (
    <div className="flex w-full gap-[4px]">
      {/* Left Label */}
      <div className={`w-[115px] shrink-0 flex flex-col items-center justify-center px-3 ${theme.bg} text-[#1B2129] text-[12px] font-bold border-l-[2px] ${theme.border} rounded-[2px]`}>
        <span className="w-full text-center line-clamp-2 overflow-hidden text-ellipsis" title={label}>
          {label}
        </span>
        {subLabel && <span className="text-[10px] font-normal mt-0.5 text-[#626C78]">{subLabel}</span>}
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col gap-[4px]">
        {/* Set Value Rows Container */}
        <div className="w-full flex gap-[4px] relative">
           {/* Label - Stretches if multi-row */}
           <div className={`w-[60px] shrink-0 flex items-center justify-center text-[12px] text-[#1B2129] font-bold ${theme.bg} rounded-[2px] self-stretch`}>
            设定值
           </div>

           {/* Track Container */}
           <div ref={containerRef} className="flex-1 flex flex-col gap-[4px]">
             {layoutRows.map((rowBlocks: any[], rowIndex: number) => (
               <div key={`row-${rowIndex}`} className="h-[32px] w-full relative bg-white/0">
                 {rowBlocks.map((block: any, idx: number) => (
                   <TimelineBlock
                     key={`r${rowIndex}-${block.start}-${block.end}-${idx}`}
                     {...block}
                     type="set"
                     category={category}
                     timelineStart={timelineStart}
                     timelineEnd={timelineEnd}
                     isFirst={rowIndex === 0 && idx === 0 && parseTime(block.start) === timelineStart}
                     isLast={false}
                     unit={unit}
                     blockStyle={theme.blockStyle}
                   />
                 ))}
               </div>
             ))}
           </div>
        </div>

        {/* AI Strategy Row */}
        {showAI && finalAiValues.length > 0 && (
          <div className="h-[32px] w-full flex gap-[4px]">
             {/* Label */}
             <div className="w-[60px] shrink-0 flex items-center justify-center text-[12px] text-[#8D9399] bg-[#F5F7FA] border border-[#E1E5EB] border-dashed rounded-[2px]">
               AI策略
             </div>
             {/* Track */}
             <div className="flex-1 relative bg-white/0">
                {finalAiValues.map((block: any, idx: number) => (
                  <TimelineBlock
                    key={`ai-${block.start}-${block.end}-${idx}`}
                    {...block}
                    type="ai"
                    category={category}
                    timelineStart={timelineStart}
                    timelineEnd={timelineEnd}
                    isFirst={idx === 0}
                    isLast={idx === finalAiValues.length - 1}
                    unit={unit}
                  />
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

const RegulationRecordSection: React.FC<{
  data: any,
  scheduleParams: any,
  timelineStart?: number,
  timelineEnd?: number,
  title?: string,
  hideAILinks?: boolean,
  pumpGroupLabel?: string,
  systemId?: string,
  reportDate?: string,
}> = ({ data, scheduleParams, timelineStart = 0, timelineEnd = 24, title = "调节记录", hideAILinks = false, pumpGroupLabel, systemId, reportDate }) => {
  const [showAI, setShowAI] = useState(false);
  const [showSchedulePopup, setShowSchedulePopup] = useState(false);
  const [showAIPopup, setShowAIPopup] = useState(false);
  const [showManualPopup, setShowManualPopup] = useState(false);


  // Helper to check if data exists for a category
  const hasAIData = data ? Object.values(data).some((cat: any) => cat?.ai && cat.ai.length > 0) : false;

  const themes = [
      { bg: "bg-[#E6F7F5]", border: "border-[#00B39F]", blockStyle: "bg-[#E6F7F5] text-[#00B39F] border border-[#C2F0EB]" },
      { bg: "bg-[#EBF4FE]", border: "border-[#246FE5]", blockStyle: "bg-[#EBF4FE] text-[#246FE5] border border-[#D2E2FB]" },
      { bg: "bg-[#FFF7E6]", border: "border-[#F59A23]", blockStyle: "bg-[#FFF7E6] text-[#F59A23] border border-[#FEEBCB]" },
      { bg: "bg-[#FCE6F8]", border: "border-[#D900B5]", blockStyle: "bg-[#FCE6F8] text-[#D900B5] border border-[#F9D0EE]" },
      { bg: "bg-[#F5E6FF]", border: "border-[#9E00E6]", blockStyle: "bg-[#F5E6FF] text-[#9E00E6] border border-[#EBCFF9]" },
  ];

  return (
    <div className="bg-white p-[16px] rounded-[4px] border border-[#E1E5EB] w-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h3 className="text-[16px] font-bold text-[#2E3742]">{title}</h3>
          <div className="flex items-center justify-center gap-[12px] text-[14px]">
            <span className="text-[#246FE5] cursor-pointer px-[8px] py-[5px] rounded-[4px] hover:bg-[rgba(196,201,207,0.30)] transition-colors" onClick={() => setShowSchedulePopup(true)}>查看时间表</span>
            {/* 暂时隐藏 查看AI策略 */}
            {false && !hideAILinks && <span className="text-[#246FE5] cursor-pointer px-[8px] py-[5px] rounded-[4px] hover:bg-[rgba(196,201,207,0.30)] transition-colors" onClick={() => setShowAIPopup(true)}>查看AI策略</span>}
            <span className="text-[#246FE5] cursor-pointer px-[8px] py-[5px] rounded-[4px] hover:bg-[rgba(196,201,207,0.30)] transition-colors" onClick={() => setShowManualPopup(true)}>查看人工干预记录</span>
          </div>
        </div>
        {/* 暂时隐藏 显示AI策略 */}
        { false && !hideAILinks && hasAIData && (
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowAI(!showAI)}>
            <div className={`w-4 h-4 rounded border flex items-center justify-center ${showAI ? 'bg-[#246FE5] border-[#246FE5]' : 'bg-white border-[#D1D5DB]'}`}>
              {showAI && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
            </div>
            <span className="text-[14px] text-[#2E3742] select-none">显示AI策略</span>
          </div>
        )}
      </div>
      
      {
        (isNil(data) || data?.length === 0) &&
              (<div className="text-[#86909C] text-[14px]">
                暂未获取到数据
              </div>)
      }
      {
        !isNil(data) && data?.length > 0 &&
          <div className="flex w-full mb-2 gap-[4px]">
             <div className="w-[100px] shrink-0 text-[12px] text-[#8D9399] px-3 flex items-center">调节参数名称</div>
             <div className="flex-1 flex gap-[4px]">
                 <div className="w-[60px] shrink-0"></div>
                 <div className="flex-1 relative h-[20px]">
                    <div className="absolute inset-0 text-[12px] text-[#8D9399]">
                        {Array.from({ length: timelineEnd - timelineStart + 1 }).map((_, i) => {
                          const isLast = i === (timelineEnd - timelineStart);
                          const isFirst = i === 0;
                          return (
                            <span key={i} className="" style={{
                                position: 'absolute',
                                left: `${(i / (timelineEnd - timelineStart)) * 100}%`,
                                transform: isLast ? 'translateX(-100%)' : (isFirst ? 'none' : 'translateX(-50%)')
                            }}>
                                {(timelineStart + i).toString().padStart(2, '0')}:00
                            </span>
                          );
                        })}
                    </div>
                 </div>
            </div>
          </div>
      }

      {
        !isNil(data) && data?.length > 0 &&
          <div className="space-y-3">
            {(data || []).map((item, idx) => item.data.set && (
                <RegulationRow
                  key={item.code}
                  label={item.name || '--'}
                  category={item.code}
                  setValues={item?.data?.set || []}
                  aiValues={item?.data?.ai || []}
                  showAI={showAI}
                  timelineStart={timelineStart}
                  timelineEnd={timelineEnd}
                  unit={item.unit}
                  theme={themes[idx % themes.length]}
                />
            ))}
          </div>
      }

      {showSchedulePopup && <SchedulePopup onClose={() => setShowSchedulePopup(false)} scheduleParams={scheduleParams} />}
      {showAIPopup && <AIStrategyPopup onClose={() => setShowAIPopup(false)} />}
      {showManualPopup && <ManualInterventionPopup onClose={() => setShowManualPopup(false)} objectId={scheduleParams?.objectId} reportDate={scheduleParams?.reportDate} />}
    </div>
  );
};

// --- Operation Charts Section ---

const COLORS = [
  '#246FE5', '#33D4D2', '#F59A23', '#8B5CF6', '#64748B', '#60A5FA', '#F472B6', '#A78BFA',
  '#FCD34D', '#10B981', '#EC4899', '#6366F1'
];

interface ChartDataPoint {
  time: string;
  [key: string]: string | number;
}

const ChartCard = ({
  title,
  unit,
  filterText,
  series,
  data,
  yDomain,
  yTickFormatter,
  chartType = "monotone",
  customTooltip,
  height = 200,
  reportDate,
}: {
  title: string,
  unit: string,
  filterText?: string,
  series: { key: string, name: string, spec?: string, hasRecord?: boolean }[],
  data: ChartDataPoint[],
  yDomain?: [number | 'auto', number | 'auto'],
  yTickFormatter?: (value: any) => string,
  chartType?: "monotone" | "stepAfter",
  customTooltip?: any,
  height?: number,
  reportDate?: string,
}) => {
  const [filterChecked, setFilterChecked] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hiddenKeys, setHiddenKeys] = useState<string[]>([]);

  const toggleSeries = (key: string) => {
    setHiddenKeys(prev =>
      prev.includes(key)
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
  };
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const [limit, setLimit] = useState(0);

  const visibleSeries = useMemo(() => {
    return filterChecked && filterText
      ? series.filter(s => s.hasRecord !== false)
      : series;
  }, [series, filterChecked, filterText]);

  useLayoutEffect(() => {
    const calculateVisibleItems = () => {
      if (!containerRef.current || !titleRef.current) return;
      const containerWidth = containerRef.current.clientWidth;
      const titleWidth = titleRef.current.offsetWidth;
      const GAP = 120;
      const availableWidth = containerWidth - titleWidth - GAP;
      const EXPAND_BTN_WIDTH = 40;
      let currentWidth = 0;
      let count = 0;

      const measureItem = (s: typeof series[0]) => {
         const text = s.name + (s.spec || "");
         let textWidth = 0;
         for (let char of text) textWidth += char.charCodeAt(0) > 255 ? 14 : 8.5;
         return 10 + 6 + textWidth + 16;
      };

      for (let i = 0; i < visibleSeries.length; i++) {
        const itemWidth = measureItem(visibleSeries[i]);
        if (currentWidth + itemWidth + EXPAND_BTN_WIDTH > availableWidth) break;
        currentWidth += itemWidth;
        count++;
      }

      let totalW = 0;
      for (let s of visibleSeries) totalW += measureItem(s);

      if (totalW <= availableWidth) setLimit(visibleSeries.length);
      else setLimit(count);
    };

    calculateVisibleItems();
    const observer = new ResizeObserver(calculateVisibleItems);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [visibleSeries]);

  const itemsToShow = isExpanded ? visibleSeries : visibleSeries.slice(0, limit);
  const showButton = visibleSeries.length > limit;

  const DefaultTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-[12px] rounded-[4px] border border-[#E1E5EB] shadow-[0px_3.664px_14.655px_0px_rgba(27,33,41,0.12),0px_0.611px_3.664px_0px_rgba(27,33,41,0.08)] z-50">
          <p className="text-[14px] font-bold text-[#2E3742] font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-normal mb-[8px]">
            {reportDate} {label}
          </p>
          <div className="flex flex-col gap-[8px]">
            {payload.map((p: any, idx: number) => {
               const val = p.value;
               let displayVal = val;
               if (yTickFormatter) {
                 displayVal = yTickFormatter(val);
               } else {
                 displayVal = `${val}${unit ?? ''}`;
               }

               return (
                <div key={p.name || idx} className="flex items-center gap-[4px]">
                  <div className="w-[12px] h-[3px] rounded-[0.5px] shrink-0" style={{ backgroundColor: p.color }} />
                  <span className="text-[#626C78] text-[14px] font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-normal">
                    {p.name}：
                  </span>
                  <span className="text-[#1B2129] text-[14px] font-bold font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-normal">
                    {displayVal}
                  </span>
                </div>
               );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  const ChartComponent = customTooltip ? customTooltip : DefaultTooltip;

  return (
    <div className="bg-white p-4 rounded-[4px] border border-[#E1E5EB] relative hover:z-10 transition-all">
      <div ref={containerRef} className="flex justify-between mb-4 gap-[120px]">
        <div ref={titleRef} className="flex items-center gap-2 shrink-0 h-[24px]">
          <h4 className="font-bold text-[#1B2129] text-[14px]">{title}({unit})</h4>
          {filterText && (
            <div
              className="flex items-center gap-1.5 cursor-pointer select-none ml-2 group"
              onClick={() => setFilterChecked(!filterChecked)}
            >
              <div className={`
                w-3.5 h-3.5 rounded-[2px] border flex items-center justify-center transition-colors
                ${filterChecked ? 'bg-[#246FE5] border-[#246FE5]' : 'bg-white border-[#D1D5DB] group-hover:border-[#246FE5]'}
              `}>
                {filterChecked && <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <span className="text-[14px] text-[#626C78]">{filterText}</span>
            </div>
          )}
        </div>
        <div className="flex flex-wrap justify-end gap-x-4 gap-y-2 flex-1 items-start content-start min-w-0">
          {itemsToShow.map((s, idx) => {
            const isHidden = hiddenKeys.includes(s.key);
            return (
              <div
                key={s.key}
                className={`flex items-center gap-1.5 whitespace-nowrap h-[24px] cursor-pointer transition-opacity ${isHidden ? 'opacity-40 grayscale' : ''}`}
                onClick={() => toggleSeries(s.key)}
              >
                <div className="w-2.5 h-[2px]" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="text-[#626C78] text-[14px] font-['Microsoft_YaHei_UI',sans-serif]">
                  <span className="text-[#1B2129]">{s.name}</span>
                  {s.spec && <span className="text-[#8D9399] ml-0.5">{s.spec}</span>}
                </span>
              </div>
            );
          })}
          {showButton && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[#246FE5] hover:text-[#1B4ACC] text-[14px] whitespace-nowrap h-[24px] flex items-center font-['Microsoft_YaHei_UI',sans-serif]"
            >
              {isExpanded ? '收起' : '展开'}
            </button>
          )}
        </div>
      </div>
      <div style={{ height }} className="w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100} debounce={200}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E6E7" />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#8D9399' }} axisLine={false} tickLine={false} />
            <YAxis domain={yDomain || ['auto', 'auto']} tick={{ fontSize: 10, fill: '#8D9399' }} axisLine={false} tickLine={false} tickFormatter={yTickFormatter} ticks={yTickFormatter ? [0, 1] : undefined} />
            <Tooltip content={<ChartComponent />} cursor={{ stroke: '#E1E5EB', strokeWidth: 1 }} />
            {visibleSeries.map((s, idx) => (
              <Line
                key={s.key}
                type={chartType === "step" ? "stepAfter" : "monotone"}
                dataKey={s.key}
                name={s.name}
                stroke={COLORS[idx % COLORS.length]}
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
                hide={hiddenKeys.includes(s.key)}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// --- Cooling Chart Section ---
const CoolingChartSection: React.FC<{ westPlant?: any, energyChart?: any[], weather?: any, reportDate?: string }> = ({ westPlant, energyChart, weather, reportDate }) => {
  const [energyViewMode, setEnergyViewMode] = useState<"chart" | "list">("chart");
  const [visibleSeries, setVisibleSeries] = useState({
    totalEnergy: true,
    predictedEnergy: true,
    outdoorTemp: true
  });

  const toggleSeries = (key: keyof typeof visibleSeries) => {
    setVisibleSeries(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const energyData = energyChart || [];

  const EnergyTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
     
      const getPayloadValue = (dataKey: string) => {
        if (dataKey === 'outdoorHumidity') {
          const item = payload?.find((p: any) => !isNil(p.payload?.[dataKey]));
          return item?.payload?.[dataKey] || '--';
        }
        return payload?.find((p: any) => p.dataKey === dataKey)?.value;
      }

      return (
        <div className="bg-white p-4 border border-[#E1E5EB] rounded-lg shadow-lg z-50">
          <p className="font-bold text-[#2E3742] mb-3">{reportDate ?? ''} {label}</p>
          <div className="space-y-2">
            {visibleSeries.totalEnergy && <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#2481F2] rounded-[2px]" />
              <span className="text-sm text-[#626C78]">总能耗：</span>
              <span className="text-sm font-bold text-[#1B2129]">{getPayloadValue('totalEnergy') ?? '--'}kWh</span>
            </div>}
            {visibleSeries.predictedEnergy && <div className="flex items-center gap-2 hidden">
              <div className="w-3 h-3 bg-[#33D4D2] rounded-[2px]" />
              <span className="text-sm text-[#626C78]">AI预测能耗：</span>
              <span className="text-sm font-bold text-[#1B2129]">{getPayloadValue('predictedEnergy') ?? '--'}kWh</span>
            </div>} 
            {visibleSeries.outdoorTemp && <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-[#2481F2]" />
              <span className="text-sm text-[#626C78]">室外平均温度：</span>
              <span className="text-sm font-bold text-[#1B2129]">{getPayloadValue('outdoorTemp') ?? '--'}℃</span>
            </div>}
            {(visibleSeries.totalEnergy || visibleSeries.outdoorTemp) && <div className="flex items-center gap-2">
              <div className="w-3 h-3">
                <svg width="" height="13" viewBox="0 0 11 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.25 1.64992L2.36265 4.53726C0.768005 6.13193 0.768005 8.71732 2.36265 10.312C3.95729 11.9066 6.54272 11.9066 8.13732 10.312C9.73198 8.71732 9.73198 6.13193 8.13732 4.53727L5.25 1.64992ZM5.25 0L8.96233 3.71231C11.0126 5.76256 11.0126 9.08669 8.96233 11.1369C6.91203 13.1872 3.58794 13.1872 1.53769 11.1369C-0.512563 9.08669 -0.512563 5.76256 1.53769 3.71231L5.25 0ZM2.33333 7.4246H8.16667C8.16667 9.03547 6.86082 10.3413 5.25 10.3413C3.63917 10.3413 2.33333 9.03547 2.33333 7.4246Z" fill="#626C78"/>
                </svg>
               </div>
              <span className="text-sm text-[#626C78]">室外平均湿度：</span>
              <span className="text-sm font-bold text-[#1B2129]">{getPayloadValue('outdoorHumidity') ?? '--'}%RH</span>
            </div>}
          </div>
        </div>
      );
    }
    return null;
  };

  const getTrentColor = (trend?: number|string) => {
    const trendStr = formatMul100To1Decimal(trend);
    if (trendStr === '--') {
      return '#626C78';
    }
    const trendNum = Number(trendStr);
    return trendNum > 0 ? '#F55047' : trendNum < 0 ? '#00B42A' : '#626C78';
  }

  const getTrentMsg = (trend?: number|string) => {
    const trendStr = formatMul100To1Decimal(trend);
    if (trendStr === '--') {
      return '--';
    }
    const trendNum = Number(trendStr);
    const absTrendNum = Math.abs(trendNum);
    return trendNum > 0 ? `增长${absTrendNum}%` : trendNum < 0 ? `下降${absTrendNum}%` : trendNum === 0 ? `与上周相似日持平` : '';
  }

  return (
    <div className="space-y-[12px]">
      <div className="bg-white p-[16px] rounded-[4px] border border-[#E1E5EB] w-full">
        {/* ... Energy Header & Chart (Keeping this for the first section) ... */}
        <div className="mb-[12px] space-y-[4px]">
          <div className="text-[14px] text-[#1B2129] leading-[22px] font-['Microsoft_YaHei_UI',sans-serif] flex items-center flex-wrap">
            <span className="text-[#626C78]">报告日（{reportDate ? dayjs(reportDate).format('MM.DD') : "--"}）系统运行总能耗：</span>
            <MTipsTooltip
              text={`${westPlant?.consumption ?? "--"}kWh`}
              wrapperClassName="min-w-0 max-w-[200px] inline-flex align-bottom"
              className="font-bold text-[#1B2129]"
            />
            <span className="text-[#626C78]">，能耗环比</span>
            <span className={`font-bold ml-1 text-[${getTrentColor(westPlant?.trend)}]`}>
               {getTrentMsg(westPlant?.trend)}
            </span>
          </div>
          <p className="text-[14px] text-[#626C78] leading-[22px] font-['Microsoft_YaHei_UI',sans-serif]">
            报告日全天，室外温度区间 <span className="text-[#1B2129] font-bold">{formatTo1Decimal(weather?.minTemperature)}℃~{formatTo1Decimal(weather?.maxTemperature)}℃</span>，
            平均温度为 <span className="text-[#1B2129] font-bold">{formatTo1Decimal(weather?.avgTemperature)}℃</span>。
            室外湿度区间 <span className="text-[#1B2129] font-bold">{formatTo1Decimal(weather?.minHumidity)}%RH~{formatTo1Decimal(weather?.maxHumidity)}%RH</span>，
            平均湿度为 <span className="text-[#1B2129] font-bold">{formatTo1Decimal(weather?.avgHumidity)}%RH</span>
          </p>
        </div>

        <div className="flex justify-between items-center mb-[12px]">
          <div className="flex items-center">
            <span className="text-[14px] text-[#626C78] font-normal font-['Microsoft_YaHei_UI',sans-serif]">每小时用能情况</span>
            <ToggleSwitch value={energyViewMode} onChange={setEnergyViewMode} />
          </div>

          {energyViewMode === "chart" && (
            <div className="flex items-center gap-4 text-xs select-none">
              <div
                className={`flex items-center gap-1.5 cursor-pointer transition-opacity ${visibleSeries.totalEnergy ? 'opacity-100' : 'opacity-40'}`}
                onClick={() => toggleSeries('totalEnergy')}
              >
                <div className="w-3.5 h-3.5 bg-[#2481F2] rounded-[2px]" />总能耗
              </div>
              <div
                className={`flex items-center gap-1.5 cursor-pointer transition-opacity ${visibleSeries.predictedEnergy ? 'opacity-100' : 'opacity-40'} hidden`}
                onClick={() => toggleSeries('predictedEnergy')}
              >
                <div className="w-3.5 h-3.5 bg-[#33D4D2] rounded-[2px]" />AI预测能耗
              </div>
              <div
                className={`flex items-center gap-1.5 cursor-pointer transition-opacity ${visibleSeries.outdoorTemp ? 'opacity-100' : 'opacity-40'}`}
                onClick={() => toggleSeries('outdoorTemp')}
              >
                <div className="w-3.5 h-[3px] bg-[#2481F2]" />室外平均温度
              </div>
            </div>
          )}
        </div>

        {energyViewMode === "chart" ? (
          <>
            <div className="flex justify-between text-[12px] text-[#626C78] mb-1 px-1">
               <span>kWh</span>
               <span>℃</span>
             </div>
            <div className="h-[250px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100} debounce={200}>
                <ComposedChart data={energyData} margin={{ left: 0, right: 0, bottom: 0, top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E6E7" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#8D9399', fontSize: 12 }} padding={{ left: 0, right: 0 }} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#646C73', fontSize: 12 }} tickFormatter={(value) => value >= 1000 ? `${value/1000}k` : value} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#646C73', fontSize: 12 }} />
                  <Tooltip content={<EnergyTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                  <Bar yAxisId="left" dataKey="totalEnergy" fill="#2481F2" barSize={8} radius={[2, 2, 0, 0]} name="总能耗" hide={!visibleSeries.totalEnergy} />
                  <Bar yAxisId="left" dataKey="predictedEnergy" fill="#33D4D2" barSize={8} radius={[2, 2, 0, 0]} name="AI预测能耗" hide={true} />
                  <Line yAxisId="right" type="linear" dataKey="outdoorTemp" stroke="#2481F2" strokeWidth={1.5} dot={false} name="室外平均温度" hide={!visibleSeries.outdoorTemp} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <div className="w-full overflow-x-auto rounded-[4px] border border-[#E1E5EB]">
            <table className="report-table w-full table-fixed">
              <thead>
                <tr className="h-[38px] bg-[#EBF4FE]">
                  {/* <th className="w-1/4 !py-[10px] !pl-[16px] !pr-[12px] font-['Microsoft_YaHei_UI',sans-serif] font-normal text-[12px] text-[#626C78] border-b border-[#E1E5EB] border-r truncate">时间</th>
                  <th className="w-1/4 !py-[10px] !pl-[16px] !pr-[12px] font-['Microsoft_YaHei_UI',sans-serif] font-normal text-[12px] text-[#626C78] border-b border-[#E1E5EB] border-r truncate">总能耗</th>
                  <th className="w-1/4 !py-[10px] !pl-[16px] !pr-[12px] font-['Microsoft_YaHei_UI',sans-serif] font-normal text-[12px] text-[#626C78] border-b border-[#E1E5EB] border-r truncate">AI预测能耗</th>
                  <th className="w-1/4 !py-[10px] !pl-[16px] !pr-[12px] font-['Microsoft_YaHei_UI',sans-serif] font-normal text-[12px] text-[#626C78] border-b border-[#E1E5EB] truncate">室外温度</th> */}
                  <th className="w-1/3 !py-[10px] !pl-[16px] !pr-[12px] font-['Microsoft_YaHei_UI',sans-serif] font-normal text-[12px] text-[#626C78] border-b border-[#E1E5EB] border-r truncate">时间</th>
                  <th className="w-1/3 !py-[10px] !pl-[16px] !pr-[12px] font-['Microsoft_YaHei_UI',sans-serif] font-normal text-[12px] text-[#626C78] border-b border-[#E1E5EB] border-r truncate">总能耗</th>
                  <th className="w-1/3 !py-[10px] !pl-[16px] !pr-[12px] font-['Microsoft_YaHei_UI',sans-serif] font-normal text-[12px] text-[#626C78] border-b border-[#E1E5EB] border-r truncate hidden">AI预测能耗</th>
                  <th className="w-1/3 !py-[10px] !pl-[16px] !pr-[12px] font-['Microsoft_YaHei_UI',sans-serif] font-normal text-[12px] text-[#626C78] border-b border-[#E1E5EB] border-r truncate">室外平均温度</th>
                  <th className="w-1/3 !py-[10px] !pl-[16px] !pr-[12px] font-['Microsoft_YaHei_UI',sans-serif] font-normal text-[12px] text-[#626C78] border-b border-[#E1E5EB] truncate">室外平均湿度</th>
                  
                </tr>
              </thead>
              <tbody>
                {energyData.map((row: any, idx: number) => (
                  <tr key={row.time} className="h-[36px] bg-white hover:bg-transparent">
                    <td className="!py-[13px] !pl-[16px] !pr-[12px] font-['Microsoft_YaHei_UI',sans-serif] text-[14px] text-[#1B2129] border-b border-[#E1E5EB] border-r">
                      <MTipsTooltip>{`${row.time}-${String(Number(row.time.split(':')[0]) + 1).padStart(2, '0')}:00`}</MTipsTooltip>
                    </td>
                    <td className="!py-[13px] !pl-[16px] !pr-[12px] font-['Microsoft_YaHei_UI',sans-serif] text-[14px] text-[#1B2129] border-b border-[#E1E5EB] border-r">
                      <MTipsTooltip>{`${row.totalEnergy ?? '--'}kWh`}</MTipsTooltip>
                    </td>
                    <td className="!py-[13px] !pl-[16px] !pr-[12px] font-['Microsoft_YaHei_UI',sans-serif] text-[14px] text-[#1B2129] border-b border-[#E1E5EB] border-r hidden">
                      <MTipsTooltip>{`${row.predictedEnergy ?? '--'}kWh`}</MTipsTooltip>
                    </td>
                    <td className="!py-[13px] !pl-[16px] !pr-[12px] font-['Microsoft_YaHei_UI',sans-serif] text-[14px] text-[#1B2129] border-b border-[#E1E5EB] border-r">
                      <MTipsTooltip>{`${row.outdoorTemp ?? '--'}℃`}</MTipsTooltip>
                    </td>
                    <td className="!py-[13px] !pl-[16px] !pr-[12px] font-['Microsoft_YaHei_UI',sans-serif] text-[14px] text-[#1B2129] border-b border-[#E1E5EB]">
                      <MTipsTooltip>{`${row.outdoorHumidity ?? '--'}%RH`}</MTipsTooltip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// --- OperationChartsSection (Needed for Cold Station) ---
const OperationChartsSection: React.FC<{ chartData?: any[]; reportDate?: string }> = ({ chartData, reportDate }) => {
  const data = chartData || [];

  // 供回水温差 / 供回水压差 / 最不利末端压差 显示与否要根据调节记录中的数据判断
  const isChartCardVisible = (infoCode: string) => {
    const adjustmentValue = data.adjustmentValue ?? [];
    return adjustmentValue.includes(`${infoCode}Set`);
  };

  return (
    <div className="space-y-3">
       <ChartCard title="冷机负载率" unit="%" filterText="仅看有开启记录的冷机" data={data?.iplr?.chartData || []}
         series={data?.iplr?.series || []} reportDate={reportDate}
       />
       <ChartCard title="冷机出水温度" unit="℃" data={data?.mainSupplyTemp?.chartData || []} series={[{ key: 'tempOut', name: '冷机出水温度' }]} reportDate={reportDate} />
       {isChartCardVisible(data?.tempDiff?.infoCode) && <ChartCard title="供回水温差" unit="℃" data={data?.tempDiff?.chartData || []} series={[{ key: 'tempDiff', name: '供回水温差' }]} reportDate={reportDate} />}
       {isChartCardVisible(data?.pressDiff?.infoCode) && <ChartCard title="供回水压差" unit="kPa" data={data?.pressDiff?.chartData || []} series={[{ key: 'pressDiff', name: '供回水压差' }]} reportDate={reportDate} />}
       {isChartCardVisible(data?.worstPressDiff?.infoCode) && <ChartCard title="最不利末端压差" unit="kPa" data={data?.worstPressDiff?.chartData || []} series={[{ key: 'worstPressDiff', name: '最不利末端压差' }]} reportDate={reportDate} />}
       <ChartCard title="冷冻水泵运行频率" unit="Hz" filterText="仅看有开启记录的水泵" data={data?.workFreq?.chartData || []}
         series={data?.workFreq?.series || []} reportDate={reportDate}
       />
    </div>
  );
};

// Unified Banner Component
const SectionBanner: React.FC<{ title: string }> = ({ title }) => (
  <div className="relative rounded-[4px] shrink-0 w-full overflow-hidden">
    <ImageWithFallback
      src={imgBg}
      className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
      alt="banner background"
    />
    <div className="relative flex flex-col items-start px-[12px] py-[8px] w-full">
      <p className="font-bold leading-[22px] text-[#2e3742] text-[16px]">
        {title}
      </p>
    </div>
  </div>
);

const ExceptionLogs: React.FC<{ logs: any[], emptyMessage?: string }> = ({ logs, emptyMessage }) => (
  <div className="bg-white rounded-[4px] border border-[#E1E5EB] p-[16px] flex flex-col gap-[12px]">
    <div className="flex items-center justify-between relative shrink-0 w-full">
      <p className="font-bold leading-[24px] text-[#2e3742] text-[16px]">
        设备异常记录
      </p>
    </div>
    {logs && logs.length > 0 ? (
      <div className="flex flex-col items-start relative shrink-0 w-full">
        {logs.map((log: any, i: number) => (
          <div key={`${log.time}-${log.device}-${i}`} className="w-full">
            <div className="flex gap-[12px] items-center relative shrink-0 w-full">
              <p className="leading-[normal] text-[#626c78] text-[14px] w-[62px] whitespace-pre-wrap tabular-nums">
                {log.time}
              </p>
              <div className="flex h-[17px] items-center relative shrink-0">
                <div className="bg-[#a6aaac] rounded-full shrink-0 size-[10px]" />
              </div>
              <p className="leading-[normal] text-[#626c78] text-[14px] whitespace-normal break-words flex-1">
                <span className="font-bold text-[#1B2129]">{log.device}</span>
                <span> {log.action}</span>
              </p>
            </div>
            {i < logs.length - 1 && (
              <div className="h-[21px] relative shrink-0 w-full">
                <div className="flex flex-row items-center h-full">
                  <div className="flex items-center px-[79px] py-0 relative h-full">
                      <div className="h-[30px] relative shrink-0 w-0">
                        <div className="absolute inset-[0_-0.5px]">
                          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 30">
                            <path d="M0.5 0V30" stroke="#8B949E" strokeDasharray="3 3" />
                          </svg>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    ) : (
      <p className="text-[#626c78] text-[14px]">
        {emptyMessage || "暂无设备异常"}
      </p>
    )}
  </div>
);

export const ColdStationSection: React.FC<CoolingSystemSectionProps> = ({ data }) => {
  const exceptionLogs = data?.exceptionLogs || [];
  const coolingSystem = data?.coolingSystem;

  const scheduleParams = { objectId: data?.system?.id, consoleTypes: ["COOL_SUPPLY", "COOL_INPUT"], reportDate : data?.reportDate};
  return (
      <div className="space-y-[12px]">
        <SectionBanner title={data?.westPlant?.plantName || "--"} />
        <CoolingChartSection westPlant={data?.westPlant} energyChart={coolingSystem?.energyChart} weather={data?.weather || {}} reportDate={data?.reportDate} />
        <EfficiencySection data={data?.efficiencyConfigs || []} efficiencyDate={data?.efficiencyDate || []} />
        <RegulationRecordSection data={coolingSystem?.mainRegulation || {}} scheduleParams={scheduleParams} />
        <OperationChartsSection chartData={coolingSystem?.operationChart} reportDate={data?.reportDate} />
        <ExceptionLogs logs={exceptionLogs} emptyMessage={data?.exceptionLogsEmptyMessage} />
      </div>
  );
};
