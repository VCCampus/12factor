<template>
  <div class="thermometer-page">
    <div class="neo-card neo-card--secondary">
      <div class="text-center">
        <h1 class="text-3xl font-bold mb-2 text-white">🌡️ 市场情绪</h1>
        <p class="text-lg text-white">跨端Canvas绘制演示</p>
      </div>
    </div>

    <div class="demo-section">
      <div class="neo-card">
        <div class="text-center">
          <h3 class="text-xl font-bold mb-4">Canvas 跨端方案</h3>
          <p class="mb-4">🎨 H5端: 原生Canvas API</p>
          <p class="mb-4">📱 小程序: uni.createCanvasContext</p>
          <p class="mb-4">🔄 条件编译处理差异</p>
          <div class="status-indicator status-indicator--success">
            ✅ 统一绘制逻辑实现
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.thermometer-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.demo-section {
  margin-top: 2rem;
}
</style>