class Ride {
  constructor(dataset, remainingOrders, rideIndex) {
    this.rideIndex = rideIndex;
    this.orders = [];
    this.dataset = dataset;

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
    if (this.orders.length == 0) {
      return this.dataset.warehouseIndex
    }
    return this.orders[this.orders.length - 1].clientIndex;
  }

  addOrder(order) {
    this.orders.push(order);
  }

  cantNextOrder(order) {
    // Pas de surcharge
    const orderIndex = order.clientIndex;
    if (this.getBags() + order.order > this.dataset.config.capacity) {
      this.limit = Limit.capacity;
      return this.limit;
    }

    const lastIndex = this.getLastIndex();
    const distanceToPointAndHome = this.dataset.distances[lastIndex][orderIndex] + order.distanceToWarehouse;
    const timeToPointAndHome = this.dataset.times[lastIndex][orderIndex] + order.durationToWarehouse;

    // Pas de batterie vide
    if (this.getDistance() + distanceToPointAndHome > this.dataset.config.max_dist) {
      this.limit = Limit.distance;
      return this.limit;
    }
    // Pas d'heure sup
    if (this.getDuration() + timeToPointAndHome > this.dataset.config.max_time) {
      this.limit = Limit.duration;
      return this.limit;
    }
    return '';
  }

  // override
  getNextOrder(remainingOrders) {
    return null;
  }

  getPointsIndex() {
    return [this.dataset.warehouseIndex].concat(
      this.orders.map(ride => ride.clientIndex),
      [this.dataset.warehouseIndex]
    );
  }

  getDistance() {
    const ordersLength = this.orders.length;
    if (ordersLength == 0) return 0;
    let distance = 0;
    let lastIndex = this.dataset.warehouseIndex;
    for (let order of this.orders) {
      distance += this.dataset.distances[lastIndex][order.clientIndex];
      lastIndex = order.clientIndex;
    }
    distance += this.dataset.distances[lastIndex][this.dataset.warehouseIndex];
    return distance;
  }

  getDuration() {
    const ordersLength = this.orders.length;
    if (ordersLength == 0) return 0;
    let duration = 0;
    let lastIndex = this.dataset.warehouseIndex;
    for (let order of this.orders) {
      duration += this.dataset.times[lastIndex][order.clientIndex];
      duration += order.orderDuration;
      lastIndex = order.clientIndex;
    }
    duration += this.dataset.times[lastIndex][this.dataset.warehouseIndex];
    return duration;
  }

  getBags() {
    if (this.orders.length == 0) return 0;
    return this.orders.map(order => order.order).reduce(accReducer)
  }

  displayHtml() {
    return `
    <li class="list-group-item">
      <span class="badge" style="background-color: ${colorArray[this.rideIndex]}">&nbsp;&nbsp;</span>
      # ${this.rideIndex}
      <span class="badge badge-secondary">${this.orders.length} <i class="fas fa-user"></i></span>
      <span class="badge badge-dark">${this.getBags()} <i class="fas fa-shopping-basket"></i></span>
      <span class="badge badge-secondary">${this.getDistance().toFixed(2)} Km</span>
      <span class="badge badge-dark">${this.getDuration()} sec</span>
    </li>
    `;
  }

}