<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { DataManager } from './utils/dataManager.js'

export default {
  name: 'App',
  mounted() {
    // 数据已在main.js中初始化，这里不再重复调用
    console.log('App.vue mounted')
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
}

body {
  margin: 0;
  padding: 0;
}
</style>
