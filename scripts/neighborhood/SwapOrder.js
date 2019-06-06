// The goal is to try all orders permutations in the global schedule
// ⚠️ Glutton
class SwapOrderNeighborhood extends Neighborhood {

  constructor(schedule) { super(schedule); }

  // Override
  getNeighbours() {
    const neighbours = [];
    let nbPermutations = 0;
    const aIterator = new ScheduleIteratorOrder(this.lastSchedule);
    const bIterator = new ScheduleIteratorOrder(this.lastSchedule);

    do {
      do {
        const scheduleCopy = this.lastSchedule.copy();
        scheduleCopy.swap(aIterator.index, bIterator.index);
        neighbours.push(scheduleCopy);
        nbPermutations++;
      } while (bIterator.next());
    } while (aIterator.next());

    console.log('nbPermutations: ' + nbPermutations);
    return neighbours;
  }

  getABetterNeighbour(previousScore) {
    const aIterator = new ScheduleIteratorRide(this.lastSchedule);
    const bIterator = new ScheduleIteratorOrder(this.lastSchedule);

    do {
      do {
        const bOrder = this.lastSchedule.getOrderFromIndex(bIterator.index);
        const scheduleCopy = this.lastSchedule.copy();
        scheduleCopy.swap(aIterator.index, bIterator.index);
        if (scheduleCopy.getScore() < previousScore) {
          return scheduleCopy;
        }
      } while (bIterator.next());
    } while (aIterator.next());

    return null;
  }
}

class ScheduleIteratorOrder {
  constructor(schedule) {
    this.index = new OrderInSchedule();
    this.schedule = schedule;
  }

  next() {
    if (this.schedule.getRideFromIndex(this.index).orders.length - 1 > this.index.orderIndex) {
      this.index.orderIndex++;
    } else {
      this.index.orderIndex = 0;
      if (this.schedule.getTruckScheduleFromIndex(this.index).rides.length - 1 > this.index.rideIndex) {
        this.index.rideIndex++;
      } else {
        this.index.rideIndex = 0;
        if (this.schedule.truckSchedules.length - 1 > this.index.truckScheduleIndex) {
          this.index.truckScheduleIndex++;
        } else {
          return false;
        }
      }
    }
    return true;
  }
}

class ScheduleIteratorRide {
  constructor(schedule) {
    this.index = new OrderInSchedule();
    this.schedule = schedule;
  }

  next() {
    if (this.schedule.getTruckScheduleFromIndex(this.index).rides.length - 1 > this.index.rideIndex) {
      this.index.rideIndex++;
    } else {
      this.index.rideIndex = 0;
      if (this.schedule.truckSchedules.length - 1 > this.index.truckScheduleIndex) {
        this.index.truckScheduleIndex++;
      } else {
        return false;
      }
    }
    return true;
  }
}