// Enum
Limit = {
  "duration": "DURATION",
  "capacity": "CAPACITY",
  "distance": "DISTANCE",
}

const rides = [IterativeRide, MinDistRide, RandomRide];
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
      }).catch(err => console.error(err));

    // schedule_ = new Schedule(orders);
    // schedule_.displayHtml();
    // console.log(schedule_.getScore());
    // drawWarehouseOnMap();

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
}

function resetHtml() {
  $('#score').empty();
  $('#schedule').empty();
}