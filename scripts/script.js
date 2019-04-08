console.log('ok');
const path = 'examples/example_1/';

// input
coords = [];
distances = [];
orders = [];
times = [];
warehouseIndex = 0;
config = {};

//
remainingIndexes = [];

//
rides = [];

// Enum
Limit = {
  "duration": "DURATION",
  "capacity": "CAPACITY",
  "distance": "DISTANCE",
}
// Class
class Ride {
  constructor() {
    this.clientsIndex = [0];
    this.cumulativeDistance = 0;
    this.cumulativeBags = 0;
    this.cumulativeTime = 0;
    this.remainingDistance = config.max_dist;
    this.limit = "";

    let nextIndex = -1;
    do {
      nextIndex = this.getNextPointIndex();
      if (nextIndex > -1) {
        console.log(nextIndex);
        this.addPoint(nextIndex);
      }
    } while (nextIndex > -1 && remainingIndexes.length > 0);
  }

  getLastIndex() {
    let lastIndex = warehouseIndex;
    if (this.clientsIndex.length > 0) {
      lastIndex = this.clientsIndex[this.clientsIndex.length - 1];
    }
    return lastIndex;
  }

  addPoint(newIndex) {

    // Get last truck position
    const lastIndex = this.getLastIndex();

    // Update cumulative data
    const distanceNewPoint = distances[lastIndex][newIndex]
    this.cumulativeDistance += distanceNewPoint;
    this.cumulativeTime += times[lastIndex][newIndex];
    this.cumulativeBags += orders[newIndex - 1];
    this.remainingDistance -= distanceNewPoint;

    remainingIndexes = remainingIndexes.filter(el => { return el !== newIndex; })

    this.clientsIndex.push(newIndex);
  }

  cantNextPoint(newPointIndex) {
    // Pas de surcharge
    if (this.cumulativeBags + orders[newPointIndex - 1] > config.capacity) {
      return Limit.capacity;
    }

    const lastIndex = this.getLastIndex();
    const distanceToPointAndHome = distances[lastIndex, newPointIndex] + distances[newPointIndex, warehouseIndex];
    const timeToPointAndHome = times[lastIndex, newPointIndex] + times[newPointIndex, warehouseIndex];

    // Pas de batterie vide
    if (this.cumulativeDistance + distanceToPointAndHome > config.max_dist) {
      return Limit.distance;
    }
    // Pas d'heure sup
    if (this.cumulativeTime + timeToPointAndHome > config.max_time) {
      return Limit.duration;
    }
    return '';
  }

  getNextPointIndex() {
    let minDistIndex = -1;
    let minDistValue = -1;
    remainingIndexes.forEach(index => {
      const reason = this.cantNextPoint(index);
      if (!reason) {
        const distanceToLastPoint = distances[this.getLastIndex()][index];
        if (minDistIndex == -1 || distanceToLastPoint < minDistValue) { 
          minDistIndex = index;
          minDistValue = distanceToLastPoint;
        }
      } else {
        console.log(index + ': ' + reason);
        return -1;
      }
    });
    return minDistIndex;
  }
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
    if (i > 0) { remainingIndexes.push(Number(i)); }
  }

  do {
    rides.push(new Ride());
    console.log(remainingIndexes);

  } while (remainingIndexes.length > 0);
}).catch();


function evaluation() {
  return 0
    + distanceTotal // km
    + (dureeTotale / 600) // s
    + ((nbVehicule - 1) * 500)
    + (nbViolContrainteDistance * 50000)
    + (nbViolContrainteQuantite * 10000)
    + (nbViolContrainteDuration * 1000)
    + ((nbMissingVisits + nbMultipleVisit) * 100000);
}