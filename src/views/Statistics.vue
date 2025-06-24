<template>
  <Layout>
    <div class="statistics">
      <h2>统计报表</h2>
      
      <!-- 统计概览 -->
      <el-row :gutter="20" class="stats-overview">
        <el-col :span="6">
          <el-card class="stat-card patients">
            <div class="stat-item">
              <el-icon class="stat-icon"><User /></el-icon>
              <div class="stat-content">
                <div class="stat-number">{{ totalPatients }}</div>
                <div class="stat-label">总患者数</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card records">
            <div class="stat-item">
              <el-icon class="stat-icon"><Document /></el-icon>
              <div class="stat-content">
                <div class="stat-number">{{ totalRecords }}</div>
                <div class="stat-label">总病案数</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card cost">
            <div class="stat-item">
              <el-icon class="stat-icon"><Money /></el-icon>
              <div class="stat-content">
                <div class="stat-number">¥{{ totalCost.toLocaleString() }}</div>
                <div class="stat-label">总医疗费用</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card average">
            <div class="stat-item">
              <el-icon class="stat-icon"><TrendCharts /></el-icon>
              <div class="stat-content">
                <div class="stat-number">¥{{ averageCost.toLocaleString() }}</div>
                <div class="stat-label">平均费用</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      
      <!-- 图表区域 - 4个核心图表 -->
      <el-row :gutter="20" style="margin-top: 20px;">
        <!-- 科室病案分布饼图 -->
        <el-col :span="12">
          <el-card>
            <template #header>
              <span>科室病案分布</span>
            </template>
            <v-chart 
              class="chart" 
              :option="departmentPieOption" 
              style="height: 350px;"
            />
          </el-card>
        </el-col>
        
        <!-- 月度趋势图 -->
        <el-col :span="12">
          <el-card>
            <template #header>
              <span>月度趋势分析</span>
            </template>
            <v-chart 
              class="chart" 
              :option="monthlyTrendOption" 
              style="height: 350px;"
            />
          </el-card>
        </el-col>
      </el-row>
      
      <el-row :gutter="20" style="margin-top: 20px;">
        <!-- 科室费用对比柱状图 -->
        <el-col :span="12">
          <el-card>
            <template #header>
              <span>科室费用对比</span>
            </template>
            <v-chart 
              class="chart" 
              :option="departmentCostBarOption" 
              style="height: 350px;"
            />
          </el-card>
        </el-col>
        
        <!-- 患者年龄分布 -->
        <el-col :span="12">
          <el-card>
            <template #header>
              <span>患者年龄分布</span>
            </template>
            <v-chart 
              class="chart" 
              :option="ageDistributionOption" 
              style="height: 350px;"
            />
          </el-card>
        </el-col>
      </el-row>
      
      <!-- 数据表格区域 -->
      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="12">
          <el-card>
            <template #header>
              <span>科室统计详情</span>
            </template>
            <el-table :data="departmentStats.slice(0, 8)" style="width: 100%" max-height="300">
              <el-table-column prop="department" label="科室" />
              <el-table-column prop="count" label="病案数量" align="center" />
              <el-table-column prop="percentage" label="占比" align="center">
                <template #default="scope">
                  {{ scope.row.percentage }}%
                </template>
              </el-table-column>
              <el-table-column prop="totalCost" label="总费用" align="center">
                <template #default="scope">
                  ¥{{ scope.row.totalCost.toLocaleString() }}
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
        
        <el-col :span="12">
          <el-card>
            <template #header>
              <span>医生工作统计</span>
            </template>
            <el-table :data="doctorStats.slice(0, 8)" style="width: 100%" max-height="300">
              <el-table-column prop="doctor" label="医生" />
              <el-table-column prop="count" label="病案数量" align="center" />
              <el-table-column prop="totalCost" label="总费用" align="center">
                <template #default="scope">
                  ¥{{ scope.row.totalCost.toLocaleString() }}
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
      
      <!-- 操作按钮 -->
      <div class="action-section" style="margin-top: 20px;">
        <el-card>
          <template #header>
            <span>数据操作</span>
          </template>
          <el-space>
            <el-button type="warning" @click="refreshData">
              <el-icon><Refresh /></el-icon>
              刷新数据
            </el-button>
            <el-button type="info" @click="initializeTestData">
              <el-icon><Download /></el-icon>
              重新生成测试数据
            </el-button>
            <el-button type="primary" @click="exportStatistics">
              <el-icon><Download /></el-icon>
              导出统计报表
            </el-button>
          </el-space>
        </el-card>
      </div>
    </div>
  </Layout>
