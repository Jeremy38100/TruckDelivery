class RandomRide extends Ride {
  constructor(remainingIndexes) { super(remainingIndexes); }

  getNextPointIndex() {
    return -1; // TODO
  }

  static calculate(remainingIndexes) {
    do {
      rides.push(new RandomRide(remainingIndexes));
      const visitedIndexes = rides[rides.length - 1].clientsIndex;
      remainingIndexes = remainingIndexes.filter(index => {
        return !visitedIndexes.includes(index);
      });

    } while (remainingIndexes.length > 0);
    console.log('----------------');
    console.log('RandomRide');
    console.log(rides);
    console.log(evaluation(rides));
    console.log('----------------');
  }
}