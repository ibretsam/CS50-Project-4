from django.contrib.auth.models import AbstractUser
from django.db import models



class User(AbstractUser):
    pass

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="userprofile")
    follower = models.ManyToManyField(User, blank=True, related_name="followers")
    following = models.ManyToManyField(User, blank=True, related_name="followings")
    
    def __str__(self):
        return f"{self.user.username}"

class Post(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="PostProfile")
    postContent = models.TextField(max_length=1000)
    comment = models.TextField(max_length=1000, blank=True)
    time = models.DateTimeField(auto_now_add=True)
    
    def serialize(self):
        return {
            "id": self.id,
            "profile": self.profile.user.username,
            "profile_id": self.profile.id,
            "postContent": self.postContent,
            "comment": self.comment,
            "time": self.time.strftime("%b %d %Y, %I:%M %p")
        }
    
    def __str__(self):
        return f"{self.profile.user.username} posted: {self.postContent}"

class Like(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="likedProfile")
    liked = models.BooleanField(default=False);
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="postLiked")
    
    def serialize(self):
        return {
            "postID": self.post.id,
            "liked": self.liked,
            "likedProfileID": self.profile.id
        }
    
    def __str__(self):
        if self.liked == True:
            return f"{self.profile} liked {self.post}"
        else:
            return f"{self.profile} unliked {self.post}"