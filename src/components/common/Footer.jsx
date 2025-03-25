import React from "react";
import { Link } from "react-router-dom";

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
        { name: "Study Notes (Coming Soon) ", path: "/dashboard" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", path: "/" },
        { name: "Contact", path: "/contact" },
      ]
    }
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-800 to-gray-900 text-white py-8 w-full">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {footerLinks.map((section, index) => (
            <div key={index} className="flex flex-col items-center">
              <h3 className="text-xl font-bold mb-6 text-blue-400 pb-2 border-b border-gray-700 inline-block">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex} className="text-center">
                    <Link 
                      to={link.path} 
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-300 inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-5 pt-8 border-t border-gray-700 text-center">
          <p className="text-sm text-gray-400 max-w-3xl mx-auto">
            © {new Date().getFullYear()} PalsAnalytix. All rights reserved. CFA® and Chartered Financial Analyst® are registered trademarks owned by CFA Institute. FRM® is a registered trademark of the Global Association of Risk Professionals.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;