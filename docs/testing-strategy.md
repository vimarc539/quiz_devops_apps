# Testing Strategy

## Test Coverage

### Unit Tests (11 tests)
Located in: `tests/unit/quiz.test.js`

**Endpoints Tested:**
- GET / - API information
- GET /api/quiz/health - Health check
- GET /api/quiz/questions - All questions
- GET /api/quiz/questions/:id - Specific question
- POST /api/quiz/submit - Single answer submission
- POST /api/quiz/submit-all - Complete quiz submission

**Test Cases:**
- ✅ Successful responses (200)
- ✅ Not found errors (404)
- ✅ Bad request errors (400)
- ✅ Data validation
- ✅ Score calculation
- ✅ Security (no answer leakage)

### Integration Tests (6 tests)
Located in: `tests/integration/api.test.js`

**Workflows Tested:**
- ✅ Complete quiz flow (get → submit → score)
- ✅ API endpoint sequence
- ✅ Error handling across endpoints

### Coverage Metrics
- **Branches:** >70%
- **Functions:** >70%
- **Lines:** >70%
- **Statements:** >70%

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Specific Test File
```bash
npx jest tests/unit/quiz.test.js
```

### Generate Coverage Report
```bash
npm test
# Coverage report in: coverage/lcov-report/index.html
```

## Automated Testing in CI

Tests run automatically on:
- Every push to `develop` or `main`
- Every pull request to `develop` or `main`

**CI Pipeline Steps:**
1. Checkout code
2. Install dependencies
3. **Run tests** ← Tests must pass!
4. Build Docker image
5. Test Docker container
6. Send notification

## Feedback Mechanisms

### GitHub Actions Notifications
- ✅ Success: Green checkmark on PR/commit
- ❌ Failure: Red X with error details
- 📧 Email: GitHub sends email on failure

### Future Enhancements
- [ ] Slack notifications
- [ ] Email alerts via SendGrid
- [ ] Test result dashboard
- [ ] Performance testing

## Test Standards

### Writing New Tests
1. Follow AAA pattern: Arrange, Act, Assert
2. Use descriptive test names
3. Test both success and failure cases
4. Maintain >70% coverage

### Example Test Structure
```javascript
describe('Feature Name', () => {
  it('should do something specific', async () => {
    // Arrange: Setup test data
    const input = { test: 'data' };
    
    // Act: Execute the code
    const response = await request(app).post('/endpoint').send(input);
    
    // Assert: Verify results
    expect(response.status).toBe(200);
  });
});
```