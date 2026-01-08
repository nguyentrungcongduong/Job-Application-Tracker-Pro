# Test Cases: Stage Conversion Efficiency Metric

## Test Scenario 1: Empty State
**Precondition:** User has no job applications

**Steps:**
1. Navigate to `/analytics` page
2. Observe the conversion funnel section

**Expected Result:**
- Display message: "No data available yet. Start applying to jobs to see your conversion metrics!"
- No funnel visualization shown
- No errors displayed

---

## Test Scenario 2: Basic Conversion Funnel
**Precondition:** User has applications in different stages

**Test Data:**
- 10 applications in APPLIED status
- 4 applications in HR_SCREEN status
- 2 applications in INTERVIEW_1 status
- 1 application in INTERVIEW_2 status
- 0 applications in OFFER_RECEIVED status

**Steps:**
1. Create test applications with above statuses
2. Navigate to `/analytics` page
3. Observe the conversion funnel

**Expected Result:**
- Total Applications: 10
- Total Offers: 0
- Overall Conversion: 0.0%
- Applied: 10 apps → 40% conversion
- HR Screen: 4 apps → 50% conversion
- Interview R1: 2 apps → 50% conversion
- Interview R2: 1 app → N/A conversion
- Offer: 0 apps

---

## Test Scenario 3: Complete Funnel with Offers
**Precondition:** User has applications throughout the entire funnel

**Test Data:**
- 100 applications in APPLIED status
- 40 applications in HR_SCREEN status
- 20 applications in INTERVIEW_1 status
- 8 applications in INTERVIEW_2 status
- 4 applications in OFFER_RECEIVED status

**Steps:**
1. Create test applications with above statuses
2. Navigate to `/analytics` page
3. Observe the conversion funnel

**Expected Result:**
- Total Applications: 100
- Total Offers: 4
- Overall Conversion: 4.0%
- Applied: 100 apps → 40.0% conversion
- HR Screen: 40 apps → 50.0% conversion
- Interview R1: 20 apps → 40.0% conversion
- Interview R2: 8 apps → 50.0% conversion
- Offer: 4 apps
- Key Insights section shows:
  - Weakest stage identified
  - Strongest stage identified
  - Overall performance assessment

---

## Test Scenario 4: API Error Handling
**Precondition:** Backend API is unavailable or returns error

**Steps:**
1. Stop backend server or simulate API error
2. Navigate to `/analytics` page
3. Observe the conversion funnel section

**Expected Result:**
- Display error message: "Failed to load conversion metrics"
- Show "Retry" button
- No crash or console errors
- Clicking "Retry" attempts to reload data

---

## Test Scenario 5: Loading State
**Precondition:** API has slow response time

**Steps:**
1. Add network throttling or delay to API
2. Navigate to `/analytics` page
3. Observe the conversion funnel during loading

**Expected Result:**
- Display loading spinner
- Show message: "Loading conversion metrics..."
- No flickering or layout shifts
- Smooth transition to loaded state

---

## Test Scenario 6: Insights Generation
**Precondition:** User has varied conversion rates

**Test Data:**
- Applied → HR Screen: 20% (weak)
- HR Screen → Interview R1: 60% (strong)
- Interview R1 → Interview R2: 30%
- Interview R2 → Offer: 40%
- Overall: 1.44%

**Steps:**
1. Create applications to match above conversion rates
2. Navigate to `/analytics` page
3. Check Key Insights section

**Expected Result:**
- Weakest Stage: Applied with 20.0% conversion rate
- Strongest Stage: HR Screen with 60.0% conversion rate
- Overall Performance: Your 1.4% offer rate is needs improvement

---

## Test Scenario 7: Responsive Design
**Precondition:** User has conversion data

**Steps:**
1. Navigate to `/analytics` page
2. Resize browser window to mobile size (< 768px)
3. Observe layout changes

**Expected Result:**
- Funnel adapts to mobile layout
- Stats cards stack vertically
- Text sizes adjust appropriately
- All elements remain readable
- No horizontal scrolling

---

## Test Scenario 8: Visual Animations
**Precondition:** User has conversion data

**Steps:**
1. Navigate to `/analytics` page
2. Observe animations on the funnel

**Expected Result:**
- Progress bars animate smoothly on load
- Shimmer effect visible on bars
- Conversion rate pills pulse gently
- Arrows bounce subtly
- Hover effects work on interactive elements

---

## Test Scenario 9: Color Coding
**Precondition:** User has data in all stages

**Steps:**
1. Navigate to `/analytics` page
2. Observe stage colors

**Expected Result:**
- Applied: Blue (#3b82f6)
- HR Screen: Purple (#8b5cf6)
- Interview R1: Pink (#ec4899)
- Interview R2: Amber (#f59e0b)
- Offer: Green (#10b981)
- Colors are distinct and accessible

---

## Test Scenario 10: Performance Assessment
**Precondition:** Test different overall conversion rates

**Test Cases:**
| Overall Rate | Expected Assessment |
|--------------|---------------------|
| 6.0%         | excellent           |
| 3.5%         | good                |
| 1.5%         | needs improvement   |

**Steps:**
1. Create applications to achieve each conversion rate
2. Navigate to `/analytics` page
3. Check Overall Performance insight

**Expected Result:**
- Correct performance label displayed for each rate
- Assessment helps user understand their performance

---

## API Endpoint Tests

### GET /api/metrics/conversion

**Test 1: Successful Request**
```bash
curl -H "Authorization: Bearer {token}" \
  http://localhost:8080/api/metrics/conversion
```

**Expected Response:**
```json
{
  "stages": [
    {
      "stageName": "Applied",
      "count": 100,
      "conversionRate": 40.0,
      "nextStageCount": 40
    },
    ...
  ],
  "overallConversionRate": 4.0,
  "totalApplications": 100,
  "totalOffers": 4
}
```

**Test 2: Unauthorized Request**
```bash
curl http://localhost:8080/api/metrics/conversion
```

**Expected Response:**
- Status: 401 Unauthorized

**Test 3: Invalid Token**
```bash
curl -H "Authorization: Bearer invalid_token" \
  http://localhost:8080/api/metrics/conversion
```

**Expected Response:**
- Status: 401 Unauthorized

---

## Performance Tests

**Test 1: Large Dataset**
- Create 1000+ applications
- Measure API response time
- Expected: < 500ms response time

**Test 2: Concurrent Requests**
- Simulate 10 concurrent users
- All should receive correct data
- No race conditions or errors

---

## Regression Tests

**Test 1: Existing Analytics Features**
- Verify other charts still work
- Application Velocity chart displays
- Source Performance chart displays
- No layout breaks

**Test 2: Navigation**
- Sidebar navigation still works
- Page transitions smooth
- No console errors

---

## Accessibility Tests

**Test 1: Screen Reader**
- All text content readable
- Proper heading hierarchy
- Alt text for visual elements

**Test 2: Keyboard Navigation**
- Can navigate with Tab key
- Retry button focusable
- Focus indicators visible

**Test 3: Color Contrast**
- Text meets WCAG AA standards
- Colors distinguishable for colorblind users

---

## Browser Compatibility

Test on:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## Notes for Testers

1. **Backend must be running** for API tests
2. **Clear browser cache** if seeing stale data
3. **Check console** for any errors during testing
4. **Take screenshots** of any visual issues
5. **Report performance** if loading takes > 2 seconds
