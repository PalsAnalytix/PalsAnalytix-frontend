import React from "react";
import { Link } from "react-router-dom";
import PalsAnalytixLogo from "../../assets/palsanalytix-logo.png";
import PalsAnalytixWordmark from "../../assets/palsanalytix-wordmark.png";

const Footer = () => {
  const footerLinks = [
    {
      title: "Certifications",
      links: [
        { name: "CFA® Program", path: "/cfa" },
        { name: "FRM® Certification", path: "/frm" },
        { name: "SCR® Certificate", path: "/scr" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Practice Questions", path: "/dashboard" },
        { name: "Mock Exams", path: "/dashboard" },
        { name: "Study Notes (Coming Soon)", path: "/dashboard" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", path: "/" },
        { name: "MBA Evaluation", path: "/mba-evaluation" },
        { name: "Contact Us", path: "/contact" },
      ]
    }
  ];

  return (
    <footer className="bg-ink text-paper py-12 w-full border-t border-line">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex justify-center mb-10">
          <Link to="/" className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <img src={PalsAnalytixLogo} alt="PalsAnalytix" className="h-10 w-auto" />
              <img src={PalsAnalytixWordmark} alt="palsanalytix" className="h-6 w-auto" />
            </div>
            <div className="mt-1 font-mono text-[11px] tracking-wide text-sand-600">
              विद्याधनं सर्वधनप्रधानम् ॥
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {footerLinks.map((section, index) => (
            <div key={index} className="flex flex-col items-center">
              <h3 className="font-sora text-lg font-semibold mb-6 text-accent-orange2 pb-2 border-b border-line inline-block">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex} className="text-center">
                    <Link
                      to={link.path}
                      className="text-sand-500 hover:text-paper transition-colors duration-300 inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-8 border-t border-line text-center">
          <p className="text-sm text-sand-700 max-w-3xl mx-auto">
            © {new Date().getFullYear()} PalsAnalytix. All rights reserved. CFA® and Chartered Financial Analyst® are registered trademarks owned by CFA Institute. FRM® is a registered trademark of the Global Association of Risk Professionals.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
