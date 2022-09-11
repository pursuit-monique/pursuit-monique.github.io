// MAP DRAWING STARTS

let map = L.map("map").setView([51.505, -0.09], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap",
}).addTo(map);

let marker = L.marker([51.5, -0.09]).addTo(map); //specific marker for feature

let circle = L.circle([51.508, -0.11], {
  //  for bubble map distrobution
  color: "red",
  fillColor: "#f03",
  fillOpacity: 0.5,
  radius: 500,
}).addTo(map);

let polygon = L.polygon([
  // parse geojson data via polygon feature
  [51.509, -0.08],
  [51.503, -0.06],
  [51.51, -0.047],
]).addTo(map);

// MAP DRAWING ENDS

// ADD JSON DATA?
fetch(
  `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=2014-01-02`
)
  .then((response) => response.json())
  .then((json) => {
    console.log(json.features[1].geometry.coordinates[0]);
    // You can do what you like with the result here.
    L.geoJSON(json, {
      pointToLayer: function (feature, latlng) {
        return new L.CircleMarker(latlng, {
          radius: 5,
          color: "#FF0000",
        });
      },

      style: function (feature) {
        let color = "";
        if (feature.properties.mag < 1) {
          color = "green";
        } else if (feature.properties.mag < 2) {
          color = "yellow";
        } else if (feature.properties.mag < 3) {
          color = "orange";
        } else if (feature.properties.mag <= 5) {
          color = "red";
        }
        return { color: color };
      },
    })
      .bindPopup(function (layer) {
        return (
          layer.feature.properties.place +
          "<br>" +
          layer.feature.properties.type +
          "<br>" +
          layer.feature.properties.mag +
          " mag" +
          "<br>" +
          "<a href=" +
          `${layer.feature.properties.url}` +
          ">" +
          "More information." +
          "</a>"
        );
      })
      .addTo(map);
    console.log(json);
  })
  .catch((error) => {
    // You can do what you like with the error here.
    // console.log(error);
  });
