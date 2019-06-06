class FillUpRide extends Ride {
  constructor() {
    this.timeoutFillUp = 3600;
  }

  getLastIndex() {
    return null;
  }

  cantNextOrder(order) {
  }

  // override
  getNextOrder(remainingOrders) {
    return null;
  }

  getPointsIndex() { return []; }

  getDistance() { return 0; }

  getDuration() { return this.timeoutFillUp; }

  getBags() { return 0; }

  getNbVioloationConstraint(constraint) { return 0; }

  getOrdersIndex() { return []; }

  displayHtml() {
    const duration = moment.duration(this.getDuration(), 'seconds');
    return `
    <li class="list-group-item">
      ⛽
      <span class="badge badge-dark">${duration.format("hh:mm:ss")} <i class="fas fa-stopwatch"></i></span>
    </li>
    `;
  }

  copy() {
    return this;
  }

  export() {
    return 'C';
  }
}

const fillUpRide = new FillUpRide();