map = null;

window.onload = function(){
  map = L.map('mapid').setView([51.505, -0.09], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  init();
}

function drawWarehouseOnMap() {
  const warehouseCoords = coords[coords.length - 1];
  const marker = L.marker(warehouseCoords, {icon: L.AwesomeMarkers.icon({
    icon: 'archive',
    prefix: 'fa',
    markerColor: 'red',
    iconColor: '#8b0000'
  }) }).addTo(map);
  map.panTo(new L.LatLng(warehouseCoords[0], warehouseCoords[1]));
}