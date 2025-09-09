<template>
  <view id="app">
    <!-- uni-app 全局应用组件 -->
  </view>
</template>

<script lang="ts">
import { defineComponent, onLaunch, onShow, onHide } from 'vue'
import { setupPinia } from '@/stores/index'

export default defineComponent({
  onLaunch() {
    console.log('App Launch - CSS数创班8期学习平台')
    // 初始化 Pinia 状态管理
    setupPinia()
    
    // 初始化主题
    this.initTheme()
  },
  
  onShow() {
    console.log('App Show')
  },
  
  onHide() {
    console.log('App Hide')
  },
  
  methods: {
    initTheme() {
      // 设置默认主题为浅色模式
      // #ifdef H5
      document.documentElement.classList.add('light-theme')
      // #endif
    }
  }
})
</script>

<style lang="scss">
/* 全局样式 */
@import '@/styles/global.scss';
@import '@/styles/neo-brutalism.scss';

/* uView 样式覆盖 */
@import '@/styles/uview-override.scss';

/* 应用入口样式 */
#app {
  font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 全局页面样式 */
page {
  background-color: var(--neo-white);
  color: var(--neo-black);
  line-height: 1.6;
}

/* 响应式断点 */
/* #ifdef H5 */
@media (max-width: 768px) {
  .desktop-only {
    display: none !important;
  }
}

@media (min-width: 769px) {
  .mobile-only {
    display: none !important;
  }
}
/* #endif */
</style>