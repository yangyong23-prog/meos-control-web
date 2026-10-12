function Checkbox() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="多选框&Checkbox">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#1b2129] text-[14px]">空间</p>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Checkbox />
    </div>
  );
}

function Frame2() {
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
      <Frame2 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#ffd873] h-[3px] shrink-0 w-[14px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">不达标</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame3 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <Frame />
      <Frame1 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full z-[2]">
      <Frame10 />
      <Frame9 />
    </div>
  );
}

function Component() {
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
    <div className="content-stretch flex items-start relative shrink-0 w-[63px] z-[14]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component9 />
    </div>
  );
}

function Component11() {
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

function Component12() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#246fe5] text-[14px] text-ellipsis">制冷间#1</p>
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
    <div className="content-stretch flex items-start relative shrink-0 w-[199px] z-[13]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component22 />
    </div>
  );
}

function Component24() {
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
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative z-[12]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component30 />
    </div>
  );
}

function Component32() {
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
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative z-[11]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component38 />
    </div>
  );
}

function Component40() {
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
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative z-[10]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component46 />
    </div>
  );
}

function Component48() {
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
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative z-[9]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component54 />
    </div>
  );
}

function Component56() {
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
          <div className="bg-[#ffd873] flex-[1_0_0] min-h-px min-w-px w-full" />
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
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative z-[8]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component62 />
    </div>
  );
}

function Component64() {
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
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative z-[7]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component70 />
    </div>
  );
}

function Component72() {
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

function Component73() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[5]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#ffd873] flex-[1_0_0] min-h-px min-w-px w-full" />
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
          <div className="bg-[#ffd873] flex-[1_0_0] min-h-px min-w-px w-full" />
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
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative z-[6]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component78 />
    </div>
  );
}

function Component80() {
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
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
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
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative z-[5]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component86 />
    </div>
  );
}

function Component88() {
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
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative z-[4]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component94 />
    </div>
  );
}

function Component96() {
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
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
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
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative z-[3]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component102 />
    </div>
  );
}

function Component104() {
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
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative z-[2]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component110 />
    </div>
  );
}

function Component112() {
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
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative z-[1]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component118 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex isolate items-start relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-[0.5px] border-solid inset-[-0.5px] pointer-events-none" />
      <Component10 />
      <Component23 />
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

function Frame11() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full z-[1]">
      <Frame4 />
    </div>
  );
}

function Component171() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Component 390">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col gap-[6px] isolate items-start px-[12px] py-[16px] relative w-full">
        <Frame8 />
        <Frame11 />
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Component171 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[28px] top-[70.03px] w-[1168px]">
      <Frame6 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] items-start leading-[22px] left-[28px] not-italic text-[#626c78] text-[14px] top-[430.03px] w-[1168px]">
      <p className="css-4hzbpn font-['Microsoft_YaHei_UI:Bold',sans-serif] min-w-full relative shrink-0 w-[min-content]">非通风时间段运行的设备</p>
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] relative shrink-0">{`有 3 台送风机在非送风时间段运行，总运行时长为 1.5h  有 5 台排风机在非排风时间段内运行，总运行时长为 2.0h`}</p>
    </div>
  );
}

function Component120() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[12]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-1px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="css-g0mm18 font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full">分类</p>
        </div>
      </div>
    </div>
  );
}

function Component121() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">送风机</p>
    </div>
  );
}

function Component122() {
  return (
    <div className="h-[96px] relative shrink-0 w-full z-[11]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <Component121 />
        </div>
      </div>
    </div>
  );
}

function Component123() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">排风机</p>
    </div>
  );
}

function Component124() {
  return (
    <div className="h-[96px] relative shrink-0 w-full z-[10]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <Component123 />
        </div>
      </div>
    </div>
  );
}

function Component125() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component120 />
      <Component122 />
      <Component124 />
    </div>
  );
}

function Component126() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-[90px] z-[5]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component125 />
    </div>
  );
}

function Component127() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[14]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-1px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="css-4hzbpn font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic relative shrink-0 text-[#626c78] text-[12px] w-full">设备名称</p>
        </div>
      </div>
    </div>
  );
}

function Component128() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#246fe5] text-[14px] text-ellipsis">B01送风机</p>
    </div>
  );
}

function Component129() {
  return (
    <div className="h-[70px] relative shrink-0 w-full z-[13]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <Component128 />
        </div>
      </div>
    </div>
  );
}

function Component130() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#246fe5] text-[14px] text-ellipsis">B02送风机</p>
    </div>
  );
}

function Component131() {
  return (
    <div className="relative shrink-0 w-full z-[12]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component130 />
        </div>
      </div>
    </div>
  );
}

function Component132() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#246fe5] text-[14px] text-ellipsis">1#排风机</p>
    </div>
  );
}

function Component133() {
  return (
    <div className="relative shrink-0 w-full z-[11]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
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
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#246fe5] text-[14px] text-ellipsis">2#排风机</p>
    </div>
  );
}

function Component135() {
  return (
    <div className="relative shrink-0 w-full z-[10]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
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
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component127 />
      <Component129 />
      <Component131 />
      <Component133 />
      <Component135 />
    </div>
  );
}

function Component137() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-[248px] z-[4]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component136 />
    </div>
  );
}

function Component138() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[14]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-1px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="css-g0mm18 font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full">运行时间段</p>
        </div>
      </div>
    </div>
  );
}

