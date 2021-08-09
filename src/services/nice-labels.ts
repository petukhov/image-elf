export default class NiceLabels {
  minPoint;
  maxPoint;
  maxTicks = 15;
  tickSpacing;
  range;
  niceMin;
  niceMax;

  /**
   * Instantiates a new instance of the NiceScale class.
   *
   *  min the minimum data point on the axis
   *  max the maximum data point on the axis
   */
  niceScale(min, max, maxTicks, normal) {
    this.minPoint = min;
    this.maxPoint = max;
    this.maxTicks = maxTicks;
    this.calculate();
    // console.warn({
    //   tickSpacing: this.tickSpacing,
    //   niceMinimum: this.niceMin,
    //   niceMaximum: this.niceMax
    // });
    return {
      tickSpacing: this.tickSpacing,
      normalizedTickSpacing: (this.tickSpacing / max) * normal,
      niceMinimum: this.niceMin,
      niceMaximum: normal
    };
  }

  /**
   * Calculate and update values for tick spacing and nice
   * minimum and maximum data points on the axis.
   */
  calculate() {
    this.range = this.niceNum(this.maxPoint - this.minPoint, true);
    this.tickSpacing = this.niceNum(this.range / (this.maxTicks - 1), true);
    this.niceMin = Math.floor(this.minPoint / this.tickSpacing) * this.tickSpacing;
    this.niceMax = Math.ceil(this.maxPoint / this.tickSpacing) * this.tickSpacing;
  }

  /**
   * Returns a "nice" number approximately equal to range Rounds
   * the number if round = true Takes the ceiling if round = false.
   *
   *  localRange the data range
   *  round whether to round the result
   *  a "nice" number to be used for the data range
   */
  niceNum(localRange, round) {
    var exponent; /** exponent of localRange */
    var fraction; /** fractional part of localRange */
    var niceFraction; /** nice, rounded fraction */

    exponent = Math.floor(Math.log10(localRange));
    fraction = localRange / Math.pow(10, exponent);

    if (round) {
      if (fraction < 1.5)
        niceFraction = 1;
      else if (fraction < 3)
        niceFraction = 2;
      else if (fraction < 7)
        niceFraction = 5;
      else
        niceFraction = 10;
    } else {
      if (fraction <= 1)
        niceFraction = 1;
      else if (fraction <= 2)
        niceFraction = 2;
      else if (fraction <= 5)
        niceFraction = 5;
      else
        niceFraction = 10;
    }

    return niceFraction * Math.pow(10, exponent);
  }

  /**
   * Sets the minimum and maximum data points for the axis.
   *
   *  minPoint the minimum data point on the axis
   *  maxPoint the maximum data point on the axis
   */
  setMinMaxPoints(localMinPoint, localMaxPoint) {
    this.minPoint = localMinPoint;
    this.maxPoint = localMaxPoint;
    this.calculate();
  }

  /**
   * Sets maximum number of tick marks we're comfortable with
   *
   *  maxTicks the maximum number of tick marks for the axis
   */
  setMaxTicks(localMaxTicks) {
    this.maxTicks = localMaxTicks;
    this.calculate();
  }
}