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

function getFile(fileName) {
  return new Promise((resolve, reject) => {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          resolve(this.response);
        }
      };
      xhttp.open("GET", fileName, true);
      xhttp.send();
  })
}

function getCoords() {
  return new Promise((resolve, reject) => {
    getFile(path + 'coords.txt').then(coordsFile => {
      coordsFile.split('\n').forEach(xy => {coords.push(xy.split(',').map(Number))});
      warehouseIndex = coordsFile.length - 1;
      resolve();
    }).catch();
  });
}

function getOrders() {
  return new Promise((resolve, reject) => {
    getFile(path + 'demandes.txt').then(ordersFile => {
      ordersFile.split('\n').forEach(order => {
        if (order) { orders.push(Number(order)); }
      });
      resolve();
    }).catch();
  });
}

function getDistances() {
  return new Promise((resolve, reject) => {
    getFile(path + 'distances.txt').then(distancesFile => {
      distancesFile.split('\n').forEach(line => {
        distancesLine = [];
        line.split(' ').forEach(distance => {
          if (distance.length > 0) {
            distancesLine.push(Number(distance));
          }
        });
        distances.push(distancesLine);
      });
      resolve();
    }).catch();
  });
}

function getTimes() {
  return new Promise((resolve, reject) => {
    getFile(path + 'times.txt').then(timesFile => {
      timesFile.split('\n').forEach(line => {
        timesLine = [];
        line.split(' ').forEach(time => {
          if (time.length > 0) {
            timesLine.push(Number(time));
          }
        });
        times.push(timesLine);
      });
      resolve();
    }).catch();
  });
}

function getVehicule() {
  return new Promise((resolve, reject) => {
    getFile(path + 'vehicle.ini').then(data => {
      console.log(data.replace(/ /g,'').split('\n').forEach(conf => {
        const keyValue = conf.split('=');
        if (keyValue.length != 2) { return; }
        config[keyValue[0]] = JSON.parse(keyValue[1]);
      }));
      // TODO calculate max_time
      resolve();
    }).catch();
  });
}

Promise.all([
    getCoords(),
    getDistances(),
    getTimes(),
    getOrders(),
    getVehicule()]).then(() => {
  console.log(coords);
  console.log(distances);
  console.log(times);
  console.log(orders);
  console.log(config);
}).catch();
