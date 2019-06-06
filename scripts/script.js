// Enum
Limit = {
  "duration": "DURATION",
  "capacity": "CAPACITY",
  "distance": "DISTANCE",
}

Constraints = {
  "DURATION": "DURATION",
  "DISTANCE": "DISTANCE",
  "BAGS": "BAGS"
}

const rides = [MinDistRide, RandomRide]; // IterativeRide
const neighborhoods = [SwapOrderNeighborhood, AddTruckNeighborhood];
datasets = [];

let selectedDataset = null;
let selectedRide = null;
let selectedNeighborhood = null;

let selectedSchedule = null;

let lastFileName = '';
let lastFileValue = 'abc\nabc';

function init() {
  getDatasets().then(() => {
    console.log(datasets);
    Promise.all(datasets.map(dataset => dataset.loadDataset()))
      .then(() => {
        console.log('ok');
        printRides();
        printNeighborhoods();
      }).catch(err => console.error(err));

    $('#select-dataset').change(update);
    $('#select-ride').change(update);
    $('#select-neighborhood').change(update);

  }).catch();
}

function printRides() {
  const rideSelect = $('#select-ride');
  rides.forEach((ride, index) => {
    rideSelect.append(`<option value="${index}">${ride.name}</option>`);
  })
}

function printNeighborhoods() {
  const neighborhoodsSelect = $('#select-neighborhood');
  neighborhoods.forEach((neighborhood, index) => {
    neighborhoodsSelect.append(`<option value="${index}">${neighborhood.name}</option>`);
  })
}

async function update() {
  await showSpinner();
  const dataset = $('#select-dataset').val();
  const ride = $('#select-ride').val();
  const neighb = $('#select-neighborhood').val();

  selectedDataset = datasets.find(ex => ex.name == dataset);
  selectedRide = rides[Number(ride)];
  selectedNeighborhood = neighborhoods[Number(neighb)];
  if (!selectedDataset || !selectedRide || !selectedNeighborhood) {
    console.error("dataset or ride or neighborhood not found");
    return -1;
  }

  $('#nbOrders').text(selectedDataset.orders.length);
  const startMs = new Date();
  selectedSchedule = new Schedule(selectedDataset, selectedRide);
  selectedSchedule.displayHtml();
  selectedSchedule.drawOnMap();
  $('#before').text(selectedSchedule.getScore().toFixed(3));

  let neighborhood = new selectedNeighborhood(selectedSchedule);
  const isExhaustive = $('#radioExhaustive').prop('checked');
  if (isExhaustive) {
    neighborhood.process();
  } else {
    neighborhood.process2();
  }
  neighborhood.lastSchedule.displayHtml();
  neighborhood.lastSchedule.drawOnMap();
  $('#after').text(neighborhood.lastSchedule.getScore().toFixed(3));
  $('#iterations').text(neighborhood.nbOptimisation);
  $('#spinner').hide();
  $('#time').text(new Date() - startMs);
  lastFileName = $('#select-dataset').val()
      + '_' + rides[$('#select-neighborhood').val()].name
      + '_' + neighborhoods[ $('#select-neighborhood').val()].name
      + '_' + isExhaustive ? 'exhaustive' : 'non_exhaustive'
      + '.txt';
  lastFileValue = neighborhood.lastSchedule.export();
  $('#dwnButton').show();
}

function showSpinner() {
  return new Promise((res, rej) => {
    $('#spinner').show();
    $('#dwnButton').hide();
    setTimeout(res, 10);
  });
}

function resetHtml() {
  $('#score').empty();
  $('#schedule').empty();
}

function download() {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(lastFileValue));
  element.setAttribute('download', lastFileName);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}