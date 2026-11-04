console.log('====================================================');
console.log('🚀 SkillRock SSAP Backend Automated Test Suite');
console.log('   Running in Node.js ' + process.version + ' with ts-node');
console.log('====================================================\n');

// Import all 5 test suites so node:test registers and executes them
import './scoring.test';
import './badges.test';
import './ranking.test';
import './leaderboard.test';
import './certificates.test';
import './adversarial.test';
import './adversarial_scoring.test';

