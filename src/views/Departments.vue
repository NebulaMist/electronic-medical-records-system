<template>
  <Layout>
    <div class="departments">
      <div class="page-header">
        <h2>科室管理</h2>
        <el-button 
          v-if="canEdit" 
          type="primary" 
          @click="showAddDialog = true"
        >
          <el-icon><Plus /></el-icon>
          新建科室
        </el-button>
      </div>
      
      <!-- 权限提示 -->
      <el-alert 
        v-if="!canEdit"
        title="您当前只有查看权限，无法进行编辑操作"
        type="info"
        :closable="false"
        style="margin-bottom: 20px;"
      />
      
      <div class="departments-content">
        <!-- 左侧科室类型筛选 -->
        <div class="department-types">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>科室分类</span>
              </div>
            </template>
            
            <div class="type-list">
              <div 
                class="type-item" 
                :class="{ active: selectedType === 'all' }"
                @click="selectType('all')"
              >
                <el-icon><List /></el-icon>
                <span>全部科室</span>
                <el-tag size="small" type="info">{{ totalCount }}</el-tag>
              </div>
              
              <div 
                v-for="type in departmentTypes" 
                :key="type.name"
                class="type-item" 
                :class="{ active: selectedType === type.name }"
                @click="selectType(type.name)"
              >
                <el-icon><OfficeBuilding /></el-icon>
                <span>{{ type.name }}</span>
                <el-tag size="small" type="primary">{{ type.count }}</el-tag>
              </div>
            </div>
          </el-card>
        </div>
        
        <!-- 右侧科室列表 -->
        <div class="department-list">
          <el-card>
            <!-- 搜索栏 -->
            <div class="search-bar">
              <el-input 
                v-model="searchKeyword" 
                placeholder="搜索科室名称、主任或位置"
                clearable
                @input="handleSearch"
                style="width: 300px;"
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
            </div>
            
            <!-- 科室表格 -->
            <el-table :data="filteredDepartments" style="width: 100%; margin-top: 20px;">
              <el-table-column prop="name" label="科室名称" width="120" />
              <el-table-column prop="type" label="科室类型" width="100">
                <template #default="scope">
                  <el-tag 
                    :type="getTypeTagType(scope.row.type)"
                  >
                    {{ scope.row.type }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="director" label="科室主任" width="100" />
              <el-table-column prop="location" label="位置" width="120" />
              <el-table-column prop="phone" label="联系电话" width="130" />
              <el-table-column prop="staffCount" label="职员数量" width="80">
                <template #default="scope">
                  <el-tag type="success">{{ scope.row.staffCount }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="description" label="科室描述" min-width="200" show-overflow-tooltip />              <el-table-column label="操作" width="280">
                <template #default="scope">
                  <el-button size="small" @click="viewDepartment(scope.row)">查看</el-button>
                  <el-button 
                    size="small" 
                    type="success" 
                    @click="viewDoctorCases(scope.row.director)"
                  >
                    主任案例
                  </el-button>
                  <el-button 
                    v-if="canEdit" 
                    size="small" 
                    type="primary" 
                    @click="editDepartment(scope.row)"
                  >
                    编辑
                  </el-button>
                  <el-button 
                    v-if="canEdit" 
                    size="small" 
                    type="danger" 
                    @click="deleteDepartment(scope.row)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
      </div>
      
      <!-- 新建/编辑科室对话框 -->
      <el-dialog 
        :title="dialogTitle" 
        v-model="showAddDialog" 
        width="600px"
      >
        <el-form :model="departmentForm" :rules="rules" ref="departmentFormRef" label-width="100px">
          <el-form-item label="科室名称" prop="name">
            <el-input v-model="departmentForm.name" placeholder="请输入科室名称" />
          </el-form-item>
          
          <el-form-item label="科室类型" prop="type">
            <el-select v-model="departmentForm.type" placeholder="请选择类型" style="width: 100%">
              <el-option label="临床科室" value="临床科室" />
              <el-option label="医技科室" value="医技科室" />
              <el-option label="行政科室" value="行政科室" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="科室主任" prop="director">
            <el-input v-model="departmentForm.director" placeholder="请输入科室主任" />
          </el-form-item>
          
          <el-form-item label="科室位置" prop="location">
            <el-input v-model="departmentForm.location" placeholder="请输入科室位置" />
          </el-form-item>
          
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="departmentForm.phone" placeholder="请输入联系电话" />
          </el-form-item>
          
          <el-form-item label="科室描述" prop="description">
            <el-input 
              v-model="departmentForm.description" 
              type="textarea" 
              :rows="3"
              placeholder="请输入科室描述"
            />
          </el-form-item>
        </el-form>
        
        <template #footer>
          <el-button @click="resetForm">取消</el-button>
          <el-button type="primary" @click="saveDepartment">确定</el-button>
        </template>
      </el-dialog>
        <!-- 查看科室详情对话框 -->
      <el-dialog title="科室详情" v-model="showViewDialog" width="600px">
        <div class="department-detail" v-if="currentDepartment">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="科室名称">{{ currentDepartment.name }}</el-descriptions-item>
            <el-descriptions-item label="科室类型">{{ currentDepartment.type }}</el-descriptions-item>
            <el-descriptions-item label="科室主任">{{ currentDepartment.director }}</el-descriptions-item>
            <el-descriptions-item label="科室位置">{{ currentDepartment.location }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{ currentDepartment.phone }}</el-descriptions-item>
            <el-descriptions-item label="职员数量">{{ currentDepartment.staffCount }}人</el-descriptions-item>
            <el-descriptions-item label="创建时间" :span="2">
              {{ formatDate(currentDepartment.createTime) }}
            </el-descriptions-item>
            <el-descriptions-item label="科室描述" :span="2">
              {{ currentDepartment.description }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </el-dialog>

      <!-- 医生案例查看对话框 -->
      <el-dialog title="医生诊断案例" v-model="showDoctorCasesDialog" width="900px">
        <div v-if="currentDoctor">
          <!-- 医生统计信息 -->
          <el-card class="doctor-stats-card" style="margin-bottom: 20px;">
            <template #header>
              <div class="card-header">
                <span>{{ currentDoctor }} - 统计信息</span>
              </div>
            </template>
            
            <el-row :gutter="20">
              <el-col :span="6">
                <div class="stat-item">
                  <div class="stat-value">{{ doctorStats.totalCases }}</div>
                  <div class="stat-label">总病案数</div>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="stat-item">
                  <div class="stat-value">¥{{ formatCurrency(doctorStats.totalCost) }}</div>
                  <div class="stat-label">总医疗费用</div>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="stat-item">
                  <div class="stat-value">¥{{ formatCurrency(doctorStats.avgCost) }}</div>
                  <div class="stat-label">平均费用</div>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="stat-item">
                  <div class="stat-value">{{ Object.keys(doctorStats.diagnosisStats).length }}</div>
                  <div class="stat-label">诊断类型</div>
                </div>
              </el-col>
            </el-row>
          </el-card>

          <!-- 最近诊断案例 -->
          <el-card>
            <template #header>
              <div class="card-header">
                <span>最近诊断案例（最多显示10条）</span>
              </div>
            </template>
            
            <el-table :data="doctorCases" style="width: 100%;" max-height="400">
              <el-table-column prop="patientName" label="患者姓名" width="100" />
              <el-table-column prop="department" label="科室" width="100">
                <template #default="scope">
                  <el-tag :type="getTypeTagType(scope.row.department)">
                    {{ scope.row.department }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="diagnosis" label="诊断" width="150" show-overflow-tooltip />
              <el-table-column prop="treatment" label="治疗方案" width="150" show-overflow-tooltip />
              <el-table-column prop="admissionDate" label="入院日期" width="100" />
              <el-table-column prop="dischargeDate" label="出院日期" width="100">
                <template #default="scope">
                  <span v-if="scope.row.dischargeDate">{{ scope.row.dischargeDate }}</span>
                  <el-tag v-else type="warning" size="small">住院中</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="cost" label="医疗费用" width="100">
                <template #default="scope">
                  <span class="cost-text">¥{{ formatCurrency(scope.row.cost) }}</span>
                </template>
              </el-table-column>
            </el-table>
            
            <!-- 如果没有案例 -->
            <div v-if="doctorCases.length === 0" class="no-data">
              <el-empty description="该医生暂无诊断案例" />
            </div>
          </el-card>
        </div>
      </el-dialog>
    </div>
  </Layout>
</template>

<script>
import Layout from '../components/Layout.vue'
import { DataManager } from '../utils/dataManager.js'
import { Plus, List, OfficeBuilding, Search } from '@element-plus/icons-vue'

export default {
  name: 'Departments',
  components: {
    Layout,
    Plus,
    List,
    OfficeBuilding,
    Search
  },  data() {
    return {
      userInfo: {},
      departments: [],
      filteredDepartments: [],
      showAddDialog: false,
      showViewDialog: false,
      showDoctorCasesDialog: false,
      isEdit: false,
      currentDepartment: null,
      currentDoctor: '',
      doctorCases: [],
      doctorStats: {
        totalCases: 0,
        totalCost: 0,
        avgCost: 0,
        diagnosisStats: {},
        departmentStats: {}
      },
      selectedType: 'all',
      searchKeyword: '',
      departmentForm: {
        name: '',
        type: '',
        director: '',
        location: '',
        phone: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '请输入科室名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择科室类型', trigger: 'change' }],
        director: [{ required: true, message: '请输入科室主任', trigger: 'blur' }],
        location: [{ required: true, message: '请输入科室位置', trigger: 'blur' }],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    dialogTitle() {
      return this.isEdit ? '编辑科室' : '新建科室'
    },
    
    canEdit() {
      return this.userInfo.role === 'admin'
    },
    
    canView() {
      return ['admin', 'doctor', 'nurse'].includes(this.userInfo.role)
    },
    
    departmentTypes() {
      const types = {}
      this.departments.forEach(dept => {
        if (!types[dept.type]) {
          types[dept.type] = 0
        }
        types[dept.type]++
      })
      
      return Object.keys(types).map(type => ({
        name: type,
        count: types[type]
      }))
    },
    
    totalCount() {
      return this.departments.length
    }
  },
  mounted() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
    this.loadData()
  },
  methods: {
    loadData() {
      this.departments = DataManager.getDepartments()
      this.filterDepartments()
    },
    
    selectType(type) {
      this.selectedType = type
      this.filterDepartments()
    },
    
    handleSearch() {
      this.filterDepartments()
    },
    
    filterDepartments() {
      let filtered = [...this.departments]
      
      // 按类型筛选
      if (this.selectedType !== 'all') {
        filtered = filtered.filter(dept => dept.type === this.selectedType)
      }
      
      // 按搜索关键词筛选
      if (this.searchKeyword) {
        const keyword = this.searchKeyword.toLowerCase()
        filtered = filtered.filter(dept => 
          dept.name.toLowerCase().includes(keyword) ||
          dept.director.toLowerCase().includes(keyword) ||
          dept.location.toLowerCase().includes(keyword)
        )
      }
      
      this.filteredDepartments = filtered
    },
    
    getTypeTagType(type) {
      switch (type) {
        case '临床科室':
          return 'primary'
        case '医技科室':
          return 'success'
        case '行政科室':
          return 'warning'
        default:
          return 'info'
      }
    },
    
    viewDepartment(department) {
      this.currentDepartment = department
      this.showViewDialog = true
    },
    
    editDepartment(department) {
      if (!this.canEdit) {
        this.$message.warning('您没有编辑权限')
        return
      }
      this.isEdit = true
      this.departmentForm = { ...department }
      this.showAddDialog = true
    },
    
    deleteDepartment(department) {
      if (!this.canEdit) {
        this.$message.warning('您没有删除权限')
        return
      }
      
      this.$confirm('确认删除这个科室吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DataManager.deleteDepartment(department.id)
        this.loadData()
        this.$message.success('删除成功')
      })
    },
    
    saveDepartment() {
      if (!this.canEdit) {
        this.$message.warning('您没有编辑权限')
        return
      }
      
      this.$refs.departmentFormRef.validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            DataManager.updateDepartment(this.departmentForm.id, this.departmentForm)
            this.$message.success('更新成功')
          } else {
            DataManager.addDepartment(this.departmentForm)
            this.$message.success('添加成功')
          }
          
          this.loadData()
          this.resetForm()
        }
      })
    },
    
    resetForm() {
      this.showAddDialog = false
      this.isEdit = false
      this.departmentForm = {
        name: '',
        type: '',
        director: '',
        location: '',
        phone: '',
        description: ''
      }
      this.$nextTick(() => {
        this.$refs.departmentFormRef?.clearValidate()
      })
    },
      formatDate(dateString) {
      if (!dateString) return ''
      return new Date(dateString).toLocaleString('zh-CN')
    },

    // 查看医生案例
    viewDoctorCases(doctorName) {
      this.currentDoctor = doctorName
      this.doctorCases = DataManager.getMedicalRecordsByDoctor(doctorName, 10)
      this.doctorStats = DataManager.getDoctorStatistics(doctorName)
      this.showDoctorCasesDialog = true
    },

    // 格式化货币
    formatCurrency(amount) {
      if (!amount && amount !== 0) return '0'
      return Number(amount).toLocaleString('zh-CN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      })
    }
  }
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  color: #303133;
}

.departments-content {
  display: flex;
  gap: 20px;
  height: calc(100vh - 200px);
}

.department-types {
  width: 250px;
  flex-shrink: 0;
}

.department-types .el-card {
  height: 100%;
}

.type-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.type-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid transparent;
}

.type-item:hover {
  background-color: #f5f7fa;
  border-color: #e4e7ed;
}

.type-item.active {
  background-color: #ecf5ff;
  border-color: #409eff;
  color: #409eff;
}

.type-item span {
  flex: 1;
  font-size: 14px;
}

.department-list {
  flex: 1;
  overflow: hidden;
}

.department-list .el-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.department-list .el-card :deep(.el-card__body) {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.search-bar {
  margin-bottom: 16px;
}

.department-detail {
  padding: 20px 0;
}

.doctor-stats-card {
  margin-bottom: 20px;
}

.stat-item {
  text-align: center;
  padding: 10px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.cost-text {
  color: #67c23a;
  font-weight: bold;
}

.no-data {
  text-align: center;
  padding: 40px 0;
}
</style>
