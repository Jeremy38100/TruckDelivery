let colorArray = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
      '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
      '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
      '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
      '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
      '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
      '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
      '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
      '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
      '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];
let colorIndex = 0;

class Ride {
  constructor(remainingIndexes, depotIndex) {
    this.clientsIndex = [depotIndex];
    this.cumulativeDistance = 0;
    this.cumulativeBags = 0;
    this.cumulativeTime = 0;
    this.remainingDistance = config.max_dist;
    this.limit = "";
    this.remainingIndexes = remainingIndexes

    let nextIndex = -1;
    do {
      nextIndex = this.getNextPointIndex();
      if (nextIndex > -1) {
        this.addPoint(nextIndex);
      }
    } while (nextIndex > -1 && this.remainingIndexes.length > 0);
  }

  getLastIndex() {
    return this.clientsIndex[this.clientsIndex.length - 1];
  }

  addPoint(newIndex) {

    // Get last truck position
    const lastIndex = this.getLastIndex();

    // Update cumulative data
    const distanceNewPoint = distances[lastIndex][newIndex]
    this.cumulativeDistance += distanceNewPoint;
    this.cumulativeTime += times[lastIndex][newIndex];
    this.cumulativeBags += orders[newIndex];
    this.remainingDistance -= distanceNewPoint;

    this.remainingIndexes = this.remainingIndexes.filter(el => { return el !== newIndex; })

    this.clientsIndex.push(newIndex);
  }

  cantNextPoint(newPointIndex) {
    // Pas de surcharge
    if (this.cumulativeBags + orders[newPointIndex] > config.capacity) {
      this.limit = Limit.capacity;
      return this.limit;
    }

    const lastIndex = this.getLastIndex();
    const distanceToPointAndHome = distances[lastIndex, newPointIndex] + distances[newPointIndex, warehouseIndex];
    const timeToPointAndHome = times[lastIndex, newPointIndex] + times[newPointIndex, warehouseIndex];

    // Pas de batterie vide
    if (this.cumulativeDistance + distanceToPointAndHome > config.max_dist) {
      this.limit = Limit.distance;
      return this.limit;
    }
    // Pas d'heure sup
    if (this.cumulativeTime + timeToPointAndHome > config.max_time) {
      this.limit = Limit.duration;
      return this.limit;
    }
    return '';
  }

  getNextPointIndex() {
    return -1;
  }

  distance() {
    let distance = 0;
    const clientsLength = this.clientsIndex.length;
    for (let index = 0; index < clientsLength - 1; index++) {
      distance += distances[index][index + 1];
    }
    return distance;
  }

  time() {
    let time = 0;
    const clientsLength = this.clientsIndex.length;
    for (let index = 0; index < clientsLength - 1; index++) {
      time += times[this.clientsIndex[index]][this.clientsIndex[index + 1]];
    }
    return time;
  }

  bags() {
    let bags = 0;
    this.clientsIndex.forEach((clientIndex, i, arr) => {
      if(i > 0 && i < arr.length - 1) {
        bags += orders[clientIndex];
      }
    });
    return bags;
  }

  static calculate(remainingIndexes) {
  }

  drawOnMap(index) {
    let latlngs = this.clientsIndex.map(i => {
      return coords[i];
    })
    let polyline = L.polyline(latlngs, {
      color: colorArray[index],
      opacity: 1
    }).addTo(map);
  }

  appendToTable(index) {
    const tableBody = $('#tableBody');
    tableBody.append(`
    <tr>
      <td><span class="badge" style="background-color: ${colorArray[index]}">&nbsp;&nbsp;&nbsp;</span> ${index}</td>
      <td>${this.cumulativeDistance.toFixed(2)}</td>
      <td>${this.cumulativeBags}</td>
      <td>${this.cumulativeTime}</td>
      <td>${this.remainingDistance.toFixed(2)}</td>
      <td>${this.limit}</td>
      <td>${this.getOrdersHtml(index)}</td>
    </tr>`);
  }

  getOrdersHtml(index) {
     let html =`
    <div id="accordion"
      <div class="card">
        <div class="card-header p-0" id="heading-${index}">
          <h5 class="mb-0">
            <button class="btn btn-link" data-toggle="collapse" data-target="#collapse-${index}" aria-expanded="true" aria-controls="collapse-${index}">
              ${this.clientsIndex.length - 2} clients
            </button>
          </h5>
        </div>

        <div id="collapse-${index}" class="collapse" aria-labelledby="heading-${index}" data-parent="#accordion">
          <div class="card-body p-0">
            <ul>
    `
    this.clientsIndex.forEach((clientIndex, index, array) => {
      if (index == 0 || index == array.length - 1) return;
      html += `
      <li># ${clientIndex} - ${orders[clientIndex]}</li>
      `;
    });
    html += `
            </ul>
          </div>
        </div>
      </div>
    </div>
    `;
    return html;
  }

}