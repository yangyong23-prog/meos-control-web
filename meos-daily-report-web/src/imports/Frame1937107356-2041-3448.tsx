import imgFrame1937107242 from "@/assets/ed07366a06320f72100f9b26c58eca5ec52423c3.png";

function Frame() {
  return (
    <div className="relative rounded-[4px] shrink-0 w-full">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[4px] size-full" src={imgFrame1937107242} />
      <div className="content-stretch flex flex-col items-start px-[12px] py-[8px] relative w-full">
        <p className="css-ew64yg font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#2e3742] text-[16px]">东区冷站</p>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] items-start left-[26px] top-[34px] w-[1168px]">
      <p className="css-4hzbpn font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[28px] not-italic relative shrink-0 text-[#2e3742] text-[20px] w-full">冷站系统运行</p>
      <Frame />
    </div>
  );
}

export default function Frame1() {
  return (
    <div className="bg-[#ebf6ff] relative size-full">
      <Frame2 />
    </div>
  );
}