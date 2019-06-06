class Neighbourhood {
  constructor(schedule) {
    this.schedule = schedule;
    this.lastSchedule = schedule.copy(); // TODO copy object
    this.nbOptimisation = 0;
  }

  // Override
  getNeighbours() {
  }

  // Override
  getABetterNeighbour(previousScore) {
  }

  // exhaustive
  process() {
    const neighbourhood = this.getNeighbours();
    console.log('nbCombinations: ' + neighbourhood.length);

    let minScore = this.lastSchedule.getScore();
    let minNeighbour = null;

    neighbourhood.forEach(neighbour => {
      const score = neighbour.getScore();
      if (score < minScore) {
        minScore = score;
        minNeighbour = neighbour;
      }
    });
    console.log('minScore: ' + minScore);
    if (minNeighbour) {
      this.nbOptimisation++;
      this.lastSchedule = minNeighbour;
      this.process();
    } else {
      console.log('end: ' + this.lastSchedule.getScore());
    }
  }

  // non exhaustive
  process2() {
    let betterSchedule = this.getABetterNeighbour(this.lastSchedule.getScore());
    this.nbOptimisation = 0;
    while (betterSchedule) {
      this.lastSchedule = betterSchedule;
      this.nbOptimisation++;
      betterSchedule = this.getABetterNeighbour(this.lastSchedule.getScore());
      $('#iterations').text(betterSchedule);
    }
    console.log('getBetter: ' + this.nbOptimisation);
  }
}