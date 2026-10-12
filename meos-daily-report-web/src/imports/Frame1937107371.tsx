import svgPaths from "./svg-1r6f2ipuj7";

function Frame() {
  return (
    <div className="content-stretch flex flex-col isolate items-start pb-[12px] relative shrink-0">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[28px] not-italic relative shrink-0 text-[#2e3742] text-[20px] z-[2]">环境品质</p>
      <div className="bg-[rgba(0,148,255,0.2)] h-[12px] mb-[-12px] shrink-0 w-full z-[1]" />
    </div>
  );
}

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

function Component3() {
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
      <Component3 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="absolute content-stretch flex gap-[4px] items-center left-[-7px] top-0">
      <Select />
      <div className="bg-[#d9d9d9] h-[13px] shrink-0 w-px" />
      <Select1 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="h-[32px] relative shrink-0 w-[290px]">
      <Frame12 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <Checkbox />
      <Frame13 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#b6e9c7] h-[3px] shrink-0 w-[14px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">达标</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame6 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#ffd873] h-[3px] shrink-0 w-[14px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">持续偏热</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame7 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#fdc1be] h-[3px] shrink-0 w-[14px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">空间过热</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame8 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#7ed8e4] h-[3px] shrink-0 w-[14px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">持续偏冷</p>
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
      <div className="bg-[#64a6f7] h-[3px] shrink-0 w-[14px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">空间过冷</p>
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

function Frame18() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <Frame1 />
      <Frame4 />
      <Frame2 />
      <Frame5 />
      <Frame3 />
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full z-[2]">
      <Frame17 />
      <Frame18 />
    </div>
  );
}

function Component4() {
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

function Component5() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">1F</p>
    </div>
  );
}

function Component6() {
  return (
    <div className="relative shrink-0 w-full z-[13]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component5 />
        </div>
      </div>
    </div>
  );
}

function Component7() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">2F</p>
    </div>
  );
}

function Component8() {
  return (
    <div className="h-[96px] relative shrink-0 w-full z-[12]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <Component7 />
        </div>
      </div>
    </div>
  );
}

function Component9() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">3F</p>
    </div>
  );
}

function Component10() {
  return (
    <div className="relative shrink-0 w-full z-[11]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component9 />
        </div>
      </div>
    </div>
  );
}

function Component11() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">4F</p>
    </div>
  );
}

function Component12() {
  return (
    <div className="relative shrink-0 w-full z-[10]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component11 />
        </div>
      </div>
    </div>
  );
}

function Component13() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component4 />
      <Component6 />
      <Component8 />
      <Component10 />
      <Component12 />
    </div>
  );
}

function Component14() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-[63px] z-[14]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component13 />
    </div>
  );
}

function Component15() {
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

function Component16() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#246fe5] text-[14px] text-ellipsis">电力控制室#1</p>
    </div>
  );
}

function Component17() {
  return (
    <div className="relative shrink-0 w-full z-[14]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component16 />
        </div>
      </div>
    </div>
  );
}

function Component18() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#246fe5] text-[14px] text-ellipsis">多功能会议室#1</p>
    </div>
  );
}

function Component19() {
  return (
    <div className="relative shrink-0 w-full z-[13]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component18 />
        </div>
      </div>
    </div>
  );
}

function Component20() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#246fe5] text-[14px] text-ellipsis">多功能会议室#1</p>
    </div>
  );
}

function Component21() {
  return (
    <div className="relative shrink-0 w-full z-[12]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component20 />
        </div>
      </div>
    </div>
  );
}

function Component22() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#246fe5] text-[14px] text-ellipsis">电能监测室#1</p>
    </div>
  );
}

function Component23() {
  return (
    <div className="relative shrink-0 w-full z-[11]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component22 />
        </div>
      </div>
    </div>
  );
}

function Component24() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#246fe5] text-[14px] text-ellipsis">储能室#1</p>
    </div>
  );
}

function Component25() {
  return (
    <div className="relative shrink-0 w-full z-[10]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component24 />
        </div>
      </div>
    </div>
  );
}

function Component26() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component15 />
      <Component17 />
      <Component19 />
      <Component21 />
      <Component23 />
      <Component25 />
    </div>
  );
}

function Component27() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-[199px] z-[13]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component26 />
    </div>
  );
}

