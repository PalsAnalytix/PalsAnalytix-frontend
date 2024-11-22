import React from 'react';

const PolicySection = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold text-blue-700 mb-2">{title}</h3>
    {children}
  </div>
);

const PolicyList = ({ items }) => (
  <ul className="list-disc pl-5 space-y-1 text-sm">
    {items.map((item, index) => (
      <li key={index} className="text-gray-700">{item}</li>
    ))}
  </ul>
);

const SCRExamPolicy = () => {
  return (
    <section className="bg-blue-50 p-6 rounded-md shadow mb-12">
      <h2 className="text-xl font-bold text-yellow-700 mb-4">SCR® Exam Policy</h2>

      <PolicySection title="Identification Policy">
        <p className="mb-2 text-sm text-gray-700">Candidates must present a form of ID that meets ALL of the following requirements:</p>
        <PolicyList items={[
          "Original (not a photocopy) and valid",
          "Non-expired",
          "Government-issued",
          "Contains a current photograph of the candidate",
          "Contains candidate's signature"
        ]} />
        <p className="mt-2 mb-1 text-sm text-gray-700">Acceptable forms of identification include:</p>
        <PolicyList items={[
          "Passport",
          "U.S. passport card",
          "U.S. military ID",
          "U.S. Dept. of State driver's license",
          "National/state/country identification card",
          "Alien registration card (green card, permanent resident visa)",
          "Government-issued local language ID (plastic card with photo and signature)"
        ]} />
        <p className="mt-2 text-sm text-gray-700 font-semibold">Any form of digital identification will not be considered valid.</p>
      </PolicySection>

      <PolicySection title="Registration Policy">
        <p className="mb-2 text-sm text-gray-700">To register successfully for the SCR® Exam, candidates must:</p>
        <PolicyList items={[
          "Complete the registration form online",
          "Pay the registration fee"
        ]} />
        <p className="mt-2 text-sm text-gray-700">Candidates must agree to uphold the Candidate Responsibility Statement and adhere to the GARP Code of Conduct.</p>
      </PolicySection>

      <PolicySection title="Refund Policy">
        <p className="text-sm text-gray-700">Candidates have 48 hours after submitting their SCR® exam registration payment to request a refund. All refund requests must be received via email to memberservices@garp.com.</p>
      </PolicySection>

      <PolicySection title="Retake Policy">
        <p className="text-sm text-gray-700">Candidates who do not pass, choose not to schedule, or do not take the exam can pay a one-time retake fee of USD 350 for the next two exam cycles only.</p>
      </PolicySection>

      <PolicySection title="Scheduling Policy">
        <p className="text-sm text-gray-700">Registered candidates can schedule an in-person Computer-Based Testing (CBT) Exam at a Pearson VUE test center. Scheduling must be done at least 48 hours in advance of the desired exam start time.</p>
      </PolicySection>

      <PolicySection title="Attendance Policy">
        <p className="text-sm text-gray-700">Candidates arriving beyond the designated start time will be denied entry and forfeit their exam fee.</p>
      </PolicySection>

      <PolicySection title="Deferral Policy">
        <p className="mb-2 text-sm text-gray-700">SCR® candidates may defer an exam registration once to the next exam window.</p>
        <p className="text-sm text-gray-700">Deferral deadlines:</p>
        <PolicyList items={[
          "April exam window – April 1, 2023",
          "October exam window – October 1, 2023"
        ]} />
        <p className="mt-2 text-sm text-gray-700">There is an administrative processing fee of USD 100 to defer.</p>
      </PolicySection>
    </section>
  );
};

export default SCRExamPolicy;