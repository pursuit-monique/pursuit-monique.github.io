# 9-2-front-end-project
**Earthquake Geographic Data**

# A project to track historical Earthquake data by date and year.

- This user is into Environmental Studies, yet Environmental maps are often static.

- You can find up to date Earthquake maps, but not historical data with links for information for research.

- Possible usages aside researches = the ability to quickly cross reference what type of rock the land is comprised of (Ignius etc) and how often Earthquakes occur.


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