import svgPaths from "./svg-rw2vaz97kf";
import imgGestureCopy22 from "@/assets/3f08508c51c8fcfd2fcbf93d340e307172f4cf1b.png";

function Box() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="_基础组件/多选Box">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="_åºç¡ç»ä»¶/å¤éBox">
          <rect fill="var(--fill-0, #246FE5)" height="16" rx="2" width="16" />
          <path d={svgPaths.p1e8bd4c0} fill="var(--fill-0, white)" id="Rectangle 26" />
        </g>
      </svg>
    </div>
  );
}

function Checkbox() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="多选框&Checkbox">
      <Box />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#1b2129] text-[14px]">仅看品质异常空间</p>
    </div>
  );
}

function Component() {
  return (
    <div className="content-stretch flex font-['Microsoft_YaHei_UI:Regular',sans-serif] items-center justify-center leading-[22px] not-italic relative shrink-0 text-[14px]" data-name="内容">
      <p className="css-ew64yg relative shrink-0 text-[#626c78]">类型：</p>
      <p className="css-ew64yg relative shrink-0 text-[#1b2129] text-center">全部</p>
    </div>
  );
}

function Component1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="下拉图标">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="ä¸æå¾æ ">
          <path clipRule="evenodd" d={svgPaths.p2ad65d40} fill="var(--fill-0, #C4C9CF)" fillRule="evenodd" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function Select() {
  return (
    <div className="content-stretch flex gap-[4px] items-center pl-[12px] pr-[8px] py-[5px] relative rounded-[4px] shrink-0" data-name="选择器&Select">
      <Component />
      <Component1 />
    </div>
  );
}

function Component2() {
  return (
    <div className="content-stretch flex font-['Microsoft_YaHei_UI:Regular',sans-serif] items-center justify-center leading-[22px] not-italic relative shrink-0 text-[14px]" data-name="内容">
      <p className="css-ew64yg relative shrink-0 text-[#626c78]">空间名称：</p>
      <p className="css-ew64yg relative shrink-0 text-[#c4c9cf] text-center">请选择</p>
    </div>
  );
}

function Component4() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="下拉图标">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="ä¸æå¾æ ">
          <path clipRule="evenodd" d={svgPaths.p2ad65d40} fill="var(--fill-0, #C4C9CF)" fillRule="evenodd" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function Select1() {
  return (
    <div className="content-stretch flex gap-[4px] items-center overflow-clip pl-[12px] pr-[8px] py-[5px] relative rounded-[4px] shrink-0" data-name="选择器&Select">
      <Component2 />
      <Component4 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="absolute content-stretch flex gap-[4px] items-center left-[-7px] top-0">
      <Select />
      <div className="bg-[#d9d9d9] h-[13px] shrink-0 w-px" />
      <Select1 />
    </div>
  );
}

function Frame16() {
  return (
    <div className="h-[32px] relative shrink-0 w-[290px]">
      <Frame15 />
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <Checkbox />
      <Frame16 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#b6e9c7] h-[3px] shrink-0 w-[14px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">达标</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame8 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#f8766f] h-[3px] shrink-0 w-[14px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">持续偏热</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame9 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#ffd873] h-[3px] shrink-0 w-[14px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">空间过热</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame10 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#7ee2f0] h-[3px] shrink-0 w-[14px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">持续偏冷</p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame11 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#72acf3] h-[3px] shrink-0 w-[14px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">空间过冷</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame12 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#e8ecf0] h-[3px] shrink-0 w-[14px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">无法监测</p>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame13 />
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <Frame />
      <Frame5 />
      <Frame3 />
      <Frame6 />
      <Frame4 />
      <Frame7 />
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full z-[2]">
      <Frame21 />
      <Frame22 />
    </div>
  );
}

function Component5() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[14]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-1px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="css-g0mm18 font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full">楼层</p>
        </div>
      </div>
    </div>
  );
}

