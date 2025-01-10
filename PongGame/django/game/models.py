from django.db import models
from authentication.models import CustomUser as User


# Create your models here
class Score(models.Model):
  #change the channle name to id user
  user1_id = models.ForeignKey(User, on_delete=models.CASCADE,related_name="Score") 
  user2_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name="Score2")
  score1 = models.CharField(max_length=255)
  score2 = models.CharField(max_length=255)