class Schedule {
  constructor(dataset, rideStartegy) {

    this.dataset = dataset;

    this.nbViolationConstraintDistance = 0;
    this.nbViolationConstraintBags = 0;
    this.nbViolationConstraintDuration = 0;

    this.nbMissingVisits = 0;
    this.nbMultipleVisit = 0;

    this.truckSchedules = [];
    let truckSchedule = new TruckSchedule(dataset);
    let rideIndex = 0;
    let remainingOrders = JSON.parse(JSON.stringify(dataset.orders))
    while (remainingOrders.length > 0) {
      let ride = new rideStartegy(dataset, remainingOrders, rideIndex);

      if (truckSchedule.cantAddRide(ride)) {
        this.truckSchedules.push(truckSchedule);
        truckSchedule = new TruckSchedule(dataset);
      }
      truckSchedule.addRide(ride);
      // TODO if an order can't be processed
      rideIndex++;
    }
    this.truckSchedules.push(truckSchedule);
  }


  getBags() {
    return this.truckSchedules
      .map(truckSchedule => truckSchedule.getBags())
      .reduce(accReducer);
  }

  getDistance() {
    return this.truckSchedules
      .map(truckSchedule => truckSchedule.getDistance())
      .reduce(accReducer);
  }

  getDuration() {
    return this.truckSchedules
      .map(truckSchedule => truckSchedule.getDuration())
      .reduce(accReducer);
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
    resetHtml();
    $('#score').text(this.getScore().toFixed(4));
    this.truckSchedules.forEach((truckSchedule, index) => {
      truckSchedule.displayHtml(index);
    });
  }

  drawOnMap() {
    resetMap();
    const warehouseCoords = this.dataset.coords[this.dataset.warehouseIndex]
    centerTo(warehouseCoords)
    drawWarehouse(warehouseCoords);
    this.dataset.orders.forEach(drawOrder);
    this.truckSchedules.forEach((truckSchedule, index) => {
      truckSchedule.drawOnMap(index);
    });
  }
}