function Component6() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">1F</p>
    </div>
  );
}

function Component7() {
  return (
    <div className="relative shrink-0 w-full z-[13]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component6 />
        </div>
      </div>
    </div>
  );
}

function Component8() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">2F</p>
    </div>
  );
}

function Component9() {
  return (
    <div className="h-[96px] relative shrink-0 w-full z-[12]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <Component8 />
        </div>
      </div>
    </div>
  );
}

function Component10() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">3F</p>
    </div>
  );
}

function Component11() {
  return (
    <div className="relative shrink-0 w-full z-[11]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component10 />
        </div>
      </div>
    </div>
  );
}

function Component12() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">4F</p>
    </div>
  );
}

function Component13() {
  return (
    <div className="relative shrink-0 w-full z-[10]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component12 />
        </div>
      </div>
    </div>
  );
}

function Component14() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component5 />
      <Component7 />
      <Component9 />
      <Component11 />
      <Component13 />
    </div>
  );
}

function Component15() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-[63px] z-[14]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component14 />
    </div>
  );
}

function Component16() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[15]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-1px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="css-4hzbpn font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic relative shrink-0 text-[#626c78] text-[12px] w-full">空间名称</p>
        </div>
      </div>
    </div>
  );
}

function Component17() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#246fe5] text-[14px] text-ellipsis">电力控制室#1</p>
    </div>
  );
}

function Component18() {
  return (
    <div className="relative shrink-0 w-full z-[14]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component17 />
        </div>
      </div>
    </div>
  );
}

function Component19() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#246fe5] text-[14px] text-ellipsis">多功能会议室#1</p>
    </div>
  );
}

function Component20() {
  return (
    <div className="relative shrink-0 w-full z-[13]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component19 />
        </div>
      </div>
    </div>
  );
}

function Component21() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#246fe5] text-[14px] text-ellipsis">多功能会议室#1</p>
    </div>
  );
}

function Component22() {
  return (
    <div className="relative shrink-0 w-full z-[12]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component21 />
        </div>
      </div>
    </div>
  );
}

function Component23() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#246fe5] text-[14px] text-ellipsis">电能监测室#1</p>
    </div>
  );
}

function Component24() {
  return (
    <div className="relative shrink-0 w-full z-[11]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component23 />
        </div>
      </div>
    </div>
  );
}

function Component25() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#246fe5] text-[14px] text-ellipsis">储能室#1</p>
    </div>
  );
}

function Component26() {
  return (
    <div className="relative shrink-0 w-full z-[10]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component25 />
        </div>
      </div>
    </div>
  );
}

function Component27() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component16 />
      <Component18 />
      <Component20 />
      <Component22 />
      <Component24 />
      <Component26 />
    </div>
  );
}

function Component28() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-[199px] z-[13]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component27 />
    </div>
  );
}

function Component29() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[6]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-1px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="css-g0mm18 font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full">09:00</p>
        </div>
      </div>
    </div>
  );
}

function Component30() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[5]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component31() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[4]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component32() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[3]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component33() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[2]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component34() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[1]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component35() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component29 />
      <Component30 />
      <Component31 />
      <Component32 />
      <Component33 />
      <Component34 />
    </div>
  );
}

function Component36() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative z-[12]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component35 />
    </div>
  );
}

function Component37() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[6]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-1px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="css-g0mm18 font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full">10:00</p>
        </div>
      </div>
    </div>
  );
}

function Component38() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[5]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component39() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[4]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component40() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[3]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component41() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[2]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component42() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[1]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component43() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component37 />
      <Component38 />
      <Component39 />
      <Component40 />
      <Component41 />
      <Component42 />
    </div>
  );
}

function Component44() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative z-[11]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component43 />
    </div>
  );
}

function Component45() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[6]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-1px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="css-g0mm18 font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full">11:00</p>
        </div>
      </div>
    </div>
  );
}

