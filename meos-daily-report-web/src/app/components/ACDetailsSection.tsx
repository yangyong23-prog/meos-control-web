import React, { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart, Bar } from "recharts";
import dayjs from "dayjs";
import { MTipsTooltip } from "@/app/components/common/MTipsTooltip";
import { formatTo1Decimal } from "@/utils/format";

interface ACDetailsProps {
  data: any;
  date: string;
  children?: React.ReactNode;
}

const toDayjsTime = (value: string) => {
  const normalized = value.includes("T") ? value.replace("T", " ") : value;
  const dateCandidate = dayjs(normalized);
  if (dateCandidate.isValid()) return dateCandidate;
  if (normalized.includes(":")) {
    const timeCandidate = dayjs(`1970-01-01 ${normalized}`);
    if (timeCandidate.isValid()) return timeCandidate;
  }
  return null;
};

const parseTimeKey = (value: string) => {
  const parsed = toDayjsTime(value);
  if (parsed) return parsed.valueOf();
  if (value.includes(":")) {
    const [hour, minute] = value.split(":");
    return (Number(hour) || 0) * 60 + (Number(minute) || 0);
  }
  return 0;
};

const formatTimeLabel = (value: string) => {
  const parsed = toDayjsTime(value);
  if (parsed) return parsed.format("HH:mm");
  if (value.includes(":")) return value.slice(0, 5);
  return value;
};

const toNumber = (value: any) => {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  return Number.isFinite(num) ? formatTo1Decimal(num) : null;
};

const toPriceNumber = (value: any) => {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  if (!Number.isFinite(num)) return null;
  return   formatTo1Decimal(num);
};

const formatWithUnit = (value: number | string | null, unit: string) => {
  if (value === null || value === undefined || value === "") return "-";
  if (!Number.isFinite(Number(value))) return "-";
  return `${value}${unit}`;
};

const getLastValue = (source: Record<string, any> | undefined | null) => {
  if (!source) return null;
  const keys = Object.keys(source);
  if (!keys.length) return null;
  keys.sort((a, b) => parseTimeKey(a) - parseTimeKey(b));
  return toNumber(source[keys[keys.length - 1]]);
};

const extractPriceMap = (source: any) => {
  if (!source) return {};

  if (typeof source === "object") {
    if (Array.isArray(source.iotDataList)) {
      return source.iotDataList.reduce((acc: Record<string, any>, item: any) => {
        const timeKey = item?.dataTime || item?.dateTime || item?.datetime || item?.time || item?.date;
        const value = item?.dataValue ?? item?.value ?? item?.price ?? item?.rate;
        if (timeKey) acc[timeKey] = value;
        return acc;
      }, {} as Record<string, any>);
    }

  }
  return {};
};

// --- Toggle Switch Component (Pixel Perfect to Figma) ---
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

