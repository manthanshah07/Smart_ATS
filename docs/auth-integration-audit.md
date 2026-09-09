# SmartATS Authentication Integration Audit

## 1. Current Backend Auth Implementation
The backend uses a custom Django User model (`accounts.User`) with email-based authentication and explicit roles (`CANDIDATE`, `RECRUITER`, `ADMIN`). It utilizes `rest_framework_simplejwt` for JWT management. Endpoints are already implemented for:
- Login: `POST /api/v1/auth/token/`
- Refresh: `POST /api/v1/auth/token/refresh/`
- Current User: `GET /api/v1/auth/me/`
- Logout: `POST /api/v1/auth/logout/`
- Registration: `POST /api/v1/auth/register/`

## 2. Current Frontend Auth Implementation
The frontend uses `AuthContext.jsx` which currently defaults to a mock user (`MOCK_USERS.candidate`) if no user is found in `localStorage`. The `login` function attempts a real API call but falls back to a mock persona switcher if it fails. The `ProtectedRoute.jsx` currently checks for `isAuthenticated` but relies heavily on the mock state.

## 3. JWT Configuration
The backend is configured to issue an access token (30-minute lifetime) and a refresh token (7-day lifetime). Token blacklisting is enabled for logout and rotation.

## 4. Token Storage Strategy
**Current:** `api.js` stores both `smartats_access_token` and `smartats_refresh_token` in `localStorage`.
**Evaluation:** Storing long-lived refresh tokens in `localStorage` exposes them to Cross-Site Scripting (XSS) attacks. A more secure approach is storing the refresh token in an `HttpOnly` cookie and the access token in memory. However, modifying the backend to support `HttpOnly` cookies requires overriding standard SimpleJWT views and dealing with CSRF. Since the API contract currently expects the refresh token in the JSON body, we will maintain the `localStorage` strategy for this phase but thoroughly document the XSS risks and mitigations (like React's built-in XSS protection and short access token lifetimes) in `docs/auth-security.md`.

## 5. Refresh Strategy
The frontend `api.js` includes an Axios response interceptor that catches `401 Unauthorized` errors, pauses incoming requests using a queue, attempts a refresh using the stored refresh token, and replays the failed requests with the new access token. If the refresh fails, it clears storage and throws an error (which should log the user out).

## 6. Protected Route Strategy
`ProtectedRoute.jsx` currently checks `isAuthenticated` and `user.role`. It correctly redirects unauthenticated users to `/login` and role-mismatched users to their respective dashboards.

## 7. Role Handling
Roles are defined as `CANDIDATE`, `RECRUITER`, and `ADMIN`. The backend dictates this in the JWT payload and `/auth/me/` response. The frontend uses `isCandidate`, `isRecruiter`, and `isAdmin` flags in `AuthContext` to control UI rendering and route access.

## 8. API Mismatch
There is no significant API mismatch. The backend `CustomTokenObtainPairSerializer` returns `access`, `refresh`, and a `user` object, which perfectly matches what `AuthContext.jsx` expects. The `/auth/me/` endpoint also returns the expected profile data.

## 9. Security Risks
- **XSS Vulnerability**: Tokens in `localStorage` can be stolen if the frontend suffers an XSS attack.
- **Demo Mode Leakage**: If `VITE_DEMO_MODE` is not strictly gated, users might bypass real auth logic.

## 10. Exact Implementation Plan
1. **Security Documentation**: Create `docs/auth-security.md` detailing the token strategy.
2. **Environment Configuration**: Ensure `VITE_API_BASE_URL` and `VITE_DEMO_MODE` are handled explicitly in `.env.example`.
3. **Frontend API Client**: No major changes needed in `api.js` interceptors as they are already set up correctly, but ensure `clearAuthStorage` properly signals `AuthContext`.
4. **AuthContext Refactor**: Update `AuthContext.jsx` to strictly branch logic based on `import.meta.env.VITE_DEMO_MODE`. If real mode, enforce strict API-only login, registration, and `/auth/me/` fetching. Remove silent fallbacks to mock data.
5. **Login/Register Pages**: Update UI to handle loading states and display real error messages returned by the backend (e.g., 401s, deactivated accounts).
6. **Logout**: Ensure the `logout` function calls the backend blacklisting endpoint and clears `AuthContext` state.
7. **Testing**: Perform local manual tests (Register, Login, Role Routing, Logout, Session Expiration) and run backend unit tests (which already exist and pass).
