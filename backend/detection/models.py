from django.db import models
from django.contrib.auth.models import User


class DiseaseHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='disease_histories')
    image = models.ImageField(upload_to='disease_images/')
    plant_name = models.CharField(max_length=100)
    disease_name = models.CharField(max_length=150)
    confidence = models.FloatField(default=0.0)
    description = models.TextField(blank=True)
    causes = models.TextField(blank=True)
    symptoms = models.TextField(blank=True)
    natural_remedies = models.TextField(blank=True)
    chemical_remedies = models.TextField(blank=True)
    prevention = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} — {self.plant_name}: {self.disease_name}"

    @property
    def is_healthy(self):
        return 'healthy' in self.disease_name.lower()
