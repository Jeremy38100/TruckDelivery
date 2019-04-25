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
  constructor(remainingOrders) {
    this.orders = [];
    this.pointsIndex = [warehouseIndex];

    this.cumulativeDistance = 0;
    this.cumulativeBags = 0;
    this.cumulativeTime = 0;

    this.remainingDistance = config.max_dist;
    this.limit = "";

    let nextOrder = null;
    do {
      nextOrder = this.getNextOrder(remainingOrders);
      if (nextOrder) {
        this.addOrder(nextOrder, remainingOrders);
        const orderIndex = remainingOrders.findIndex(order => {
          return order.clientIndex == nextOrder.clientIndex;
        });
        if (orderIndex >= 0) remainingOrders.splice(orderIndex, 1);
      }
    } while (nextOrder && remainingOrders.length > 0);
  }

  getLastIndex() {
    return this.pointsIndex[this.pointsIndex.length - 1];
  }

  addPoint(newIndex) {
    const lastIndex = this.getLastIndex();

    this.cumulativeTime += times[lastIndex][newIndex];

    const distanceNewPoint = distances[lastIndex][newIndex]
    this.cumulativeDistance += distanceNewPoint;
    this.remainingDistance -= distanceNewPoint;

    this.pointsIndex.push(newIndex);
  }

  addOrder(order) {
    const orderIndex = order.clientIndex;
    addPoint(orderIndex);

    this.cumulativeBags += order.order;
    this.cumulativeTime += order.orderDuration
    this.orders.push(order);
  }

  cantNextOrder(order) {
    // Pas de surcharge
    const orderIndex = order.clientIndex;
    if (this.cumulativeBags + order.order > config.capacity) {
      this.limit = Limit.capacity;
      return this.limit;
    }

    const lastIndex = this.getLastIndex();
    const distanceToPointAndHome = distances[lastIndex, orderIndex] + distanceToWarehouse;
    const timeToPointAndHome = times[lastIndex, orderIndex] + durationToWarehouse;

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

  getNextOrder(remainingOrders) {
    return null;
  }

  distance() {
    let distance = 0;
    const clientsLength = this.clientsIndex.length;
    if (clientsLength < 2) console.error("clientsLength < 2");
    for (let index = 1; index < clientsLength; index++) {
      distance += distances[index - 1][index];
    }
    return distance;
  }

  time() {
    let time = 0;
    const clientsLength = this.clientsIndex.length;
    if (clientsLength < 2) console.error("clientsLength < 2");
    for (let index = 1; index < clientsLength; index++) {
      time += times[this.clientsIndex[index-1]][this.clientsIndex[index]];
      if (index < clientIndex - 1) {
        // TODO + delivery time (constant + forEach bag)
      }
    }
    return time;
  }

  bags() {
    let bags = 0;
    this.clientsIndex.forEach((clientIndex, i, arr) => {
      if(i > 0 && i < arr.length - 1) {
        bags += ordersDetail[clientIndex];
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
            <ul class="list-group list-group-flush">
    `
    this.clientsIndex.forEach((clientIndex, index, array) => {
      if (index == 0 || index == array.length - 1) return;
      html += `
      <li class="list-group-item"><i class="fa fa-user"></i> #${clientIndex} - ${ordersDetail[clientIndex]} <i class="fa fa-suitcase"></i></li>
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