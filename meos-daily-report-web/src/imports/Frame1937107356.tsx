function Frame13() {
  return <div className="h-[32px] shrink-0 w-[436px]" />;
}

function Frame5() {
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
      <Frame5 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#ffd873] h-[3px] shrink-0 w-[14px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">持续偏热</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame6 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#fdc1be] h-[3px] shrink-0 w-[14px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">空间过热</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame7 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#7ed8e4] h-[3px] shrink-0 w-[14px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">持续偏冷</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame8 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#64a6f7] h-[3px] shrink-0 w-[14px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">空间过冷</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame9 />
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <Frame />
      <Frame3 />
      <Frame1 />
      <Frame4 />
      <Frame2 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full z-[2]">
      <Frame13 />
      <Frame14 />
    </div>
  );
}

function Component() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[14]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="css-g0mm18 font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full">楼层</p>
        </div>
      </div>
    </div>
  );
}

function Component1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">1F</p>
    </div>
  );
}

function Component2() {
  return (
    <div className="relative shrink-0 w-full z-[13]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component1 />
        </div>
      </div>
    </div>
  );
}

function Component3() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">2F</p>
    </div>
  );
}

function Component4() {
  return (
    <div className="h-[96px] relative shrink-0 w-full z-[12]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <Component3 />
        </div>
      </div>
    </div>
  );
}

function Component5() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">3F</p>
    </div>
  );
}

function Component6() {
  return (
    <div className="relative shrink-0 w-full z-[11]" data-name="单元格">
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
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">4F</p>
    </div>
  );
}

function Component8() {
  return (
    <div className="relative shrink-0 w-full z-[10]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
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
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component />
      <Component2 />
      <Component4 />
      <Component6 />
      <Component8 />
    </div>
  );
}

function Component10() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-[63px] z-[3]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component9 />
    </div>
  );
}

function Component11() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[15]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="css-4hzbpn font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic relative shrink-0 text-[#626c78] text-[12px] w-full">空间名称</p>
        </div>
      </div>
    </div>
  );
}

function Component12() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#246fe5] text-[14px] text-ellipsis">强电间#1</p>
    </div>
  );
}

function Component13() {
  return (
    <div className="relative shrink-0 w-full z-[14]" data-name="单元格">
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
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#246fe5] text-[14px] text-ellipsis">多功能会议室#1</p>
    </div>
  );
}

function Component15() {
  return (
    <div className="relative shrink-0 w-full z-[13]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component14 />
        </div>
      </div>
    </div>
  );
}

function Component16() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#246fe5] text-[14px] text-ellipsis">多功能会议室#1</p>
    </div>
  );
}

function Component17() {
  return (
    <div className="relative shrink-0 w-full z-[12]" data-name="单元格">
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
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#246fe5] text-[14px] text-ellipsis">电能监测室#1</p>
    </div>
  );
}

function Component19() {
  return (
    <div className="relative shrink-0 w-full z-[11]" data-name="单元格">
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
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#246fe5] text-[14px] text-ellipsis">储能室#1</p>
    </div>
  );
}

function Component21() {
  return (
    <div className="relative shrink-0 w-full z-[10]" data-name="单元格">
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
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component11 />
      <Component13 />
      <Component15 />
      <Component17 />
      <Component19 />
      <Component21 />
    </div>
  );
}

function Component23() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-[199px] z-[2]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component22 />
    </div>
  );
}

function Component24() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[6]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid border-t inset-[-0.5px_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="css-g0mm18 font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full">09:00</p>
        </div>
      </div>
    </div>
  );
}

function Component25() {
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

function Component26() {
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

function Component27() {
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

function Component28() {
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

function Component29() {
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

function Component30() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component24 />
      <Component25 />
      <Component26 />
      <Component27 />
      <Component28 />
      <Component29 />
    </div>
  );
}

function Component31() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component30 />
    </div>
  );
}

function Component32() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[6]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="css-g0mm18 font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full">10:00</p>
        </div>
      </div>
    </div>
  );
}

function Component33() {
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

function Component34() {
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

function Component35() {
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

function Component36() {
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

function Component37() {
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

function Component38() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component32 />
      <Component33 />
      <Component34 />
      <Component35 />
      <Component36 />
      <Component37 />
    </div>
  );
}

function Component39() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component38 />
    </div>
  );
}

function Component40() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[6]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="css-g0mm18 font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full">11:00</p>
        </div>
      </div>
    </div>
  );
}

function Component41() {
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

function Component42() {
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

function Component43() {
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

function Component44() {
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

function Component45() {
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

function Component46() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component40 />
      <Component41 />
      <Component42 />
      <Component43 />
      <Component44 />
      <Component45 />
    </div>
  );
}

function Component47() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component46 />
    </div>
  );
}

function Component48() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[6]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="css-g0mm18 font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full">12:00</p>
        </div>
      </div>
    </div>
  );
}

