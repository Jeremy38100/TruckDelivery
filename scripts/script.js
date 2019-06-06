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
const neighbourhoods = [SwapOrderNeighbourhood, SwapRandomNeighbourhood, AddTruckNeighbourhood];
datasets = [];

let selectedDataset = null;
let selectedRide = null;
let selectedNeighbourhood = null;

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
        printNeighbourhoods();
      }).catch(err => console.error(err));

    $('#select-dataset').change(update);
    $('#select-ride').change(update);
    $('#select-neighbourhood').change(update);
    $('#radioExhaustive').change(update);
    $('#radioNonExhaustive').change(update);

  }).catch();
}

function printRides() {
  const rideSelect = $('#select-ride');
  rides.forEach((ride, index) => {
    rideSelect.append(`<option value="${index}">${ride.name}</option>`);
  })
}

function printNeighbourhoods() {
  const neighbourhoodsSelect = $('#select-neighbourhood');
  neighbourhoods.forEach((neighbourhood, index) => {
    neighbourhoodsSelect.append(`<option value="${index}">${neighbourhood.name}</option>`);
  })
}

// Recalculate function when change inputs
async function update() {
  await showSpinner();
  const dataset = $('#select-dataset').val();
  const ride = $('#select-ride').val();
  const neighb = $('#select-neighbourhood').val();

  selectedDataset = datasets.find(ex => ex.name == dataset);
  selectedRide = rides[Number(ride)];
  selectedNeighbourhood = neighbourhoods[Number(neighb)];
  if (!selectedDataset || !selectedRide || !selectedNeighbourhood) {
    console.error("dataset or ride or neighbourhood not found");
    return -1;
  }

  $('#nbOrders').text(selectedDataset.orders.length);
  const startMs = new Date();
  selectedSchedule = new Schedule(selectedDataset, selectedRide);
  selectedSchedule.displayHtml();
  selectedSchedule.drawOnMap();
  $('#before').text(selectedSchedule.getScore().toFixed(3));

  let neighbourhood = new selectedNeighbourhood(selectedSchedule);
  const isExhaustive = $('#radioExhaustive').prop('checked');
  if (isExhaustive) {
    neighbourhood.process();
  } else {
    neighbourhood.process2();
  }
  neighbourhood.lastSchedule.displayHtml();
  neighbourhood.lastSchedule.drawOnMap();
  $('#after').text(neighbourhood.lastSchedule.getScore().toFixed(3));
  $('#iterations').text(neighbourhood.nbOptimisation);
  $('#spinner').hide();
  $('#time').text(new Date() - startMs);
  lastFileName = $('#select-dataset').val()
      + '_' + rides[$('#select-neighbourhood').val()].name
      + '_' + neighbourhoods[ $('#select-neighbourhood').val()].name
      + '_' + isExhaustive ? 'exhaustive' : 'non_exhaustive'
      + '.txt';
  lastFileValue = neighbourhood.lastSchedule.export();
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