class IterativeRide extends Ride {
  constructor(remainingIndexes) { super(remainingIndexes); }

  getNextPointIndex() {
    const remainingIndexes = this.remainingIndexes;
    for (let index of this.remainingIndexes) {
      const reason = this.cantNextPoint(index);
      if (!reason) {
        return index;
      }
      return -1;
    }
  }

  static calculate(remainingIndexes) {
    let rides = [];
    do {
      rides.push(new IterativeRide(remainingIndexes));
      const visitedIndexes = rides[rides.length - 1].clientsIndex;
      remainingIndexes = remainingIndexes.filter(index => {
        return !visitedIndexes.includes(index);
      });
    } while (remainingIndexes.length > 0);
    console.log('----------------');
    console.log('IterativeRide');
    console.log(rides);
    console.log(evaluation(rides));
    console.log('----------------');
  }
}