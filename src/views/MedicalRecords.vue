<template>
  <Layout>
    <div class="medical-records">
      <div class="page-header">
        <h2>病案管理</h2>
        <el-button type="primary" @click="showAddDialog = true">
          <el-icon><Plus /></el-icon>
          新建病案
        </el-button>
      </div>
      
      <!-- 搜索栏 -->
      <el-card class="search-card">
        <el-form :model="searchForm" inline>
          <el-form-item label="患者姓名">
            <el-input 
              v-model="searchForm.patientName" 
              placeholder="请输入患者姓名"
              clearable
            />
          </el-form-item>          <el-form-item label="科室">
            <el-select v-model="searchForm.department" placeholder="请选择科室" clearable>
              <el-option 
                v-for="dept in departments" 
                :key="dept.id" 
                :label="dept.name" 
                :value="dept.name"
              />
            </el-select>
          </el-form-item>
          
          <el-form-item label="主治医生">
            <el-input 
              v-model="searchForm.doctor" 
              placeholder="请输入医生姓名"
              clearable
            />
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      
      <!-- 病案列表 -->
      <el-card>
        <el-table :data="filteredRecords" style="width: 100%">
          <el-table-column prop="patientName" label="患者姓名" width="120" />
          <el-table-column prop="department" label="科室" width="100" />
          <el-table-column prop="doctor" label="主治医生" width="120" />
          <el-table-column prop="diagnosis" label="诊断" />
          <el-table-column prop="admissionDate" label="入院日期" width="120" />
          <el-table-column prop="dischargeDate" label="出院日期" width="120" />
          <el-table-column prop="cost" label="费用" width="100">
            <template #default="scope">
              ¥{{ scope.row.cost }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button size="small" @click="viewRecord(scope.row)">查看</el-button>
              <el-button size="small" type="primary" @click="editRecord(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="deleteRecord(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      
      <!-- 新建/编辑病案对话框 -->
      <el-dialog 
        :title="dialogTitle" 
        v-model="showAddDialog" 
        width="600px"
      >
        <el-form :model="recordForm" :rules="rules" ref="recordFormRef" label-width="100px">
          <el-form-item label="患者" prop="patientId">
            <el-select v-model="recordForm.patientId" placeholder="请选择患者" style="width: 100%">
              <el-option 
                v-for="patient in patients" 
                :key="patient.id" 
                :label="patient.name" 
                :value="patient.id"
                @click="recordForm.patientName = patient.name"
              />
            </el-select>
          </el-form-item>
            <el-form-item label="科室" prop="department">
            <el-select v-model="recordForm.department" placeholder="请选择科室" style="width: 100%">
              <el-option 
                v-for="dept in departments" 
                :key="dept.id" 
                :label="dept.name" 
                :value="dept.name"
              />
            </el-select>
          </el-form-item>
          
          <el-form-item label="主治医生" prop="doctor">
            <el-input v-model="recordForm.doctor" placeholder="请输入主治医生" />
          </el-form-item>
          
          <el-form-item label="入院日期" prop="admissionDate">
            <el-date-picker 
              v-model="recordForm.admissionDate" 
              type="date" 
              placeholder="选择入院日期"
              style="width: 100%"
            />
          </el-form-item>
          
          <el-form-item label="出院日期" prop="dischargeDate">
            <el-date-picker 
              v-model="recordForm.dischargeDate" 
              type="date" 
              placeholder="选择出院日期"
              style="width: 100%"
            />
          </el-form-item>
          
          <el-form-item label="诊断" prop="diagnosis">
            <el-input v-model="recordForm.diagnosis" placeholder="请输入诊断" />
          </el-form-item>
          
          <el-form-item label="治疗方案" prop="treatment">
            <el-input 
              v-model="recordForm.treatment" 
              type="textarea" 
              :rows="3"
              placeholder="请输入治疗方案"
            />
          </el-form-item>
          
          <el-form-item label="费用" prop="cost">
            <el-input-number 
              v-model="recordForm.cost" 
              :min="0" 
              :precision="2"
              style="width: 100%"
            />
          </el-form-item>
        </el-form>
        
        <template #footer>
          <el-button @click="showAddDialog = false">取消</el-button>
          <el-button type="primary" @click="saveRecord">确定</el-button>
        </template>
      </el-dialog>
      
      <!-- 查看病案详情对话框 -->
      <el-dialog title="病案详情" v-model="showViewDialog" width="600px">
        <div class="record-detail" v-if="currentRecord">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="患者姓名">{{ currentRecord.patientName }}</el-descriptions-item>
            <el-descriptions-item label="科室">{{ currentRecord.department }}</el-descriptions-item>
            <el-descriptions-item label="主治医生">{{ currentRecord.doctor }}</el-descriptions-item>
            <el-descriptions-item label="诊断">{{ currentRecord.diagnosis }}</el-descriptions-item>
            <el-descriptions-item label="入院日期">{{ currentRecord.admissionDate }}</el-descriptions-item>
            <el-descriptions-item label="出院日期">{{ currentRecord.dischargeDate }}</el-descriptions-item>
            <el-descriptions-item label="费用">¥{{ currentRecord.cost }}</el-descriptions-item>
            <el-descriptions-item label="治疗方案" :span="2">
              {{ currentRecord.treatment }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </el-dialog>
    </div>
  </Layout>
</template>

<script>
import Layout from '../components/Layout.vue'
import { DataManager } from '../utils/dataManager.js'

export default {
  name: 'MedicalRecords',
  components: {
    Layout
  },  data() {
    return {
      records: [],
      patients: [],
      departments: [],
      filteredRecords: [],
      showAddDialog: false,
      showViewDialog: false,
      isEdit: false,      currentRecord: null,
      searchForm: {
        patientName: '',
        department: '',
        doctor: ''
      },
      recordForm: {
        patientId: '',
        patientName: '',
        department: '',
        doctor: '',
        admissionDate: '',
        dischargeDate: '',
        diagnosis: '',
        treatment: '',
        cost: 0
      },
      rules: {
        patientId: [{ required: true, message: '请选择患者', trigger: 'change' }],
        department: [{ required: true, message: '请选择科室', trigger: 'change' }],
        doctor: [{ required: true, message: '请输入主治医生', trigger: 'blur' }],
        admissionDate: [{ required: true, message: '请选择入院日期', trigger: 'change' }],
        diagnosis: [{ required: true, message: '请输入诊断', trigger: 'blur' }]
      }
    }
  },
  computed: {
    dialogTitle() {
      return this.isEdit ? '编辑病案' : '新建病案'
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {    loadData() {
      this.records = DataManager.getMedicalRecords()
      this.patients = DataManager.getPatients()
      this.departments = DataManager.getDepartments()
      this.filteredRecords = [...this.records]
    },
      handleSearch() {
      this.filteredRecords = this.records.filter(record => {
        const matchName = !this.searchForm.patientName || 
          record.patientName.includes(this.searchForm.patientName)
        const matchDept = !this.searchForm.department || 
          record.department === this.searchForm.department
        const matchDoctor = !this.searchForm.doctor || 
          record.doctor.includes(this.searchForm.doctor)
        return matchName && matchDept && matchDoctor
      })
    },
    
    resetSearch() {
      this.searchForm = { patientName: '', department: '', doctor: '' }
      this.filteredRecords = [...this.records]
    },
    
    viewRecord(record) {
      this.currentRecord = record
      this.showViewDialog = true
    },
    
    editRecord(record) {
      this.isEdit = true
      this.recordForm = { ...record }
      // 转换日期格式
      if (this.recordForm.admissionDate) {
        this.recordForm.admissionDate = new Date(this.recordForm.admissionDate)
      }
      if (this.recordForm.dischargeDate) {
        this.recordForm.dischargeDate = new Date(this.recordForm.dischargeDate)
      }
      this.showAddDialog = true
    },
    
    deleteRecord(record) {
      this.$confirm('确认删除这条病案记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DataManager.deleteMedicalRecord(record.id)
        this.loadData()
        this.$message.success('删除成功')
      })
    },
    
    saveRecord() {
      this.$refs.recordFormRef.validate((valid) => {
        if (valid) {
          const formData = { ...this.recordForm }
          
          // 转换日期格式
          if (formData.admissionDate) {
            formData.admissionDate = formData.admissionDate.toISOString().split('T')[0]
          }
          if (formData.dischargeDate) {
            formData.dischargeDate = formData.dischargeDate.toISOString().split('T')[0]
          }
          
          // 设置患者姓名
          const patient = this.patients.find(p => p.id === formData.patientId)
          if (patient) {
            formData.patientName = patient.name
          }
          
          if (this.isEdit) {
            DataManager.updateMedicalRecord(formData.id, formData)
            this.$message.success('更新成功')
          } else {
            DataManager.addMedicalRecord(formData)
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
      this.recordForm = {
        patientId: '',
        patientName: '',
        department: '',
        doctor: '',
        admissionDate: '',
        dischargeDate: '',
        diagnosis: '',
        treatment: '',
        cost: 0
      }
      this.$nextTick(() => {
        this.$refs.recordFormRef?.clearValidate()
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

.record-detail {
  padding: 20px 0;
}
</style>
