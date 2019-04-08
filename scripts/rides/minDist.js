class MinDistRide extends Ride {
  constructor(remainingIndexes) { super(remainingIndexes); }

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

  static calculate(remainingIndexes) {
    let rides = [];
    do {
      rides.push(new MinDistRide(remainingIndexes));
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
  }
}