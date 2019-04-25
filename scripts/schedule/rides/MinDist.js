class MinDistRide extends Ride {
  constructor(remainingIndexes, depotIndex) { super(remainingIndexes, depotIndex); }

  getNextOrder(remainingOrders) {
    let minDistOrder = null;
    let minDistValue = -1;
    remainingOrders.forEach(order => {
      const reason = this.cantNextOrder(order);
      if (!reason) {
        const orderIndex = order.clientIndex;
        const distanceToLastPoint = distances[this.getLastIndex()][orderIndex];
        if (minDistOrder == null || distanceToLastPoint < minDistValue) { 
          minDistOrder = order;
          minDistValue = distanceToLastPoint;
        }
      } else {
        return null;
      }
    });
    return minDistOrder;
  }

  static calculate(remainingIndexes, depotIndex) {
    let rides = [];
    do {
      const ride = new MinDistRide(remainingIndexes, depotIndex);
      ride.clientsIndex.push(depotIndex);
      rides.push(ride);
      const visitedIndexes = rides[rides.length - 1].clientsIndex;
      remainingIndexes = remainingIndexes.filter(index => {
        return !visitedIndexes.includes(index);
      });
    } while (remainingIndexes.length > 0);
    console.log('----------------');
    console.log('MinDistRide');
    console.log(rides);
    console.log(evaluation(rides));
    console.log('----------------');
    return rides;
  }
}