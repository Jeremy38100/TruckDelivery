const singleBagDuration = 5;
const orderDuration = 10;

class Order {
  constructor(orderIndex) {
    this.clientIndex = orderIndex;
    this.order = ordersDetail[orderIndex];
    this.orderDuration = this.order * singleBagDuration * orderDuration;
    this.distanceToWarehouse = distances[orderIndex][warehouseIndex];
    this.durationToWarehouse = times[orderIndex][warehouseIndex];
  }
}