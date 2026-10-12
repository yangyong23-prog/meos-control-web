import React, { useState, useEffect } from 'react';
import { ManualInterventionPopup } from './components/ManualInterventionPopup';
import { queryRunningLogListByPage } from '@/app/hooks/useOperationLog';

/**
 * 测试页面组件
 */
const TestPage: React.FC = () => {
  const [showManualIntervention, setShowManualIntervention] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [runningLogs, setRunningLogs] = useState<[]>([]);
  
  const secondLevelCategory = "Sy95224575586450450ecf5a4178be59db37e4aee276";

  // 日期变化时自动查询运行日志
  useEffect(() => {
    if (selectedDate) {
      handleDateChange(selectedDate, secondLevelCategory);
    }
  }, [selectedDate]);
  
  // 处理日期选择
  const handleDateChange = async (date: string, secondLevelCategory: string) => {
    try {
      const result = await queryRunningLogListByPage(date, secondLevelCategory);
      setRunningLogs(result.data);
      console.log('查询到的运行日志:', result.data);
    } catch (err) {
      console.error('查询运行日志失败:', err);
    }
  };

  // Mock数据 - 测试外部数据传入功能
  const mockRecords = [
    {
      time: "2024.01.15 08:00",
      category: "设备维护",
      tag: "紧急",
      operator: "张三",
      object: "生产线A",
      content: "设备异常停机，需要紧急维修",
      effectiveTime: "2024.01.15 08:00:00-2024.01.15 10:00:00",
      reason: "设备故障"
    },
    {
      time: "2024.01.15 09:15",
      category: "质量检查",
      tag: "常规",
      operator: "李四",
      object: "产品批次001",
      content: "产品质量抽检发现问题",
      effectiveTime: "2024.01.15 09:15:00-2024.01.15 11:15:00",
      reason: "质量异常"
    },
    {
      time: "2024.01.15 10:30",
      category: "测试分类1",
      tag: "测试",
      operator: "测试用户1",
      object: "测试设备_1",
      content: "这是从test.tsx传入的测试数据",
      effectiveTime: "2024.01.15 10:30:00-2024.01.15 12:00:00",
      reason: "测试外部数据传入功能"
    },
    {
      time: "2024.01.15 11:00",
      category: "测试分类2",
      tag: "测试",
      operator: "测试用户2",
      object: "测试设备_2",
      content: "外部数据传入功能验证成功",
      effectiveTime: "2024.01.15 11:00:00-2024.01.15 13:00:00",
      reason: "验证组件参数接收功能"
    },
    {
      time: "2024.01.15 11:30",
      category: "测试分类3",
      tag: "测试",
      operator: "测试用户3",
      object: "测试设备_3",
      content: "组件支持自定义数据源",
      effectiveTime: "2024.01.15 11:30:00-2024.01.15 14:00:00",
      reason: "展示动态数据加载"
    },
    {
      time: "2024.01.15 13:00",
      category: "生产调度",
      tag: "重要",
      operator: "王五",
      object: "生产计划",
      content: "调整生产计划，增加紧急订单",
      effectiveTime: "2024.01.15 13:00:00-2024.01.15 15:00:00",
      reason: "客户需求变更"
    },
    {
      time: "2024.01.15 14:20",
      category: "安全巡检",
      tag: "常规",
      operator: "赵六",
      object: "车间安全",
      content: "发现安全隐患，需要立即整改",
      effectiveTime: "2024.01.15 14:20:00-2024.01.15 16:20:00",
      reason: "安全检查"
    },
    {
      time: "2024.01.15 15:45",
      category: "物料管理",
      tag: "紧急",
      operator: "钱七",
      object: "原材料库存",
      content: "关键物料库存告急，需要紧急采购",
      effectiveTime: "2024.01.15 15:45:00-2024.01.15 17:45:00",
      reason: "库存不足"
    },
    {
      time: "2024.01.15 16:30",
      category: "技术优化",
      tag: "重要",
      operator: "孙八",
      object: "工艺参数",
      content: "优化生产工艺参数，提高效率",
      effectiveTime: "2024.01.15 16:30:00-2024.01.15 18:30:00",
      reason: "效率提升"
    },
    {
      time: "2024.01.15 17:15",
      category: "人员调配",
      tag: "常规",
      operator: "周九",
      object: "生产班组",
      content: "调整班组人员配置，优化工作安排",
      effectiveTime: "2024.01.15 17:15:00-2024.01.15 19:15:00",
      reason: "人员优化"
    },
    {
      time: "2024.01.15 18:00",
      category: "设备保养",
      tag: "计划",
      operator: "吴十",
      object: "设备B",
      content: "执行设备定期保养计划",
      effectiveTime: "2024.01.15 18:00:00-2024.01.15 20:00:00",
      reason: "预防性维护"
    },
    {
      time: "2024.01.15 19:30",
      category: "数据监控",
      tag: "重要",
      operator: "郑十一",
      object: "生产数据",
      content: "监控生产数据异常，进行分析处理",
      effectiveTime: "2024.01.15 19:30:00-2024.01.15 21:30:00",
      reason: "数据异常"
    },
    {
      time: "2024.01.15 20:15",
      category: "环境控制",
      tag: "紧急",
      operator: "王十二",
      object: "温湿度控制",
      content: "车间温湿度异常，需要紧急调整",
      effectiveTime: "2024.01.15 20:15:00-2024.01.15 22:15:00",
      reason: "环境异常"
    },
    {
      time: "2024.01.15 21:00",
      category: "能源管理",
      tag: "常规",
      operator: "李十三",
      object: "电力消耗",
      content: "优化能源使用，降低能耗",
      effectiveTime: "2024.01.15 21:00:00-2024.01.15 23:00:00",
      reason: "节能降耗"
    },
    {
      time: "2024.01.15 22:30",
      category: "夜间巡检",
      tag: "常规",
      operator: "张十四",
      object: "夜间生产",
      content: "夜间生产巡检，确保生产安全",
      effectiveTime: "2024.01.15 22:30:00-2024.01.16 00:30:00",
      reason: "夜间安全"
    },
    {
      time: "2024.01.16 08:30",
      category: "早会安排",
      tag: "重要",
      operator: "陈十五",
      object: "生产会议",
      content: "召开生产早会，安排当日工作",
      effectiveTime: "2024.01.16 08:30:00-2024.01.16 09:30:00",
      reason: "工作安排"
    },
    {
      time: "2024.01.16 10:00",
      category: "客户接待",
      tag: "重要",
      operator: "林十六",
      object: "客户参观",
      content: "接待重要客户参观生产线",
      effectiveTime: "2024.01.16 10:00:00-2024.01.16 12:00:00",
      reason: "客户关系"
    },
    {
      time: "2024.01.16 13:30",
      category: "培训安排",
      tag: "计划",
      operator: "黄十七",
      object: "员工培训",
      content: "组织新员工操作培训",
      effectiveTime: "2024.01.16 13:30:00-2024.01.16 15:30:00",
      reason: "技能提升"
    },
    {
      time: "2024.01.16 15:00",
      category: "质量改进",
      tag: "重要",
      operator: "刘十八",
      object: "质量体系",
      content: "实施质量改进措施",
      effectiveTime: "2024.01.16 15:00:00-2024.01.16 17:00:00",
      reason: "质量提升"
    },
    {
      time: "2024.01.16 17:45",
      category: "工作总结",
      tag: "常规",
      operator: "杨十九",
      object: "生产日报",
      content: "汇总当日生产数据，编写日报",
      effectiveTime: "2024.01.16 17:45:00-2024.01.16 19:45:00",
      reason: "工作汇报"
    },
    {
      time: "2024.01.16 19:00",
      category: "设备调试",
      tag: "紧急",
      operator: "朱二十",
      object: "新设备",
      content: "新设备调试运行，解决技术问题",
      effectiveTime: "2024.01.16 19:00:00-2024.01.16 21:00:00",
      reason: "设备投产"
    }
  ];
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          测试页面
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          这是一个测试路由页面，用于验证路由配置是否正确。
        </p>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">路由信息</h3>
            <p className="text-blue-700 text-sm">
              • 路径: /test<br/>
              • 组件: TestPage<br/>
              • 状态: 运行正常
            </p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">功能验证</h3>
            <p className="text-green-700 text-sm">
              • 路由配置正确<br/>
              • 组件加载正常<br/>
              • 样式显示正常
            </p>
          </div>
        </div>
        
        {/* 日期选择组件 */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-3">运行日志查询</h3>
          
          <div className="flex items-center gap-3">
            <label htmlFor="logDate" className="text-sm font-medium text-gray-700">选择日期:</label>
            <input
              id="logDate"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
          
        <div className="mt-6 space-y-3 text-center">
          <button
            onClick={() => setShowManualIntervention(true)}
            className="w-full bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            查看人工干预记录
          </button>
          
          <a 
            href="/info" 
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            返回主页面
          </a>
        </div>
      </div>

      {/* 人工干预记录弹框 */}
      {showManualIntervention && (
        <ManualInterventionPopup 
          onClose={() => setShowManualIntervention(false)} 
          records={runningLogs}
        />
      )}
    </div>
  );
};

export default TestPage;