// Comprehensive E2E Verification Script for SSAP
const assert = require('assert');

async function runTests() {
  const BASE_URL = 'http://localhost:5000';
  console.log('🧪 Starting SSAP E2E Verification Suite...\n');

  // Test 1: Health Check
  console.log('1. Testing Health Check...');
  const healthRes = await fetch(`${BASE_URL}/health`);
  const healthData = await healthRes.json();
  assert.strictEqual(healthRes.status, 200);
  assert.strictEqual(healthData.status, 'ok');
  console.log('   ✅ Health check passed\n');

  // Test 2: Admin Login with valid credentials
  console.log('2. Testing Admin Login...');
  const loginRes = await fetch(`${BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@skillrock.in',
      password: 'Admin@SSAP2026!'
    })
  });
  const loginData = await loginRes.json();
  assert.strictEqual(loginRes.status, 200);
  assert(loginData.token, 'Token must be returned');
  const adminToken = loginData.token;
  console.log('   ✅ Admin authenticated successfully, JWT received\n');

  // Test 3: Admin Login with invalid credentials
  console.log('3. Testing Admin Login Rejection on Wrong Password...');
  const badLoginRes = await fetch(`${BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@skillrock.in',
      password: 'WrongPassword123!'
    })
  });
  assert.strictEqual(badLoginRes.status, 401);
  console.log('   ✅ Unauthorized login correctly rejected (401)\n');



  // Test 4: Submit New Application
  console.log('4. Testing Application Submission...');
  const testEmail = `priya.sharma.${Date.now()}@testcollege.edu`;
  const appPayload = {
    fullName: 'Priya Sharma',
    email: testEmail,
    phone: '9876543210',
    college: 'St. Xavier\'s College',
    university: 'University of Mumbai',
    degree: 'B.Tech',
    year: '2nd Year',
    branch: 'Computer Science',
    city: 'Mumbai',
    state: 'Maharashtra',
    preferredLanguage: 'English',
    weeklyAvailability: '3–5 hours',
    whyAmbassador: 'I have always been deeply passionate about peer-to-peer learning and community building. In college, many students struggle with traditional lectures and thrive when learning alongside classmates. I want to build a thriving SkillRock learning hub at our campus to bridge this gap.',
    skillrockValue: 'SkillRock offers hands-on, practical skill-sharing where students teach each other real-world skills like design, coding, and communication rather than just rote learning.',
    timeContribution: '3–5 hours',
    priorExperience: 'Yes',
    priorExperienceDescription: 'Organised the annual department coding hackathon with 120+ participants.',
    personalGoal: 'Develop strong campus leadership and help at least 50 students discover practical learning opportunities.',
    scenario1Answer: 'B',
    scenario1Reasoning: 'Personal outreach builds trust and helps understand individual learner needs.',
    scenario2Answer: 'C',
    scenario3Answer: 'C',
    scenario4Answer: 'B',
    scenario5Answer: 'B',
    scenario6Answer: 'B',
    campusWaitingPlace: 'The student cafeteria during the lunch hour (1:00 PM - 2:00 PM), where students queue for 10 minutes.',
    campusGatheringArea: 'The amphitheater courtyard near the library, open to all students for informal study circles.',
    campusReach500: 'The official batch CR network and council announcement board, which directly notifies all classes.',
    campusEvent: 'The upcoming technical festival TechX in December, where we can host a 45-minute live skill-swap showdown.',
    campusTradition: 'The Canteen Jam — acoustic sessions every Friday evening where students gather informally.',
    quickFire1: 'B',
    quickFire2: 'B',
    videoType: 'link',
    videoUrl: 'https://drive.google.com/file/d/1example-ssap-video-id/view?usp=sharing',
    declarationAccepted: 'true'
  };

  // Test: Reject YouTube link
  console.log('4a. Testing YouTube Link Rejection (No YouTube Allowed)...');
  const ytRes = await fetch(`${BASE_URL}/api/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...appPayload,
      email: `yt-test-${Date.now()}@college.edu`,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    })
  });
  assert.strictEqual(ytRes.status, 400);
  const ytData = await ytRes.json();
  assert(ytData.errors[0].msg.includes('YouTube links are not accepted'));
  console.log('   ✅ YouTube video link correctly rejected (400) with clear error\n');

  console.log('4b. Testing Valid Google Drive Application Submission...');
  const submitRes = await fetch(`${BASE_URL}/api/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(appPayload)
  });
  const submitData = await submitRes.json();
  assert.strictEqual(submitRes.status, 201);
  assert(submitData.applicationId, 'Must generate application ID');
  assert(submitData.statusToken, 'Must generate status token');
  console.log(`   ✅ Application submitted! ID: ${submitData.applicationId}, Token: ${submitData.statusToken}\n`);

  const appId = submitData.applicationId;
  const statusToken = submitData.statusToken;

  // Test 5: Prevent Duplicate Application
  console.log('5. Testing Duplicate Application Prevention...');
  const duplicateRes = await fetch(`${BASE_URL}/api/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(appPayload)
  });
  assert.strictEqual(duplicateRes.status, 409);
  console.log('   ✅ Duplicate submission rejected with status 409\n');

  // Test 6: Check Application Status
  console.log('6. Testing Application Status Check...');
  const statusRes = await fetch(`${BASE_URL}/api/applications/status?email=${encodeURIComponent(testEmail)}&token=${encodeURIComponent(statusToken)}`);
  const statusData = await statusRes.json();
  assert.strictEqual(statusRes.status, 200);
  assert.strictEqual(statusData.applicationId, appId);
  assert.strictEqual(statusData.status, 'submitted');
  console.log(`   ✅ Status check verified: ${statusData.statusLabel} (${statusData.status})\n`);

  // Test 7: Admin Listing Applications
  console.log('7. Testing Admin Applications Listing...');
  const listRes = await fetch(`${BASE_URL}/api/applications?search=${encodeURIComponent(testEmail)}`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  const listData = await listRes.json();
  assert.strictEqual(listRes.status, 200);
  assert(listData.applications.length > 0, 'Found submitted application in search');
  console.log(`   ✅ Admin list retrieved ${listData.pagination.total} total application(s)\n`);

  // Test 8: Admin Dashboard Statistics
  console.log('8. Testing Admin Stats Endpoint...');
  const statsRes = await fetch(`${BASE_URL}/api/applications/stats`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  const statsData = await statsRes.json();
  assert.strictEqual(statsRes.status, 200);
  assert(statsData.total >= 1);
  console.log(`   ✅ Dashboard stats: Total=${statsData.total}, Status groups=${statsData.byStatus.length}\n`);

  // Test 9: Admin Fetch Single Application
  console.log('9. Testing Admin Single Application Review...');
  const singleRes = await fetch(`${BASE_URL}/api/applications/${appId}`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  const singleData = await singleRes.json();
  assert.strictEqual(singleRes.status, 200);
  assert.strictEqual(singleData.fullName, 'Priya Sharma');
  assert.strictEqual(singleData.college, 'St. Xavier\'s College');
  console.log('   ✅ Single application loaded with all fields & answers\n');

  // Test 10: Admin Review, Scoring & Shortlist
  console.log('10. Testing Admin Scoring & Status Update...');
  const updateRes = await fetch(`${BASE_URL}/api/applications/${appId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      status: 'shortlisted',
      motivationScore: 19,
      situationalScore: 28,
      campusScore: 24,
      quickFireScore: 5,
      videoScore: 18,
      totalScore: 94,
      reviewerNotes: 'Exceptional campus knowledge, strong leadership track record, thoughtful reasoning.',
      internalNotes: 'Strong candidate for campus lead.'
    })
  });
  const updateData = await updateRes.json();
  assert.strictEqual(updateRes.status, 200);
  assert.strictEqual(updateData.application.status, 'shortlisted');
  assert.strictEqual(updateData.application.totalScore, 94);
  console.log('   ✅ Application reviewed and marked as "shortlisted" with score 94/100\n');

  // Test 11: Applicant Sees Updated Status
  console.log('11. Testing Applicant Sees Shortlisted Status...');
  const updatedStatusRes = await fetch(`${BASE_URL}/api/applications/status?email=${encodeURIComponent(testEmail)}&token=${encodeURIComponent(statusToken)}`);
  const updatedStatusData = await updatedStatusRes.json();
  assert.strictEqual(updatedStatusData.status, 'shortlisted');
  console.log(`   ✅ Applicant confirmed status is now: ${updatedStatusData.statusLabel}\n`);

  // Test 12: Admin CSV Export
  console.log('12. Testing CSV Export...');
  const csvRes = await fetch(`${BASE_URL}/api/applications/export/csv`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  assert.strictEqual(csvRes.status, 200);
  const csvText = await csvRes.text();
  assert(csvText.includes('Application ID'), 'CSV must contain headers');
  assert(csvText.includes(appId), 'CSV must contain the submitted application');
  console.log('   ✅ CSV Export generated and validated\n');

  console.log('====================================================');
  console.log('🎉 ALL 12 END-TO-END TESTS PASSED SUCCESSFULLY! 🎉');
  console.log('====================================================');
}

runTests().catch(err => {
  console.error('❌ Test suite failed:', err);
  process.exit(1);
});
