import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-brand-bg pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="py-10">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-3">Program Terms & Expectations</h1>
            <p className="text-slate-500">SkillRock Student Ambassador Program (SSAP) · Last updated: November 2026</p>
          </div>

          <div className="card p-10 prose prose-slate max-w-none">
            <h2>1. Program Overview</h2>
            <p>
              The SkillRock Student Ambassador Program (SSAP) is a voluntary, free four-month program 
              for college students in India. Ambassadors represent SkillRock at their campus by introducing 
              students to learning opportunities, creating content, and building peer communities.
            </p>

            <h2>2. Eligibility</h2>
            <ul>
              <li>Currently enrolled in a college or university in India</li>
              <li>Able to participate for the full four-month duration</li>
              <li>Able to represent SkillRock honestly and professionally</li>
              <li>No previous ambassador experience is required</li>
            </ul>

            <h2>3. Application and Selection</h2>
            <p>
              Submitting an application does not guarantee selection. Applications are reviewed by the 
              SSAP team based on multiple criteria including motivation, judgment, campus knowledge, 
              communication, and video introduction. The team reserves the right to select or decline 
              any application at its discretion.
            </p>

            <h2>4. Conduct and Integrity</h2>
            <p>Ambassadors are expected to:</p>
            <ul>
              <li>Represent SkillRock honestly and professionally</li>
              <li>Not make false claims about SkillRock or the program</li>
              <li>Not promise rewards, payments, or benefits to other students on behalf of SkillRock</li>
              <li>Respect campus rules and student privacy at all times</li>
              <li>Not promote SkillRock in ways that mislead or pressure students</li>
              <li>Not engage in spamming or aggressive promotion</li>
            </ul>

            <h2>5. Program Commitment</h2>
            <p>
              This is a voluntary program. Ambassadors are not employees, contractors, or representatives 
              of SkillRock in any legal capacity. There is no guaranteed minimum time commitment, 
              though ambassadors are expected to engage meaningfully with monthly tasks.
            </p>

            <h2>6. Benefits and Rewards</h2>
            <ul>
              <li>A digital ambassador certificate will be awarded to ambassadors who successfully complete program requirements</li>
              <li>Referral commissions apply only to eligible paid-course purchases under the current program rules</li>
              <li>Additional rewards such as goodies or recognition are distributed only when officially announced by SkillRock</li>
              <li>SkillRock does not guarantee internships, employment, recommendation letters, or career outcomes</li>
              <li>Benefits are subject to change based on program availability</li>
            </ul>

            <h2>7. Termination</h2>
            <p>
              SkillRock reserves the right to terminate an ambassador's participation for violations of 
              these terms, misconduct, misrepresentation, or inactivity. Ambassadors may voluntarily 
              withdraw from the program at any time.
            </p>

            <h2>8. Intellectual Property</h2>
            <p>
              Content created by ambassadors for SSAP activities remains the property of the ambassador. 
              By participating, ambassadors grant SkillRock a non-exclusive, royalty-free license to 
              share or republish content created for SSAP purposes with attribution.
            </p>

            <h2>9. Limitation of Liability</h2>
            <p>
              SkillRock is not liable for any losses, claims, or damages arising from an ambassador's 
              participation in the program. Ambassadors participate at their own risk and discretion.
            </p>

            <h2>10. Changes to Terms</h2>
            <p>
              SkillRock may update these terms as the program evolves. Selected ambassadors will be 
              notified of significant changes before they take effect.
            </p>

            <h2>11. Governing Law</h2>
            <p>
              These terms are governed by the laws of India. Any disputes arising from SSAP participation 
              will be subject to the jurisdiction of Indian courts.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
