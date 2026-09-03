"""
ASGI config for smart_ats project.
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_ats.settings')

application = get_asgi_application()
