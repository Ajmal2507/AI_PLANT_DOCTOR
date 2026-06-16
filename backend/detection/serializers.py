from rest_framework import serializers
from .models import DiseaseHistory


class DiseaseHistorySerializer(serializers.ModelSerializer):
    is_healthy = serializers.SerializerMethodField()

    class Meta:
        model = DiseaseHistory
        fields = [
            'id',
            'plant_name',
            'disease_name',
            'confidence',
            'description',
            'causes',
            'symptoms',
            'natural_remedies',
            'chemical_remedies',
            'prevention',
            'image',
            'created_at',
            'is_healthy',
        ]
        read_only_fields = ['created_at']

    def get_is_healthy(self, obj):
        return obj.is_healthy
