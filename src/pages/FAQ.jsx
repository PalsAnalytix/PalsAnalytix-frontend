import React, { useState, useEffect } from 'react';
import { ChevronDown, Search, BookOpen, Award, Calendar, Users, MessageSquare, ArrowRight, Filter, Clock, CheckCircle, Mail, Phone, MapPin, Globe } from 'lucide-react';
import Navbar from "../components/common/Navbar";
import Footer from '../components/common/Footer';
const EnhancedFAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const faqData = [
    {
      category: "General",
      icon: <BookOpen className="text-blue-600" />,
      questions: [
        {
          question: "What is PalsAnalytix?",
          answer: "PalsAnalytix is a comprehensive platform designed specifically for CFA, SCR, and FRM aspirants. We provide daily practice questions crafted by industry professionals to help you prepare effectively for your final exams. Our platform focuses on quality content that aligns with the latest examination patterns to ensure you're well-prepared for success."
        },
        {
          question: "Who creates the practice questions?",
          answer: "All questions on PalsAnalytix are created by certified professionals who have successfully completed the CFA, SCR, or FRM exams. Our question creators have extensive experience in financial analysis and understand exactly what's required to succeed. Many of our contributors are actively working in leading financial institutions, bringing real-world context to their questions and explanations."
        },
        {
          question: "How frequently are new questions added?",
          answer: "We add new questions daily across all certification categories. This ensures you always have fresh material to practice with and can cover the entire exam syllabus thoroughly. Our content team follows a structured approach to ensure all topics and concepts are covered proportionally to their importance in the actual exams."
        },
        {
          question: "What makes PalsAnalytix different from other platforms?",
          answer: "PalsAnalytix stands out through our focus on quality over quantity, with questions crafted by certified professionals who've passed these exams themselves. We offer detailed explanations for every answer, personalized analytics to track your progress, and daily practice that adapts to your performance. Our platform is designed specifically for CFA, SCR, and FRM certifications rather than being a general test prep platform."
        }
      ]
    },
    {
      category: "Certifications & Content",
      icon: <Award className="text-emerald-600" />,
      questions: [
        {
          question: "Which certifications does PalsAnalytix cover?",
          answer: "PalsAnalytix currently covers preparation materials for CFA (Chartered Financial Analyst), SCR (Sustainability and Climate Risk), and FRM (Financial Risk Manager) certifications. Our comprehensive question bank is carefully structured to cover all learning outcomes specified by the respective certification bodies."
        },
        {
          question: "Are the questions aligned with the latest exam formats?",
          answer: "Yes! Our team regularly updates question formats and content to match the latest exam patterns and curriculum changes announced by certification bodies. We closely monitor any changes to the syllabus, question types, or exam structure to ensure our platform remains current and relevant."
        },
        {
          question: "Does PalsAnalytix cover all levels of the CFA exam?",
          answer: "Absolutely. We provide comprehensive practice questions for all three levels of the CFA exam, with specific focus on the unique requirements of each level. For Level I, we emphasize knowledge and comprehension; for Level II, we focus on application and analysis; and for Level III, we include constructed response questions that mirror the essay format."
        },
        {
          question: "How similar are your questions to the actual exam questions?",
          answer: "Our questions are carefully designed to match the style, difficulty level, and format of the actual exam questions as closely as possible. While we can't replicate exact questions from past exams due to copyright restrictions, our experienced question creators ensure that practicing on our platform will prepare you effectively for what you'll encounter in the real exam."
        }
      ]
    },
    {
      category: "Practice & Learning",
      icon: <Calendar className="text-purple-600" />,
      questions: [
        {
          question: "How should I use PalsAnalytix in my study routine?",
          answer: "For best results, we recommend incorporating daily practice sessions using our platform alongside your regular study material. Aim to complete at least 20-30 questions daily, focusing on your weaker areas. Start with topic-specific practice to build fundamentals, then progress to mixed question sets and finally to timed mock exams as your test date approaches."
        },
        {
          question: "Do you provide explanations for the answers?",
          answer: "Yes, every question comes with a detailed explanation written by our experts. These explanations not only tell you why the correct answer is right but also why the other options are wrong, enhancing your conceptual understanding. We often include references to specific curriculum readings and real-world applications to deepen your knowledge."
        },
        {
          question: "Can I track my progress on the platform?",
          answer: "Yes, PalsAnalytix features a comprehensive progress tracking system that shows your performance across different topics, your improvement over time, and identifies areas that need additional focus. Our analytics dashboard provides visual representations of your strengths and weaknesses, helping you allocate your study time efficiently."
        },
        {
          question: "Do you offer mock exams that simulate the actual test experience?",
          answer: "Yes, we offer full-length mock exams that closely simulate the timing, difficulty, and format of the actual certification exams. These mocks are carefully calibrated to reflect the weight given to different topics in the real exam and include detailed performance analytics to help you identify any remaining weak areas before your exam day."
        }
      ]
    },
    {
      category: "Subscription & Access",
      icon: <Users className="text-amber-600" />,
      questions: [
        {
          question: "Is PalsAnalytix free to use?",
          answer: "We offer both free and premium plans. The free plan gives you access to a limited set of daily questions, while our premium plans provide full access to our entire question bank, detailed analytics, and additional study resources. Our subscription options are flexible, allowing you to choose monthly or annual billing based on your preparation timeline."
        },
        {
          question: "How do I sign up for PalsAnalytix?",
          answer: "Simply visit palsanalytix.com and click on the 'Sign Up' button. You can create an account using your email or through your Google or LinkedIn accounts. The process takes less than a minute, and you can immediately begin practicing with our free questions after registration."
        },
        {
          question: "Can I switch between different certification preparations?",
          answer: "Yes, our platform allows you to prepare for multiple certifications simultaneously. You can easily switch between CFA, SCR, and FRM study materials through your dashboard. This is particularly useful for professionals looking to build a comprehensive financial expertise profile with multiple credentials."
        },
        {
          question: "Do you offer any guarantees or refund policies?",
          answer: "Yes, we offer a 7-day money-back guarantee for all new premium subscriptions. If you're not satisfied with our platform for any reason, you can request a full refund within the first week of your subscription. We're confident in the quality of our content and want you to feel secure in your investment."
        }
      ]
    },
    {
      category: "Support",
      icon: <MessageSquare className="text-red-600" />,
      questions: [
        {
          question: "How can I get help if I'm stuck on a concept?",
          answer: "In addition to our detailed answer explanations, premium members can access our forum where you can discuss questions with peers and get responses from our expert team. Our community of learners and educators provides a supportive environment for working through challenging concepts and clarifying doubts."
        },
        {
          question: "What if I find an error in a question?",
          answer: "We strive for accuracy, but if you believe there's an error, you can report it using the 'Report Question' button available beneath each question. Our team will review and correct it promptly. We appreciate such feedback as it helps us maintain the highest quality standards across our platform."
        },
        {
          question: "How can I contact customer support?",
          answer: "You can reach our support team at support@palsanalytix.com or through the live chat feature available on our website. We typically respond within 24 hours. For urgent matters, premium members have access to priority support with faster response times."
        },
        {
          question: "Do you offer personalized study plans or coaching?",
          answer: "Yes, our premium plus subscription includes personalized study plan creation based on your target exam date, available study time, and performance in diagnostic tests. While we don't offer one-on-one coaching, our advanced analytics and adaptive question selection algorithm serve as a virtual coach by guiding you toward the most beneficial practice areas."
        }
      ]
    }
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleCategoryFilter = (category) => {
    setActiveCategory(category);
  };

  // Filter by search term and category
  const filteredFAQs = faqData
    .filter(category => activeCategory === 'all' || category.category.toLowerCase() === activeCategory.toLowerCase())
    .map(category => {
      const filteredQuestions = category.questions.filter(
        item => item.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
               item.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return {
        ...category,
        questions: filteredQuestions
      };
    })
    .filter(category => category.questions.length > 0);

  return (
    <div>
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-20">
      {/* Hero Section with Background */}
      <Navbar/>
      <div className="bg-gradient-to-r from-pink-400 to-blue-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-700 tracking-tight sm:text-5xl mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-green-800 max-w-3xl mx-auto">
              Find comprehensive answers to common questions about PalsAnalytix for your CFA, SCR, and FRM exam preparation journey.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 w-full h-16 bg-gradient-to-b from-transparent to-gray-50"></div>
      </div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        {/* Search Box - Elevated above content */}
        {/* <div className="mb-12 relative">
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden shadow-lg bg-white">
            <div className="pl-6 text-blue-500">
              <Search size={22} />
            </div>
            <input
              type="text"
              placeholder="Search for questions or topics..."
              className="w-full py-5 px-4 focus:outline-none text-gray-700 bg-transparent text-lg"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div> */}
        
        {/* Stats Section */}
        <div className="mb-12 grid grid-cols-2 gap-5 sm:grid-cols-4 bg-white rounded-xl shadow-md py-8 px-6">
          <div className="text-center">
            <div className="text-blue-600 flex justify-center">
              <Users size={32} />
            </div>
            <p className="mt-3 text-3xl font-bold text-gray-900">10,000+</p>
            <p className="text-sm text-gray-500 mt-1">Active Users</p>
          </div>
          <div className="text-center">
            <div className="text-emerald-600 flex justify-center">
              <CheckCircle size={32} />
            </div>
            <p className="mt-3 text-3xl font-bold text-gray-900">93%</p>
            <p className="text-sm text-gray-500 mt-1">Pass Rate</p>
          </div>
          <div className="text-center">
            <div className="text-amber-600 flex justify-center">
              <BookOpen size={32} />
            </div>
            <p className="mt-3 text-3xl font-bold text-gray-900">50,000+</p>
            <p className="text-sm text-gray-500 mt-1">Practice Questions</p>
          </div>
          <div className="text-center">
            <div className="text-purple-600 flex justify-center">
              <Clock size={32} />
            </div>
            <p className="mt-3 text-3xl font-bold text-gray-900">24/7</p>
            <p className="text-sm text-gray-500 mt-1">Availability</p>
          </div>
        </div>
        
        {/* Category Filter Section - More visually prominent */}
        <div className="mb-10 bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="flex items-center mb-4 sm:mb-0 sm:mr-6">
              <Filter size={20} className="mr-2 text-blue-600" />
              <h3 className="text-gray-800 font-semibold">Browse by category:</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategoryFilter('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === 'all' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Categories
              </button>
              {faqData.map((category, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCategoryFilter(category.category.toLowerCase())}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category.category.toLowerCase() 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Cards Section - Improved design */}
        <div className="space-y-8">
          {filteredFAQs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
              <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-gray-100 shadow-sm">
                    {category.icon}
                  </div>
                  <h2 className="ml-4 text-2xl font-bold text-gray-900">
                    {category.category}
                  </h2>
                </div>
              </div>
              
              <div className="divide-y divide-gray-100">
                {category.questions.map((faq, faqIndex) => (
                  <div key={faqIndex} className={`transition-all duration-300 ${
                    openIndex === `${categoryIndex}-${faqIndex}` ? 'bg-blue-50' : ''
                  }`}>
                    <button
                      className="flex justify-between items-center w-full text-left px-8 py-6 hover:bg-gray-50 transition-colors"
                      onClick={() => toggleAccordion(`${categoryIndex}-${faqIndex}`)}
                    >
                      <h3 className="text-lg font-medium text-gray-900 pr-8">
                        {faq.question}
                      </h3>
                      <span className={`flex-shrink-0 transition-transform duration-300 p-2 rounded-full ${
                        openIndex === `${categoryIndex}-${faqIndex}` 
                          ? 'bg-blue-100 text-blue-600 rotate-180 transform' 
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        <ChevronDown size={20} />
                      </span>
                    </button>
                    
                    <div 
                      className={`overflow-hidden transition-all max-h-0 duration-300 ${
                        openIndex === `${categoryIndex}-${faqIndex}` ? 'max-h-screen' : 'max-h-0'
                      }`}
                    >
                      <div className="px-8 pb-6">
                        <div className="text-base text-gray-600 leading-relaxed border-l-4 border-blue-500 pl-4 py-1">
                          {faq.answer}
                        </div>
                        
                        {/* Additional action links with improved visual style */}
                        {/* <div className="mt-6 pt-4 border-t border-gray-100 flex gap-4 flex-wrap">
                          <a href="#" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 px-4 py-2 rounded-full transition-colors hover:bg-blue-100">
                            <MessageSquare size={16} className="mr-2" /> 
                            Discuss in Community
                          </a>
                          <a href="#" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 px-4 py-2 rounded-full transition-colors hover:bg-blue-100">
                            <ArrowRight size={16} className="mr-2" /> 
                            Related Resources
                          </a>
                        </div> */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {filteredFAQs.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl shadow-md">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
                <Search size={36} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">No results found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">We couldn't find any questions matching your search criteria. Try broadening your search terms or exploring other categories.</p>
              <button 
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                onClick={() => {
                  setSearchTerm('');
                  setActiveCategory('all');
                }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
        
        {/* Still Have Questions Section - Enhanced design */}
        <div className="mt-16 rounded-xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-1">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 sm:p-10 text-center sm:text-left sm:flex items-center justify-between rounded-lg">
              <div className="text-white mb-6 sm:mb-0">
                <h2 className="text-2xl font-bold mb-3">Still have questions?</h2>
                <p className="opacity-90 text-blue-100">Our support team is ready to help you with any questions you might have.</p>
              </div>
              <div className="flex-shrink-0">
                <a 
                  href="/contact" 
                  className="inline-block px-8 py-4 bg-white text-blue-700 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition-colors"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer Section */}
        {/* <div className="mt-16 text-center text-gray-600">
          <p className="text-sm">If you need immediate assistance, you can also reach us at <a href="mailto:support@palsanalytix.com" className="text-blue-600 hover:underline">support@palsanalytix.com</a></p>
          <div className="mt-4 flex justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Facebook</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">LinkedIn</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div> */}
      </div>
      
    </div>
    <Footer/>
    </div>
  );
};

export default EnhancedFAQPage;