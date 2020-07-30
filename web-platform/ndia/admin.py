
# Register your models here.
from .import models
from django.contrib import admin #import Scraper, Twitter

# Register your models here.
Nmodels = [models.Help, models.Emails]
admin.site.register(Nmodels)   

# Register your models here.
