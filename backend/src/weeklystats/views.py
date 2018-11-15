from django.shortcuts import render
from django.http import HttpResponse
from django.http import Http404

from weeklystats.yahoo.api import Session

# Create your views here.

def index(request):
	session = Session()
	stats = session.get_stats_for_week('current')
	
	return HttpResponse(stats)

def week(request, week):
	session = Session()
	stats = session.get_stats_for_week(week)
	
	return HttpResponse(stats)