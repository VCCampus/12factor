<template>
  <view
    class="neo-button"
    :class="[
      `neo-button--${variant}`,
      `neo-button--${size}`,
      {
        'neo-button--pressed': isPressed,
        'neo-button--disabled': disabled,
        'neo-button--loading': loading
      }
    ]"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd" 
    @click="handleClick"
  >
    <view class="neo-button__loading" v-if="loading">
      <text class="neo-button__spinner">⟳</text>
    </view>
    <view class="neo-button__content" v-else>
      <slot name="icon" />
      <text class="neo-button__text">
        <slot />
      </text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  block?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  disabled: false,
  loading: false,
  block: false
})

const emit = defineEmits<{
  click: [event: any]
}>()

const isPressed = ref(false)

const handleTouchStart = () => {
  if (!props.disabled && !props.loading) {
    isPressed.value = true
  }
}

const handleTouchEnd = () => {
  if (!props.disabled && !props.loading) {
    setTimeout(() => {
      isPressed.value = false
    }, 150)
  }
}

const handleClick = (event: any) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style lang="scss" scoped>
.neo-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--neo-white);
  border: var(--neo-border-width) solid var(--neo-border-color);
  box-shadow: var(--neo-shadow-sm);
  font-family: var(--neo-font-family);
  font-weight: 600;
  color: var(--neo-black);
  cursor: pointer;
  transition: var(--neo-transition);
  user-select: none;
}

/* 尺寸变体 */
.neo-button--sm {
  padding: var(--neo-spacing-sm) var(--neo-spacing-md);
  font-size: var(--neo-font-size-sm);
}

.neo-button--md {
  padding: var(--neo-spacing-md) var(--neo-spacing-lg);
  font-size: var(--neo-font-size-base);
}

.neo-button--lg {
  padding: var(--neo-spacing-lg) var(--neo-spacing-xl);
  font-size: var(--neo-font-size-lg);
}

/* 颜色变体 */
.neo-button--default {
  background: var(--neo-white);
  color: var(--neo-black);
}

.neo-button--primary {
  background: var(--neo-primary);
  color: var(--neo-black);
}

.neo-button--secondary {
  background: var(--neo-secondary);
  color: var(--neo-white);
}

.neo-button--accent {
  background: var(--neo-accent);
  color: var(--neo-white);
}

.neo-button--success {
  background: var(--neo-success);
  color: var(--neo-white);
}

.neo-button--warning {
  background: var(--neo-warning);
  color: var(--neo-black);
}

.neo-button--error {
  background: var(--neo-error);
  color: var(--neo-white);
}

/* 状态样式 */
.neo-button--pressed {
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0 var(--neo-border-color);
}

.neo-button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.neo-button--loading {
  cursor: wait;
}

/* #ifdef H5 */
.neo-button:hover:not(.neo-button--disabled):not(.neo-button--loading) {
  transform: translate(-1px, -1px);
  box-shadow: var(--neo-shadow-md);
}
/* #endif */

/* 内容布局 */
.neo-button__content {
  display: flex;
  align-items: center;
  gap: var(--neo-spacing-sm);
}

.neo-button__text {
  white-space: nowrap;
}

.neo-button__loading {
  display: flex;
  align-items: center;
  justify-content: center;
}

.neo-button__spinner {
  display: inline-block;
  animation: neoSpin 1s linear infinite;
  font-size: 1.2em;
}

@keyframes neoSpin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 块级按钮 */
.neo-button--block {
  width: 100%;
  display: flex;
}
</style>