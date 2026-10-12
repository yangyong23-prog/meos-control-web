import React, { useRef, useState, useEffect } from "react";
import dayjs from "dayjs";
import { Zap, Target, Cloud, ThermometerSun, Wind, Lightbulb, Calendar, TrendingUp } from "lucide-react";
import { PieChart, Pie, Cell } from "recharts";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { TableText as TextTooltip } from "@/app/components/common/TableText";
import { MTipsTooltip } from "@/app/components/common/MTipsTooltip";
import {
  formatTo1Decimal,
  formatMul100To1Decimal,
} from "@/utils/format";
import { VALUE_SELECT_OBJS_SIMPLE } from "@/app/variables";

interface OverviewSectionProps {
  data: any;
  isEditing?: boolean;
  onToggleEdit?: () => void;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({ data, isEditing }) => {
  // Defensive checks for data
  if (!data) return null;
  const { chapterData } = data;
  if (!chapterData) {
    return <div className="space-y-[12px]">

      {/* 2. Operation Overview Title */}
      <div className="flex items-center gap-2  relative z-20">
        <div className="bg-[#246FE5] h-[20px] w-[3px] rounded-full" />
        <h2 className="text-xl font-bold text-[#2E3742]">{data.label}</h2>
      </div>
      <div className="rounded-[8px] border border-white bg-white/50  p-[16px] text-[#86909C] text-[14px]">
        暂未获取到数据
      </div>
    </div>
  }
  // 根据新的数据结构提取所需字段
  const { reportDate, projectElectricity, dayBudgetUtilizationRate, weather, templateName, valueSelectType, spaceEnvironmentalQuality, systemRunningResults } = chapterData;
  // 根据 ChapterData 类型定义正确映射字段
  const overview = {
    budget: dayBudgetUtilizationRate ? {
      rate:   formatMul100To1Decimal(dayBudgetUtilizationRate.dayEnergyConsumptionBudgetRatio) ,
      budget:   formatTo1Decimal(dayBudgetUtilizationRate.dayBudget) ,
      actual: formatTo1Decimal(dayBudgetUtilizationRate.dayRealEnergy) ,
    }: null,
    electricity: projectElectricity? {
      current: formatTo1Decimal(projectElectricity?.projectTotalEnergyConsumption  ),
      trend:   formatMul100To1Decimal(projectElectricity?.chainRatio ) ,
      prev: formatTo1Decimal(projectElectricity?.weekLastSimilarDayAverageEnergyConsumption  ), // 上周相似日平均能耗
    }: null,
    weather: {
      temp: formatTo1Decimal(weather.avgTemperature ),
      humidity: formatTo1Decimal(weather.avgHumidity ),
      status: (() => {
        const day = weather?.dayText ? String(weather.dayText).trim() : '';
        const night = weather?.nightText ? String(weather.nightText).trim() : '';
        if (!day && !night) return '天气未知';
        if (day && night) return day === night ? day : `${day}转${night}`;
        return day || night;
      })(),
      tempRange: weather?.minTemperature && weather?.maxTemperature 
        ? `${formatTo1Decimal(weather.minTemperature)}°C~${formatTo1Decimal(weather.maxTemperature)}°C` 
        : '',
      humidRange: weather?.minHumidity && weather?.maxHumidity 
        ? `${formatTo1Decimal(weather.minHumidity)}%RH~${formatTo1Decimal(weather.maxHumidity)}%RH` 
        : ''
    }
  };
  
  // 从映射的overview对象中提取数据
  const { budget, electricity, weather: weatherData } = overview;
 
    // 过冷
    // TOO_COLD: 'TOO_COLD',
    // 偏冷
    // COLD: 'COLD',
    // 偏热
    // HOT: 'HOT',
    // 过热
    // TOO_HOT: 'TOO_HOT',
    //  偏高
    
  const acResults = {
    tempRate: spaceEnvironmentalQuality?.tdbComplianceRate,
    overCoolRooms: spaceEnvironmentalQuality?.tagCount?.TOO_COLD || 0,
    overHeatRooms: spaceEnvironmentalQuality?.tagCount?.TOO_HOT || 0,
    longCoolRooms: spaceEnvironmentalQuality?.tagCount?.COLD || 0,
    longHeatRooms: spaceEnvironmentalQuality?.tagCount?.HOT || 0,
    standard: templateName || '--',
    strategy: VALUE_SELECT_OBJS_SIMPLE[valueSelectType ]?.title || '--'
  };
  
  // 提取通风和照明数据（如果存在）
  const ventilation: any[] = [];
  const lighting: any[] = [];

  const rawRate = budget?.rate;
  const isRateMissing = rawRate === "--" || rawRate === null || rawRate === undefined || rawRate === "";
  const rateValue: number | null = isRateMissing ? null : Number(rawRate || 0);
  const isOverBudget = !isRateMissing && (rateValue || 0) > 100;
  const trendValue: number | null = electricity?.trend === "--" ? null : Number(electricity?.trend || 0);

  const isEmpty = val => val === null || val === undefined || val === '';
  const pieData = isRateMissing
    ? [
        { name: "used", value: 0 },
        { name: "remaining", value: 100 }
      ]
    : [
        { name: "used", value: isOverBudget ? 100 : rateValue || 0 },
        { name: "remaining", value: isOverBudget ? 0 : 100 - (rateValue || 0) }
      ];

  const COLORS = isRateMissing
    ? ["#C4C9CF", "#C4C9CF"]
    : [isOverBudget ? "#F53F3F" : "#246FE5", "#C4C9CF"];

  const formatLabel = (label: string) => {
    if (label.includes("O2")) {
      return (
        <span>O<span className="text-[9px] align-sub">2</span>浓度异常</span>
      );
    }
    if (label.includes("NH3")) {
      return (
        <span>NH<span className="text-[9px] align-sub">3</span>异常空间</span>
      );
    }
    if (label.includes("H2S")) {
      return (
        <span>H<span className="text-[9px] align-sub">2</span>S浓度异常</span>
      );
    }
    return label;
  };

  // 使用实际的系统运行结果数据
  const coolingPlants = systemRunningResults?.map(system => ({
    name: system.localName || "未知系统",
    runtime: (() => {
      const arr = system.systemRunningTimes as string[] | undefined;
      if (!arr || !arr.length) return "当日未运行";
      const formatted = arr.map((item) => {
        if (typeof item !== "string") return "";
        const [startStr, endStr] = item.split(",").map(s => s?.trim());
        if (!startStr || !endStr) return "";
        const [startDate, startTimeFull] = startStr.split(" ");
        const [endDate, endTimeFull] = endStr.split(" ");
        const startHHmm = (startTimeFull || "").slice(0, 5);
        let endHHmm = (endTimeFull || "").slice(0, 5);
        const validStart = dayjs(startDate).isValid();
        const validEnd = dayjs(endDate).isValid();
        const isNextDay = validStart && validEnd && dayjs(startDate).add(1, "day").format("YYYY-MM-DD") === endDate;
        if (isNextDay && (endTimeFull || "").startsWith("00:00")) endHHmm = "24:00";
        if (!startHHmm || !endHHmm) return "";
        return `${startHHmm}-${endHHmm}`;
      }).filter(Boolean);
      return formatted.length ? formatted.join("、") : "当日未运行";
    })(),
    rate:  system?.serviceSpaceSatisfyPercentage ,
    consumption:   formatTo1Decimal(system?.dayAccElecConsum),
    trend: formatMul100To1Decimal(system?.accElecConsumMom)
  })) || [];

  return (
    <div className="space-y-[12px]">
      

      {/* 2. Operation Overview Title */}
      <div className="flex items-center gap-2  relative z-20">
        <div className="bg-[#246FE5] h-[20px] w-[3px] rounded-full" />
        <h2 className="text-xl font-bold text-[#2E3742]">{data.label}</h2>
      </div>

      {/* 3. Top Three Summary Cards */}
      <div className="flex flex-wrap gap-[12px]">
        {/* Card 1: Project Electricity */}
        {electricity && <div className="flex-1 min-w-[300px] bg-white/50 backdrop-blur-sm p-[12px] rounded-[4px] flex flex-col gap-[8px]">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-[4px] min-w-0 flex-1">
              <div className="flex items-center gap-[4px] text-[#1B2129]">
                <Zap size={16} className="text-[#2E3742] shrink-0" />
                <MTipsTooltip 
                  text="项目用电量" 
                  className="text-[14px] font-['Microsoft_YaHei_UI',sans-serif] leading-[22px]" 
                  wrapperClassName="flex-1 min-w-0"
                />
              </div>
              <div className="flex items-end gap-[4px] text-[#2E3742] min-w-0">
                <MTipsTooltip 
                  text={(electricity.current || 0).toLocaleString()} 
                  content={`${(electricity.current || 0).toLocaleString()} kWh`}
                  className="text-[24px] font-bold font-['Persagy2.0:Bold',sans-serif] leading-[28px]" 
                  wrapperClassName="min-w-0 shrink"
                />
                <span className="text-[14px] font-['Microsoft_YaHei_UI',sans-serif] mb-[3px] shrink-0">kWh</span>
              </div>
            </div>
            
            <div className="flex flex-col items-center shrink-0 ml-2">
              <div className="h-[14px] w-[35px] relative">
                {trendValue === null || trendValue === 0 ? (
                  <span className="text-[#626C78] text-[14px] font-bold"></span>
                ) : (
                  <div className="flex flex-col items-center">
                    <svg width="35" height="14" viewBox="0 0 35 14" fill="none">
                      <path 
                        d={trendValue > 0 ? "M2 12 Q 10 2, 18 8 T 33 2" : "M2 2 Q 10 12, 18 6 T 33 12"} 
                        stroke={trendValue > 0 ? "#F55047" : "#00B42A"} 
                        strokeWidth="2" 
                        fill="none"
                      />
                    </svg>
                    <span className={`text-[12px] font-bold font-['Persagy2.0:Bold',sans-serif] ${trendValue > 0 ? 'text-[#F55047]' : 'text-[#00B42A]'}`}>
                      {trendValue > 0 ? '+' : '-'}{Math.abs(trendValue)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-[8px] text-[14px] text-[#626C78] min-w-0">
            <MTipsTooltip 
               text={`上周相似日平均能耗 ${electricity.prev}kWh`}
               className="font-['Microsoft_YaHei_UI',sans-serif] leading-[22px]"
               wrapperClassName="min-w-0"
            />
            <div className="w-[1.2px] h-[12px] bg-[#CED9E4] shrink-0" />
            <MTipsTooltip 
               text={
                 trendValue === null
                   ? "环比--"
                   : trendValue === 0
                    ? "环比与上周相似日持平"
                     : `环比${trendValue > 0 ? "增长" : "下降"}${Math.abs(trendValue)}%`
               }
               className="font-['Microsoft_YaHei_UI',sans-serif] leading-[22px]"
               wrapperClassName="shrink-0"
            />
          </div>
        </div>}

        {/* Card 2: Daily Budget Usage Rate */}
        {budget&&<div className="flex-1 min-w-[300px] bg-white/50 backdrop-blur-sm p-[12px] rounded-[4px] flex flex-col gap-[8px]">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-[4px] min-w-0 flex-1">
              <div className="flex items-center gap-[4px] text-[#1B2129]">
                <Target size={16} className="text-[#2E3742] shrink-0" />
                <MTipsTooltip 
                  text="当日预算使用率"
                  className="text-[14px] font-['Microsoft_YaHei_UI',sans-serif] leading-[22px]"
                  wrapperClassName="flex-1 min-w-0"
                />
              </div>
              <div className="flex items-end gap-[4px] text-[#2E3742] min-w-0">
                <MTipsTooltip 
                  text={isRateMissing ? "--" : (rateValue || 0).toFixed(1)}
                  content={isRateMissing ? "--" : `${(rateValue || 0).toFixed(1)}%`}
                  className="text-[24px] font-bold font-['Persagy2.0:Bold',sans-serif] leading-[28px]"
                  wrapperClassName="min-w-0 shrink"
                />
                <span className="text-[14px] font-['Microsoft_YaHei_UI',sans-serif] mb-[3px] shrink-0">%</span>
              </div>
            </div>
            
            <div className="w-[52px] h-[52px] relative shrink-0">
               <PieChart width={52} height={52}>
                 <Pie
                   data={pieData}
                   cx="50%"
                   cy="50%"
                   innerRadius={18}
                   outerRadius={26}
                   paddingAngle={0}
                   dataKey="value"
                   startAngle={90}
                   endAngle={-270}
                   isAnimationActive={false}
                   stroke="none"
                 >
                   {pieData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                 </Pie>
               </PieChart>
            </div>
          </div>
          
          <div className="flex items-center gap-[8px] text-[14px] text-[#626C78] min-w-0">
            <MTipsTooltip 
               text={`预算值 ${budget.budget}kWh`}
               className="font-['Microsoft_YaHei_UI',sans-serif] leading-[22px]"
               wrapperClassName="min-w-0"
            />
            <div className="w-[1.2px] h-[12px] bg-[#CED9E4] shrink-0" />
            <MTipsTooltip 
               text={`实际值 ${budget.actual}kWh`}
               className="font-['Microsoft_YaHei_UI',sans-serif] leading-[22px]"
               wrapperClassName="shrink-0"
            />
          </div>
        </div>}

        {/* Card 3: Weather Data */}
        <div className="flex-1 min-w-[300px] bg-white/50 backdrop-blur-sm p-[12px] rounded-[4px] flex flex-col gap-[8px]">
          <div className="flex flex-col gap-[4px]">
            <div className="flex items-center gap-[4px] text-[#1B2129]">
              <Cloud size={16} className="text-[#2E3742] shrink-0" />
              <MTipsTooltip 
                 text="本日气象数据"
                 className="text-[14px] font-['Microsoft_YaHei_UI',sans-serif] leading-[22px]"
                 wrapperClassName="flex-1 min-w-0"
              />
            </div>
            <div className="flex items-center gap-[6px] min-w-0 flex-wrap">
              <div className="flex items-end gap-[2px] text-[#2E3742] shrink-0">
                <MTipsTooltip 
                  text={weatherData.temp || "--"}
                  content={`温度 ${weatherData.temp || "--"}℃`}
                  className="text-[24px] font-bold font-['Persagy2.0:Bold',sans-serif] leading-[28px]"
                  wrapperClassName="shrink-0"
                />
                <span className="text-[14px] font-['Microsoft_YaHei_UI',sans-serif] mb-[3px] shrink-0">℃</span>
              </div>
              <div className="h-[20px] w-px bg-[#DADADA] shrink-0" />
              <div className="flex items-end gap-[2px] text-[#2E3742] shrink-0">
                <MTipsTooltip 
                  text={weatherData.humidity || "--"}
                  content={`湿度 ${weatherData.humidity || "--"}%RH`}
                  className="text-[24px] font-bold font-['Persagy2.0:Bold',sans-serif] leading-[28px]"
                  wrapperClassName="shrink-0"
                />
                <span className="text-[14px] font-['Microsoft_YaHei_UI',sans-serif] mb-[3px] shrink-0">%RH</span>
              </div>
              <div className="h-[20px] w-px bg-[#DADADA] shrink-0" />
              <MTipsTooltip 
                text={weatherData.status || "--"}
                content={`天气 ${weatherData.status || "--"}`}
                className="text-[22px] font-bold text-[#2E3742] leading-none font-['Microsoft_YaHei_UI',sans-serif] truncate"
                wrapperClassName="min-w-0 flex-1"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-[8px] text-[14px] text-[#626C78] min-w-0">
            <MTipsTooltip 
               text={`温度区间 ${weatherData.tempRange || "--"}`}
               className="font-['Microsoft_YaHei_UI',sans-serif] leading-[22px]"
               wrapperClassName="min-w-0"
            />
            <div className="w-[1.2px] h-[12px] bg-[#CED9E4] shrink-0" />
            <MTipsTooltip 
               text={`湿度区间 ${weatherData.humidRange || "--"}`}
               className="font-['Microsoft_YaHei_UI',sans-serif] leading-[22px]"
               wrapperClassName="shrink-0"
            />
          </div>
        </div>
      </div>

      {/* 4. AC Running Results */}
      <div className="bg-white/50 backdrop-blur-sm p-[12px] rounded-[4px] flex flex-col gap-[8px]">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2">
             <div className="relative shrink-0 w-4 h-4 text-[#333333]">
                <ThermometerSun size={16} />
             </div>
             <span className="text-[14px] text-[#1b2129] font-['Microsoft_YaHei_UI',sans-serif] leading-[22px]">空调运行结果</span>
          </div>
          <div className="flex items-center gap-2">
             <div className="bg-[#e8ecf0] px-[4px] rounded-[2px] flex items-center justify-center h-[20px] max-w-[200px]">
               <TextTooltip 
                 text={`运行标准：${acResults.standard || "工作日"}`}
                 className="text-[12px] text-[#1b2129] font-['Microsoft_YaHei_UI',sans-serif] leading-[20px]"
                 maxLines={1}
               />
             </div>
             <div className="bg-[#e8ecf0] px-[4px] rounded-[2px] flex items-center justify-center h-[20px] max-w-[200px]">
               <TextTooltip 
                 text={`价值选择：${acResults.strategy || "费用最低"}`}
                 className="text-[12px] text-[#1b2129] font-['Microsoft_YaHei_UI',sans-serif] leading-[20px]"
                 maxLines={1}
               />
             </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-[12px] items-stretch">
          {/* Left Side: Environment Quality */}
          {!!spaceEnvironmentalQuality && (
            <div className="flex-none flex flex-col gap-[8px]">
              <p className="text-[14px] text-[#626c78] font-['Microsoft_YaHei_UI',sans-serif] leading-[22px]">空间环境品质</p>
              <div className="flex flex-wrap gap-[12px] h-full content-start">
                {[
                  { label: "温度达标率", value: isEmpty(acResults.tempRate) ? "--" : acResults.tempRate, unit: "%", alwaysShow: true },
                  { label: "过冷空间", value: acResults.overCoolRooms || 0, unit: "个" },
                  { label: "持续偏冷空间", value: acResults.longCoolRooms || 0, unit: "个" },
                  { label: "持续偏热空间", value: acResults.longHeatRooms || 0, unit: "个" },
                  { label: "过热空间", value: acResults.overHeatRooms || 0, unit: "个" },
                ].filter(item => item.alwaysShow || (item.value !== 0 && item.value !== "0" && item.value !== "0个")).map((item) => (
                  <div key={item.label} className="w-[104px] min-h-[80px] h-full flex flex-col items-center justify-center p-[8px] bg-[#EBF4FE] rounded-[4px] gap-[8px] shrink-0">
                    <div className="flex items-end gap-[2px] text-[#2e3742] leading-none">
                      <span className="text-[20px] font-bold font-['Persagy2.0:Bold',sans-serif]">{item.value}</span>
                      <span className="text-[12px] font-['Microsoft_YaHei_UI',sans-serif] mb-[2px]">{item.unit}</span>
                    </div>
                    <TextTooltip 
                      text={item.label} 
                      className="text-[12px] text-[#626c78] text-center leading-[18px] font-['Microsoft_YaHei_UI',sans-serif] w-full"
                      maxLines={2}
                      wrapperClassName="w-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Right Side: Cooling Station Results */}
          {coolingPlants?.length > 0 && (
            <div className="flex-1 flex flex-col gap-[8px] min-w-0">
            <p className="text-[14px] text-[#626c78] font-['Microsoft_YaHei_UI',sans-serif] leading-[22px]">冷站运行结果</p>
            <div className="flex flex-wrap gap-[12px] h-full content-start">
              {coolingPlants.map((plant, idx) => (
                <div key={idx} className="bg-[#EBF4FE] p-[12px] rounded-[4px] flex flex-col gap-[8px] flex-1 min-w-[274px]">
                  <div className="text-[14px] font-bold text-[#2e3742] font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[22px]">
                    <TextTooltip text={plant.name} maxLines={2} />
                  </div>
                  <div className="flex flex-col gap-[4px]">
                    {/* System Runtime */}
                    <div className="flex justify-between items-start text-[14px]">
                      <TextTooltip 
                        text="系统运行时间" 
                        className="text-[#626c78] font-['Microsoft_YaHei_UI',sans-serif] leading-[22px]"
                        wrapperClassName="max-w-[100px] shrink-0"
                        maxLines={2}
                      />
                      <span className="text-[#626c78] font-['Microsoft_YaHei_UI',sans-serif] leading-[22px] break-words text-right flex-1 ml-[8px]">
                        {plant.runtime}
                      </span>
                    </div>
                    
                    {/* Service Space Compliance Rate */}
                    <div className="flex justify-between items-start text-[14px]">
                      <TextTooltip 
                        text="服务空间达标率" 
                        className="text-[#626c78] font-['Microsoft_YaHei_UI',sans-serif] leading-[22px]"
                        wrapperClassName="max-w-[100px] shrink-0"
                        maxLines={2}
                      />
                      <span className="text-[#2E3742] font-bold font-['Microsoft_YaHei_UI',sans-serif] leading-[22px] break-words text-right flex-1 ml-[8px]">
                        {plant.rate === '--' || isEmpty(plant.rate) ?'无法监测空间温度':`${plant.rate}%`}
                      </span>
                    </div>

                    {/* Power Consumption */}
                    <div className="flex justify-between items-start text-[14px]">
                      <TextTooltip 
                        text="耗电量" 
                        className="text-[#626c78] font-['Microsoft_YaHei_UI',sans-serif] leading-[22px]"
                        wrapperClassName="max-w-[100px] shrink-0"
                        maxLines={2}
                      />
                      <div className="flex flex-wrap items-center justify-end gap-[4px] leading-[22px] flex-1 ml-[8px]">
                        <span className="text-[#1B2129] font-medium font-['Microsoft_YaHei_UI',sans-serif]">{plant.consumption}kWh</span>
                        <div className="w-px h-[10px] bg-[#d9d9d9] shrink-0"></div>
                        {plant.trend === "--" ? (
                          <span className="text-[#626c78] font-['Microsoft_YaHei_UI',sans-serif]">环比--</span>
                        ) : plant.trend === 0 ? (
                            <span className="text-[#626c78] font-['Microsoft_YaHei_UI',sans-serif]">环比与上周相似日持平</span>
                        ) : (
                           <span className="text-[#626c78] font-['Microsoft_YaHei_UI',sans-serif] flex items-center flex-wrap justify-end">
                             <span>环比</span>
                             <span className={`font-bold ml-1 ${(plant.trend || 0) > 0 ? 'text-[#F55047]' : 'text-[#00B42A]'}`}>
                               {(plant.trend || 0) > 0 ? '增长' : '下降'}{Math.abs(plant.trend || 0)}%
                             </span>
                           </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>)}
        </div>
      </div>

      {/* 5. Ventilation Running Results */}
      {ventilation?.length > 0 && (
        <div className="bg-white/50 backdrop-blur-sm p-[12px] rounded-[4px] flex flex-col gap-[8px]">
        <div className="flex items-center gap-2">
          <div className="relative shrink-0 w-4 h-4 text-[#333333]">
             <Wind size={16} />
          </div>
          <span className="text-[14px] text-[#1b2129] font-['Microsoft_YaHei_UI',sans-serif] leading-[22px]">通风运行结果</span>
        </div>
        <div className="flex flex-wrap gap-[12px]">
          {ventilation?.map((item: any) => (
            <div key={item.name} className="bg-[#EBF4FE] p-[12px] rounded-[4px] flex flex-col gap-[8px] flex-1 min-w-[240px] basis-[calc(25%-12px)]">
              <div className="flex flex-col gap-[4px]">
                <h3 className="font-bold text-[#2E3742] text-[14px] font-['Microsoft_YaHei_UI',sans-serif] w-full">
                  <TextTooltip text={item.name} maxLines={2} />
                </h3>
                <div className="bg-[#E8ECF0] px-[4px] rounded-[2px] inline-block w-max max-w-full">
                  <TextTooltip 
                    text={item.standard || "共x个空间执行工作日标准"}
                    className="text-[#1B2129] text-[12px] font-['Microsoft_YaHei_UI',sans-serif] block"
                    maxLines={1}
                  />
                </div>
              </div>
              {item.stats && item.stats.length > 0 ? (
                <div className="flex flex-col gap-[4px]">
                  {item.stats?.filter((stat: any) => {
                    const val = String(stat.value).trim();
                    return val !== "0" && val !== "0个" && val !== "0次";
                  }).map((stat: any, i: number) => (
                    <div key={stat.label || i} className="flex justify-between items-start text-[14px]">
                      <TextTooltip 
                        text={formatLabel(stat.label)}
                        content={stat.label}
                        className="text-[#626c78] font-['Microsoft_YaHei_UI',sans-serif] leading-[22px]"
                        wrapperClassName="max-w-[100px] shrink-0"
                        maxLines={2}
                      />
                      <span className="text-[#2E3742] font-['Microsoft_YaHei_UI',sans-serif] leading-[22px] break-words text-right flex-1 ml-[8px]">
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-[#626C78] text-[12px] font-medium font-['Microsoft_YaHei_UI',sans-serif]">
                  未配置运行标准
                </div>
              )}
            </div>
          ))}
        </div>
      </div>)}

      {/* 6. Lighting Running Results */}
      {lighting?.length > 0 && (
        <div className="bg-white/50 backdrop-blur-sm p-[12px] rounded-[4px] flex flex-col gap-[8px]">
        <div className="flex items-center gap-2">
          <div className="relative shrink-0 w-4 h-4 text-[#333333]">
             <Lightbulb size={16} />
          </div>
          <span className="text-[14px] text-[#1b2129] font-['Microsoft_YaHei_UI',sans-serif] leading-[22px]">照明运行结果</span>
        </div>
        <div className="flex flex-wrap gap-[12px]">
          {lighting?.map((item: any) => (
            <div key={item.name} className="bg-[#EBF4FE] p-[12px] rounded-[4px] flex flex-col justify-between min-h-[120px] flex-1 min-w-[280px] basis-[calc(33.333%-12px)]">
              <div className="flex flex-col gap-[4px] mb-[12px]">
                <h3 className="font-bold text-[#2E3742] text-[14px] font-['Microsoft_YaHei_UI',sans-serif] w-full">
                  <TextTooltip text={item.name} maxLines={2} />
                </h3>
                <div className="bg-[#E8ECF0] px-[4px] rounded-[2px] inline-block w-max max-w-full">
                  <TextTooltip 
                    text={item.fullDescription ? item.fullDescription : `共${item.circuitCount || 100}条回路执行工作日标准`}
                    className="text-[#1B2129] text-[12px] font-['Microsoft_YaHei_UI',sans-serif] block"
                    maxLines={1}
                  />
                </div>
              </div>
              
              {(() => {
                const manualStat = item.stats?.find((s: any) => s.label === "人工控制次数" || s.label === "人工干预次数");
                // 仅当人工控制次数明确为 0 或 0次时，且没有手动配置状态覆盖时，显示绿色提示
                const isManualZero = manualStat && (String(manualStat.value).trim() === "0次" || manualStat.value === 0 || manualStat.value === "0");
                const displayStatus = item.statusMessage || (isManualZero ? "全按照明需求自动运行，未进行人工控制" : null);

                if (displayStatus) {
                  return (
                    <div className="flex-1 flex items-center justify-center">
                      <p className="text-[14px] text-[#0C9B4A] text-center font-['Microsoft_YaHei_UI',sans-serif]">
                        {displayStatus === "全按照明需求自动运行" ? "全按照明需求自动运行，未进行人工控制" : displayStatus}
                      </p>
                    </div>
                  );
                }
                return (
                  <div className="flex flex-col gap-[4px]">
                    {item.stats?.map((stat: any, i: number) => (
                      <div key={stat.label || i} className="flex justify-between items-start text-[14px]">
                        <TextTooltip 
                          text={stat.label} 
                          className="text-[#626C78] font-['Microsoft_YaHei_UI',sans-serif] leading-[22px]"
                          wrapperClassName="max-w-[120px] shrink-0"
                          maxLines={2}
                        />
                        <span className="text-[#626C78] font-['Microsoft_YaHei_UI',sans-serif] leading-[22px] break-words text-right flex-1 ml-[8px]">
                          {String(stat.value).replace(/（/g, '(').replace(/）/g, ')')}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          ))}
        </div>
      </div>)}
    </div>
  );
};