function Component46() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[5]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component47() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[4]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#ffd873] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component48() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[3]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component49() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[2]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component50() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[1]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component51() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component45 />
      <Component46 />
      <Component47 />
      <Component48 />
      <Component49 />
      <Component50 />
    </div>
  );
}

function Component52() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative z-[10]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component51 />
    </div>
  );
}

function Component53() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[6]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-1px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="css-g0mm18 font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full">12:00</p>
        </div>
      </div>
    </div>
  );
}

function Component54() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[5]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component55() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[4]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component56() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[3]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component57() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[2]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#ffd873] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component58() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[1]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component59() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component53 />
      <Component54 />
      <Component55 />
      <Component56 />
      <Component57 />
      <Component58 />
    </div>
  );
}

function Component60() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative z-[9]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component59 />
    </div>
  );
}

function Component61() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[6]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-1px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="css-g0mm18 font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full">13:00</p>
        </div>
      </div>
    </div>
  );
}

function Component62() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[5]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component63() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[4]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#e8ecf0] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component64() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[3]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#f8766f] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component65() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[2]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component66() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[1]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component67() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component61 />
      <Component62 />
      <Component63 />
      <Component64 />
      <Component65 />
      <Component66 />
    </div>
  );
}

function Component68() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative z-[8]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component67 />
    </div>
  );
}

function Component69() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[6]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-1px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="css-g0mm18 font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full">14:00</p>
        </div>
      </div>
    </div>
  );
}

function Component70() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[5]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component71() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[4]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component72() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[3]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component73() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[2]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component74() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[1]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component75() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component69 />
      <Component70 />
      <Component71 />
      <Component72 />
      <Component73 />
      <Component74 />
    </div>
  );
}

function Component76() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative z-[7]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component75 />
    </div>
  );
}

function Component77() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[6]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-1px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="css-g0mm18 font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full">15:00</p>
        </div>
      </div>
    </div>
  );
}

function Component78() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[5]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#f8766f] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component79() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[4]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component80() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[3]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#f8766f] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component81() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[2]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component82() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[1]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component83() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component77 />
      <Component78 />
      <Component79 />
      <Component80 />
      <Component81 />
      <Component82 />
    </div>
  );
}

function Component84() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative z-[6]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component83 />
    </div>
  );
}

function Component85() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[6]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-1px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="css-g0mm18 font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full">16:00</p>
        </div>
      </div>
    </div>
  );
}

function Component86() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[5]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component87() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[4]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component88() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[3]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component89() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[2]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#7ee2f0] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component90() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[1]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component91() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component85 />
      <Component86 />
      <Component87 />
      <Component88 />
      <Component89 />
      <Component90 />
    </div>
  );
}

function Component92() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative z-[5]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component91 />
    </div>
  );
}

function Component93() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[6]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-1px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="css-g0mm18 font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full">17:00</p>
        </div>
      </div>
    </div>
  );
}

function Component94() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[5]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component95() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[4]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component96() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[3]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component97() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[2]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component98() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[1]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component99() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component93 />
      <Component94 />
      <Component95 />
      <Component96 />
      <Component97 />
      <Component98 />
    </div>
  );
}

function Component100() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative z-[4]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component99 />
    </div>
  );
}

function Component101() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[6]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-1px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="css-g0mm18 font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full">18:00</p>
        </div>
      </div>
    </div>
  );
}

function Component102() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[5]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component103() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[4]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component104() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[3]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component105() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[2]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#72acf3] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component106() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[1]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component107() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component101 />
      <Component102 />
      <Component103 />
      <Component104 />
      <Component105 />
      <Component106 />
    </div>
  );
}

function Component108() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative z-[3]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component107 />
    </div>
  );
}

function Component109() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[6]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-1px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="css-g0mm18 font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full">19:00</p>
        </div>
      </div>
    </div>
  );
}

