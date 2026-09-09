import React from "react";
import mbaLogo from "../../assets/mba-logo.png";

const MbaHeader = ({ children }) => (
  <header className="bg-ink border-b border-line px-6 py-3 flex items-center justify-between">
    <img src={mbaLogo} alt="PalsAnalytix" className="h-10" />
    <div className="flex items-center gap-4">{children}</div>
  </header>
);

export default MbaHeader;
