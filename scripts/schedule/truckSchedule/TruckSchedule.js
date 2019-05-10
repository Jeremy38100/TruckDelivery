class TruckSchedule {
  constructor(dataset) {
    this.dataset = dataset;
    this.rides = [];
  }

  addRide(ride) {
    this.rides.push(ride);
  }

  cantAddRide(ride) {
    if (this.cumulativeTime + ride.cumulativeTime > this.dataset.config.maxDuration) return Limit.duration;
    return '';
  }

  getDistance() {
    return this.rides.map(ride => ride.getDistance()).reduce(accReducer);
  }

  getDuration() {
    return this.rides.map(ride => ride.getDuration()).reduce(accReducer);
  }

  getBags() {
    return this.rides.map(ride => ride.getBags()).reduce(accReducer);
  }

  displayHtml(index) {
    $('#schedule').append(`
    <div class="list-group-item">
      <p># ${index} - ${this.rides.length} rides</p>
      <ul class="list-group">
        ${this.rides.map((ride, i) => ride.displayHtml(i)).reduce(accReducer)}
      </ul>
    </div>
    `)
  }

  drawOnMap(index) {
    this.rides.forEach(drawRide);
  }

}