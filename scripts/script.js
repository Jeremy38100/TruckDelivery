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

const rides = [IterativeRide, MinDistRide, RandomRide];
const neighborhoods = [AddTruckNeighborhood];
datasets = [];

let selectedDataset = null;
let selectedRide = null;

let selectedSchedule = null;

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

function update() {
  const dataset = $('#select-dataset').val();
  const ride = $('#select-ride').val();

  selectedDataset = datasets.find(ex => ex.name == dataset);
  selectedRide = rides[Number(ride)];
  if (!selectedDataset || !selectedRide) {
    console.error("dataset or ride not found");
    return -1;
  }

  selectedSchedule = new Schedule(selectedDataset, selectedRide);
  selectedSchedule.displayHtml();
  selectedSchedule.drawOnMap();

  let neighborhood = new AddTruckNeighborhood(selectedSchedule);
  neighborhood.process();
  console.log(neighborhood.nbOptimisation);
}

function resetHtml() {
  $('#score').empty();
  $('#schedule').empty();
}