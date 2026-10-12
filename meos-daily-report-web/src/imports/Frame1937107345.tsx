function Component() {
  return (
    <div className="content-stretch flex gap-[9px] items-center relative rounded-[4px] shrink-0" data-name="小蓝标">
      <div className="bg-[#246fe5] h-[20px] shrink-0 w-[3px]" />
      <p className="font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[28px] not-italic relative shrink-0 text-[#2e3742] text-[20px] whitespace-pre">通风</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col isolate items-start pb-[12px] pt-0 px-0 relative shrink-0">
      <p className="font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[28px] not-italic relative shrink-0 text-[#2e3742] text-[20px] whitespace-pre z-[2]">机房后勤</p>
      <div className="bg-[rgba(0,148,255,0.2)] h-[12px] mb-[-12px] shrink-0 w-full z-[1]" />
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-[144px]">
      <p className="font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#2e3742] text-[16px] whitespace-pre">设备异常记录</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#2481f2] h-[3px] shrink-0 w-[16px]" data-name="矩形" />
      <p className="font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px] whitespace-pre">冷机台数设定</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#09b3b5] h-[3px] shrink-0 w-[16px]" data-name="矩形" />
      <p className="font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px] whitespace-pre">AI策略台数设定</p>
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
      <Frame3 />
      <Frame4 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex items-center opacity-0 relative shrink-0">
      <Frame16 />
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame23 />
      <Frame17 />
    </div>
  );
}

function Component1() {
  return <div className="bg-[#a6aaac] rounded-[12px] shrink-0 size-[10px]" data-name="步骤点" />;
}

function Frame31() {
  return (
    <div className="content-stretch flex h-[17px] items-center relative shrink-0">
      <Component1 />
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
      <p className="font-['Persagy2.0:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px] w-[62px] whitespace-pre-wrap">00:30:00</p>
      <Frame31 />
      <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px] text-right whitespace-pre">
        <span className="font-['Microsoft_YaHei_UI:Bold',sans-serif]">1#冷冻水泵</span>
        <span>{` 发生 变频器状态反馈与指令不符报警`}</span>
      </p>
    </div>
  );
}

function Frame29() {
  return (
    <div className="h-[21px] relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[79px] py-0 relative size-full">
          <div className="h-[30px] relative shrink-0 w-0" data-name="线">
            <div className="absolute inset-[0_-0.5px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 30">
                <path d="M0.5 0V30" id="çº¿" stroke="var(--stroke-0, #8B949E)" strokeDasharray="3 3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Component2() {
  return <div className="bg-[#a6aaac] rounded-[12px] shrink-0 size-[10px]" data-name="步骤点" />;
}

function Frame33() {
  return (
    <div className="content-stretch flex h-[17px] items-center relative shrink-0">
      <Component2 />
    </div>
  );
}

function Frame32() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
      <p className="font-['Persagy2.0:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px] w-[62px] whitespace-pre-wrap">01:15:00</p>
      <Frame33 />
      <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px] text-right whitespace-pre">
        <span className="font-['Microsoft_YaHei_UI:Bold',sans-serif]">2#电动通断水阀</span>
        <span>{` 发生 控制失能报警`}</span>
      </p>
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame25 />
      <Frame29 />
      <Frame32 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col gap-[12px] items-start px-[12px] py-[16px] relative w-full">
        <Frame22 />
        <Frame26 />
      </div>
    </div>
  );
}

function Frame11() {
  return (
    <div className="bg-[rgba(255,255,255,0.5)] content-stretch flex flex-col gap-[12px] items-start p-[16px] relative rounded-[8px] shrink-0 w-[1200px]">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.04)]" />
      <Frame />
      <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] min-w-full not-italic relative shrink-0 text-[#626c78] text-[14px] w-[min-content] whitespace-pre-wrap">未配置运行标准</p>
      <Frame13 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col isolate items-start pb-[12px] pt-0 px-0 relative shrink-0">
      <p className="font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[28px] not-italic relative shrink-0 text-[#2e3742] text-[20px] whitespace-pre z-[2]">卫生间</p>
      <div className="bg-[rgba(0,148,255,0.2)] h-[12px] mb-[-12px] shrink-0 w-full z-[1]" />
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-[144px]">
      <p className="font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#2e3742] text-[16px] whitespace-pre">设备异常记录</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#2481f2] h-[3px] shrink-0 w-[16px]" data-name="矩形" />
      <p className="font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px] whitespace-pre">冷机台数设定</p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#09b3b5] h-[3px] shrink-0 w-[16px]" data-name="矩形" />
      <p className="font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px] whitespace-pre">AI策略台数设定</p>
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
      <Frame5 />
      <Frame6 />
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex items-center opacity-0 relative shrink-0">
      <Frame18 />
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame24 />
      <Frame19 />
    </div>
  );
}

function Component3() {
  return <div className="bg-[#a6aaac] rounded-[12px] shrink-0 size-[10px]" data-name="步骤点" />;
}

function Frame34() {
  return (
    <div className="content-stretch flex h-[17px] items-center relative shrink-0">
      <Component3 />
    </div>
  );
}

function Frame28() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
      <p className="font-['Persagy2.0:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px] w-[62px] whitespace-pre-wrap">00:30:00</p>
      <Frame34 />
      <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px] text-right whitespace-pre">
        <span className="font-['Microsoft_YaHei_UI:Bold',sans-serif]">1#冷冻水泵</span>
        <span>{` 发生 变频器状态反馈与指令不符报警`}</span>
      </p>
    </div>
  );
}

