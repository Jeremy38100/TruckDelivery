// daily schedule
class Schedule {
  constructor(dataset, rideStartegy, isCopy) {

    this.dataset = dataset;

    this.truckSchedules = [];

    if (isCopy) return;

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
      + (this.getNbVioloationConstraint(Constraints.BAGS) * 50000)
      + (this.getNbVioloationConstraint(Constraints.DISTANCE) * 10000)
      + (this.getNbVioloationConstraint(Constraints.DURATION) * 1000)
      + ((this.getNbMissingVisit() + this.getNbMultipleVisit()) * 100000);
  }

  getNbVioloationConstraint(constraint) {
    return this.truckSchedules
      .map(truckSchedule => truckSchedule.getNbVioloationConstraint(constraint))
      .reduce(accReducer);
  }

  displayHtml() {
    resetHtml();
    $('#score').text(this.getScore().toFixed(4));
    this.truckSchedules.forEach((truckSchedule, index) => {
      truckSchedule.displayHtml(index);
    });
  }

  getOrdersIndex() {
    return this.truckSchedules
      .map(truckSchedule => truckSchedule.getOrdersIndex())
      .reduce(concatReducer);
  }

  getNbMissingVisit() {
    const ordersIndex = this.getOrdersIndex();
    let nbMissing = 0;
    for (let order of this.dataset.orders) {
      if (!ordersIndex.includes(order.clientIndex)) {
        nbMissing++;
      }
    }
    return nbMissing;
  }

  getNbMultipleVisit() {
    const ordersIndex = this.getOrdersIndex();
    let nbMultiple = 0;
    for (let order of this.dataset.orders) {
      if (count(ordersIndex, order.clientIndex) > 1) {
        nbMultiple++;
      }
    }
    return nbMultiple;
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

  copy() {
    let scheduleCopy = new Schedule(this.dataset, this.rideStartegy, true);
    for (let truckSchedule of this.truckSchedules) {
      scheduleCopy.truckSchedules.push(truckSchedule.copy());
    }
    return scheduleCopy;
  }

  print() {
    for (let truckSchedule of this.truckSchedules) {
      for (let ride of truckSchedule.rides) {
        console.log(ride.orders.map(o => o.clientIndex).join());
      }
      console.log('------');
    }
    console.log('distance: ' + this.getDistance());
    console.log('duration: ' + this.getDuration());
    console.log('------');
  }

  swap(aIndex, bIndex) {
    const bOrder = this.getOrderFromIndex(bIndex);

    this.setOrderFromIndex(bIndex, this.getOrderFromIndex(aIndex));
    this.setOrderFromIndex(aIndex, bOrder);
  }

  setOrderFromIndex(index, order) {
    this.truckSchedules[index.truckScheduleIndex]
        .rides[index.rideIndex].orders[index.orderIndex] = order;
  }

  getOrderFromIndex(index) {
    return this.getRideFromIndex(index).orders[index.orderIndex];
  }

  getRideFromIndex(index) {
    return this.getTruckScheduleFromIndex(index).rides[index.rideIndex];
  }

  getTruckScheduleFromIndex(index) {
    return this.truckSchedules[index.truckScheduleIndex];
  }

  export() {
    return this.truckSchedules.map(t => t.export()).join('\n');
  }
}

class OrderInSchedule {
  constructor() {
    this.truckScheduleIndex = 0;
    this.rideIndex = 0;
    this.orderIndex = 0;
  }
}