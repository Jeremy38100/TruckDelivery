// The goal is to select two random orders in the schedule and swap them
class SwapRandomNeighborhood extends Neighborhood {

  constructor(schedule) {
    super(schedule);
    this.iterations = 10*this.lastSchedule.dataset.orders.length; // arbitrary
  }

  // Override
  getNeighbours() {
    const neighbours = [];
    let nbPermutations = this.iterations;
    while (nbPermutations > 0) {
      const aOrderIndex = getRandomOrderIndex(this.lastSchedule);
      const bOrderIndex = getRandomOrderIndex(this.lastSchedule);
      const scheduleCopy = this.lastSchedule.copy();

      scheduleCopy.swap(aOrderIndex, bOrderIndex);
      neighbours.push(scheduleCopy);
      nbPermutations--;
    }
    return neighbours;
  }

  getABetterNeighbour(previousScore) {
    let nbPermutations = this.iterations;
    while (nbPermutations > 0) {
      const aOrderIndex = getRandomOrderIndex(this.lastSchedule);
      const bOrderIndex = getRandomOrderIndex(this.lastSchedule);
      const scheduleCopy = this.lastSchedule.copy();

      scheduleCopy.swap(aOrderIndex, bOrderIndex);
      if (scheduleCopy.getScore() < previousScore) {
        return scheduleCopy;
      }
      nbPermutations--;
    }

    return null;
  }
}

function getRandomOrderIndex(schedule) {
  const orderIndex = new OrderInSchedule();
  orderIndex.truckScheduleIndex = Math.floor(Math.random()*schedule.truckSchedules.length);
  const truckSchedule = schedule.getTruckScheduleFromIndex(orderIndex);
  orderIndex.rideIndex = Math.floor(Math.random()*truckSchedule.rides.length);
  const ride = schedule.getRideFromIndex(orderIndex);
  orderIndex.orderIndex = Math.floor(Math.random()*ride.orders.length);
  return orderIndex;
}