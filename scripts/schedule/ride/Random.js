// Add a random order @ 90%
// End Ride otherwise
class RandomRide extends Ride {
  constructor(dataset, remainingIndexes, depotIndex) { super(dataset, remainingIndexes, depotIndex); }

  getNextOrder(remainingOrders) {
    if (this.orders.length > 0 && Math.random() < 0.1) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * remainingOrders.length);
    return remainingOrders[randomIndex];
  }
}