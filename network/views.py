import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required


from .models import User, Post, Profile


def index(request):
    if request.user.is_authenticated:
        return render(request, "network/index.html")
    else:
        return HttpResponseRedirect(reverse("login"))
    
@csrf_exempt
@login_required
def newpost(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status = 400)
    data = json.loads(request.body)
    content = data.get("postContent", "")
    Post.objects.create(
        user = request.user,
        postContent = content
    )
    return JsonResponse({"message": "Post posted successfully"}, status=201)

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        
        # Auto create new profile for user when user logged in the first time
        Profile.objects.create(
                user = request.user
            )
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

@login_required
def allpost(request, target):
    if target == "all":
        posts = Post.objects.all()
        posts = posts.order_by("-time").all()
    return JsonResponse([post.serialize() for post in posts], safe=False)

@csrf_exempt
@login_required
def viewpost(request, post_id):
    post = Post.objects.get(user=request.user, pk = post_id)
    if request.method == "GET":
        return JsonResponse(post.serialize())

@login_required
def profile(request, user_id):
    profile = Profile.objects.get(pk=user_id)
    followerList = profile.follower.all()
    followingList = profile.following.all()
    return render(request, "network/profile.html", {"profile": profile, "followerList": followerList, "followingList": followingList})

@login_required
def follow(request, user_id, condition):
    profile = Profile.objects.get(pk=user_id)
    userProfile = Profile.objects.get(pk=int(request.user.id))
    if condition == "follow":
        profile.follower.add(userProfile.user)
        userProfile.following.add(profile.user)
    elif condition == "unfollow":
        profile.follower.remove(userProfile.user)
        userProfile.following.remove(profile.user)
    return HttpResponseRedirect(reverse("profile", kwargs={'user_id': user_id}))