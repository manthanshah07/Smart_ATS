import os
import django
import sys

sys.path.append('/Users/manthanshah/Documents/Smart_ATS/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_ats.settings')
django.setup()

from django.test import Client
from django.conf import settings
settings.ALLOWED_HOSTS.append('testserver')
from apps.accounts.models import User, Candidate, Recruiter
from apps.companies.models import Company
from apps.jobs.models import Job
from apps.applications.models import Application, ApplicationStatusHistory

client = Client()

print("--- SmartATS End-to-End API Verification ---")

# Setup Mock Users for the test
print("\n[+] Setting up test users")
candidate_email = 'e2e_candidate@demo.smartats.io'
recruiter_email = 'e2e_recruiter@demo.smartats.io'
password = 'SecurePassword123!'

cand_user, _ = User.objects.get_or_create(email=candidate_email, defaults={'role': 'CANDIDATE', 'first_name': 'E2E', 'last_name': 'Cand'})
cand_user.set_password(password)
cand_user.save()
Candidate.objects.get_or_create(user=cand_user)

rec_user, _ = User.objects.get_or_create(email=recruiter_email, defaults={'role': 'RECRUITER', 'first_name': 'E2E', 'last_name': 'Recruiter'})
rec_user.set_password(password)
rec_user.save()
company, _ = Company.objects.get_or_create(name='E2E Corp')
Recruiter.objects.get_or_create(user=rec_user, company=company)

# 1. Recruiter Logins & Posts a Job
print("\n[+] Recruiter logs in")
resp = client.post('/api/v1/auth/token/', {'email': recruiter_email, 'password': password}, content_type='application/json')
rec_access = resp.json()['access']

print("\n[+] Recruiter creates and publishes a Job")
job_data = {
    "title": "E2E Backend Developer",
    "description": "Must know Django and React.",
    "location": "Remote",
    "job_type": "FULL_TIME",
    "experience_level": "MID_LEVEL",
    "status": "OPEN",
    "required_skills": ["Python", "Django", "React"]
}
job_resp = client.post('/api/v1/jobs/', job_data, content_type='application/json', HTTP_AUTHORIZATION=f'Bearer {rec_access}')
print(f"Create Job Status: {job_resp.status_code}")
job_id = job_resp.json()['id']

# 2. Candidate Logins & Searches Job
print("\n[+] Candidate logs in")
resp = client.post('/api/v1/auth/token/', {'email': candidate_email, 'password': password}, content_type='application/json')
cand_access = resp.json()['access']

print("\n[+] Candidate searches for the Job")
search_resp = client.get('/api/v1/jobs/?search=E2E Backend', HTTP_AUTHORIZATION=f'Bearer {cand_access}')
search_results = search_resp.json().get('results', search_resp.json())
print(f"Search Results Count: {len(search_results)}")
assert any(j['id'] == job_id for j in search_results), "Job not found in search results"

# 3. Candidate Applies
print("\n[+] Candidate applies for the Job")
app_resp = client.post('/api/v1/applications/', {'job': job_id}, content_type='application/json', HTTP_AUTHORIZATION=f'Bearer {cand_access}')
print(f"Application Status: {app_resp.status_code}")
app_id = app_resp.json()['id']

# 4. Recruiter Views Application
print("\n[+] Recruiter views applicants")
rec_apps_resp = client.get(f'/api/v1/jobs/{job_id}/applicants/', HTTP_AUTHORIZATION=f'Bearer {rec_access}')
rec_apps_results = rec_apps_resp.json().get('results', rec_apps_resp.json())
print(f"Applicants found by Recruiter: {len(rec_apps_results)}")
assert any(a['id'] == app_id for a in rec_apps_results), "Application not found for recruiter"

# 5. Database Verification
print("\n[+] Verifying Database Records directly")
assert Job.objects.filter(id=job_id).exists()
assert Application.objects.filter(id=app_id).exists()
history_count = ApplicationStatusHistory.objects.filter(application_id=app_id).count()
print(f"ApplicationStatusHistory Count: {history_count}")
assert history_count >= 1, "History record missing"

print("\nE2E Workflow API Verification SUCCESS!")
