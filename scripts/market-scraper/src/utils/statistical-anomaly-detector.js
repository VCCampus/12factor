/**
 * 统计异常检测算法 (2σ 方法)
 * 基于历史数据的均值和标准差检测异常波动
 */

export default class StatisticalAnomalyDetector {
  constructor(options = {}) {
    this.options = {
      sigmaThreshold: options.sigmaThreshold || 2,        // 2σ 阈值
      minHistoryDays: options.minHistoryDays || 7,        // 最少历史数据天数
      maxHistoryDays: options.maxHistoryDays || 30,       // 最多历史数据天数
      coldStartThreshold: options.coldStartThreshold || 0.3,  // 冷启动固定阈值 30%
      ...options
    };
  }

  /**
   * 检测数据异常
   * @param {number} newValue 新的数据值
   * @param {Array} historicalData 历史数据数组 [{value, timestamp}, ...]
   * @param {string} dataSource 数据源标识
   * @returns {Object} 异常检测结果
   */
  detectAnomaly(newValue, historicalData, dataSource) {
    const result = {
      isAnomaly: false,
      severity: 'normal',
      confidence: 0,
      message: '',
      statistics: null,
      threshold: null,
      deviation: 0,
      historicalContext: {
        dataPoints: historicalData.length,
        method: 'unknown'
      }
    };

    // 验证输入
    if (typeof newValue !== 'number' || isNaN(newValue)) {
      result.message = 'Invalid new value provided';
      return result;
    }

    if (!Array.isArray(historicalData)) {
      result.message = 'Invalid historical data provided';
      return result;
    }

    // 根据历史数据量选择检测方法
    if (historicalData.length < this.options.minHistoryDays) {
      return this.detectWithFixedThreshold(newValue, historicalData, result);
    } else if (historicalData.length < this.options.maxHistoryDays) {
      return this.detectWithTransitionSigma(newValue, historicalData, result);
    } else {
      return this.detectWithFullSigma(newValue, historicalData, result);
    }
  }

  /**
   * 冷启动阶段：使用固定阈值检测
   * @param {number} newValue 新值
   * @param {Array} historicalData 历史数据
   * @param {Object} result 结果对象
   * @returns {Object} 检测结果
   */
  detectWithFixedThreshold(newValue, historicalData, result) {
    result.historicalContext.method = 'fixed_threshold';
    
    if (historicalData.length === 0) {
      result.message = `首次数据点，无法检测异常 (值: ${newValue})`;
      return result;
    }

    // 计算最近几个数据点的平均值作为基准
    const recentValues = historicalData.slice(-3).map(d => d.value);
    const baseline = recentValues.reduce((sum, val) => sum + val, 0) / recentValues.length;
    
    const changePercent = Math.abs((newValue - baseline) / baseline);
    const threshold = this.options.coldStartThreshold;
    
    result.statistics = {
      baseline: parseFloat(baseline.toFixed(2)),
      changePercent: parseFloat((changePercent * 100).toFixed(2)),
      threshold: parseFloat((threshold * 100).toFixed(2))
    };
    
    result.threshold = {
      upper: parseFloat((baseline * (1 + threshold)).toFixed(2)),
      lower: parseFloat((baseline * (1 - threshold)).toFixed(2))
    };
    
    if (changePercent > threshold) {
      result.isAnomaly = true;
      result.severity = changePercent > threshold * 1.5 ? 'high' : 'medium';
      result.confidence = Math.min(changePercent / threshold, 1.0);
      result.deviation = parseFloat(((newValue - baseline) / baseline * 100).toFixed(2));
      result.message = `数据变化超过 ${(threshold * 100).toFixed(0)}% 阈值 (变化: ${result.deviation}%)`;
    } else {
      result.message = `数据变化在正常范围内 (变化: ${(changePercent * 100).toFixed(1)}%)`;
    }

    return result;
  }

  /**
   * 过渡阶段：使用宽松的3σ阈值
   * @param {number} newValue 新值
   * @param {Array} historicalData 历史数据
   * @param {Object} result 结果对象
   * @returns {Object} 检测结果
   */
  detectWithTransitionSigma(newValue, historicalData, result) {
    return this.detectWithSigma(newValue, historicalData, result, 3, 'transition_sigma');
  }

  /**
   * 正常运行：使用标准2σ阈值
   * @param {number} newValue 新值
   * @param {Array} historicalData 历史数据
   * @param {Object} result 结果对象
   * @returns {Object} 检测结果
   */
  detectWithFullSigma(newValue, historicalData, result) {
    return this.detectWithSigma(newValue, historicalData, result, this.options.sigmaThreshold, 'full_sigma');
  }

