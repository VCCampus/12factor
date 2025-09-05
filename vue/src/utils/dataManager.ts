/**
 * 数据管理工具类
 * 用于管理本地存储的学习数据
 */

const STORAGE_KEY = 'css_learning_data';
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export interface LearningData {
  analytics?: any;
  achievements?: any;
  exportSettings?: any;
  timestamp?: number;
}

class DataManager {
  /**
   * 保存数据到localStorage
   */
  save(data: LearningData): boolean {
    try {
      const dataStr = JSON.stringify({
        ...data,
        timestamp: Date.now()
      });
      
      // 检查大小
      if (dataStr.length > MAX_SIZE) {
        this.cleanOldestData();
      }
      
      localStorage.setItem(STORAGE_KEY, dataStr);
      return true;
    } catch (error) {
      console.error('保存数据失败:', error);
      return false;
    }
  }
  
  /**
   * 获取存储的数据
   */
  load(): LearningData | null {
    try {
      const dataStr = localStorage.getItem(STORAGE_KEY);
      return dataStr ? JSON.parse(dataStr) : null;
    } catch (error) {
      console.error('加载数据失败:', error);
      return null;
    }
  }
  
  /**
   * 清理最早的历史数据
   */
  cleanOldestData(): void {
    const data = this.load();
    if (!data) return;
    
    // 保留最近的数据，删除旧数据
    const cleaned: LearningData = {
      analytics: data.analytics ? this.trimOldRecords(data.analytics) : undefined,
      achievements: data.achievements,
      exportSettings: data.exportSettings,
      timestamp: Date.now()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
  }
  
  /**
   * 删除旧记录
   */
  private trimOldRecords(records: any): any {
    if (Array.isArray(records)) {
      // 保留最近的50条记录
      return records.slice(-50);
    }
    return records;
  }
  
  /**
   * 导出数据为JSON文件
   */
  export(): void {
    const data = this.load();
    if (!data) {
      console.warn('没有可导出的数据');
      return;
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `css-learning-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  
  /**
   * 清除所有数据
   */
  clear(): void {
    if (confirm('确定要清除所有学习数据吗？此操作不可恢复。')) {
      localStorage.removeItem(STORAGE_KEY);
      console.log('学习数据已清除');
    }
  }
  
  /**
   * 获取存储大小
   */
  getSize(): number {
    const dataStr = localStorage.getItem(STORAGE_KEY);
    return dataStr ? dataStr.length : 0;
  }
  
  /**
   * 获取存储大小（格式化）
   */
  getSizeFormatted(): string {
    const size = this.getSize();
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    return `${(size / 1024 / 1024).toFixed(2)} MB`;
  }
}

export default new DataManager();