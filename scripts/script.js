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

// Enum
Limit = {
  "duration": "DURATION",
  "capacity": "CAPACITY",
  "distance": "DISTANCE",
}
// Class
class Ride {
  constructor() {
    this.clientsIndex = [];
    this.cumulativeDistance = 0;
    this.cumulativeBags = 0;
    this.cumulativeTime = 0;
    this.remainingDistance = config.max_dist;
    this.limit = "";
  }

  getLastIndex() {
    let lastIndex = warehouseIndex;
    if (this.clientsIndex.length > 0) {
      lastIndex = this.clientsIndex[this.clientsIndex.length - 1];
    }
    return lastIndex;
  }

  addPoint(newIndex) {
    this.clientsIndex.push(newIndex);

    // Get last truck position
    const lastIndex = this.getLastIndex();
    const distanceNewPoint = distances[lastIndex, newIndex];
    // Update cumulative data
    this.cumulativeDistance += distanceNewPoint;
    this.cumulativeTime += times[lastIndex, newIndex];
    this.cumulativeBags += orders[newIndex];
    this.remainingDistance -= distanceNewPoint;
  }

  cantNextPoint(newPointIndex) {
    if (this.cumulativeBags + orders[newPointIndex] > config.capacity) {
      return Limit.capacity;
    }

    const lastIndex = this.getLastIndex();
    const distanceToPointAndHome = distances[lastIndex, newIndex] + distances[newIndex, warehouseIndex];
    const timeToPointAndHome = times[lastIndex, newIndex] + times[newIndex, warehouseIndex];

    if (this.cumulativeDistance + distanceToPointAndHome > config.max_dist) {
      return Limit.distance;
    }
    if (this.cumulativeTime + timeToPointAndHome > config.max_time) {
      return Limit.duration;
    }
    return '';
  }
}

function getNextPointIndex(ride) {
  let minDistIndex = -1;
  let minDistValue = -1;
  remainingIndexes.forEach(index => {
    const reason = ride.cantNextPoint(index);
    if (!reason) {
      if (index == -1) { minDistIndex = index}
      const distanceToLastPoint = distances[ride.getLastIndex(), index];
      if (distanceToLastPoint < minDistValue) {
        minDistIndex = index;
        minDistValue = distanceToLastPoint;
      }
    }
  });
  return minDistIndex;
}

function detourDistances() {

}

// TODO
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
}).catch();