import React from "react";
import { TableText } from "@/app/components/common/TableText";
import { formatTo1Decimal, formatMul100To1Decimal } from "@/utils/format";
import dayjs from "dayjs";
interface EnergyAnalysisProps {
  data: any;
  reportDate: string;
  children?: React.ReactNode;
}

// 扁平化树形结构的辅助函数
const flattenTree = (nodes: any[], level = 0, parentName = ""): any[] => {
  let result: any[] = [];
  nodes.forEach(node => {
    const flattenedNode = {
      name: node.itemName,
      today: formatTo1Decimal(node.dayEnergyConsumption),
      ratio: formatMul100To1Decimal(node.dayEnergyConsumptionProjectRatio),
      lastYear: formatTo1Decimal(node.weekLastSimilarDayAverageEnergyConsumption),
      trend: formatMul100To1Decimal(node.chainRatio), // 需要根据实际数据计算环比
      monthly: formatTo1Decimal(node.monthCumulativeEnergyConsumption),
      level: level,
      hasChildren: node.children && node.children.length > 0,
      parentName: parentName
    };
    
    result.push(flattenedNode);
    
    // 递归处理子节点
    if (node.children && node.children.length > 0) {
      result = result.concat(flattenTree(node.children, level + 1, node.itemName));
    }
  });
  
  return result;
};

export const EnergyAnalysisSection: React.FC<EnergyAnalysisProps> = ({ data, reportDate,  children }) => {
   

  const { label ,chapterData} = data;
 
  if (!chapterData) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="bg-[#246FE5] h-[20px] w-[3px] rounded-full" />
          <h2 className="text-xl font-bold text-[#2E3742]">{ label}</h2>
        </div>
        <div className="rounded-[8px] border border-white bg-white/50  p-[16px] text-[#86909C] text-[14px]">
          暂未获取到数据
        </div>
        {children}
      </div>
    );
  }

  const parsedShortDate = dayjs(reportDate);
  const shortDate = parsedShortDate.isValid()
    ? parsedShortDate.format("MM.DD")
    : reportDate.replace(/^\d{4}[-.]/, "");
  // runOverviewEnergyAnalysisDto
  const totalCurrent = chapterData.energyConsumptionOverview?.projectTotalEnergyConsumption;
  const totalMonthly = chapterData.energyConsumptionOverview?.projectMonthTotalEnergyConsumption;
  // 扁平化树形结构数据
  const flattenedData = flattenTree(chapterData.trees);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="bg-[#246FE5] h-[20px] w-[3px] rounded-full" />
        <h2 className="text-xl font-bold text-[#2E3742]">{ label}</h2>
      </div>

      <div className="bg-white/50 backdrop-blur-sm p-4 rounded-[8px] space-y-3">
        <div className="text-[#626C78] text-[14px]">
        本日（{shortDate}）项目总用电：<span className="font-bold text-[#1B2129]">{totalCurrent !== undefined && totalCurrent !== null ? `${formatTo1Decimal(totalCurrent).toLocaleString()}kWh` : "未配置运行标准"}</span>；
          截止{shortDate}当月总用电量：<span className="font-bold text-[#1B2129]">{totalMonthly !== undefined && totalMonthly !== null ? `${formatTo1Decimal(totalMonthly).toLocaleString()}kWh` : "未配置运行标准"}</span>，各分项用电量如下：
        </div>
        
        <div className="bg-white rounded-none border border-[#E1E5EB] overflow-hidden">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="bg-[#EBF4FE] border-b border-[#E1E5EB]">
                <th className="px-4 py-2.5 text-[12px] font-normal text-[#626C78] border-r border-[#E1E5EB] w-[20%]">分项名称</th>
                <th className="px-4 py-2.5 text-[12px] font-normal text-[#626C78] border-r border-[#E1E5EB] w-[16%]">日能耗（{shortDate}）</th>
                <th className="px-4 py-2.5 text-[12px] font-normal text-[#626C78] border-r border-[#E1E5EB] w-[16%]">日能耗占项目用电比</th>
                <th className="px-4 py-2.5 text-[12px] font-normal text-[#626C78] border-r border-[#E1E5EB] w-[16%]">上周相似日平均能耗</th>
                <th className="px-4 py-2.5 text-[12px] font-normal text-[#626C78] border-r border-[#E1E5EB] w-[16%]">环比</th>
                <th className="px-4 py-2.5 text-[12px] font-normal text-[#626C78] w-[16%]">月累计能耗（截止{shortDate}）</th>
              </tr>
            </thead>
            <tbody>
              {flattenedData.map((row, index) => (
                <tr key={`${row.name}-${index}`} className="border-b border-[#E1E5EB] last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="!px-4 !py-3.5 text-[14px] text-[#1B2129] border-r border-[#E1E5EB]">
                    <div className="flex items-center">
                      <div 
                        className={`min-w-[20px]  font-normal`}
                        style={{ marginLeft: `${row.level * 20}px` }}
                      >
                        <TableText text={row.name} />
                      </div>
                    </div>
                  </td>
                  <td className="!px-4 !py-3.5 text-[14px] text-[#1B2129] tabular-nums border-r border-[#E1E5EB]">
                    <TableText text={`${row.today.toLocaleString()} kWh`} />
                  </td>
                  <td className="!px-4 !py-3.5 text-[14px] text-[#1B2129] tabular-nums border-r border-[#E1E5EB]">
                    <TableText text={`${row.ratio }%`} />
                  </td>
                  <td className="!px-4 !py-3.5 text-[14px] text-[#1B2129] tabular-nums border-r border-[#E1E5EB]">
                    <TableText text={`${row.lastYear.toLocaleString()} kWh`} />
                  </td>
                  <td className="!px-4 !py-3.5 text-[14px] border-r border-[#E1E5EB]">
                    {row.trend === "--" ? (
                      <span className="text-[#626C78]">--</span>
                    ) : row.trend === 0 ? (
                      <span className="text-[#626C78]">与上周相似日持平</span>
                    ) : (
                      <div className={`${row.trend > 0 ? 'text-[#F53F3F] font-bold' : 'text-[#00A2A7] font-medium'}`}>
                        <TableText text={`${row.trend > 0 ? '增长' : '下降'} ${Math.abs(row.trend) }%`} />
                      </div>
                    )}
                  </td>
                  <td className="!px-4 !py-3.5 text-[14px] text-[#1B2129] tabular-nums">
                    <TableText text={`${row.monthly.toLocaleString()} kWh`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {children}
      </div>
    </div>
  );
};
