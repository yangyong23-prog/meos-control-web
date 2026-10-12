function Frame1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#2e3742] text-[14px]">西区冷站</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-center flex flex-wrap gap-[4px] items-center relative shrink-0 w-[187px]">
      <p className="css-4hzbpn flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] min-h-px min-w-px not-italic relative text-[#626c78] text-[14px] text-right">08:00-23:00、23:10-23:40、23:10-23:40</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
      <p className="css-4hzbpn font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#626c78] text-[14px] w-[95px]">系统运行时间xxxxxx</p>
      <Frame2 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#626c78] text-[14px]">96.0%</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#626c78] text-[14px]">服务空间达标率</p>
      <Frame6 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#626c78] text-[14px]">20000kwh</p>
      <div className="bg-[#d9d9d9] h-[13.191px] shrink-0 w-px" />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[0] not-italic relative shrink-0 text-[#626c78] text-[14px]">
        <span className="leading-[22px]">环比</span>
        <span className="font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[22px] text-[#09b3b5]">下降2.3%</span>
      </p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#626c78] text-[14px]">耗电量</p>
      <Frame7 />
    </div>
  );
}

export default function Frame() {
  return (
    <div className="bg-[#ebf4fe] content-stretch flex flex-col gap-[4px] items-start p-[8px] relative rounded-[4px] size-full">
      <Frame1 />
      <Frame5 />
      <Frame4 />
      <Frame3 />
    </div>
  );
}