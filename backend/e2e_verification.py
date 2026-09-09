import os
import django
import sys
from io import BytesIO
from django.core.files.uploadedfile import SimpleUploadedFile

sys.path.append('/Users/manthanshah/Documents/Smart_ATS/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_ats.settings')
django.setup()

from django.test import Client
from django.conf import settings
if 'testserver' not in settings.ALLOWED_HOSTS:
    settings.ALLOWED_HOSTS.append('testserver')

from apps.accounts.models import User, Candidate, Recruiter
from apps.companies.models import Company
from apps.jobs.models import Job
from apps.applications.models import Application, ApplicationStatusHistory

client = Client()

print("========================================")
print(" SMARTATS PHASE 4 - RIGOROUS VERIFICATION")
print("========================================\n")

# --- 1. SETUP USERS & ENTITIES ---
print("[1] Provisioning test entities...")
cand_a_email = 'cand_a@test.com'
cand_b_email = 'cand_b@test.com'
rec_a_email = 'rec_a@test.com'
rec_b_email = 'rec_b@test.com'
password = 'Password123!'

Job.objects.all().delete()
Company.objects.all().delete()
User.objects.all().delete()
Application.objects.all().delete()

# Candidate A & B
user_ca = User.objects.create_user(email=cand_a_email, password=password, role='CANDIDATE', first_name='Cand', last_name='A')
Candidate.objects.create(user=user_ca)
user_cb = User.objects.create_user(email=cand_b_email, password=password, role='CANDIDATE', first_name='Cand', last_name='B')
Candidate.objects.create(user=user_cb)

# Recruiter A & B + Companies
comp_a = Company.objects.create(name='Company A')
comp_b = Company.objects.create(name='Company B')

user_ra = User.objects.create_user(email=rec_a_email, password=password, role='RECRUITER', first_name='Rec', last_name='A')
Recruiter.objects.create(user=user_ra, company=comp_a)
user_rb = User.objects.create_user(email=rec_b_email, password=password, role='RECRUITER', first_name='Rec', last_name='B')
Recruiter.objects.create(user=user_rb, company=comp_b)

def get_token(email):
    resp = client.post('/api/v1/auth/token/', {'email': email, 'password': password}, content_type='application/json')
    return resp.json()['access']

token_ca = get_token(cand_a_email)
token_cb = get_token(cand_b_email)
token_ra = get_token(rec_a_email)
token_rb = get_token(rec_b_email)

print("  -> Users and companies provisioned.")

