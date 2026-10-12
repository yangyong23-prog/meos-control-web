import imgGestureCopy22 from "@/assets/3f08508c51c8fcfd2fcbf93d340e307172f4cf1b.png";

function Frame21() {
  return (
    <div className="bg-[#ebf6ff] content-stretch flex h-full items-center p-[8px] relative shrink-0 w-[112px]">
      <div aria-hidden="true" className="absolute border-[#246fe5] border-l-2 border-solid inset-[0_0_0_-1px] pointer-events-none" />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#1b2129] text-[14px]" style={{ fontFeatureSettings: "'pwid'" }}>
        冷机台数
      </p>
    </div>
  );
}

function Frame22() {
  return (
    <div className="bg-[#ebf6ff] h-[70px] relative rounded-[4px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#9fc9fb] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center p-[8px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#1b2129] text-[14px]" style={{ fontFeatureSettings: "'pwid'" }}>
            设定值
          </p>
        </div>
      </div>
    </div>
  );
}

function Frame23() {
  return (
    <div className="bg-[#f1f4f6] content-stretch flex flex-[1_0_0] items-start justify-center min-h-px min-w-px p-[8px] relative rounded-[4px]">
      <div aria-hidden="true" className="absolute border-[#8b949e] border-[0.5px] border-dashed inset-0 pointer-events-none rounded-[4px]" />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#8b949e] text-[14px]" style={{ fontFeatureSettings: "'pwid'" }}>
        AI策略
      </p>
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-full items-start justify-center relative shrink-0">
      <Frame22 />
      <Frame23 />
    </div>
  );
}

function Frame() {
  return (
    <div className="bg-[#ebf6ff] content-stretch flex flex-col gap-[8px] items-start justify-center p-[8px] relative rounded-[4px] shrink-0 w-[126px]">
      <div aria-hidden="true" className="absolute border-[#9fc9fb] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#215dd9] text-[14px] text-center">0大0小</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="bg-[#ebf6ff] content-stretch flex flex-col gap-[8px] items-start justify-center opacity-0 p-[8px] relative rounded-[4px] shrink-0 w-[26px]">
      <div aria-hidden="true" className="absolute border-[#9fc9fb] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#215dd9] text-[14px] text-center">0大1小</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="bg-[#ebf6ff] content-stretch flex flex-col gap-[8px] items-start justify-center p-[8px] relative rounded-[4px] shrink-0">
      <div aria-hidden="true" className="absolute border-[#9fc9fb] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#215dd9] text-[14px] text-center">1大2小</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="bg-[#d9ebff] content-stretch flex flex-col gap-[8px] items-start justify-center p-[8px] relative rounded-[4px] shrink-0 w-[487px]">
      <div aria-hidden="true" className="absolute border-[#246fe5] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#215dd9] text-[14px] text-center">2大2小</p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="bg-[#ebf6ff] flex-[1_0_0] min-h-px min-w-px relative rounded-[4px]">
      <div aria-hidden="true" className="absolute border-[#9fc9fb] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col gap-[8px] items-start justify-center p-[8px] relative w-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#215dd9] text-[14px] text-center">1大1小</p>
        </div>
      </div>
    </div>
  );
}

function MouseHover() {
  return (
    <div className="absolute left-[487px] size-[24px] top-[8px]" data-name="mouse / hover">
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

function Frame8() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
      <Frame />
      <Frame1 />
      <Frame2 />
      <Frame1 />
      <Frame5 />
      <Frame6 />
      <MouseHover />
    </div>
  );
}

function Frame3() {
  return (
    <div className="bg-[#ebf6ff] content-stretch flex flex-col gap-[8px] items-start justify-center opacity-0 p-[8px] relative rounded-[4px] shrink-0 w-[126px]">
      <div aria-hidden="true" className="absolute border-[#9fc9fb] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#215dd9] text-[14px] text-center">0大0小</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="bg-[#ebf6ff] content-stretch flex flex-col gap-[8px] items-start justify-center opacity-0 p-[8px] relative rounded-[4px] shrink-0">
      <div aria-hidden="true" className="absolute border-[#9fc9fb] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#215dd9] text-[14px] text-center">0大1小</p>
    </div>
  );
}