function Component49() {
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

function Component50() {
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

function Component51() {
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

function Component52() {
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

function Component53() {
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

function Component54() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component48 />
      <Component49 />
      <Component50 />
      <Component51 />
      <Component52 />
      <Component53 />
    </div>
  );
}

function Component55() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component54 />
    </div>
  );
}

function Component56() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[6]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="css-g0mm18 font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full">13:00</p>
        </div>
      </div>
    </div>
  );
}

function Component57() {
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

function Component58() {
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

function Component59() {
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

function Component60() {
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

function Component61() {
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

function Component62() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component56 />
      <Component57 />
      <Component58 />
      <Component59 />
      <Component60 />
      <Component61 />
    </div>
  );
}

function Component63() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component62 />
    </div>
  );
}

function Component64() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[6]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="css-g0mm18 font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full">14:00</p>
        </div>
      </div>
    </div>
  );
}

function Component65() {
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

function Component66() {
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

function Component67() {
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

function Component68() {
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

function Component69() {
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

function Component70() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component64 />
      <Component65 />
      <Component66 />
      <Component67 />
      <Component68 />
      <Component69 />
    </div>
  );
}

function Component71() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component70 />
    </div>
  );
}

function Component72() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[6]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="css-g0mm18 font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full">15:00</p>
        </div>
      </div>
    </div>
  );
}

function Component73() {
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

function Component74() {
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

function Component75() {
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

function Component76() {
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

function Component77() {
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

function Component78() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component72 />
      <Component73 />
      <Component74 />
      <Component75 />
      <Component76 />
      <Component77 />
    </div>
  );
}

function Component79() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component78 />
    </div>
  );
}

function Component80() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[6]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="css-g0mm18 font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full">16:00</p>
        </div>
      </div>
    </div>
  );
}

function Component81() {
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

function Component82() {
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

function Component83() {
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

function Component84() {
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

function Component85() {
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

function Component86() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component80 />
      <Component81 />
      <Component82 />
      <Component83 />
      <Component84 />
      <Component85 />
    </div>
  );
}

function Component87() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component86 />
    </div>
  );
}

function Component88() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[6]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="css-g0mm18 font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full">17:00</p>
        </div>
      </div>
    </div>
  );
}

function Component89() {
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

function Component90() {
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

function Component91() {
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

function Component92() {
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

function Component93() {
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

function Component94() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component88 />
      <Component89 />
      <Component90 />
      <Component91 />
      <Component92 />
      <Component93 />
    </div>
  );
}

function Component95() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component94 />
    </div>
  );
}

function Component96() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[6]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="css-g0mm18 font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full">18:00</p>
        </div>
      </div>
    </div>
  );
}

function Component97() {
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

function Component98() {
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

function Component99() {
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

function Component100() {
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

function Component101() {
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

function Component102() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component96 />
      <Component97 />
      <Component98 />
      <Component99 />
      <Component100 />
      <Component101 />
    </div>
  );
}

function Component103() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component102 />
    </div>
  );
}

function Component104() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[6]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="css-g0mm18 font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full">19:00</p>
        </div>
      </div>
    </div>
  );
}

function Component105() {
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

function Component106() {
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

function Component107() {
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

function Component108() {
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

function Component109() {
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

function Component110() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component104 />
      <Component105 />
      <Component106 />
      <Component107 />
      <Component108 />
      <Component109 />
    </div>
  );
}

function Component111() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component110 />
    </div>
  );
}

function Component112() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[6]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="css-g0mm18 font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full">20:00</p>
        </div>
      </div>
    </div>
  );
}

function Component113() {
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

function Component114() {
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

function Component115() {
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

function Component116() {
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

function Component117() {
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

function Component118() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component112 />
      <Component113 />
      <Component114 />
      <Component115 />
      <Component116 />
      <Component117 />
    </div>
  );
}

function Component119() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component118 />
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative z-[1]">
      <Component31 />
      <Component39 />
      <Component47 />
      <Component55 />
      <Component63 />
      <Component71 />
      <Component79 />
      <Component87 />
      <Component95 />
      <Component103 />
      <Component111 />
      <Component119 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex isolate items-start relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-[0.5px] border-solid inset-[-0.5px] pointer-events-none" />
      <Component10 />
      <Component23 />
      <Frame16 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full z-[1]">
      <Frame10 />
    </div>
  );
}

function Component120() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Component 390">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.04)]" />
      <div className="content-stretch flex flex-col gap-[6px] isolate items-start px-[12px] py-[16px] relative w-full">
        <Frame12 />
        <Frame15 />
      </div>
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Component120 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[45px] top-[43px] w-[1168px]">
      <Frame11 />
    </div>
  );
}

export default function Frame18() {
  return (
    <div className="bg-[#ebf6ff] relative size-full">
      <Frame17 />
    </div>
  );
}