import React from "react";
import Navbar from "../components/Navbar";
import CurriculumSection from "../components/CurriculumSection";
import SCRExamPolicy from "../components/SCRExamPolicy";
import SCRInfoSection from "../components/SCRInfoSection";

const ScrPage = () => {
  return (
    <div>
      <Navbar />
      <div className="bg-white text-gray-800 px-4 py-8 lg:px-16 pt-20">
        {/* Heading Section */}
        <section className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-900">
            Sustainable and Climate Risk (SCR®) Exam
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            The GARP SCR® Certificate equips finance professionals with
            knowledge and skills to manage sustainability and climate risk
            effectively.
          </p>
        </section>
        {/* Introduction Section */}
        <section className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold text-blue-800">
            About the SCR® Exam
          </h2>
          <p className="mt-4 text-gray-700 leading-relaxed">
            The{" "}
            <a href="https://www.garp.org/scr" className="bold" target="_blank">
              SCR® (Sustainability and Climate Risk)
            </a>{" "}
            Certificate is a global certification designed for professionals in
            finance and other sectors to gain essential knowledge on managing
            climate risk. This program offers a comprehensive understanding of
            the risks related to sustainability and climate change. As the
            significance of sustainability and climate risk management continues
            to grow in the financial sector, businesses and investors are
            realizing the necessity to address and mitigate the risks associated
            with climate change. Recognizing this need, the GARP SCR®®
            Certificate offers a comprehensive understanding of these risks
            along with the necessary tools and techniques to manage them.
          </p>
        </section>
        {/* Benefits Section */}
        <section className="bg-blue-50 p-6 rounded-lg mb-12">
          <h2 className="text-2xl font-semibold text-blue-800">
            Benefits of Pursuing the SCR® Certificate
          </h2>
          <ul className="list-disc mt-4 ml-6 text-gray-700 space-y-3">
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
          <div className="bg-green-50 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-green-700">
              Why PalsAnalytix for SCR®?
            </h3>
            <ul className="list-disc mt-4 ml-6 text-gray-700 space-y-3">
              <li>
                <b>Exhaustive Prep Material</b> - No other extra preparation is
                required apart from the Material referred to in our course.
              </li>
              <li>
                <b>Conceptual Clarity</b> - No other extra preparation is
                required apart from the Material referred to in our course.
              </li>
              <li>
                <b>Certified Trainers</b> - Our trainers are SCR®® with years of
                experience in Sustainability and Climate Risk with top Banks.
              </li>
              <li>
                <b>Comprehensive Question Bank</b> - We provide exhaustive
                question bank for your complete preparation for the exam.
              </li>
            </ul>
          </div>
          <div className="bg-yellow-50 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-yellow-700">
              Key Features of Our SCR® Program
            </h3>
            <ul className="list-disc mt-4 ml-6 text-gray-700 space-y-3">
              <li>Daily questions based on chosen topics.</li>
              <li>Receive questions via WhatsApp, Email, or Telegram.</li>
              <li>Instant results and performance tracking.</li>
              <li>Access to over 10,000 practice questions.</li>
            </ul>
          </div>
        </section>
        {/* Roadmap Section */}
        {/* Curriculum Section */}
        <CurriculumSection />
        {/* Call to Action Section */}

        

        <SCRInfoSection/>

        <SCRExamPolicy/>
        <section className="text-center mb-8">
          <h3 className="text-xl font-semibold text-gray-800">
            Ready to Start Your SCR® Journey?
          </h3>
          <p className="mt-2 text-gray-600">
            Sign up today and access comprehensive study resources!
          </p>
          <button className="mt-4 px-6 py-2 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition duration-300 ease-in-out transform hover:scale-105">
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

export default ScrPage;
