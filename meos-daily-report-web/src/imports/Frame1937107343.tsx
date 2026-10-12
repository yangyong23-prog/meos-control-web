function Component() {
  return (
    <div className="content-stretch flex gap-[9px] items-center relative rounded-[4px] shrink-0" data-name="小蓝标">
      <div className="bg-[#246fe5] h-[20px] shrink-0 w-[3px]" />
      <p className="font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[28px] not-italic relative shrink-0 text-[#2e3742] text-[20px] whitespace-pre">能耗分析</p>
    </div>
  );
}

function Component1() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[16]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-1px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full whitespace-nowrap">分项名称</p>
        </div>
      </div>
    </div>
  );
}

function Component2() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">公区</p>
    </div>
  );
}

function Component3() {
  return (
    <div className="relative shrink-0 w-full z-[15]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component2 />
        </div>
      </div>
    </div>
  );
}

function Component4() {
  return (
    <div className="relative shrink-0 w-full" data-name="内容">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-0 py-0 relative w-full">
          <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">暖通空调</p>
        </div>
      </div>
    </div>
  );
}

function Component5() {
  return (
    <div className="relative shrink-0 w-full z-[14]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component4 />
        </div>
      </div>
    </div>
  );
}

function Component6() {
  return (
    <div className="relative shrink-0 w-full" data-name="内容">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-0 py-0 relative w-full">
          <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">公共照明</p>
        </div>
      </div>
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
    <div className="relative shrink-0 w-full" data-name="内容">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-0 py-0 relative w-full">
          <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">电扶梯</p>
        </div>
      </div>
    </div>
  );
}

function Component9() {
  return (
    <div className="relative shrink-0 w-full z-[12]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component8 />
        </div>
      </div>
    </div>
  );
}

function Component10() {
  return (
    <div className="relative shrink-0 w-full" data-name="内容">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-0 py-0 relative w-full">
          <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">给排水</p>
        </div>
      </div>
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
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">其他</p>
    </div>
  );
}

function Component13() {
  return (
    <div className="relative shrink-0 w-full z-[10]" data-name="单元格">
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
      <Component1 />
      <Component3 />
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
    <div className="content-stretch flex items-start relative shrink-0 w-[177px] z-[6]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component14 />
    </div>
  );
}

function Component16() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[16]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-1px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full whitespace-nowrap">日能耗（08.27）</p>
        </div>
      </div>
    </div>
  );
}

function Component17() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">20000 KWh</p>
    </div>
  );
}

function Component18() {
  return (
    <div className="relative shrink-0 w-full z-[15]" data-name="单元格">
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
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">15000 KWh</p>
    </div>
  );
}

function Component20() {
  return (
    <div className="relative shrink-0 w-full z-[14]" data-name="单元格">
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
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">2000 KWh</p>
    </div>
  );
}

function Component22() {
  return (
    <div className="relative shrink-0 w-full z-[13]" data-name="单元格">
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
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">2000 KWh</p>
    </div>
  );
}

function Component24() {
  return (
    <div className="relative shrink-0 w-full z-[12]" data-name="单元格">
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
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">1000 KWh</p>
    </div>
  );
}

function Component26() {
  return (
    <div className="relative shrink-0 w-full z-[11]" data-name="单元格">
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
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">12180 KWh</p>
    </div>
  );
}

function Component28() {
  return (
    <div className="relative shrink-0 w-full z-[10]" data-name="单元格">
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
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component16 />
      <Component18 />
      <Component20 />
      <Component22 />
      <Component24 />
      <Component26 />
      <Component28 />
    </div>
  );
}

function Component30() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-[235px] z-[5]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component29 />
    </div>
  );
}

function Component31() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[16]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-1px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full whitespace-nowrap">日能耗占项目用电比</p>
        </div>
      </div>
    </div>
  );
}

function Component32() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">60.0%</p>
    </div>
  );
}

function Component33() {
  return (
    <div className="relative shrink-0 w-full z-[15]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component32 />
        </div>
      </div>
    </div>
  );
}

function Component34() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">40.0%</p>
    </div>
  );
}

function Component35() {
  return (
    <div className="relative shrink-0 w-full z-[14]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component34 />
        </div>
      </div>
    </div>
  );
}

function Component36() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">10.0%</p>
    </div>
  );
}

function Component37() {
  return (
    <div className="relative shrink-0 w-full z-[13]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
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
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">5.0%</p>
    </div>
  );
}

