from django.urls import path
from .views import PlayerGamesAPIView

urlpatterns = [
    path('player-games/', PlayerGamesAPIView.as_view(), name='player-games-api'),
]
