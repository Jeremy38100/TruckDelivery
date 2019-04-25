class Schedule {
  constructor(orders) {

    this.nbViolationConstraintDistance = 0;
    this.nbViolationConstraintBags = 0;
    this.nbViolationConstraintDuration = 0;

    this.nbMissingVisits = 0;
    this.nbMultipleVisit = 0;

    this.truckSchedules = [];
    let truckSchedule = new TruckSchedule();
    let rideIndex = 0;
    while (orders.length > 0) {
      let ride = new MinDistRide(orders, rideIndex);

      if (truckSchedule.cantAddRide(ride)) {
        this.truckSchedules.push(truckSchedule);
        truckSchedule = new TruckSchedule();
      }
      truckSchedule.addRide(ride);
      // TODO if an order can't be processed
      // ride.drawOnMap();
      rideIndex++;
    }
    this.truckSchedules.push(truckSchedule);
  }


  getBags() {
    return this.truckSchedules
      .map(truckSchedule => truckSchedule.getBags())
      .reduce((acc, curr) => acc + curr);
  }

  getDistance() {
    return this.truckSchedules
      .map(truckSchedule => truckSchedule.getDistance())
      .reduce((acc, curr) => acc + curr);
  }

  getDuration() {
    return this.truckSchedules
      .map(truckSchedule => truckSchedule.getDuration())
      .reduce((acc, curr) => acc + curr);
  }

  getScore() {
    return this.getDistance() // km
      + (this.getDuration() / 600) // s
      + ((this.truckSchedules.length - 1) * 500)
      + (this.nbViolationConstraintDistance * 50000)
      + (this.nbViolationConstraintBags * 10000)
      + (this.nbViolationConstraintDuration * 1000)
      + ((this.nbMissingVisits + this.nbMultipleVisit) * 100000);
  }

  displayHtml() {
    $('#score').text(this.getScore().toFixed(3));
    this.truckSchedules.forEach((truckSchedule, index) => {
      truckSchedule.displayHtml(index);
    });
  }
}