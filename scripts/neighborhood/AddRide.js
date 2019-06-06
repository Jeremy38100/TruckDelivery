// The golad is to extract an order in each Ride
// and add it to a new Ride for each TruckSchedule
class AddRide extends Neighborhood {

  constructor(schedule) { super(schedule); }

  // Override
  getNeighbours() {
    const neighbours = [];
    for (let truckSchedule of this.lastSchedule.truckSchedules) {
      let minOrdersPerRide = truckSchedule.rides
        .map(ride => ride.orders.length)
        .reduce((acc, cur) => acc < cur ? acc : cur);
      for (let index in Array.from(Array(minOrdersPerRide).keys())) {
        // TODO end
      }
      // TODO : check if empty ride
    }
    return neighbours;
  }

}