import svgPaths from "./svg-cdpglfdkrw";

function CommonClose() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="common/close">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="common/close">
          <path d={svgPaths.p74d500} fill="var(--fill-0, #8B949E)" id="ç©å½¢" />
          <path clipRule="evenodd" d={svgPaths.p1a561100} fill="var(--fill-0, #1B2129)" fillRule="evenodd" id="ç©å½¢å¤ä»½ 44" />
        </g>
      </svg>
    </div>
  );
}

function Title() {
  return (
    <div className="h-[56px] relative shrink-0 w-full" data-name="title">
      <div aria-hidden="true" className="absolute border-[#e8ecf0] border-b border-solid inset-[0_0_-1px_0] pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[24px] py-[12px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#2e3742] text-[16px]">人工干预记录</p>
          <CommonClose />
        </div>
      </div>
    </div>
  );
}

function Sort() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Sort">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Sort">
          <path clipRule="evenodd" d={svgPaths.p3eff0380} fill="var(--fill-0, #8D9399)" fillRule="evenodd" id="Triangleå¤ä»½" />
          <path clipRule="evenodd" d={svgPaths.p17e8aa80} fill="var(--fill-0, #8D9399)" fillRule="evenodd" id="Triangleå¤ä»½_2" />
        </g>
      </svg>
    </div>
  );
}

function Content() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Content">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#626c78] text-[12px]">操作时间</p>
      <Sort />
    </div>
  );
}

function Placeholder() {
  return <div className="h-[0.001px] shrink-0 w-[72px]" data-name="placeholder" />;
}

function Component() {
  return (
    <div className="bg-[#f1f4f6] h-[38.001px] relative shrink-0 w-full z-[16]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-1px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <Content />
          <Placeholder />
        </div>
      </div>
    </div>
  );
}

function Component1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">2023.09.13 20:00</p>
    </div>
  );
}

function Component2() {
  return (
    <div className="h-[96px] relative shrink-0 w-full z-[15]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <Component1 />
        </div>
      </div>
    </div>
  );
}

function Component3() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="内容">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#1b2129] text-[14px] text-ellipsis">2023.09.13 17:20</p>
    </div>
  );
}

function Component4() {
  return (
    <div className="relative shrink-0 w-full z-[14]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component3 />
        </div>
      </div>
    </div>
  );
}

function Component5() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">2023.09.12 16:15</p>
    </div>
  );
}

function Component6() {
  return (
    <div className="relative shrink-0 w-full z-[13]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
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
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">2023.09.11 14:02</p>
    </div>
  );
}

function Component8() {
  return (
    <div className="relative shrink-0 w-full z-[12]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component7 />
        </div>
      </div>
    </div>
  );
}

function Component9() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">2023.09.13 20:00</p>
    </div>
  );
}

function Component10() {
  return (
    <div className="h-[96px] relative shrink-0 w-full z-[11]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <Component9 />
        </div>
      </div>
    </div>
  );
}

function Component11() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">2023.09.13 20:00</p>
    </div>
  );
}

function Component12() {
  return (
    <div className="h-[96px] relative shrink-0 w-full z-[10]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <Component11 />
        </div>
      </div>
    </div>
  );
}

function Component13() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="内容">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#1b2129] text-[14px] text-ellipsis">2023.09.10 12:00</p>
    </div>
  );
}

function Component14() {
  return (
    <div className="relative shrink-0 w-full z-[9]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component13 />
        </div>
      </div>
    </div>
  );
}

function Component15() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">2023.09.10 08:00</p>
    </div>
  );
}

function Component16() {
  return (
    <div className="relative shrink-0 w-full z-[8]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component15 />
        </div>
      </div>
    </div>
  );
}

function Component17() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">2023.09.09 02:20</p>
    </div>
  );
}

function Component18() {
  return (
    <div className="relative shrink-0 w-full z-[7]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
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
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="内容">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#1b2129] text-[14px] text-ellipsis">2023.09.08 20:00</p>
    </div>
  );
}

function Component20() {
  return (
    <div className="relative shrink-0 w-full z-[6]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
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
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">2023.09.07 17:20</p>
    </div>
  );
}

function Component22() {
  return (
    <div className="relative shrink-0 w-full z-[5]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
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
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">2023.09.06 16:15</p>
    </div>
  );
}

function Component24() {
  return (
    <div className="relative shrink-0 w-full z-[4]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
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
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="内容">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#1b2129] text-[14px] text-ellipsis">2023.09.05 14:02</p>
    </div>
  );
}

function Component26() {
  return (
    <div className="relative shrink-0 w-full z-[3]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
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
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="内容">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#1b2129] text-[14px] text-ellipsis">2023.09.04 12:00</p>
    </div>
  );
}

function Component28() {
  return (
    <div className="relative shrink-0 w-full z-[2]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component27 />
        </div>
      </div>
    </div>
  );
}

function Component29() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="内容">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#1b2129] text-[14px] text-ellipsis">2023.09.03 08:00</p>
    </div>
  );
}

function Component30() {
  return (
    <div className="relative shrink-0 w-full z-[1]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component29 />
        </div>
      </div>
    </div>
  );
}

function Component31() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component />
      <Component2 />
      <Component4 />
      <Component6 />
      <Component8 />
      <Component10 />
      <Component12 />
      <Component14 />
      <Component16 />
      <Component18 />
      <Component20 />
      <Component22 />
      <Component24 />
      <Component26 />
      <Component28 />
      <Component30 />
    </div>
  );
}

