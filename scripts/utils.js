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
      coordsFile.split('\n').forEach(xy => {
        if (!xy) { return; }
        coords.push(xy.split(',').map(Number))
      });
      warehouseIndex = coordsFile.length - 1;
      resolve();
    }).catch();
  });
}

function getOrders() {
  return new Promise((resolve, reject) => {
    getFile(path + 'demandes.txt').then(ordersFile => {
      ordersFile.split('\n').forEach(order => {
        if (order) { ordersDetail.push(Number(order)); }
      });
      resolve();
    }).catch();
  });
}

function getDistances() {
  return new Promise((resolve, reject) => {
    getFile(path + 'distances.txt').then(distancesFile => {
      distancesFile.split('\n').forEach(line => {
        if (!line) { return; }
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
        if (!line) { return; }
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
      data.replace(/ /g,'').split('\n').forEach(conf => {
        const keyValue = conf.split('=');
        if (keyValue.length != 2) { return; }
        config[keyValue[0]] = JSON.parse(keyValue[1]);
      });
      if (!config.end_time || !config.start_time) reject('missing config time');
      const endStartSplit = [config.end_time, config.start_time].map(time => time.split(':'));
      const endSec = endStartSplit[0][0] * (60*60) + endStartSplit[0][1] * (60);
      const startSec = endStartSplit[1][0] * (60*60) + endStartSplit[1][1] * (60);
      config.maxDuration = endSec - startSec;
      resolve();
    }).catch();
  });
}