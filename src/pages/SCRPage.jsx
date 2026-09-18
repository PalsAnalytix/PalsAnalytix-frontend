import React from "react";
import Navbar from "../components/common/Navbar";
import CurriculumSection from "../components/scr/CurriculumSection";
import SCRExamPolicy from "../components/scr/SCRExamPolicy";
import SCRInfoSection from "../components/scr/SCRInfoSection";
import { useNavigate } from "react-router-dom";
import Footer from "../components/common/Footer";

const ScrPage = () => {
  const navigate = useNavigate();
  return (
    <div className="font-sans">
      <Navbar />
      <div className="bg-paper text-charcoal px-4 py-8 lg:px-16 pt-20">
        {/* Heading Section */}
        <section className="text-center mb-10">
          <div className="font-mono text-xs uppercase tracking-[0.14em] text-accent-orange2 mb-2">
            SCR® Certificate
          </div>
          <h1 className="font-sora text-4xl font-bold text-charcoal">
            Sustainable and Climate Risk (SCR®) Exam
          </h1>
          <p className="mt-4 text-lg text-sand-900">
            The GARP SCR® Certificate equips finance professionals with
            knowledge and skills to manage sustainability and climate risk
            effectively.
          </p>
        </section>

        {/* Introduction Section */}
        <section className="bg-sand-100 border border-sand-200 p-6 rounded-lg mb-8">
          <h2 className="font-sora text-2xl font-semibold text-charcoal">
            About the SCR® Exam
          </h2>
          <p className="mt-4 text-sand-900 leading-relaxed">
            The{" "}
            <a
              href="https://www.garp.org/scr"
              className="font-bold text-accent-orange2 hover:text-accent-amber underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              SCR® (Sustainability and Climate Risk)
            </a>{" "}
            Certificate is a global certification designed for professionals in
            finance and other sectors to gain essential knowledge on managing
            climate risk. This program offers a comprehensive understanding of
            the risks related to sustainability and climate change. As the
            significance of sustainability and climate risk management continues
            to grow in the financial sector, businesses and investors are
            realizing the necessity to address and mitigate the risks associated
            with climate change. Recognizing this need, the GARP SCR®
            Certificate offers a comprehensive understanding of these risks
            along with the necessary tools and techniques to manage them.
          </p>
        </section>

        {/* Benefits Section */}
        <section className="bg-sand-100 border border-sand-200 p-6 rounded-lg mb-12">
          <h2 className="font-sora text-2xl font-semibold text-charcoal">
            Benefits of Pursuing the SCR® Certificate
          </h2>
          <ul className="list-disc mt-4 ml-6 text-sand-900 space-y-3">
            <li>
              Enhanced knowledge of sustainability and climate risk, preparing
              you for emerging challenges in the finance and sustainability
              sectors.
            </li>
            <li>
              Globally recognized certification, boosting your credibility and
              employability in top financial institutions and industries.
            </li>
            <li>
              Better career opportunities in finance, sustainability, risk
              management, and ESG roles as organizations increasingly focus on
              climate risk.
            </li>
            <li>
              Improved decision-making skills to help businesses navigate and
              mitigate climate-related financial risks.
            </li>
            <li>
              Opportunities to contribute effectively to corporate
              sustainability efforts and align with global sustainability
              standards.
            </li>
          </ul>
        </section>

        {/* Why Choose Us Section */}
        <section className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white border border-sand-200 p-6 rounded-lg">
            <h3 className="font-sora text-xl font-bold text-accent-orange2">
              Why PalsAnalytix for SCR®?
            </h3>
            <ul className="list-disc mt-4 ml-6 text-sand-900 space-y-3">
              <li>
                <b className="text-charcoal">Exhaustive Prep Material</b> - No other extra preparation is
                required apart from the Material referred to in our course.
              </li>
              <li>
                <b className="text-charcoal">Conceptual Clarity</b> - No other extra preparation is
                required apart from the Material referred to in our course.
              </li>
              <li>
                <b className="text-charcoal">Certified Trainers</b> - Our trainers are SCR® with years of
                experience in Sustainability and Climate Risk with top Banks.
              </li>
              <li>
                <b className="text-charcoal">Comprehensive Question Bank</b> - We provide exhaustive
                question bank for your complete preparation for the exam.
              </li>
            </ul>
          </div>
          <div className="bg-white border border-sand-200 p-6 rounded-lg">
            <h3 className="font-sora text-xl font-bold text-accent-amber">
              Key Features of Our SCR® Program
            </h3>
            <ul className="list-disc mt-4 ml-6 text-sand-900 space-y-3">
              <li>Daily questions based on chosen topics.</li>
              <li>Receive questions via WhatsApp, Email, or Telegram.</li>
              <li>Instant results and performance tracking.</li>
              <li>Access to over 10,000 practice questions.</li>
            </ul>
          </div>
        </section>

        {/* Curriculum Section */}
        <CurriculumSection />

        <SCRInfoSection/>

        <SCRExamPolicy/>

        {/* Call to Action Section */}
        <section className="text-center mb-8">
          <h3 className="font-sora text-xl font-semibold text-charcoal">
            Ready to Start Your SCR® Journey?
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

export default ScrPage;
