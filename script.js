const mapboxToken =
  "pk.eyJ1IjoibXIyODAzIiwiYSI6ImNrOHl3aXc5NzA1cHAzZm9odGVvc2t6eG0ifQ.ja2vptssdbDcCCuy1m91gw";

mapboxgl.accessToken = mapboxToken;
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/dark-v10",
  zoom: 1.5,
  center: [0, 20],
});

const getColorFromCountConfirmed = (count) => {
  if (count >= 100) {
    return "red";
  }
  if (count >= 10) {
    return "blue";
  }
  return "gray";
};

fetch(
  "https://wuhan-coronavirus-api.laeyoung.endpoint.ainize.ai/jhu-edu/latest"
)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    data.forEach((element) => {
      const { confirmed, countryregion } = element;
      var popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        `
<p>Paese : ${countryregion}</p>
<p>Numero di casi totali : ${confirmed}</p>`
      );
      var el = document.createElement("div");
      el.id = "marker";
      new mapboxgl.Marker({
        color: getColorFromCountConfirmed(confirmed),
      })
        .setLngLat([element.location.lng, element.location.lat])
        .setPopup(popup)
        .addTo(map);
    });
  });