  /**
   * 基于σ的异常检测
   * @param {number} newValue 新值
   * @param {Array} historicalData 历史数据
   * @param {Object} result 结果对象
   * @param {number} sigmaMultiplier σ倍数
   * @param {string} method 方法名称
   * @returns {Object} 检测结果
   */
  detectWithSigma(newValue, historicalData, result, sigmaMultiplier, method) {
    result.historicalContext.method = method;
    
    // 提取数值并计算统计量
    const values = historicalData.map(d => d.value).filter(v => typeof v === 'number' && !isNaN(v));
    
    if (values.length === 0) {
      result.message = 'No valid historical data for statistical analysis';
      return result;
    }

    const statistics = this.calculateStatistics(values);
    const upperBound = statistics.mean + (sigmaMultiplier * statistics.stdDev);
    const lowerBound = statistics.mean - (sigmaMultiplier * statistics.stdDev);
    
    // 计算偏差（以标准差为单位）
    const deviationInSigma = Math.abs(newValue - statistics.mean) / statistics.stdDev;
    
    result.statistics = {
      mean: parseFloat(statistics.mean.toFixed(2)),
      stdDev: parseFloat(statistics.stdDev.toFixed(2)),
      variance: parseFloat(statistics.variance.toFixed(2)),
      min: statistics.min,
      max: statistics.max,
      count: values.length
    };
    
    result.threshold = {
      upper: parseFloat(upperBound.toFixed(2)),
      lower: parseFloat(lowerBound.toFixed(2)),
      sigmaMultiplier: sigmaMultiplier
    };
    
    result.deviation = parseFloat(deviationInSigma.toFixed(2));

    // 判断异常
    if (newValue > upperBound || newValue < lowerBound) {
      result.isAnomaly = true;
      result.confidence = Math.min(deviationInSigma / sigmaMultiplier, 1.0);
      
      // 确定严重程度
      if (deviationInSigma > sigmaMultiplier * 1.5) {
        result.severity = 'high';
      } else if (deviationInSigma > sigmaMultiplier * 1.2) {
        result.severity = 'medium';
      } else {
        result.severity = 'low';
      }
      
      const direction = newValue > upperBound ? '上升' : '下降';
      result.message = `检测到${result.severity}级别异常: 数据${direction} ${result.deviation}σ (阈值: ±${sigmaMultiplier}σ)`;
    } else {
      result.message = `数据在正常范围内 (偏差: ${result.deviation}σ, 阈值: ±${sigmaMultiplier}σ)`;
    }

    return result;
  }

  /**
   * 计算基础统计量
   * @param {Array} values 数值数组
   * @returns {Object} 统计结果
   */
  calculateStatistics(values) {
    const n = values.length;
    const sum = values.reduce((acc, val) => acc + val, 0);
    const mean = sum / n;
    
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);
    
    return {
      mean,
      stdDev,
      variance,
      min: Math.min(...values),
      max: Math.max(...values),
      median: this.calculateMedian(values),
      count: n
    };
  }

  /**
   * 计算中位数
   * @param {Array} values 数值数组
   * @returns {number} 中位数
   */
  calculateMedian(values) {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    
    if (sorted.length % 2 === 0) {
      return (sorted[mid - 1] + sorted[mid]) / 2;
    } else {
      return sorted[mid];
    }
  }

  /**
   * 批量检测多个数据源的异常
   * @param {Object} newData 新数据 {source1: value1, source2: value2}
   * @param {Object} historicalData 历史数据 {source1: [...], source2: [...]}
   * @returns {Object} 批量检测结果
   */
  detectBatchAnomalies(newData, historicalData) {
    const results = {};
    const summary = {
      totalSources: 0,
      anomaliesDetected: 0,
      highSeverityCount: 0,
      mediumSeverityCount: 0,
      lowSeverityCount: 0
    };

    for (const [source, newValue] of Object.entries(newData)) {
      const history = historicalData[source] || [];
      const detection = this.detectAnomaly(newValue, history, source);
      
      results[source] = detection;
      summary.totalSources++;
      
      if (detection.isAnomaly) {
        summary.anomaliesDetected++;
        
        switch (detection.severity) {
          case 'high':
            summary.highSeverityCount++;
            break;
          case 'medium':
            summary.mediumSeverityCount++;
            break;
          case 'low':
            summary.lowSeverityCount++;
            break;
        }
      }
    }

    return {
      results,
      summary,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * 生成异常检测报告
   * @param {Object} detectionResult 检测结果
   * @param {string} dataSource 数据源
   * @returns {string} 格式化的报告
   */
  generateReport(detectionResult, dataSource) {
    const { isAnomaly, severity, message, statistics, threshold, deviation, historicalContext } = detectionResult;
    
    let report = `\n=== ${dataSource.toUpperCase()} 异常检测报告 ===\n`;
    report += `时间: ${new Date().toLocaleString('zh-CN')}\n`;
    report += `检测方法: ${historicalContext.method}\n`;
    report += `历史数据点: ${historicalContext.dataPoints}\n`;
    report += `结果: ${isAnomaly ? '🚨 异常' : '✅ 正常'}\n`;
    
    if (isAnomaly) {
      report += `严重程度: ${severity.toUpperCase()}\n`;
      report += `偏差程度: ${deviation}${historicalContext.method.includes('sigma') ? 'σ' : '%'}\n`;
    }
    
    report += `说明: ${message}\n`;
    
    if (statistics) {
      report += `\n--- 统计信息 ---\n`;
      if (statistics.mean !== undefined) {
        report += `均值: ${statistics.mean}\n`;
        report += `标准差: ${statistics.stdDev}\n`;
      }
      if (statistics.baseline !== undefined) {
        report += `基准值: ${statistics.baseline}\n`;
        report += `变化百分比: ${statistics.changePercent}%\n`;
      }
    }
    
    if (threshold) {
      report += `\n--- 阈值信息 ---\n`;
      report += `上限: ${threshold.upper}\n`;
      report += `下限: ${threshold.lower}\n`;
      if (threshold.sigmaMultiplier) {
        report += `σ倍数: ${threshold.sigmaMultiplier}\n`;
      }
    }
    
    report += `===============================\n`;
    
    return report;
  }
}