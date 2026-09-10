import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Helmet } from "react-helmet";
import { clearError } from "../redux/slices/authSlice";
import LoginModal from "../components/auth/LoginModal";
import SignupModal from "../components/auth/SignupModal";
import LandingPageImage from "../assets/landing_page_image.jpg";
import PalsAnalytixLogo from "../assets/palsanalytix-logo.png";
import PalsAnalytixWordmark from "../assets/palsanalytix-wordmark.png";

const SEOMetadata = () => (
  <Helmet>
    <title>
      PalsAnalytix | Premier CFA, FRM & SCR Exam Preparation Platform
    </title>
    <meta
      name="description"
      content="Industry-leading exam preparation for CFA Level 1, 2, 3, FRM Part 1 & 2, and SCR certification. Access practice questions, mock exams, and expert-led content."
    />
    <meta
      name="keywords"
      content="CFA exam preparation, FRM certification, SCR certificate, CFA Level 1, CFA Level 2, CFA Level 3, practice questions, financial certification, mock exams, financial analyst, risk management, sustainable finance, exam prep, study materials"
    />
    <link rel="canonical" href="https://palsanalytix.com" />
    <meta
      property="og:title"
      content="PalsAnalytix | Premier CFA, FRM & SCR Exam Preparation"
    />
    <meta
      property="og:description"
      content="Accelerate your finance career with our comprehensive preparation platform for CFA, FRM, and SCR certifications."
    />
  </Helmet>
);

const NAV_LINKS = [
  { label: "Courses", href: "#courses" },
  { label: "Why us", href: "#why" },
  { label: "Pricing", to: "/pricing" },
  { label: "FAQ", to: "/FAQ" },
  { label: "Contact", to: "/contact" },
  { label: "MBA Evaluation", to: "/mba-evaluation" },
];

const Nav = ({ isAuthenticated, isAdmin, onLoginClick }) => {
  const navigate = useNavigate();
  return (
    <nav className="sticky top-0 z-20 flex items-center justify-between gap-8 border-b border-line bg-ink px-6 py-4 sm:px-12">
                       <Link to="/" className="flex items-center gap-2.5 shrink-0">
        <img src={PalsAnalytixLogo} alt="PalsAnalytix" className="block h-10 w-auto" />
        <img src={PalsAnalytixWordmark} alt="palsanalytix" className="block h-6 w-auto" />
      </Link>

      <div className="hidden lg:flex items-center gap-9">
        {NAV_LINKS.map((link) =>
          link.to ? (
            <Link key={link.label} to={link.to} className="text-[15px] text-sand-300 hover:text-paper transition-colors">
              {link.label}
            </Link>
          ) : (
            <a key={link.label} href={link.href} className="text-[15px] text-sand-300 hover:text-paper transition-colors">
              {link.label}
            </a>
          )
        )}
      </div>

      <div className="flex items-center gap-5 shrink-0">
        <button
          onClick={() =>
            isAuthenticated ? navigate(isAdmin ? "/admin" : "/dashboard") : onLoginClick()
          }
          className="rounded-[3px] bg-brand-gradient-alt px-[22px] py-[11px] text-sm font-semibold text-charcoal hover:brightness-105 transition"
        >
          {isAuthenticated ? "Dashboard" : "Login"}
        </button>
      </div>
    </nav>
  );
};

const HeroSection = ({ onGetStarted }) => (
  <section className="bg-ink px-6 py-16 sm:px-12 sm:py-24 lg:grid lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:items-center lg:py-[96px]">
    <div className="flex max-w-[620px] flex-col gap-6">
      <div className="flex gap-2.5">
        {["CFA", "FRM", "SCR"].map((tag) => (
          <span
            key={tag}
            className="rounded-[2px] border border-line-tag px-3 py-1.5 font-mono text-xs uppercase tracking-[0.14em] text-accent-orange2"
          >
            {tag}
          </span>
        ))}
      </div>
      <h1 className="font-sora text-[40px] font-bold leading-[1.08] tracking-[-0.02em] text-paper sm:text-[56px] sm:leading-[1.06] text-balance">
        Structured prep for CFA, FRM and SCR candidates.
      </h1>
      <p className="max-w-2xl text-lg leading-relaxed text-sand-400">
        Video lectures, a full practice question bank and mentor support in one program, built around the exam blueprint rather than the textbook.
      </p>
      <div className="flex flex-wrap items-center gap-4 pt-2">
        <button
          onClick={onGetStarted}
          className="rounded-[3px] bg-brand-gradient-alt px-7 py-[15px] text-base font-semibold text-charcoal hover:brightness-105 transition"
        >
          Book a free class
        </button>
        <a href="#courses" className="border-b border-line-light py-[15px] text-base font-medium text-paper">
          View courses
        </a>
      </div>
      <div className="mt-2.5 flex flex-col gap-1.5 border-t border-line pt-7">
        <div className="font-mono text-sm tracking-wide text-sand-600">
          विद्याधनं सर्वधनप्रधानम् ॥
        </div>
        <div className="text-[13px] text-sand-800">
          Knowledge is wealth, foremost among all forms of wealth.
        </div>
      </div>
    </div>
    <div className="mt-12 overflow-hidden rounded-lg border border-white/[.14] bg-white/[.04] lg:mt-0">
      <img
        src={LandingPageImage}
        alt="A PalsAnalytix candidate studying"
        className="h-[320px] w-full object-cover sm:h-[420px] lg:h-[520px]"
      />
    </div>
  </section>
);

