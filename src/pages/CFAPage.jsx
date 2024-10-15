import React from "react";
import Navbar from "../components/Navbar";
import CFACurriculumSection from "../components/CFACurriculumSection";
import { useNavigate } from "react-router-dom";

const CfaPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Navbar />
      <div className="bg-white text-gray-800 px-4 py-8 lg:px-16 pt-20">
        {" "}
        {/* Added pt-20 for top padding */}
        {/* Heading Section */}
        <section className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-900">
            Chartered Financial Analyst (CFA®) Exam
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            The CFA® certification is one of the most respected and recognized
            investment management designations in the world.
          </p>
        </section>
        {/* Introduction Section */}
        <section className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold text-blue-800">
            About the CFA® Exam
          </h2>
          <p className="mt-4 text-gray-700 leading-relaxed">
            The CFA® (Chartered Financial Analyst) program is a globally
            recognized certification for finance professionals. It focuses on
            investment management and financial analysis, equipping candidates
            with the skills required to excel in the financial industry.
          </p>
        </section>
        {/* Why Choose Us Section */}
        <section className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-green-50 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-green-700">
              Why PalsAnalytix for CFA®?
            </h3>
            <ul className="list-disc mt-4 ml-6 text-gray-700 space-y-3">
              <li>
                <b>Exhaustive Prep Material</b> - Comprehensive coverage of all
                CFA® topics, ensuring no additional material is needed.
              </li>
              <li>
                <b>Conceptual Clarity</b> - Our resources focus on deep
                understanding and clear concepts.
              </li>
              <li>
                <b>Certified Trainers</b> - Experienced CFA® professionals guide
                you through each stage of preparation.
              </li>
              <li>
                <b>Comprehensive Question Bank</b> - Access to a vast question
                bank to ensure thorough exam preparation.
              </li>
            </ul>
          </div>
          <div className="bg-yellow-50 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-yellow-700">
              Key Features of Our CFA® Program
            </h3>
            <ul className="list-disc mt-4 ml-6 text-gray-700 space-y-3">
              <li>Daily questions on critical CFA® topics.</li>
              <li>Receive questions via WhatsApp, Email, or Telegram.</li>
              <li>Instant results and performance tracking.</li>
              <li>Access to over 5,000 practice questions.</li>
            </ul>
          </div>
        </section>
        {/* Benefits Section */}
        <section className="bg-blue-50 p-6 rounded-lg mb-12">
          <h2 className="text-2xl font-semibold text-blue-800">
            Benefits of Pursuing the CFA® Certification
          </h2>
          <ul className="list-disc mt-4 ml-6 text-gray-700 space-y-3">
            <li>Global recognition as a top financial expert.</li>
            <li>
              Enhanced career opportunities in investment banking, asset
              management, and financial analysis.
            </li>
            <li>
              Comprehensive understanding of investment principles and ethics.
            </li>
            <li>Ability to excel in a rapidly changing financial industry.</li>
          </ul>
        </section>
        {/* Curriculum Section */}
        <CFACurriculumSection/>
        {/* Call to Action Section */}
        <section className="text-center mb-8">
          <h3 className="text-xl font-semibold text-gray-800">
            Ready to Start Your CFA® Journey?
          </h3>
          <p className="mt-2 text-gray-600">
            Subscribe today and access comprehensive study resources!
          </p>
          <button 
          onClick={()=>{navigate("/subscription")}}
          className="mt-4 px-6 py-2 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition duration-300 ease-in-out transform hover:scale-105">
            Register Now
          </button>
        </section>
      </div>

      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-400">
            &copy; 2024 PalsAnalytix. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CfaPage;
