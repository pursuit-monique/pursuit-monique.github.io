const todaysDate = new Date();

let test = todaysDate;
// test.setDate(todaysDate.getDate() - 30);

const dateFormat = (date) => {
  if (date.getMonth().length === 1) {
    return `${date.getFullYear()}-
        ${String(date.getMonth() + 1).padStart(2, "0")}-${date.getDate()}`;
  } else {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }
};

const dateSubtract = (date) =>
  dateFormat(new Date(date.setDate(date.getDate() - 30)));

// FORMS INITLAIZING

let startDate = document.getElementById("startDate");
let endDate = document.getElementById("endDate");
startDate.min = "1970-01-01";
startDate.max = new Date().toLocaleDateString("en-ca");
// document.getElementById("endDate").setAttribute("disabled", "");

startDate.addEventListener("blur", (event) => {
  event.preventDefault();
  let correctDate = new Date(startDate.value);
  correctDate = correctDate.getTime() - 2592000000;
  console.log(correctDate);
  correctDate = new Date(correctDate);
  console.log(correctDate.getMonth());
  //   correctDate = correctDate.toISOString().split("T")[0];
  console.log(correctDate.toISOString().substring(0, 10));
  document.getElementById("endDate").min = correctDate
    .toISOString()
    .substring(0, 10);
  document.getElementById("endDate").max = startDate.value;
  //   document.getElementById("endDate").setAttribute("enabled", "");
});

// MAP DRAWING STARTS

let map = L.map("map", {
  minZoom: 2.5,
  maxZoom: 10,
});

L.control.scale().addTo(map);

L.tileLayer(
  "https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>',
  }
).addTo(map);

map.locate({ setView: true, maxZoom: 16 });

// MAP DRAWING ENDS

getMapData("1984-11-30", "1984-11-02"); //Default map rendering on site load.

// ADD GeoJSON DATA?
function getMapData(startDate, endDate) {
  fetch(
    `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${endDate}&endtime=${startDate}`
  )
    .then((response) => response.json())
    .then((json) => {
      console.log("this script is running");
      //   console.log(json.features[1].geometry.coordinates[0]);
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
          let radius = 0;
          if (feature.properties.mag < 1) {
            color = "green";
            radius = 3;
          } else if (feature.properties.mag < 2) {
            color = "yellow";
            radius = 5;
          } else if (feature.properties.mag < 3) {
            color = "orange";
            radius = 7;
          } else if (feature.properties.mag <= 5) {
            color = "red";
            radius = 10;
          }
          return { color: color, radius: radius };
        },
      })
        .on("click", function (ev) {
          //DOM event handler for each 'Feature'.
          alert(ev.latlng); // ev is an event object (MouseEvent in this case)
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
      console.log(error);
    });
}

document.getElementById("timeSubmit").addEventListener("submit", (event) => {
  event.preventDefault();
  let startDate = document.getElementById("startDate").value;
  let endDate = document.getElementById("endDate").value;
  getMapData(startDate, endDate);
});
