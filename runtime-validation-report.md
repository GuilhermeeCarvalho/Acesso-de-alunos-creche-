# Runtime Validation Report

**Generated**: 2026-10-18T12:53:06-03:00  
**Target**: `C:\Users\sandr\Documents\Acesso-de-alunos-creche-`

## Summary

| Step | Status | Exit Code | Details |
|------|--------|-----------|---------|
| Frontend lint | PASS | 0 | `npm run lint`; no lint errors |
| Frontend tests | PASS | 0 | `npm test`; 9 passed, 0 failed |
| Frontend build | PASS | 0 | `npm run build`; production bundle generated |
| Backend tests | PASS | 0 | Clean Maven test with isolated H2; 25 passed, 0 failed, 0 skipped |
| Production container build | PASS | 0 | Docker Compose rebuilt the frontend and backend images successfully |
| Compose startup and health | PASS | 0 | Isolated PostgreSQL, backend, and frontend started; `/actuator/health` reported `UP` through Nginx |
| API smoke checks | PASS | 0 | Frontend returned 200; unauthenticated `/funcionarios` was denied (403); test admin login returned a JWT; authenticated `/funcionarios` returned 200 |
| CORS preflight | PASS | 0 | Configured test origin received `Access-Control-Allow-Origin` |
| Browser check | PARTIAL | n/a | Invalid login was rejected; valid admin login reached the home page, opened the employee list, and logged out; CRUD journeys were not exercised |

**Overall**: NEEDS_SIGNOFF — automated builds, tests, and isolated deployment smoke checks passed, but production secrets/domain/HTTPS must be configured and verified. Full CRUD browser journeys remain open.

## Environment

- Docker daemon: available; final isolated Compose stack was healthy and was removed with its test volume after validation.
- Node.js: `v24.14.1`.
- Playwright CLI: `1.64.1`; Chromium installation completed. No Playwright test suite was added or run.
- Backend test database: final full suite used isolated in-memory H2. The Compose smoke test used a newly created PostgreSQL volume and was removed afterward.
- Deployment smoke credentials and secrets were disposable validation-only values and must not be reused.

## Issues Found / Go-live Checklist

| # | Severity | Description |
|---|----------|-------------|
| 1 | HIGH | Set `POSTGRES_PASSWORD`, `ADMIN_FIXED_PASSWORD`, `JWT_SECRET`, and the Supabase settings in the deployment secret store. The fixed password is reapplied only to `admin@creche.com`; other administrator accounts retain their own passwords. Never reuse the disposable test values. |
| 2 | HIGH | Compose binds the frontend to `127.0.0.1`; configure the hosting platform or a reverse proxy with HTTPS before making the service internet-accessible. Set `APP_CORS_ALLOWED_ORIGINS` to the real production origin. |
| 3 | MEDIUM | Full create/read/update/delete flows for children, employees, and documents were not exercised against the release stack. Validate those flows in staging using disposable data before customer handoff. |

## Notes

- The Java 25 test attempt failed during test discovery with `ClassFormatError`; a clean run with Java 21, matching the container runtime, passed all 23 backend tests.
- The backend test context is now pinned to an isolated H2 database and test-only secrets so ordinary local test runs cannot connect to the default PostgreSQL database.
- JWT tokens now expire after 8 hours. A backend test verifies the `exp`/`iat` interval and rejects expired tokens; the release smoke check confirmed a lifetime of 28,800 seconds.
- The frontend build reports a minified JavaScript chunk larger than 500 kB. This is a performance optimization opportunity, not a build failure.
- The final temporary Compose project (`releasecheck-20261018`) and its PostgreSQL test volume were removed after the health, proxy, login, authorization, and CORS checks.
- The repository's existing `.env` was not modified.
- An earlier unisolated Maven startup connected to the local PostgreSQL database because the test context inherited the production datasource defaults. `DataLoader` reset only `admin@creche.com` to the disposable test password; I restored its original fixed password from the pre-change loader and changed the test context to use H2. Hibernate had `ddl-auto=update` during that startup, so schema reconciliation may also have occurred. No other user data was intentionally modified, and the final full test run used H2.

## Verdict

```text
environment:
  docker: AVAILABLE — Compose rebuilt and ran the isolated stack; test volume removed afterward
  node: AVAILABLE — v24.14.1
  playwright: AVAILABLE — CLI 1.64.1 and Chromium installation succeeded
  infra-tier: PRIMARY(Docker-based) — isolated PostgreSQL Compose stack
  browser-tier: PARTIAL(Playwright) — invalid login, valid admin login, employee-list navigation, and logout checked; CRUD not covered
startup: PASS — Docker Compose startup; readiness signal `/actuator/health` returned UP
integration: PASS — exit_code: 0; 25 backend tests passed; isolated health, auth, protected API, and CORS smoke checks passed
e2e: PARTIAL — exit_code: n/a; invalid/valid login, employee-list access, and logout checked; full CRUD flows remain unverified
overall: NEEDS_SIGNOFF — production secrets, HTTPS/CORS domain, and CRUD coverage need resolution
```