function Component139() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-4hzbpn flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] min-h-px min-w-px not-italic relative text-[#1b2129] text-[14px]">07:00~07:30、07:00~07:30、07:00~07:30</p>
    </div>
  );
}

function Component140() {
  return (
    <div className="relative shrink-0 w-full z-[13]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component139 />
        </div>
      </div>
    </div>
  );
}

function Component141() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">07:00~07:30</p>
    </div>
  );
}

function Component142() {
  return (
    <div className="relative shrink-0 w-full z-[12]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component141 />
        </div>
      </div>
    </div>
  );
}

function Component143() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">07:00~07:30</p>
    </div>
  );
}

function Component144() {
  return (
    <div className="relative shrink-0 w-full z-[11]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component143 />
        </div>
      </div>
    </div>
  );
}

function Component145() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">07:00~07:30</p>
    </div>
  );
}

function Component146() {
  return (
    <div className="relative shrink-0 w-full z-[10]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component145 />
        </div>
      </div>
    </div>
  );
}

function Component147() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component138 />
      <Component140 />
      <Component142 />
      <Component144 />
      <Component146 />
    </div>
  );
}

function Component148() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative z-[3]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component147 />
    </div>
  );
}

function Component149() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[14]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-1px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="css-g0mm18 font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full">运行总时长</p>
        </div>
      </div>
    </div>
  );
}

function Component150() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">0.5h</p>
    </div>
  );
}

function Component151() {
  return (
    <div className="h-[71px] relative shrink-0 w-full z-[13]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <Component150 />
        </div>
      </div>
    </div>
  );
}

function Component152() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">0.5h</p>
    </div>
  );
}

function Component153() {
  return (
    <div className="relative shrink-0 w-full z-[12]" data-name="单元格">
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
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">0.5h</p>
    </div>
  );
}

function Component155() {
  return (
    <div className="relative shrink-0 w-full z-[11]" data-name="单元格">
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
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">0.5h</p>
    </div>
  );
}

function Component157() {
  return (
    <div className="relative shrink-0 w-full z-[10]" data-name="单元格">
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
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component149 />
      <Component151 />
      <Component153 />
      <Component155 />
      <Component157 />
    </div>
  );
}

function Component159() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-[95px] z-[2]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component158 />
    </div>
  );
}

function Component160() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[14]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-1px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="css-g0mm18 font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full">服务空间</p>
        </div>
      </div>
    </div>
  );
}

function Component161() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-4hzbpn flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[46.293px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">
        强电间#1、强电间#2、强电间#3、强电间#4、强电间#5、强电间#3、强电间#4、强电间#5、强电间#8、强电间#9、等<span className="font-['Microsoft_YaHei_UI:Bold',sans-serif] text-[#246fe5]">10</span>个空间
      </p>
    </div>
  );
}

function Component162() {
  return (
    <div className="h-[71px] relative shrink-0 w-full z-[13]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <Component161 />
        </div>
      </div>
    </div>
  );
}

function Component163() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">强电间#1、强电间#2、强电间#3</p>
    </div>
  );
}

function Component164() {
  return (
    <div className="relative shrink-0 w-full z-[12]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component163 />
        </div>
      </div>
    </div>
  );
}

function Component165() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">强电间#1、强电间#2、强电间#3、强电间#4</p>
    </div>
  );
}

function Component166() {
  return (
    <div className="relative shrink-0 w-full z-[11]" data-name="单元格">
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
      <p className="css-g0mm18 flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis">强电间#1、强电间#2、强电间#3、强电间#4、强电间#5</p>
    </div>
  );
}

function Component168() {
  return (
    <div className="relative shrink-0 w-full z-[10]" data-name="单元格">
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
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component160 />
      <Component162 />
      <Component164 />
      <Component166 />
      <Component168 />
    </div>
  );
}

function Component170() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-[465px] z-[1]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component169 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="absolute bg-white content-stretch flex isolate items-start left-[28px] top-[494.03px] w-[1168px]">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-[0.5px] border-solid inset-[-0.5px] pointer-events-none" />
      <Component126 />
      <Component137 />
      <Component148 />
      <Component159 />
      <Component170 />
    </div>
  );
}

export default function Frame13() {
  return (
    <div className="bg-[#ebf6ff] relative size-full">
      <p className="absolute css-4hzbpn font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] left-[28px] not-italic text-[#626c78] text-[14px] top-[36.03px] w-[1168px]">
        <span>{`共20个空间执行 `}</span>
        <span className="font-['Microsoft_YaHei_UI:Bold',sans-serif]">工作日</span>
        <span>{` 标准，其中有 `}</span>
        <span className="font-['Microsoft_YaHei_UI:Bold',sans-serif] text-[#636d79]">3</span>
        <span className="font-['Microsoft_YaHei_UI:Bold',sans-serif]"> </span>
        <span>{`个空间出现过温度异常， `}</span>
        <span className="font-['Microsoft_YaHei_UI:Bold',sans-serif]">5</span>
        <span className="font-['Microsoft_YaHei_UI:Bold',sans-serif]"> </span>个空间出现过O<span className="css-d3hzfz text-[9.030000000000001px]">2</span>
        <span>{`浓度异常；有 `}</span>
        <span className="font-['Microsoft_YaHei_UI:Bold',sans-serif] text-[#8b949e]">5</span>
        <span className="font-['Microsoft_YaHei_UI:Bold',sans-serif]"> </span>台设备运行异常。
      </p>
      <Frame7 />
      <Frame12 />
      <Frame5 />
    </div>
  );
}