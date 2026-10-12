import svgPaths from "./svg-no0rz5so26";

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
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#2e3742] text-[16px]">时间表</p>
          <CommonClose />
        </div>
      </div>
    </div>
  );
}

function Placeholder() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placeholder" />;
}

function TableTitle() {
  return (
    <div className="bg-[#f1f4f6] h-[48px] relative shrink-0 w-full" data-name="table-title">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col gap-[4px] items-start justify-center pl-[16px] pr-[12px] pt-[4px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#626c78] text-[12px]">12:00</p>
          <Placeholder />
        </div>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="bg-gradient-to-r from-[rgba(100,166,247,0.12)] h-[22px] relative rounded-[2px] shrink-0 to-[rgba(100,166,247,0)] w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center p-[4px] relative size-full">
          <div className="flex flex-[1_0_0] flex-col font-['Microsoft_YaHei_UI:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#246fe5] text-[14px]">
            <p className="css-4hzbpn leading-[15.652px]">供冷</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Property() {
  return (
    <div className="bg-[#e8ecf0] content-stretch flex h-[16px] items-center justify-center px-[4px] relative rounded-[2px] shrink-0" data-name="属性标签&Property">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#1b2129] text-[12px]">冷机供冷</p>
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex items-start pt-[10px] relative self-stretch shrink-0">
      <div className="relative shrink-0 size-[4px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
          <circle cx="2" cy="2" fill="var(--fill-0, #8B949E)" id="Ellipse 3011" r="2" />
        </svg>
      </div>
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex gap-[4px] items-start relative shrink-0 w-full">
      <Frame21 />
      <div className="flex flex-[1_0_0] flex-col font-['Microsoft_YaHei_UI:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#626c78] text-[14px]">
        <p className="css-4hzbpn leading-[22px]">冷冻水出水温度 12°C 持续时长120min</p>
      </div>
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex h-full items-start pt-[10px] relative shrink-0">
      <div className="relative shrink-0 size-[4px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
          <circle cx="2" cy="2" fill="var(--fill-0, #8B949E)" id="Ellipse 3011" r="2" />
        </svg>
      </div>
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
      <div className="flex flex-row items-center self-stretch">
        <Frame22 />
      </div>
      <div className="flex flex-[1_0_0] flex-col font-['Microsoft_YaHei_UI:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#626c78] text-[14px]">
        <p className="css-4hzbpn leading-[22px]">螺杆机-2大1小，持续时长120min</p>
      </div>
    </div>
  );
}

function TableCell() {
  return (
    <div className="relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border border-[#e1e5eb] border-solid inset-[-0.5px] pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[8px] items-start pl-[16px] pr-[12px] py-[13px] relative w-full">
        <Frame1 />
        <Property />
        <Frame16 />
        <Frame17 />
      </div>
    </div>
  );
}

function Frame18() {
  return (
    <div className="bg-gradient-to-r from-[rgba(0,162,167,0.12)] h-[22px] relative rounded-[2px] shrink-0 to-[rgba(0,162,167,0)] w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center p-[4px] relative size-full">
          <div className="flex flex-[1_0_0] flex-col font-['Microsoft_YaHei_UI:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#00a2a7] text-[14px]">
            <p className="css-4hzbpn leading-[15.652px]">蓄冷</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex items-start pt-[10px] relative self-stretch shrink-0">
      <div className="relative shrink-0 size-[4px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
          <circle cx="2" cy="2" fill="var(--fill-0, #8B949E)" id="Ellipse 3011" r="2" />
        </svg>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex gap-[4px] items-start relative shrink-0 w-full">
      <Frame23 />
      <div className="flex flex-[1_0_0] flex-col font-['Microsoft_YaHei_UI:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#626c78] text-[14px]">
        <p className="css-4hzbpn leading-[24px]">双工况冷机-3大1小，持续时长120min</p>
      </div>
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex items-start pt-[10px] relative self-stretch shrink-0">
      <div className="relative shrink-0 size-[4px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
          <circle cx="2" cy="2" fill="var(--fill-0, #8B949E)" id="Ellipse 3011" r="2" />
        </svg>
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex gap-[4px] items-start relative shrink-0 w-full">
      <Frame24 />
      <div className="flex flex-[1_0_0] flex-col font-['Microsoft_YaHei_UI:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#626c78] text-[14px]">
        <p className="css-4hzbpn leading-[24px]">冷冻水出水温度 12°C，持续时长120min</p>
      </div>
    </div>
  );
}

function TableCell1() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border border-[#e1e5eb] border-solid inset-[-0.5px] pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[8px] items-start pl-[16px] pr-[12px] py-[13px] relative size-full">
        <Frame18 />
        <Frame6 />
        <Frame7 />
      </div>
    </div>
  );
}

function Column() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-[478px] items-start min-h-px min-w-px overflow-clip relative" data-name="column">
      <TableTitle />
      <TableCell />
      <TableCell1 />
    </div>
  );
}

