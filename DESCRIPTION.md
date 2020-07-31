# PROJECT N.D.I.A

## Problem Identified

Lack of awareness, information and inadequate preparation plans are major drawbacks in the fight against natural disasters. As a case study, the article [“Disaster risk reduction knowledge of local people in Nepal” by Gangalal Tuladhar and others](https://www.researchgate.net/publication/276385116_Disaster_risk_reduction_knowledge_of_local_people_in_Nepal) talks about the high number of casualties suffered because proper education is not given on how individuals and communities can handle these disasters. The article highlights a survey taken place where people in districts of Nepal (which has experienced a few disasters over the years) were interviewed on basic knowledge relating to natural disasters. The findings unfortunately confirmed that education and information on these disasters is a scarce commodity which should be distributed. 

Thus Project N.D.I.A (Natural Disaster Informant and Assistant) has been instigated, an open source project and personal assistant created to provide users with handy tools that can be used to efficiently combat natural disasters. The project consists of a web platform and mobile application, hosted on IBM Cloud.

## Features

### Natural Disaster News

N.D.I.A provides news on natural disasters of all categories happening in the user’s vicinity as well as on a global scale. This keeps individuals aware, which in turn aids in travel plan decisions.  Information is gotten from the News Now platform and Twitter. Courtesy of Twitter’s Search API, tweets regarding natural disasters were gotten and filtered by a disaster tweet classification machine learning model before being displayed.

### Mapping Functionalities

N.D.I.A provides mapping functionalities such as locating nearby hospitals, searching for specified destinations, and sending the user’s location to organizations dedicated to immediate rescuing of lives. On the mobile application, the map marks out locations which other users have reported to have experienced disasters so as to restrict movement into that area.  This is handled using Google Maps Platform.

### Chabot Services

N.D.I.A contains a chat platform which provides actions to be carried out during or before the occurrence of certain natural disasters, these disasters are floods, earthquakes and wildfires. Watson Chabot technologies was used in carrying out this task. N.D.I.A mobile application also provides contact list of organizations dedicated to helping individuals in distress.

### Warning Feature

On the web platform N.D.I.A provides an outlet to warn non-affected individuals of areas affected by natural disasters so such routes can be avoided. Users can also subscribe to get e-mails on disaster information once they are reported on the website.

Check out Project N.D.I.A's website [here](https://ndia.eu-gb.mybluemix.net/ndia/) and view the mobile application by following [these steps](https://github.com/kene111/CFC2020#live-demo).

## Unique Project Features

The project’s uniqueness can be attributed to the fact that it functions from the perspective of the individual that can potentially be affected by the disaster. The website and mobile application are user friendly platforms that unlike anything previously established, act as a personal assistant and aid by providing beneficial information to mitigate the effects of a natural disaster on the user. Hence, apart from giving immediate disaster news as it occurs and providing essential tools for sharp response to disasters, Project N.D.I.A centers on predicting where a disaster is most likely to occur. Tree based classification machine learning models were trained on features such as days, months, years, as well as longitude and latitude coordinates of past occurrences of natural disasters. The aim was to see trends in the occurrence of past natural disasters and therefore forecast into the future possible days a disaster will most likely occur. For future purposes, additional features could be added for better predictive performances. Of course, the user is able to view these predictions easily and with the aid of the platform, plan the necessary steps that need to be taken to ensure the best case outcome actualizes. All these attributes combine to form a distinctive solution that is the ideal survival kit for otherwise vulnerable victims. The project’s individuality includes not just functionalities that help during disasters, but more importantly predicting them before their occurrence and ensuring the right steps are taken by users so the expected level of loss is drastically reduced, or even better, completely eliminated. 

## Future Implementations

Possible future implementations:

* Using satellite technologies to study cloud patterns that lead to weather related disasters and training convolutional neural deep learning networks to detect early formation and alerting individuals making use of the web and mobile platforms.

* Using satellite technologies with convolutional neural deep learning networks to detect forest fire, landslides, and more to warn individuals making use of such platforms to stay clear of such areas.

* Weekly automated re-training of machine learning models for better performance in its predictive ability on post natural disaster occurrence. 

* Possible integration of software and hardware for better analysis and prediction of earthquake disasters.

Project N.D.I.A is an open source project constantly seeking improvement and possible additions from developers all over the world.

## Acknowledgments

* [“Disaster risk reduction knowledge of local people in Nepal” by Gangalal and others](https://www.researchgate.net/publication/276385116_Disaster_risk_reduction_knowledge_of_local_people_in_Nepal)
