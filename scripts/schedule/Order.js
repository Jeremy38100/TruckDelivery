const singleBagDuration = 10; // 10sec
const orderDuration = 5*60; // 5min

class Order {
  constructor(orderIndex, dataset) {
    this.clientIndex = orderIndex;
    this.order = dataset.ordersCount[orderIndex];
    this.coords = dataset.coords[orderIndex];
    this.orderDuration = this.order * singleBagDuration + orderDuration;
    this.distanceToWarehouse = dataset.distances[orderIndex][dataset.warehouseIndex];
    this.durationToWarehouse = dataset.times[orderIndex][dataset.warehouseIndex];
  }
}