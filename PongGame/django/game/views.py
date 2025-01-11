# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from .models import games
# from .serializers import GameSerializer
# # from .serializers import UserSerializer
# from authentication.models import CustomUser as User


# from rest_framework.permissions import IsAuthenticated

# class PlayerGamesAPIView(APIView):
#     print("wowo")
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         # Get the current user
#         user = request.user

#         # Query games where the user is either player1 or player2
#         games_played = games.objects.filter(
#             player1_id=user
#         ) | games.objects.filter(
#             player2_id=user
#         )

#         # Serialize the data
#         serialized_games = GameSerializer(games_played, many=True)

#         return Response(serialized_games.data)

from rest_framework.views import APIView
from rest_framework.response import Response
from .models import pongames
from .serializers import GameSerializer
from django.db.models import Q
class PlayerGamesAPIView(APIView):
    def get(self, request):
        # Fetch the games for the specified user (by user ID)
        games_played = pongames.objects.filter(
            Q(player1_id=request.user.id) | Q(player2_id=request.user.id)
        )

        # Serialize the data
        serialized_games = GameSerializer(games_played, many=True, context={'request': request})
        return Response(serialized_games.data)
