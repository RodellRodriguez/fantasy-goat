from django.shortcuts import render
from django.http import HttpResponse

from weeklystats.yahoo.api import Session

# Create your views here.

def index(request):
	session = Session()
	stats = session.get_stats_for_week('current')
	
	return HttpResponse(stats)