class MinDistRide extends Ride {
  constructor(remainingIndexes, depotIndex) { super(remainingIndexes, depotIndex); }

  getNextPointIndex() {
    let minDistIndex = -1;
    let minDistValue = -1;
    this.remainingIndexes.forEach(index => {
      const reason = this.cantNextPoint(index);
      if (!reason) {
        const distanceToLastPoint = distances[this.getLastIndex()][index];
        if (minDistIndex == -1 || distanceToLastPoint < minDistValue) { 
          minDistIndex = index;
          minDistValue = distanceToLastPoint;
        }
      } else {
        return -1;
      }
    });
    return minDistIndex;
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
    rides.forEach(ride => {
      ride.drawOnMap()
    });
    console.log('----------------');
    console.log('MinDistRide');
    console.log(rides);
    console.log(evaluation(rides));
    console.log('----------------');
  }
}