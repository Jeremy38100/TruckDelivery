const singleBagDuration = 5;
const orderDuration = 10;

class Order {
  constructor(orderIndex, example) {
    this.clientIndex = orderIndex;
    this.order = example.ordersCount[orderIndex];
    this.coords = example.coords[orderIndex];
    this.orderDuration = this.order * singleBagDuration * orderDuration;
    this.distanceToWarehouse = example.distances[orderIndex][example.warehouseIndex];
    this.durationToWarehouse = example.times[orderIndex][example.warehouseIndex];
  }

  drawOnMap() {
    let marker = L.marker(this.coords, {icon: L.AwesomeMarkers.icon({
      icon: 'user',
      prefix: 'fa',
      markerColor: 'blue',
      iconColor: '#0000A0'
    }) }).addTo(map).bindPopup(`#${this.clientIndex} : ${this.order} <i class="fas fa-shopping-basket"></i>`);
  }
}