</template>

<script>
import Layout from '../components/Layout.vue'
import { DataManager } from '../utils/dataManager.js'
import { User, Document, Money, TrendCharts, Download, Refresh } from '@element-plus/icons-vue'

export default {
  name: 'Statistics',
  components: {
    Layout,
    User,
    Document,
    Money,
    TrendCharts,
    Download,
    Refresh
  },
  data() {
    return {
      patients: [],
      records: [],
      departmentStats: [],
      doctorStats: [],
      monthlyStats: [],
      loading: false
    }
  },
  computed: {
    totalPatients() {
      return this.patients.length
    },
    
    totalRecords() {
      return this.records.length
    },
    
    totalCost() {
      return this.records.reduce((sum, record) => sum + (record.cost || 0), 0)
    },
    
    averageCost() {
      return this.totalRecords > 0 ? Math.round(this.totalCost / this.totalRecords) : 0
    },

    // 科室病案分布饼图配置
    departmentPieOption() {
      if (!this.departmentStats.length) return {}
      
      const data = this.departmentStats.map(item => ({
        name: item.department,
        value: item.count
      }))
      
      return {
        title: {
          text: '科室病案分布',
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          bottom: '5%',
          left: 'center'
        },
        series: [
          {
            name: '病案数量',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            data: data
          }
        ]
      }
    },

    // 月度趋势线图配置
    monthlyTrendOption() {
      if (!this.monthlyStats.length) return {}
      
      const months = this.monthlyStats.map(item => item.month)
      const patientData = this.monthlyStats.map(item => item.patientCount)
      const recordData = this.monthlyStats.map(item => item.recordCount)
      const costData = this.monthlyStats.map(item => Math.round(item.totalCost / 1000))
      
      return {
        title: {
          text: '月度趋势分析',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          bottom: '5%',
          data: ['新增患者', '新增病案', '费用(千元)']
        },
        xAxis: {
          type: 'category',
          data: months.reverse()
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '新增患者',
            type: 'line',
            data: patientData.reverse(),
            smooth: true,
            itemStyle: { color: '#409EFF' }
          },
          {
            name: '新增病案',
            type: 'line',
            data: recordData.reverse(),
            smooth: true,
            itemStyle: { color: '#67C23A' }
          },
          {
            name: '费用(千元)',
            type: 'line',
            data: costData.reverse(),
            smooth: true,
            itemStyle: { color: '#E6A23C' }
          }
        ]
      }
    },

    // 科室费用对比柱状图配置
    departmentCostBarOption() {
      if (!this.departmentStats.length) return {}
      
      const departments = this.departmentStats.map(item => item.department)
      const costs = this.departmentStats.map(item => {
        return Math.round(item.totalCost / 1000)
      })
      
      return {
        title: {
          text: '科室费用对比',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: departments,
          axisLabel: {
            rotate: 45
          }
        },
        yAxis: {
          type: 'value',
          name: '费用(千元)'
        },
        series: [
          {
            name: '总费用',
            type: 'bar',
            data: costs,
            itemStyle: {
              color: function(params) {
                const colors = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc']
                return colors[params.dataIndex % colors.length]
              }
            }
          }
        ]
      }
    },

    // 患者年龄分布柱状图配置
    ageDistributionOption() {
      if (!this.patients.length) return {}
      
      const ageRanges = ['0-18', '19-30', '31-45', '46-60', '61-75', '76+']
      const ageCounts = [0, 0, 0, 0, 0, 0]
      
      this.patients.forEach(patient => {
        const age = patient.age
        if (age <= 18) ageCounts[0]++
        else if (age <= 30) ageCounts[1]++
        else if (age <= 45) ageCounts[2]++
        else if (age <= 60) ageCounts[3]++
        else if (age <= 75) ageCounts[4]++
        else ageCounts[5]++
      })
      
      return {
        title: {
          text: '患者年龄分布',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: ageRanges
        },
        yAxis: {
          type: 'value',
          name: '人数'
        },
        series: [
          {
            name: '患者数量',
            type: 'bar',
            data: ageCounts,
            itemStyle: {
              color: '#91cc75'
            }
          }
        ]
      }
    }
  },
  
  mounted() {
    console.log('Statistics页面mounted')
    this.loadData()
    this.calculateStats()
  },
  
  methods: {    async loadData() {
      this.loading = true
      console.log('正在加载数据...')
      
      try {
        this.patients = DataManager.getPatients()
        this.records = DataManager.getMedicalRecords()
        console.log(`加载完成：患者${this.patients.length}人，病案${this.records.length}个`)
        
        // 检查数据质量：如果患者少于50人，认为数据不完整
        if (this.patients.length < 50 || this.records.length < 50) {
          console.log(`检测到数据不完整（患者${this.patients.length}人，病案${this.records.length}个），正在重新初始化...`)
          
          // 清除现有不完整数据
          localStorage.removeItem('patients')
          localStorage.removeItem('medicalRecords')
          localStorage.removeItem('departments')
          localStorage.removeItem('staff')
          
          // 重新初始化
          DataManager.initializeData()
          this.patients = DataManager.getPatients()
          this.records = DataManager.getMedicalRecords()
          console.log(`重新初始化后：患者${this.patients.length}人，病案${this.records.length}个`)
          
          if (this.patients.length >= 50) {
            this.$message.success(`数据已重新初始化：${this.patients.length}个患者，${this.records.length}个病案`)
          } else {
            this.$message.warning('数据初始化后仍然不完整，请检查dataManager.js')
          }
        }
      } catch (error) {
        console.error('数据加载错误:', error)
        this.$message.error('数据加载失败')
      } finally {
        this.loading = false
      }
    },
    
    calculateStats() {
      console.log('开始计算统计数据...')
      this.calculateDepartmentStats()
      this.calculateDoctorStats()
      this.calculateMonthlyStats()
      console.log('统计数据计算完成')
    },
    
    calculateDepartmentStats() {
      const deptCount = {}
      const deptCost = {}
      
      this.records.forEach(record => {
        const dept = record.department || '未知'
        deptCount[dept] = (deptCount[dept] || 0) + 1
        deptCost[dept] = (deptCost[dept] || 0) + (record.cost || 0)
      })
      
      this.departmentStats = Object.entries(deptCount).map(([department, count]) => ({
        department,
        count,
        percentage: ((count / this.totalRecords) * 100).toFixed(1),
        totalCost: deptCost[department] || 0
      })).sort((a, b) => b.count - a.count)
    },
    
    calculateDoctorStats() {
      const doctorCount = {}
      const doctorCost = {}
      
      this.records.forEach(record => {
        const doctor = record.doctor || '未知'
        doctorCount[doctor] = (doctorCount[doctor] || 0) + 1
        doctorCost[doctor] = (doctorCost[doctor] || 0) + (record.cost || 0)
      })
      
      this.doctorStats = Object.entries(doctorCount).map(([doctor, count]) => ({
        doctor,
        count,
        totalCost: doctorCost[doctor] || 0
      })).sort((a, b) => b.count - a.count)
    },
    
    calculateMonthlyStats() {
      const monthlyData = {}
      
      // 统计患者
      this.patients.forEach(patient => {
        if (patient.createTime) {
          const month = patient.createTime.substring(0, 7)
          if (!monthlyData[month]) {
            monthlyData[month] = { patientCount: 0, recordCount: 0, totalCost: 0 }
          }
          monthlyData[month].patientCount++
        }
      })
      
      // 统计病案
      this.records.forEach(record => {
        if (record.createTime) {
          const month = record.createTime.substring(0, 7)
          if (!monthlyData[month]) {
            monthlyData[month] = { patientCount: 0, recordCount: 0, totalCost: 0 }
          }
          monthlyData[month].recordCount++
          monthlyData[month].totalCost += (record.cost || 0)
        }
      })
      
      this.monthlyStats = Object.entries(monthlyData)
        .map(([month, data]) => ({
          month,
          ...data
        }))
        .sort((a, b) => b.month.localeCompare(a.month))
        .slice(0, 6)
    },
    
    async refreshData() {
      await this.loadData()
      this.calculateStats()
      this.$message.success('数据已刷新')
    },

    async initializeTestData() {
      this.loading = true
      try {
        // 清除现有数据
        localStorage.removeItem('patients')
        localStorage.removeItem('medicalRecords')
        localStorage.removeItem('departments')
        localStorage.removeItem('staff')
        
        // 重新初始化数据
        DataManager.initializeData()
        
        // 重新加载数据
        await this.loadData()
        this.calculateStats()
        
        this.$message.success('测试数据已重新生成！')
      } catch (error) {
        console.error('初始化数据错误:', error)
        this.$message.error('数据初始化失败')
      } finally {
        this.loading = false
      }
    },
    
    exportStatistics() {
      const data = {
        summary: {
          totalPatients: this.totalPatients,
          totalRecords: this.totalRecords,
          totalCost: this.totalCost,
          averageCost: this.averageCost
        },
        departmentStats: this.departmentStats,
        doctorStats: this.doctorStats,
        monthlyStats: this.monthlyStats
      }
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = '统计报表.json'
      link.click()
      window.URL.revokeObjectURL(url)
      
      this.$message.success('导出成功')
    }
  }
}
</script>

