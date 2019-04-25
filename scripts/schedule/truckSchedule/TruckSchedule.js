class TruckSchedule {
  constructor() {
    this.rides = [];
  }

  addRide(ride) {
    this.rides.push(ride);
  }

  cantAddRide(ride) {
    if (this.cumulativeTime + ride.cumulativeTime > config.maxDuration) return Limit.duration;
    return '';
  }

  getDistance() {
    return this.rides.map(ride => ride.getDistance()).reduce((acc, curr) => acc + curr);
  }

  getDuration() {
    return this.rides.map(ride => ride.getDuration()).reduce((acc, curr) => acc + curr);
  }

  getBags() {
    return this.rides.map(ride => ride.getBags()).reduce((acc, curr) => acc + curr);
  }

  displayHtml(index) {
    $('#schedule').append(`
    <div class="list-group-item">
      <p># ${index} - ${this.rides.length} rides</p>
      <ul class="list-group">
        ${this.rides.map((ride, i) => ride.displayHtml(i)).reduce((acc, curr) => acc + curr)}
      </ul>
    </div>
    `)
  }

}