function TableColumn() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative" data-name="table-column">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-0.5px_0_0] pointer-events-none" />
      <Column />
    </div>
  );
}

function Placeholder1() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placeholder" />;
}

function TableTitle1() {
  return (
    <div className="bg-[#f1f4f6] h-[48px] relative shrink-0 w-full" data-name="table-title">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col gap-[4px] items-start justify-center pl-[16px] pr-[12px] pt-[4px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#626c78] text-[12px]">13:00</p>
          <Placeholder1 />
        </div>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="bg-gradient-to-r from-[rgba(100,166,247,0.12)] h-[22px] relative rounded-[2px] shrink-0 to-[rgba(100,166,247,0)] w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center p-[4px] relative size-full">
          <div className="flex flex-[1_0_0] flex-col font-['Microsoft_YaHei_UI:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#246fe5] text-[14px]">
            <p className="css-4hzbpn leading-[15.652px]">供冷</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Property1() {
  return (
    <div className="bg-[#e8ecf0] content-stretch flex h-[16px] items-center justify-center px-[4px] relative rounded-[2px] shrink-0" data-name="属性标签&Property">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#1b2129] text-[12px]">冷机供冷</p>
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex items-start pt-[10px] relative self-stretch shrink-0">
      <div className="relative shrink-0 size-[4px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
          <circle cx="2" cy="2" fill="var(--fill-0, #8B949E)" id="Ellipse 3011" r="2" />
        </svg>
      </div>
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex gap-[4px] items-start relative shrink-0 w-full">
      <Frame25 />
      <div className="flex flex-[1_0_0] flex-col font-['Microsoft_YaHei_UI:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#626c78] text-[14px]">
        <p className="css-4hzbpn leading-[22px]">冷冻水出水温度 12°C 持续时长120min</p>
      </div>
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex h-full items-start pt-[10px] relative shrink-0">
      <div className="relative shrink-0 size-[4px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
          <circle cx="2" cy="2" fill="var(--fill-0, #8B949E)" id="Ellipse 3011" r="2" />
        </svg>
      </div>
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
      <div className="flex flex-row items-center self-stretch">
        <Frame26 />
      </div>
      <div className="flex flex-[1_0_0] flex-col font-['Microsoft_YaHei_UI:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#626c78] text-[14px]">
        <p className="css-4hzbpn leading-[22px]">螺杆机-2大1小，持续时长120min</p>
      </div>
    </div>
  );
}

function TableCell2() {
  return (
    <div className="relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border border-[#e1e5eb] border-solid inset-[-0.5px] pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[8px] items-start pl-[16px] pr-[12px] py-[13px] relative w-full">
        <Frame2 />
        <Property1 />
        <Frame19 />
        {[...Array(2).keys()].map((_, i) => (
          <Frame20 key={i} />
        ))}
      </div>
    </div>
  );
}

function Frame27() {
  return (
    <div className="bg-gradient-to-r from-[rgba(0,162,167,0.12)] h-[22px] relative rounded-[2px] shrink-0 to-[rgba(0,162,167,0)] w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center p-[4px] relative size-full">
          <div className="flex flex-[1_0_0] flex-col font-['Microsoft_YaHei_UI:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#00a2a7] text-[14px]">
            <p className="css-4hzbpn leading-[15.652px]">蓄冷</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame28() {
  return (
    <div className="content-stretch flex items-start pt-[10px] relative self-stretch shrink-0">
      <div className="relative shrink-0 size-[4px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
          <circle cx="2" cy="2" fill="var(--fill-0, #8B949E)" id="Ellipse 3011" r="2" />
        </svg>
      </div>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex gap-[4px] items-start relative shrink-0 w-full">
      <Frame28 />
      <div className="flex flex-[1_0_0] flex-col font-['Microsoft_YaHei_UI:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#626c78] text-[14px]">
        <p className="css-4hzbpn leading-[24px]">双工况冷机-3大1小，持续时长120min</p>
      </div>
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex items-start pt-[10px] relative self-stretch shrink-0">
      <div className="relative shrink-0 size-[4px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
          <circle cx="2" cy="2" fill="var(--fill-0, #8B949E)" id="Ellipse 3011" r="2" />
        </svg>
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex gap-[4px] items-start relative shrink-0 w-full">
      <Frame29 />
      <div className="flex flex-[1_0_0] flex-col font-['Microsoft_YaHei_UI:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#626c78] text-[14px]">
        <p className="css-4hzbpn leading-[24px]">冷冻水出水温度 12°C，持续时长120min</p>
      </div>
    </div>
  );
}

function TableCell3() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border border-[#e1e5eb] border-solid inset-[-0.5px] pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[8px] items-start pl-[16px] pr-[12px] py-[13px] relative size-full">
        <Frame27 />
        <Frame8 />
        <Frame9 />
      </div>
    </div>
  );
}

function Column1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-[478px] items-start min-h-px min-w-px overflow-clip relative" data-name="column">
      <TableTitle1 />
      <TableCell2 />
      <TableCell3 />
    </div>
  );
}

function TableColumn1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative" data-name="table-column">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-0.5px_0_0] pointer-events-none" />
      <Column1 />
    </div>
  );
}

