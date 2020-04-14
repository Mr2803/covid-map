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
      <button onclick='showDetails(${confirmed},${deaths},${recovered})' class="details">Guarda dettagli</button>`
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
    // const buttons = document.querySelectorAll("details");
    // console.log(buttons);
    // buttons.forEach((button) => {
    //   button.addEventListener("click", () => {
    //     console.log("hello");
    //   });
    // });
  });
}

function showDetails(confirmed, recovered, deaths) {
  if (recovered == undefined && deaths == undefined) {
    output.innerHTML = `
    <div  class="confirmed">
     <i class="fas fa-head-side-mask"></i> 
  <p> ${confirmed}</p>
    </div>
    
  `;
  } else if (recovered == undefined) {
    output.innerHTML = `<div class="confirmed">
     <i class="fas fa-head-side-mask"></i> 
     <p>casi confermati</p>
     <p>${confirmed}</p>
    </div>
    <div  class="deaths">
  <i class="fas fa-cross"></i>
   <p>Deceduti</p>
  <p>${deaths}</p>
    </div>`;
  } else if (deaths == undefined) {
    output.innerHTML = `<div  class="confirmed">
     <i class="fas fa-head-side-mask"></i> 
     <p>casi confermati</p>
     <p>${confirmed}</p>
    </div>
    <div  class="recovered">
  <i class="fas fa-heartbeat"></i>
  <p>Ricoverati</p>
  <p>${recovered}</p>
    </div>`;
  } else {
    output.innerHTML = `
    <div  class="confirmed">
     <i class="fas fa-head-side-mask"></i> 
     <p>Casi confermati</p>
<p>${confirmed}</p>
    </div >
    <div class="recovered">
  <i class="fas fa-heartbeat"></i>
  <p>Ricoverati</p>
<p>${recovered}</p>
    </div>
    <div  class="deaths">
  <i class="fas fa-cross"></i>
  <p>Deceduti</p>
  <p>${deaths}</p>
    </div>`;
  }
}
