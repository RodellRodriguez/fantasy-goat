from django.urls import path

from . import views

urlpatterns = [
	path('current/', views.index, name='index'),
	path('week/<int:week>/', views.week, name='week'),
]