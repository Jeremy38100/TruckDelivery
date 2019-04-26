class Example {
  constructor(name) {
    this.name = name;
    this.coords = [];
    this.ordersCount = [];
    this.orders = [];
    this.distances = [];
    this.times = [];
    this.config = {};
    this.warehouseIndex = 0;
  }

  loadExample() {
    return new Promise((resolve, reject) => {
      Promise.all([
        getCoords(this),
        getDistances(this),
        getTimes(this),
        getOrders(this),
        getVehicule(this)
      ]).then(() => {
        this.ordersCount.forEach((order_, index) => {
          this.orders.push(new Order(index, this));
        })
        $('#select-example').append(`<option value="${this.name}">${this.name}</option>`)
        resolve();
      }).catch(reject);
   });
  }
}