import React from "react";
import Footer from "../common/Footer";

const CFACurriculumSection = () => {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold text-blue-800 mb-4">
        CFA Exam Curriculum
      </h2>
      {/* Scrollable container */}
      <div
        className="bg-gray-50 p-4 rounded-lg shadow-md overflow-y-auto"
        style={{ height: "400px" }} // Set the fixed height for the scrollable container
      >
        {/* Curriculum content */}
        <div className="space-y-6">
          {[
            {
              title: "1. Ethical and Professional Standards",
              topics: [
                "Ethics and Trust in the Investment Profession",
                "Code of Ethics and Standards of Professional Conduct",
                "Guidance for Standards I–VII",
                "Introduction to the Global Investment Performance Standards (GIPS)",
                "Ethics Application",
              ],
            },
            {
              title: "2. Quantitative Methods",
              topics: [
                "Rates and Returns",
                "Time Value of Money in Finance",
                "Statistical Measures of Asset Returns",
                "Probability Trees and Conditional Expectations",
                "Portfolio Mathematics",
                "Simulation Methods",
                "Estimation and Inference",
                "Hypothesis Testing",
                "Parametric and Non-Parametric Tests of Independence",
                "Simple Linear Regression",
                "Introduction to Big Data Techniques",
              ],
            },
            {
              title: "3. Economics",
              topics: [
                "The Firm and Market Structures",
                "Understanding Business Cycles",
                "Fiscal Policy",
                "Monetary Policy",
                "Introduction to Geopolitics",
                "International Trade",
                "Capital Flows and the FX Market",
                "Exchange Rate Calculations",
              ],
            },
            {
              title: "4. Financial Statement Analysis",
              topics: [
                "Introduction to Financial Statement Analysis",
                "Analyzing Income Statements",
                "Analyzing Balance Sheets",
                "Analyzing Statements of Cash Flows I",
                "Analyzing Statements of Cash Flows II",
                "Analysis of Inventories",
                "Analysis of Long-Term Assets",
                "Topics in Long-Term Liabilities and Equity",
                "Analysis of Income Taxes",
                "Financial Reporting Quality",
                "Financial Analysis Techniques",
                "Introduction to Financial Statement Modeling",
              ],
            },
            {
              title: "5. Corporate Issuers",
              topics: [
                "Organizational Forms, Corporate Issuer Features, and Ownership",
                "Investors and Other Stakeholders",
                "Corporate Governance: Conflicts, Mechanisms, Risks, and Benefits",
                "Working Capital and Liquidity",
                "Capital Investments and Capital Allocation",
                "Capital Structure",
                "Business Models",
              ],
            },
            {
              title: "6. Equity Investments",
              topics: [
                "Market Organisation and Structure",
                "Security Market Indexes",
                "Market Efficiency",
                "Overview of Equity Securities",
                "Company Analysis: Past and Present",
                "Industry and Competitive Analysis",
                "Company Analysis: Forecasting",
                "Equity Valuation: Concepts and Basic Tools",
              ],
            },
            {
              title: "7. Fixed Income",
              topics: [
                "Fixed-Income Instrument Features",
                "Fixed-Income Cash Flows and Types",
                "Fixed-Income Issuance and Trading",
                "Fixed-Income Markets for Corporate Issuers",
                "Fixed-Income Markets for Government Issuers",
                "Fixed-Income Bond Valuation: Prices and Yields",
                "Yield and Yield Spread Measures for Fixed-Rate Bonds",
                "Yield and Yield Spread Measures for Floating-Rate Instruments",
                "The Term Structure of Interest Rates: Spot, Par, and Forward Curves",
                "Interest Rate Risk and Return",
                "Yield-Based Bond Duration Measures and Properties",
                "Yield-Based Bond Convexity and Portfolio Properties",
                "Curve-Based and Empirical Fixed-Income Risk Measures",
                "Credit Risk",
                "Credit Analysis for Government Issuers",
                "Credit Analysis for Corporate Issuers",
                "Fixed-Income Securitization",
                "Asset-Backed Security (ABS) Instrument and Market Features",
                "Mortgage-Backed Security (MBS) Instrument and Market Features",
              ],
            },
            {
              title: "8. Derivatives",
              topics: [
                "Derivative Instrument and Derivative Market Features",
                "Forward Commitment and Contingent Claim Features and Instruments",
                "Derivative Benefits, Risks, and Issuer and Investor Uses",
                "Arbitrage, Replication, and the Cost of Carry in Pricing Derivatives",
                "Pricing and Valuation of Forward Contracts and for an Underlying with Varying Maturities",
                "Pricing and Valuation of Futures Contracts",
                "Pricing and Valuation of Interest Rates and Other Swaps",
                "Pricing and Valuation of Options",
                "Option Replication Using Put–Call Parity",
                "Valuing a Derivative Using a One-Period Binomial Model",
              ],
            },
            {
              title: "9. Alternative Assets",
              topics: [
                "Alternative Investment Features, Methods, and Structures",
                "Alternative Investment Performance and Return",
                "Investments in Private Capital: Equity and Debt",
                "Real Estate and Infrastructure",
                "Natural Resources",
                "Hedge Funds",
                "Introduction to Digital Assets",
              ],
            },
            {
              title: "10. Portfolio Management",
              topics: [
                "Portfolio Risk and Return: Part I",
                "Portfolio Risk and Return: Part II",
                "Portfolio Management: An Overview",
                "Basics of Portfolio Planning and Construction",
                "The Behavioral Biases of Individuals",
                "Introduction to Risk Management",
              ],
            },
          ].map((section, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800">
                {section.title}
              </h3>
              <ul className="list-disc mt-2 ml-6 text-gray-700">
                {section.topics.map((topic, topicIndex) => (
                  <li key={topicIndex}>{topic}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CFACurriculumSection;