function Component110() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[5]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component111() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[4]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component112() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[3]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component113() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[2]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component114() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[1]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component115() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component109 />
      <Component110 />
      <Component111 />
      <Component112 />
      <Component113 />
      <Component114 />
    </div>
  );
}

function Component116() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative z-[2]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component115 />
    </div>
  );
}

function Component117() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[6]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-1px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="css-g0mm18 font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full">20:00</p>
        </div>
      </div>
    </div>
  );
}

function Component118() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[5]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component119() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[4]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component120() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[3]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component121() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[2]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component122() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[1]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component123() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component117 />
      <Component118 />
      <Component119 />
      <Component120 />
      <Component121 />
      <Component122 />
    </div>
  );
}

function Component124() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative z-[1]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component123 />
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex isolate items-start relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-[0.5px] border-solid inset-[-0.5px] pointer-events-none" />
      <Component15 />
      <Component28 />
      <Component36 />
      <Component44 />
      <Component52 />
      <Component60 />
      <Component68 />
      <Component76 />
      <Component84 />
      <Component92 />
      <Component100 />
      <Component108 />
      <Component116 />
      <Component124 />
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full z-[1]">
      <Frame14 />
    </div>
  );
}

function Component164() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Component 390">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.04)]" />
      <div className="content-stretch flex flex-col gap-[6px] isolate items-start px-[12px] py-[16px] relative w-full">
        <Frame20 />
        <Frame23 />
      </div>
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Component164 />
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame17 />
    </div>
  );
}

function Frame24() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.5)] content-stretch flex flex-col items-start left-[52px] p-[16px] rounded-[8px] top-[-380.5px] w-[1200px]">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.04)]" />
      <Frame18 />
    </div>
  );
}

function MouseHover() {
  return (
    <div className="absolute left-[712.67px] size-[24px] top-[30px]" data-name="mouse / hover">
      <div className="absolute flex inset-0 items-center justify-center">
        <div className="flex-none h-[20.079px] rotate-[-12.88deg] skew-x-[0.24deg] w-[19.943px]">
          <div className="relative size-full" data-name="gesture copy 2备份 2">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgGestureCopy22} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame19() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.5)] content-stretch flex flex-col gap-[12px] items-start left-[60px] p-[16px] rounded-[8px] top-[-521.5px] w-[1200px]">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.04)]" />
      <MouseHover />
      <p className="css-4hzbpn font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[0] min-w-full not-italic relative shrink-0 text-[#626c78] text-[0px] text-[14px] w-[min-content]">
        <span className="leading-[22px]">{`管理了 `}</span>
        <span className="font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[22px]">50</span>
        <span className="leading-[22px]">{` 个空间的温度数据，整体温度达标率为 `}</span>
        <span className="font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[22px]">96.5%</span>
        <span className="leading-[22px]">{`；其中 `}</span>
        <span className="font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[22px] text-[#246fe5]">40</span>
        <span className="leading-[22px]">{` 个空间出现过冷、`}</span>
        <span className="font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[22px] text-[#246fe5]">17</span>
        <span className="leading-[22px]">{` 个空间出现持续偏冷、`}</span>
        <span className="font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[22px] text-[#1b4acc]">15</span>
        <span className="leading-[22px]">{` 个空间出现持续偏热、`}</span>
        <span className="font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[22px] text-[#246fe5]">16</span>
        <span className="leading-[22px]">{` 个空间出现过热。其中持续偏热时间最长的空间为 `}</span>
        <span className="font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[22px] text-[#246fe5]">制冷间#1</span>
        <span className="leading-[22px]">{`，过热最严重的空间（与过热门限相比偏离最远）为 `}</span>
        <span className="font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[22px] text-[#246fe5]">强电间#1</span>
      </p>
    </div>
  );
}