function Placeholder2() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placeholder" />;
}

function TableTitle2() {
  return (
    <div className="bg-[#f1f4f6] h-[48px] relative shrink-0 w-full" data-name="table-title">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col gap-[4px] items-start justify-center pl-[16px] pr-[12px] pt-[4px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#626c78] text-[12px]">17:00</p>
          <Placeholder2 />
        </div>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="bg-gradient-to-r from-[rgba(100,166,247,0.12)] h-[22px] relative rounded-[2px] shrink-0 to-[rgba(100,166,247,0)] w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center p-[4px] relative size-full">
          <div className="flex flex-[1_0_0] flex-col font-['Microsoft_YaHei_UI:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#246fe5] text-[14px]">
            <p className="css-4hzbpn leading-[15.652px]">供冷</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Property2() {
  return (
    <div className="bg-[#e8ecf0] content-stretch flex h-[16px] items-center justify-center px-[4px] relative rounded-[2px] shrink-0" data-name="属性标签&Property">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#1b2129] text-[12px]">冷机供冷</p>
    </div>
  );
}

function Frame30() {
  return (
    <div className="content-stretch flex items-start pt-[10px] relative self-stretch shrink-0">
      <div className="relative shrink-0 size-[4px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
          <circle cx="2" cy="2" fill="var(--fill-0, #8B949E)" id="Ellipse 3011" r="2" />
        </svg>
      </div>
    </div>
  );
}

function Frame31() {
  return (
    <div className="content-stretch flex gap-[4px] items-start relative shrink-0 w-full">
      <Frame30 />
      <div className="flex flex-[1_0_0] flex-col font-['Microsoft_YaHei_UI:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#626c78] text-[14px]">
        <p className="css-4hzbpn leading-[22px]">冷冻水出水温度 12°C 持续时长120min</p>
      </div>
    </div>
  );
}

function Frame32() {
  return (
    <div className="content-stretch flex h-full items-start pt-[10px] relative shrink-0">
      <div className="relative shrink-0 size-[4px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
          <circle cx="2" cy="2" fill="var(--fill-0, #8B949E)" id="Ellipse 3011" r="2" />
        </svg>
      </div>
    </div>
  );
}

function Frame33() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
      <div className="flex flex-row items-center self-stretch">
        <Frame32 />
      </div>
      <div className="flex flex-[1_0_0] flex-col font-['Microsoft_YaHei_UI:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#626c78] text-[14px]">
        <p className="css-4hzbpn leading-[22px]">螺杆机-2大1小，持续时长120min</p>
      </div>
    </div>
  );
}

function TableCell4() {
  return (
    <div className="relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border border-[#e1e5eb] border-solid inset-[-0.5px] pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[8px] items-start pl-[16px] pr-[12px] py-[13px] relative w-full">
        <Frame3 />
        <Property2 />
        <Frame31 />
        <Frame33 />
      </div>
    </div>
  );
}

function Frame34() {
  return (
    <div className="bg-gradient-to-r from-[rgba(0,162,167,0.12)] h-[22px] relative rounded-[2px] shrink-0 to-[rgba(0,162,167,0)] w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center p-[4px] relative size-full">
          <div className="flex flex-[1_0_0] flex-col font-['Microsoft_YaHei_UI:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#00a2a7] text-[14px]">
            <p className="css-4hzbpn leading-[15.652px]">蓄冷</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame35() {
  return (
    <div className="content-stretch flex items-start pt-[10px] relative self-stretch shrink-0">
      <div className="relative shrink-0 size-[4px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
          <circle cx="2" cy="2" fill="var(--fill-0, #8B949E)" id="Ellipse 3011" r="2" />
        </svg>
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex gap-[4px] items-start relative shrink-0 w-full">
      <Frame35 />
      <div className="flex flex-[1_0_0] flex-col font-['Microsoft_YaHei_UI:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#626c78] text-[14px]">
        <p className="css-4hzbpn leading-[24px]">双工况冷机-3大1小，持续时长120min</p>
      </div>
    </div>
  );
}

function Frame36() {
  return (
    <div className="content-stretch flex items-start pt-[10px] relative self-stretch shrink-0">
      <div className="relative shrink-0 size-[4px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
          <circle cx="2" cy="2" fill="var(--fill-0, #8B949E)" id="Ellipse 3011" r="2" />
        </svg>
      </div>
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex gap-[4px] items-start relative shrink-0 w-full">
      <Frame36 />
      <div className="flex flex-[1_0_0] flex-col font-['Microsoft_YaHei_UI:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#626c78] text-[14px]">
        <p className="css-4hzbpn leading-[24px]">冷冻水出水温度 12°C，持续时长120min</p>
      </div>
    </div>
  );
}

function TableCell5() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border border-[#e1e5eb] border-solid inset-[-0.5px] pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[8px] items-start pl-[16px] pr-[12px] py-[13px] relative size-full">
        <Frame34 />
        <Frame10 />
        <Frame11 />
      </div>
    </div>
  );
}

function Column2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-[478px] items-start min-h-px min-w-px overflow-clip relative" data-name="column">
      <TableTitle2 />
      <TableCell4 />
      <TableCell5 />
    </div>
  );
}

