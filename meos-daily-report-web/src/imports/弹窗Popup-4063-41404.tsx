import svgPaths from "./svg-oap4fp214l";

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
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#2e3742] text-[16px]">AI策略</p>
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
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col gap-[4px] items-start justify-center pl-[16px] pr-[12px] pt-[4px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#626c78] text-[12px]">策略项</p>
          <Placeholder />
        </div>
      </div>
    </div>
  );
}

function Placehoder() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-4hzbpn font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] min-w-full not-italic relative shrink-0 text-[#1b2129] text-[14px] w-[min-content]">冷站系统开关</p>
          <Placehoder />
        </div>
      </div>
    </div>
  );
}

function Placehoder1() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell1() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-4hzbpn font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] min-w-full not-italic relative shrink-0 text-[#1b2129] text-[14px] w-[min-content]">冷机台数</p>
          <Placehoder1 />
        </div>
      </div>
    </div>
  );
}

function Placehoder2() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell2() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-4hzbpn font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] min-w-full not-italic relative shrink-0 text-[#1b2129] text-[14px] w-[min-content]">冷机出水温度</p>
          <Placehoder2 />
        </div>
      </div>
    </div>
  );
}

function Column() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px overflow-clip relative" data-name="column">
      <TableTitle />
      <TableCell />
      <TableCell1 />
      <TableCell2 />
    </div>
  );
}

function TableColumn() {
  return (
    <div className="content-stretch flex h-full items-start relative shrink-0 w-[208px]" data-name="table-column">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-0 pointer-events-none" />
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
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col gap-[4px] items-start justify-center pl-[16px] pr-[12px] pt-[4px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#626c78] text-[12px]">12:00</p>
          <Placeholder1 />
        </div>
      </div>
    </div>
  );
}

function Placehoder3() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell3() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#1b2129] text-[14px]">开启</p>
          <Placehoder3 />
        </div>
      </div>
    </div>
  );
}

function Placehoder4() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell4() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#1b2129] text-[14px]">3台</p>
          <Placehoder4 />
        </div>
      </div>
    </div>
  );
}

function Placehoder5() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell5() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#1b2129] text-[14px]">3℃</p>
          <Placehoder5 />
        </div>
      </div>
    </div>
  );
}

function Placehoder6() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell6() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#1b2129] text-[14px]">3大1小</p>
          <Placehoder6 />
        </div>
      </div>
    </div>
  );
}

function Placehoder7() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell7() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#1b2129] text-[14px]">40HZ</p>
          <Placehoder7 />
        </div>
      </div>
    </div>
  );
}

function Placehoder8() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell8() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#1b2129] text-[14px]">2HZ</p>
          <Placehoder8 />
        </div>
      </div>
    </div>
  );
}

function Placehoder9() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell9() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#1b2129] text-[14px]">3HZ</p>
          <Placehoder9 />
        </div>
      </div>
    </div>
  );
}

function Column1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-[902.001px] items-start min-h-px min-w-px overflow-clip relative" data-name="column">
      <TableTitle1 />
      <TableCell3 />
      <TableCell4 />
      <TableCell5 />
      <TableCell6 />
      <TableCell7 />
      <TableCell6 />
      <TableCell8 />
      <TableCell4 />
      <TableCell9 />
    </div>
  );
}

function TableColumn1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative" data-name="table-column">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-0 pointer-events-none" />
      <Column1 />
    </div>
  );
}

function Content() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full" data-name="Content">
      <p className="css-4hzbpn flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#626c78] text-[12px]">13:00</p>
    </div>
  );
}

function Component() {
  return (
    <div className="bg-[#f1f4f6] h-[48px] relative shrink-0 w-full" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <Content />
        </div>
      </div>
    </div>
  );
}

function Placehoder10() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell10() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#c4c9cf] text-[14px]">开启</p>
          <Placehoder10 />
        </div>
      </div>
    </div>
  );
}

function Placehoder11() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell11() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#c4c9cf] text-[14px]">3台</p>
          <Placehoder11 />
        </div>
      </div>
    </div>
  );
}

function Placehoder12() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell12() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#c4c9cf] text-[14px]">3℃</p>
          <Placehoder12 />
        </div>
      </div>
    </div>
  );
}

