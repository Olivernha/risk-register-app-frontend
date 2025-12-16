<template>
  <div id="app" class="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
    <router-view />
    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';
// Main app component
</script>

<style>
#app {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