function Component32() {
  return (
    <div className="relative shrink-0 w-[141px] z-[11]" data-name="列">
      <div className="content-stretch flex items-start overflow-clip relative rounded-[inherit] w-full">
        <Component31 />
      </div>
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Component33() {
  return (
    <div className="bg-[#f1f4f6] h-[38px] relative shrink-0 w-full z-[16]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-1px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis">日志分类</p>
        </div>
      </div>
    </div>
  );
}

function Component34() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative w-full" data-name="内容">
      <p className="css-4hzbpn flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] min-h-px min-w-px not-italic relative text-[#1b2129] text-[14px]">控返不一致/报警</p>
    </div>
  );
}

function Component35() {
  return (
    <div className="h-[96px] relative shrink-0 w-full z-[15]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <Component34 />
        </div>
      </div>
    </div>
  );
}

function Component36() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="内容">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#1b2129] text-[14px] text-ellipsis">离线/报警</p>
    </div>
  );
}

function Component37() {
  return (
    <div className="relative shrink-0 w-full z-[14]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component36 />
        </div>
      </div>
    </div>
  );
}

function Component38() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">控制命令执行结果</p>
    </div>
  );
}

function Component39() {
  return (
    <div className="relative shrink-0 w-full z-[13]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component38 />
        </div>
      </div>
    </div>
  );
}

function Component40() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">设备手动/强制操作</p>
    </div>
  );
}

function Component41() {
  return (
    <div className="relative shrink-0 w-full z-[12]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component40 />
        </div>
      </div>
    </div>
  );
}

function Component42() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative w-full" data-name="内容">
      <p className="css-4hzbpn flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] min-h-px min-w-px not-italic relative text-[#1b2129] text-[14px]">策略调整</p>
    </div>
  );
}

function Component43() {
  return (
    <div className="h-[96px] relative shrink-0 w-full z-[11]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <Component42 />
        </div>
      </div>
    </div>
  );
}

function Component44() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative w-full" data-name="内容">
      <p className="css-4hzbpn flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] min-h-px min-w-px not-italic relative text-[#1b2129] text-[14px]">策略调整</p>
    </div>
  );
}

function Component45() {
  return (
    <div className="h-[96px] relative shrink-0 w-full z-[10]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <Component44 />
        </div>
      </div>
    </div>
  );
}

function Component46() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">价值选择调整</p>
    </div>
  );
}

function Component47() {
  return (
    <div className="relative shrink-0 w-full z-[9]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component46 />
        </div>
      </div>
    </div>
  );
}

function Component48() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="内容">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#1b2129] text-[14px] text-ellipsis">设备手动/强制操作</p>
    </div>
  );
}

function Component49() {
  return (
    <div className="relative shrink-0 w-full z-[8]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component48 />
        </div>
      </div>
    </div>
  );
}

function Component50() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">需求配置调整</p>
    </div>
  );
}

function Component51() {
  return (
    <div className="relative shrink-0 w-full z-[7]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component50 />
        </div>
      </div>
    </div>
  );
}

function Component52() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">设备手动/强制操作</p>
    </div>
  );
}

function Component53() {
  return (
    <div className="relative shrink-0 w-full z-[6]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component52 />
        </div>
      </div>
    </div>
  );
}

function Component54() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">控制命令执行结果</p>
    </div>
  );
}

function Component55() {
  return (
    <div className="relative shrink-0 w-full z-[5]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component54 />
        </div>
      </div>
    </div>
  );
}

function Component56() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="内容">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#1b2129] text-[14px] text-ellipsis">策略调整</p>
    </div>
  );
}

function Component57() {
  return (
    <div className="relative shrink-0 w-full z-[4]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component56 />
        </div>
      </div>
    </div>
  );
}

function Component58() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">控制命令执行结果</p>
    </div>
  );
}

function Component59() {
  return (
    <div className="relative shrink-0 w-full z-[3]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component58 />
        </div>
      </div>
    </div>
  );
}

function Component60() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">策略调整</p>
    </div>
  );
}

function Component61() {
  return (
    <div className="relative shrink-0 w-full z-[2]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component60 />
        </div>
      </div>
    </div>
  );
}

function Component62() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">系统控制参数修改</p>
    </div>
  );
}

function Component63() {
  return (
    <div className="relative shrink-0 w-full z-[1]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component62 />
        </div>
      </div>
    </div>
  );
}

