import React from 'react';
import loadingGif from "@/assets/loading.gif";

interface LoadingProps {
  showText?: boolean;
  text?: string;
  size?: number;
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  showText = true,
  text = "正在加载中...",
  size = 100,
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="flex flex-col items-center justify-center space-y-4">
        <img 
          src={loadingGif} 
          alt="加载中" 
          style={{ width: `${size}px`, height: `${size}px` }}
        />
        {showText && (
          <div className="text-[#1b2129] text-sm font-medium">
            {text}
          </div>
        )}
      </div>
    </div>
  );
};

export default Loading;