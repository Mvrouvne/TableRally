from django.urls import path
from .views import ScoreList

urlpatterns = [
    path('Score/', ScoreList.as_view(), name='score-list'),
]