function TableColumn2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative" data-name="table-column">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-0.5px_0_0] pointer-events-none" />
      <Column2 />
    </div>
  );
}

function Placeholder3() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placeholder" />;
}

function TableTitle3() {
  return (
    <div className="bg-[#f1f4f6] h-[48px] relative shrink-0 w-full" data-name="table-title">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col gap-[4px] items-start justify-center pl-[16px] pr-[12px] pt-[4px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#626c78] text-[12px]">18:30</p>
          <Placeholder3 />
        </div>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="bg-gradient-to-r from-[rgba(100,166,247,0.12)] h-[22px] relative rounded-[2px] shrink-0 to-[rgba(100,166,247,0)] w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center p-[4px] relative size-full">
          <div className="flex flex-[1_0_0] flex-col font-['Microsoft_YaHei_UI:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#246fe5] text-[14px]">
            <p className="css-4hzbpn leading-[15.652px]">供冷</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Property3() {
  return (
    <div className="bg-[#e8ecf0] content-stretch flex h-[16px] items-center justify-center px-[4px] relative rounded-[2px] shrink-0" data-name="属性标签&Property">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#1b2129] text-[12px]">冷机供冷</p>
    </div>
  );
}

function Frame37() {
  return (
    <div className="content-stretch flex items-start pt-[10px] relative self-stretch shrink-0">
      <div className="relative shrink-0 size-[4px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
          <circle cx="2" cy="2" fill="var(--fill-0, #8B949E)" id="Ellipse 3011" r="2" />
        </svg>
      </div>
    </div>
  );
}

function Frame38() {
  return (
    <div className="content-stretch flex gap-[4px] items-start relative shrink-0 w-full">
      <Frame37 />
      <div className="flex flex-[1_0_0] flex-col font-['Microsoft_YaHei_UI:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#626c78] text-[14px]">
        <p className="css-4hzbpn leading-[22px]">冷冻水出水温度 12°C 持续时长120min</p>
      </div>
    </div>
  );
}

function Frame39() {
  return (
    <div className="content-stretch flex h-full items-start pt-[10px] relative shrink-0">
      <div className="relative shrink-0 size-[4px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
          <circle cx="2" cy="2" fill="var(--fill-0, #8B949E)" id="Ellipse 3011" r="2" />
        </svg>
      </div>
    </div>
  );
}

function Frame40() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
      <div className="flex flex-row items-center self-stretch">
        <Frame39 />
      </div>
      <div className="flex flex-[1_0_0] flex-col font-['Microsoft_YaHei_UI:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#626c78] text-[14px]">
        <p className="css-4hzbpn leading-[22px]">螺杆机-2大1小，持续时长120min</p>
      </div>
    </div>
  );
}

function TableCell6() {
  return (
    <div className="relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border border-[#e1e5eb] border-solid inset-[-0.5px] pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[8px] items-start pl-[16px] pr-[12px] py-[13px] relative w-full">
        <Frame4 />
        <Property3 />
        <Frame38 />
        <Frame40 />
      </div>
    </div>
  );
}

function Frame41() {
  return (
    <div className="bg-gradient-to-r from-[rgba(0,162,167,0.12)] h-[22px] relative rounded-[2px] shrink-0 to-[rgba(0,162,167,0)] w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center p-[4px] relative size-full">
          <div className="flex flex-[1_0_0] flex-col font-['Microsoft_YaHei_UI:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#00a2a7] text-[14px]">
            <p className="css-4hzbpn leading-[15.652px]">蓄冷</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame42() {
  return (
    <div className="content-stretch flex items-start pt-[10px] relative self-stretch shrink-0">
      <div className="relative shrink-0 size-[4px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
          <circle cx="2" cy="2" fill="var(--fill-0, #8B949E)" id="Ellipse 3011" r="2" />
        </svg>
      </div>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex gap-[4px] items-start relative shrink-0 w-full">
      <Frame42 />
      <div className="flex flex-[1_0_0] flex-col font-['Microsoft_YaHei_UI:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#626c78] text-[14px]">
        <p className="css-4hzbpn leading-[24px]">双工况冷机-3大1小，持续时长120min</p>
      </div>
    </div>
  );
}

function Frame43() {
  return (
    <div className="content-stretch flex items-start pt-[10px] relative self-stretch shrink-0">
      <div className="relative shrink-0 size-[4px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
          <circle cx="2" cy="2" fill="var(--fill-0, #8B949E)" id="Ellipse 3011" r="2" />
        </svg>
      </div>
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex gap-[4px] items-start relative shrink-0 w-full">
      <Frame43 />
      <div className="flex flex-[1_0_0] flex-col font-['Microsoft_YaHei_UI:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#626c78] text-[14px]">
        <p className="css-4hzbpn leading-[24px]">冷冻水出水温度 12°C，持续时长120min</p>
      </div>
    </div>
  );
}

function TableCell7() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border border-[#e1e5eb] border-solid inset-[-0.5px] pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[8px] items-start pl-[16px] pr-[12px] py-[13px] relative size-full">
        <Frame41 />
        <Frame12 />
        <Frame13 />
      </div>
    </div>
  );
}

function Column3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-[478px] items-start min-h-px min-w-px overflow-clip relative" data-name="column">
      <TableTitle3 />
      <TableCell6 />
      <TableCell7 />
    </div>
  );
}

