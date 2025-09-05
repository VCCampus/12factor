export default class DataValidator {
  constructor() {
    this.validationRules = {
      valueRange: { min: 0, max: 100 },
      volatilityThreshold: {
        high: 30,
        medium: 20,
        low: 15
      }
    };
  }

  validate(currentData, previousData) {
    const results = {
      valid: true,
      warnings: [],
      anomalies: []
    };

    // Validate current data structure
    this.validateDataStructure(currentData, results);

    // Validate individual source data
    if (currentData.data.youzhiyouxing) {
      this.validateSourceData('youzhiyouxing', currentData.data.youzhiyouxing, results);
    }

    if (currentData.data.coinmarketcap) {
      this.validateSourceData('coinmarketcap', currentData.data.coinmarketcap, results);
    }

    // Check for anomalies compared to previous data
    if (previousData) {
      this.checkAnomalies(currentData, previousData, results);
    }

    // Update history data
    this.updateHistory(currentData, previousData);

    return results;
  }

  validateDataStructure(data, results) {
    if (!data.version) {
      results.warnings.push('Missing version field');
    }

    if (!data.lastUpdate) {
      results.warnings.push('Missing lastUpdate field');
    }

    if (!data.data || typeof data.data !== 'object') {
      results.valid = false;
      results.warnings.push('Invalid data structure');
    }
  }

  validateSourceData(source, data, results) {
    if (!data.indicators) {
      results.warnings.push(`${source}: Missing indicators`);
      return;
    }

    const value = data.indicators.value;

    // Check value range
    if (typeof value !== 'number') {
      results.warnings.push(`${source}: Value is not a number`);
    } else if (value < this.validationRules.valueRange.min || 
               value > this.validationRules.valueRange.max) {
      results.warnings.push(
        `${source}: Value ${value} out of range [${this.validationRules.valueRange.min}-${this.validationRules.valueRange.max}]`
      );
    }

    // Check required fields
    if (!data.indicators.level) {
      results.warnings.push(`${source}: Missing level field`);
    }

    if (!data.fetchTime) {
      results.warnings.push(`${source}: Missing fetchTime`);
    }
  }

  checkAnomalies(currentData, previousData, results) {
    const sources = ['youzhiyouxing', 'coinmarketcap'];

    for (const source of sources) {
      const current = currentData.data[source];
      const previous = previousData.data[source];

      if (!current || !previous) continue;

      const currentValue = current.indicators?.value;
      const previousValue = previous.indicators?.value;

      if (typeof currentValue !== 'number' || typeof previousValue !== 'number') {
        continue;
      }

      const change = Math.abs(currentValue - previousValue);
      const changePercent = (change / previousValue) * 100;

      // Determine severity
      let severity = null;
      if (change > this.validationRules.volatilityThreshold.high) {
        severity = 'high';
      } else if (change > this.validationRules.volatilityThreshold.medium) {
        severity = 'medium';
      } else if (change > this.validationRules.volatilityThreshold.low) {
        severity = 'low';
      }

      if (severity) {
        const anomaly = {
          source,
          type: 'volatility',
          severity,
          message: `${source} value changed by ${change.toFixed(1)} points (${changePercent.toFixed(1)}%)`,
          details: {
            previousValue,
            currentValue,
            change,
            changePercent,
            previousDate: previousData.lastUpdate,
            currentDate: currentData.lastUpdate
          }
        };

        results.anomalies.push(anomaly);
      }

      // Update trend
      if (current.indicators) {
        if (currentValue > previousValue) {
          current.indicators.trend = 'up';
          current.indicators.changeFromYesterday = change;
        } else if (currentValue < previousValue) {
          current.indicators.trend = 'down';
          current.indicators.changeFromYesterday = -change;
        } else {
          current.indicators.trend = 'stable';
          current.indicators.changeFromYesterday = 0;
        }
      }
    }
  }

  updateHistory(currentData, previousData) {
    const sources = ['youzhiyouxing', 'coinmarketcap'];
    const maxHistoryDays = 7;

    for (const source of sources) {
      const current = currentData.data[source];
      if (!current) continue;

      // Initialize history array
      current.history = current.history || [];

      // Add previous data point to history
      if (previousData?.data[source]?.indicators?.value !== undefined) {
        const previousDate = previousData.lastUpdate.split('T')[0];
        const previousValue = previousData.data[source].indicators.value;

        // Check if this date already exists
        const existingIndex = current.history.findIndex(h => h.date === previousDate);
        if (existingIndex >= 0) {
          current.history[existingIndex].value = previousValue;
        } else {
          current.history.unshift({
            date: previousDate,
            value: previousValue
          });
        }
      }

      // Keep only the last N days
      current.history = current.history.slice(0, maxHistoryDays);

      // Sort by date (newest first)
      current.history.sort((a, b) => b.date.localeCompare(a.date));
    }
  }
}