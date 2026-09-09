import React from "react";
import mbaLogo from "../../assets/mba-logo.png";

const MbaHeader = ({ children }) => (
  <div>
    <header className="bg-ink px-6 py-4 flex items-center justify-between">
      <img src={mbaLogo} alt="PalsAnalytix" className="h-16" />
      <div className="flex items-center gap-4">{children}</div>
    </header>
    <div className="h-1 bg-brand-gradient" />
  </div>
);

export default MbaHeader;
