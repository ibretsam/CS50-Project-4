import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator


from .models import User, Post, Profile


def index(request):
    if request.user.is_authenticated:
        
        # Add a home variable to recognize this is the homepage
        home = True
        return render(request, "network/index.html", {"home": home})
    else:
        return HttpResponseRedirect(reverse("login"))

# Create a view for following page, same method as index function but without the home variable
def followingView(request):
    if request.user.is_authenticated:
        return render(request, "network/index.html")
    else:
        return HttpResponseRedirect(reverse("login"))
    
@csrf_exempt
@login_required
def newpost(request):
    
    # Make sure the request method must be POST
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status = 400)
    
    # Get the api fetching data from request
    data = json.loads(request.body)
    
    # Getting the postContent from the fetching request
    content = data.get("postContent", "")
    
    # Create a new post with the content and profile
    Post.objects.create(
        postContent = content,
        profile = Profile.objects.get(pk=request.user.userprofile.id)
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

# This function returns API for fetching from front-end
@login_required
def allpost(request, target):
    
    # For all the posts by everyone
    if target == "all":
        posts = Post.objects.all()
        posts = posts.order_by("-time").all()
        
    # For all the posts that request user is following
    elif target == "following":
        
        # Getting the list of all the profile the request.user following
        requestProfile = Profile.objects.get(pk=int(request.user.userprofile.id))
        followingList = requestProfile.following.all()
        
        # Filter the posts by profiles in the following list
        posts = Post.objects.filter(profile__user__in=followingList)
        posts = posts.order_by("-time").all()
        
    # For all the post for a specific user
    else:
        
        # Filter the posts by the target profile
        posts = Post.objects.filter(profile__user__username = target)
        posts = posts.order_by("-time").all()
    p = Paginator(posts, 10)
    page = request.GET.get('page')
    posts = p.get_page(page) 
    posts_obj = [post.serialize() for post in posts]
    return JsonResponse({"currentpage": int(page),"numberOfPage": p.num_pages, "has_next": posts.has_next(), "has_previous": posts.has_previous(), "post": posts_obj},safe=False)

@csrf_exempt
@login_required
def viewpost(request, post_id):
    post = Post.objects.get(pk = post_id)
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
    
    # Get the request.user profile and the current profile's page's profile
    profile = Profile.objects.get(pk=user_id)
    userProfile = Profile.objects.get(pk=int(request.user.userprofile.id))
    
    # Add or remove profiles to following/follower list depend on condition
    if condition == "follow":
        profile.follower.add(userProfile.user)
        userProfile.following.add(profile.user)
    elif condition == "unfollow":
        profile.follower.remove(userProfile.user)
        userProfile.following.remove(profile.user)
    return HttpResponseRedirect(reverse("profile", kwargs={'user_id': user_id}))

