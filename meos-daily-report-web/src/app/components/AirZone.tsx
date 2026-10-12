import React, { useState, useMemo, useRef, useLayoutEffect } from "react";
import dayjs from "dayjs";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import imgBg from "@/assets/ed07366a06320f72100f9b26c58eca5ec52423c3.png";
import {   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import { useScheduleInfoCodeDefine } from "@/app/hooks/useScheduleInfoCodeDefine";
import { SchedulePopup } from "@/app/components/SchedulePopup";
import { AIStrategyPopup } from "@/app/components/AIStrategyPopup";
import { ManualInterventionPopup } from "@/app/components/ManualInterventionPopup";
// --- Regulation Record Section Components ---

interface TimelineBlockProps {
  start: string; // HH:mm
  end: string;   // HH:mm
  value: string;
  type: 'set' | 'ai';
  category: 'switch' | 'count' | 'tempOut' | 'tempDiff' | 'pressDiff' | 'default';
  timelineStart: number; // e.g., 8
  timelineEnd: number;   // e.g., 22
  isFirst?: boolean;
  isLast?: boolean;
  isEmpty?: boolean;
  unit?: string;
}

const parseTimeToFloat = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h + m / 60;
};

const floatToTime = (hours: number) => {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

const formatTimestampToTime = (timestamp: string) => {
  if (!timestamp) return "00:00";
  if (typeof timestamp === "string" && /^\d{2}:\d{2}$/.test(timestamp)) return timestamp;
  const parsed = dayjs(timestamp);
  if (parsed.isValid()) return parsed.format("HH:mm");
  if (typeof timestamp === "string" && timestamp.length >= 16) return timestamp.slice(11, 16);
  return "00:00";
};

const getSequenceTimestamp = (item: any) => {
  return item?.timestamp || item?.dataTime || item?.dateTime || item?.datetime || item?.time || item?.date || "";
};

const buildEnumMap = (dataSources?: { code?: string | number; aliasName?: string; name?: string }[], infoDefines?: Record<string, string>) => {
  
  const defines = infoDefines?.dataSource || dataSources;
  if (!Array.isArray(defines)) return {};
  return defines.reduce<Record<string, string>>((acc, item) => {
    const code = item?.code;
    if (code !== undefined && code !== null) {
      acc[String(code)] = item?.aliasName || item?.name || String(code);
    }
    return acc;
  }, {});
};

const resolveDisplayValue = (rawValue: any, enumMap: Record<string, string>, unit?: string, hasDefineModel?: boolean) => {
  const valueKey = rawValue === undefined || rawValue === null ? "" : String(rawValue);
  if (!enumMap || Object.keys(enumMap).length === 0) {
    if (hasDefineModel && unit && valueKey && !Number.isNaN(Number(valueKey)) && !valueKey.includes(unit)) {
      return `${valueKey}${unit}`;
    }
    return valueKey || "--";
  }
  const mapped = enumMap[valueKey];
  if (mapped) return mapped;
  if (unit && valueKey && !Number.isNaN(Number(valueKey)) && !valueKey.includes(unit)) {
    return `${valueKey}${unit}`;
  }
  return valueKey || "--";
};

const buildTimelineBlocks = (
  sequences: { value?: string | number; timestamp: string; iotValue?: string | number; val?: string | number; dataValue?: string | number }[] | undefined,
  timelineStart: number,
  timelineEnd: number,
  enumMap: Record<string, string>,
  unit?: string,
  hasDefineModel?: boolean,
  codeDefines?: Record<string, string>
) => {
  // if (!Array.isArray(sequences) || sequences.length === 0) return [];
  const hasNumericValue =true
  //  sequences.some((item) => {
  //   const rawValue = item?.value ?? item?.iotValue ?? item?.val ?? item?.dataValue;
  //   if (rawValue === undefined || rawValue === null || rawValue === "") return false;
  //   return !Number.isNaN(Number(rawValue));
  // });
  const normalizedSequences = hasNumericValue
    ? (() => {
        const timeToValue = sequences.reduce<Record<string, any>>((acc, item) => {
          const time = formatTimestampToTime(getSequenceTimestamp(item));
          const rawValue = item?.value ?? item?.iotValue ?? item?.val ?? item?.dataValue;
          if (time) acc[time] = rawValue;
          return acc;
        }, {});
        return Array.from({ length: 288 }, (_, index) => {
          const minutes = index * 5;
          const h = Math.floor(minutes / 60);
          const m = minutes % 60;
          const time = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
          return { timestamp: time, value: timeToValue[time] };
        });
      })()
    : sequences;
   
  const points = normalizedSequences
    .map((item) => {
      const time = formatTimestampToTime(getSequenceTimestamp(item));
      const rawValue = item?.value ?? item?.iotValue ?? item?.val ?? item?.dataValue;
      return {
        time,
        timeFloat: parseTimeToFloat(time),
        value: resolveDisplayValue(rawValue, enumMap, unit, hasDefineModel),
      };
    })
    .filter((item) => !Number.isNaN(item.timeFloat))
    .sort((a, b) => a.timeFloat - b.timeFloat);

  if (points.length === 0) return [];

  const startFloat = timelineStart;
  const endFloat = timelineEnd;
  const result: { start: string; end: string; value: string }[] = [];

  let firstIndex = points.findIndex((point) => point.timeFloat >= startFloat);
  if (firstIndex === -1) firstIndex = points.length;

  const priorPoint = firstIndex > 0 ? points[firstIndex - 1] : null;
  if (priorPoint) {
    const nextTime = firstIndex < points.length ? Math.min(points[firstIndex].timeFloat, endFloat) : endFloat;
    if (startFloat < nextTime) {
      result.push({
        start: floatToTime(startFloat),
        end: floatToTime(nextTime),
        value: priorPoint.value,
      });
    }
  }

  for (let i = firstIndex; i < points.length; i += 1) {
    const current = points[i];
    if (current.timeFloat >= endFloat) break;
    const next = points[i + 1];
    const endTime = next ? Math.min(next.timeFloat, endFloat) : endFloat;
    const startTime = Math.max(current.timeFloat, startFloat);
    if (startTime < endTime) {
      const nextBlock = {
        start: floatToTime(startTime),
        end: floatToTime(endTime),
        value: current.value,
      };
      const lastBlock = result[result.length - 1];
      if (lastBlock && lastBlock.value === nextBlock.value && lastBlock.end === nextBlock.start) {
        lastBlock.end = nextBlock.end;
      } else {
        result.push(nextBlock);
      }
    }
  }

  return result;
};

const inferCategory = (name?: string): TimelineBlockProps["category"] => {
  if (!name) return "default";
  if (name.includes("开关")) return "switch";
  if (name.includes("台数")) return "count";
  if (name.includes("温差")) return "tempDiff";
  if (name.includes("温度")) return "tempOut";
  if (name.includes("压差")) return "pressDiff";
  return "default";
};

const TimelineBlock: React.FC<TimelineBlockProps> = ({ 
  start, end, value, type, category, timelineStart, timelineEnd, isFirst, isLast, isEmpty, unit 
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
    switch (category) {
      case 'switch': return "bg-[#E6F7F5] text-[#00B39F] border border-[#C2F0EB]";
      case 'count': return "bg-[#EBF4FE] text-[#246FE5] border border-[#D2E2FB]";
      case 'tempOut': return "bg-[#FFF7E6] text-[#F59A23] border border-[#FEEBCB]";
      case 'tempDiff': return "bg-[#FCE6F8] text-[#D900B5] border border-[#F9D0EE]";
      case 'pressDiff': return "bg-[#F5E6FF] text-[#9E00E6] border border-[#EBCFF9]";
      default: return "bg-[#EBF4FE] text-[#246FE5] border border-[#D2E2FB]";
    }
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
            <div className="font-bold whitespace-normal max-w-[180px] leading-tight">{tooltipValue === '--' ?'--(暂未获取到数据)':tooltipValue}</div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#2E3742]" />
          </div>
        )}
      </div>
    </div>
  );
};

