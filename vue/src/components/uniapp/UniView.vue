<template>
  <div class="uni-view" v-bind="$attrs">
    <slot />
  </div>
</template>

<script setup lang="ts">
// UniView - uniapp view标签的Web兼容实现
// 在Web环境下降级为div，保持100% uniapp语法兼容性
defineOptions({
  name: 'view',
  inheritAttrs: true
})
</script>

<style scoped>
.uni-view {
  display: block;
  box-sizing: border-box;
}
</style>