function Component39() {
  return (
    <div className="relative shrink-0 w-full z-[12]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
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
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">5.0%</p>
    </div>
  );
}

function Component41() {
  return (
    <div className="relative shrink-0 w-full z-[11]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
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
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">40.0%</p>
    </div>
  );
}

function Component43() {
  return (
    <div className="relative shrink-0 w-full z-[10]" data-name="单元格">
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component42 />
        </div>
      </div>
    </div>
  );
}

function Component44() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component31 />
      <Component33 />
      <Component35 />
      <Component37 />
      <Component39 />
      <Component41 />
      <Component43 />
    </div>
  );
}

function Component45() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-[164px] z-[4]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component44 />
    </div>
  );
}

function Component46() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[16]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-1px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full whitespace-nowrap">上周相似日平均能耗</p>
        </div>
      </div>
    </div>
  );
}

function Component47() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">200000 kWh</p>
    </div>
  );
}

function Component48() {
  return (
    <div className="relative shrink-0 w-full z-[15]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component47 />
        </div>
      </div>
    </div>
  );
}

function Component49() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">200000 kWh</p>
    </div>
  );
}

function Component50() {
  return (
    <div className="relative shrink-0 w-full z-[14]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component49 />
        </div>
      </div>
    </div>
  );
}

function Component51() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">200000 kWh</p>
    </div>
  );
}

function Component52() {
  return (
    <div className="relative shrink-0 w-full z-[13]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component51 />
        </div>
      </div>
    </div>
  );
}

function Component53() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">200000 kWh</p>
    </div>
  );
}

function Component54() {
  return (
    <div className="relative shrink-0 w-full z-[12]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component53 />
        </div>
      </div>
    </div>
  );
}

function Component55() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">200000 kWh</p>
    </div>
  );
}

function Component56() {
  return (
    <div className="relative shrink-0 w-full z-[11]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component55 />
        </div>
      </div>
    </div>
  );
}

function Component57() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">200000 kWh</p>
    </div>
  );
}

function Component58() {
  return (
    <div className="relative shrink-0 w-full z-[10]" data-name="单元格">
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component57 />
        </div>
      </div>
    </div>
  );
}

function Component59() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component46 />
      <Component48 />
      <Component50 />
      <Component52 />
      <Component54 />
      <Component56 />
      <Component58 />
    </div>
  );
}

function Component60() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-[172px] z-[3]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component59 />
    </div>
  );
}

function Component61() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[16]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-1px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full whitespace-nowrap">环比</p>
        </div>
      </div>
    </div>
  );
}

function Component62() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#f55047] text-[14px] text-ellipsis whitespace-pre">增长 5.0%</p>
    </div>
  );
}

function Component63() {
  return (
    <div className="relative shrink-0 w-full z-[15]" data-name="单元格">
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
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#f55047] text-[14px] text-ellipsis whitespace-pre">增长 5.0%</p>
    </div>
  );
}

function Component65() {
  return (
    <div className="relative shrink-0 w-full z-[14]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component64 />
        </div>
      </div>
    </div>
  );
}

function Component66() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#09b3b5] text-[14px] text-ellipsis whitespace-pre">下降 4.0%</p>
    </div>
  );
}

function Component67() {
  return (
    <div className="relative shrink-0 w-full z-[13]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component66 />
        </div>
      </div>
    </div>
  );
}

function Component68() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#f55047] text-[14px] text-ellipsis whitespace-pre">增长 5.0%</p>
    </div>
  );
}

function Component69() {
  return (
    <div className="relative shrink-0 w-full z-[12]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component68 />
        </div>
      </div>
    </div>
  );
}

function Component70() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#f55047] text-[14px] text-ellipsis whitespace-pre">增长 5.0%</p>
    </div>
  );
}

function Component71() {
  return (
    <div className="relative shrink-0 w-full z-[11]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component70 />
        </div>
      </div>
    </div>
  );
}

function Component72() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#09b3b5] text-[14px] text-ellipsis whitespace-pre">下降 3.0%</p>
    </div>
  );
}

function Component73() {
  return (
    <div className="relative shrink-0 w-full z-[10]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component72 />
        </div>
      </div>
    </div>
  );
}

function Component74() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component61 />
      <Component63 />
      <Component65 />
      <Component67 />
      <Component69 />
      <Component71 />
      <Component73 />
    </div>
  );
}

function Component75() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative z-[2]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component74 />
    </div>
  );
}

function Component76() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[17]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-1px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full whitespace-nowrap">月累计能耗（截止08.27）</p>
        </div>
      </div>
    </div>
  );
}