const COURSES = [
  {
    tag: "CFA",
    iconGradient: "linear-gradient(135deg, #ff7f00, #ffda55)",
    description:
      "Levels I–III, covering the full curriculum with topic-wise video lectures and timed practice sets.",
    path: "/cfa",
  },
  {
    tag: "FRM",
    iconGradient: "linear-gradient(135deg, #ff8305, #fff560)",
    description:
      "Parts I and II, focused on the quantitative and risk-management topics candidates struggle with most.",
    path: "/frm",
  },
  {
    tag: "SCR",
    iconGradient: "linear-gradient(135deg, #ffb23a, #fff560)",
    description:
      "GARP's Sustainability and Climate Risk certificate, prepared with a single compact course.",
    path: "/scr",
  },
];

const CoursesSection = () => {
  const navigate = useNavigate();
  return (
    <section id="courses" className="flex flex-col gap-11 bg-paper px-6 py-16 sm:px-12 sm:py-[88px]">
      <div className="flex max-w-[600px] flex-col gap-2.5">
        <div className="font-mono text-xs uppercase tracking-[0.14em] text-accent-orange2">Programs</div>
        <h2 className="font-sora text-3xl font-bold tracking-[-0.01em] text-charcoal sm:text-[36px]">
          Three certifications, one method
        </h2>
      </div>
      <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {COURSES.map((course) => (
          <div
            key={course.tag}
            className="flex flex-col gap-[18px] rounded-[4px] border border-sand-200 bg-white p-8"
          >
            <div
              className="h-11 w-11"
              style={{
                clipPath: "polygon(50% 0, 100% 100%, 0 100%)",
                background: course.iconGradient,
              }}
            />
            <h3 className="font-sora text-[22px] font-semibold text-charcoal">{course.tag}</h3>
            <p className="text-[15px] leading-relaxed text-sand-900">{course.description}</p>
            <button
              onClick={() => navigate(course.path)}
              className="pt-1.5 text-left text-sm font-semibold text-charcoal hover:text-accent-orange2 transition-colors"
            >
              View syllabus →
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

const WHY_US = [
  { title: "Video lectures", description: "Topic-by-topic, mapped to the current exam blueprint." },
  { title: "Question bank", description: "Practice questions at the difficulty level of the real exam." },
  { title: "Mock exams", description: "Full-length, timed mocks with a section-wise score breakdown." },
  { title: "Mentor support", description: "Doubt-clearing sessions with instructors who hold the charter." },
];

const WhyUsSection = () => (
  <section id="why" className="flex flex-col gap-11 bg-ink px-6 py-16 sm:px-12 sm:py-[88px]">
    <div className="flex max-w-[600px] flex-col gap-2.5">
      <div className="font-mono text-xs uppercase tracking-[0.14em] text-accent-orange2">How it works</div>
      <h2 className="font-sora text-3xl font-bold tracking-[-0.01em] text-paper sm:text-[36px]">
        What&rsquo;s included in every program
      </h2>
    </div>
    <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
      {WHY_US.map((item) => (
        <div key={item.title} className="flex flex-col gap-3">
          <div className="h-2 w-2 rounded-full bg-accent-orange2" />
          <h4 className="font-sora text-[17px] font-semibold text-paper">{item.title}</h4>
          <p className="text-sm leading-relaxed text-sand-500">{item.description}</p>
        </div>
      ))}
    </div>
  </section>
);

const CTABand = ({ isAuthenticated, onCta }) => (
  <section className="flex flex-wrap items-center justify-between gap-8 bg-brand-gradient px-6 py-12 sm:px-12 sm:py-16">
    <div className="flex max-w-[560px] flex-col gap-2">
      <h2 className="font-sora text-[26px] font-bold text-charcoal sm:text-[30px]">
        Start with a free class
      </h2>
      <p className="text-[15px] text-ink700">
        No commitment — sit in on a live session before you choose a program.
      </p>
    </div>
    <button
      onClick={onCta}
      className="rounded-[3px] bg-ink px-8 py-4 text-base font-semibold text-accent-amber hover:brightness-125 transition"
    >
      {isAuthenticated ? "View pricing" : "Reserve your seat"}
    </button>
  </section>
);

const FOOTER_PROGRAMS = [
  { name: "CFA", path: "/cfa" },
  { name: "FRM", path: "/frm" },
  { name: "SCR", path: "/scr" },
];

const FOOTER_COMPANY = [
  { name: "Why us", href: "#why" },
  { name: "FAQ", to: "/FAQ" },
  { name: "Contact", to: "/contact" },
];

const SiteFooter = () => (
  <footer className="flex flex-col gap-8 bg-ink px-6 py-12 sm:px-12 sm:pb-8 sm:pt-12">
    <div className="flex flex-wrap justify-between gap-8">
      <div className="flex max-w-[320px] flex-col gap-3">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={PalsAnalytixLogo} alt="PalsAnalytix" className="block h-[68px] w-auto" />
          <span className="font-sora text-lg font-semibold text-paper">palsanalytix</span>
        </Link>
        <p className="text-[13px] leading-relaxed text-sand-700">
          CFA, FRM and SCR exam preparation.
        </p>
      </div>
      <div className="flex flex-wrap gap-14">
        <div className="flex flex-col gap-2.5">
          <div className="text-[13px] font-semibold text-paper">Programs</div>
          {FOOTER_PROGRAMS.map((item) => (
            <Link key={item.name} to={item.path} className="text-[13px] text-sand-500 hover:text-paper transition-colors">
              {item.name}
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="text-[13px] font-semibold text-paper">Company</div>
          {FOOTER_COMPANY.map((item) =>
            item.to ? (
              <Link key={item.name} to={item.to} className="text-[13px] text-sand-500 hover:text-paper transition-colors">
                {item.name}
              </Link>
            ) : (
              <a key={item.name} href={item.href} className="text-[13px] text-sand-500 hover:text-paper transition-colors">
                {item.name}
              </a>
            )
          )}
        </div>
      </div>
    </div>
    <div className="flex flex-col gap-3 border-t border-line pt-5 text-xs text-sand-800 sm:flex-row sm:items-center sm:justify-between">
      <span>© {new Date().getFullYear()} Palsanalytix</span>
      <span className="font-mono">विद्याधनं सर्वधनप्रधानम् ॥</span>
    </div>
    <p className="max-w-3xl text-[11px] leading-relaxed text-sand-800">
      CFA® and Chartered Financial Analyst® are registered trademarks owned by CFA Institute. FRM® is a registered trademark of the Global Association of Risk Professionals.
    </p>
  </footer>
);

const LandingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const isAdmin = user?.email === import.meta.env.VITE_ADMIN_EMAIL;

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const closeModal = () => {
    setShowAuthModal(false);
    setAuthMode("login");
    dispatch(clearError());
  };
  const openLogin = () => {
    setAuthMode("login");
    setShowAuthModal(true);
  };
  const switchToRegister = () => {
    setAuthMode("register");
    dispatch(clearError());
  };
  const switchToLogin = () => {
    setAuthMode("login");
    dispatch(clearError());
  };

  const handlePrimaryCta = () => {
    if (isAuthenticated) {
      navigate("/pricing");
    } else {
      openLogin();
    }
  };

  return (
    <div className="min-h-screen bg-paper font-sans text-charcoal">
      <SEOMetadata />
      <Nav isAuthenticated={isAuthenticated} isAdmin={isAdmin} onLoginClick={openLogin} />
      <HeroSection onGetStarted={openLogin} />
      <CoursesSection />
      <WhyUsSection />
      <CTABand isAuthenticated={isAuthenticated} onCta={handlePrimaryCta} />

      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            {authMode === "login" ? (
              <LoginModal onSuccess={closeModal} onClose={closeModal} onSignupClick={switchToRegister} />
            ) : (
              <SignupModal onSuccess={switchToLogin} onClose={closeModal} onLoginClick={switchToLogin} />
            )}
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
};

export default LandingPage;
