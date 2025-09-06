<template>
  <div class="principles-tab">
    <!-- 桌面端Tab导航 -->
    <div class="hidden md:flex tab-nav justify-center mb-6">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="$emit('change', tab.id)"
        :class="['tab-btn', { active: activeTab === tab.id }]"
      >
        <span class="tab-icon">{{ tab.icon }}</span>
        <span class="tab-label">{{ tab.label }}</span>
      </button>
    </div>
    
    <!-- 移动端Tab导航（横向滑动） -->
    <div class="md:hidden tab-nav-mobile mb-6">
      <div class="tab-scroll">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="$emit('change', tab.id)"
          :class="['tab-btn-mobile', { active: activeTab === tab.id }]"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-label">{{ tab.label }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Tab {
  id: string
  icon: string
  label: string
}

defineProps<{
  activeTab: string
}>()

defineEmits<{
  change: [tabId: string]
}>()

const tabs: Tab[] = [
  { id: 'study', icon: '📚', label: '原则学习' },
  { id: 'flashcards', icon: '🎯', label: '闪卡练习' },
  { id: 'quiz', icon: '🏆', label: '挑战测试' }
]
</script>

<style scoped>
/* 桌面端Tab样式 */
.tab-nav {
  @apply flex gap-2;
}

.tab-btn {
  @apply px-6 py-3 font-bold bg-white border-2 border-black transition-all;
  box-shadow: 2px 2px 0px theme('colors.border-black');
}

.tab-btn:hover {
  transform: translate(-1px, -1px);
  box-shadow: 3px 3px 0px theme('colors.border-black');
}

.tab-btn.active {
  @apply bg-primary-blue text-white;
  box-shadow: 4px 4px 0px theme('colors.border-black');
  transform: translate(-1px, -1px);
}

/* 移动端横向滑动 */
.tab-nav-mobile {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.tab-scroll {
  @apply flex gap-2 px-4;
  min-width: max-content;
}

.tab-btn-mobile {
  @apply px-4 py-2 font-bold bg-white border-2 border-black whitespace-nowrap;
  box-shadow: 2px 2px 0px theme('colors.border-black');
}

.tab-btn-mobile.active {
  @apply bg-primary-blue text-white;
  box-shadow: 3px 3px 0px theme('colors.border-black');
}

/* 隐藏滚动条但保持功能 */
.tab-nav-mobile::-webkit-scrollbar {
  display: none;
}

.tab-nav-mobile {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Tab图标和标签 */
.tab-icon {
  @apply mr-2 text-lg;
}

.tab-label {
  @apply text-sm md:text-base;
}
</style>