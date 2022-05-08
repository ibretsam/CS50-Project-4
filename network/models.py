from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Profile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="userprofile")
    follower = models.ManyToManyField(User, blank=True, related_name="follower")
    following = models.ManyToManyField(User, blank=True, related_name="following")
    
    def __str__(self):
        return f"{self.user.username}"


class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="Posts")
    postContent = models.CharField(max_length=1000)
    comment = models.TextField(max_length=1000)
    time = models.DateTimeField(auto_now_add=True)
    
    def serialize(self):
        return {
            "id": self.id,
            "user": self.user.username,
            "user_id": self.user.id,
            "postContent": self.postContent,
            "comment": self.comment,
            "time": self.time.strftime("%b %d %Y, %I:%M %p")
        }
    
    def __str__(self):
        return f"{self.user} posted: {self.postContent}"