function Component64() {
  return (
    <div className="relative shrink-0 w-[146px] z-[10]" data-name="列内容">
      <div className="content-stretch flex flex-col isolate items-start overflow-clip relative rounded-[inherit] w-full">
        <Component33 />
        <Component35 />
        <Component37 />
        <Component39 />
        <Component41 />
        <Component43 />
        <Component45 />
        <Component47 />
        <Component49 />
        <Component51 />
        <Component53 />
        <Component55 />
        <Component57 />
        <Component59 />
        <Component61 />
        <Component63 />
      </div>
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Component65() {
  return (
    <div className="bg-[#f1f4f6] h-[38px] relative shrink-0 w-full z-[16]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-1px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis">日志标识</p>
        </div>
      </div>
    </div>
  );
}

function Property() {
  return (
    <div className="bg-[#fff0cc] content-stretch flex items-center justify-center px-[8px] py-px relative rounded-[4px] shrink-0" data-name="属性标签&Property">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#e68600] text-[14px]">人工</p>
    </div>
  );
}

function Component66() {
  return (
    <div className="h-[96px] relative shrink-0 w-full z-[15]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pl-[16px] pr-[12px] py-[12px] relative size-full">
          <Property />
        </div>
      </div>
    </div>
  );
}

function Property1() {
  return (
    <div className="bg-[#fff0cc] content-stretch flex items-center justify-center px-[8px] py-px relative rounded-[4px] shrink-0" data-name="属性标签&Property">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#e68600] text-[14px]">人工</p>
    </div>
  );
}

function Component67() {
  return (
    <div className="relative shrink-0 w-full z-[14]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pl-[16px] pr-[12px] py-[12px] relative w-full">
          <Property1 />
        </div>
      </div>
    </div>
  );
}

function Property2() {
  return (
    <div className="bg-[#fff0cc] content-stretch flex items-center justify-center px-[8px] py-px relative rounded-[4px] shrink-0" data-name="属性标签&Property">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#e68600] text-[14px]">人工</p>
    </div>
  );
}

function Component68() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="内容">
      <Property2 />
    </div>
  );
}

function Component69() {
  return (
    <div className="relative shrink-0 w-full z-[13]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pl-[16px] pr-[12px] py-[12px] relative w-full">
          <Component68 />
        </div>
      </div>
    </div>
  );
}

function Property3() {
  return (
    <div className="bg-[#fff0cc] content-stretch flex items-center justify-center px-[8px] py-px relative rounded-[4px] shrink-0" data-name="属性标签&Property">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#e68600] text-[14px]">人工</p>
    </div>
  );
}

function Component70() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="内容">
      <Property3 />
    </div>
  );
}

function Component71() {
  return (
    <div className="relative shrink-0 w-full z-[12]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pl-[16px] pr-[12px] py-[12px] relative w-full">
          <Component70 />
        </div>
      </div>
    </div>
  );
}

function Property4() {
  return (
    <div className="bg-[#fff0cc] content-stretch flex items-center justify-center px-[8px] py-px relative rounded-[4px] shrink-0" data-name="属性标签&Property">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#e68600] text-[14px]">人工</p>
    </div>
  );
}

function Component72() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="内容">
      <Property4 />
    </div>
  );
}

function Component73() {
  return (
    <div className="h-[96px] relative shrink-0 w-full z-[11]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pl-[16px] pr-[12px] py-[12px] relative size-full">
          <Component72 />
        </div>
      </div>
    </div>
  );
}

function Property5() {
  return (
    <div className="bg-[#fff0cc] content-stretch flex items-center justify-center px-[8px] py-px relative rounded-[4px] shrink-0" data-name="属性标签&Property">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#e68600] text-[14px]">人工</p>
    </div>
  );
}

function Component74() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="内容">
      <Property5 />
    </div>
  );
}

function Component75() {
  return (
    <div className="h-[96px] relative shrink-0 w-full z-[10]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pl-[16px] pr-[12px] py-[12px] relative size-full">
          <Component74 />
        </div>
      </div>
    </div>
  );
}

function Property6() {
  return (
    <div className="bg-[#fff0cc] content-stretch flex items-center justify-center px-[8px] py-px relative rounded-[4px] shrink-0" data-name="属性标签&Property">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#e68600] text-[14px]">人工</p>
    </div>
  );
}

function Component76() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="内容">
      <Property6 />
    </div>
  );
}

function Component77() {
  return (
    <div className="relative shrink-0 w-full z-[9]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pl-[16px] pr-[12px] py-[12px] relative w-full">
          <Component76 />
        </div>
      </div>
    </div>
  );
}

function Property7() {
  return (
    <div className="bg-[#fff0cc] content-stretch flex items-center justify-center px-[8px] py-px relative rounded-[4px] shrink-0" data-name="属性标签&Property">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#e68600] text-[14px]">人工</p>
    </div>
  );
}

function Component78() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="内容">
      <Property7 />
    </div>
  );
}

function Component79() {
  return (
    <div className="relative shrink-0 w-full z-[8]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pl-[16px] pr-[12px] py-[12px] relative w-full">
          <Component78 />
        </div>
      </div>
    </div>
  );
}

function Property8() {
  return (
    <div className="bg-[#fff0cc] content-stretch flex items-center justify-center px-[8px] py-px relative rounded-[4px] shrink-0" data-name="属性标签&Property">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#e68600] text-[14px]">人工</p>
    </div>
  );
}

function Component80() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="内容">
      <Property8 />
    </div>
  );
}

function Component81() {
  return (
    <div className="relative shrink-0 w-full z-[7]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pl-[16px] pr-[12px] py-[12px] relative w-full">
          <Component80 />
        </div>
      </div>
    </div>
  );
}

function Property9() {
  return (
    <div className="bg-[#fff0cc] content-stretch flex items-center justify-center px-[8px] py-px relative rounded-[4px] shrink-0" data-name="属性标签&Property">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#e68600] text-[14px]">人工</p>
    </div>
  );
}

function Component82() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="内容">
      <Property9 />
    </div>
  );
}

function Component83() {
  return (
    <div className="relative shrink-0 w-full z-[6]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pl-[16px] pr-[12px] py-[12px] relative w-full">
          <Component82 />
        </div>
      </div>
    </div>
  );
}

function Property10() {
  return (
    <div className="bg-[#fff0cc] content-stretch flex items-center justify-center px-[8px] py-px relative rounded-[4px] shrink-0" data-name="属性标签&Property">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#e68600] text-[14px]">人工</p>
    </div>
  );
}

