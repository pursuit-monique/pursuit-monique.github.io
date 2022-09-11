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
      style: function (feature) {
        return { color: feature.properties.color };
      },
    })
      .bindPopup(function (layer) {
        return layer.feature.properties.description;
      })
      .addTo(map);
    // let polygon2 = L.circle(
    //   [
    //     json.features[1].geometry.coordinates[0],
    //     json.features[1].geometry.coordinates[1],
    //     json.features[1].geometry.coordinates[2],
    //   ],
    //   {
    //     //  for bubble map distrobution
    //     color: "black",
    //     fillColor: "#ffffff",
    //     fillOpacity: 0.5,
    //     radius: 500,
    //   }
    // ).addTo(map);
    //     features
    // :
    // Array(326)
    // [0 … 99]
    // 0
    // :
    // geometry
    // :
    // coordinates
    // :
    // Array(3)
    // 0
    // :
    // -116.7776667
    // 1
    // :
    // 33.6633333
    // 2
    // :
    // 11.008
    // length
    // :
    // 3
    console.log(json);
  })
  .catch((error) => {
    // You can do what you like with the error here.
    // console.log(error);
  });
