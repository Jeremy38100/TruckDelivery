map = null;

let warehouseMarker;
let customerMarkers;
let ridesPolyline;

window.onload = function(){
  map = L.map('mapid').setView([51.505, -0.09], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  warehouseMarker = L.layerGroup().addTo(map);
  customerMarkers = L.layerGroup().addTo(map);
  ridesPolyline = L.layerGroup().addTo(map);
  init();
}

function drawWarehouse(coords) {
  L.marker(coords, {icon: L.AwesomeMarkers.icon({
    icon: 'archive',
    prefix: 'fa',
    markerColor: 'red',
    iconColor: '#8b0000'
  }) }).addTo(warehouseMarker);
}

function drawOrder(order) {
  let marker = L.marker(order.coords, {icon: L.AwesomeMarkers.icon({
    icon: 'user',
    prefix: 'fa',
    markerColor: 'blue',
    iconColor: '#0000A0'
  }) });
  marker.bindPopup(`#${order.clientIndex} : ${order.order} <i class="fas fa-shopping-basket"></i>`);
  marker.addTo(customerMarkers);
}

function drawRide(ride) {
  let latlngs = ride.getPointsIndex().map(i => ride.dataset.coords[i]);
  L.polyline(latlngs, {
    color: colorArray[ride.rideIndex],
    opacity: 1,
    weight: 8
  }).addTo(ridesPolyline);
}

function resetMap() {
  warehouseMarker.clearLayers();
  customerMarkers.clearLayers();
  ridesPolyline.clearLayers();
}

function centerTo(coords) {
  map.panTo(new L.LatLng(coords[0], coords[1]));
}