function Component77() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">200000 kWh</p>
    </div>
  );
}

function Component78() {
  return (
    <div className="relative shrink-0 w-full z-[15]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component77 />
        </div>
      </div>
    </div>
  );
}

function Component79() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">200000 kWh</p>
    </div>
  );
}

function Component80() {
  return (
    <div className="relative shrink-0 w-full z-[14]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component79 />
        </div>
      </div>
    </div>
  );
}

function Component81() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">200000 kWh</p>
    </div>
  );
}

function Component82() {
  return (
    <div className="relative shrink-0 w-full z-[13]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component81 />
        </div>
      </div>
    </div>
  );
}

function Component83() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">200000 kWh</p>
    </div>
  );
}

function Component84() {
  return (
    <div className="relative shrink-0 w-full z-[12]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component83 />
        </div>
      </div>
    </div>
  );
}

function Component85() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">200000 kWh</p>
    </div>
  );
}

function Component86() {
  return (
    <div className="relative shrink-0 w-full z-[11]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component85 />
        </div>
      </div>
    </div>
  );
}

function Component87() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">200000 kWh</p>
    </div>
  );
}

function Component88() {
  return (
    <div className="relative shrink-0 w-full z-[10]" data-name="单元格">
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component87 />
        </div>
      </div>
    </div>
  );
}

function Component89() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component76 />
      <Component78 />
      <Component80 />
      <Component82 />
      <Component84 />
      <Component86 />
      <Component88 />
    </div>
  );
}

function Component90() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-[172px] z-[1]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component89 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex isolate items-start relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-[0.5px] border-solid inset-[-0.5px] pointer-events-none" />
      <Component15 />
      <Component30 />
      <Component45 />
      <Component60 />
      <Component75 />
      <Component90 />
    </div>
  );
}

function Frame() {
  return (
    <div className="bg-[rgba(255,255,255,0.5)] content-stretch flex flex-col gap-[12px] items-start p-[16px] relative rounded-[8px] shrink-0 w-[1200px]">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.04)]" />
      <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#626c78] text-[0px] text-[14px] w-full whitespace-pre-wrap">
        本日（08.27）项目总用电：<span className="font-['Microsoft_YaHei_UI:Bold',sans-serif]">32180kWh</span>
        <span>{`；截止08.27当月总用电量为 `}</span>
        <span className="font-['Microsoft_YaHei_UI:Bold',sans-serif]">320180kWh</span>，各分项用电量如下：
      </p>
      <Frame4 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
      <Component />
      <Frame />
    </div>
  );
}

function Component91() {
  return (
    <div className="content-stretch flex gap-[9px] items-center relative rounded-[4px] shrink-0" data-name="小蓝标">
      <div className="bg-[#246fe5] h-[20px] shrink-0 w-[3px]" />
      <p className="font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[28px] not-italic relative shrink-0 text-[#2e3742] text-[20px] whitespace-pre">能耗预算</p>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col font-['Microsoft_YaHei_UI:Regular',sans-serif] gap-[4px] items-start leading-[22px] not-italic relative shrink-0 text-[#626c78] text-[0px] text-[14px] w-full whitespace-pre-wrap">
      <p className="relative shrink-0 w-full">
        <span>{`本日（08.27）：预算为 `}</span>
        <span className="font-['Microsoft_YaHei_UI:Bold',sans-serif]">3000kWh</span>，实际能耗为<span className="font-['Microsoft_YaHei_UI:Bold',sans-serif]">{` 2800kWh`}</span>
        <span>{`，实际能耗占预算比为 `}</span>
        <span className="font-['Microsoft_YaHei_UI:Bold',sans-serif]">80%</span>
      </p>
      <p className="relative shrink-0 w-full">
        <span>{`截止08.27：累计预算为 `}</span>
        <span className="font-['Microsoft_YaHei_UI:Bold',sans-serif]">320180kWh</span>
        <span>{`，累计实际能耗为 `}</span>
        <span className="font-['Microsoft_YaHei_UI:Bold',sans-serif]">18000kWh</span>
        <span>{`，实际能耗占预算比为 `}</span>
        <span className="font-['Microsoft_YaHei_UI:Bold',sans-serif]">80%</span>
      </p>
      <p className="relative shrink-0 w-full">
        <span>{`8月：总预算为 `}</span>
        <span className="font-['Microsoft_YaHei_UI:Bold',sans-serif]">18000kWh</span>
        <span>{`，截止本日已用当月预算的 `}</span>
        <span className="font-['Microsoft_YaHei_UI:Bold',sans-serif]">80%</span>，各预算分项使用情况如下：
      </p>
    </div>
  );
}

function Component92() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[15]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-1px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full whitespace-nowrap">分项名称</p>
        </div>
      </div>
    </div>
  );
}

