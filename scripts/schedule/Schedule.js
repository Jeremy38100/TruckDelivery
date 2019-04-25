class Schedule {
  constructor(orders, rideType) {

    this.cumulativeDistance = 0;
    this.cumulativeBags = 0;
    this.cumulativeTime = 0;

    this.nbViolationConstraintDistance = 0;
    this.nbViolationConstraintBags = 0;
    this.nbViolationConstraintDuration = 0;

    this.nbMissingVisits = 0;
    this.nbMultipleVisit = 0;

    while (orders.length > 0) {

    }
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