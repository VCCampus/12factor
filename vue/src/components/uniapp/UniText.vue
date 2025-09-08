<template>
  <span class="uni-text" v-bind="$attrs">
    <slot />
  </span>
</template>

<script setup lang="ts">
// UniText - uniapp text标签的Web兼容实现
// 在Web环境下降级为span，保持100% uniapp语法兼容性
defineOptions({
  name: 'text',
  inheritAttrs: true
})
</script>

<style scoped>
.uni-text {
  display: inline;
  box-sizing: border-box;
}
</style>