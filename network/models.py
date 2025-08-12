from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    following = models.ManyToManyField('self', related_name='followers')

class Post(models.Model):
    content = models.CharField(max_length=400)
    creator = models.ForeignKey(User, on_delete = models.CASCADE, related_name='posts')
    posted = models.DateTimeField()
    likes = models.ManyToManyField(User, related_name='likes')