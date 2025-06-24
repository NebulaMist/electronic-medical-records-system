import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './router'
import App from './App.vue'
import { DataManager } from './utils/dataManager.js'

// 引入 ECharts
import * as echarts from 'echarts'
import VChart from 'vue-echarts'

// 初始化示例数据
DataManager.initializeData()

const app = createApp(App)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 全局注册 VChart 组件
app.component('VChart', VChart)

// 将 echarts 挂载到全局属性
app.config.globalProperties.$echarts = echarts

app.use(ElementPlus)
app.use(router)
app.mount('#app')
