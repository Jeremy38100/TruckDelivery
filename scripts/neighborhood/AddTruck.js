// The goal is to extract a Ride in each TruckSchedule
// and add it to a new TruckSchedule
class AddTruckNeighborhood extends Neighborhood {

  constructor(schedule) { super(schedule); }

  // Override
  getNeighbours() {
    const neighbours = [];
    this.schedule.truckSchedules.forEach(truckSchedule => {
      const newRide = new Ride();
      truckSchedule.rides.forEach(ride => {
        newRide.addOrder(ride.orders.pop());
      });
    });
    return neighbours;
  }

}