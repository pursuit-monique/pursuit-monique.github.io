# 9-2-front-end-project
Earthquake Geographic Data

# DESCRIPTION
This is a map using the Leaflet API to generate a map that displays USGS Historical Earthquake data.  It utilizes an input date type and allows the user to select a date up to 30 days in the past. Valid dates start at 1-1-1970, to the current day. It will then propagate the map with points, with color and size based on the magnitude of the earthquake.  The user can then click on the Earthquake for more information.

# Features:
- The ability to search for Earthquakes by year/date
- The ability to view point data, name and title
- The ability to view further detailed information via a link to USGS's detailed library for researchers.
- Mobile friendly in case danger strikes.


# Using:
- **Leaflet.js** https://leafletjs.com/reference.html#geojson
- **Earthquake catalog** https://earthquake.usgs.gov/fdsnws/event/1/

#  Findings:
- USGS geoJSON data is descriptive for datapoints, but data includes epoch timestamp under time: key.
- method of translation is Math.floor(new Date().getTime()/1000.0) 
- URL api call for data is yyyy-mm-dd format, ISO8601
- 2022-09-12T23:40:50, Implicit UTC timezone.  -- TODO later.
- 2022-09-12T23:40:50+00:00, Explicit timezone. -- TODO later.
- Maximum is 30 days advancement.

# How to use:
- Fork the project to your repository.
- Click on the start date. Select a date.
- Select an end date.
- Hit "Get data"
- Click on the point you would like more information on.
- A status will display under "Get Data".  200 means the API has been properly called.   Red text means an error occured.


