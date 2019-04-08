const path = 'examples/example_2/';

// input
coords = [];
distances = [];
orders = [];
times = [];
warehouseIndex = 0;
config = {};

//
indexes = [];

//
// rides = [];

// Enum
Limit = {
  "duration": "DURATION",
  "capacity": "CAPACITY",
  "distance": "DISTANCE",
}

// n^2
function preprocessDetour() {
  for (let index in coords) {
    for (let index2 in coords) {
      if (index !== index2) {
      }
    }
  }
}
// Preprocess coordinates
// for each point point A :
//   for each point B :
//     detour['distance'][A-B] = distance(A->B->entrepot) - distance(A->entrepot)
//     temps['distance'][A-B] = temps(A->B->entrepot) - temps(A->entrepot)

function init () {
  Promise.all([
      getCoords(),
      getDistances(),
      getTimes(),
      getOrders(),
      getVehicule()]).then(() => {
      console.log('coords');
      console.log(coords);
      console.log('distances');
      console.log(distances);
      console.log('times');
      console.log(times);
      console.log('orders');
      console.log(orders);
      console.log('config');
      console.log(config);

    for (i in coords) {
      if (i > 0) { indexes.push(Number(i)); }
    }

    MinDistRide.calculate(indexes.slice(0));
    IterativeRide.calculate(indexes.slice(0));
    // MinDistRide.calculate(indexes.slice(0));
    draw(map, coords);

  }).catch();
}

function draw(map, allCoords) {
  for (let i =0; i < allCoords.length - 1; i++) {
    const coords = allCoords[i];
    let marker = L.marker(coords, {icon: L.AwesomeMarkers.icon({
      icon: 'user',
      prefix: 'fa',
      markerColor: 'blue',
      iconColor: '#0000A0'
    }) }).addTo(map);
  }
  // entrepot
  const entrepotCoords = allCoords[allCoords.length - 1];
  let marker = L.marker(entrepotCoords, {icon: L.AwesomeMarkers.icon({
    icon: 'archive',
    prefix: 'fa',
    markerColor: 'red',
    iconColor: '#8b0000'
  }) }).addTo(map);
  map.panTo(new L.LatLng(entrepotCoords[0], entrepotCoords[1]));
}

function evaluation(rides) {
  let result = 0;
  for (ride of rides) {
    result += ride.distance();
    result += ride.time();
  }
  result += rides.length;
  return result;
}