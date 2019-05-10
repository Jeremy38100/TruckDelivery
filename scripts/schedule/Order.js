const singleBagDuration = 5;
const orderDuration = 10;

class Order {
  constructor(orderIndex, dataset) {
    this.clientIndex = orderIndex;
    this.order = dataset.ordersCount[orderIndex];
    this.coords = dataset.coords[orderIndex];
    this.orderDuration = this.order * singleBagDuration * orderDuration;
    this.distanceToWarehouse = dataset.distances[orderIndex][dataset.warehouseIndex];
    this.durationToWarehouse = dataset.times[orderIndex][dataset.warehouseIndex];
  }
}