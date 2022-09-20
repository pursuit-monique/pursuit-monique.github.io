//Basic Parsers
const dateConv = (datestr) => new Date(datestr).toISOString().substring(0, 10); //epoch to utc for json

const svrStatus = (
  str,
  color //Fat arrow function to parse status
) =>
  (document.querySelector(
    "#status"
  ).innerHTML = `<strong>Status:</strong> <span style="color:${color}">${str}</span>`);

function nameParse(str) {
  //Town name parser
  let name = str.split("of");
  return name.length > 1
    ? { area: name[0], name: name[name.length - 1] }
    : { area: "Epicenter", name: name[0] };
}

// RAPID API

const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "1535cc21d0msh0983fe12c5e29d3p1f2c14jsn3e39edad44ad",
    "X-RapidAPI-Host": "trueway-geocoding.p.rapidapi.com",
  },
};

// FORMS INITLAIZING

let startDate = document.getElementById("startDate");
let endDate = document.getElementById("endDate");
startDate.min = "1970-01-01";
startDate.max = new Date().toLocaleDateString("en-ca");
endDate.disabled = true;

startDate.addEventListener("input", (event) => {
  event.preventDefault();
  if (event.returnValue === false) {
    svrStatus("Select a proper date.", "#bb4430");
  }
  let correctDate = new Date(startDate.value);
  correctDate = correctDate.getTime() - 2592000000;
  endDate.disabled = false;
  endDate.min = dateConv(correctDate);
  endDate.max = startDate.value;
});

document.getElementById("timeSubmit").addEventListener("submit", (event) => {
  //submit button
  event.preventDefault();
  let startDate = document.getElementById("startDate").value;
  let endDate = document.getElementById("endDate").value;
  getMapData(startDate, endDate);
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
      console.log("json script is running...");
      // You can do what you like with the result here.
      var jsonGroup = new L.LayerGroup();
      jsonGroup.addTo(map);
      console.log(currentLayer);
      var currentLayer = new L.geoJSON(json, {
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
            color = "blue";
            radius = 1;
          } else if (feature.properties.mag < 2) {
            color = "green";
            radius = 3;
          } else if (feature.properties.mag < 3) {
            color = "yellowgreen";
            radius = 6;
          } else if (feature.properties.mag < 5) {
            color = "yellow";
            radius = 8;
          } else if (feature.properties.mag < 8) {
            color = "orange";
            radius = 10;
          } else if (feature.properties.mag <= 10) {
            color = "red";
            radius = 10;
          }
          return { color: color, radius: radius };
        },
      })
        .on("click", function (ev) {
          //DOM event handler for each 'Feature'.
          console.log(ev);
          // fetch(
          //   // `https://trueway-geocoding.p.rapidapi.com/ReverseGeocode?location=${ev.latlng.lat}%2C${ev.latlng.lng}&language=en`,
          //   // options
          //   `https://geocoding.geo.census.gov/geocoder/geographies/coordinates?x=${ev.latlng.lng}y=${ev.latlng.lat}&benchmark=Public_AR_Census2020&vintage=2010&layers=10&format=json`,
          //   { mode: "no-cors" }
          // )
          //   .then((response) => response.json())
          //   .then((response) => {
          //     console.log(response);
          //     console.log(ev.latlng.lng);
          //   })
          //   .catch((err) => console.error(err));
          document.querySelector(
            ".mapright"
          ).innerHTML = `<h6 style="color:silver"><em>${
            nameParse(ev.layer.feature.properties.place).area
          } of</em></h6><h3> ${
            nameParse(ev.layer.feature.properties.place).name
          }</h3>
          <h4>A ${ev.layer.feature.properties.mag} Magnitude ${
            ev.layer.feature.properties.type
          }</h4><h5> On ${new Date(
            dateConv(ev.layer.feature.properties.time)
          ).toLocaleDateString("en-us", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}</h5>
          <p><i class="fa fa-map-marker" aria-hidden="true"></i>  <strong>Latitude:</strong> ${
            ev.latlng.lat
          } <strong>Longitude: </strong> ${ev.latlng.lng} <br><br>
          <i class="fa fa-external-link" aria-hidden="true"></i>  <a href="${
            ev.layer.feature.properties.url
          }">Link to more information.</a>  `;
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
        });
      console.log(currentLayer);
      console.log(jsonGroup);
      jsonGroup.addLayer(currentLayer);
      console.log(jsonGroup);
      // .addTo(map);
      // console.log(CircleMarker.getLayers());
      json.metadata.status === 200
        ? svrStatus(json.metadata.status, "#7ebdc2")
        : svrStatus(json.metadata.status, "#bb4430");
    })
    .catch((error) => {
      svrStatus(error, "#bb4430");
      console.log(error);
    });
}
