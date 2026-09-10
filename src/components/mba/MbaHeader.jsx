import React from "react";
import PalsAnalytixLogo from "../../assets/palsanalytix-logo.png";
import PalsAnalytixWordmark from "../../assets/palsanalytix-wordmark.png";

const MbaHeader = ({ children }) => (
  <div>
    <header className="bg-ink px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img src={PalsAnalytixLogo} alt="PalsAnalytix" className="h-16 w-auto" />
        <div className="flex flex-col items-center">
          <img src={PalsAnalytixWordmark} alt="palsanalytix" className="h-9 w-auto" />
          <div className="mt-0.5 font-mono text-[11px] tracking-wide text-sand-500 leading-tight">
            विद्याधनं सर्वधनप्रधानम् ॥
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">{children}</div>
    </header>
    <div className="h-1 bg-brand-gradient" />
  </div>
);

export default MbaHeader;
