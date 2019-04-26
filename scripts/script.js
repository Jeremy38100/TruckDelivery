const path = 'examples/example_2/';

// input
coords = [];
distances = [];
ordersDetail = [];
orders = [];
times = [];
warehouseIndex = 0;
config = {};

//
indexes = [];

// Enum
Limit = {
  "duration": "DURATION",
  "capacity": "CAPACITY",
  "distance": "DISTANCE",
}

schedule_;

function init () {
  Promise.all([
      getCoords(),
      getDistances(),
      getTimes(),
      getOrders(),
      getVehicule()
    ]).then(() => {
      console.log('coords');
      console.log(coords);
      console.log('distances');
      console.log(distances);
      console.log('times');
      console.log(times);
      console.log('ordersDetail');
      console.log(ordersDetail);
      console.log('config');
      console.log(config);

      coords.forEach((e, i) => {
        if (i !== coords.length - 1) {
          indexes.push(Number(i));
        }
      });

      ordersDetail.forEach((order_, index) => {
        const order = new Order(index);
        orders.push(order);
        order.drawOnMap();
      })
      console.log(orders);

      schedule_ = new Schedule(orders);
      schedule_.displayHtml();
      console.log(schedule_.getScore());
      drawWarehouseOnMap();

    }).catch();
}