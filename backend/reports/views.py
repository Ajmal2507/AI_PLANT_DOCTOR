from django.http import FileResponse
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from detection.models import DiseaseHistory
from .pdf_generator import generate_pdf_report


class DownloadReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        history = get_object_or_404(DiseaseHistory, pk=pk, user=request.user)
        pdf_buffer = generate_pdf_report(history)

        plant = history.plant_name.replace(' ', '_').lower()
        disease = history.disease_name.replace(' ', '_').lower()
        filename = f"{plant}_{disease}_report.pdf"

        response = FileResponse(
            pdf_buffer,
            content_type='application/pdf'
        )
        response['Content-Disposition'] = f'attachment; filename="{filename}"'

        return response