function Placehoder13() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell13() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#c4c9cf] text-[14px]">3大1小</p>
          <Placehoder13 />
        </div>
      </div>
    </div>
  );
}

function Placehoder14() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell14() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#c4c9cf] text-[14px]">30HZ</p>
          <Placehoder14 />
        </div>
      </div>
    </div>
  );
}

function Placehoder15() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell15() {
  return (
    <div className="bg-[#e8ecf0] h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-l border-solid border-t inset-[-1px_0_-1px_-1px] pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#1b2129] text-[14px]">3HZ</p>
          <Placehoder15 />
        </div>
      </div>
    </div>
  );
}

function Placehoder16() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell16() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#c4c9cf] text-[14px]">3HZ</p>
          <Placehoder16 />
        </div>
      </div>
    </div>
  );
}

function Column2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-[902px] items-start min-h-px min-w-px overflow-clip relative" data-name="column">
      <Component />
      <TableCell10 />
      <TableCell11 />
      <TableCell12 />
      <TableCell13 />
      <TableCell14 />
      <TableCell13 />
      <TableCell15 />
      <TableCell11 />
      <TableCell16 />
    </div>
  );
}

function TableColumn2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative" data-name="table-column">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-0 pointer-events-none" />
      <Column2 />
    </div>
  );
}

function Content1() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full" data-name="Content">
      <p className="css-4hzbpn flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#626c78] text-[12px]">15:00</p>
    </div>
  );
}

function Component1() {
  return (
    <div className="bg-[#f1f4f6] h-[48px] relative shrink-0 w-full" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <Content1 />
        </div>
      </div>
    </div>
  );
}

function Placehoder17() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell17() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#c4c9cf] text-[14px]">开启</p>
          <Placehoder17 />
        </div>
      </div>
    </div>
  );
}

function Placehoder18() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell18() {
  return (
    <div className="bg-[#e8ecf0] h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#1b2129] text-[14px]">2台</p>
          <Placehoder18 />
        </div>
      </div>
    </div>
  );
}

function Placehoder19() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell19() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#c4c9cf] text-[14px]">3℃</p>
          <Placehoder19 />
        </div>
      </div>
    </div>
  );
}

function Placehoder20() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell20() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#c4c9cf] text-[14px]">3大1小</p>
          <Placehoder20 />
        </div>
      </div>
    </div>
  );
}

function Placehoder21() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell21() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#c4c9cf] text-[14px]">30HZ</p>
          <Placehoder21 />
        </div>
      </div>
    </div>
  );
}

function Placehoder22() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell22() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#c4c9cf] text-[14px]">3HZ</p>
          <Placehoder22 />
        </div>
      </div>
    </div>
  );
}

function Placehoder23() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell23() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#c4c9cf] text-[14px]">3台</p>
          <Placehoder23 />
        </div>
      </div>
    </div>
  );
}

function Column3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-[902px] items-start min-h-px min-w-px overflow-clip relative" data-name="column">
      <Component1 />
      <TableCell17 />
      <TableCell18 />
      <TableCell19 />
      <TableCell20 />
      <TableCell21 />
      <TableCell20 />
      <TableCell22 />
      <TableCell23 />
      <TableCell22 />
    </div>
  );
}

function TableColumn3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative" data-name="table-column">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-0 pointer-events-none" />
      <Column3 />
    </div>
  );
}

function Content2() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full" data-name="Content">
      <p className="css-4hzbpn flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#626c78] text-[12px]">16:00</p>
    </div>
  );
}

function Component2() {
  return (
    <div className="bg-[#f1f4f6] h-[48px] relative shrink-0 w-full" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <Content2 />
        </div>
      </div>
    </div>
  );
}

function Placehoder24() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell24() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#c4c9cf] text-[14px]">开启</p>
          <Placehoder24 />
        </div>
      </div>
    </div>
  );
}

function Placehoder25() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell25() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#c4c9cf] text-[14px]">2台</p>
          <Placehoder25 />
        </div>
      </div>
    </div>
  );
}

