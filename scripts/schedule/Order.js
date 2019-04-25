const singleBagDuration = 5;
const orderDuration = 10;

class Order {
  constructor(orderIndex) {
    this.clientIndex = orderIndex;
    this.order = ordersDetail[orderIndex];
    this.coords = coords[orderIndex];
    this.orderDuration = this.order * singleBagDuration * orderDuration;
    this.distanceToWarehouse = distances[orderIndex][warehouseIndex];
    this.durationToWarehouse = times[orderIndex][warehouseIndex];
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