function Component125() {
  return (
    <div className="absolute h-[45.917px] left-[-19px] top-[-19.46px] w-[38px]" data-name="标记">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['PingFang_SC:Semibold',sans-serif] h-[39.583px] justify-center leading-[0] left-[19px] not-italic text-[22.167px] text-center text-white top-[19.79px] w-[38px]">
        <p className="css-4hzbpn leading-[normal]">2</p>
      </div>
      <div className="absolute h-[45.917px] left-0 top-0 w-[38px]">
        <div className="absolute inset-[0_0_0.62%_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 38 45.6319">
            <path d={svgPaths.p36e70000} fill="var(--fill-0, #CD47FF)" id="Ellipse 8" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Component3() {
  return (
    <div className="absolute bg-[#fdf8ff] content-stretch flex flex-col gap-[16px] items-start left-[57px] px-[20px] py-[24px] rounded-[8px] top-[-893px] w-[1186px]" data-name="交互组件-3纯文本">
      <div aria-hidden="true" className="absolute border border-[#cd47ff] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="css-4hzbpn font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[36px] min-w-full not-italic relative shrink-0 text-[#1b2129] text-[24px] w-[min-content]">环境品质</p>
      <ol className="block css-y54urs font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[0] min-w-full not-italic relative shrink-0 text-[#1b2129] text-[20px] w-[min-content]" start="1">
        <li className="css-4hzbpn mb-0 ms-[30px]">
          <span className="leading-[40px]">第一段为整体的描述统计，对于具体数据加粗显示；</span>
        </li>
        <li className="css-4hzbpn mb-0 ms-[30px]">
          <span className="leading-[40px]">第一个灰色空间统计不可交互，剩余的空间统计都可以联动图标进行交互，点击后联动下方图表。</span>
        </li>
        <li className="css-4hzbpn mb-0 ms-[30px]">
          <span className="leading-[40px]">联动交互规则：</span>
        </li>
        <li className="css-4hzbpn mb-0 ms-[30px]">
          <span className="leading-[40px]">如果点击 x个 过冷空间，下方的图表类型 变为 过冷空间，同时空间的对象选择变为 x个；其他偏热偏冷同理；</span>
        </li>
        <li className="css-4hzbpn ms-[30px]">
          <span className="leading-[40px]">如果点击 空间名称，则直接空间对象选择变为 当前空间名称，空间类型也跟随变动；</span>
        </li>
      </ol>
      <Component125 />
    </div>
  );
}

function Component126() {
  return (
    <div className="content-stretch flex gap-[9px] items-center relative rounded-[4px] shrink-0" data-name="小蓝标">
      <div className="bg-[#246fe5] h-[20px] shrink-0 w-[3px]" />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[28px] not-italic relative shrink-0 text-[#2e3742] text-[20px]">环境品质</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="bg-[rgba(255,255,255,0.5)] content-stretch flex flex-col items-start p-[16px] relative rounded-[8px] shrink-0 w-[1200px]">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.04)]" />
      <p className="css-4hzbpn font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#626c78] text-[14px] w-full">所有空间均无法监测温度数据</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] items-start left-[68px] top-[44.5px] w-[1200px]">
      <Component126 />
      <Frame1 />
    </div>
  );
}

function Component127() {
  return (
    <div className="content-stretch flex font-['Microsoft_YaHei_UI:Regular',sans-serif] items-center justify-center leading-[22px] not-italic relative shrink-0 text-[14px]" data-name="内容">
      <p className="css-ew64yg relative shrink-0 text-[#626c78]">空间名称：</p>
      <p className="css-ew64yg relative shrink-0 text-[#1b2129] text-center">制冷间#1</p>
    </div>
  );
}

function Component128() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="下拉图标">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="ä¸æå¾æ ">
          <path clipRule="evenodd" d={svgPaths.p84d2bc0} fill="var(--fill-0, #C4C9CF)" fillRule="evenodd" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function Select2() {
  return (
    <div className="absolute bg-[rgba(196,201,207,0.3)] content-stretch flex gap-[4px] items-center left-[421px] pl-[12px] pr-[8px] py-[5px] rounded-[4px] top-[432.5px]" data-name="选择器&Select">
      <Component127 />
      <Component128 />
    </div>
  );
}

function Component129() {
  return (
    <div className="content-stretch flex font-['Microsoft_YaHei_UI:Regular',sans-serif] items-center justify-center leading-[22px] not-italic relative shrink-0 text-[14px]" data-name="内容">
      <p className="css-ew64yg relative shrink-0 text-[#626c78]">类型：</p>
      <p className="css-ew64yg relative shrink-0 text-[#1b2129] text-center">全部</p>
    </div>
  );
}

function Component130() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="下拉图标">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="ä¸æå¾æ ">
          <path clipRule="evenodd" d={svgPaths.p84d2bc0} fill="var(--fill-0, #C4C9CF)" fillRule="evenodd" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function Component131() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name="_基础组件/状态">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[12px] py-[9px] relative w-full">
          <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">全部</p>
        </div>
      </div>
    </div>
  );
}

function Component132() {
  return (
    <div className="bg-[#d9ebff] flex-[1_0_0] min-h-px min-w-px relative rounded-[4px]" data-name="内容">
      <div className="content-stretch flex items-start px-[8px] py-[9px] relative w-full">
        <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#246fe5] text-[14px]">过冷</p>
      </div>
    </div>
  );
}

function Component133() {
  return (
    <div className="relative rounded-[4px] shrink-0 w-full" data-name="_基础组件/状态">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[4px] relative w-full">
          <Component132 />
        </div>
      </div>
    </div>
  );
}

function Component134() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name="_基础组件/状态">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[12px] py-[9px] relative w-full">
          <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">持续偏冷</p>
        </div>
      </div>
    </div>
  );
}