function Placehoder26() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell26() {
  return (
    <div className="bg-[#e8ecf0] h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-l border-solid border-t inset-[-1px_0_-1px_-1px] pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#1b2129] text-[14px]">2℃</p>
          <Placehoder26 />
        </div>
      </div>
    </div>
  );
}

function Placehoder27() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell27() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#c4c9cf] text-[14px]">3大1小</p>
          <Placehoder27 />
        </div>
      </div>
    </div>
  );
}

function Placehoder28() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell28() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#c4c9cf] text-[14px]">30HZ</p>
          <Placehoder28 />
        </div>
      </div>
    </div>
  );
}

function Placehoder29() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell29() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#c4c9cf] text-[14px]">3HZ</p>
          <Placehoder29 />
        </div>
      </div>
    </div>
  );
}

function Placehoder30() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell30() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#c4c9cf] text-[14px]">3台</p>
          <Placehoder30 />
        </div>
      </div>
    </div>
  );
}

function Column4() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-[902px] items-start min-h-px min-w-px overflow-clip relative" data-name="column">
      <Component2 />
      <TableCell24 />
      <TableCell25 />
      <TableCell26 />
      <TableCell27 />
      <TableCell28 />
      <TableCell27 />
      <TableCell29 />
      <TableCell30 />
      <TableCell29 />
    </div>
  );
}

function TableColumn4() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative" data-name="table-column">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-0 pointer-events-none" />
      <Column4 />
    </div>
  );
}

function Content3() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full" data-name="Content">
      <p className="css-4hzbpn flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#626c78] text-[12px]">17:00</p>
    </div>
  );
}

function Component3() {
  return (
    <div className="bg-[#f1f4f6] h-[48px] relative shrink-0 w-full" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <Content3 />
        </div>
      </div>
    </div>
  );
}

function Placehoder31() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell31() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#c4c9cf] text-[14px]">开启</p>
          <Placehoder31 />
        </div>
      </div>
    </div>
  );
}

function Placehoder32() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell32() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#c4c9cf] text-[14px]">2台</p>
          <Placehoder32 />
        </div>
      </div>
    </div>
  );
}

function Placehoder33() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell33() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#c4c9cf] text-[14px]">2℃</p>
          <Placehoder33 />
        </div>
      </div>
    </div>
  );
}

function Placehoder34() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell34() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#c4c9cf] text-[14px]">3大1小</p>
          <Placehoder34 />
        </div>
      </div>
    </div>
  );
}

function Placehoder35() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell35() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#c4c9cf] text-[14px]">30HZ</p>
          <Placehoder35 />
        </div>
      </div>
    </div>
  );
}

function Placehoder36() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell36() {
  return (
    <div className="bg-[#e8ecf0] h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-l border-solid border-t inset-[-1px_0_-1px_-1px] pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#1b2129] text-[14px]">2大1小</p>
          <Placehoder36 />
        </div>
      </div>
    </div>
  );
}

function Placehoder37() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell37() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#c4c9cf] text-[14px]">3HZ</p>
          <Placehoder37 />
        </div>
      </div>
    </div>
  );
}

function Placehoder38() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell38() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#c4c9cf] text-[14px]">3台</p>
          <Placehoder38 />
        </div>
      </div>
    </div>
  );
}

function Column5() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-[902px] items-start min-h-px min-w-px overflow-clip relative" data-name="column">
      <Component3 />
      <TableCell31 />
      <TableCell32 />
      <TableCell33 />
      <TableCell34 />
      <TableCell35 />
      <TableCell36 />
      <TableCell37 />
      <TableCell38 />
      <TableCell37 />
    </div>
  );
}

function TableColumn5() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative" data-name="table-column">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-0 pointer-events-none" />
      <Column5 />
    </div>
  );
}

function Placeholder2() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placeholder" />;
}

function TableTitle2() {
  return (
    <div className="bg-[#f1f4f6] h-[48px] relative shrink-0 w-full" data-name="table-title">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col gap-[4px] items-start justify-center pl-[16px] pr-[12px] pt-[4px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#626c78] text-[12px]">18:00</p>
          <Placeholder2 />
        </div>
      </div>
    </div>
  );
}

function Placehoder39() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell39() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#c4c9cf] text-[14px]">开启</p>
          <Placehoder39 />
        </div>
      </div>
    </div>
  );
}

