import React from 'react';
import { ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';



const LandingPage = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-blue-100">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="text-center lg:text-left lg:w-[70%] mb-12 lg:mb-0 pr-0 lg:pr-12">
              <h1 className="text-4xl font-bold text-blue-900 sm:text-5xl md:text-6xl mb-6">
                Elevate Your Financial Career with PalsAnalytix
              </h1>
              <p className="text-lg text-gray-700 max-w-4xl mx-auto lg:mx-0 leading-relaxed mb-8">
                PalsAnalytix is your ultimate companion for CFA Level 1, FRM Level 1, and SCR® exam preparation. We've revolutionized the way professionals and students approach these challenging certifications, offering a unique blend of technology and expertise.
              </p>
              <p className="text-lg text-gray-700 max-w-4xl mx-auto lg:mx-0 leading-relaxed mb-8">
                Our innovative platform delivers daily questions via WhatsApp, Telegram, or email, adapting to your busy schedule. With instant results, progress tracking, and personalized mock exams, we're transforming exam preparation into a seamless, effective journey.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-base font-medium text-gray-700 mb-8">
                <span className="bg-white px-4 py-2 rounded-full shadow">Adaptive Learning</span>
                <span className="bg-white px-4 py-2 rounded-full shadow">Real-Time Analytics</span>
                <span className="bg-white px-4 py-2 rounded-full shadow">Expert Support</span>
                <span className="bg-white px-4 py-2 rounded-full shadow">Performance Tracking</span>
              </div>
            </div>
            <div className="lg:w-[30%]">
              <div className="bg-white shadow-xl rounded-lg p-8 max-w-sm mx-auto">
                <h3 className="text-2xl font-semibold text-blue-900 mb-6 text-center">Join PalsAnalytix Today</h3>
                <div className="border-t border-gray-200 my-6"></div>
                <p className="text-gray-600 text-center mb-6">
                  Embark on your journey to financial excellence. Access our comprehensive test series, featuring thousands of practice questions and tailored mock exams.
                </p>
                <button className="w-full bg-[#FEE154] text-black font-semibold py-3 px-8 rounded-lg text-lg shadow-lg hover:bg-yellow-500 transition duration-300 ease-in-out flex items-center justify-center">
                  Get Started Today
                  <ArrowRight className="ml-2" size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose PalsAnalytix Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-semibold text-blue-900 mb-6 text-center">
            Why PalsAnalytix Stands Out
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto text-center leading-relaxed mb-12">
            At PalsAnalytix, we've reimagined exam preparation. Our platform is designed to make your journey towards certification not just effective, but also engaging and tailored to your unique learning style.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Personalized Daily Questions",
                description: "Select your focus areas and receive daily practice questions that adapt to your progress, ensuring you're always challenged at the right level."
              },
              {
                title: "Comprehensive Feedback Loop",
                description: "Receive instant results and in-depth explanations for each question, turning every interaction into a valuable learning opportunity."
              },
              {
                title: "Extensive Question Bank",
                description: "Access over 10,000 questions covering all exam topics, complemented by full-length mock exams that simulate the real testing environment."
              },
              {
                title: "Multi-Platform Accessibility",
                description: "Study seamlessly across WhatsApp, Telegram, email, and our web platform. Your prep adapts to your lifestyle, not the other way around."
              },
              {
                title: "Advanced Analytics Dashboard",
                description: "Track your performance with our detailed analytics. Identify strengths, pinpoint weaknesses, and watch your progress unfold in real-time."
              },
              {
                title: "Stress-Reduction Focused",
                description: "Our approach breaks down the daunting task of exam prep into manageable daily goals, building your confidence steadily as you progress."
              }
            ].map((item, index) => (
              <div key={index} className="bg-gradient-to-b from-white to-blue-50 shadow-lg rounded-lg p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-4">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Offerings Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-100 to-green-100">
        <div className="container mx-auto">
          <h2 className="text-3xl font-semibold text-blue-900 mb-6 text-center">Our Specialized Courses</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto text-center leading-relaxed mb-12">
            PalsAnalytix offers targeted preparation for three of the most sought-after financial certifications. Each course is meticulously designed to align with the latest exam patterns and industry requirements.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "CFA (Chartered Financial Analyst)",
                link : "/cfa",
                description: "The CFA program is the gold standard for investment analysis and portfolio management. Our course covers all three levels, focusing on ethics, quantitative methods, economics, financial reporting, corporate finance, and more."
              },
              {
                title: "FRM (Financial Risk Manager)",
                link : "/frm",
                description: "Recognized globally, the FRM certification is crucial for professionals in risk management. Our comprehensive program covers market risk, credit risk, operational risk, and investment management, preparing you for both Part I and Part II of the exam."
              },
              {
                title: "SCR (Sustainability and Climate Risk)",
                link : "/scr",
                description: "As sustainability becomes central to financial decision-making, the SCR certification is increasingly valuable. Our course covers climate science, financial risks of climate change, and strategies for managing climate-related risks in various business contexts."
              }
            ].map((course, index) => (
              <div key={index} className="bg-white shadow-xl rounded-lg p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-4">{course.title}</h3>
                <p className="text-gray-600 mb-6">{course.description}</p>
                <button onClick={()=>{handleNavigation(`${course.link}`)}} className="w-full bg-[#FEE154] text-black font-semibold py-3 px-6 rounded-lg hover:bg-yellow-500 transition duration-300 ease-in-out">
                  Explore Curriculum
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
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

export default LandingPage;