const RegulationRow: React.FC<{ 
  label: string; 
  category: TimelineBlockProps['category']; 
  setValues: Omit<TimelineBlockProps, 'category' | 'type' | 'timelineStart' | 'timelineEnd'>[] | Omit<TimelineBlockProps, 'category' | 'type' | 'timelineStart' | 'timelineEnd'>[][];
  aiValues?: Omit<TimelineBlockProps, 'category' | 'type' | 'timelineStart' | 'timelineEnd'>[];
  showAI?: boolean;
  timelineStart: number;
  timelineEnd: number;
  unit?: string;
  subLabel?: string; 
}> = ({ label, category, setValues, aiValues, showAI, timelineStart, timelineEnd, unit, subLabel }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [layoutRows, setLayoutRows] = useState<any[][]>([[]]);
  
  const getTheme = () => {
    switch (category) {
      case 'switch': return { bg: "bg-[#E6F7F5]", border: "border-[#00B39F]" };
      case 'count': return { bg: "bg-[#EBF4FE]", border: "border-[#246FE5]" };
      case 'tempOut': return { bg: "bg-[#FFF7E6]", border: "border-[#F59A23]" };
      case 'tempDiff': return { bg: "bg-[#FCE6F8]", border: "border-[#D900B5]" };
      case 'pressDiff': return { bg: "bg-[#F5E6FF]", border: "border-[#9E00E6]" };
      default: return { bg: "bg-gray-100", border: "border-gray-400" };
    }
  };

  const theme = getTheme();
  
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
    if (!setValues || setValues.length === 0) {
       return [];
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
      setLayoutRows([processedValues]);
      return;
    }

    const containerWidth = containerRef.current.clientWidth;
    const totalDuration = timelineEnd - timelineStart;
    const rows: any[][] = [];
    
    // Track where the "content" (text or block) ends on each row in PIXELS
    let rowFreeAt: number[] = [];

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
        
        // Calculate where the text physically sits
        const textStartPx = blockStartPx + (blockWidthPx / 2) - (textWidth / 2);
        const textEndPx = textStartPx + textWidth;
        
        // Rule: Narrow check (Strict)
        // If the physical block is smaller than text, user explicitly requests it to "sink" (Prefer Row 1).
        // const isNarrow = blockWidthPx < textWidth;

        let chosenRow = -1;
        const PADDING = 2;
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
             {layoutRows.map((row: any[], rowIndex: number) => (
               <div key={`r${rowIndex}`} className="h-[32px] w-full relative bg-white/0">
                 {row.map((block: any, idx: number) => (
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
  scheduleParams?: any,
  manualInterventionParams?: any,
  title?: string,
  hideAILinks?: boolean,
  pumpGroupLabel?: string,
  codeDefines?: Record<string, any>,
}> = ({ data, scheduleParams, manualInterventionParams, title = "调节记录", hideAILinks = false, pumpGroupLabel, codeDefines }) => {
  const [showAI, setShowAI] = useState(false);
  const [showSchedulePopup, setShowSchedulePopup] = useState(false);
  const [showAIPopup, setShowAIPopup] = useState(false);
  const [showManualPopup, setShowManualPopup] = useState(false);

  const mainRecord = data?.infoCode ? data : null;
  const records = Array.isArray(data) ? data : mainRecord ? [mainRecord] : [];

  
  const pumpGroups = Array.isArray(data?.adjustmentRecordsPumps) ? data.adjustmentRecordsPumps : [];
  const hasItemData = data.infoCode || pumpGroups.length>0;
  const pumpFieldRecords = pumpGroups.flatMap((group: any) => Array.isArray(group?.iotFieldRecords) ? group.iotFieldRecords : []);
  const hasAIData = [mainRecord, ...pumpFieldRecords].some((record: any) => Array.isArray(record?.ai) && record.ai.length > 0);
  const effectiveTimelineStart = 0;
  const effectiveTimelineEnd = 24;

  return (
    <div className="bg-white p-[16px] rounded-[4px] border border-[#E1E5EB] w-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h3 className="text-[16px] font-bold text-[#2E3742]">{title}</h3>
          <div className="flex items-center justify-center gap-[12px] text-[14px]">
            <span className="text-[#246FE5] cursor-pointer px-[8px] py-[5px] rounded-[4px] hover:bg-[rgba(196,201,207,0.30)] transition-colors" onClick={() => setShowSchedulePopup(true)}>查看时间表</span>
            {/* {!hideAILinks && <span className="text-[#246FE5] cursor-pointer px-[8px] py-[5px] rounded-[4px] hover:bg-[rgba(196,201,207,0.30)] transition-colors" onClick={() => setShowAIPopup(true)}>查看AI策略</span>} */}
            <span className="text-[#246FE5] cursor-pointer px-[8px] py-[5px] rounded-[4px] hover:bg-[rgba(196,201,207,0.30)] transition-colors" onClick={() => setShowManualPopup(true)}>查看人工干预记录</span>
          </div>
        </div>
        {!hideAILinks && hasAIData && (
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowAI(!showAI)}>
            <div className={`w-4 h-4 rounded border flex items-center justify-center ${showAI ? 'bg-[#246FE5] border-[#246FE5]' : 'bg-white border-[#D1D5DB]'}`}>
              {showAI && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
            </div>
            <span className="text-[14px] text-[#2E3742] select-none">显示AI策略</span>
          </div>
        )}
      </div>
      {!hasItemData && (<div className="text-[#86909C] text-[14px]">
        暂未获取到数据
      </div>)}
      {hasItemData && (<div className="flex w-full mb-2 gap-[4px]">
         <div className="w-[100px] shrink-0 text-[12px] text-[#8D9399] px-3 flex items-center">调节参数名称</div>
         <div className="flex-1 flex gap-[4px]">
             <div className="w-[60px] shrink-0"></div>
             <div className="flex-1 h-[20px]">
                <div
                  className="grid h-full text-[12px] text-[#8D9399]"
                  style={{
                    gridTemplateColumns: `repeat(${effectiveTimelineEnd - effectiveTimelineStart + 1}, minmax(0, 1fr))`,
                    letterSpacing: "-0.4px",
                    whiteSpace: "nowrap"
                  }}
                >
                    {Array.from({ length: effectiveTimelineEnd - effectiveTimelineStart + 1 }).map((_, i) => {
                      return (
                        <span key={i} className="text-center">
                            {(effectiveTimelineStart + i).toString().padStart(2, '0')}:00
                        </span>
                      );
                    })}
                </div>
             </div>
         </div>
      </div>)}

      
      {hasItemData && (<div className="space-y-3">
        {records.map((record: any, index: number) => {
          const enumMap = buildEnumMap(record?.infoCodeDefineModel?.dataSources, codeDefines[record?.infoCodeDefineModel?.infoCode || record?.infoCodeDefineModel?.code]);
          const setValues = buildTimelineBlocks(
            record?.iotValueSequences??[],
            effectiveTimelineStart,
            effectiveTimelineEnd,
            enumMap,
            record?.infoCodeDefineModel?.unit,
            Boolean(record?.infoCodeDefineModel)
          )||[];
          return (
            <div key={`${record?.infoCode || record?.infoName || "record"}-${index}`}>
              <RegulationRow
                label={record?.infoName || "调节参数"}
                category={inferCategory(record?.infoName)}
                setValues={setValues}
                aiValues={record?.ai}
                showAI={showAI}
                timelineStart={effectiveTimelineStart}
                timelineEnd={effectiveTimelineEnd}
                unit={record?.infoCodeDefineModel?.unit}
              />
            </div>
          );
        })}
        {pumpGroups.map((group: any, groupIndex: number) => (
          <div key={group?.pumpId || group?.pumpName || `pump-${groupIndex}`} className="space-y-3">
            {pumpGroups.length>1&& <div className="flex w-full mt-2 mb-2">
              <div className="w-[100px] text-[12px] text-[#626C78] font-normal ">
                {group?.pumpName || '--'}
              </div>
            </div>}
            {(group?.iotFieldRecords || []).map((field: any, fieldIndex: number) => {
              const enumMap = buildEnumMap(field?.infoCodeDefineModel?.dataSources, codeDefines[field?.infoCodeDefineModel?.infoCode || field?.infoCodeDefineModel?.code]);
              const setValues = buildTimelineBlocks(
                field?.iotValueSequences??[],
                effectiveTimelineStart,
                effectiveTimelineEnd,
                enumMap,
                field?.infoCodeDefineModel?.unit,
                Boolean(field?.infoCodeDefineModel)
              );
              return (
                <div key={`${field?.infoCode || field?.infoName || "field"}-${fieldIndex}`}>
                  <RegulationRow
                    label={field?.infoName || "调节参数"}
                    category={inferCategory(field?.infoName)}
                    setValues={setValues}
                    aiValues={field?.ai}
                    showAI={showAI}
                    timelineStart={effectiveTimelineStart}
                    timelineEnd={effectiveTimelineEnd}
                    unit={field?.infoCodeDefineModel?.unit}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>)}
      {showSchedulePopup && <SchedulePopup onClose={() => setShowSchedulePopup(false)} scheduleParams={scheduleParams} />}
      {/* {showAIPopup && <AIStrategyPopup onClose={() => setShowAIPopup(false)} />} */}
      {showManualPopup && <ManualInterventionPopup onClose={() => setShowManualPopup(false)} objectId={manualInterventionParams?.systemId} objectIds={manualInterventionParams?.objectIds} reportDate={manualInterventionParams?.reportDate} />}
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

const buildActualRunChart = (actualRun?: any[], codeDefines?: Record<string, any>): {
  title: string;
  objIds: string[];
  infoCode?: string;
  unit: string;
  series: { key: string; name: string; spec?: string; hasRecord?: boolean }[];
  data: ChartDataPoint[];
  yTickFormatter?: (val: any) => string;
  yTicks?: number[];
  chartType: "monotone" | "stepAfter";
} | null => {
  if (!Array.isArray(actualRun) || actualRun.length === 0) return null;
  const grouped = actualRun.reduce<Record<string, any[]>>((acc, item) => {
    const key = item?.infoCode || item?.infoName || "default";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
  const groupKey = Object.keys(grouped)[0];
  const group = grouped[groupKey] || [];
  if (group.length === 0) return null;
  const infoName = group[0]?.infoName || "关闭状态";
  const infoCode = group[0]?.infoCode;
  const unit = group[0]?.infoCodeDefineModel?.unit || "";
  const infoCodeDefineModel =  group[0]?.infoCodeDefineModel;
  const enumMap = buildEnumMap(infoCodeDefineModel?.dataSources, codeDefines[infoCodeDefineModel?.infoCode || infoCodeDefineModel?.code]);
  
  // Collect all unique values for Ordinal Scale mapping
  const allValuesSet = new Set<number>();
  if (Object.keys(enumMap).length > 0) {
    Object.keys(enumMap).forEach(k => allValuesSet.add(Number(k)));
  }

  const timeSet = new Set<string>();

  const objIdSet = new Set<string>();
  const deviceSeries = group.map((item, index) => {
    const key = item?.objId ? `obj_${item.objId}` : `device_${index}`;
    const name = item?.objName || '--';
    const spec = item?.ratedFlow && item?.ratedFlowUnit ? `(${item.ratedFlow}${item.ratedFlowUnit})` : undefined;
    const sequences = Array.isArray(item?.iotValueSequences) ? item.iotValueSequences : [];
    const valueMap = sequences.reduce((acc: Record<string, any>, seq: any) => {
      const time = formatTimestampToTime(getSequenceTimestamp(seq));
      if (time) {
        const val = seq?.value ?? seq?.iotValue ?? seq?.val ?? seq?.dataValue;
        acc[time] = val;
        timeSet.add(time);
        
        // Collect numeric values if we have enum definitions
        if (Object.keys(enumMap).length > 0 && val !== undefined && val !== null && val !== "" && !Number.isNaN(Number(val))) {
            allValuesSet.add(Number(val));
        }
      }
      return acc;
    }, {} as Record<string, any>);
    objIdSet.add(item?.objId || "");
    return { key,  name, spec, valueMap, hasRecord: Boolean(item?.startRecordMark) };
  });

  const hasEnum = Object.keys(enumMap).length > 0;
  const sortedUniqueValues = hasEnum ? Array.from(allValuesSet).sort((a, b) => a - b) : [];
  const valToIndex: Record<number, number> = {};
  if (hasEnum) {
      sortedUniqueValues.forEach((v, i) => { valToIndex[v] = i; });
  }

  const times = Array.from(timeSet).sort((a, b) => parseTimeToFloat(a) - parseTimeToFloat(b));
  const data: ChartDataPoint[] = times.map((time) => {
    const row: ChartDataPoint = { time };
    deviceSeries.forEach((device) => {
      const raw = device.valueMap[time];
      const num = raw === undefined || raw === null || raw === "" ? null : Number(raw);
      
      if (hasEnum && num !== null && valToIndex[num] !== undefined) {
          row[device.key] = valToIndex[num];
      } else {
          row[device.key] = Number.isNaN(num) ? null : num;
      }
    });
    return row;
  });
  const series = deviceSeries.map((device) => ({
    key: device.key,
    name: device.name,
    spec: device.spec,
    hasRecord: device.hasRecord,
  }));
  
  const yTickFormatter = hasEnum
    ? (val: any) => {
        const rawVal = sortedUniqueValues[val];
        // If rawVal is undefined (e.g. tick out of range), return val
        if (rawVal === undefined) return "";
        return enumMap[String(rawVal)] || String(rawVal);
    }
    : undefined;
    
  const yTicks = hasEnum ? sortedUniqueValues.map((_, i) => i) : undefined;
  const chartType: "monotone" | "stepAfter" = hasEnum ? "stepAfter" : "monotone";
  
  return { title: infoName, objIds: Array.from(objIdSet), infoCode, unit, series, data, yTickFormatter, yTicks, chartType };
};

const ChartCard = ({ 
  reportDate,
  title, 
  unit, 
  filterText, 
  series, 
  data,
  yDomain,
  yTickFormatter,
  yTicks,
  chartType = "monotone",
  customTooltip,
  height = 200,
}: { 
  reportDate: string,
  title: string, 
  unit: string, 
  filterText?: string, 
  series: { key: string, name: string, spec?: string, hasRecord?: boolean }[], 
  data: ChartDataPoint[],
  yDomain?: [number | 'auto', number | 'auto'],
  yTickFormatter?: (value: any) => string,
  yTicks?: number[],
  chartType?: "monotone" | "stepAfter",
  customTooltip?: any,
  height?: number,
}) => {
  const [filterChecked, setFilterChecked] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hiddenKeys, setHiddenKeys] = useState<string[]>([]);
  const [xTickInterval, setXTickInterval] = useState(0);

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

      const minLabelWidth = 44;
      const desiredCount = Math.max(1, Math.floor(containerWidth / minLabelWidth));
      const interval = Math.max(0, Math.ceil(data.length / desiredCount) - 1);
      setXTickInterval(interval);
    };

    calculateVisibleItems();
    const observer = new ResizeObserver(calculateVisibleItems);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [visibleSeries]); 

  const itemsToShow = isExpanded ? visibleSeries : visibleSeries.slice(0, limit);
  const showButton = visibleSeries.length > limit;

  const DefaultTooltip = ({ active, payload, label }: any) => {
    console.log('payload: ', payload, label);
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
                 displayVal = `${val}${unit || ''}`;
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
          <h4 className="font-bold text-[#1B2129] text-[14px]">{title}{unit ? `(${unit})` : ''}</h4>
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
          <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E6E7" />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#8D9399' }} axisLine={false} tickLine={false} interval={xTickInterval} padding={{ left: 0, right: 12 }} />
            <YAxis domain={yDomain || ['auto', 'auto']} tick={{ fontSize: 10, fill: '#8D9399' }} axisLine={false} tickLine={false} tickFormatter={yTickFormatter} ticks={yTicks ? yTicks : (yTickFormatter ? [0, 1] : undefined)} />
            <Tooltip content={<ChartComponent />} cursor={{ stroke: '#E1E5EB', strokeWidth: 1 }} />
            {visibleSeries.map((s, idx) => (
              <Line 
                key={s.key}
                type={chartType} 
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

// --- Specific Module Components ---

const ZoneStatusChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    return (
      <div className="bg-white p-3 border border-[#E1E5EB] rounded shadow-lg text-xs z-50">
        <p className="font-bold text-[#2E3742] mb-1">2025年8月27日 {label}</p>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-[2px] bg-[#246FE5]" />
          <span className="text-[#626C78]">水阀#1：</span>
          <span className="font-bold text-[#1B2129]">{val === 1 ? "开启" : "关闭"}</span>
        </div>
      </div>
    );
  }
  return null;
};

// Unified Banner Component
const SectionBanner: React.FC<{ title: string }> = ({ title }) => (
  <div className="relative rounded-[4px] shrink-0 w-full overflow-hidden">
    
    <div className="relative flex flex-col items-start  py-[4px] w-full">
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


export const AirZoneSection: React.FC<{ 
  data?: any,
  system?: any, 
}> = ({data, system,   }) => {
  const { infoCodeDefines } = useScheduleInfoCodeDefine();
  
  const { id,classCode,reportDate,adjustmentRecords, actualRun, exceptionLogs } =data;
  const title = `空调控制分区-${data.name}`
  const codeDefines = useMemo<ReturnType<typeof buildActualRunChart>>(
    () => infoCodeDefines[classCode]??{},
    [classCode ,infoCodeDefines]
  );
  const actualRunChart = useMemo<ReturnType<typeof buildActualRunChart>>(
    () => buildActualRunChart(actualRun, codeDefines),
    [actualRun, codeDefines]
  );
  const formatDate = dayjs(reportDate).format('YYYY年MM月DD日');

  const scheduleParams = { objectId: id, consoleTypes: ["AIR_TERMINAL_ZONE"], reportDate:  reportDate };
  const eqIds = actualRunChart?.objIds??[];
  const pumpIds = adjustmentRecords?.adjustmentRecordsPumps?.map((item: any) => item.pumpId) || [];
  const manualInterventionParams = { systemId: system?.id, objectIds: [id, ...eqIds, ...pumpIds], reportDate:  reportDate };
  return (
    <div className="flex flex-col gap-4 mb-3">
      <SectionBanner title={title} />
      <RegulationRecordSection 
        data={adjustmentRecords || {}} 
        manualInterventionParams={manualInterventionParams}
        scheduleParams={scheduleParams}
        codeDefines={codeDefines}
        title="调节记录" 
        hideAILinks={true}
      />
      {actualRunChart && (
        <ChartCard 
          reportDate={formatDate}
          title={actualRunChart.title} 
          unit={actualRunChart.unit} 
          filterText={actualRunChart.infoCode === "workFreq" ? "仅看有开启记录的水泵" : undefined}
          data={actualRunChart.data} 
          series={actualRunChart.series} 
          yTickFormatter={actualRunChart.yTickFormatter} 
          yTicks={actualRunChart.yTicks}
          chartType={actualRunChart.chartType} 
          height={150}
        />
      )}
      <ExceptionLogs logs={exceptionLogs} />
    </div>
  );
};