function Placehoder40() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell40() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#c4c9cf] text-[14px]">2台</p>
          <Placehoder40 />
        </div>
      </div>
    </div>
  );
}

function Placehoder41() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell41() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#c4c9cf] text-[14px]">2℃</p>
          <Placehoder41 />
        </div>
      </div>
    </div>
  );
}

function Placehoder42() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell42() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#c4c9cf] text-[14px]">3大1小</p>
          <Placehoder42 />
        </div>
      </div>
    </div>
  );
}

function Placehoder43() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell43() {
  return (
    <div className="bg-[#e8ecf0] h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#1b2129] text-[14px]">40HZ</p>
          <Placehoder43 />
        </div>
      </div>
    </div>
  );
}

function Placehoder44() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell44() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#c4c9cf] text-[14px]">2大1小</p>
          <Placehoder44 />
        </div>
      </div>
    </div>
  );
}

function Placehoder45() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell45() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#c4c9cf] text-[14px]">3HZ</p>
          <Placehoder45 />
        </div>
      </div>
    </div>
  );
}

function Placehoder46() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell46() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#c4c9cf] text-[14px]">3台</p>
          <Placehoder46 />
        </div>
      </div>
    </div>
  );
}

function Column6() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-[902.018px] items-start min-h-px min-w-px overflow-clip relative" data-name="column">
      <TableTitle2 />
      <TableCell39 />
      <TableCell40 />
      <TableCell41 />
      <TableCell42 />
      <TableCell43 />
      <TableCell44 />
      <TableCell45 />
      <TableCell46 />
      <TableCell45 />
    </div>
  );
}

function TableColumn6() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative" data-name="table-column">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-0 pointer-events-none" />
      <Column6 />
    </div>
  );
}

function Placeholder3() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placeholder" />;
}

function TableTitle3() {
  return (
    <div className="bg-[#f1f4f6] h-[48px] relative shrink-0 w-full" data-name="table-title">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col gap-[4px] items-start justify-center pl-[16px] pr-[12px] pt-[4px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#626c78] text-[12px]">19:00</p>
          <Placeholder3 />
        </div>
      </div>
    </div>
  );
}

function TableCell47() {
  return (
    <div className="bg-[#e8ecf0] h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#1b2129] text-[14px] text-ellipsis">关闭</p>
        </div>
      </div>
    </div>
  );
}

function TableCell48() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#c4c9cf] text-[14px] text-ellipsis">2台</p>
        </div>
      </div>
    </div>
  );
}

function TableCell49() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px] not-italic overflow-hidden relative shrink-0 text-[#c4c9cf] text-[14px] text-ellipsis">2℃</p>
        </div>
      </div>
    </div>
  );
}

function TableCell50() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#c4c9cf] text-[14px] text-ellipsis">3大1小</p>
        </div>
      </div>
    </div>
  );
}

function TableCell51() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px] not-italic overflow-hidden relative shrink-0 text-[#c4c9cf] text-[14px] text-ellipsis">40HZ</p>
        </div>
      </div>
    </div>
  );
}

function Placehoder47() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell52() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-g0mm18 font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px] min-w-full not-italic overflow-hidden relative shrink-0 text-[#c4c9cf] text-[14px] text-ellipsis w-[min-content]">2大1小</p>
          <Placehoder47 />
        </div>
      </div>
    </div>
  );
}

function Placehoder48() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell53() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-g0mm18 font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] min-w-full not-italic overflow-hidden relative shrink-0 text-[#c4c9cf] text-[14px] text-ellipsis w-[min-content]">3HZ</p>
          <Placehoder48 />
        </div>
      </div>
    </div>
  );
}

function Placehoder49() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell54() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-g0mm18 font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] min-w-full not-italic overflow-hidden relative shrink-0 text-[#c4c9cf] text-[14px] text-ellipsis w-[min-content]">3台</p>
          <Placehoder49 />
        </div>
      </div>
    </div>
  );
}

