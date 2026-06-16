from django.urls import path
from .views import HistoryListView, HistoryDetailView, HistoryDeleteView

urlpatterns = [
    path('', HistoryListView.as_view(), name='history-list'),
    path('<int:pk>/', HistoryDetailView.as_view(), name='history-detail'),
    path('<int:pk>/delete/', HistoryDeleteView.as_view(), name='history-delete'),
]
