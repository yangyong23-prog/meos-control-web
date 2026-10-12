import React, { useEffect, useState } from "react";
import svgPaths from "@/imports/svg-qelszg8ci";
import svgPathsError from "@/imports/svg-9du6a0aylw"; // Keep error paths just in case

export type MessageType = "success" | "error";

interface GlobalMessageProps {
  type: MessageType;
  message: string;
  onClose: () => void;
  visible: boolean;
}

// -- Components from User Design (Image 2) --

function ComponentSuccessFill() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="component/success.fill">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="component/success.fill">
          <path d={svgPaths.p34811000} fill="white" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function ComponentErrorFill() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="component/error.fill">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
         <path d={svgPathsError.pfcbd900} fill="white" id="Vector" />
      </svg>
    </div>
  );
}

function CloseIcon({ onClick }: { onClick: () => void }) {
  return (
    <div className="content-stretch flex items-center justify-end relative shrink-0 cursor-pointer" data-name="右边" onClick={onClick}>
      <div className="relative shrink-0 size-[16px]" data-name="x">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <g id="x">
            <path clipRule="evenodd" d={svgPaths.p232edd80} fill="white" fillRule="evenodd" id="Union" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Y() {
  return <div className="shrink-0 size-[0.001px]" data-name="y" />;
}

function X() {
  return <div className="shrink-0 size-[0.001px]" data-name="x" />;
}

function Placeholder() {
  return (
    <div className="content-stretch flex gap-[164px] items-start relative shrink-0 pointer-events-none" data-name="placeholder">
      <Y />
      <X />
    </div>
  );
}

export const GlobalMessage: React.FC<GlobalMessageProps> = ({ type, message, onClose, visible }) => {
  const [show, setShow] = useState(visible);

  useEffect(() => {
    setShow(visible);
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!show) return null;

  const bgColor = type === "success" ? "bg-[#3fbe72]" : "bg-[#f55047]";
  const Icon = type === "success" ? ComponentSuccessFill : ComponentErrorFill;

  return (
    <div className="fixed top-[12px] left-1/2 -translate-x-1/2 z-[9999] animate-in slide-in-from-top-2 fade-in duration-300">
      <div className={`${bgColor} content-stretch flex gap-[8px] items-center justify-center pl-[16px] pr-[12px] py-[6px] relative rounded-[4px] shadow-lg`} data-name="全局提示&Message">
        <Icon />
        <div className="content-stretch flex flex-col items-start py-[3px] relative shrink-0" data-name="text">
           <p className="font-['Microsoft_YaHei_UI',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap">
             {message}
           </p>
           <Placeholder />
        </div>
        <CloseIcon onClick={onClose} />
      </div>
    </div>
  );
};
