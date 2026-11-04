# E2E Test Infra: SSAP Revamp

## Test Philosophy
- Opaque-box, requirement-driven. No dependency on implementation internals.
- Verification derived directly from `ORIGINAL_REQUEST.md` and user-facing acceptance criteria.
- Methodology: Category-Partition + Boundary Value Analysis + Pairwise Interaction Testing + Real-World Workload Testing.

## Feature Inventory & Test Mapping
| # | Feature | Source (Requirement) | Tier 1 (Coverage) | Tier 2 (Boundary) | Tier 3 (Cross-Feature) | Tier 4 (Real-World) |
|---|---------|---------------------|:-----------------:|:-----------------:|:----------------------:|:-------------------:|
| 1 | Visual Branding & Typography | R1, geministudentambassador.com | 5 | 5 | ✓ | ✓ |
| 2 | Leadership & Peer Learning Messaging | R1, ORIGINAL_REQUEST | 5 | 5 | ✓ | ✓ |
| 3 | Physical Rewards Elimination | R2, ORIGINAL_REQUEST | 5 | 5 | ✓ | ✓ |
| 4 | Verified Digital Certificate | R2, ORIGINAL_REQUEST | 5 | 5 | ✓ | ✓ |
| 5 | Tiered Digital Badges | R2, ORIGINAL_REQUEST | 5 | 5 | ✓ | ✓ |
| 6 | Uncapped Scoring Model | R3, ORIGINAL_REQUEST | 5 | 5 | ✓ | ✓ |
| 7 | Dynamic Leaderboard API | R3, ORIGINAL_REQUEST | 5 | 5 | ✓ | ✓ |
| 8 | Frontend Leaderboard & UI | R3, ORIGINAL_REQUEST | 5 | 5 | ✓ | ✓ |

## Test Architecture
- **Test Runner**: Node-based automated verification runner (`e2e_tests/run_e2e_tests.js`).
- **Pass/Fail Semantics**: Exit code 0 on all tests passing, nonzero on any failure, structured JSON/markdown reporting.
- **Directory Layout**:
  - `e2e_tests/run_e2e_tests.js`: CLI runner.
  - `e2e_tests/tier1_feature_coverage.test.js`: Feature verification tests (>=5 per feature).
  - `e2e_tests/tier2_boundary_corner.test.js`: Boundary, edge cases, negative tests (>=5 per feature).
  - `e2e_tests/tier3_cross_feature.test.js`: Pairwise combinations and state flow tests.
  - `e2e_tests/tier4_real_world.test.js`: End-to-end user workflows and scenario tests.

## Coverage Thresholds
- Tier 1: >= 40 test assertions (5 per feature across 8 features)
- Tier 2: >= 40 test assertions (edge cases, negative inputs, invalid queries, extreme points)
- Tier 3: >= 10 cross-feature interaction scenarios
- Tier 4: >= 5 realistic end-to-end user journeys
- **Total minimum**: >= 95 automated test assertions
