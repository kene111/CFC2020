from django.shortcuts import render
from django.views.generic import FormView
from ndia.forms import CommentForm, HelpForm, emailForm
import json
from django.db.models import Count
from django.core.mail import send_mail
from django.conf import settings
from . models import  Help, Emails
from  django.db.models import Max
import pytz
import datetime
import time

# Create your views here.

def home(request):

	shows = []
	if   request.method == 'POST' and 'helpb' in request.POST:
		Hform =  HelpForm(request.POST, prefix='help')	
		if Hform.is_valid():
			place = Hform.cleaned_data.get('place')
			disaster_type = Hform.cleaned_data.get('disaster_type')
			place =  place.upper()
			disaster_type = disaster_type.upper()

			Help.objects.create(Place=place, Disaster_Type=disaster_type)

	else:
		Hform = HelpForm(prefix='help') 


	
	get_max = Help.objects.values_list('Place').annotate(place_count=Count('Place')).order_by('-place_count').first() #[0] # get the highest occuring variable in place column   (1)
	if get_max == None:
		pass
	else:
		max_var = get_max[0] # the variable, string.                                                                                                                   (2)
		filt = Help.objects.filter(Place = max_var).aggregate(maxoccurance=Max('Disaster_Type'))['maxoccurance'] # filter by max occuring disaster type
		shows = Help.objects.filter(Place = max_var, Disaster_Type = filt)[0:1]

		print(get_max[1])


	if request.method == 'POST' and 'emailb' in request.POST:
		Eform = emailForm(request.POST)
		if Eform.is_valid():
		
			email = Eform.cleaned_data.get('email')
			Emails.objects.create(Email=email)
	else:
		Eform =  emailForm()


	if get_max == None:
		pass

	else:
		if get_max[1] == 1: # if the max entries equate to 10 send an email.
			recievers = []
		
			for mail in Emails.objects.all():
			    recievers.append(mail.Email)
			recievers =  list(set(recievers))

			subject ='Warning!'
			message ='There is currently a case of {} at {}, please it is advised to stay clear off the area mentioned.'.format(filt, shows[0])
			email_from = settings.EMAIL_HOST_USER
			send_mail(subject, message, email_from, recievers, fail_silently = False)
	
					
	now = datetime.datetime.now(tz=pytz.UTC)
	tnow = [now]

	def Time_Hour(time):
	    hour = []
	    for ti in time:
	        ti = str(ti)
	        h = ti.split(' ')
	        h = list(h)
	        hour.append(int("".join(h[1][0:2]))) 
	       
	    return(hour)

	value = Time_Hour(tnow)


	if value[0] == 0:
		Help.objects.all().delete() # clearing the database after 24 hrs

	results = {'title':'Home','Hform': Hform,'Eform':Eform,'shows': shows}
	return render(request,'ndia/ndia.html', results)







class CommentView(FormView):
	template_name  = 'ndia/chat.html'
	form_class = CommentForm
	success_url = '.'

	def form_valid(self, form):
		#serialized_json = json.dumps(form.ask_watson(), sort_keys =True, indent =3)
		#response = json.loads(serialized_json)
		response = form.ask_watson()
		context =  self.get_context_data()
		context['response'] = response
		context['title'] = 'Ask me!'
		return render(self.request, 'ndia/chat.html', context)
        




def about(request):

	return render(request, 'ndia/about.html',{'title':'About'})



		        