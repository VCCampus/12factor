<template>
  <view 
    class="neo-card"
    :class="[
      `neo-card--${variant}`,
      { 
        'neo-card--pressed': isPressed,
        'neo-card--hover': isHoverable && !isPressed 
      }
    ]"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
    @click="handleClick"
  >
    <view class="neo-card__header" v-if="$slots.header">
      <slot name="header" />
    </view>
    <view class="neo-card__body">
      <slot />
    </view>
    <view class="neo-card__footer" v-if="$slots.footer">
      <slot name="footer" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error'
  hoverable?: boolean
  pressable?: boolean
  shadow?: 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  hoverable: true,
  pressable: true,
  shadow: 'md'
})

const emit = defineEmits<{
  click: [event: any]
}>()

const isPressed = ref(false)
const isHoverable = computed(() => props.hoverable)

const handleTouchStart = () => {
  if (props.pressable) {
    isPressed.value = true
  }
}

const handleTouchEnd = () => {
  if (props.pressable) {
    setTimeout(() => {
      isPressed.value = false
    }, 150)
  }
}

const handleClick = (event: any) => {
  emit('click', event)
}
</script>

<style lang="scss" scoped>
.neo-card {
  background: var(--neo-white);
  border: var(--neo-border-width) solid var(--neo-border-color);
  box-shadow: var(--neo-shadow-md);
  transition: var(--neo-transition);
  overflow: hidden;
}

.neo-card--default {
  background: var(--neo-white);
}

.neo-card--primary {
  background: var(--neo-primary);
}

.neo-card--secondary {
  background: var(--neo-secondary);
  color: var(--neo-white);
}

.neo-card--accent {
  background: var(--neo-accent);
  color: var(--neo-white);
}

.neo-card--success {
  background: var(--neo-success);
  color: var(--neo-white);
}

.neo-card--warning {
  background: var(--neo-warning);
  color: var(--neo-black);
}

.neo-card--error {
  background: var(--neo-error);
  color: var(--neo-white);
}

.neo-card--pressed {
  transform: translate(2px, 2px);
  box-shadow: var(--neo-shadow-sm);
}

/* #ifdef H5 */
.neo-card--hover:hover {
  transform: translate(-1px, -1px);
  box-shadow: var(--neo-shadow-lg);
}
/* #endif */

.neo-card__header {
  padding: var(--neo-spacing-lg);
  border-bottom: var(--neo-border-width-thin) solid var(--neo-border-color);
  font-weight: 600;
}

.neo-card__body {
  padding: var(--neo-spacing-lg);
  flex: 1;
}

.neo-card__footer {
  padding: var(--neo-spacing-lg);
  border-top: var(--neo-border-width-thin) solid var(--neo-border-color);
  background: var(--neo-gray-100);
}

/* 小程序端适配 */
/* #ifdef MP-WEIXIN */
.neo-card__body {
  padding: 24rpx;
}

.neo-card__header,
.neo-card__footer {
  padding: 24rpx;
}
/* #endif */
</style>