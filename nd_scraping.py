# -*- coding: utf-8 -*-
"""
Created on Wed Apr 22 01:50:41 2020

@author: User
"""

from bs4 import BeautifulSoup
from urllib.request import urlopen

# Found this website that gives updates on Natural Disasters, and it actually updates like
# every few minutes depending on when a disaster happens. I'ts like the best one I've found
# so far
url = "https://www.newsnow.co.uk/h/World+News/Natural+Disasters"

uClient = urlopen(url)
page_html = uClient.read()
uClient.close()

page_soup = BeautifulSoup(page_html, 'html.parser')

containers = page_soup.findAll('div', {'class':'hl__inner'})

# Main things I thinnk we need from the website is the Headline, a link to read the article
# and the time the Natural Disaster was reported. Stored them all in the lists. They're
# in order.
headlines = []
forwards = []
times = []
for container in containers:
    try:
        headlines.append(container.a.text)
    except:
        headlines.append(None)
        
    try:
        forwards.append(container.a['href'])
    except:
        forwards.append(None)
        
    try:
        times.append(container.find('span', {'class':'time'}).text)
    except:
        times.append(None)

# Unfortunately not all the info may have been given, especially for the time.
# So I put a 'None' for any missing value