// input
examples = [];

// Enum
Limit = {
  "duration": "DURATION",
  "capacity": "CAPACITY",
  "distance": "DISTANCE",
}

const rides = [IterativeRide, MinDistRide, RandomRide];

function init() {
  getExamples().then(() => {
    console.log(examples);
    Promise.all(examples.map(example => example.loadExample()))
      .then(() => {
        console.log('ok');
        printRides();
      }).catch(err => console.error(err));

    // schedule_ = new Schedule(orders);
    // schedule_.displayHtml();
    // console.log(schedule_.getScore());
    // drawWarehouseOnMap();

  }).catch();
}

function printRides() {
  const rideSelect = $('#select-ride');
  rides.forEach(ride => {
    rideSelect.append(`<option value="${ride.name}">${ride.name}</option>`);
  })
}