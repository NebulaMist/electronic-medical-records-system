<template>
  <Layout>
    <div class="patients">
      <div class="page-header">
        <h2>患者管理</h2>
        <el-button type="primary" @click="showAddDialog = true">
          <el-icon><Plus /></el-icon>
          新建患者
        </el-button>
      </div>
      
      <!-- 搜索栏 -->
      <el-card class="search-card">
        <el-form :model="searchForm" inline>
          <el-form-item label="患者姓名">
            <el-input 
              v-model="searchForm.name" 
              placeholder="请输入患者姓名"
              clearable
            />
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="searchForm.gender" placeholder="请选择性别" clearable>
              <el-option label="男" value="男" />
              <el-option label="女" value="女" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      
      <!-- 患者列表 -->
      <el-card>
        <el-table :data="filteredPatients" style="width: 100%">
          <el-table-column prop="name" label="姓名" width="120" />
          <el-table-column prop="gender" label="性别" width="80" />
          <el-table-column prop="age" label="年龄" width="80" />
          <el-table-column prop="phone" label="联系电话" width="140" />
          <el-table-column prop="idCard" label="身份证号" width="180" />
          <el-table-column prop="address" label="地址" />
          <el-table-column label="就诊次数" width="100">
            <template #default="scope">
              {{ getPatientRecordCount(scope.row.id) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button size="small" @click="viewPatient(scope.row)">查看</el-button>
              <el-button size="small" type="primary" @click="editPatient(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="deletePatient(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      
      <!-- 新建/编辑患者对话框 -->
      <el-dialog 
        :title="dialogTitle" 
        v-model="showAddDialog" 
        width="500px"
      >
        <el-form :model="patientForm" :rules="rules" ref="patientFormRef" label-width="100px">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="patientForm.name" placeholder="请输入患者姓名" />
          </el-form-item>
          
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="patientForm.gender">
              <el-radio label="男">男</el-radio>
              <el-radio label="女">女</el-radio>
            </el-radio-group>
          </el-form-item>
          
          <el-form-item label="年龄" prop="age">
            <el-input-number 
              v-model="patientForm.age" 
              :min="0" 
              :max="150" 
              style="width: 100%"
            />
          </el-form-item>
          
          <el-form-item label="身份证号" prop="idCard">
            <el-input v-model="patientForm.idCard" placeholder="请输入身份证号" />
          </el-form-item>
          
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="patientForm.phone" placeholder="请输入联系电话" />
          </el-form-item>
          
          <el-form-item label="地址" prop="address">
            <el-input 
              v-model="patientForm.address" 
              type="textarea" 
              :rows="2"
              placeholder="请输入地址"
            />
          </el-form-item>
        </el-form>
        
        <template #footer>
          <el-button @click="showAddDialog = false">取消</el-button>
          <el-button type="primary" @click="savePatient">确定</el-button>
        </template>
      </el-dialog>
      
      <!-- 查看患者详情对话框 -->
      <el-dialog title="患者详情" v-model="showViewDialog" width="700px">
        <div class="patient-detail" v-if="currentPatient">
          <!-- 基本信息 -->
          <el-card class="detail-card">
            <template #header>
              <span>基本信息</span>
            </template>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="姓名">{{ currentPatient.name }}</el-descriptions-item>
              <el-descriptions-item label="性别">{{ currentPatient.gender }}</el-descriptions-item>
              <el-descriptions-item label="年龄">{{ currentPatient.age }}岁</el-descriptions-item>
              <el-descriptions-item label="身份证号">{{ currentPatient.idCard }}</el-descriptions-item>
              <el-descriptions-item label="联系电话">{{ currentPatient.phone }}</el-descriptions-item>
              <el-descriptions-item label="地址">{{ currentPatient.address }}</el-descriptions-item>
            </el-descriptions>
          </el-card>
          
          <!-- 就诊历史 -->
          <el-card class="detail-card" style="margin-top: 20px;">
            <template #header>
              <span>就诊历史</span>
            </template>
            <el-table :data="patientRecords" style="width: 100%">
              <el-table-column prop="department" label="科室" width="100" />
              <el-table-column prop="doctor" label="医生" width="100" />
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
      </el-dialog>
    </div>
  </Layout>
</template>

<script>
import Layout from '../components/Layout.vue'
import { DataManager } from '../utils/dataManager.js'

export default {
  name: 'Patients',
  components: {
    Layout
  },
  data() {
    return {
      patients: [],
      records: [],
      filteredPatients: [],
      patientRecords: [],
      showAddDialog: false,
      showViewDialog: false,
      isEdit: false,
      currentPatient: null,
      searchForm: {
        name: '',
        gender: ''
      },
      patientForm: {
        name: '',
        gender: '',
        age: null,
        idCard: '',
        phone: '',
        address: ''
      },
      rules: {
        name: [{ required: true, message: '请输入患者姓名', trigger: 'blur' }],
        gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
        age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
        idCard: [
          { required: true, message: '请输入身份证号', trigger: 'blur' },
          { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '身份证号格式不正确', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    dialogTitle() {
      return this.isEdit ? '编辑患者' : '新建患者'
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.patients = DataManager.getPatients()
      this.records = DataManager.getMedicalRecords()
      this.filteredPatients = [...this.patients]
    },
    
    handleSearch() {
      this.filteredPatients = this.patients.filter(patient => {
        const matchName = !this.searchForm.name || 
          patient.name.includes(this.searchForm.name)
        const matchGender = !this.searchForm.gender || 
          patient.gender === this.searchForm.gender
        return matchName && matchGender
      })
    },
    
    resetSearch() {
      this.searchForm = { name: '', gender: '' }
      this.filteredPatients = [...this.patients]
    },
    
    getPatientRecordCount(patientId) {
      return this.records.filter(record => record.patientId === patientId).length
    },
    
    viewPatient(patient) {
      this.currentPatient = patient
      this.patientRecords = this.records.filter(record => record.patientId === patient.id)
      this.showViewDialog = true
    },
    
    editPatient(patient) {
      this.isEdit = true
      this.patientForm = { ...patient }
      this.showAddDialog = true
    },
    
    deletePatient(patient) {
      const recordCount = this.getPatientRecordCount(patient.id)
      if (recordCount > 0) {
        this.$message.warning('该患者还有相关病案记录，无法删除')
        return
      }
      
      this.$confirm('确认删除这个患者吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DataManager.deletePatient(patient.id)
        this.loadData()
        this.$message.success('删除成功')
      })
    },
    
    savePatient() {
      this.$refs.patientFormRef.validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            DataManager.updatePatient(this.patientForm.id, this.patientForm)
            this.$message.success('更新成功')
          } else {
            DataManager.addPatient(this.patientForm)
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
      this.patientForm = {
        name: '',
        gender: '',
        age: null,
        idCard: '',
        phone: '',
        address: ''
      }
      this.$nextTick(() => {
        this.$refs.patientFormRef?.clearValidate()
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

.search-card {
  margin-bottom: 20px;
}

.patient-detail {
  padding: 20px 0;
}

.detail-card {
  margin-bottom: 20px;
}
</style>
