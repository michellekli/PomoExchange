# Codecov Configuration for reward-history-bar.tsx

## Issue
Codecov is not properly reporting coverage for `reward-history-bar.tsx`.

## Root Cause Analysis
The component uses dynamic imports and lazy loading which Codecov's default configuration doesn't instrument correctly.

## Fix: codecov.yml
```yaml
coverage:
  status:
    project:
      default:
        target: 80%
        threshold: 5%
    patch:
      default:
        target: 80%

# Ensure all files are tracked
ignore:
  - "node_modules/**"
  - "*.d.ts"
  - "*.config.*"

# Component-specific overrides
component_reporting:
  include:
    - "src/components/reward-history-bar.tsx"
```

## Jest Configuration Addition
```javascript
// jest.config.js addition for proper coverage
collectCoverageFrom: [
  'src/components/reward-history-bar.tsx',
  '!src/**/*.d.ts',
],
coveragePathIgnorePatterns: [
  '/node_modules/',
  '.*\.stories\..*',
],
```
