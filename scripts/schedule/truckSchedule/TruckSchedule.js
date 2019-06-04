class TruckSchedule {
  constructor(dataset) {
    this.dataset = dataset;
    this.rides = [];
  }

  addRide(ride) {
    this.rides.push(ride);
  }

  cantAddRide(ride) {
    if (this.getDuration() + ride.getDuration() > this.dataset.config.maxDuration) return Limit.duration;
    return '';
  }

  getDistance() {
    return this.rides.map(ride => ride.getDistance()).reduce(accReducer);
  }

  getDuration() {
    if (this.rides.length == 0) return 0;
    return this.rides.map(ride => ride.getDuration()).reduce(accReducer);
  }

  getBags() {
    return this.rides.map(ride => ride.getBags()).reduce(accReducer);
  }

  getNbVioloationConstraint(constraint) {
    return this.rides
      .map(ride => ride.getNbVioloationConstraint(constraint))
      .reduce(accReducer);
  }

  getOrdersIndex() {
    return this.rides
      .map(ride => ride.getOrdersIndex())
      .reduce(concatReducer);
  }

  displayHtml(index) {
    const duration = moment.duration(this.getDuration(), 'seconds');
    $('#schedule').append(`
    <div class="list-group-item">
      <p># ${index}</p>
      <p>
        <span class="badge badge-dark">${this.rides.length} rides</span>
        <span class="badge badge-secondary">${this.getOrdersIndex().length} <i class="fas fa-user"></i></span>
        <span class="badge badge-dark">${this.getBags()} <i class="fas fa-shopping-basket"></i></span>
        <span class="badge badge-secondary">${this.getDistance().toFixed(2)} Km</span>
        <span class="badge badge-dark">${duration.format("hh:mm:ss")} <i class="fas fa-stopwatch"></i></span>
      </p>
      <ul class="list-group">
        ${this.rides.map((ride, i) => ride.displayHtml(i)).reduce(accReducer)}
      </ul>
    </div>
    `)
  }

  drawOnMap(index) {
    this.rides.forEach(drawRide);
  }

  copy() {
    let truckScheduleCopy = new TruckSchedule(this.dataset);
    for (let ride of this.rides) {
      truckScheduleCopy.rides.push(ride.copy());
    }
    return truckScheduleCopy;
  }

}