function Component84() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="内容">
      <Property10 />
    </div>
  );
}

function Component85() {
  return (
    <div className="relative shrink-0 w-full z-[5]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pl-[16px] pr-[12px] py-[12px] relative w-full">
          <Component84 />
        </div>
      </div>
    </div>
  );
}

function Property11() {
  return (
    <div className="bg-[#fff0cc] content-stretch flex items-center justify-center px-[8px] py-px relative rounded-[4px] shrink-0" data-name="属性标签&Property">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#e68600] text-[14px]">人工</p>
    </div>
  );
}

function Component86() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="内容">
      <Property11 />
    </div>
  );
}

function Component87() {
  return (
    <div className="relative shrink-0 w-full z-[4]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pl-[16px] pr-[12px] py-[12px] relative w-full">
          <Component86 />
        </div>
      </div>
    </div>
  );
}

function Property12() {
  return (
    <div className="bg-[#fff0cc] content-stretch flex items-center justify-center px-[8px] py-px relative rounded-[4px] shrink-0" data-name="属性标签&Property">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#e68600] text-[14px]">人工</p>
    </div>
  );
}

function Component88() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="内容">
      <Property12 />
    </div>
  );
}

function Component89() {
  return (
    <div className="relative shrink-0 w-full z-[3]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pl-[16px] pr-[12px] py-[12px] relative w-full">
          <Component88 />
        </div>
      </div>
    </div>
  );
}

function Property13() {
  return (
    <div className="bg-[#fff0cc] content-stretch flex items-center justify-center px-[8px] py-px relative rounded-[4px] shrink-0" data-name="属性标签&Property">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#e68600] text-[14px]">人工</p>
    </div>
  );
}

function Component90() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="内容">
      <Property13 />
    </div>
  );
}

function Component91() {
  return (
    <div className="relative shrink-0 w-full z-[2]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pl-[16px] pr-[12px] py-[12px] relative w-full">
          <Component90 />
        </div>
      </div>
    </div>
  );
}

function Property14() {
  return (
    <div className="bg-[#fff0cc] content-stretch flex items-center justify-center px-[8px] py-px relative rounded-[4px] shrink-0" data-name="属性标签&Property">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#e68600] text-[14px]">人工</p>
    </div>
  );
}

function Component92() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="内容">
      <Property14 />
    </div>
  );
}

function Component93() {
  return (
    <div className="relative shrink-0 w-full z-[1]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pl-[16px] pr-[12px] py-[12px] relative w-full">
          <Component92 />
        </div>
      </div>
    </div>
  );
}

function Component94() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px relative" data-name="列内容">
      <Component65 />
      <Component66 />
      <Component67 />
      <Component69 />
      <Component71 />
      <Component73 />
      <Component75 />
      <Component77 />
      <Component79 />
      <Component81 />
      <Component83 />
      <Component85 />
      <Component87 />
      <Component89 />
      <Component91 />
      <Component93 />
    </div>
  );
}

function Component95() {
  return (
    <div className="relative shrink-0 w-[88px] z-[9]" data-name="列">
      <div className="content-stretch flex items-start overflow-clip relative rounded-[inherit] w-full">
        <Component94 />
      </div>
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Component96() {
  return (
    <div className="bg-[#f1f4f6] h-[38px] relative shrink-0 w-full z-[16]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-1px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="css-g0mm18 font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full">操作人</p>
        </div>
      </div>
    </div>
  );
}

function Component97() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">--</p>
    </div>
  );
}

function Component98() {
  return (
    <div className="h-[96px] relative shrink-0 w-full z-[15]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <Component97 />
        </div>
      </div>
    </div>
  );
}

function Component99() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="内容">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#1b2129] text-[14px] text-ellipsis">--</p>
    </div>
  );
}

function Component100() {
  return (
    <div className="relative shrink-0 w-full z-[14]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component99 />
        </div>
      </div>
    </div>
  );
}

function Component101() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">杨跃进</p>
    </div>
  );
}

function Component102() {
  return (
    <div className="relative shrink-0 w-full z-[13]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component101 />
        </div>
      </div>
    </div>
  );
}

function Component103() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">陈三</p>
    </div>
  );
}

function Component104() {
  return (
    <div className="relative shrink-0 w-full z-[12]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component103 />
        </div>
      </div>
    </div>
  );
}

function Component105() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">马明亮</p>
    </div>
  );
}

function Component106() {
  return (
    <div className="h-[96px] relative shrink-0 w-full z-[11]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <Component105 />
        </div>
      </div>
    </div>
  );
}

function Component107() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">马明亮</p>
    </div>
  );
}

function Component108() {
  return (
    <div className="h-[96px] relative shrink-0 w-full z-[10]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <Component107 />
        </div>
      </div>
    </div>
  );
}

function Component109() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">林九</p>
    </div>
  );
}

function Component110() {
  return (
    <div className="relative shrink-0 w-full z-[9]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component109 />
        </div>
      </div>
    </div>
  );
}

function Component111() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">周壮志</p>
    </div>
  );
}

function Component112() {
  return (
    <div className="relative shrink-0 w-full z-[8]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component111 />
        </div>
      </div>
    </div>
  );
}

function Component113() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">朱雄心</p>
    </div>
  );
}

function Component114() {
  return (
    <div className="relative shrink-0 w-full z-[7]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component113 />
        </div>
      </div>
    </div>
  );
}

