<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">💡 积分获取指南</h3>
        <button @click="$emit('close')" class="close-button">✕</button>
      </div>
      
      <div class="modal-body">
        <div class="tips-sections">
          <!-- 日常学习 -->
          <div class="tip-section">
            <h4 class="section-title">📚 日常学习</h4>
            <div class="tips-list">
              <div class="tip-item">
                <div class="tip-icon">🎯</div>
                <div class="tip-content">
                  <div class="tip-title">完成原则学习</div>
                  <div class="tip-description">每完成一个原则学习可获得 20-50 积分</div>
                  <div class="tip-points">+20-50 积分</div>
                </div>
              </div>
              
              <div class="tip-item">
                <div class="tip-icon">📝</div>
                <div class="tip-content">
                  <div class="tip-title">通过测试</div>
                  <div class="tip-description">根据分数获得不同积分：60分+10，80分+20，90分+30</div>
                  <div class="tip-points">+10-30 积分</div>
                </div>
              </div>
              
              <div class="tip-item">
                <div class="tip-icon">🎴</div>
                <div class="tip-content">
                  <div class="tip-title">闪卡练习</div>
                  <div class="tip-description">每复习10张闪卡获得5积分</div>
                  <div class="tip-points">+5 积分</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 连续学习奖励 -->
          <div class="tip-section">
            <h4 class="section-title">🔥 连续学习奖励</h4>
            <div class="tips-list">
              <div class="tip-item">
                <div class="tip-icon">📅</div>
                <div class="tip-content">
                  <div class="tip-title">每日签到</div>
                  <div class="tip-description">每天学习获得基础积分，连续天数越多奖励越高</div>
                  <div class="tip-points">+10-50 积分</div>
                </div>
              </div>
              
              <div class="tip-item">
                <div class="tip-icon">⚡</div>
                <div class="tip-content">
                  <div class="tip-title">连击加成</div>
                  <div class="tip-description">连续学习可获得积分倍数加成，最高3倍</div>
                  <div class="tip-points">1.1x-3x 倍数</div>
                </div>
              </div>
              
              <div class="tip-item">
                <div class="tip-icon">🏃</div>
                <div class="tip-content">
                  <div class="tip-title">周目标达成</div>
                  <div class="tip-description">每周学习7天可获得额外奖励积分</div>
                  <div class="tip-points">+100 积分</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 成就解锁 -->
          <div class="tip-section">
            <h4 class="section-title">🏆 成就与徽章</h4>
            <div class="tips-list">
              <div class="tip-item">
                <div class="tip-icon">🎖️</div>
                <div class="tip-content">
                  <div class="tip-title">解锁徽章</div>
                  <div class="tip-description">不同稀有度的徽章提供不同积分奖励</div>
                  <div class="tip-points">+25-500 积分</div>
                </div>
              </div>
              
              <div class="tip-item">
                <div class="tip-icon">🏆</div>
                <div class="tip-content">
                  <div class="tip-title">达成成就</div>
                  <div class="tip-description">完成各类学习成就可获得大量积分</div>
                  <div class="tip-points">+10-500 积分</div>
                </div>
              </div>
              
              <div class="tip-item">
                <div class="tip-icon">⬆️</div>
                <div class="tip-content">
                  <div class="tip-title">等级提升</div>
                  <div class="tip-description">每次等级提升都会获得额外奖励积分</div>
                  <div class="tip-points">+50 积分</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 特殊活动 -->
          <div class="tip-section">
            <h4 class="section-title">🎉 特殊活动</h4>
            <div class="tips-list">
              <div class="tip-item">
                <div class="tip-icon">💯</div>
                <div class="tip-content">
                  <div class="tip-title">完美表现</div>
                  <div class="tip-description">测试获得满分或连续多次高分</div>
                  <div class="tip-points">+50-100 积分</div>
                </div>
              </div>
              
              <div class="tip-item">
                <div class="tip-icon">🎯</div>
                <div class="tip-content">
                  <div class="tip-title">学习里程碑</div>
                  <div class="tip-description">完成学习进度的重要节点</div>
                  <div class="tip-points">+75-200 积分</div>
                </div>
              </div>
              
              <div class="tip-item">
                <div class="tip-icon">⭐</div>
                <div class="tip-content">
                  <div class="tip-title">特殊挑战</div>
                  <div class="tip-description">完成限时挑战或特殊任务</div>
                  <div class="tip-points">+100-500 积分</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 快速积分策略 -->
        <div class="strategy-section">
          <h4 class="strategy-title">🚀 快速积分策略</h4>
          <div class="strategy-grid">
            <div class="strategy-card">
              <div class="strategy-icon">🎯</div>
              <h5>新手建议</h5>
              <ul>
                <li>每天至少学习一个原则</li>
                <li>完成所有测试获得基础积分</li>
                <li>保持连续学习连击</li>
              </ul>
            </div>
            
            <div class="strategy-card">
              <div class="strategy-icon">⚡</div>
              <h5>进阶策略</h5>
              <ul>
                <li>专注提升测试分数</li>
                <li>大量练习闪卡复习</li>
                <li>解锁更多徽章和成就</li>
              </ul>
            </div>
            
            <div class="strategy-card">
              <div class="strategy-icon">👑</div>
              <h5>高级技巧</h5>
              <ul>
                <li>挑战传奇级徽章</li>
                <li>维持最高连击倍数</li>
                <li>参与特殊活动和挑战</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button @click="$emit('close')" class="close-modal-btn">
          开始赚积分！🚀
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  'close': []
}>()
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 20px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px 20px 0 0;
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.modal-body {
  padding: 32px;
}