function Component28() {
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

function Component29() {
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

function Component30() {
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

function Component31() {
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

function Component32() {
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

function Component33() {
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

function Component34() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component28 />
      <Component29 />
      <Component30 />
      <Component31 />
      <Component32 />
      <Component33 />
    </div>
  );
}

function Component35() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative z-[12]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component34 />
    </div>
  );
}

function Component36() {
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

function Component37() {
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

function Component38() {
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

function Component39() {
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

function Component40() {
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

function Component41() {
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

function Component42() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component36 />
      <Component37 />
      <Component38 />
      <Component39 />
      <Component40 />
      <Component41 />
    </div>
  );
}

function Component43() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative z-[11]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component42 />
    </div>
  );
}

function Component44() {
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

function Component45() {
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

function Component46() {
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

function Component47() {
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

function Component48() {
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

function Component49() {
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

function Component50() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component44 />
      <Component45 />
      <Component46 />
      <Component47 />
      <Component48 />
      <Component49 />
    </div>
  );
}

function Component51() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative z-[10]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component50 />
    </div>
  );
}

function Component52() {
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

function Component53() {
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

function Component54() {
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

function Component55() {
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

function Component56() {
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

function Component57() {
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

function Component58() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component52 />
      <Component53 />
      <Component54 />
      <Component55 />
      <Component56 />
      <Component57 />
    </div>
  );
}

function Component59() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative z-[9]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component58 />
    </div>
  );
}

function Component60() {
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

function Component61() {
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

function Component62() {
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

function Component63() {
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

function Component64() {
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

function Component65() {
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

function Component66() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component60 />
      <Component61 />
      <Component62 />
      <Component63 />
      <Component64 />
      <Component65 />
    </div>
  );
}

function Component67() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative z-[8]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component66 />
    </div>
  );
}

function Component68() {
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

function Component69() {
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

function Component70() {
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

function Component71() {
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

function Component72() {
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

function Component73() {
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

function Component74() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component68 />
      <Component69 />
      <Component70 />
      <Component71 />
      <Component72 />
      <Component73 />
    </div>
  );
}

function Component75() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative z-[7]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component74 />
    </div>
  );
}

function Component76() {
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

function Component77() {
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

function Component78() {
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

function Component79() {
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

function Component80() {
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

function Component81() {
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

function Component82() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component76 />
      <Component77 />
      <Component78 />
      <Component79 />
      <Component80 />
      <Component81 />
    </div>
  );
}

function Component83() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative z-[6]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component82 />
    </div>
  );
}

function Component84() {
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

function Component85() {
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

function Component86() {
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

function Component87() {
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

function Component88() {
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

function Component89() {
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

function Component90() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component84 />
      <Component85 />
      <Component86 />
      <Component87 />
      <Component88 />
      <Component89 />
    </div>
  );
}

function Component91() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative z-[5]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component90 />
    </div>
  );
}

function Component92() {
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

function Component93() {
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

function Component94() {
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

function Component95() {
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

function Component96() {
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

function Component97() {
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

function Component98() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component92 />
      <Component93 />
      <Component94 />
      <Component95 />
      <Component96 />
      <Component97 />
    </div>
  );
}

function Component99() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative z-[4]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component98 />
    </div>
  );
}

function Component100() {
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

function Component101() {
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

function Component102() {
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

function Component103() {
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

function Component104() {
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

function Component105() {
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

function Component106() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component100 />
      <Component101 />
      <Component102 />
      <Component103 />
      <Component104 />
      <Component105 />
    </div>
  );
}

function Component107() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative z-[3]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component106 />
    </div>
  );
}

function Component108() {
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

function Component109() {
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

function Component110() {
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

function Component111() {
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

function Component112() {
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

function Component113() {
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

function Component114() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component108 />
      <Component109 />
      <Component110 />
      <Component111 />
      <Component112 />
      <Component113 />
    </div>
  );
}

function Component115() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative z-[2]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component114 />
    </div>
  );
}

function Component116() {
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

function Component117() {
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

function Component118() {
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

function Component119() {
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

function Component120() {
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

function Component121() {
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

function Component122() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component116 />
      <Component117 />
      <Component118 />
      <Component119 />
      <Component120 />
      <Component121 />
    </div>
  );
}

function Component123() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative z-[1]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component122 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex isolate items-start relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-[0.5px] border-solid inset-[-0.5px] pointer-events-none" />
      <Component14 />
      <Component27 />
      <Component35 />
      <Component43 />
      <Component51 />
      <Component59 />
      <Component67 />
      <Component75 />
      <Component83 />
      <Component91 />
      <Component99 />
      <Component107 />
      <Component115 />
      <Component123 />
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full z-[1]">
      <Frame11 />
    </div>
  );
}

function Component124() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Component 390">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.04)]" />
      <div className="content-stretch flex flex-col gap-[6px] isolate items-start px-[12px] py-[16px] relative w-full">
        <Frame16 />
        <Frame19 />
      </div>
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Component124 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame14 />
    </div>
  );
}

export default function Frame20() {
  return (
    <div className="bg-[rgba(255,255,255,0.5)] content-stretch flex flex-col gap-[12px] items-start p-[16px] relative rounded-[8px] size-full">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.04)]" />
      <Frame />
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
        <span className="font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[22px] text-[#246fe5]">15</span>
        <span className="leading-[22px]">{` 个空间出现持续偏热、`}</span>
        <span className="font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[22px] text-[#246fe5]">16</span>
        <span className="leading-[22px]">{` 个空间出现过热。其中持续偏热时间最长的空间为 `}</span>
        <span className="font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[22px]">制冷间#1</span>
        <span className="leading-[22px]">{`，过热最严重的空间（与过热门限相比偏离最远）为 `}</span>
        <span className="font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[22px]">强电间#1</span>
      </p>
      <Frame15 />
    </div>
  );
}