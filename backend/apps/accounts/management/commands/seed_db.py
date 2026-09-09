import json
from django.core.management.base import BaseCommand
from django.db import transaction
from apps.accounts.models import User, Candidate, Recruiter
from apps.companies.models import Company
from apps.jobs.models import Job
from apps.applications.models import Application, AIAnalysis
from apps.interviews.models import Interview
from apps.notifications.models import Notification
from django.utils import timezone
from datetime import timedelta

class Command(BaseCommand):
    help = 'Seeds the database with coherent development/demo data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding database with demo data...')
        
        with transaction.atomic():
            # Clear existing demo data if any, to avoid duplicates
            User.objects.filter(email__endswith='@demo.smartats.io').delete()

            # Create Admin
            admin_user = User.objects.create_superuser(
                email='admin@demo.smartats.io',
                password='Password123!',
                first_name='Demo',
                last_name='Admin'
            )

            # Create Company
            company = Company.objects.create(
                name='TechPulse AI (Demo)',
                description='A leading AI software company.',
                industry='Technology',
                location='San Francisco, CA',
                is_verified=True
            )

            # Create Recruiter
            recruiter_user = User.objects.create_user(
                email='recruiter@demo.smartats.io',
                password='Password123!',
                first_name='Alex',
                last_name='Vance',
                role=User.Role.RECRUITER
            )
            recruiter = Recruiter.objects.create(
                user=recruiter_user,
                company=company,
                designation='Senior Tech Recruiter',
                is_approved=True
            )

            # Create Candidates
            candidate_user = User.objects.create_user(
                email='candidate@demo.smartats.io',
                password='Password123!',
                first_name='Jane',
                last_name='Doe',
                role=User.Role.CANDIDATE
            )
            candidate = Candidate.objects.create(
                user=candidate_user,
                headline='Senior Full-Stack Engineer',
                location='San Francisco, CA',
                parsed_skills=['Python', 'Django', 'React'],
                parsed_education=[{'degree': 'BS CS', 'institution': 'UC Berkeley'}],
                parsed_experience=[{'title': 'Engineer', 'company': 'Nexus'}]
            )

            # Create Job
            job = Job.objects.create(
                company=company,
                recruiter=recruiter,
                title='Senior Full-Stack Engineer (Demo)',
                description='Looking for an experienced engineer to build great products.',
                department='Engineering',
                location='Remote',
                job_type=Job.JobType.FULL_TIME,
                experience_min_years=4,
                required_skills=['Python', 'Django', 'React'],
                status=Job.JobStatus.OPEN
            )

            # Create Application
            application = Application.objects.create(
                job=job,
                candidate=candidate,
                status=Application.ApplicationStatus.INTERVIEW_SCHEDULED,
                resume_snapshot={'skills': ['Python', 'Django', 'React']}
            )

            # Create AI Analysis
            AIAnalysis.objects.create(
                application=application,
                overall_match_score=92.5,
                semantic_similarity_score=95.0,
                skill_match_score=90.0,
                experience_match_score=85.0,
                matched_skills=['Python', 'Django', 'React'],
                explanation={'summary': 'Strong alignment across core requirements.'}
            )

            # Create Interview
            Interview.objects.create(
                application=application,
                scheduled_time=timezone.now() + timedelta(days=2),
                duration_minutes=60,
                interview_type=Interview.InterviewType.TECHNICAL,
                meeting_link_or_location='https://meet.google.com/demo-link',
                status=Interview.InterviewStatus.SCHEDULED
            )

            # Create Notification
            Notification.objects.create(
                user=candidate_user,
                title='Interview Scheduled',
                message='Your technical interview has been scheduled.',
                notification_type=Notification.NotificationType.INTERVIEW_SCHEDULED
            )

        self.stdout.write(self.style.SUCCESS('Successfully seeded development data!'))
