const mapboxToken =
  "pk.eyJ1IjoibXIyODAzIiwiYSI6ImNrOHl3aXc5NzA1cHAzZm9odGVvc2t6eG0ifQ.ja2vptssdbDcCCuy1m91gw";

const output = document.getElementById("output");

mapboxgl.accessToken = mapboxToken;
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/dark-v10",
  zoom: 1.5,
  center: [0, 20],
});

const getColorFromCountConfirmed = (count) => {
  if (count >= 100) {
    return "#ff000059";
  }
  if (count >= 10) {
    return "#0000ff69";
  }
  return "gray";
};
const getSizeFromCountConfirmed = (count) => {
  if (count >= 100) {
    return [50, 50];
  }
  if (count >= 10) {
    return [20, 20];
  }
  return [10, 10];
};
const getBorderFromCountConfirmed = (count) => {
  if (count >= 100) {
    return "1px solid red";
  }
  if (count >= 10) {
    return "1px solid blue";
  }
  return "#e8e8e8";
};

renderData();

//con async indico che all'interno della funzione verrà eseguita un'operazione asincrona ( fetch)
async function getData() {
  //await sospende l’esecuzione di una funzione in attesa che la Promise associata ad un’attività asincrona venga risolta o rigettata.
  const response = await fetch(
    "https://wuhan-coronavirus-api.laeyoung.endpoint.ainize.ai/jhu-edu/latest"
  );
  const data = await response.json();
  return data;
}

async function renderData() {
  const data = await getData();
  console.log(data);
  data.forEach((element) => {
    //nuova feat di ES6 , passando i dati in questo modo le mie const assumono il valore di element.confirmed , etc
    let {
      confirmed,
      countryregion,
      location,
      provincestate,
      deaths,
      recovered,
      lastupdate,
    } = element;
    if (confirmed > 0) {
      var geojson = {
        type: "FeatureCollection",
        features: {
          type: "Feature",
          properties: {
            iconSize: getSizeFromCountConfirmed(confirmed),
            background: getColorFromCountConfirmed(confirmed),
            border: getBorderFromCountConfirmed(confirmed),
          },
        },
      };
      console.log(geojson);
      if (provincestate == "") provincestate = countryregion;
      var popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        `
      <div class="d-flex flex-column">

            <p><strong>Paese</strong> : ${provincestate}</p>
            <p>Numero di casi totali : ${confirmed}</p>
            <button class="btn btn-info btn-sm" onclick='showDetails(${confirmed},${deaths},${recovered},"${provincestate}") '>Mostra dettagli</button>
      </div>`
      );
      const el = document.createElement("div");
      el.className = "marker";
      el.style.background = geojson.features.properties.background;
      el.style.width = geojson.features.properties.iconSize[0] + "px";
      el.style.height = geojson.features.properties.iconSize[1] + "px";
      el.style.border = geojson.features.properties.border;

      new mapboxgl.Marker(el)
        .setLngLat([location.lng, location.lat])
        .setPopup(popup)
        .addTo(map);
    }
  });
}

function showDetails(confirmed, recovered, deaths, country) {
  let mortality = (deaths * 100) / confirmed;
  let textToOutput = `
  <h1 class="col-12 text-center">${country}</h1>
  <div  class="confirmed col-md-3">
    <i class="fas fa-head-side-mask"></i> 
    <p>Casi confermati</p>
    <p id="confirmed">${confirmed}</p>
  </div >
`;
  if (recovered != undefined) {
    textToOutput += `
    <div class="recovered col-md-3">
      <i class="fas fa-heartbeat"></i>
      <p>Ricoverati</p>
      <p id="recovered">${recovered}</p>
    </div>
  `;
  }
  if (deaths != undefined) {
    textToOutput += `
    <div  class="deaths col-md-3">
      <i class="fas fa-cross"></i>
      <p>Deceduti</p>
      <p id="deaths">${deaths}</p>
    </div>
    <div  class="mortality col-md-3">
      <i class="fas fa-percent"></i>
      <p>Tasso di Mortalità</p>
      <div class='d-flex justify-content-center'>

        <p id="mortality" class="m-0">${mortality} </p>
        <p>%</p>
      </div>
    </div>
  `;
  }
  output.innerHTML = textToOutput;
  const countUpConfirmed = new CountUp("confirmed", 0, confirmed);
  countUpConfirmed.start();
  const countUpRecovered = new CountUp("recovered", 0, recovered);
  countUpRecovered.start();
  const countUpDeaths = new CountUp("deaths", 0, deaths);
  countUpDeaths.start();
  const countUpMortality = new CountUp("mortality", 0, mortality);
  countUpMortality.start();

  window.scrollTo({ top: 1000, behavior: "smooth" });
}

const elements = document.querySelectorAll(
  ".fa-instagram, .fa-facebook, .fa-linkedin, .fa-github , .fa-skype"
);

elements.forEach((element) => {
  element.addEventListener("mouseenter", () => {
    element.classList.add("fa-spin");
  });
  element.addEventListener("mouseleave", () => {
    element.classList.remove("fa-spin");
  });
});