function Component115() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">黄七</p>
    </div>
  );
}

function Component116() {
  return (
    <div className="relative shrink-0 w-full z-[6]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component115 />
        </div>
      </div>
    </div>
  );
}

function Component117() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">王立业</p>
    </div>
  );
}

function Component118() {
  return (
    <div className="relative shrink-0 w-full z-[5]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component117 />
        </div>
      </div>
    </div>
  );
}

function Component119() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">吴建国</p>
    </div>
  );
}

function Component120() {
  return (
    <div className="relative shrink-0 w-full z-[4]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component119 />
        </div>
      </div>
    </div>
  );
}

function Component121() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">徐进步</p>
    </div>
  );
}

function Component122() {
  return (
    <div className="relative shrink-0 w-full z-[3]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component121 />
        </div>
      </div>
    </div>
  );
}

function Component123() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">罗小明</p>
    </div>
  );
}

function Component124() {
  return (
    <div className="relative shrink-0 w-full z-[2]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component123 />
        </div>
      </div>
    </div>
  );
}

function Component125() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">宋胜利</p>
    </div>
  );
}

function Component126() {
  return (
    <div className="relative shrink-0 w-full z-[1]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component125 />
        </div>
      </div>
    </div>
  );
}

function Component127() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component96 />
      <Component98 />
      <Component100 />
      <Component102 />
      <Component104 />
      <Component106 />
      <Component108 />
      <Component110 />
      <Component112 />
      <Component114 />
      <Component116 />
      <Component118 />
      <Component120 />
      <Component122 />
      <Component124 />
      <Component126 />
    </div>
  );
}

function Component128() {
  return (
    <div className="relative shrink-0 w-[88px] z-[8]" data-name="列">
      <div className="content-stretch flex items-start overflow-clip relative rounded-[inherit] w-full">
        <Component127 />
      </div>
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Component129() {
  return (
    <div className="bg-[#f1f4f6] h-[38px] relative shrink-0 w-full z-[16]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-1px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="css-g0mm18 font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full">操作对象</p>
        </div>
      </div>
    </div>
  );
}

function Component130() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">末端空调设备_1</p>
    </div>
  );
}

function Component131() {
  return (
    <div className="h-[96px] relative shrink-0 w-full z-[15]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <Component130 />
        </div>
      </div>
    </div>
  );
}

function Component132() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="内容">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#1b2129] text-[14px] text-ellipsis">末端空调设备_2</p>
    </div>
  );
}

function Component133() {
  return (
    <div className="relative shrink-0 w-full z-[14]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component132 />
        </div>
      </div>
    </div>
  );
}

function Component134() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">2#空调机房</p>
    </div>
  );
}

function Component135() {
  return (
    <div className="relative shrink-0 w-full z-[13]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component134 />
        </div>
      </div>
    </div>
  );
}

function Component136() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">A_F1_东区男卫生间</p>
    </div>
  );
}

function Component137() {
  return (
    <div className="relative shrink-0 w-full z-[12]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component136 />
        </div>
      </div>
    </div>
  );
}

function Component138() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">A_F1_东区男卫生间</p>
    </div>
  );
}

function Component139() {
  return (
    <div className="h-[96px] relative shrink-0 w-full z-[11]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <Component138 />
        </div>
      </div>
    </div>
  );
}

function Component140() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">A_F1_东区男卫生间</p>
    </div>
  );
}

function Component141() {
  return (
    <div className="h-[96px] relative shrink-0 w-full z-[10]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <Component140 />
        </div>
      </div>
    </div>
  );
}

function Component142() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">A_F1_东区男卫生间</p>
    </div>
  );
}

function Component143() {
  return (
    <div className="relative shrink-0 w-full z-[9]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component142 />
        </div>
      </div>
    </div>
  );
}

function Component144() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">A_F1_东区男卫生间</p>
    </div>
  );
}

function Component145() {
  return (
    <div className="relative shrink-0 w-full z-[8]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component144 />
        </div>
      </div>
    </div>
  );
}

function Component146() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">A_F1_东区男卫生间</p>
    </div>
  );
}

function Component147() {
  return (
    <div className="relative shrink-0 w-full z-[7]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component146 />
        </div>
      </div>
    </div>
  );
}

function Component148() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">A_F1_东区男卫生间</p>
    </div>
  );
}

function Component149() {
  return (
    <div className="relative shrink-0 w-full z-[6]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component148 />
        </div>
      </div>
    </div>
  );
}

function Component150() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">A_F1_东区男卫生间</p>
    </div>
  );
}

function Component151() {
  return (
    <div className="relative shrink-0 w-full z-[5]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component150 />
        </div>
      </div>
    </div>
  );
}

function Component152() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">A_F1_东区男卫生间</p>
    </div>
  );
}

function Component153() {
  return (
    <div className="relative shrink-0 w-full z-[4]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component152 />
        </div>
      </div>
    </div>
  );
}

function Component154() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">A_F1_东区男卫生间</p>
    </div>
  );
}

function Component155() {
  return (
    <div className="relative shrink-0 w-full z-[3]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component154 />
        </div>
      </div>
    </div>
  );
}

function Component156() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">A_F1_东区男卫生间</p>
    </div>
  );
}

function Component157() {
  return (
    <div className="relative shrink-0 w-full z-[2]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component156 />
        </div>
      </div>
    </div>
  );
}

function Component158() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">未恢复</p>
    </div>
  );
}

