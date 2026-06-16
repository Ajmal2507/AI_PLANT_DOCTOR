from django.urls import path
from .views import DownloadReportView

urlpatterns = [
    path('<int:pk>/pdf/', DownloadReportView.as_view(), name='download-report'),
]