function Component93() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">公区</p>
    </div>
  );
}

function Component94() {
  return (
    <div className="relative shrink-0 w-full z-[14]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component93 />
        </div>
      </div>
    </div>
  );
}

function Component95() {
  return (
    <div className="relative shrink-0 w-full" data-name="内容">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-0 py-0 relative w-full">
          <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">暖通空调</p>
        </div>
      </div>
    </div>
  );
}

function Component96() {
  return (
    <div className="relative shrink-0 w-full z-[13]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component95 />
        </div>
      </div>
    </div>
  );
}

function Component97() {
  return (
    <div className="relative shrink-0 w-full" data-name="内容">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-0 py-0 relative w-full">
          <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">公共照明</p>
        </div>
      </div>
    </div>
  );
}

function Component98() {
  return (
    <div className="relative shrink-0 w-full z-[12]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component97 />
        </div>
      </div>
    </div>
  );
}

function Component99() {
  return (
    <div className="relative shrink-0 w-full" data-name="内容">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-0 py-0 relative w-full">
          <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">电扶梯</p>
        </div>
      </div>
    </div>
  );
}

function Component100() {
  return (
    <div className="relative shrink-0 w-full z-[11]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
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
    <div className="relative shrink-0 w-full" data-name="内容">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-0 py-0 relative w-full">
          <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">给排水</p>
        </div>
      </div>
    </div>
  );
}

function Component102() {
  return (
    <div className="relative shrink-0 w-full z-[10]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
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
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component92 />
      <Component94 />
      <Component96 />
      <Component98 />
      <Component100 />
      <Component102 />
    </div>
  );
}

function Component104() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-[136px] z-[8]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component103 />
    </div>
  );
}

function Component105() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[15]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-1px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic relative shrink-0 text-[#626c78] text-[12px] w-full whitespace-pre-wrap">本日预算(08.27)</p>
        </div>
      </div>
    </div>
  );
}

function Component106() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">20000 KWh</p>
    </div>
  );
}

function Component107() {
  return (
    <div className="relative shrink-0 w-full z-[14]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component106 />
        </div>
      </div>
    </div>
  );
}

function Component108() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">15000 KWh</p>
    </div>
  );
}

function Component109() {
  return (
    <div className="relative shrink-0 w-full z-[13]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component108 />
        </div>
      </div>
    </div>
  );
}

function Component110() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">2000 KWh</p>
    </div>
  );
}

function Component111() {
  return (
    <div className="relative shrink-0 w-full z-[12]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component110 />
        </div>
      </div>
    </div>
  );
}

function Component112() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">2000 KWh</p>
    </div>
  );
}

function Component113() {
  return (
    <div className="relative shrink-0 w-full z-[11]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component112 />
        </div>
      </div>
    </div>
  );
}

function Component114() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">1000 KWh</p>
    </div>
  );
}

function Component115() {
  return (
    <div className="relative shrink-0 w-full z-[10]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component114 />
        </div>
      </div>
    </div>
  );
}

function Component116() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component105 />
      <Component107 />
      <Component109 />
      <Component111 />
      <Component113 />
      <Component115 />
    </div>
  );
}

function Component117() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-[119px] z-[7]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component116 />
    </div>
  );
}

function Component118() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[15]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-1px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full whitespace-nowrap">日实际能耗(08.27)</p>
        </div>
      </div>
    </div>
  );
}

function Component119() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">20000 KWh</p>
    </div>
  );
}

function Component120() {
  return (
    <div className="relative shrink-0 w-full z-[14]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
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
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">1500 KWh</p>
    </div>
  );
}

function Component122() {
  return (
    <div className="relative shrink-0 w-full z-[13]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
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
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">2000 KWh</p>
    </div>
  );
}

function Component124() {
  return (
    <div className="relative shrink-0 w-full z-[12]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
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
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">2000 KWh</p>
    </div>
  );
}

function Component126() {
  return (
    <div className="relative shrink-0 w-full z-[11]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
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
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">2000 KWh</p>
    </div>
  );
}

function Component128() {
  return (
    <div className="relative shrink-0 w-full z-[10]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component127 />
        </div>
      </div>
    </div>
  );
}