function Component159() {
  return (
    <div className="relative shrink-0 w-full z-[1]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component158 />
        </div>
      </div>
    </div>
  );
}

function Component160() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component129 />
      <Component131 />
      <Component133 />
      <Component135 />
      <Component137 />
      <Component139 />
      <Component141 />
      <Component143 />
      <Component145 />
      <Component147 />
      <Component149 />
      <Component151 />
      <Component153 />
      <Component155 />
      <Component157 />
      <Component159 />
    </div>
  );
}

function Component161() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative z-[7]" data-name="列">
      <div className="content-stretch flex items-start overflow-clip relative rounded-[inherit] w-full">
        <Component160 />
      </div>
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Component162() {
  return (
    <div className="bg-[#f1f4f6] h-[38px] relative shrink-0 w-full z-[16]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-1px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis">操作内容</p>
        </div>
      </div>
    </div>
  );
}

function Component163() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative w-full" data-name="内容">
      <p className="css-4hzbpn flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] min-h-px min-w-px not-italic relative text-[#1b2129] text-[14px]">末端空调设备_1发生了控反不一致报警</p>
    </div>
  );
}

function Component164() {
  return (
    <div className="h-[96px] relative shrink-0 w-full z-[15]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <Component163 />
        </div>
      </div>
    </div>
  );
}

function Component165() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">末端空调设备_2发生了离线报警</p>
    </div>
  );
}

function Component166() {
  return (
    <div className="relative shrink-0 w-full z-[14]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component165 />
        </div>
      </div>
    </div>
  );
}

function Component167() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">关闭设备</p>
    </div>
  );
}

function Component168() {
  return (
    <div className="relative shrink-0 w-full z-[13]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component167 />
        </div>
      </div>
    </div>
  );
}

function Component169() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">关闭设备</p>
    </div>
  );
}

function Component170() {
  return (
    <div className="relative shrink-0 w-full z-[12]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component169 />
        </div>
      </div>
    </div>
  );
}

function Component171() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative w-full" data-name="内容">
      <p className="css-4hzbpn flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] min-h-px min-w-px not-italic relative text-[#1b2129] text-[14px]">切换价值选择：由能耗最低切换为品质优先</p>
    </div>
  );
}

function Component172() {
  return (
    <div className="h-[96px] relative shrink-0 w-full z-[11]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <Component171 />
        </div>
      </div>
    </div>
  );
}

function Component173() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative w-full" data-name="内容">
      <p className="css-4hzbpn flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[0] min-h-px min-w-px not-italic relative text-[#1b2129] text-[14px]">
        <span className="leading-[22px]">调整</span>
        <span className="leading-[22px]">基本信息</span>
      </p>
    </div>
  );
}

function Component174() {
  return (
    <div className="h-[96px] relative shrink-0 w-full z-[10]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <Component173 />
        </div>
      </div>
    </div>
  );
}

function Component175() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">关闭设备</p>
    </div>
  );
}

function Component176() {
  return (
    <div className="relative shrink-0 w-full z-[9]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component175 />
        </div>
      </div>
    </div>
  );
}

function Component177() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">关闭设备</p>
    </div>
  );
}

function Component178() {
  return (
    <div className="relative shrink-0 w-full z-[8]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component177 />
        </div>
      </div>
    </div>
  );
}

function Component179() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">关闭设备</p>
    </div>
  );
}

function Component180() {
  return (
    <div className="relative shrink-0 w-full z-[7]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component179 />
        </div>
      </div>
    </div>
  );
}

function Component181() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">关闭设备</p>
    </div>
  );
}

function Component182() {
  return (
    <div className="relative shrink-0 w-full z-[6]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component181 />
        </div>
      </div>
    </div>
  );
}

function Component183() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">关闭设备</p>
    </div>
  );
}

function Component184() {
  return (
    <div className="relative shrink-0 w-full z-[5]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component183 />
        </div>
      </div>
    </div>
  );
}

function Component185() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">关闭设备</p>
    </div>
  );
}

function Component186() {
  return (
    <div className="relative shrink-0 w-full z-[4]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component185 />
        </div>
      </div>
    </div>
  );
}

function Component187() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">关闭设备</p>
    </div>
  );
}

function Component188() {
  return (
    <div className="relative shrink-0 w-full z-[3]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component187 />
        </div>
      </div>
    </div>
  );
}

function Component189() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">关闭设备</p>
    </div>
  );
}

function Component190() {
  return (
    <div className="relative shrink-0 w-full z-[2]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component189 />
        </div>
      </div>
    </div>
  );
}

function Component191() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">2023.09.08 01:00</p>
    </div>
  );
}

function Component192() {
  return (
    <div className="relative shrink-0 w-full z-[1]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component191 />
        </div>
      </div>
    </div>
  );
}

function Component193() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component162 />
      <Component164 />
      <Component166 />
      <Component168 />
      <Component170 />
      <Component172 />
      <Component174 />
      <Component176 />
      <Component178 />
      <Component180 />
      <Component182 />
      <Component184 />
      <Component186 />
      <Component188 />
      <Component190 />
      <Component192 />
    </div>
  );
}

function Component194() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative z-[6]" data-name="列">
      <div className="content-stretch flex items-start overflow-clip relative rounded-[inherit] w-full">
        <Component193 />
      </div>
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Component195() {
  return (
    <div className="bg-[#f1f4f6] h-[38px] relative shrink-0 w-full z-[14]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-1px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis">生效时间</p>
        </div>
      </div>
    </div>
  );
}

