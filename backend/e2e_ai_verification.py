import os
import django
import sys
import time
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
from apps.applications.models import Application, AIAnalysis

client = Client()

print("========================================")
print(" SMARTATS PHASE 5 - AI ENGINE INTEGRATION")
print("========================================\n")

# --- 1. SETUP USERS & ENTITIES ---
print("[1] Provisioning test entities...")
cand_email = 'ai_cand@test.com'
rec_email = 'ai_rec@test.com'
password = 'Password123!'

Job.objects.all().delete()
Company.objects.all().delete()
User.objects.all().delete()
Application.objects.all().delete()

# Candidate
user_c = User.objects.create_user(email=cand_email, password=password, role='CANDIDATE', first_name='AI', last_name='Cand')
Candidate.objects.create(user=user_c)

# Recruiter + Company
comp = Company.objects.create(name='AI Corp')
user_r = User.objects.create_user(email=rec_email, password=password, role='RECRUITER', first_name='AI', last_name='Rec')
Recruiter.objects.create(user=user_r, company=comp)

def get_token(email):
    resp = client.post('/api/v1/auth/token/', {'email': email, 'password': password}, content_type='application/json')
    return resp.json()['access']

token_c = get_token(cand_email)
token_r = get_token(rec_email)

print("  -> Users provisioned.")

# --- 2. RECRUITER POSTS JOB ---
print("\n[2] Recruiter posts Job with required skills...")
job_data = {
    "title": "Senior Python Backend Engineer",
    "description": "We need a strong backend engineer capable of building REST APIs, managing databases, and orchestrating containers.",
    "job_type": "FULL_TIME",
    "status": "OPEN",
    "location": "Remote",
    "experience_min_years": 4,
    "required_skills": ["Python", "Django", "PostgreSQL", "Docker", "REST API", "Kubernetes"]
}
resp = client.post('/api/v1/jobs/', job_data, content_type='application/json', HTTP_AUTHORIZATION=f'Bearer {token_r}')
job_id = resp.json()['id']

# --- 3. CANDIDATE UPLOADS RESUME ---
print("\n[3] Candidate uploads resume (simulated PDF payload)...")

# We create a dummy PDF file (we'll just use a DOCX which is easier to spoof, or we can use raw text if we bypass file validation, but the system expects real PDF/DOCX bytes. Let's just create a valid DOCX using python-docx directly into BytesIO).
import docx
doc = docx.Document()
doc.add_paragraph("AI Cand - Backend Developer")
doc.add_paragraph("Education: B.Tech in Computer Science")
doc.add_paragraph("Experience: 5 years of experience building web applications.")
doc.add_paragraph("Skills: Python, Django, REST API, Postgres, MySQL, React, JavaScript, Node.js, AWS, Docker.")

f = BytesIO()
doc.save(f)
f.seek(0)
docx_file = SimpleUploadedFile("resume.docx", f.read(), content_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document")

t0 = time.time()
resp = client.post('/api/v1/candidate/resume/', {'resume': docx_file}, HTTP_AUTHORIZATION=f'Bearer {token_c}')
t1 = time.time()

assert resp.status_code == 200
print(f"  -> Upload + Parsing Time: {t1 - t0:.3f} seconds")
cand_data = resp.json()
print("  -> Parsed Skills:", cand_data['parsed_skills'])
print("  -> Parsed Education:", cand_data['parsed_education'])
print("  -> Parsed Experience:", cand_data['parsed_experience'])

# --- 4. CANDIDATE APPLIES (TRIGGERS AI ENGINE) ---
print("\n[4] Candidate applies to Job (Triggering AI Engine)...")
t2 = time.time()
resp = client.post('/api/v1/applications/', {'job': job_id}, content_type='application/json', HTTP_AUTHORIZATION=f'Bearer {token_c}')
t3 = time.time()

assert resp.status_code == 201
print(f"  -> Application + AI Evaluation Time: {t3 - t2:.3f} seconds")
app_id = resp.json()['id']

# --- 5. RECRUITER VIEWS APPLICANTS ---
print("\n[5] Recruiter views applicant analysis...")
resp = client.get(f'/api/v1/jobs/{job_id}/applicants/', HTTP_AUTHORIZATION=f'Bearer {token_r}')
assert resp.status_code == 200
apps = resp.json().get('results', resp.json())
ai_data = apps[0].get('ai_analysis')

assert ai_data is not None, "AI Analysis missing from response"
print("\n--- AI Analysis Result ---")
print(f"Overall Score:        {ai_data['overall_match_score']}%")
print(f"Semantic Similarity:  {ai_data['semantic_similarity_score']}%")
print(f"Skill Match:          {ai_data['skill_match_score']}%")
print(f"Experience Match:     {ai_data['experience_match_score']}%")
print(f"Matched Skills:       {ai_data['matched_skills']}")
print(f"Missing Skills:       {ai_data['missing_skills']}")
print(f"Experience Summary:   {ai_data['experience_match_summary']}")

print("\n========================================")
print(" VERIFICATION COMPLETE. ALL TESTS PASSED.")
print("========================================")