function Frame7() {
  return (
    <div className="bg-[#ebf6ff] opacity-0 relative rounded-[4px] shrink-0 w-[10px]">
      <div aria-hidden="true" className="absolute border-[#9fc9fb] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col gap-[8px] items-start justify-center p-[8px] relative w-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#215dd9] text-[14px] text-center">1大2小</p>
        </div>
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="bg-[#ebf6ff] content-stretch flex flex-col gap-[8px] items-start justify-center p-[8px] relative rounded-[4px] shrink-0 w-[38px]">
      <div aria-hidden="true" className="absolute border-[#9fc9fb] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#215dd9] text-[14px] text-center">0大1小</p>
    </div>
  );
}

function Frame12() {
  return (
    <div className="bg-[#ebf6ff] content-stretch flex flex-col gap-[8px] items-start justify-center opacity-0 p-[8px] relative rounded-[4px] shrink-0 w-[487px]">
      <div aria-hidden="true" className="absolute border-[#9fc9fb] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#215dd9] text-[14px] text-center">2大2小</p>
    </div>
  );
}

function Frame13() {
  return (
    <div className="bg-[#ebf6ff] flex-[1_0_0] min-h-px min-w-px opacity-0 relative rounded-[4px]">
      <div aria-hidden="true" className="absolute border-[#9fc9fb] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col gap-[8px] items-start justify-center p-[8px] relative w-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#215dd9] text-[14px] text-center">1大1小</p>
        </div>
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[2px] items-center px-[16px] relative w-full">
          <Frame3 />
          <Frame4 />
          <Frame7 />
          <Frame9 />
          <Frame12 />
          <Frame13 />
        </div>
      </div>
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
      <Frame8 />
      <Frame10 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="bg-[#f1f4f6] content-stretch flex flex-col gap-[8px] items-start justify-center p-[8px] relative rounded-[4px] shrink-0 w-[126px]">
      <div aria-hidden="true" className="absolute border-[#8b949e] border-[0.5px] border-dashed inset-0 pointer-events-none rounded-[4px]" />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#8b949e] text-[14px] text-center">0大0小</p>
    </div>
  );
}

function Frame16() {
  return (
    <div className="bg-[#f1f4f6] content-stretch flex flex-col gap-[8px] items-start justify-center p-[8px] relative rounded-[4px] shrink-0">
      <div aria-hidden="true" className="absolute border-[#8b949e] border-[0.5px] border-dashed inset-0 pointer-events-none rounded-[4px]" />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#8b949e] text-[14px] text-center">1大2小</p>
    </div>
  );
}

function Frame17() {
  return (
    <div className="bg-[#f1f4f6] content-stretch flex flex-col gap-[8px] items-start justify-center p-[8px] relative rounded-[4px] shrink-0 w-[290px]">
      <div aria-hidden="true" className="absolute border-[#8b949e] border-[0.5px] border-dashed inset-0 pointer-events-none rounded-[4px]" />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#8b949e] text-[14px] text-center">2大2小</p>
    </div>
  );
}

function Frame18() {
  return (
    <div className="bg-[#f1f4f6] flex-[1_0_0] min-h-px min-w-px relative rounded-[4px]">
      <div aria-hidden="true" className="absolute border-[#8b949e] border-[0.5px] border-dashed inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col gap-[8px] items-start justify-center p-[8px] relative w-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#8b949e] text-[14px] text-center">1大1小</p>
        </div>
      </div>
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
      <Frame15 />
      <Frame16 />
      <Frame17 />
      <Frame18 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame19 />
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[10px] items-start min-h-px min-w-px relative">
      <Frame14 />
      <Frame11 />
    </div>
  );
}

function Frame20() {
  return (
    <div className="absolute bg-[#ebf6ff] content-stretch flex flex-col gap-[8px] items-start justify-center left-[312px] p-[8px] rounded-[4px] top-[38px] w-[33px]">
      <div aria-hidden="true" className="absolute border-[#9fc9fb] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#215dd9] text-[14px] text-center">0大1小</p>
    </div>
  );
}

function Component() {
  return (
    <div className="absolute content-stretch flex gap-[8px] items-center left-[12.5px] py-[4px] top-[17px] w-[1144px]" data-name="横坐标">
      <div className="flex flex-row items-center self-stretch">
        <Frame21 />
      </div>
      <div className="flex flex-row items-center self-stretch">
        <Frame24 />
      </div>
      <Frame25 />
      <Frame20 />
    </div>
  );
}

export default function Frame26() {
  return (
    <div className="bg-white relative size-full">
      <Component />
    </div>
  );
}