function Component196() {
  return (
    <div className="content-stretch flex gap-[8px] h-[70px] items-center relative shrink-0 w-full" data-name="内容">
      <div className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">
        <p className="css-4hzbpn mb-0">2023.08.23 13:00:00-</p>
        <p className="css-4hzbpn">2023.08.23 16:00:00</p>
      </div>
    </div>
  );
}

function Component197() {
  return (
    <div className="relative shrink-0 w-full z-[13]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component196 />
        </div>
      </div>
    </div>
  );
}

function Component198() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">{`2023.08.23 - 至今 `}</p>
    </div>
  );
}

function Component199() {
  return (
    <div className="relative shrink-0 w-full z-[12]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component198 />
        </div>
      </div>
    </div>
  );
}

function Component200() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">--</p>
    </div>
  );
}

function Component201() {
  return (
    <div className="relative shrink-0 w-full z-[11]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component200 />
        </div>
      </div>
    </div>
  );
}

function Component202() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">--</p>
    </div>
  );
}

function Component203() {
  return (
    <div className="relative shrink-0 w-full z-[10]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component202 />
        </div>
      </div>
    </div>
  );
}

function Component204() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative w-full" data-name="内容">
      <div className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">
        <p className="css-4hzbpn mb-0">2023.08.23 13:00:00-</p>
        <p className="css-4hzbpn">2023.08.23 16:00:00</p>
      </div>
    </div>
  );
}

function Component205() {
  return (
    <div className="h-[96px] relative shrink-0 w-full z-[9]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <Component204 />
        </div>
      </div>
    </div>
  );
}

function Component206() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative w-full" data-name="内容">
      <div className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">
        <p className="css-4hzbpn mb-0">2023.08.23 13:00:00-</p>
        <p className="css-4hzbpn">2023.08.23 16:00:00</p>
      </div>
    </div>
  );
}

function Component207() {
  return (
    <div className="h-[96px] relative shrink-0 w-full z-[8]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <Component206 />
        </div>
      </div>
    </div>
  );
}

function Component208() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">--</p>
    </div>
  );
}

function Component209() {
  return (
    <div className="relative shrink-0 w-full z-[7]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component208 />
        </div>
      </div>
    </div>
  );
}

function Component210() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">--</p>
    </div>
  );
}

function Component211() {
  return (
    <div className="relative shrink-0 w-full z-[6]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component210 />
        </div>
      </div>
    </div>
  );
}

function Component212() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">--</p>
    </div>
  );
}

function Component213() {
  return (
    <div className="relative shrink-0 w-full z-[5]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component212 />
        </div>
      </div>
    </div>
  );
}

function Component214() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">--</p>
    </div>
  );
}

function Component215() {
  return (
    <div className="relative shrink-0 w-full z-[4]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component214 />
        </div>
      </div>
    </div>
  );
}

function Component216() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">12小时</p>
    </div>
  );
}

function Component217() {
  return (
    <div className="relative shrink-0 w-full z-[3]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component216 />
        </div>
      </div>
    </div>
  );
}

function Component218() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">12小时</p>
    </div>
  );
}

function Component219() {
  return (
    <div className="relative shrink-0 w-full z-[2]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component218 />
        </div>
      </div>
    </div>
  );
}

function Component220() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">12小时</p>
    </div>
  );
}

function Component221() {
  return (
    <div className="relative shrink-0 w-full z-[1]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component220 />
        </div>
      </div>
    </div>
  );
}

function Component222() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component195 />
      <Component197 />
      <Component199 />
      <Component201 />
      <Component203 />
      <Component205 />
      <Component207 />
      <Component209 />
      <Component211 />
      <Component213 />
      <Component215 />
      <Component217 />
      <Component219 />
      <Component221 />
    </div>
  );
}

function Component223() {
  return (
    <div className="relative shrink-0 w-[167px] z-[5]" data-name="列">
      <div className="content-stretch flex items-start overflow-clip relative rounded-[inherit] w-full">
        <Component222 />
      </div>
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Component224() {
  return (
    <div className="bg-[#f1f4f6] h-[38px] relative shrink-0 w-full z-[16]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-1px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis">操作原因</p>
        </div>
      </div>
    </div>
  );
}

function Component225() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">--</p>
    </div>
  );
}

function Component226() {
  return (
    <div className="h-[96px] relative shrink-0 w-full z-[15]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <Component225 />
        </div>
      </div>
    </div>
  );
}

function Component227() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">--</p>
    </div>
  );
}

function Component228() {
  return (
    <div className="relative shrink-0 w-full z-[14]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component227 />
        </div>
      </div>
    </div>
  );
}

function Component229() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">整体供冷量不足</p>
    </div>
  );
}

function Component230() {
  return (
    <div className="relative shrink-0 w-full z-[13]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component229 />
        </div>
      </div>
    </div>
  );
}

function Component231() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">整体供冷量不足</p>
    </div>
  );
}

function Component232() {
  return (
    <div className="relative shrink-0 w-full z-[12]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component231 />
        </div>
      </div>
    </div>
  );
}

function Component233() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">整体供冷量不足</p>
    </div>
  );
}

function Component234() {
  return (
    <div className="h-[96px] relative shrink-0 w-full z-[11]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <Component233 />
        </div>
      </div>
    </div>
  );
}

function Component235() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">整体供冷量不足</p>
    </div>
  );
}

