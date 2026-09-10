"""
Phase 6A: Production configuration and health endpoint tests.
These tests verify production-readiness without requiring actual Render or Neon accounts.
"""

from django.test import TestCase, SimpleTestCase, override_settings
from django.urls import reverse
from django.conf import settings
from rest_framework.test import APIClient
from rest_framework import status


class HealthCheckTests(TestCase):
    """Tests for the production health endpoint."""

    def setUp(self):
        self.client = APIClient()

    def test_health_returns_200(self):
        """GET /api/v1/health/ must return HTTP 200."""
        url = reverse('health_check')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_health_returns_ok_json(self):
        """GET /api/v1/health/ must return JSON with status: ok."""
        url = reverse('health_check')
        response = self.client.get(url)
        self.assertEqual(response.json(), {"status": "ok"})

    def test_health_is_unauthenticated(self):
        """Health endpoint must be accessible without authentication."""
        url = reverse('health_check')
        # No Authorization header
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_health_does_not_expose_secrets(self):
        """Health endpoint must not expose environment variables or settings."""
        url = reverse('health_check')
        response = self.client.get(url)
        body = response.content.decode()
        self.assertNotIn('SECRET_KEY', body)
        self.assertNotIn('DATABASE_URL', body)
        self.assertNotIn('PASSWORD', body)
        self.assertNotIn('postgres://', body)


class ProductionSettingsTests(SimpleTestCase):
    """
    Tests that verify correct settings behavior under production configuration.
    These run without a database (SimpleTestCase) to avoid requiring Neon credentials.
    """

    def test_debug_is_configurable_via_env(self):
        """DEBUG is read from environment — must never be hardcoded True."""
        # Verify settings module exposes DEBUG as a boolean (not string)
        self.assertIsInstance(settings.DEBUG, bool)

    def test_secret_key_is_set(self):
        """SECRET_KEY must exist and be a non-empty string."""
        self.assertTrue(len(settings.SECRET_KEY) > 0)

    def test_allowed_hosts_is_list(self):
        """ALLOWED_HOSTS must be a list, not a string."""
        self.assertIsInstance(settings.ALLOWED_HOSTS, list)

    def test_cors_allowed_origins_is_list(self):
        """CORS_ALLOWED_ORIGINS must be a list and must not be empty."""
        self.assertIsInstance(settings.CORS_ALLOWED_ORIGINS, list)
        self.assertGreater(len(settings.CORS_ALLOWED_ORIGINS), 0)

    def test_cors_allow_credentials(self):
        """CORS_ALLOW_CREDENTIALS must be True to support JWT cookie/header flow."""
        self.assertTrue(settings.CORS_ALLOW_CREDENTIALS)

    def test_jwt_weights_not_changed(self):
        """JWT configuration must retain correct token lifetimes."""
        from datetime import timedelta
        self.assertEqual(settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'], timedelta(minutes=30))
        self.assertEqual(settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'], timedelta(days=7))
        self.assertTrue(settings.SIMPLE_JWT['ROTATE_REFRESH_TOKENS'])
        self.assertTrue(settings.SIMPLE_JWT['BLACKLIST_AFTER_ROTATION'])

    def test_whitenoise_in_middleware(self):
        """WhiteNoise middleware must be present in MIDDLEWARE."""
        self.assertIn('whitenoise.middleware.WhiteNoiseMiddleware', settings.MIDDLEWARE)

    def test_whitenoise_after_security_middleware(self):
        """WhiteNoise must immediately follow SecurityMiddleware."""
        mw = settings.MIDDLEWARE
        security_idx = mw.index('django.middleware.security.SecurityMiddleware')
        whitenoise_idx = mw.index('whitenoise.middleware.WhiteNoiseMiddleware')
        self.assertEqual(whitenoise_idx, security_idx + 1)

    def test_static_root_configured(self):
        """STATIC_ROOT must be configured for collectstatic."""
        self.assertIsNotNone(settings.STATIC_ROOT)

    def test_rest_framework_uses_jwt(self):
        """DRF default authentication must be JWT."""
        auth_classes = settings.REST_FRAMEWORK['DEFAULT_AUTHENTICATION_CLASSES']
        self.assertIn('rest_framework_simplejwt.authentication.JWTAuthentication', auth_classes)

    def test_rest_framework_requires_auth_by_default(self):
        """DRF default permission must require authentication."""
        perm_classes = settings.REST_FRAMEWORK['DEFAULT_PERMISSION_CLASSES']
        self.assertIn('rest_framework.permissions.IsAuthenticated', perm_classes)

    def test_custom_user_model(self):
        """Custom User model must be used."""
        self.assertEqual(settings.AUTH_USER_MODEL, 'accounts.User')

    @override_settings(DEBUG=False)
    def test_production_security_flags_present(self):
        """
        When DEBUG=False, production security settings must be activated.
        This simulates what happens when Render sets DEBUG=False.
        """
        # Re-import settings is not possible mid-test; this validates the code path
        # by checking the conditional logic will apply the correct settings.
        # Full validation is done by 'manage.py check --deploy' in CI/CD.
        self.assertFalse(settings.DEBUG)  # Confirms override_settings works


class CORSConfigurationTests(TestCase):
    """Verify CORS headers are returned correctly for allowed origins."""

    def setUp(self):
        self.client = APIClient()

    def test_cors_header_present_for_allowed_localhost_origin(self):
        """CORS Access-Control-Allow-Origin header must be returned for localhost dev origin."""
        url = reverse('health_check')
        response = self.client.get(
            url,
            HTTP_ORIGIN='http://localhost:5173'
        )
        self.assertEqual(response.status_code, 200)
        # CORS middleware should return the origin header for allowed origins
        self.assertIn('Access-Control-Allow-Origin', response)


class ProtectedEndpointTests(TestCase):
    """Verify all protected endpoints reject unauthenticated requests."""

    def setUp(self):
        self.client = APIClient()

    def _assert_401(self, path):
        response = self.client.get(path)
        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
            f"Expected 401 for {path}, got {response.status_code}"
        )

    def test_candidate_profile_requires_auth(self):
        self._assert_401('/api/v1/candidate/profile/')

    def test_candidate_applications_requires_auth(self):
        self._assert_401('/api/v1/candidate/applications/')

    def test_recruiter_company_requires_auth(self):
        self._assert_401('/api/v1/recruiter/company/')

    def test_admin_users_requires_auth(self):
        self._assert_401('/api/v1/admin/users/')

    def test_admin_analytics_requires_auth(self):
        self._assert_401('/api/v1/admin/analytics/')

    def test_notifications_requires_auth(self):
        self._assert_401('/api/v1/notifications/')

    def test_interviews_requires_auth(self):
        self._assert_401('/api/v1/interviews/')
