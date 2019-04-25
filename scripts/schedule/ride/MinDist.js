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
}