function Column7() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px overflow-clip relative" data-name="column">
      <TableTitle3 />
      <TableCell47 />
      <TableCell48 />
      <TableCell49 />
      <TableCell50 />
      <TableCell51 />
      <TableCell52 />
      <TableCell53 />
      <TableCell54 />
      <TableCell53 />
    </div>
  );
}

function Placeholder4() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placeholder" />;
}

function TableTitle4() {
  return (
    <div className="bg-[#f1f4f6] h-[48px] relative shrink-0 w-full" data-name="table-title">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col gap-[4px] items-start justify-center pl-[16px] pr-[12px] pt-[4px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#626c78] text-[12px]">20:00</p>
          <Placeholder4 />
        </div>
      </div>
    </div>
  );
}

function TableCell55() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#c4c9cf] text-[14px] text-ellipsis">关闭</p>
        </div>
      </div>
    </div>
  );
}

function TableCell56() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#c4c9cf] text-[14px] text-ellipsis">2台</p>
        </div>
      </div>
    </div>
  );
}

function TableCell57() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px] not-italic overflow-hidden relative shrink-0 text-[#c4c9cf] text-[14px] text-ellipsis">2℃</p>
        </div>
      </div>
    </div>
  );
}

function TableCell58() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#c4c9cf] text-[14px] text-ellipsis">3大1小</p>
        </div>
      </div>
    </div>
  );
}

function TableCell59() {
  return (
    <div className="bg-[#e8ecf0] h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px] not-italic overflow-hidden relative shrink-0 text-[#1b2129] text-[14px] text-ellipsis">30HZ</p>
        </div>
      </div>
    </div>
  );
}

function Placehoder50() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell60() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-g0mm18 font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px] min-w-full not-italic overflow-hidden relative shrink-0 text-[#c4c9cf] text-[14px] text-ellipsis w-[min-content]">3大1小</p>
          <Placehoder50 />
        </div>
      </div>
    </div>
  );
}

function Placehoder51() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell61() {
  return (
    <div className="bg-[#e8ecf0] h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-g0mm18 font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] min-w-full not-italic overflow-hidden relative shrink-0 text-[#1b2129] text-[14px] text-ellipsis w-[min-content]">2HZ</p>
          <Placehoder51 />
        </div>
      </div>
    </div>
  );
}

function Placehoder52() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell62() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-g0mm18 font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] min-w-full not-italic overflow-hidden relative shrink-0 text-[#c4c9cf] text-[14px] text-ellipsis w-[min-content]">3台</p>
          <Placehoder52 />
        </div>
      </div>
    </div>
  );
}

function Placehoder53() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell63() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-g0mm18 font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] min-w-full not-italic overflow-hidden relative shrink-0 text-[#c4c9cf] text-[14px] text-ellipsis w-[min-content]">3HZ</p>
          <Placehoder53 />
        </div>
      </div>
    </div>
  );
}

function Column8() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px overflow-clip relative" data-name="column">
      <TableTitle4 />
      <TableCell55 />
      <TableCell56 />
      <TableCell57 />
      <TableCell58 />
      <TableCell59 />
      <TableCell60 />
      <TableCell61 />
      <TableCell62 />
      <TableCell63 />
    </div>
  );
}

function Placeholder5() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placeholder" />;
}

function TableTitle5() {
  return (
    <div className="bg-[#f1f4f6] h-[48px] relative shrink-0 w-full" data-name="table-title">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col gap-[4px] items-start justify-center pl-[16px] pr-[12px] pt-[4px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#626c78] text-[12px]">20:00</p>
          <Placeholder5 />
        </div>
      </div>
    </div>
  );
}

function TableCell64() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#c4c9cf] text-[14px] text-ellipsis">关闭</p>
        </div>
      </div>
    </div>
  );
}

function TableCell65() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#c4c9cf] text-[14px] text-ellipsis">2台</p>
        </div>
      </div>
    </div>
  );
}

function TableCell66() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px] not-italic overflow-hidden relative shrink-0 text-[#c4c9cf] text-[14px] text-ellipsis">2℃</p>
        </div>
      </div>
    </div>
  );
}

function TableCell67() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#c4c9cf] text-[14px] text-ellipsis">3大1小</p>
        </div>
      </div>
    </div>
  );
}

