from django.db import models
from authentication.models import CustomUser as User


# Create your models here
class pongames(models.Model):
  #change the channle name to id user
  player1_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='player1')
  player2_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='player2')
  score1 = models.IntegerField(default=0)
  score2 = models.IntegerField(default=0)