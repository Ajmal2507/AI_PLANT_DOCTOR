"""
core/wsgi.py
────────────
WSGI = Web Server Gateway Interface
This file lets a production web server (like Gunicorn) run Django.
You don't need to change this file.
"""

import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
application = get_wsgi_application()
