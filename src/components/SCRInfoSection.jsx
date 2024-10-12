import React from 'react';
import { CheckCircle } from 'lucide-react';

const SCRInfoSection = () => {
  const roadmapSteps = [
    {
      title: "Register",
      content: "Register for an SCR® exam during the specified exam window. Check the exam logistics page for dates."
    },
    {
      title: "Prepare",
      content: "Access the GARP portal to manage program information and schedule the exam. Use official study materials. GARP suggests about 100 hours of preparation."
    },
    {
      title: "Pass the SCR® Exam",
      content: "The exam consists of 80 multiple-choice questions with a three-hour time limit. Passing candidates receive an electronic certificate and a LinkedIn-compatible digital badge."
    },
    {
      title: "After Passing",
      content: "Continue learning via the CPD program (recommended but not mandatory). Enjoy exclusive learning benefits with a GARP Individual Membership."
    },
    {
      title: "Pass Rates",
      content: "The SCR® exam pass rate for April 2023 was 57%. If you don't pass, you can register at a reduced rate for the next two exam cycles."
    }
  ];

  const faqs = [
    {
      question: "Is the GARP SCR® Certificate recognised Globally?",
      answer: "Yes, the GARP SCR® Certificate is recognized by businesses and organizations around the world."
    },
    {
      question: "Who should do SCR®?",
      answer: "The program is suitable for finance professionals, business managers interested in sustainability and climate risk, and environmental specialists seeking to expand their expertise in finance and risk management."
    },
    {
      question: "Are there any prerequisites for the GARP SCR® certificate?",
      answer: "There are no prerequisites, however, participants should have a basic understanding of finance and risk management."
    }
  ];

  return (
    <section className="grid lg:grid-cols-2 gap-8 mb-12">
      <div className="bg-green-50 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-green-700 mb-4">
          Roadmap to Earning the SCR® Certification
        </h3>
        <ul className="list-disc mt-4 ml-6 text-gray-700 space-y-3">
          {roadmapSteps.map((step, index) => (
            <li key={index} className="mb-3">
              <b>{step.title}</b> - {step.content}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-yellow-50 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-yellow-700 mb-4">
          Frequently Asked Questions - SCR® Exam
        </h3>
        <ul className="list-disc mt-4 ml-6 text-gray-700 space-y-3">
          {faqs.map((faq, index) => (
            <li key={index} className="mb-3">
              <b>{faq.question}</b> - {faq.answer}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default SCRInfoSection;