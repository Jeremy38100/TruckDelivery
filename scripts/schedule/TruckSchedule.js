class TruckSchedule {
  constructor() {
    this.rides = [];

    this.cumulativeDistance = 0;
    this.cumulativeBags = 0;
    this.cumulativeTime = 0;
  }

  addRide(ride) {
    this.rides.push(ride);

    this.cumulativeDistance += ride.cumulativeDistance;
    this.cumulativeBags += ride.cumulativeBags;
    this.cumulativeTime += ride.cumulativeTime;
  }

}