function TableColumn3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative" data-name="table-column">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-0.5px_0_0] pointer-events-none" />
      <Column3 />
    </div>
  );
}

function Placeholder4() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placeholder" />;
}

function TableTitle4() {
  return (
    <div className="bg-[#f1f4f6] h-[48px] relative shrink-0 w-full" data-name="table-title">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col gap-[4px] items-start justify-center pl-[16px] pr-[12px] pt-[4px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#626c78] text-[12px]">19:00</p>
          <Placeholder4 />
        </div>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="bg-gradient-to-r from-[rgba(100,166,247,0.12)] h-[22px] relative rounded-[2px] shrink-0 to-[rgba(100,166,247,0)] w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center p-[4px] relative size-full">
          <div className="flex flex-[1_0_0] flex-col font-['Microsoft_YaHei_UI:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#246fe5] text-[14px]">
            <p className="css-4hzbpn leading-[15.652px]">供冷</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Property4() {
  return (
    <div className="bg-[#e8ecf0] content-stretch flex h-[16px] items-center justify-center px-[4px] relative rounded-[2px] shrink-0" data-name="属性标签&Property">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#1b2129] text-[12px]">冷机供冷</p>
    </div>
  );
}

function Frame44() {
  return (
    <div className="content-stretch flex items-start pt-[10px] relative self-stretch shrink-0">
      <div className="relative shrink-0 size-[4px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
          <circle cx="2" cy="2" fill="var(--fill-0, #8B949E)" id="Ellipse 3011" r="2" />
        </svg>
      </div>
    </div>
  );
}

function Frame45() {
  return (
    <div className="content-stretch flex gap-[4px] items-start relative shrink-0 w-full">
      <Frame44 />
      <div className="flex flex-[1_0_0] flex-col font-['Microsoft_YaHei_UI:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#626c78] text-[14px]">
        <p className="css-4hzbpn leading-[22px]">冷冻水出水温度 12°C 持续时长120min</p>
      </div>
    </div>
  );
}

function Frame46() {
  return (
    <div className="content-stretch flex h-full items-start pt-[10px] relative shrink-0">
      <div className="relative shrink-0 size-[4px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
          <circle cx="2" cy="2" fill="var(--fill-0, #8B949E)" id="Ellipse 3011" r="2" />
        </svg>
      </div>
    </div>
  );
}

function Frame47() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
      <div className="flex flex-row items-center self-stretch">
        <Frame46 />
      </div>
      <div className="flex flex-[1_0_0] flex-col font-['Microsoft_YaHei_UI:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#626c78] text-[14px]">
        <p className="css-4hzbpn leading-[22px]">螺杆机-2大1小，持续时长120min</p>
      </div>
    </div>
  );
}

function TableCell8() {
  return (
    <div className="relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border border-[#e1e5eb] border-solid inset-[-0.5px] pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[8px] items-start pl-[16px] pr-[12px] py-[13px] relative w-full">
        <Frame5 />
        <Property4 />
        <Frame45 />
        <Frame47 />
      </div>
    </div>
  );
}

function Frame48() {
  return (
    <div className="bg-gradient-to-r from-[rgba(0,162,167,0.12)] h-[22px] relative rounded-[2px] shrink-0 to-[rgba(0,162,167,0)] w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center p-[4px] relative size-full">
          <div className="flex flex-[1_0_0] flex-col font-['Microsoft_YaHei_UI:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#00a2a7] text-[14px]">
            <p className="css-4hzbpn leading-[15.652px]">蓄冷</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame49() {
  return (
    <div className="content-stretch flex items-start pt-[10px] relative self-stretch shrink-0">
      <div className="relative shrink-0 size-[4px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
          <circle cx="2" cy="2" fill="var(--fill-0, #8B949E)" id="Ellipse 3011" r="2" />
        </svg>
      </div>
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex gap-[4px] items-start relative shrink-0 w-full">
      <Frame49 />
      <div className="flex flex-[1_0_0] flex-col font-['Microsoft_YaHei_UI:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#626c78] text-[14px]">
        <p className="css-4hzbpn leading-[24px]">双工况冷机-3大1小，持续时长120min</p>
      </div>
    </div>
  );
}

function Frame50() {
  return (
    <div className="content-stretch flex items-start pt-[10px] relative self-stretch shrink-0">
      <div className="relative shrink-0 size-[4px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
          <circle cx="2" cy="2" fill="var(--fill-0, #8B949E)" id="Ellipse 3011" r="2" />
        </svg>
      </div>
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex gap-[4px] items-start relative shrink-0 w-full">
      <Frame50 />
      <div className="flex flex-[1_0_0] flex-col font-['Microsoft_YaHei_UI:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#626c78] text-[14px]">
        <p className="css-4hzbpn leading-[24px]">冷冻水出水温度 12°C，持续时长120min</p>
      </div>
    </div>
  );
}

function TableCell9() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border border-[#e1e5eb] border-solid inset-[-0.5px] pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[8px] items-start pl-[16px] pr-[12px] py-[13px] relative size-full">
        <Frame48 />
        <Frame14 />
        <Frame15 />
      </div>
    </div>
  );
}

function Column4() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-[478px] items-start min-h-px min-w-px overflow-clip relative" data-name="column">
      <TableTitle4 />
      <TableCell8 />
      <TableCell9 />
    </div>
  );
}

function TableColumn4() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative" data-name="table-column">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-0.5px_0_0] pointer-events-none" />
      <Column4 />
    </div>
  );
}

function TableColumn5() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative w-full" data-name="table-column">
      <TableColumn />
      <TableColumn1 />
      <TableColumn2 />
      <TableColumn3 />
      {[...Array(2).keys()].map((_, i) => (
        <TableColumn4 key={i} />
      ))}
    </div>
  );
}

function Frame() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <TableColumn5 />
      </div>
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Data() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="data">
      <div className="content-stretch flex items-start overflow-clip relative rounded-[inherit] size-full">
        <Frame />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e1e5eb] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Component() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[478px] items-end justify-center relative shrink-0 w-full" data-name="新列表">
      <Data />
    </div>
  );
}

function Padding() {
  return (
    <div className="h-[496px] relative shrink-0 w-full" data-name="padding">
      <div className="content-stretch flex flex-col items-start px-[24px] relative size-full">
        <Component />
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