function Component236() {
  return (
    <div className="h-[96px] relative shrink-0 w-full z-[10]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <Component235 />
        </div>
      </div>
    </div>
  );
}

function Component237() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">--</p>
    </div>
  );
}

function Component238() {
  return (
    <div className="relative shrink-0 w-full z-[9]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component237 />
        </div>
      </div>
    </div>
  );
}

function Component239() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">超时自动恢复</p>
    </div>
  );
}

function Component240() {
  return (
    <div className="relative shrink-0 w-full z-[8]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component239 />
        </div>
      </div>
    </div>
  );
}

function Component241() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">超时自动恢复</p>
    </div>
  );
}

function Component242() {
  return (
    <div className="relative shrink-0 w-full z-[7]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component241 />
        </div>
      </div>
    </div>
  );
}

function Component243() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">超时自动恢复</p>
    </div>
  );
}

function Component244() {
  return (
    <div className="relative shrink-0 w-full z-[6]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component243 />
        </div>
      </div>
    </div>
  );
}

function Component245() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">F03-燃气表018</p>
    </div>
  );
}

function Component246() {
  return (
    <div className="relative shrink-0 w-full z-[5]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component245 />
        </div>
      </div>
    </div>
  );
}

function Component247() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">F03-燃气表019</p>
    </div>
  );
}

function Component248() {
  return (
    <div className="relative shrink-0 w-full z-[4]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component247 />
        </div>
      </div>
    </div>
  );
}

function Component249() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">F03-燃气表020</p>
    </div>
  );
}

function Component250() {
  return (
    <div className="relative shrink-0 w-full z-[3]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component249 />
        </div>
      </div>
    </div>
  );
}

function Component251() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">F03-燃气表013</p>
    </div>
  );
}

function Component252() {
  return (
    <div className="relative shrink-0 w-full z-[2]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component251 />
        </div>
      </div>
    </div>
  );
}

function Component253() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">F03-燃气表013</p>
    </div>
  );
}

function Component254() {
  return (
    <div className="relative shrink-0 w-full z-[1]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component253 />
        </div>
      </div>
    </div>
  );
}

function Component255() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component224 />
      <Component226 />
      <Component228 />
      <Component230 />
      <Component232 />
      <Component234 />
      <Component236 />
      <Component238 />
      <Component240 />
      <Component242 />
      <Component244 />
      <Component246 />
      <Component248 />
      <Component250 />
      <Component252 />
      <Component254 />
    </div>
  );
}

function Component256() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px overflow-clip relative z-[3]" data-name="列">
      <Component255 />
    </div>
  );
}

function Component257() {
  return <div className="absolute bg-white h-[96px] left-0 right-0 top-0" data-name="列" />;
}

function Component258() {
  return <div className="absolute bg-white h-[48px] left-0 right-0 top-[96px]" data-name="列" />;
}

function Component259() {
  return <div className="absolute bg-white h-[48px] left-0 right-0 top-[144px]" data-name="列" />;
}

function Component260() {
  return <div className="absolute bg-white h-[48px] left-0 right-0 top-[192px]" data-name="列" />;
}

function Component261() {
  return <div className="-translate-y-1/2 absolute bg-white h-[48px] left-0 right-0 top-[calc(50%-24px)]" data-name="列" />;
}

function Component262() {
  return <div className="absolute bg-white h-[48px] left-0 right-0 top-[288px]" data-name="列" />;
}

function Component263() {
  return <div className="absolute bg-white h-[48px] left-0 right-0 top-[336px]" data-name="列" />;
}

function Component264() {
  return <div className="absolute bg-white h-[48px] left-0 right-0 top-[384px]" data-name="列" />;
}

function Component265() {
  return <div className="absolute bg-white h-[48px] left-0 right-0 top-[432px]" data-name="列" />;
}

function Component266() {
  return <div className="absolute bg-white h-[48px] left-0 right-0 top-[480px]" data-name="列" />;
}

function Component267() {
  return <div className="absolute bg-white h-[48px] left-0 right-0 top-[528px]" data-name="列" />;
}

function Component268() {
  return <div className="absolute bg-white h-[48px] left-0 right-0 top-[576px]" data-name="列" />;
}

function Bg() {
  return (
    <div className="absolute h-[576px] left-0 right-0 top-[38px] z-[1]" data-name="bg">
      <Component257 />
      <Component258 />
      <Component259 />
      <Component260 />
      <Component261 />
      <Component262 />
      <Component263 />
      <Component264 />
      <Component265 />
      <Component266 />
      <Component267 />
      <Component268 />
    </div>
  );
}

function Data() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-[4px] w-full" data-name="data">
      <div className="content-stretch flex isolate items-start overflow-clip relative rounded-[inherit] size-full">
        <Component32 />
        <Component64 />
        <Component95 />
        <Component128 />
        <Component161 />
        <Component194 />
        <Component223 />
        <Component256 />
        <Bg />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e1e5eb] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Padding() {
  return (
    <div className="h-[518px] relative shrink-0 w-full" data-name="padding">
      <div className="content-stretch flex flex-col items-start px-[24px] relative size-full">
        <Data />
      </div>
    </div>
  );
}

export default function Popup() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[12px] items-start overflow-clip relative rounded-[8px] shadow-[0px_20px_30px_0px_rgba(27,33,41,0.15)] size-full" data-name="弹窗&Popup">
      <Title />
      <Padding />
    </div>
  );
}