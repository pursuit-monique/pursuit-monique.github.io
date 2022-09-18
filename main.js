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
  console.log(name.length);
  return name.length > 1
    ? { area: name[0], name: name[name.length - 1] }
    : { area: "Epicenter", name: name[0] };
}

// FORMS INITLAIZING

let startDate = document.getElementById("startDate");
let endDate = document.getElementById("endDate");
startDate.min = "1970-01-01";
startDate.max = new Date().toLocaleDateString("en-ca");
endDate.disabled = true;

startDate.addEventListener("blur", (event) => {
  event.preventDefault();
  //   console.log(event);
  if (isNaN(event)) {
    svrStatus("Select a proper date.", "#bb4430");
  }
  let correctDate = new Date(startDate.value);
  correctDate = correctDate.getTime() - 2592000000;
  //   console.log(correctDate);
  correctDate = new Date(correctDate);
  //   console.log(correctDate.getMonth());
  //   console.log(correctDate.toISOString().substring(0, 10));
  document.getElementById("endDate").disabled = false;
  document.getElementById("endDate").min = dateConv(correctDate);
  document.getElementById("endDate").max = startDate.value;
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
          console.log(ev);
          //ev.layer.feature.properties.place}
          document.querySelector(
            ".mapright"
          ).innerHTML = `<h6 style="color:silver"><em>${
            nameParse(ev.layer.feature.properties.place).area
          } of</em></h6><h3> ${
            nameParse(ev.layer.feature.properties.place).name
          }</h3>
          <h4>A ${ev.layer.feature.properties.mag} Magnitude ${
            ev.layer.feature.properties.type
          }</h4><h5> At ${dateConv(ev.layer.feature.properties.time)}</h5>
          <p><i class="fa fa-map-marker" aria-hidden="true"></i>  <strong>Latittude:</strong> ${
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
        })
        .addTo(map);

      json.metadata.status === 200
        ? svrStatus(json.metadata.status, "#7ebdc2")
        : svrStatus(json.metadata.status, "#bb4430");
    })
    .catch((error) => {
      // You can do what you like with the error here.
      svrStatus(error, "#bb4430");
      console.log(json);
    });
}