const CoolingEnergySection: React.FC<{ date: string; chapterData?: any, node?: any  }> = ({ date, chapterData, node }: { date: string; chapterData?: any, node?: any }) => {
  const [viewMode, setViewMode] = useState<"chart" | "list">("chart");
  const [visibleSeries, setVisibleSeries] = useState({
    actualEnergy: true,
    predictedEnergy: true,
    actualCooling: true,
    predictedCooling: true
  });

  const toggleSeries = (key: keyof typeof visibleSeries) => {
    setVisibleSeries((prev: typeof visibleSeries) => ({ ...prev, [key]: !prev[key] }));
  };

  const parsedShortDate = dayjs(date);
  const shortDate = parsedShortDate.isValid()
    ? parsedShortDate.format("MM.DD")
    : date.replace(/^\d{4}[-.]/, "");
  const predictedCoolingTotal = null;
  const predictedEnergyTotal = null;
  const energyMap = chapterData?.dateTime2AccElecConsum || {};
  const coolingMap = chapterData?.dateTime2AccCool  || {};
  const actualCoolingTotal = toNumber(chapterData?.dayAccCool) ?? getLastValue(coolingMap);
  const actualEnergyTotal = toNumber(chapterData?.dayAccElecConsum) ?? getLastValue(energyMap);

  const relSystems = chapterData?.relSystems || [];
  const sysNames = relSystems.map(obj=>obj.localName)?.join('、');

  const chartData = useMemo(() => {
    const baseDate = dayjs(date.replace(/\./g, "-"));
    const normalizedDate = baseDate.isValid() ? baseDate.format("YYYY-MM-DD") : "";
    const getValueAtTime = (source: Record<string, any>, time: string) => {
      const candidates = [
        time,
        `${normalizedDate}T${time}`,
        `${normalizedDate}T${time}:00`,
        `${normalizedDate} ${time}`,
        `${normalizedDate} ${time}:00`
      ].filter(Boolean);
      for (const key of candidates) {
        if (Object.prototype.hasOwnProperty.call(source, key)) return source[key];
      }
      return null;
    };
    const timeList = Array.from({ length: 24 }, (_, index) => `${String(index).padStart(2, "0")}:00`);
    return timeList.map((time) => ({
      time,
      actualEnergy: toNumber(getValueAtTime(energyMap, time)),
      predictedEnergy: null,
      actualCooling: toNumber(getValueAtTime(coolingMap, time)),
      predictedCooling: null
    }));
  }, [chapterData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    
    const actualEnergy = payload?.find((item: any) => item.dataKey === "actualEnergy");
    const actualCooling = payload?.find((item: any) => item.dataKey === "actualCooling");
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-[#E1E5EB] rounded-lg shadow-lg z-50">
          <p className="font-bold text-[#2E3742] mb-3">{date.replace(/\./g, "年").replace("年", "年") + "月" + "日"} {label}</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#2481F2] rounded-[2px]" />
              <span className="text-sm text-[#626C78]">冷站实际能耗：</span>
              <span className="text-sm font-bold text-[#1B2129]">{formatWithUnit(actualEnergy?.value ?? null, "kWh")}</span>
            </div>
            {/* <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#33D4D2] rounded-[2px]" />
              <span className="text-sm text-[#626C78]">AI预测冷站能耗：</span>
              <span className="text-sm font-bold text-[#1B2129]">{formatWithUnit(payload[1]?.value ?? null, "kWh")}</span>
            </div> */}
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-[#2481F2]" />
              <span className="text-sm text-[#626C78]">冷站实际提供冷量：</span>
              <span className="text-sm font-bold text-[#1B2129]">{formatWithUnit(actualCooling?.value ?? null, "kWh")}</span>
            </div>
            {/* <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-[#33D4D2]" />
              <span className="text-sm text-[#626C78]">AI预测冷量：</span>
              <span className="text-sm font-bold text-[#1B2129]">{formatWithUnit(payload[3]?.value ?? null, "kWh")}</span>
            </div> */}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div id={node?.id} className="bg-white p-[16px] rounded-[4px] border border-[#E1E5EB] w-full">
      {/* Header Text */}
      <div className="mb-[12px]">
        <h3 className="text-[14px] text-[#1B2129] leading-[22px] font-['Microsoft_YaHei_UI',sans-serif]">{node?.label}</h3>
        <p className="text-[14px] text-[#626C78] leading-[22px] font-['Microsoft_YaHei_UI',sans-serif]">
          本日（{shortDate}）
          {/* AI预测项目所需冷量为 <span className="text-[#1B2129] font-bold">{formatWithUnit(predictedCoolingTotal, "kWh")}</span>， */}
          冷站实际提供冷量为 <span className="text-[#1B2129] font-bold">{formatWithUnit(actualCoolingTotal, "kWh")}</span> （{sysNames}提供的总冷量）；
          {/* AI预测冷站能耗为 <span className="text-[#1B2129] font-bold">{formatWithUnit(predictedEnergyTotal, "kWh")}</span>， */}
          冷站实际能耗为 <span className="text-[#1B2129] font-bold">{formatWithUnit(actualEnergyTotal, "kWh")}</span> （{sysNames}总耗电量）
        </p>
      </div>

      {/* Controls & Legend */}
      <div className="flex justify-between items-center mb-[12px]">
        <div className="flex items-center">
          <span className="text-[14px] text-[#626C78] font-normal font-['Microsoft_YaHei_UI',sans-serif]">逐小时明细</span>
          <ToggleSwitch value={viewMode} onChange={setViewMode} />
        </div>

        {viewMode === "chart" && (
          <div className="flex items-center gap-4 text-xs select-none">
            <div
              className={`flex items-center gap-1.5 cursor-pointer transition-opacity ${visibleSeries.actualEnergy ? 'opacity-100' : 'opacity-40'}`}
              onClick={() => toggleSeries('actualEnergy')}
            >
              <div className="w-3.5 h-3.5 bg-[#2481F2] rounded-[2px]" />冷站实际能耗
            </div>
            {/* <div
              className={`flex items-center gap-1.5 cursor-pointer transition-opacity ${visibleSeries.predictedEnergy ? 'opacity-100' : 'opacity-40'}`}
              onClick={() => toggleSeries('predictedEnergy')}
            >
              <div className="w-3.5 h-3.5 bg-[#33D4D2] rounded-[2px]" />AI预测冷站能耗
            </div> */}
            <div
              className={`flex items-center gap-1.5 cursor-pointer transition-opacity ${visibleSeries.actualCooling ? 'opacity-100' : 'opacity-40'}`}
              onClick={() => toggleSeries('actualCooling')}
            >
              <div className="w-3.5 h-[3px] bg-[#2481F2]" />冷站实际提供冷量
            </div>
            {/* <div
              className={`flex items-center gap-1.5 cursor-pointer transition-opacity ${visibleSeries.predictedCooling ? 'opacity-100' : 'opacity-40'}`}
              onClick={() => toggleSeries('predictedCooling')}
            >
              <div className="w-3.5 h-[3px] bg-[#33D4D2]" />AI预测冷量
            </div> */}
          </div>
        )}
      </div>

      {/* Content */}
      {viewMode === "chart" ? (
        <>
           <div className="flex justify-between text-[12px] text-[#626C78] mb-1 px-1">
             <span>kWh</span>
           </div>
           <div className="h-[250px] w-full min-w-0">
             <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100} debounce={200}>
               <ComposedChart data={chartData} margin={{ left: 0, right: 20, bottom: 0, top: 10 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E6E7" />
                 <XAxis
                   dataKey="time"
                   axisLine={false}
                   tickLine={false}
                   tick={{ fill: '#8D9399', fontSize: 12 }}
                 />
                 <YAxis
                   axisLine={false}
                   tickLine={false}
                   tick={{ fill: '#646C73', fontSize: 12 }}
                   tickFormatter={(value) => value >= 1000 ? `${value/1000}k` : value}
                 />
                 <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                 {/* Bars - Adjusted barSize and gap to look like screenshot */}
                 <Bar dataKey="actualEnergy" fill="#2481F2" barSize={8} radius={[2, 2, 0, 0]} name="冷站实际能耗" hide={!visibleSeries.actualEnergy} />
                 {/* <Bar dataKey="predictedEnergy" fill="#33D4D2" barSize={8} radius={[2, 2, 0, 0]} name="AI预测冷站能耗" hide={!visibleSeries.predictedEnergy} /> */}

                 {/* Lines */}
                 <Line type="linear" dataKey="actualCooling" stroke="#2481F2" strokeWidth={2} dot={false} name="冷站实际提供冷量" hide={!visibleSeries.actualCooling} />
                 {/* <Line type="linear" dataKey="predictedCooling" stroke="#33D4D2" strokeWidth={2} dot={false} name="AI预测冷量" hide={!visibleSeries.predictedCooling} /> */}
               </ComposedChart>
             </ResponsiveContainer>
           </div>
        </>
      ) : (
        <div className="w-full overflow-x-auto rounded-[4px] border border-[#E1E5EB]">
          <table className="report-table w-full table-fixed">
            <thead>
              <tr className="h-[38px] bg-[#EBF4FE]">
                <th className="w-1/5 !py-[10px] !pl-[16px] !pr-[12px] text-left font-['Microsoft_YaHei_UI',sans-serif] font-normal text-[12px] text-[#626C78] border-b border-[#E1E5EB] border-r truncate">时间</th>
                <th className="w-1/5 !py-[10px] !pl-[16px] !pr-[12px] text-left font-['Microsoft_YaHei_UI',sans-serif] font-normal text-[12px] text-[#626C78] border-b border-[#E1E5EB] border-r truncate">冷站实际能耗</th>
                {/* <th className="w-1/5 !py-[10px] !pl-[16px] !pr-[12px] font-['Microsoft_YaHei_UI',sans-serif] font-normal text-[12px] text-[#626C78] border-b border-[#E1E5EB] border-r truncate">AI预测能耗</th> */}
                <th className="w-1/5 !py-[10px] !pl-[16px] !pr-[12px] text-left font-['Microsoft_YaHei_UI',sans-serif] font-normal text-[12px] text-[#626C78] border-b border-[#E1E5EB] border-r truncate">实际冷量</th>
                {/* <th className="w-1/5 !py-[10px] !pl-[16px] !pr-[12px] font-['Microsoft_YaHei_UI',sans-serif] font-normal text-[12px] text-[#626C78] border-b border-[#E1E5EB] truncate">AI预测冷量</th> */}
              </tr>
            </thead>
            <tbody>
              {chartData.map((row: any, idx: number) => (
                <tr key={row.time} className="h-[36px] bg-white hover:bg-transparent">
                  <td className="!py-[13px] !pl-[16px] !pr-[12px] text-left font-['Microsoft_YaHei_UI',sans-serif] text-[14px] text-[#1B2129] border-b border-[#E1E5EB] border-r">
                    <MTipsTooltip>{`${row.time}-${String(Number(row.time.split(':')[0]) + 1).padStart(2, '0')}:00`}</MTipsTooltip>
                  </td>
                  <td className="!py-[13px] !pl-[16px] !pr-[12px] text-left font-['Microsoft_YaHei_UI',sans-serif] text-[14px] text-[#1B2129] border-b border-[#E1E5EB] border-r">
                    <MTipsTooltip>{formatWithUnit(row.actualEnergy, "kWh")}</MTipsTooltip>
                  </td>
                  {/* <td className="!py-[13px] !pl-[16px] !pr-[12px] font-['Microsoft_YaHei_UI',sans-serif] text-[14px] text-[#1B2129] border-b border-[#E1E5EB] border-r">
                    <MTipsTooltip>{formatWithUnit(row.predictedEnergy, "kWh")}</MTipsTooltip>
                  </td> */}
                  <td className="!py-[13px] !pl-[16px] !pr-[12px] text-left font-['Microsoft_YaHei_UI',sans-serif] text-[14px] text-[#1B2129] border-b border-[#E1E5EB] border-r">
                    <MTipsTooltip>{formatWithUnit(row.actualCooling, "kWh")}</MTipsTooltip>
                  </td>
                  {/* <td className="!py-[13px] !pl-[16px] !pr-[12px] font-['Microsoft_YaHei_UI',sans-serif] text-[14px] text-[#1B2129] border-b border-[#E1E5EB]">
                    <MTipsTooltip>{formatWithUnit(row.predictedCooling, "kWh")}</MTipsTooltip>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const TempTargetSection: React.FC<{ date: string; chapterData?: any, node?: any, id?: any }> = ({ date, chapterData, node, id }: { date: string; chapterData?: any, node?: any, id?: any }) => {
  const [viewMode, setViewMode] = useState<"chart" | "list">("chart");
  const [visibleSeries, setVisibleSeries] = useState({
    actual: true,
    target: true,
    price: true
  });

  const rateCode = chapterData?.currentTempAndCarbonRate?.type;
  const rateType = rateCode === "value_select_lowest_cast"
    ? "price"
    : rateCode === "value_select_Lowest_carbon_emissions"
      ? "carbon"
      : "none";
  const hasRateLine = rateType !== "none";
  const rateLabel = rateType === "carbon" ? "碳排放因子" : "电价";
  const rateUnitLabel = rateType === "carbon" ? "kgCO₂" : "元";
  const rateUnitFull = rateType === "carbon" ? "kgCO₂/kWh" : "元/kWh";
  console.log('rateType: ', rateCode === "value_select_Lowest_carbon_emissions",rateCode,rateType);

  const toggleSeries = (key: keyof typeof visibleSeries) => {
    setVisibleSeries((prev: typeof visibleSeries) => ({ ...prev, [key]: !prev[key] }));
  };


  const parsedShortDate = dayjs(date);
  const shortDate = parsedShortDate.isValid()
    ? parsedShortDate.format("MM.DD")
    : date.replace(/^\d{4}[-.]/, "");

  const chartData = useMemo(() => {
    const actualMap = chapterData?.dateTimeTdb || {};
    const targetMap = chapterData?.dateTime2TempTwinControlAim || {};
    const priceMap = extractPriceMap(chapterData?.currentTempAndCarbonRate);
    const baseDate = dayjs(date.replace(/\./g, "-"));
    const normalizedDate = baseDate.isValid() ? baseDate.format("YYYY-MM-DD") : "";
    const getValueAtTime = (source: Record<string, any>, time: string) => {
      const candidates = [
        time,
        `${normalizedDate}T${time}`,
        `${normalizedDate}T${time}:00`,
        `${normalizedDate} ${time}`,
        `${normalizedDate} ${time}:00`
      ].filter(Boolean);
      for (const key of candidates) {
        if (Object.prototype.hasOwnProperty.call(source, key)) return source[key];
      }
      return null;
    };
    const start = baseDate.isValid() ? baseDate.startOf("day") : dayjs().startOf("day");
    const timeList = Array.from({ length: 96 }, (_, index) => start.add(index * 15, "minute").format("HH:mm"));
    return timeList.map((time) => ({
      time,
      actual: toNumber(getValueAtTime(actualMap, time)),
      target: toNumber(getValueAtTime(targetMap, time)),
      price: rateType === "price"
        ? toPriceNumber(getValueAtTime(priceMap, time))
        : rateType === "carbon"
          ? toNumber(getValueAtTime(priceMap, time))
          : null
    }));
  }, [chapterData, rateType]);

  // Custom tooltip for the chart matching design
  const CustomTooltip = ({ active, payload, label }: any) => {
    const act = payload?.find((item: any) => item.dataKey === "actual");
    const target = payload?.find((item: any) => item.dataKey === "target");
    const price = payload?.find((item: any) => item.dataKey === "price");
     
    if (active && payload && payload.length) {
      return (
        <div  className="bg-white p-4 border border-[#E1E5EB] rounded-lg shadow-lg z-50">
          <p className="font-bold text-[#2E3742] mb-3">{date.replace(/\./g, "年").replace("年", "年") + "月" + "日"} {label}</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-[#246FE5]" />
              <span className="text-sm text-[#626C78]">空间实际温度平均值：</span>
              <span className="text-sm font-bold text-[#1B2129]">{formatWithUnit(act?.value ?? null, "℃")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-[#B286F5]" />
              <span className="text-sm text-[#626C78]">空间目标温度平均值：</span>
              <span className="text-sm font-bold text-[#1B2129]">{formatWithUnit(target?.value ?? null, "℃")}</span>
            </div>
            {hasRateLine && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-[#FFD873]" />
                <span className="text-sm text-[#626C78]">{rateLabel}：</span>
                <span className="text-sm font-bold text-[#1B2129]">{formatWithUnit(price?.value ?? null, rateUnitFull)}</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div id={node.id} className="bg-white px-[12px] py-[16px] rounded-lg border border-[#E1E5EB]">
        <div className="flex justify-between items-center mb-[6px]">
          <div className="flex items-center">
            <span className="text-[14px] text-[#1B2129] font-normal font-['Microsoft_YaHei_UI',sans-serif]">{node?.label}</span>
            <ToggleSwitch value={viewMode} onChange={setViewMode} />
          </div>

          {viewMode === "chart" && (
            <div className="flex items-center gap-4 text-xs select-none">
              <div
                className={`flex items-center gap-1.5 cursor-pointer transition-opacity ${visibleSeries.actual ? 'opacity-100' : 'opacity-40'}`}
                onClick={() => toggleSeries('actual')}
              >
                <div className="w-3.5 h-[3px] bg-[#2481F2]" />实际值
              </div>
              <div
                className={`flex items-center gap-1.5 cursor-pointer transition-opacity ${visibleSeries.target ? 'opacity-100' : 'opacity-40'}`}
                onClick={() => toggleSeries('target')}
              >
                <div className="w-3.5 h-[3px] bg-[#B286F5]" />目标值
              </div>
              {hasRateLine && (
                <div
                  className={`flex items-center gap-1.5 cursor-pointer transition-opacity ${visibleSeries.price ? 'opacity-100' : 'opacity-40'}`}
                  onClick={() => toggleSeries('price')}
                >
                  <div className="w-3.5 h-[3px] bg-[#FFD873]" />{rateLabel}
                </div>
              )}
            </div>
          )}
        </div>

        {viewMode === "chart" ? (
          <>
            <div className="flex justify-between text-[12px] text-[#626C78] mb-1 px-1">
              <span className="w-10">℃</span>
              {hasRateLine ? (
                <span className="w-10 text-right">{rateUnitLabel}</span>
              ) : (
                <span className="w-10 text-right" />
              )}
            </div>

            <div className="h-[200px] w-full min-w-0 min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100} debounce={200}>
                <ComposedChart data={chartData} margin={{ left: 0, right: 20, bottom: 0, top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E6E7" />
                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#8D9399', fontSize: 12 }}
                  />
                  <YAxis
                    yAxisId="left"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#646C73', fontSize: 12 }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#646C73', fontSize: 12 }}
                    hide={!hasRateLine}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="actual"
                    stroke="#246FE5"
                    strokeWidth={1.5}
                    dot={false}
                    name="实际值"
                    isAnimationActive={false}
                    hide={!visibleSeries.actual}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="target"
                    stroke="#B286F5"
                    strokeWidth={1.5}
                    dot={false}
                    name="目标值"
                    isAnimationActive={false}
                    hide={!visibleSeries.target}
                  />
                  <Line
                    yAxisId="right"
                    type="stepAfter"
                    dataKey="price"
                    stroke="#FFD873"
                    strokeWidth={1.5}
                    dot={false}
                    name={rateLabel}
                    isAnimationActive={false}
                    hide={!visibleSeries.price || !hasRateLine}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <div className="w-full overflow-x-auto rounded-[4px] border border-[#E1E5EB]">
            <table className="report-table w-full table-fixed">
              <thead>
                <tr className="h-[38px] bg-[#EBF4FE]">
                  <th className={`${hasRateLine ? "w-1/4" : "w-1/3"} !py-[10px] !pl-[16px] !pr-[12px] text-left font-['Microsoft_YaHei_UI',sans-serif] font-normal text-[12px] text-[#626C78] border-b border-[#E1E5EB] border-r truncate`}>时间</th>
                  <th className={`${hasRateLine ? "w-1/4" : "w-1/3"} !py-[10px] !pl-[16px] !pr-[12px] text-left font-['Microsoft_YaHei_UI',sans-serif] font-normal text-[12px] text-[#626C78] border-b border-[#E1E5EB] border-r truncate`}>实际值</th>
                  <th className={`${hasRateLine ? "w-1/4" : "w-1/3"} !py-[10px] !pl-[16px] !pr-[12px] text-left font-['Microsoft_YaHei_UI',sans-serif] font-normal text-[12px] text-[#626C78] border-b border-[#E1E5EB] ${hasRateLine ? "border-r truncate" : "truncate"}`}>目标值</th>
                  {hasRateLine && (
                    <th className="w-1/4 !py-[10px] !pl-[16px] !pr-[12px] text-left font-['Microsoft_YaHei_UI',sans-serif] font-normal text-[12px] text-[#626C78] border-b border-[#E1E5EB] truncate">{rateLabel}</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {chartData.map((row: any, idx: number) => (
                  <tr key={row.time} className="h-[36px] bg-white hover:bg-transparent">
                    <td className="!py-[13px] !pl-[16px] !pr-[12px] text-left font-['Microsoft_YaHei_UI',sans-serif] text-[14px] text-[#1B2129] border-b border-[#E1E5EB] border-r">
                       <MTipsTooltip>{row.time}</MTipsTooltip>
                    </td>
                    <td className="!py-[13px] !pl-[16px] !pr-[12px] text-left font-['Microsoft_YaHei_UI',sans-serif] text-[14px] text-[#1B2129] border-b border-[#E1E5EB] border-r">
                       <MTipsTooltip>{formatWithUnit(row.actual, "℃")}</MTipsTooltip>
                    </td>
                    <td className={`!py-[13px] !pl-[16px] !pr-[12px] text-left font-['Microsoft_YaHei_UI',sans-serif] text-[14px] text-[#1B2129] border-b border-[#E1E5EB] ${hasRateLine ? "border-r" : ""}`}>
                       <MTipsTooltip>{formatWithUnit(row.target, "℃")}</MTipsTooltip>
                    </td>
                    {hasRateLine && (
                      <td className="!py-[13px] !pl-[16px] !pr-[12px] text-left font-['Microsoft_YaHei_UI',sans-serif] text-[14px] text-[#1B2129] border-b border-[#E1E5EB]">
                        <MTipsTooltip>{formatWithUnit(row.price, rateUnitFull)}</MTipsTooltip>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
};

const CoolingAnalysisSection: React.FC<{
  name: string;
  date: string;
  chapterItems?: any;

}> = ({ name, date, chapterItems  }) => {


  return (
    <div>
      <div className="relative inline-block mb-4">
        <h3 className="text-xl font-bold text-[#2E3742] relative z-10">{name}</h3>
        <div className="absolute bottom-0.5 left-0 right-0 h-3 bg-[#0094FF]/20 z-0" />
      </div>

      <div className="space-y-[12px]">
        {chapterItems.map((item: any, index: number) => {
          const content = item.code === "report_chapter_cooling_temp_target"
            ? <TempTargetSection date={date} chapterData={item.chapterData} node={item} />
            : item.code === "report_chapter_cooling_energy"
              ? <CoolingEnergySection date={date} chapterData={item.chapterData} node={item} />
              : null;
          if (!content) return null;
          return (
            <div key={item?.id ?? item?.code ?? index}>
              {content}
            </div>
          );
        })}

      </div>
    </div>
  );
};

export const ACDetailsSection: React.FC<ACDetailsProps> = ({ data, date, children }) => {
  const chapterItems = Array.isArray(data?.children) ? data.children : [];


  return (
    <div className="bg-white/50 backdrop-blur-sm p-4 rounded-[8px] space-y-[12px]">
      <CoolingAnalysisSection date={date} name={data.label} chapterItems={chapterItems}  />
      {children}
    </div>
  );
};
