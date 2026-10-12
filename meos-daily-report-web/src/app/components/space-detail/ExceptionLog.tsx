// @ts-nocheck
import React from 'react';
import { ExceptionLogItem } from './mockData';
import dayjs from 'dayjs';
import { exceptionRecordsHandler } from '@/app/handler/ac';

interface ExceptionLogProps {
    logs: ExceptionLogItem[];
    infoCodeDefines?: any;
}

export const ExceptionLog: React.FC<ExceptionLogProps> = ({ logs, infoCodeDefines, classCode2InfoCodeDefines }) => {
    return (
        <div className="w-full relative pl-4">
            <div className="flex flex-col gap-0">
                {logs.map((log, index) => {
                    const {
                        infoCode,
                        triggerTime,
                        recoverTime,
                        object: { classCode, localName }
                    } = log || {};
                    const infoCodeDefines = classCode2InfoCodeDefines?.[classCode] || [];
                    const infoCodeDefine = infoCodeDefines?.find((define: any) => define.code === infoCode) || {};
                    let action = `发生${infoCodeDefine?.aliasName || infoCodeDefine?.name || '--'}`;
                    // 故障状态类日志
                    if (infoCode === 'faultStatus') {
                        action = `发生故障`;
                    }
                    if (recoverTime) {
                        action = `${action}，${dayjs(recoverTime).format('HH:mm:ss')}恢复`;
                    } else {
                        action = `${action}, 截止当日结束未恢复`;
                    }
                    const obj = {
                        time: dayjs(triggerTime).format('HH:mm:ss'),
                        device: localName || '--',
                        action: action || '--'
                    };
                    return (
                        <div key={index} className="flex gap-3 relative group">
                            {/* Time */}
                            <span className="text-[14px] text-[#626C78] w-[70px] tabular-nums shrink-0 leading-[20px] font-medium pt-0.5 text-right">{obj.time}</span>

                            {/* Dot & Line */}
                            <div className="relative flex flex-col items-center w-2.5 shrink-0">
                                <div className="relative z-10 w-2.5 h-2.5 rounded-full bg-[#A6AAAC] border-2 border-white mt-[5px]" />
                                {index < logs.length - 1 && <div className="absolute top-[10px] bottom-[-4px] w-px border-l border-dashed border-[#8B949E]" />}
                            </div>

                            {/* Content */}
                            <div className="text-[14px] pt-0.5 break-all flex-1 leading-[20px] pb-6">
                                <span className="font-bold text-[#1B2129] mr-2">{obj.device}</span>
                                <span className="text-[#626C78]">{obj.action}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
