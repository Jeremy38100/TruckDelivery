// The goal is to extract a Ride in each TruckSchedule
// and add it to a new TruckSchedule
class AddTruckNeighborhood extends Neighborhood {

  constructor(schedule) { super(schedule); }

  // Override
  getNeighbours() {
    const neighbours = [];
    const minRideNumber = this.schedule.truckSchedules.map(truckSchedule => truckSchedule.rides.length).reduce(minReducer);
    for (let i = 0; i < minRideNumber; i++) {
      let scheduleCopy = this.schedule.copy();
      let newTruckSchedule = new TruckSchedule(scheduleCopy.dataset);
      for (let truckSchedule of scheduleCopy.truckSchedules) {
        newTruckSchedule.rides.push(truckSchedule.rides.splice(i, 1)[0]);
      }
      scheduleCopy.truckSchedules.push(newTruckSchedule);
      neighbours.push(scheduleCopy);
    }
    return neighbours;
  }

}