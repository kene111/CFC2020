from django.urls import path
from . import views
from . views import CommentView

urlpatterns = [
    path('', views.home, name = 'ndia-home'), #ndia/
    path('chat/', CommentView.as_view(), name = 'ndia-chat'),
    path('about/',  views.about, name = 'ndia-about'),

]  