<style scoped>
.statistics h2 {
  margin-bottom: 20px;
  color: #303133;
  font-size: 24px;
  font-weight: 600;
}

.stats-overview {
  margin-bottom: 20px;
}

.stat-card {
  text-align: center;
  transition: all 0.3s ease;
  border-radius: 8px;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.stat-card.patients {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stat-card.records {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.stat-card.cost {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.stat-card.average {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
}

.stat-item {
  padding: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.stat-icon {
  font-size: 36px;
  opacity: 0.9;
}

.stat-content {
  text-align: left;
}

.stat-number {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 5px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
  font-weight: 500;
}

/* 图表区域样式 */
.chart {
  width: 100%;
  height: 100%;
}

:deep(.el-card) {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

:deep(.el-card:hover) {
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.15);
}

:deep(.el-card__header) {
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  font-weight: 600;
  color: #495057;
}

/* 表格样式 */
:deep(.el-table) {
  border-radius: 6px;
  overflow: hidden;
}

:deep(.el-table th) {
  background: #f8f9fa;
  color: #495057;
  font-weight: 600;
}

:deep(.el-table tr:hover > td) {
  background: #f5f7fa !important;
}

/* 操作按钮区域 */
.action-section {
  text-align: center;
  padding: 20px;
}

:deep(.el-button) {
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
}

:deep(.el-button:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stats-overview :deep(.el-col) {
    margin-bottom: 15px;
  }
  
  .stat-item {
    padding: 20px 15px;
    flex-direction: column;
    gap: 10px;
  }
  
  .stat-content {
    text-align: center;
  }
  
  .stat-number {
    font-size: 24px;
  }
  
  .chart {
    height: 250px !important;
  }
}

@media (max-width: 1200px) {
  .statistics :deep(.el-col-12) {
    margin-bottom: 20px;
  }
}

/* 图表容器动画 */
.el-card {
  animation: fadeInUp 0.6s ease forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
