class Neighborhood {
  constructor(schedule) {
    this.schedule = schedule;
    this.lastSchedule = Object.assign({}, schedule);
    this.nbOptimisation = 0;
  }

  // Override
  getNeighbours() {
  }

  process() {
    const neighborhood = this.getNeighbours();
    let minScore = this.lastSchedule.getScore();
    let minNeighbour = null;
    neighborhood.forEach(neighbour => {
      const score = neighbour.getScore;
      if (score < minScore) {
        minScore = score;
        minNeighbour = neighbour;
      }
    });
    if (minNeighbour) {
      this.nbOptimisation++;
      this.process();
    }
    else lastSchedule = minNeighbour;
  }
}