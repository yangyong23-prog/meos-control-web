import React, { useEffect, useMemo } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import useTimeSchedule from "@/app/hooks/useTimeSchedule";
import { useScheduleInfoCodeDefine } from "@/app/hooks/useScheduleInfoCodeDefine";
import { COOl_MODE_OPTION_DEFINE } from "@/app/variables";
import Loading from "@/app/components/Loading";
import Empty from "@/app/components/Empty";

interface SchedulePopupProps {
  onClose: () => void;
  scheduleParams?: any;
}

const SCHEDULE_DATA = [
  
];

const normalizeTime = (time?: string) => {
  if (!time) return "";
  const [hour, minute] = time.split(":");
  if (hour === undefined || minute === undefined) return time;
  return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
};

const timeToMinutes = (time: string) => {
  const [hour, minute] = time.split(":");
  return Number(hour || 0) * 60 + Number(minute || 0);
};

const SWITCH_VALUE: Record<string, string> = {
  OPEN: "开启",
  CLOSE: "关闭"
};

const getFieldDefine = (classCode?: string, field?: string, infoCodeDefines?: Record<string, any>) => {
  if (!classCode || !field) return undefined;
  return infoCodeDefines?.[classCode]?.[field];
};

const getChillerMeasureWord = (chillerType?: string) => {
  return chillerType === "ACSCG" ? "组" : "台";
};

const formatValueForDefine = (value: any, define?: any) => {
  if (value === null || value === undefined) return "";
  if (define?.dataSources && typeof value === "string") {
    const match = define.dataSources.find((item: any) => item?.code === value);
    if (match?.name) return match.name;
  }
  if (typeof value === "string" && SWITCH_VALUE[value]) return SWITCH_VALUE[value];
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};

const formatChillerCount = (info: any, classCode?: string, infoCodeDefines?: Record<string, any>, measureWord?: string) => {
  const chillerDefine = getFieldDefine(classCode, info?.chillerType, infoCodeDefines);
  if (!chillerDefine) return "";
  const chillerName = chillerDefine?.aliasName || chillerDefine?.name || info?.chillerType;
  const word = measureWord || getChillerMeasureWord(info?.chillerType);
  if (!info?.chillerM1Num && !info?.chillerSNum) {
    return `${chillerName}-${info?.chillerLNum ?? "--"}${word}`;
  }
  if (info?.chillerLNum !== "--" || info?.chillerM1Num !== "--" || info?.chillerSNum !== "--") {
    const large = info?.chillerLNum && info?.chillerLNum !== "--" ? `${info.chillerLNum}大` : "";
    const mid = info?.chillerM1Num && info?.chillerM1Num !== "--" ? `${info.chillerM1Num}中` : "";
    const small = info?.chillerSNum && info?.chillerSNum !== "--" ? `${info.chillerSNum}小` : "";
    return `${chillerName}-${large}${mid}${small}`;
  }
  return "";
};

const buildPointInfosDetails = (
  pointInfos: any[],
  classCode?: string,
  infoCodeDefines?: Record<string, any>,
  measureWord?: string,
  includeFreeCool?: boolean
) => {
  if (!Array.isArray(pointInfos)) return [];
  const details: string[] = [];
  pointInfos.forEach((info) => {
    if (!info || typeof info !== "object") return;
    
    let durationText = ''
    if (info?.sustainTime) {
      const duration = !isNaN(parseFloat(info.sustainTime)) ? info.sustainTime : "--";
      durationText = `，持续时长 ${duration}分钟`;
    }
    if (info.chillerType){
      const chillerText = formatChillerCount(info, classCode, infoCodeDefines, measureWord);
      if (chillerText) details.push(chillerText + durationText);

    }else{

      Object.entries(info).forEach(([key, value]) => {
        const define = getFieldDefine(classCode, key, infoCodeDefines);
        if (!define) return;
        const label = define?.aliasName || define?.name || key;
        const valText = formatValueForDefine(value, define);
  
        
        details.push(`${label} ${valText ? valText : ""}${define?.unit ? define.unit : ""}${durationText}`.trim());
      });
      if (info?.coolMode === "DE_ICE_COOL" && info?.extendInfo?.iceRatio) {
         
        details.push(`放冷结束，冰量低于${info.extendInfo.iceRatio}%时提前结束放冷`);
      }
      if (includeFreeCool && info?.coolMode === "FREE_COOL" && info?.extendInfo?.freeCoolTemp) {
         
        details.push(`免费冷结束，供水温度高于${info.extendInfo.freeCoolTemp}℃时提前结束免费冷供冷`);
      }
    }
    
  });
  return details;
};

const buildDetails = (
  pointInfos: any[],
  objectInfos: any[],
  classCode?: string,
  infoCodeDefines?: Record<string, any>
) => {
  const details: string[] = [];
  details.push(...buildPointInfosDetails(pointInfos, classCode, infoCodeDefines, undefined, true));
  if (Array.isArray(objectInfos)) {
    objectInfos.forEach((objectInfo) => {
      if (objectInfo?.pointInfos?.length) {
        details.push(objectInfo?.localName || "--");
      }
      details.push(
        ...buildPointInfosDetails(
          objectInfo?.pointInfos,
          objectInfo?.classCode,
          infoCodeDefines,
          "台",
          false
        )
      );
    });
  }
  return details;
};

