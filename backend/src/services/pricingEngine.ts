import { DynamicPricingConfig, RoomCategory } from '../types/index.js';

export class DynamicPricingEngine {
  private config: DynamicPricingConfig;

  constructor(config: DynamicPricingConfig) {
    this.config = config;
  }

  public getConfig(): DynamicPricingConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<DynamicPricingConfig>): DynamicPricingConfig {
    this.config = { ...this.config, ...newConfig };
    return this.config;
  }

  /**
   * Calculates the calculated price per night considering occupancy, weekend, and season
   */
  public calculateRate(
    baseRate: number,
    currentOccupancyPercent: number,
    targetDate: Date = new Date()
  ): {
    baseRate: number;
    finalRate: number;
    surgeApplied: boolean;
    surgeMultiplier: number;
    weekendMultiplier: number;
    reasons: string[];
  } {
    let multiplier = 1.0;
    const reasons: string[] = [];

    // Occupancy surge check
    const isSurgeApplicable = 
      this.config.isSurgeActive && 
      currentOccupancyPercent >= this.config.baseOccupancyThreshold;

    if (isSurgeApplicable) {
      multiplier *= this.config.surgeMultiplier;
      reasons.push(`High occupancy (${currentOccupancyPercent.toFixed(1)}% >= ${this.config.baseOccupancyThreshold}%) +${((this.config.surgeMultiplier - 1) * 100).toFixed(0)}%`);
    }

    // Weekend surcharge (Friday and Saturday nights)
    const dayOfWeek = targetDate.getDay(); // 0 is Sun, 5 is Fri, 6 is Sat
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;
    if (isWeekend) {
      multiplier *= this.config.weekendMultiplier;
      reasons.push(`Weekend Demand +${((this.config.weekendMultiplier - 1) * 100).toFixed(0)}%`);
    }

    const finalRate = Math.round(baseRate * multiplier);

    return {
      baseRate,
      finalRate,
      surgeApplied: isSurgeApplicable,
      surgeMultiplier: isSurgeApplicable ? this.config.surgeMultiplier : 1.0,
      weekendMultiplier: isWeekend ? this.config.weekendMultiplier : 1.0,
      reasons
    };
  }
}