function Component135() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name="_基础组件/状态">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[12px] py-[9px] relative w-full">
          <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">持续偏热</p>
        </div>
      </div>
    </div>
  );
}

function Component136() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name="_基础组件/状态">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[12px] py-[9px] relative w-full">
          <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">过热</p>
        </div>
      </div>
    </div>
  );
}

function Component137() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col items-start left-0 max-h-[308px] min-h-[96px] overflow-clip py-[8px] right-[-144px] rounded-[4px] shadow-[0px_3px_12px_0px_rgba(27,33,41,0.12),0px_0.5px_3px_0px_rgba(27,33,41,0.08)] top-[40px]" data-name="下拉面板">
      <Component131 />
      <Component133 />
      <Component134 />
      <Component135 />
      <Component136 />
    </div>
  );
}

function Select3() {
  return (
    <div className="absolute bg-[rgba(196,201,207,0.3)] content-stretch flex gap-[4px] items-center left-[86px] pl-[12px] pr-[8px] py-[5px] rounded-[4px] top-[432.5px]" data-name="选择器&Select">
      <Component129 />
      <Component130 />
      <Component137 />
    </div>
  );
}

function Component138() {
  return (
    <div className="absolute bg-[#fdf8ff] content-stretch flex flex-col gap-[16px] items-start left-[57px] px-[20px] py-[24px] rounded-[8px] top-[168px] w-[1186px]" data-name="交互组件-3纯文本">
      <div aria-hidden="true" className="absolute border border-[#cd47ff] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="css-4hzbpn font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[36px] min-w-full not-italic relative shrink-0 text-[#1b2129] text-[24px] w-[min-content]">筛选</p>
      <ol className="block css-y54urs font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[0] min-w-full not-italic relative shrink-0 text-[#1b2129] text-[20px] w-[min-content]" start="1">
        <li className="css-4hzbpn mb-0 ms-[30px]">
          <span className="leading-[40px]">第一个为类型筛选，默认全部，可以选择其他类型；</span>
        </li>
        <li className="css-4hzbpn ms-[30px]">
          <span className="leading-[40px]">第二个为空间名称选择，按照建筑-楼层-空间来展示，如果建筑只有1个，默认展示到2级；注意用有搜索的控件奥</span>
        </li>
      </ol>
    </div>
  );
}

function Component139() {
  return (
    <div className="absolute inset-[2.97%_3.01%]" data-name="搜索">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.0374 15.0492">
        <g id="æç´¢">
          <path d={svgPaths.p31c5baf0} fill="var(--fill-0, #8B949E)" id="ç´çº¿ 6å¤ä»½ 2" />
          <path d={svgPaths.p2f80fb00} fill="var(--fill-0, #1B2129)" id="æ¤­åå½¢å¤ä»½ 20" />
        </g>
      </svg>
    </div>
  );
}

function Search() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="search">
      <Component139 />
    </div>
  );
}