# --- 2. RESUME UPLOAD (Candidate Workflow) ---
print("\n[2] Testing Candidate Resume Upload...")
pdf_file = SimpleUploadedFile("resume.pdf", b"file_content", content_type="application/pdf")
docx_file = SimpleUploadedFile("resume.docx", b"file_content", content_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document")
invalid_file = SimpleUploadedFile("script.js", b"console.log('hack')", content_type="application/javascript")

resp = client.post('/api/v1/candidate/resume/', {'resume': invalid_file}, HTTP_AUTHORIZATION=f'Bearer {token_ca}')
assert resp.status_code == 400, f"Expected 400 for invalid file, got {resp.status_code}"

resp = client.post('/api/v1/candidate/resume/', {'resume': pdf_file}, HTTP_AUTHORIZATION=f'Bearer {token_ca}')
assert resp.status_code == 200, f"Expected 200 for PDF, got {resp.status_code}"
assert 'resume_file' in resp.json(), "Missing resume metadata in response"

resp = client.post('/api/v1/candidate/resume/', {'resume': docx_file}, HTTP_AUTHORIZATION=f'Bearer {token_ca}')
assert resp.status_code == 200, f"Expected 200 for DOCX, got {resp.status_code}"
print("  -> Resume upload and validation logic verified.")

# --- 3. RECRUITER JOB LIFECYCLE ---
print("\n[3] Testing Job Lifecycle...")
job_data = {"title": "Rec A Job", "description": "Desc", "job_type": "FULL_TIME", "status": "DRAFT", "location": "Remote", "experience_level": "ENTRY_LEVEL"}
resp = client.post('/api/v1/jobs/', job_data, content_type='application/json', HTTP_AUTHORIZATION=f'Bearer {token_ra}')
if resp.status_code != 201:
    print("Job Creation Failed:", resp.json())
job_a_id = resp.json()['id']

# Candidate trying to see draft job
resp = client.get('/api/v1/jobs/', HTTP_AUTHORIZATION=f'Bearer {token_ca}')
jobs = resp.json().get('results', resp.json())
assert not any(j['id'] == job_a_id for j in jobs), "Candidate should not see DRAFT jobs"

# Recruiter A publishes job
client.patch(f'/api/v1/jobs/{job_a_id}/', {'status': 'OPEN'}, content_type='application/json', HTTP_AUTHORIZATION=f'Bearer {token_ra}')

# Candidate now sees OPEN job
resp = client.get('/api/v1/jobs/', HTTP_AUTHORIZATION=f'Bearer {token_ca}')
jobs = resp.json().get('results', resp.json())
assert any(j['id'] == job_a_id for j in jobs), "Candidate should see OPEN jobs"

# Recruiter B tries to update Recruiter A's job
resp = client.patch(f'/api/v1/jobs/{job_a_id}/', {'title': 'Hacked'}, content_type='application/json', HTTP_AUTHORIZATION=f'Bearer {token_rb}')
assert resp.status_code in [403, 404], f"Recruiter B should not be able to modify Rec A job. Got {resp.status_code}"

print("  -> Job lifecycle and recruiter isolation verified.")

# --- 4. APPLICATION WORKFLOW ---
print("\n[4] Testing Application Workflow...")
# Candidate A applies
resp = client.post('/api/v1/applications/', {'job': job_a_id}, content_type='application/json', HTTP_AUTHORIZATION=f'Bearer {token_ca}')
assert resp.status_code == 201, "Candidate A should be able to apply"
app_id = resp.json()['id']

# Candidate A applies again (Duplicate)
resp = client.post('/api/v1/applications/', {'job': job_a_id}, content_type='application/json', HTTP_AUTHORIZATION=f'Bearer {token_ca}')
assert resp.status_code == 400, f"Expected duplicate application block, got {resp.status_code}"

# Recruiter A closes job
client.patch(f'/api/v1/jobs/{job_a_id}/', {'status': 'CLOSED'}, content_type='application/json', HTTP_AUTHORIZATION=f'Bearer {token_ra}')

# Candidate B applies to closed job
resp = client.post('/api/v1/applications/', {'job': job_a_id}, content_type='application/json', HTTP_AUTHORIZATION=f'Bearer {token_cb}')
assert resp.status_code == 400, "Cannot apply to closed jobs"
print("  -> Applications constraints and duplicate protections verified.")

# --- 5. AUTHORIZATION RULES ---
print("\n[5] Testing Aggressive Authorization Rules...")

# Candidate A accesses Candidate B's profile
# The endpoint is singular `/api/v1/candidate/profile/` and retrieves `request.user` so it's impossible to access others,
# but we can try other cross-access vectors.

# Candidate tries to view applicant list
resp = client.get(f'/api/v1/jobs/{job_a_id}/applicants/', HTTP_AUTHORIZATION=f'Bearer {token_ca}')
assert resp.status_code in [403], f"Candidate should not see applicant list, got {resp.status_code}"

# Recruiter B tries to view Recruiter A's applicants
resp = client.get(f'/api/v1/jobs/{job_a_id}/applicants/', HTTP_AUTHORIZATION=f'Bearer {token_rb}')
assert resp.status_code in [403, 404], "Recruiter B cannot see Recruiter A's applicants"

# Candidate A tries to withdraw Application (valid)
resp = client.patch(f'/api/v1/candidate/applications/{app_id}/withdraw/', HTTP_AUTHORIZATION=f'Bearer {token_ca}')
assert resp.status_code == 200, "Candidate A should be able to withdraw"

# Candidate B tries to withdraw Candidate A's application
resp = client.patch(f'/api/v1/candidate/applications/{app_id}/withdraw/', HTTP_AUTHORIZATION=f'Bearer {token_cb}')
assert resp.status_code in [403, 404], "Candidate B cannot withdraw Candidate A's app"

# Candidate tries recruiter status mutation endpoint
resp = client.patch(f'/api/v1/applications/{app_id}/status/', {'status': 'HIRED'}, content_type='application/json', HTTP_AUTHORIZATION=f'Bearer {token_ca}')
assert resp.status_code in [403], "Candidate cannot arbitrarily mutate application status via recruiter endpoint"

print("  -> Deep authorization limits strictly enforced.")

# --- 6. DB INTEGRITY ---
print("\n[6] Testing Database Integrity...")
db_app = Application.objects.get(id=app_id)
assert db_app.status == 'WITHDRAWN', "DB status should be WITHDRAWN"
history_count = ApplicationStatusHistory.objects.filter(application_id=app_id).count()
# Should be 2 (APPLIED -> WITHDRAWN)
assert history_count == 2, f"Expected 2 history states, got {history_count}"
print("  -> DB Constraints, State machines, and history validated.")

print("\n========================================")
print(" VERIFICATION COMPLETE. ALL TESTS PASSED.")
print("========================================")