function TableCell68() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px] not-italic overflow-hidden relative shrink-0 text-[#c4c9cf] text-[14px] text-ellipsis">30HZ</p>
        </div>
      </div>
    </div>
  );
}

function Placehoder54() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell69() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-g0mm18 font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px] min-w-full not-italic overflow-hidden relative shrink-0 text-[#c4c9cf] text-[14px] text-ellipsis w-[min-content]">3大1小</p>
          <Placehoder54 />
        </div>
      </div>
    </div>
  );
}

function Placehoder55() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell70() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-g0mm18 font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] min-w-full not-italic overflow-hidden relative shrink-0 text-[#c4c9cf] text-[14px] text-ellipsis w-[min-content]">2HZ</p>
          <Placehoder55 />
        </div>
      </div>
    </div>
  );
}

function Placehoder56() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell71() {
  return (
    <div className="bg-[#e8ecf0] h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-g0mm18 font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] min-w-full not-italic overflow-hidden relative shrink-0 text-[#1b2129] text-[14px] text-ellipsis w-[min-content]">3台</p>
          <Placehoder56 />
        </div>
      </div>
    </div>
  );
}

function Placehoder57() {
  return <div className="h-[0.001px] shrink-0 w-[68px]" data-name="placehoder" />;
}

function TableCell72() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="table-cell">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <p className="css-g0mm18 font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] min-w-full not-italic overflow-hidden relative shrink-0 text-[#c4c9cf] text-[14px] text-ellipsis w-[min-content]">3HZ</p>
          <Placehoder57 />
        </div>
      </div>
    </div>
  );
}

function Column9() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px overflow-clip relative" data-name="column">
      <TableTitle5 />
      <TableCell64 />
      <TableCell65 />
      <TableCell66 />
      <TableCell67 />
      <TableCell68 />
      <TableCell69 />
      <TableCell70 />
      <TableCell71 />
      <TableCell72 />
    </div>
  );
}

function TableColumn7() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative w-full" data-name="table-column">
      <TableColumn1 />
      <TableColumn2 />
      <TableColumn3 />
      <TableColumn4 />
      <TableColumn5 />
      <TableColumn6 />
      <Column7 />
      <Column8 />
      <Column9 />
    </div>
  );
}

function Frame() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <TableColumn7 />
      </div>
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Data() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="data">
      <div className="content-stretch flex items-start overflow-clip relative rounded-[inherit] size-full">
        <TableColumn />
        <Frame />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e1e5eb] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Component4() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[192px] items-end justify-center relative shrink-0 w-full" data-name="新列表">
      <Data />
    </div>
  );
}

function Component5() {
  return (
    <div className="bg-[#2437e5] content-stretch flex items-center justify-center px-[32px] py-[20px] relative shrink-0 w-[196px]" data-name="交互组件-适配说明">
      <div aria-hidden="true" className="absolute border border-[#475aff] border-solid inset-0 pointer-events-none" />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[22px] not-italic relative shrink-0 text-[22px] text-white">固定宽度</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute h-[493px] left-[24px] top-0 w-[197px]">
      <div className="absolute bg-[#e77] h-[190px] left-0 opacity-30 top-0 w-[197px]" />
      <p className="absolute css-ew64yg font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[normal] left-[27px] not-italic text-[#c742f9] text-[20px] top-[51px]">横向滚动时置顶</p>
    </div>
  );
}

function Component6() {
  return (
    <div className="absolute bg-[#0ea927] content-stretch flex items-center justify-center left-[225px] px-[32px] py-[20px] top-[202px] w-[1011px]" data-name="交互组件-适配说明">
      <div aria-hidden="true" className="absolute border border-[#475aff] border-solid inset-0 pointer-events-none" />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[22px] not-italic relative shrink-0 text-[22px] text-white">整体宽度自适应，最小宽度92px，显示不下的内容...表示</p>
    </div>
  );
}

function Padding() {
  return (
    <div className="h-[496px] relative shrink-0 w-full" data-name="padding">
      <div className="content-stretch flex flex-col gap-[10px] items-start px-[24px] relative size-full">
        <Component4 />
        <Component5 />
        <Frame1 />
        <Component6 />
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