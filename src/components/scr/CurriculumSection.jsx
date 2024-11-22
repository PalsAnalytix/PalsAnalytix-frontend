import React from "react";

const CurriculumSection = () => {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold text-blue-800 mb-4">
        SCR® Exam Curriculum
      </h2>
      {/* Scrollable container */}
      <div
        className="bg-gray-50 p-4 rounded-lg shadow-md overflow-y-auto"
        style={{ height: "400px" }} // Set the fixed height for the scrollable container
      >
        {/* Curriculum content */}
        <div className="space-y-6">
          <div className="p-4 bg-gray-50 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800">
              1. Foundations of Climate Change
            </h3>
            <p className="mt-2 text-gray-600">Exam Weight: 8 - 12 Questions</p>
            <ul className="list-disc mt-2 ml-6 text-gray-700">
              <li>
                Define climate change and differentiate between weather and
                climate.
              </li>
              <li>
                Know the general trends of modern climate change, such as
                observed surface temperature, sea ice coverage, etc.
              </li>
              <li>
                Describe the Earth's climate history, and methods for measuring
                non-anthropogenic climate change.
              </li>
              <li>
                Understand how the Earth's energy balance, greenhouse effect,
                and radiative forcing affect the climate.
              </li>
              <li>
                Know primary greenhouse gases and aerosols, their sources, and
                contribution to climate change.
              </li>
              <li>
                Explain non-human and human mechanisms contributing to climate
                change.
              </li>
              <li>
                Understand environmental and socioeconomic climate-driven
                impacts across geography and time.
              </li>
              <li>
                Discuss climate change adaptation, mitigation, and
                geoengineering techniques.
              </li>
              <li>
                Explain carbon budgets and emissions trajectories, including
                global emissions limits.
              </li>
            </ul>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800">
              2. Sustainability
            </h3>
            <p className="mt-2 text-gray-600">Exam Weight: 8 - 12 Questions</p>
            <ul className="list-disc mt-2 ml-6 text-gray-700">
              <li>Define sustainability, ESG, and corporate responsibility.</li>
              <li>
                Understand how sustainability concepts are used in
                organizations.
              </li>
              <li>
                Explain the UN Sustainable Development Goals (SDGs) and their
                application.
              </li>
              <li>
                Understand ecosystem services, natural capital, and
                greenwashing.
              </li>
              <li>
                Describe Life-Cycle Assessment, sustainability reporting
                frameworks, and initiatives.
              </li>
            </ul>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800">
              3. Climate Change Risk
            </h3>
            <p className="mt-2 text-gray-600">Exam Weight: 8 - 12 Questions</p>
            <ul className="list-disc mt-2 ml-6 text-gray-700">
              <li>Describe climate risk and financial risk.</li>
              <li>Differentiate physical and transition risks.</li>
              <li>
                Understand acute and chronic hazards, stranded assets, and risk
                uncertainty.
              </li>
              <li>
                Identify data challenges and discuss opportunities from physical
                and transition risks.
              </li>
              <li>
                Explore transition risk categories (e.g., technology, market).
              </li>
            </ul>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800">
              4. Sustainability and Climate Policy, Culture, and Governance
            </h3>
            <p className="mt-2 text-gray-600">Exam Weight: 8 - 12 Questions</p>
            <ul className="list-disc mt-2 ml-6 text-gray-700">
              <li>
                Discuss the evolution of international climate policy and Paris
                Agreement.
              </li>
              <li>
                Understand carbon pricing policies, carbon taxes, and emissions
                trading.
              </li>
              <li>
                Describe sector-specific climate policies and national emissions
                accounting.
              </li>
              <li>
                Explain Scope 1, 2, and 3 emissions and green finance policies.
              </li>
            </ul>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800">
              5. Green and Sustainable Finance: Markets and Instruments
            </h3>
            <p className="mt-2 text-gray-600">Exam Weight: 8 - 12 Questions</p>
            <ul className="list-disc mt-2 ml-6 text-gray-700">
              <li>
                Understand green, social, and sustainable bonds and loans.
              </li>
              <li>Explain ESG integration in investment and lending.</li>
              <li>
                Describe existing and emerging approaches in sustainable and
                green finance.
              </li>
              <li>Explore regulatory trends in ESG disclosure.</li>
            </ul>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800">
              6. Climate Risk Measurement and Management
            </h3>
            <p className="mt-2 text-gray-600">Exam Weight: 12 - 18 Questions</p>
            <ul className="list-disc mt-2 ml-6 text-gray-700">
              <li>Describe how climate risk manifests as financial risk.</li>
              <li>
                Understand company-level risks (operational, credit, liquidity,
                etc.).
              </li>
              <li>Examine systemic risks and transmission channels.</li>
              <li>
                Explore climate risk metrics and tools for assessing risks at
                the company and portfolio levels.
              </li>
              <li>
                Discuss the integration of climate risks into ERM frameworks
                using case studies.
              </li>
            </ul>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800">
              7. Climate Models and Scenario Analysis
            </h3>
            <p className="mt-2 text-gray-600">Exam Weight: 8 - 12 Questions</p>
            <ul className="list-disc mt-2 ml-6 text-gray-700">
              <li>Define and explain climate scenario analysis.</li>
              <li>
                Understand global net-zero scenarios, IPCC, IEA scenarios, and
                their uses.
              </li>
              <li>Discuss key choices for scenario development.</li>
              <li>
                Explain how organizations use scenarios to assess physical and
                transition risks.
              </li>
              <li>Explore case studies of scenario analysis applications.</li>
            </ul>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800">8. Net Zero</h3>
            <p className="mt-2 text-gray-600">Exam Weight: 4 - 6 Questions</p>
            <ul className="list-disc mt-2 ml-6 text-gray-700">
              <li>
                Explain the concept of net-zero and its relationship to climate
                goals.
              </li>
              <li>Discuss key alliances in the UN Race to Zero.</li>
              <li>
                Describe net-zero target strategies and emissions reduction
                approaches.
              </li>
              <li>
                Examine cross-industry principles for net-zero reporting and
                metrics.
              </li>
              <li>
                Understand the net-zero disclosure landscape and key
                stakeholders.
              </li>
            </ul>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800">
              9. Climate and Nature Risk Assessment
            </h3>
            <p className="mt-2 text-gray-600">Exam Weight: 4 - 6 Questions</p>
            <ul className="list-disc mt-2 ml-6 text-gray-700">
              <li>
                Differentiate between climate risk measurement and assessment.
              </li>
              <li>Discuss IFRS standards, TCFD, ISSB, and TNFD frameworks.</li>
              <li>
                Explore water risk, biodiversity financing, and nature risk
                impacts.
              </li>
              <li>
                Apply practices from case studies to climate and nature risk
                assessments.
              </li>
            </ul>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800">
              10. Transition Planning and Carbon Reporting
            </h3>
            <p className="mt-2 text-gray-600">Exam Weight: 4 - 6 Questions</p>
            <ul className="list-disc mt-2 ml-6 text-gray-700">
              <li>
                Explain drivers and principles for good transition planning.
              </li>
              <li>
                Understand SBTi Net-Zero targets and GHG calculation steps.
              </li>
              <li>Discuss financed emissions and PCAF standards.</li>
              <li>
                Explore mandatory and voluntary reporting requirements for
                financial institutions.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CurriculumSection;
