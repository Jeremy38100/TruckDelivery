class Ride {
  constructor(remainingIndexes) {
    this.clientsIndex = [remainingIndexes.length - 1];
    this.cumulativeDistance = 0;
    this.cumulativeBags = 0;
    this.cumulativeTime = 0;
    this.remainingDistance = config.max_dist;
    this.limit = "";
    this.remainingIndexes = remainingIndexes

    let nextIndex = -1;
    do {
      nextIndex = this.getNextPointIndex();
      if (nextIndex > -1) {
        this.addPoint(nextIndex);
      }
    } while (nextIndex > -1 && this.remainingIndexes.length > 0);
  }

  getLastIndex() {
    let lastIndex = warehouseIndex;
    if (this.clientsIndex.length > 0) {
      lastIndex = this.clientsIndex[this.clientsIndex.length - 1];
    }
    return lastIndex;
  }

  addPoint(newIndex) {

    // Get last truck position
    const lastIndex = this.getLastIndex();

    // Update cumulative data
    const distanceNewPoint = distances[lastIndex][newIndex]
    this.cumulativeDistance += distanceNewPoint;
    this.cumulativeTime += times[lastIndex][newIndex];
    this.cumulativeBags += orders[newIndex - 1];
    this.remainingDistance -= distanceNewPoint;

    this.remainingIndexes = this.remainingIndexes.filter(el => { return el !== newIndex; })

    this.clientsIndex.push(newIndex);
  }

  cantNextPoint(newPointIndex) {
    // Pas de surcharge
    if (this.cumulativeBags + orders[newPointIndex - 1] > config.capacity) {
      return Limit.capacity;
    }

    const lastIndex = this.getLastIndex();
    const distanceToPointAndHome = distances[lastIndex, newPointIndex] + distances[newPointIndex, warehouseIndex];
    const timeToPointAndHome = times[lastIndex, newPointIndex] + times[newPointIndex, warehouseIndex];

    // Pas de batterie vide
    if (this.cumulativeDistance + distanceToPointAndHome > config.max_dist) {
      return Limit.distance;
    }
    // Pas d'heure sup
    if (this.cumulativeTime + timeToPointAndHome > config.max_time) {
      return Limit.duration;
    }
    return '';
  }

  getNextPointIndex() {
    return -1;
  }

  distance() {
    let distance = 0;
    const clientsLength = this.clientsIndex.length;
    for (let index = 0; index < clientsLength - 1; index++) {
      distance += distances[index][index + 1];
    }
    return distance;
  }

  time() {
    let time = 0;
    const clientsLength = this.clientsIndex.length;
    for (let index = 0; index < clientsLength - 1; index++) {
      time += times[this.clientsIndex[index]][this.clientsIndex[index + 1]];
    }
    return time;
  }

  static calculate(remainingIndexes) {
  }
}