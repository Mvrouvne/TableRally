from rest_framework import serializers
from authentication.models import CustomUser as User
from .models import pongames

class GameSerializer(serializers.ModelSerializer):
    player1_username = serializers.SerializerMethodField()
    player1_image = serializers.SerializerMethodField()
    # print("*************", player1_image)
    player2_username = serializers.SerializerMethodField()
    player2_image = serializers.SerializerMethodField()
    class Meta:
        model = pongames
        fields = ['player1_username', 'player1_image', 'player2_username', 'player2_image', 'score1', 'score2']  

    def get_player1_image(self, obj):
        return obj.player1_id.image_url if obj.player1_id.image_url else None

    def get_player1_username(self, obj):
        return obj.player1_id.username if obj.player1_id.username else None

    def get_player2_username(self, obj):
        return obj.player2_id.username if obj.player2_id.username else None


    def get_player2_image(self, obj):
        return obj.player2_id.image_url if obj.player2_id.image_url else None      