import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-brand-bg pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="py-10">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-3">Privacy Policy</h1>
            <p className="text-slate-500">SkillRock Student Ambassador Program (SSAP) · Last updated: November 2026</p>
          </div>

          <div className="card p-10 prose prose-slate max-w-none">
            <h2>1. Introduction</h2>
            <p>
              SkillRock ("we", "us", "our") is committed to protecting the privacy of individuals who apply to the 
              SkillRock Student Ambassador Program (SSAP). This policy explains what personal information we collect, 
              how we use it, and your rights.
            </p>

            <h2>2. Information We Collect</h2>
            <p>When you apply to SSAP, we collect the following information:</p>
            <ul>
              <li><strong>Identity information:</strong> Full name, email address, phone number</li>
              <li><strong>Academic information:</strong> College, university, degree, year of study, branch</li>
              <li><strong>Location information:</strong> City and state</li>
              <li><strong>Social profile links:</strong> LinkedIn and Instagram (optional)</li>
              <li><strong>Application responses:</strong> Your written answers to motivational, situational, and campus questions</li>
              <li><strong>Video introduction:</strong> Video file or video link submitted as part of the application</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use your information exclusively for:</p>
            <ul>
              <li>Reviewing and evaluating your ambassador application</li>
              <li>Contacting shortlisted or selected candidates</li>
              <li>Managing the SSAP program administration</li>
              <li>Preventing duplicate applications</li>
              <li>Program analytics (aggregated, not individual)</li>
            </ul>

            <h2>4. Who Has Access</h2>
            <p>
              Only authorized SSAP reviewers with verified admin credentials can access your application. 
              Applicants cannot view other applicants' details. Video submissions are not made public.
            </p>

            <h2>5. Data Retention</h2>
            <p>
              Application data is retained for a maximum of 12 months from the date of submission. 
              After this period, personal data may be deleted unless there is a legitimate operational reason to retain it.
              You may request deletion of your data at any time.
            </p>

            <h2>6. Cookies and Tracking</h2>
            <p>
              The SSAP website uses browser localStorage only to temporarily save your application draft.
              This data remains on your device and is not transmitted to our servers until you submit your application.
              We do not use unnecessary tracking or analytics cookies.
            </p>

            <h2>7. Data Security</h2>
            <p>
              We implement appropriate technical safeguards including HTTPS encryption, 
              secure admin authentication, rate limiting, and server-side validation. 
              No system can guarantee absolute security, but we take reasonable measures to protect your data.
            </p>

            <h2>8. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Request access to the data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your application data</li>
              <li>Withdraw your application at any time before selection</li>
            </ul>
            <p>
              To exercise these rights, contact us at the email address provided in the SSAP communications 
              you receive after submitting your application.
            </p>

            <h2>9. Third-Party Links</h2>
            <p>
              This site links to SkillRock's main platform and external services such as Google Drive. 
              We are not responsible for the privacy practices of external websites.
            </p>

            <h2>10. Changes to This Policy</h2>
            <p>
              We may update this policy as the program evolves. Any significant changes will be 
              communicated to registered applicants. Continued use of the application portal constitutes 
              acceptance of the updated policy.
            </p>

            <h2>11. Contact</h2>
            <p>
              If you have questions about your data or this policy, please contact the SSAP program team 
              through the contact information provided in your application confirmation email.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
