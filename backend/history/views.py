from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404

from detection.models import DiseaseHistory
from detection.serializers import DiseaseHistorySerializer


class HistoryListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = DiseaseHistory.objects.filter(user=request.user)

        search = request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(disease_name__icontains=search)

        plant = request.query_params.get('plant', None)
        if plant:
            queryset = queryset.filter(plant_name__icontains=plant)

        serializer = DiseaseHistorySerializer(
            queryset,
            many=True,
            context={'request': request}
        )

        return Response({
            'count': queryset.count(),
            'results': serializer.data
        }, status=status.HTTP_200_OK)


class HistoryDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        history = get_object_or_404(DiseaseHistory, pk=pk, user=request.user)
        serializer = DiseaseHistorySerializer(history, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class HistoryDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        history = get_object_or_404(DiseaseHistory, pk=pk, user=request.user)
        history.delete()
        return Response(
            {'message': 'Analysis record deleted successfully.'},
            status=status.HTTP_200_OK
        )