function Frame30() {
  return (
    <div className="h-[21px] relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[79px] py-0 relative size-full">
          <div className="h-[30px] relative shrink-0 w-0" data-name="线">
            <div className="absolute inset-[0_-0.5px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 30">
                <path d="M0.5 0V30" id="çº¿" stroke="var(--stroke-0, #8B949E)" strokeDasharray="3 3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Component4() {
  return <div className="bg-[#a6aaac] rounded-[12px] shrink-0 size-[10px]" data-name="步骤点" />;
}

function Frame35() {
  return (
    <div className="content-stretch flex h-[17px] items-center relative shrink-0">
      <Component4 />
    </div>
  );
}

function Frame36() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
      <p className="font-['Persagy2.0:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px] w-[62px] whitespace-pre-wrap">01:15:00</p>
      <Frame35 />
      <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px] text-right whitespace-pre">
        <span className="font-['Microsoft_YaHei_UI:Bold',sans-serif]">2#电动通断水阀</span>
        <span>{` 发生 控制失能报警`}</span>
      </p>
    </div>
  );
}

function Frame37() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame28 />
      <Frame30 />
      <Frame36 />
    </div>
  );
}

function Frame14() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col gap-[12px] items-start px-[12px] py-[16px] relative w-full">
        <Frame27 />
        <Frame37 />
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="bg-[rgba(255,255,255,0.5)] content-stretch flex flex-col gap-[12px] items-start p-[16px] relative rounded-[8px] shrink-0 w-[1200px]">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.04)]" />
      <Frame1 />
      <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] min-w-full not-italic relative shrink-0 text-[#626c78] text-[14px] w-[min-content] whitespace-pre-wrap">未配置运行标准</p>
      <Frame14 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col isolate items-start pb-[12px] pt-0 px-0 relative shrink-0">
      <p className="font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[28px] not-italic relative shrink-0 text-[#2e3742] text-[20px] whitespace-pre z-[2]">穹顶</p>
      <div className="bg-[rgba(0,148,255,0.2)] h-[12px] mb-[-12px] shrink-0 w-full z-[1]" />
    </div>
  );
}

function Frame38() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-[144px]">
      <p className="font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#2e3742] text-[16px] whitespace-pre">设备异常记录</p>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#2481f2] h-[3px] shrink-0 w-[16px]" data-name="矩形" />
      <p className="font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px] whitespace-pre">冷机台数设定</p>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#09b3b5] h-[3px] shrink-0 w-[16px]" data-name="矩形" />
      <p className="font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px] whitespace-pre">AI策略台数设定</p>
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
      <Frame7 />
      <Frame8 />
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex items-center opacity-0 relative shrink-0">
      <Frame20 />
    </div>
  );
}

function Frame39() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame38 />
      <Frame21 />
    </div>
  );
}

function Component5() {
  return <div className="bg-[#a6aaac] rounded-[12px] shrink-0 size-[10px]" data-name="步骤点" />;
}

function Frame40() {
  return (
    <div className="content-stretch flex h-[17px] items-center relative shrink-0">
      <Component5 />
    </div>
  );
}

function Frame41() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
      <p className="font-['Persagy2.0:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px] w-[62px] whitespace-pre-wrap">00:30:00</p>
      <Frame40 />
      <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px] text-right whitespace-pre">
        <span className="font-['Microsoft_YaHei_UI:Bold',sans-serif]">1#冷冻水泵</span>
        <span>{` 发生 变频器状态反馈与指令不符报警`}</span>
      </p>
    </div>
  );
}

function Frame42() {
  return (
    <div className="h-[21px] relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[79px] py-0 relative size-full">
          <div className="h-[30px] relative shrink-0 w-0" data-name="线">
            <div className="absolute inset-[0_-0.5px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 30">
                <path d="M0.5 0V30" id="çº¿" stroke="var(--stroke-0, #8B949E)" strokeDasharray="3 3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Component6() {
  return <div className="bg-[#a6aaac] rounded-[12px] shrink-0 size-[10px]" data-name="步骤点" />;
}

function Frame43() {
  return (
    <div className="content-stretch flex h-[17px] items-center relative shrink-0">
      <Component6 />
    </div>
  );
}

function Frame44() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
      <p className="font-['Persagy2.0:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px] w-[62px] whitespace-pre-wrap">01:15:00</p>
      <Frame43 />
      <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px] text-right whitespace-pre">
        <span className="font-['Microsoft_YaHei_UI:Bold',sans-serif]">2#电动通断水阀</span>
        <span>{` 发生 控制失能报警`}</span>
      </p>
    </div>
  );
}

function Frame45() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame41 />
      <Frame42 />
      <Frame44 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col gap-[12px] items-start px-[12px] py-[16px] relative w-full">
        <Frame39 />
        <Frame45 />
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="bg-[rgba(255,255,255,0.5)] content-stretch flex flex-col gap-[12px] items-start p-[16px] relative rounded-[8px] shrink-0 w-[1200px]">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.04)]" />
      <Frame2 />
      <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] min-w-full not-italic relative shrink-0 text-[#626c78] text-[14px] w-[min-content] whitespace-pre-wrap">未配置运行标准</p>
      <Frame15 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] items-start left-[38px] top-[40.53px] w-[1200px]">
      <Component />
      <Frame11 />
      <Frame9 />
      <Frame10 />
    </div>
  );
}

export default function Frame46() {
  return (
    <div className="bg-[#ebf6ff] relative size-full">
      <Frame12 />
    </div>
  );
}