# SmartATS Frontend Deployment

## Deployment Target
Vercel.

## Build Configuration
- **Framework**: React + Vite
- **Build Command**: `npm run build` (or `vite build`)
- **Output Directory**: `dist`

## Environment Variables
The following environment variables are required in production:
- `VITE_API_BASE_URL`: The URL for the backend API. Since the backend does not exist yet, this is currently falling back to mock services, but should be set appropriately (e.g. `https://api.smartats.io/api/v1`) once the backend is deployed.
- `VITE_DEMO_MODE`: Set to `true` to enable the UI prototype persona testing bar and mock logic handling. This must remain `true` until the real Django backend is connected.

*Note: No secrets should be exposed in frontend environment variables.*

## SPA Routing
SmartATS uses client-side routing via React Router. A `vercel.json` file has been added to the frontend root to rewrite all requests to `index.html`. This ensures that nested routes (like `/candidate/dashboard` or `/recruiter/applicants`) do not result in a 404 error when refreshed directly in the browser.

## Demo Mode
Because the Django backend and PostgreSQL database do not exist yet, the application operates through an existing mock service architecture.
- Authentication uses a persona switcher (Candidate, Recruiter, Admin) leveraging `localStorage`.
- All data for applications, jobs, interviews, and candidates is served from static files in `src/mock/`.
- AI Processing and match scores are simulated via static mock responses.
- To keep the mock logic active, `VITE_DEMO_MODE=true` is used.

## Production URL
*Deployment currently blocked pending manual authentication.*

## Verification
*Pending successful deployment.*

## Known Limitations
- The **backend is not connected**.
- The **database is not connected**.
- **Authentication** is still a mock/demo persona switcher.
- **AI processing** is still a static mock.
- The current deployment represents a production-ready *frontend prototype*, not the finished SmartATS product.
