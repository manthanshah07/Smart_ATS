# SmartATS Authentication Integration Report

## 1. Initial Auth Audit
Before this phase, the frontend relied heavily on a mock authentication system. `AuthContext.jsx` defaulted to a simulated user if a token was not present and bypassed the backend upon API failures using `MOCK_USERS`. The backend, however, was already structured with `rest_framework_simplejwt`, a custom User model, and endpoints mirroring the frontend contract. The token storage strategy employed `localStorage` for both access and refresh tokens.

## 2. Backend Authentication Implementation
The backend utilizes Django REST Framework with `SimpleJWT`.
- **Endpoints**: `/api/v1/auth/token/` (Login), `/api/v1/auth/token/refresh/` (Refresh), `/api/v1/auth/logout/` (Logout & Blacklist), `/api/v1/auth/me/` (Profile), `/api/v1/auth/register/` (Registration).
- **Serializers**: Standardized around a custom `TokenObtainPairSerializer` which embeds basic profile details (`id`, `email`, `role`, `first_name`, `last_name`) into the token payload and validates user active status.
- **Permissions**: Core RBAC using `IsAuthenticated`, `IsCandidate`, `IsRecruiter`, and `IsAdmin`.

## 3. JWT Configuration
- **Access Token**: 30-minute expiry.
- **Refresh Token**: 7-day expiry, blacklisted after rotation and upon logout.
- **Header Structure**: `Authorization: Bearer <token>`

## 4. Token Strategy
As formally established in the API contract, JWTs (`smartats_access_token`, `smartats_refresh_token`) are stored in `localStorage`. To mitigate XSS vulnerabilities associated with this choice, we lean on React's automatic escaping, short access token lifetimes (30 minutes), and explicit token blacklisting on the server side upon logout. Further enhancements to use `HttpOnly` cookies were evaluated but deferred to respect the strict JSON body API contract required for this phase. Extensive documentation of these trade-offs is saved in `docs/auth-security.md`.

## 5. Frontend Integration
### AuthContext Changes
Refactored `AuthContext.jsx` to completely disable the mock persona system unless `VITE_DEMO_MODE=true` is explicitly defined in `.env`.
- Real network exceptions are now correctly thrown to the UI.
- Added a `window.addEventListener('smartats_auth_expired')` block to actively clear the user context when `apiClient` encounters unrecoverable refresh failures.

### API Client Changes
The `api.js` interceptors were updated to dispatch a `smartats_auth_expired` global event upon detecting missing or invalidated refresh tokens. The queueing system for token refresh retry loops remains robust.

### Route Protection
`ProtectedRoute.jsx` strictly enforces authentication states using the updated `AuthContext`. Unauthenticated users are redirected to `/login`, and role mismatches automatically kick users to their designated dashboard.

## 6. CORS / CSRF Configuration
Configured securely via `django-cors-headers` explicitly allowing `localhost` and standard frontend ports (`5173`, `3000`). No `CORS_ALLOW_ALL_ORIGINS` wildcard is used. CSRF is inapplicable here as authentication relies entirely on Bearer tokens instead of session cookies.

## 7. Database Verification
- Validated via Django shell: Registration correctly inserts rows into the `accounts_user` table.
- Passwords are encrypted properly via standard Django PBKDF2 hashing.

## 8. Exact Backend Tests & Results
Command:
```bash
venv/bin/python manage.py test apps.accounts.test_auth apps.applications.test_applications
```
Result:
```text
System check identified no issues (0 silenced).
Creating test database for alias 'default'...
Found 19 test(s).
System check identified no issues (0 silenced).
...................
----------------------------------------------------------------------
Ran 19 tests in 5.096s

OK
Destroying test database for alias 'default'...
```

## 9. Frontend Verification
Tested via curl:
1. `POST /api/v1/auth/register/` → Received `{ "id": 4, "role": "CANDIDATE" ... }`
2. `POST /api/v1/auth/token/` → Received valid JWT access and refresh tokens.
3. `GET /api/v1/auth/me/` → Passed Bearer token, received accurate user profile and candidate profile details.

Tested via `npm run build`: Success (`dist` folder generated, chunk limits documented).

## 10. Production Integration Status
The deployed Vercel frontend was explicitly **not tested** against a deployed backend in this phase, as the backend is not yet deployed (runs exclusively on localhost PostgreSQL via `dj_database_url`). Localhost integration has been entirely verified. Production verification is deferred until the backend deployment phase.

## 11. Files Changed
- `frontend/.env.example`
- `frontend/.env`
- `frontend/src/context/AuthContext.jsx`
- `frontend/src/services/api.js`
- `docs/auth-integration-audit.md` (New)
- `docs/auth-security.md` (New)
- `docs/auth-integration-report.md` (New)

## 12. Remaining Limitations
- A real email provider must be configured (currently using console backend) before users can realistically utilize the "Forgot Password" flow in production.
- Production backend deployment is required to verify the end-to-end flow from Vercel.
