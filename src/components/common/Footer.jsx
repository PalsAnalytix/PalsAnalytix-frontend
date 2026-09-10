import React from "react";
import { Link } from "react-router-dom";
import PalsAnalytixLogo from "../../assets/palsanalytix-logo.png";

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
        <div className="flex flex-wrap justify-between gap-10 mb-10">
          <div className="max-w-xs">
            <Link to="/" className="flex items-center gap-2.5">
              <img src={PalsAnalytixLogo} alt="PalsAnalytix" className="h-10 w-auto" />
              <span className="font-sora text-lg font-semibold text-paper">
                palsanalytix
              </span>
            </Link>
            <p className="mt-3 text-sm text-sand-600">
              CFA, FRM and SCR exam preparation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
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
        </div>

        <div className="pt-8 border-t border-line text-center">
          <p className="text-sm text-sand-700 max-w-3xl mx-auto">
            © {new Date().getFullYear()} PalsAnalytix. All rights reserved. CFA® and Chartered Financial Analyst® are registered trademarks owned by CFA Institute. FRM® is a registered trademark of the Global Association of Risk Professionals.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