function Component140() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name="搜索">
      <div aria-hidden="true" className="absolute border border-[#c4c9cf] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[12px] pr-[8px] py-[5px] relative w-full">
          <Search />
          <p className="css-4hzbpn flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] min-h-px min-w-px not-italic relative text-[#c4c9cf] text-[14px]">搜索</p>
        </div>
      </div>
    </div>
  );
}

function Component141() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col items-center justify-center left-0 pb-[4px] pt-[12px] px-[12px] top-0 w-[300px]" data-name="搜索区域">
      <Component140 />
    </div>
  );
}

function Component142() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[16px]" data-name="展开箭头">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="å±å¼">
          <path clipRule="evenodd" d={svgPaths.p2ad65d40} fill="var(--fill-0, #8B949E)" fillRule="evenodd" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function Component143() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px py-[9px] relative" data-name="内容">
      <Component142 />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#1b2129] text-[14px]">建筑</p>
    </div>
  );
}

function Component144() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="一级树">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[8px] pr-[12px] relative w-full">
          <Component143 />
        </div>
      </div>
    </div>
  );
}

function Component145() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[16px]" data-name="展开箭头">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="å±å¼">
          <path clipRule="evenodd" d={svgPaths.p2ad65d40} fill="var(--fill-0, #8B949E)" fillRule="evenodd" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function Component146() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px py-[9px] relative" data-name="内容">
      <Component145 />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#1b2129] text-[14px]">项目</p>
    </div>
  );
}

function Component147() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="二级树">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[32px] pr-[12px] relative w-full">
          <Component146 />
        </div>
      </div>
    </div>
  );
}

function Component148() {
  return (
    <div className="opacity-0 relative rounded-[4px] shrink-0 size-[16px]" data-name="展开箭头">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="æ¶èµ·">
          <path clipRule="evenodd" d={svgPaths.p2211cd00} fill="var(--fill-0, #8B949E)" fillRule="evenodd" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function Component149() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px py-[9px] relative" data-name="内容">
      <Component148 />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#1b2129] text-[14px]">空间</p>
    </div>
  );
}

function Component150() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="三级树">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[56px] pr-[12px] relative w-full">
          <Component149 />
        </div>
      </div>
    </div>
  );
}

function Component151() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="二级树">
      <Component147 />
      <Component150 />
    </div>
  );
}

function Component152() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[16px]" data-name="展开箭头">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="æ¶èµ·">
          <path clipRule="evenodd" d={svgPaths.p2211cd00} fill="var(--fill-0, #8B949E)" fillRule="evenodd" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function Component153() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px py-[9px] relative" data-name="内容">
      <Component152 />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#1b2129] text-[14px]">选项一</p>
    </div>
  );
}

function Component154() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="二级树">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[32px] pr-[12px] relative w-full">
          <Component153 />
        </div>
      </div>
    </div>
  );
}

function Component155() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="条目">
      <div className="content-stretch flex flex-col items-start pl-[8px] relative w-full">
        <Component144 />
        <Component151 />
        <Component154 />
      </div>
    </div>
  );
}

