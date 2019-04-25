class Rides {
  constructor(rides) {
    this.rides = rides;

    this.cumulativeDistance = 0;
    this.cumulativeBags = 0;
    this.cumulativeTime = 0;

    this.trucks = [];

    this.nbViolationConstraintDistance = 0;
    this.nbViolationConstraintBags = 0;
    this.nbViolationConstraintDuration = 0;

    this.nbMissingVisits = 0;
    this.nbMultipleVisit = 0;

    let truckSchedule = new TruckSchedule();
    this.rides.forEach(ride => {
      if (truckSchedule.cumulativeTime + ride.cumulativeTime <= config.maxDuration) {
        truckSchedule.addRide(ride);
      } else {
        this.trucks.push(truckSchedule);
        truckSchedule = new TruckSchedule();
      }
    });
    if (truckSchedule.cumulativeDistance > 0) this.trucks.push(truckSchedule);
  }

  getScore() {
    return this.cumulativeDistance // km
      + (this.cumulativeTime / 600) // s
      + ((this.nbTrucks -1) * 500)
      + (this.nbViolationConstraintDistance * 50000)
      + (this.nbViolationConstraintBags * 10000)
      + (this.nbViolationConstraintDuration * 1000)
      + ((this.nbMissingVisits + this.nbMultipleVisit) * 100000);
  }
}