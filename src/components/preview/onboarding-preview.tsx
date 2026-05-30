"use client";

import { DemoCanvas } from "./demo-canvas";

export function OnboardingPreview() {
  return (
    <DemoCanvas mode="fit" background="#F6F8FA">
      <div className="absolute inset-0 overflow-hidden bg-[#F6F8FA] select-none">
        <div className="absolute left-0 top-0 h-[552px] w-[393px] bg-[#F6F8FA]" />

        <div className="absolute left-0 top-0 h-[44px] w-[393px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/figma/global/status-bar.png"
            alt=""
            draggable={false}
            className="block h-[44px] w-[393px] pointer-events-none"
          />
        </div>

        <div className="absolute bottom-0 left-0 flex w-[393px] flex-col items-start bg-white pt-[24px]">
          <div className="flex w-full flex-col items-center gap-[16px] px-[24px] pb-[16px] text-center">
            <h1 className="m-0 w-full font-[var(--font-poppins)] text-[24px] font-semibold leading-[1.4] text-[#111111]">
              Meet Your 1:1
              <br />
              Whiteboard Tutor
            </h1>
            <p className="m-0 w-full text-[16px] font-normal leading-[1.5] text-[#595C60]">
              Live visual lessons aligned with Common
              <br />
              Core. Ask anything as you learn.
            </p>
          </div>

          <div className="flex w-full flex-col items-start">
            <div className="flex w-full flex-col items-start px-[32px] pb-[16px] pt-[24px]">
              <button
                type="button"
                className="flex h-[54px] w-full items-center justify-center rounded-full bg-[#007AFF] px-[16px] font-[var(--font-poppins)] text-[18px] font-semibold leading-[1.4] text-white"
              >
                Continue
              </button>
            </div>

            <div className="relative h-[34px] w-full">
              <div className="absolute bottom-[8px] left-1/2 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-[#111111]" />
            </div>
          </div>
        </div>
      </div>
    </DemoCanvas>
  );
}
