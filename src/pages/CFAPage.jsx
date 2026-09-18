import React from "react";
import Navbar from "../components/common/Navbar";
import CFACurriculumSection from "../components/cfa/CFACurriculumSection";
import { useNavigate } from "react-router-dom";
import Footer from "../components/common/Footer";

const CfaPage = () => {
  const navigate = useNavigate();
  return (
    <div className="font-sans">
      <Navbar />
      <div className="bg-paper text-charcoal px-4 py-8 lg:px-16 pt-20">
        {/* Heading Section */}
        <section className="text-center mb-10">
          <div className="font-mono text-xs uppercase tracking-[0.14em] text-accent-orange2 mb-2">
            CFA® Program
          </div>
          <h1 className="font-sora text-4xl font-bold text-charcoal">
            Chartered Financial Analyst (CFA®) Exam
          </h1>
          <p className="mt-4 text-lg text-sand-900">
            The CFA® certification is one of the most respected and recognized
            investment management designations in the world.
          </p>
        </section>

        {/* Introduction Section */}
        <section className="bg-sand-100 border border-sand-200 p-6 rounded-lg mb-8">
          <h2 className="font-sora text-2xl font-semibold text-charcoal">
            About the CFA® Exam
          </h2>
          <p className="mt-4 text-sand-900 leading-relaxed">
            The CFA® (Chartered Financial Analyst) program is a globally
            recognized certification for finance professionals. It focuses on
            investment management and financial analysis, equipping candidates
            with the skills required to excel in the financial industry.
          </p>
        </section>

        {/* Why Choose Us Section */}
        <section className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white border border-sand-200 p-6 rounded-lg">
            <h3 className="font-sora text-xl font-bold text-accent-orange2">
              Why PalsAnalytix for CFA®?
            </h3>
            <ul className="list-disc mt-4 ml-6 text-sand-900 space-y-3">
              <li>
                <b className="text-charcoal">Exhaustive Prep Material</b> - Comprehensive coverage of all
                CFA® topics, ensuring no additional material is needed.
              </li>
              <li>
                <b className="text-charcoal">Conceptual Clarity</b> - Our resources focus on deep
                understanding and clear concepts.
              </li>
              <li>
                <b className="text-charcoal">Certified Trainers</b> - Experienced CFA® professionals guide
                you through each stage of preparation.
              </li>
              <li>
                <b className="text-charcoal">Comprehensive Question Bank</b> - Access to a vast question
                bank to ensure thorough exam preparation.
              </li>
            </ul>
          </div>
          <div className="bg-white border border-sand-200 p-6 rounded-lg">
            <h3 className="font-sora text-xl font-bold text-accent-amber">
              Key Features of Our CFA® Program
            </h3>
            <ul className="list-disc mt-4 ml-6 text-sand-900 space-y-3">
              <li>Daily questions on critical CFA® topics.</li>
              <li>Receive questions via WhatsApp, Email, or Telegram.</li>
              <li>Instant results and performance tracking.</li>
              <li>Access to over 5,000 practice questions.</li>
            </ul>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-sand-100 border border-sand-200 p-6 rounded-lg mb-12">
          <h2 className="font-sora text-2xl font-semibold text-charcoal">
            Benefits of Pursuing the CFA® Certification
          </h2>
          <ul className="list-disc mt-4 ml-6 text-sand-900 space-y-3">
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
          <h3 className="font-sora text-xl font-semibold text-charcoal">
            Ready to Start Your CFA® Journey?
          </h3>
          <p className="mt-2 text-sand-900">
            Subscribe today and access comprehensive study resources!
          </p>
          <button 
          onClick={()=>{navigate("/pricing")}}
          className="mt-4 px-6 py-2 bg-brand-gradient-alt text-charcoal font-semibold rounded-[3px] hover:brightness-105 transition duration-300 ease-in-out transform hover:scale-105">
            Register Now
          </button>
        </section>
      </div>

      <Footer/>
    </div>
  );
};

export default CfaPage;
