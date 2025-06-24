<template>
  <Layout>
    <div class="dashboard">
      <h2>系统概览</h2>
      
      <!-- 统计卡片 -->
      <el-row :gutter="20" class="stats-row">
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon patients">
                <el-icon size="30"><UserFilled /></el-icon>
              </div>
              <div class="stat-info">
                <h3>{{ stats.totalPatients }}</h3>
                <p>总患者数</p>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon records">
                <el-icon size="30"><Document /></el-icon>
              </div>
              <div class="stat-info">
                <h3>{{ stats.totalRecords }}</h3>
                <p>总病案数</p>
              </div>
            </div>
          </el-card>
        </el-col>
          <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon departments">
                <el-icon size="30"><OfficeBuilding /></el-icon>
              </div>
              <div class="stat-info">
                <h3>{{ stats.totalDepartments }}</h3>
                <p>总科室数</p>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon staff">
                <el-icon size="30"><Avatar /></el-icon>
              </div>
              <div class="stat-info">
                <h3>{{ stats.totalStaff }}</h3>
                <p>在职员工</p>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      
      <!-- 最近病案 -->
      <el-card class="recent-records" style="margin-top: 20px;">
        <template #header>
          <div class="card-header">
            <span>最近病案</span>
            <el-button 
              type="primary" 
              size="small"
              @click="$router.push('/medical-records')"
            >
              查看全部
            </el-button>
          </div>
        </template>
        
        <el-table :data="recentRecords" style="width: 100%">
          <el-table-column prop="patientName" label="患者姓名" width="120" />
          <el-table-column prop="department" label="科室" width="100" />
          <el-table-column prop="doctor" label="主治医生" width="120" />
          <el-table-column prop="diagnosis" label="诊断" />
          <el-table-column prop="admissionDate" label="入院日期" width="120" />
          <el-table-column prop="cost" label="费用" width="100">
            <template #default="scope">
              ¥{{ scope.row.cost }}
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </Layout>
</template>

<script>
import Layout from '../components/Layout.vue'
import { DataManager } from '../utils/dataManager.js'

export default {
  name: 'Dashboard',
  components: {
    Layout
  },  data() {
    return {
      stats: {
        totalPatients: 0,
        totalRecords: 0,
        totalDepartments: 0,
        totalStaff: 0
      },
      recentRecords: []
    }
  },
  mounted() {
    this.loadStats()
    this.loadRecentRecords()
  },  methods: {
    loadStats() {
      try {
        const patients = DataManager.getPatients()
        const records = DataManager.getMedicalRecords()
        const departments = DataManager.getDepartments()
        const staff = DataManager.getStaff()
        
        console.log('Dashboard数据加载:', {
          patients: patients.length,
          records: records.length,
          departments: departments.length,
          staff: staff.length
        })
        
        // 检查数据完整性，如果患者少于50人，可能需要重新初始化
        if (patients.length < 50) {
          console.warn('检测到数据不完整，患者数量:', patients.length)
          this.$message.warning('检测到数据不完整，建议刷新页面重新加载数据')
        }
        
        this.stats.totalPatients = patients.length
        this.stats.totalRecords = records.length
        this.stats.totalDepartments = departments.length
        this.stats.totalStaff = staff.filter(s => s.status === '在职').length
      } catch (error) {
        console.error('Dashboard数据加载错误:', error)
        this.$message.error('数据加载失败，请刷新页面')
      }
    },    
    loadRecentRecords() {
      try {
        const records = DataManager.getMedicalRecords()
        console.log('加载最近病案记录，总数:', records.length)
        
        // 获取最近5条记录
        this.recentRecords = records
          .sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
          .slice(0, 5)
          
        console.log('最近病案记录:', this.recentRecords.length)
      } catch (error) {
        console.error('加载最近病案记录错误:', error)
        this.recentRecords = []
      }
    }
  }
}
</script>

<style scoped>
.dashboard h2 {
  margin-bottom: 20px;
  color: #303133;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-icon.patients {
  background: linear-gradient(45deg, #667eea, #764ba2);
}

.stat-icon.records {
  background: linear-gradient(45deg, #f093fb, #f5576c);
}

.stat-icon.departments {
  background: linear-gradient(45deg, #667eea, #764ba2);
}

.stat-icon.staff {
  background: linear-gradient(45deg, #f093fb, #f5576c);
}

.stat-info h3 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.stat-info p {
  margin: 5px 0 0 0;
  color: #909399;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
