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

containers = page_soup.findAll('div', {'class':'newsfeed'})

# From all the containers, the only relevant one for Natural disasters is the one in index 1
# The latest_news_container holds info of Natural Disaster headlines stretching back to maybe
# even the previous day, but at least throughout that day.

latest_news_container = containers[1].findAll('div', {'class': 'hl'})


# Fortunately I was able to improve on the scipt and found it was possible to get the country the disaster
# was occuring at, or at least the country it was being reported. Unfortunately, the country info is
# in the acronym form. E.g. Canada is CA. So that's something we might need to get past later

headlines = []
forwards = []
countries = []
times = []

for container in latest_news_container:
    try:
        headlines.append(container.a.text)
    except:
        headlines.append(None)
        
    try:
        forwards.append(container.a['href'])
    except:
        forwards.append(None)
        
    try:
        countries.append(container.span['c'])
    except:
        countries.append(None)
        
    try:
        times.append(container.find('span', {'class':'time'}).text)
    except:
        times.append(None)

# Important info: I haven't seen any point where any of the headlines, country, link or time information
# is missing, so adding "None" if any info is not present is just a precautionary thing.
# Also, for the "times" values, if only the time is given and the day is not given, then the day the headline
# was reported is the present day. Otherwise, the day will be given. Usually, the script only covers headlines
# from the present and previous day and they are arranged in chronological order by default.