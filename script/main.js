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
    return "red";
  }
  if (count >= 10) {
    return "blue";
  }
  return "gray";
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
    const {
      confirmed,
      countryregion,
      location,
      provincestate,
      deaths,
      recovered,
      lastupdate,
    } = element;
    if (confirmed > 0) {
      var popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        `
      <p>Paese : ${provincestate != "" ? provincestate : countryregion}</p>
      <p>Numero di casi totali : ${confirmed}</p>
      <button onclick='showDetails(${confirmed},${deaths},${recovered}) ' class="details">Guarda dettagli</button>`
      );
      const el = document.createElement("div");
      el.class = "marker";
      new mapboxgl.Marker({
        color: getColorFromCountConfirmed(confirmed),
      })
        .setLngLat([location.lng, location.lat])
        .setPopup(popup)
        .addTo(map);
    }
  });
}

function showDetails(confirmed, recovered, deaths, country) {
  var textToOutput = `
  <div  class="confirmed col-md-4">
    <i class="fas fa-head-side-mask"></i> 
    <p>Casi confermati</p>
    <p id="confirmed">${confirmed}</p>
  </div >
`;
  if (recovered != undefined) {
    textToOutput += `
    <div class="recovered col-md-4">
      <i class="fas fa-heartbeat"></i>
      <p>Ricoverati</p>
      <p id="recovered">${recovered}</p>
    </div>
  `;
  }
  if (deaths != undefined) {
    textToOutput += `
    <div  class="deaths col-md-4">
      <i class="fas fa-cross"></i>
      <p>Deceduti</p>
      <p id="deaths">${deaths}</p>
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

  window.scrollBy(0, 1000);
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
