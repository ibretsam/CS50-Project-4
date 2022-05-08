
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("profile/<int:user_id>", views.profile, name="profile"),
    path("profile/<int:user_id>/follow/<str:condition>", views.follow, name="follow"),

    # API Routes    
    path("post", views.newpost, name="newpost"),
    path("post/<int:post_id>", views.viewpost, name="viewpost"),
    path("post/<str:target>", views.allpost, name="allpost")
]