.tips-sections {
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-bottom: 40px;
}

.tip-section {
  background: #f8fafc;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #e2e8f0;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tips-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  background: white;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.tip-item:hover {
  border-color: #cbd5e1;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.tip-icon {
  font-size: 24px;
  flex-shrink: 0;
  width: 32px;
  text-align: center;
}

.tip-content {
  flex: 1;
}

.tip-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.tip-description {
  font-size: 13px;
  color: #64748b;
  line-height: 1.4;
}

.tip-points {
  font-size: 12px;
  font-weight: 700;
  color: #f59e0b;
  background: #fef3c7;
  padding: 4px 8px;
  border-radius: 12px;
  display: inline-block;
  margin-left: auto;
  flex-shrink: 0;
}

/* 策略部分 */
.strategy-section {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #bae6fd;
}

.strategy-title {
  font-size: 18px;
  font-weight: 700;
  color: #0c4a6e;
  margin: 0 0 20px;
  text-align: center;
}

.strategy-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.strategy-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  border: 1px solid #e0f2fe;
  transition: all 0.2s ease;
}

.strategy-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.strategy-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.strategy-card h5 {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px;
}

.strategy-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
}

.strategy-card li {
  font-size: 13px;
  color: #475569;
  padding: 4px 0;
  position: relative;
  padding-left: 16px;
}

.strategy-card li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #10b981;
  font-weight: 600;
}

.modal-footer {
  padding: 24px;
  border-top: 1px solid #e2e8f0;
  text-align: center;
  background: #f8fafc;
  border-radius: 0 0 20px 20px;
}

.close-modal-btn {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-modal-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 16px;
  }
  
  .modal-content {
    border-radius: 16px;
  }
  
  .modal-header {
    padding: 20px;
    border-radius: 16px 16px 0 0;
  }
  
  .modal-body {
    padding: 24px;
  }
  
  .tip-item {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
  
  .tip-icon {
    font-size: 32px;
  }
  
  .tip-points {
    margin: 0;
    align-self: center;
  }
  
  .strategy-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .modal-header {
    padding: 16px;
  }
  
  .modal-title {
    font-size: 18px;
  }
  
  .modal-body {
    padding: 20px;
  }
  
  .tips-sections {
    gap: 24px;
  }
  
  .tip-section,
  .strategy-section {
    padding: 20px;
  }
}
</style>