function Component129() {
  return (
    <div className="content-stretch flex flex-col isolate items-start overflow-clip relative shrink-0 w-[139px]" data-name="列内容">
      <Component118 />
      <Component120 />
      <Component122 />
      <Component124 />
      <Component126 />
      <Component128 />
    </div>
  );
}

function Component130() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 z-[6]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component129 />
    </div>
  );
}

function Component131() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[15]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-1px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full whitespace-nowrap">日实际能耗与预算差值</p>
        </div>
      </div>
    </div>
  );
}

function Component132() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#f55047] text-[14px] text-ellipsis whitespace-nowrap">+1000 kwh</p>
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
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">-2000 kWh</p>
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
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#f55047] text-[14px] text-ellipsis whitespace-nowrap">+2000 kWh</p>
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
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">-1000 kWh</p>
    </div>
  );
}

function Component139() {
  return (
    <div className="relative shrink-0 w-full z-[11]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component138 />
        </div>
      </div>
    </div>
  );
}

function Component140() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">0 kWh</p>
    </div>
  );
}

function Component141() {
  return (
    <div className="relative shrink-0 w-full z-[10]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component140 />
        </div>
      </div>
    </div>
  );
}

function Component142() {
  return (
    <div className="content-stretch flex flex-col isolate items-start overflow-clip relative shrink-0 w-[157px]" data-name="列内容">
      <Component131 />
      <Component133 />
      <Component135 />
      <Component137 />
      <Component139 />
      <Component141 />
    </div>
  );
}

function Component143() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 z-[5]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component142 />
    </div>
  );
}

function Component144() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[15]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-1px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full whitespace-nowrap">日能耗占比预算比</p>
        </div>
      </div>
    </div>
  );
}

function Component145() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#f55047] text-[14px] text-ellipsis whitespace-nowrap">110%</p>
    </div>
  );
}

function Component146() {
  return (
    <div className="relative shrink-0 w-full z-[14]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
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
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">90%</p>
    </div>
  );
}

function Component148() {
  return (
    <div className="relative shrink-0 w-full z-[13]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component147 />
        </div>
      </div>
    </div>
  );
}

function Component149() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#f55047] text-[14px] text-ellipsis whitespace-nowrap">110%</p>
    </div>
  );
}

function Component150() {
  return (
    <div className="relative shrink-0 w-full z-[12]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component149 />
        </div>
      </div>
    </div>
  );
}

function Component151() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">90%</p>
    </div>
  );
}

function Component152() {
  return (
    <div className="relative shrink-0 w-full z-[11]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component151 />
        </div>
      </div>
    </div>
  );
}

function Component153() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">100%</p>
    </div>
  );
}

function Component154() {
  return (
    <div className="relative shrink-0 w-full z-[10]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component153 />
        </div>
      </div>
    </div>
  );
}

function Component155() {
  return (
    <div className="content-stretch flex flex-col isolate items-start overflow-clip relative shrink-0 w-[128px]" data-name="列内容">
      <Component144 />
      <Component146 />
      <Component148 />
      <Component150 />
      <Component152 />
      <Component154 />
    </div>
  );
}

function Component156() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 z-[4]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component155 />
    </div>
  );
}

function Component157() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[15]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-1px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full whitespace-nowrap">月累计能耗(截止08.27)</p>
        </div>
      </div>
    </div>
  );
}

function Component158() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#1b2129] text-[14px] text-ellipsis whitespace-pre">20000 kwh</p>
    </div>
  );
}

function Component159() {
  return (
    <div className="relative shrink-0 w-full z-[14]" data-name="单元格">
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
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#1b2129] text-[14px] text-ellipsis whitespace-pre">20000 kwh</p>
    </div>
  );
}

function Component161() {
  return (
    <div className="relative shrink-0 w-full z-[13]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component160 />
        </div>
      </div>
    </div>
  );
}

function Component162() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#1b2129] text-[14px] text-ellipsis whitespace-pre">20000 kwh</p>
    </div>
  );
}

function Component163() {
  return (
    <div className="relative shrink-0 w-full z-[12]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component162 />
        </div>
      </div>
    </div>
  );
}

function Component164() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#1b2129] text-[14px] text-ellipsis whitespace-pre">20000 kwh</p>
    </div>
  );
}

function Component165() {
  return (
    <div className="relative shrink-0 w-full z-[11]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component164 />
        </div>
      </div>
    </div>
  );
}

function Component166() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#1b2129] text-[14px] text-ellipsis whitespace-pre">20000 kwh</p>
    </div>
  );
}

