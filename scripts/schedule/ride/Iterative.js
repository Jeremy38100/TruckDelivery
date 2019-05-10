class IterativeRide extends Ride {
  constructor(dataset, remainingIndexes) { super(dataset, remainingIndexes); }

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
}