colorArray = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
      '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
      '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
      '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
      '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
      '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
      '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
      '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
      '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
      '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

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
      warehouseIndex = coords.length - 1;
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