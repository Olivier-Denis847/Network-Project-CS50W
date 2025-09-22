
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path('profile/<str:id>', views.profile, name='profile'),
    path('following', views.following, name='following'),

    #API urls
    path('create', views.create_post, name='create'),
    path('list', views.list_posts, name='list'),
    path('add_follow/<str:id>', views.add_follow, name='add_follow'),
    path('add_like', views.add_like, name='add_like'),
    path('edit_post', views.edit_post, name='edit_post')
]
