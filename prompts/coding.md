# Coding practices

1. First, check for tests relevant to the new functionality. Create them if they don't already exist.
2. Check implementation correctness by ensuring unit tests succeed with "npm run test:run" and browser tests succeed with "npm run test:browser:run".
3. Narrow down issues by checking against the failing tests. Don't run all the tests if not needed.
4. Follow coding best practices: KISS, DRY, and YAGNI.
  - KISS: Keep It Simple, Stupid
  - DRY: Don't Repeat Yourself
  - YAGNI: You Aren't Gonna Need It
5. Include useful comments that aren't obvious from the code itself.