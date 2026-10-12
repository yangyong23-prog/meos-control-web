import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { SpaceDetailContent } from './space-detail/SpaceDetailContent';
import { ErrorBoundary } from '@/app/components/ErrorBoundary';

interface SpaceDetailPopupProps {
    onClose: () => void;
    spaceData?: any;
    spaceList?: any[];
    spaceOptions: any[];
    spaceName?: string;
    envQualityData?: any;
		reportDate: string;
}
export const SpaceDetailPopup: React.FC<SpaceDetailPopupProps> = ({ onClose, spaceData, spaceList, spaceOptions, envQualityData, reportDate }) => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);
    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px]" onClick={onClose}>
            <div className="bg-white rounded-[8px] shadow-lg w-[1260px] max-h-[90vh] flex flex-col overflow-hidden relative" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="h-[56px] shrink-0 border-b border-[#E8ECF0] flex items-center justify-between px-[24px] bg-white z-10 relative">
                    <h2 className="text-[16px] font-bold text-[#2E3742] font-['Microsoft_YaHei_UI:Bold',sans-serif]">空间详细分析</h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition-colors cursor-pointer">
                        <X size={20} className="text-[#8B949E]" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto relative bg-[#F1F4F6]">
                    <ErrorBoundary sectionName="空间详细分析">
                        <SpaceDetailContent spaceOptions={spaceOptions} spaceData={spaceData} envQualityData={envQualityData} spaceList={spaceList} reportDate={reportDate} />
                    </ErrorBoundary>
                </div>
            </div>
        </div>,
        document.body
    );
};