type PlainDetailItem = {
  kind: "title" | "detail";
  text: string;
};

const buildPlainDetails = (
  pointInfos: any[],
  objectInfos: any[],
  classCode?: string,
  infoCodeDefines?: Record<string, any>
) => {
  const details: PlainDetailItem[] = [];
  const baseDetails = buildPointInfosDetails(pointInfos, classCode, infoCodeDefines, undefined, false);
  baseDetails.forEach((text) => details.push({ kind: "detail", text }));
  if (Array.isArray(objectInfos)) {
    objectInfos.forEach((objectInfo) => {
      if (objectInfo?.pointInfos?.length && objectInfo?.localName) {
        details.push({ kind: "title", text: objectInfo.localName });
      }
      const objectDetails = buildPointInfosDetails(
        objectInfo?.pointInfos,
        objectInfo?.classCode,
        infoCodeDefines,
        "台",
        false
      );
      objectDetails.forEach((text) => details.push({ kind: "detail", text }));
    });
  }
  return details;
};

export const SchedulePopup: React.FC<SchedulePopupProps> = ({ onClose,  scheduleParams }) => {
   
  const { infoCodeDefines } = useScheduleInfoCodeDefine();
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  
  const { strategyList, loading, fetchStrategyList } = useTimeSchedule();
  useEffect(() => {
    // const currentSystem = scheduleParams?. { systemId: "" };
    // const consoleTypes = ["COOL_SUPPLY", "COOL_INPUT", "AIR_TERMINAL_ZONE"];
    fetchStrategyList(scheduleParams);
  }, [fetchStrategyList]);

  const scheduleData = useMemo(() => {
    const result = new Map<string, {
      time: string;
      cooling: { type: string; subTypes: Set<string>; details: string[] };
      storage: { type: string; subTypes: Set<string>; details: string[] };
      plainDetails: PlainDetailItem[];
    }>();

    (Array.isArray(strategyList) ? strategyList : []).forEach((strategy: any) => {
      (Array.isArray(strategy?.executeObjects) ? strategy.executeObjects : []).forEach((executeObject: any) => {
        const category = executeObject?.consoleType === "COOL_SUPPLY"
          ? "cooling"
          : executeObject?.consoleType === "COOL_INPUT"
            ? "storage"
            : null;
        (Array.isArray(executeObject?.executeDetail?.strategyPlans) ? executeObject.executeDetail.strategyPlans : []).forEach((plan: any) => {
          const time = normalizeTime(plan?.strategyTime);
          if (!time) return;
          if (!result.has(time)) {
            result.set(time, {
              time,
              cooling: { type: "供冷", subTypes: new Set(), details: [] },
              storage: { type: "蓄冷", subTypes: new Set(), details: [] },
              plainDetails: []
            });
          }
          const entry = result.get(time)!;
          if (category) {
            const target = category === "cooling" ? entry.cooling : entry.storage;
            (Array.isArray(plan?.coolModes) ? plan.coolModes : []).forEach((mode: string) => {
              target.subTypes.add(COOl_MODE_OPTION_DEFINE[mode]?.label || mode);
            });
            const details = buildDetails(plan?.pointInfos, plan?.objectInfos, executeObject?.classCode, infoCodeDefines);
            if (details.length) target.details.push(...details);
          } else {
            const details = buildPlainDetails(plan?.pointInfos, plan?.objectInfos, executeObject?.classCode, infoCodeDefines);
            if (details.length) entry.plainDetails.push(...details);
          }
        });
      });
    });

    const list = Array.from(result.values())
      .map((item) => {
        const coolingSubType = item.cooling.subTypes.size ? Array.from(item.cooling.subTypes).join("、") : "--";
        const storageSubType = item.storage.subTypes.size ? Array.from(item.storage.subTypes).join("、") : "--";
        const coolingDetails = item.cooling.details.filter((detail) => detail && detail !== "--");
        const storageDetails = item.storage.details.filter((detail) => detail && detail !== "--");
        return {
          time: item.time,
          cooling: {
            type: "供冷",
            subType: coolingSubType,
            details: coolingDetails
          },
          storage: {
            type: "蓄冷",
            subType: storageSubType,
            details: storageDetails
          },
          plainDetails: item.plainDetails
        };
      })
      .sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));

    return list.length ? list : SCHEDULE_DATA;
  }, [strategyList, infoCodeDefines]);
  // Use portal to render at body level to ensure it's on top
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
      <div className="bg-white rounded-[4px] shadow-lg w-[1260px] max-w-[95vw] h-[564px] flex flex-col overflow-hidden">
        <div className="h-[56px] shrink-0 border-b border-[#E8ECF0] flex items-center justify-between px-[24px]">
          <h2 className="text-[16px] font-bold text-[#2E3742] font-['Microsoft_YaHei_UI:Bold',sans-serif]">时间表</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition-colors">
            <X size={20} className="text-[#8B949E]" />
          </button>
        </div>
        {loading && (
          <div className="flex-1 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <Loading showText={false} size={100} className="overflow-hidden bg-transparent" />
            </div>
          </div>
        )}
        { !loading && (
          <div className="flex-1 overflow-x-auto overflow-y-auto p-[24px]">
            {scheduleData.length === 0 && !loading ? (
              <Empty text="暂无内容" />
            ) : (
              <div className="flex border border-[#E1E5EB] w-full min-w-max">
                {scheduleData.map((item, index) => (
                  <div 
                    key={index} 
                    className={`flex flex-col min-w-[202px] flex-1 border-r border-[#E1E5EB] last:border-r-0`}
                  >
                  <div className="h-[48px] bg-[#F1F4F6] border-b border-[#E1E5EB] px-[16px] flex items-center">
                    <span className="text-[12px] text-[#626C78] font-['Microsoft_YaHei_UI',sans-serif]">{item.time}</span>
                  </div>

                  {item.plainDetails.length > 0 ? (
                    <div className="p-[12px] flex flex-col gap-[8px] flex-1">
                      <div className="flex flex-col gap-[4px]">
                        {item.plainDetails.map((detail, i) =>
                          detail.kind === "title" ? (
                            <div key={`title-${i}`} className="mt-[4px] mb-[4px] text-[14px] text-[#1B2129] font-['Microsoft_YaHei_UI',sans-serif]">
                              {detail.text}
                            </div>
                          ) : (
                            <div key={`detail-${i}`} className="flex gap-[4px] items-start">
                              <div className="w-[4px] h-[4px] rounded-full bg-[#8B949E] shrink-0 mt-[9px]" />
                              <span className="text-[14px] text-[#626C78] font-['Microsoft_YaHei_UI',sans-serif] leading-[22px]">{detail.text}</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  ) : (item.cooling.subType !== "--" || item.cooling.details.length > 0) && (
                    <div className="p-[12px] border-b border-[#E1E5EB] flex flex-col gap-[8px] flex-1">
                      <div className="min-h-[22px] rounded-[2px] flex items-center w-full px-[8px] bg-[linear-gradient(90deg,rgba(100,166,247,0.12)_0%,rgba(100,166,247,0.00)_100%)]">
                        <span className="text-[14px] text-[#246FE5] font-['Microsoft_YaHei_UI',sans-serif] leading-none">供冷</span>
                      </div>
                      {item.cooling.subType !== "--" && (
                        <div className="flex flex-wrap gap-[4px]">
                          {item.cooling.subType.split("、").map((mode, modeIndex) => (
                            <div key={modeIndex} className="bg-[#E8ECF0] h-[16px] rounded-[2px] flex items-center px-[4px]">
                              <span className="text-[12px] text-[#1B2129] font-['Microsoft_YaHei_UI',sans-serif] leading-[16px]">
                                {mode}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      {item.cooling.details.length > 0 && (
                        <div className="flex flex-col gap-[4px] mt-1">
                          {item.cooling.details.map((detail, i) => (
                            <div key={i} className="flex gap-[4px] items-start">
                              <div className="w-[4px] h-[4px] rounded-full bg-[#8B949E] shrink-0 mt-[9px]" />
                              <span className="text-[14px] text-[#626C78] font-['Microsoft_YaHei_UI',sans-serif] leading-[22px]">{detail}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Storage Cell */}
                  {item.plainDetails.length === 0 && (item.storage.subType !== "--" || item.storage.details.length > 0) && (
                    <div className="p-[12px] flex flex-col gap-[8px] flex-1">
                      <div className="min-h-[22px] rounded-[2px] flex items-center w-full px-[8px] bg-[linear-gradient(90deg,rgba(0,162,167,0.12)_0%,rgba(0,162,167,0.00)_100%)]">
                        <span className="text-[14px] text-[#00A2A7] font-['Microsoft_YaHei_UI',sans-serif] leading-none">蓄冷</span>
                      </div>
                      {item.storage.subType !== "--" && (
                        <div className="flex flex-wrap gap-[4px]">
                          {item.storage.subType.split("、").map((mode, modeIndex) => (
                            <div key={modeIndex} className="bg-[#E8ECF0] h-[16px] rounded-[2px] flex items-center px-[4px]">
                              <span className="text-[12px] text-[#1B2129] font-['Microsoft_YaHei_UI',sans-serif] leading-[16px]">
                                {mode}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      {item.storage.details.length > 0 && (
                        <div className="flex flex-col gap-[4px] mt-1">
                          {item.storage.details.map((detail, i) => (
                            <div key={i} className="flex gap-[4px] items-start">
                              <div className="w-[4px] h-[4px] rounded-full bg-[#8B949E] shrink-0 mt-[9px]" />
                              <span className="text-[14px] text-[#626C78] font-['Microsoft_YaHei_UI',sans-serif] leading-[22px]">{detail}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
