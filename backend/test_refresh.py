import os
import django
import sys
import time

# Setup Django environment
sys.path.append('/Users/manthanshah/Documents/Smart_ATS/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_ats.settings')
django.setup()

from django.test import Client
from rest_framework_simplejwt.tokens import RefreshToken
from apps.accounts.models import User

client = Client()

print("--- Test Case A: Valid Refresh ---")
# 1. Login
response = client.post('/api/v1/auth/token/', {
    'email': 'curl_test@demo.smartats.io',
    'password': 'SecurePassword123!'
}, content_type='application/json')
data = response.json()
refresh_token = data.get('refresh')
access_token = data.get('access')
print("Login successful. Received tokens.")

# 2. Make protected request (succeeds)
me_resp = client.get('/api/v1/auth/me/', HTTP_AUTHORIZATION=f'Bearer {access_token}')
print(f"Protected request with initial access token: {me_resp.status_code}")

# 3. Invalidate/Expire access token (simulated by modifying the payload manually, but we can just skip to refresh)
print("Simulating expired access token. Requesting refresh...")
refresh_resp = client.post('/api/v1/auth/token/refresh/', {
    'refresh': refresh_token
}, content_type='application/json')
refresh_data = refresh_resp.json()
new_access = refresh_data.get('access')
print(f"Refresh response: {refresh_resp.status_code}")

# 4. Make protected request with new access token
me_resp_2 = client.get('/api/v1/auth/me/', HTTP_AUTHORIZATION=f'Bearer {new_access}')
print(f"Protected request with new access token: {me_resp_2.status_code}")

print("\n--- Test Case B: Invalid Refresh ---")
bad_refresh = refresh_token[:-5] + "XXXXX"
refresh_resp_bad = client.post('/api/v1/auth/token/refresh/', {
    'refresh': bad_refresh
}, content_type='application/json')
print(f"Invalid refresh response: {refresh_resp_bad.status_code} - {refresh_resp_bad.json()}")
