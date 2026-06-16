from django.contrib import admin
from .models import DiseaseHistory


@admin.register(DiseaseHistory)
class DiseaseHistoryAdmin(admin.ModelAdmin):
    list_display = ['user', 'plant_name', 'disease_name', 'confidence', 'created_at']
    list_filter = ['plant_name', 'disease_name']
    search_fields = ['user__username', 'disease_name', 'plant_name']
    readonly_fields = ['created_at']