function Component156() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[16px]" data-name="展开箭头">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="æ¶èµ·">
          <path clipRule="evenodd" d={svgPaths.p2211cd00} fill="var(--fill-0, #8B949E)" fillRule="evenodd" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function Component157() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px py-[9px] relative" data-name="内容">
      <Component156 />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#1b2129] text-[14px]">项目</p>
    </div>
  );
}

function Component158() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="条目">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[8px] pr-[12px] relative w-full">
          <Component157 />
        </div>
      </div>
    </div>
  );
}

function Component159() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[16px]" data-name="展开箭头">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="æ¶èµ·">
          <path clipRule="evenodd" d={svgPaths.p2211cd00} fill="var(--fill-0, #8B949E)" fillRule="evenodd" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function Component160() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px py-[9px] relative" data-name="内容">
      <Component159 />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#1b2129] text-[14px]">选项一</p>
    </div>
  );
}

function Component161() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="条目">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[8px] pr-[12px] relative w-full">
          <Component160 />
        </div>
      </div>
    </div>
  );
}

function Tree() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col items-start left-0 pb-[8px] px-[4px] right-0 top-[48px]" data-name="树&Tree">
      <Component155 />
      {[...Array(3).keys()].map((_, i) => (
        <Component158 key={i} />
      ))}
      {[...Array(3).keys()].map((_, i) => (
        <Component161 key={i} />
      ))}
    </div>
  );
}

function Component162() {
  return (
    <div className="h-[348px] relative shrink-0 w-full" data-name="内部">
      <Component141 />
      <Tree />
    </div>
  );
}

function Component163() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[421px] overflow-clip right-[639px] rounded-[4px] shadow-[0px_3px_12px_0px_rgba(27,33,41,0.12),0px_0.5px_3px_0px_rgba(27,33,41,0.08)] top-[472.5px]" data-name="下拉面板">
      <Component162 />
    </div>
  );
}

export default function Frame25() {
  return (
    <div className="bg-[#ced9e1] relative size-full">
      <Frame24 />
      <Frame19 />
      <Component3 />
      <div className="absolute h-[32px] left-[609px] top-[-540.5px] w-0">
        <div className="absolute inset-[0_-4.33px_-2.34%_-4.33px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.66025 32.75">
            <path d={svgPaths.p26065d00} fill="var(--stroke-0, #C742F9)" id="Vector 4583" />
          </svg>
        </div>
      </div>
      <p className="absolute css-ew64yg font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[22px] left-[542px] not-italic text-[#c742f9] text-[14px] top-[-563.5px]">蓝色的可点击，hover变为grey700，无选中状态，点击后联动图表</p>
      <div className="absolute h-[42.5px] left-[745px] top-[-468px] w-0">
        <div className="absolute inset-[0_-3.84px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.68295 42.5">
            <path d={svgPaths.p30221800} fill="var(--stroke-0, #C742F9)" id="Vector 4584" />
          </svg>
        </div>
      </div>
      <p className="absolute css-ew64yg font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[normal] left-[657px] not-italic text-[#c742f9] text-[13.111px] top-[-417.5px]">点击后联动下方图表，空间默认选择第一个</p>
      <Frame2 />
      <Select2 />
      <Select3 />
      <p className="absolute css-ew64yg font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[22px] left-[87px] not-italic text-[#c742f9] text-[14px] top-[395.5px]">类型选择：默认全部，可以切换至其他选项</p>
      <p className="absolute css-ew64yg font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[22px] left-[419px] not-italic text-[#c742f9] text-[14px] top-[395.5px]">类型选择：默认全部，按照项目可以切换其他空间</p>
      <Component138 />
      <Component163 />
      <p className="absolute css-ew64yg font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[22px] left-[421px] not-italic text-[#c742f9] text-[14px] top-[365.5px]">可选范围会跟随左侧的类型来定位范围；</p>
    </div>
  );
}