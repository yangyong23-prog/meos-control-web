import React from "react";
import { TableText } from "@/app/components/common/TableText";
import { formatTo1Decimal, formatMul100To1Decimal } from "@/utils/format";
import dayjs from 'dayjs';
interface EnergyBudgetProps {
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
      budget: formatTo1Decimal(node.dayBudget),
      actual: formatTo1Decimal(node.dayRealEnergy),
      diff: formatTo1Decimal(node.dayRealEnergyDifference),
      ratio: formatMul100To1Decimal(node.dayEnergyConsumptionBudgetRatio),
       
      monthlyActual: formatTo1Decimal(node.monthCumulativeRealEnergyConsumption),
      monthlyBudget: formatTo1Decimal(node.monthTotalBudget),
      monthlyRatio: formatMul100To1Decimal(node.monthTotalBudgetRatio),
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

export const EnergyBudgetSection: React.FC<EnergyBudgetProps> = ({ data, reportDate,   children }) => {
  console.log('EnergyBudgetSection-data: ', data);
  const {chapterData} = data;
  if (!chapterData) {
    return <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="bg-[#246FE5] h-[20px] w-[3px] rounded-full" />
        <h2 className="text-xl font-bold text-[#2E3742]">{data.label}</h2>
      </div>
      <div className="rounded-[8px] border border-white bg-white/50 p-[16px] text-[#86909C] text-[14px]">
        暂未获取到数据
      </div>
      {children}
    </div>
  }
  const { energyBudgetOverview, runOverviewEnergyBudgetDto ,trees} = chapterData;
  const summaryData =  {
    budget: formatTo1Decimal(energyBudgetOverview.dayBudget),
    actual: formatTo1Decimal(energyBudgetOverview.dayRealEnergy),
    rate: formatMul100To1Decimal(energyBudgetOverview.dayEnergyConsumptionBudgetRatio),
    monthlyBudget: formatTo1Decimal(energyBudgetOverview.monthCumulativeTotalBudget),
    monthlyActual: formatTo1Decimal(energyBudgetOverview.monthCumulativeRealEnergyConsumption),
    monthlyRate: formatMul100To1Decimal(energyBudgetOverview.monthCumulativeTotalBudgetRatio),
    monthlyBudgetUsedRate: formatMul100To1Decimal(energyBudgetOverview.monthTotalBudgetRatio),
    totalMonthBudget: formatTo1Decimal(energyBudgetOverview.monthTotalBudget)
  };
  const parsedShortDate = dayjs(reportDate);
  const shortDate = parsedShortDate.isValid()
    ? parsedShortDate.format("MM.DD")
    : reportDate.replace(/^\d{4}[-.]/, "");
  const monthName = parsedShortDate.format("MM") + "月";

  const tableData = flattenTree(trees);
  // console.log('tableData: ', tableData);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="bg-[#246FE5] h-[20px] w-[3px] rounded-full" />
        <h2 className="text-xl font-bold text-[#2E3742]">{data.label}</h2>
      </div>

      <div className="bg-white/50 backdrop-blur-sm p-4 rounded-[8px] space-y-4">
        <div className="text-[#626C78] text-[14px] space-y-1">
          <p>
            本日（{shortDate}）：预算为 <span className="font-bold text-[#1B2129]">{summaryData.budget !== undefined ? `${summaryData.budget.toLocaleString()}kWh` : "--"}</span>，
            实际能耗为 <span className="font-bold text-[#1B2129]">{summaryData.actual !== undefined ? `${summaryData.actual.toLocaleString()}kWh` : "--"}</span>，
            实际能耗占预算比为 <span className="font-bold text-[#1B2129]">{summaryData.rate !== undefined ? `${summaryData.rate}%` : "--"}</span>
          </p>
          <p>
            截止{shortDate}：累计预算为 <span className="font-bold text-[#1B2129]">{summaryData.monthlyBudget !== undefined ? `${summaryData.monthlyBudget.toLocaleString()}kWh` : "--"}</span>，
            累计实际能耗为 <span className="font-bold text-[#1B2129]">{summaryData.monthlyActual !== undefined ? `${summaryData.monthlyActual.toLocaleString()}kWh` : "--"}</span>，
            实际能耗占预算比为 <span className="font-bold text-[#1B2129]">{summaryData.monthlyRate !== undefined ? `${summaryData.monthlyRate}%` : "--"}</span>
          </p>
          <p>
            {monthName}：总预算为 <span className="font-bold text-[#1B2129]">{summaryData.totalMonthBudget !== undefined ? `${summaryData.totalMonthBudget.toLocaleString()}kWh` : "--"}</span>，
            截止本日已用当月预算的 <span className="font-bold text-[#1B2129]">{summaryData.monthlyBudgetUsedRate !== undefined ? `${summaryData.monthlyBudgetUsedRate}%` : "--"}</span>，各预算分项使用情况如下：
          </p>
        </div>

        <div className="bg-white rounded-none border border-[#E1E5EB] overflow-hidden">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="bg-[#EBF4FE] border-b border-[#E1E5EB]">
                <th className="px-4 py-2.5 text-[12px] font-normal text-[#626C78] border-r border-[#E1E5EB] w-[18%]">分项名称</th>
                <th className="px-4 py-2.5 text-[12px] font-normal text-[#626C78] border-r border-[#E1E5EB] w-[11.7%]">本日预算({shortDate})</th>
                <th className="px-4 py-2.5 text-[12px] font-normal text-[#626C78] border-r border-[#E1E5EB] w-[11.7%]">日实际能耗({shortDate})</th>
                <th className="px-4 py-2.5 text-[12px] font-normal text-[#626C78] border-r border-[#E1E5EB] w-[11.7%]">日实际能耗与预算差值</th>
                <th className="px-4 py-2.5 text-[12px] font-normal text-[#626C78] border-r border-[#E1E5EB] w-[11.7%]">日能耗占比预算比</th>
                <th className="px-4 py-2.5 text-[12px] font-normal text-[#626C78] border-r border-[#E1E5EB] w-[11.7%]">月累计能耗(截止{shortDate})</th>
                <th className="px-4 py-2.5 text-[12px] font-normal text-[#626C78] border-r border-[#E1E5EB] w-[11.7%]">月总预算({monthName})</th>
                <th className="px-4 py-2.5 text-[12px] font-normal text-[#626C78] w-[11.7%]">已用月预算比例(截止{shortDate})</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row) => (
                <tr key={row.name} className="border-b border-[#E1E5EB] last:border-0 hover:bg-gray-50 transition-colors">
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
                  <td className="!px-4 !py-3.5 text-[14px] text-[#626C78] tabular-nums border-r border-[#E1E5EB]">
                    <TableText text={`${row.budget.toLocaleString()} kWh`} />
                  </td>
                  <td className="!px-4 !py-3.5 text-[14px] text-[#1B2129] tabular-nums border-r border-[#E1E5EB]">
                    <TableText text={`${row.actual.toLocaleString()} kWh`} />
                  </td>
                  <td className="!px-4 !py-3.5 text-[14px] tabular-nums border-r border-[#E1E5EB]">
                    <TableText 
                      className={row.diff > 0 ? 'text-[#F53F3F] font-bold' : 'text-[#1B2129]'} 
                      text={`${row.diff > 0 ? '+' : ''}${row.diff} kWh`} 
                    />
                  </td>
                  <td className="!px-4 !py-3.5 text-[14px] tabular-nums border-r border-[#E1E5EB]">
                    <TableText 
                      className={row.ratio > 100 ? 'text-[#F53F3F] font-bold' : 'text-[#1B2129]'} 
                      text={`${row.ratio}%`} 
                    />
                  </td>
                  <td className="!px-4 !py-3.5 text-[14px] text-[#626C78] tabular-nums border-r border-[#E1E5EB]">
                    <TableText text={`${row.monthlyActual.toLocaleString()} kWh`} />
                  </td>
                  <td className="!px-4 !py-3.5 text-[14px] text-[#626C78] tabular-nums border-r border-[#E1E5EB]">
                    <TableText text={`${row.monthlyBudget.toLocaleString()} kWh`} />
                  </td>
                  <td className="!px-4 !py-3.5 text-[14px] tabular-nums">
                    <TableText 
                      className={row.monthlyRatio > 100 ? 'text-[#F53F3F] font-bold' : 'text-[#1B2129]'} 
                      text={`${row.monthlyRatio}%`} 
                    />
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
