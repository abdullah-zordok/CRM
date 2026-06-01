# Frontend Shell E2E Notes

Protected workspace tests use `CRM_E2E_AUTH_BYPASS=true` from Playwright's web
server configuration plus a per-test `crm_e2e_auth=1` cookie. Without the cookie,
protected routes still fail closed and redirect to sign-in.
