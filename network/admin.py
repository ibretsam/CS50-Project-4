from django.contrib import admin

from .models import Like, Post, Profile, User

# Register your models here.
admin.site.register(Post)
admin.site.register(Profile)
admin.site.register(User)
admin.site.register(Like)
