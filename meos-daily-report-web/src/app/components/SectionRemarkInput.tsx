import React, { useEffect, useRef, useState } from "react";
import { Input, ConfigProvider } from "antd";

interface SectionRemarkInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
}

export const SectionRemarkInput: React.FC<SectionRemarkInputProps> = ({ id, value, onChange, visible }) => {
  if (!visible && !value) return null;
  const [localValue, setLocalValue] = useState(value);
  const [ready, setReady] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (!visible) {
      setReady(false);
      return;
    }
    const node = containerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some(entry => entry.isIntersecting)) {
          setReady(true);
        }
      },
      { rootMargin: "200px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <div ref={containerRef} className="w-full animate-in fade-in slide-in-from-top-2 duration-200">
      {visible ? (
        <ConfigProvider
          theme={{
            token: {
              borderRadius: 4,
              colorBorder: "#E5E6EB", 
              colorPrimary: "#246FE5",
            },
          }}
        >
          {ready ? (
            <Input.TextArea
              className="w-full !text-[14px] !text-[#1B2129] hover:!border-[#246FE5] focus:!border-[#246FE5]"
              placeholder="请输入备注说明"
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              onBlur={() => {
                if (localValue !== value) {
                  onChange(localValue);
                }
              }}
              maxLength={500}
              showCount
              style={{ 
                height: 154,
                resize: 'none',
                padding: '16px',
                backgroundColor: '#fff'
              }}
            />
          ) : (
            <div className="w-full border border-[#E5E6EB] rounded-[4px] bg-white" style={{ height: 154 }} />
          )}
        </ConfigProvider>
      ) : (
        <div className="w-full text-[14px] text-[#1B2129] bg-white rounded-[8px] p-[16px] whitespace-pre-wrap">
          {value}
        </div>
      )}
    </div>
  );
};
