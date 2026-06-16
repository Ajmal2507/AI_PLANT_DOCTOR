import traceback
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status

from .models import DiseaseHistory
from .serializers import DiseaseHistorySerializer
from .groq_client import analyze_image, generate_advisory


class AnalyzeView(APIView):
    parser_classes     = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        image_file = request.FILES.get('image')

        if not image_file:
            return Response(
                {'error': 'Please upload an image file.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        allowed_types = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
        if image_file.content_type not in allowed_types:
            return Response(
                {'error': 'Only JPG, PNG, and WebP images are accepted.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        history = DiseaseHistory(
            user        = request.user,
            image       = image_file,
            plant_name  = 'Analyzing...',
            disease_name= 'Analyzing...',
        )
        history.save()

        try:
            image_path   = history.image.path
            vision_result = analyze_image(image_path)
        except Exception as e:
            history.delete()
            error_detail = traceback.format_exc()
            print(f"[Vision AI Error]\n{error_detail}")
            return Response(
                {'error': f'Vision AI failed: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        try:
            plant_name   = vision_result.get('plant_name',   'Unknown')
            disease_name = vision_result.get('disease_name', 'Unknown')
            confidence   = vision_result.get('confidence',   0)
            advisory = generate_advisory(plant_name, disease_name)
        except Exception as e:
            history.delete()
            error_detail = traceback.format_exc()
            print(f"[Advisory Error]\n{error_detail}")
            return Response(
                {'error': f'Advisory generation failed: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        history.plant_name        = plant_name
        history.disease_name      = disease_name
        history.confidence        = confidence
        history.description       = advisory.get('description',       '')
        history.causes            = advisory.get('causes',            '')
        history.symptoms          = advisory.get('symptoms',          '')
        history.natural_remedies  = advisory.get('natural_remedies',  '')
        history.chemical_remedies = advisory.get('chemical_remedies', '')
        history.prevention        = advisory.get('prevention',        '')
        history.save()

        serializer = DiseaseHistorySerializer(history, context={'request': request})

        return Response({
            'message': 'Analysis complete!',
            'result':  serializer.data
        }, status=status.HTTP_201_CREATED)
