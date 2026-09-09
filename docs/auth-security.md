# SmartATS Authentication Security Strategy

## 1. Token Handling Architecture
SmartATS utilizes JSON Web Tokens (JWT) for authentication via `rest_framework_simplejwt`.
- **Access Tokens** are used for short-lived session authorization (30-minute expiry).
- **Refresh Tokens** are used for renewing access tokens without requiring the user to re-authenticate (7-day expiry).

## 2. Storage Strategy
The current frontend architecture stores both the `access_token` and `refresh_token` in `localStorage` (`smartats_access_token`, `smartats_refresh_token`).

**Risk Analysis:**
Storing tokens in `localStorage` exposes them to Cross-Site Scripting (XSS) attacks. If malicious JavaScript executes in the context of the application, it can read `localStorage` and exfiltrate the refresh token, granting the attacker a 7-day session.

**Mitigation:**
1. **React's XSS Protection**: The React framework automatically escapes content before rendering, significantly reducing the surface area for DOM-based XSS attacks.
2. **Short Access Token Lifetimes**: The access token expires every 30 minutes, ensuring that compromised access tokens cannot be abused indefinitely.
3. **Token Blacklisting**: The backend maintains a blacklist of invalid tokens. Logging out immediately blacklists the refresh token, revoking all access.
4. **Content Security Policy (Future)**: A strict CSP should be implemented in production to prevent execution of inline scripts and unauthorized external script loading.

*Note: While `HttpOnly` cookies provide superior protection against XSS for long-lived credentials, the current API contract requires tokens to be transmitted in the JSON response and request body. Upgrading to an `HttpOnly` cookie strategy is recommended for future production hardening but requires overriding standard Django views and implementing robust CSRF defenses.*

## 3. Refresh Flow
The frontend implements an Axios response interceptor (`src/services/api.js`). When a protected API endpoint returns a `401 Unauthorized` response:
1. The interceptor pauses all incoming API requests (placing them in a queue).
2. It sends a request to `/api/v1/auth/token/refresh/` using the stored refresh token.
3. If successful, the new access token is stored, and the queued requests are replayed with the new token.
4. If the refresh request itself fails (e.g., token expired or blacklisted), the local authentication state is entirely cleared, and a custom event (`smartats_auth_expired`) is dispatched to notify the `AuthContext` to redirect the user to the login page.

## 4. Logout Mechanism
Logout operations explicitly call the backend `POST /api/v1/auth/logout/` endpoint containing the active refresh token. The backend blacklists this token, ensuring it can never be used again to generate access tokens. Following a successful request, the frontend clears `localStorage` and the `AuthContext` state.

## 5. Route Protection
Protected routes are enforced primarily on the backend via object-level and role-level DRF permissions (`IsCandidate`, `IsRecruiter`, `IsAdmin`). The frontend `ProtectedRoute` wrapper component serves solely as a UX mechanism to guide users to appropriate views and prevent flashing of unauthorized content; it does not replace backend authorization checks.