function Component167() {
  return (
    <div className="relative shrink-0 w-full z-[10]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component166 />
        </div>
      </div>
    </div>
  );
}

function Component168() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component157 />
      <Component159 />
      <Component161 />
      <Component163 />
      <Component165 />
      <Component167 />
    </div>
  );
}

function Component169() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-[156px] z-[3]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component168 />
    </div>
  );
}

function Component170() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[15]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-1px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full whitespace-nowrap">月总预算（8月）</p>
        </div>
      </div>
    </div>
  );
}

function Component171() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#1b2129] text-[14px] text-ellipsis whitespace-pre">20000 kwh</p>
    </div>
  );
}

function Component172() {
  return (
    <div className="relative shrink-0 w-full z-[14]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component171 />
        </div>
      </div>
    </div>
  );
}

function Component173() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#1b2129] text-[14px] text-ellipsis whitespace-pre">20000 kwh</p>
    </div>
  );
}

function Component174() {
  return (
    <div className="relative shrink-0 w-full z-[13]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component173 />
        </div>
      </div>
    </div>
  );
}

function Component175() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#1b2129] text-[14px] text-ellipsis whitespace-pre">20000 kwh</p>
    </div>
  );
}

function Component176() {
  return (
    <div className="relative shrink-0 w-full z-[12]" data-name="单元格">
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
      <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#1b2129] text-[14px] text-ellipsis whitespace-pre">20000 kwh</p>
    </div>
  );
}

function Component178() {
  return (
    <div className="relative shrink-0 w-full z-[11]" data-name="单元格">
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
      <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#1b2129] text-[14px] text-ellipsis whitespace-pre">20000 kwh</p>
    </div>
  );
}

function Component180() {
  return (
    <div className="relative shrink-0 w-full z-[10]" data-name="单元格">
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
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component170 />
      <Component172 />
      <Component174 />
      <Component176 />
      <Component178 />
      <Component180 />
    </div>
  );
}

function Component182() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-[127px] z-[2]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component181 />
    </div>
  );
}

function Component183() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[16]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-1px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full whitespace-nowrap">已用月总预算比例（截止08.27）</p>
        </div>
      </div>
    </div>
  );
}

function Component184() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#f55047] text-[14px] text-ellipsis whitespace-nowrap">105%</p>
    </div>
  );
}

function Component185() {
  return (
    <div className="relative shrink-0 w-full z-[14]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component184 />
        </div>
      </div>
    </div>
  );
}

function Component186() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">80%</p>
    </div>
  );
}

function Component187() {
  return (
    <div className="relative shrink-0 w-full z-[13]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component186 />
        </div>
      </div>
    </div>
  );
}

function Component188() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">80%</p>
    </div>
  );
}

function Component189() {
  return (
    <div className="relative shrink-0 w-full z-[12]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component188 />
        </div>
      </div>
    </div>
  );
}

function Component190() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#f55047] text-[14px] text-ellipsis whitespace-nowrap">105%</p>
    </div>
  );
}

function Component191() {
  return (
    <div className="relative shrink-0 w-full z-[11]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component190 />
        </div>
      </div>
    </div>
  );
}

function Component192() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">100%</p>
    </div>
  );
}

function Component193() {
  return (
    <div className="relative shrink-0 w-full z-[10]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component192 />
        </div>
      </div>
    </div>
  );
}

function Component194() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component183 />
      <Component185 />
      <Component187 />
      <Component189 />
      <Component191 />
      <Component193 />
    </div>
  );
}

function Component195() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative z-[1]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component194 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex isolate items-start relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-[0.5px] border-solid inset-[-0.5px] pointer-events-none" />
      <Component104 />
      <Component117 />
      <Component130 />
      <Component143 />
      <Component156 />
      <Component169 />
      <Component182 />
      <Component195 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="bg-[rgba(255,255,255,0.5)] content-stretch flex flex-col gap-[12px] items-start p-[16px] relative rounded-[8px] shrink-0 w-[1200px] z-[1]">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.04)]" />
      <Frame7 />
      <Frame5 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-col isolate items-center relative shrink-0">
      <Frame1 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
      <Component91 />
      <Frame6 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[24px] items-start left-[77px] top-[89.53px] w-[1200px]">
      <Frame2 />
      <Frame3 />
    </div>
  );
}

export default function Frame9() {
  return (
    <div className="bg-[#ebf6ff] relative size-full">
      <Frame8 />
    </div>
  );
}