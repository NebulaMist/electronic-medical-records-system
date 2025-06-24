<template>
  <Layout>
    <div class="staff">
      <div class="page-header">
        <h2>职员管理</h2>
        <el-button 
          v-if="canEdit" 
          type="primary" 
          @click="showAddDialog = true"
        >
          <el-icon><Plus /></el-icon>
          新建职员
        </el-button>
      </div>
      
      <!-- 权限提示 -->
      <el-alert 
        v-if="!canEdit && userInfo.role === 'doctor'"
        title="您当前只有查看权限，无法进行编辑操作"
        type="info"
        :closable="false"
        style="margin-bottom: 20px;"
      />
      
      <!-- 搜索栏 -->
      <el-card class="search-card">
        <el-form :model="searchForm" inline>
          <el-form-item label="姓名">
            <el-input 
              v-model="searchForm.name" 
              placeholder="请输入姓名"
              clearable
            />
          </el-form-item>
          <el-form-item label="职位">
            <el-select v-model="searchForm.position" placeholder="请选择职位" clearable>
              <el-option label="医生" value="医生" />
              <el-option label="护士" value="护士" />
              <el-option label="管理员" value="管理员" />
              <el-option label="技师" value="技师" />
            </el-select>
          </el-form-item>
          <el-form-item label="科室">
            <el-select v-model="searchForm.department" placeholder="请选择科室" clearable>
              <el-option 
                v-for="dept in departments" 
                :key="dept.id" 
                :label="dept.name" 
                :value="dept.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      
      <!-- 职员列表 -->
      <el-card>
        <el-table :data="filteredStaff" style="width: 100%">
          <el-table-column prop="name" label="姓名" width="120" />
          <el-table-column prop="position" label="职位" width="100">
            <template #default="scope">
              <el-tag 
                :type="getPositionTagType(scope.row.position)"
              >
                {{ scope.row.position }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="department" label="科室" width="120" />
          <el-table-column prop="phone" label="联系电话" width="140" />
          <el-table-column prop="email" label="邮箱" width="180" />
          <el-table-column prop="hireDate" label="入职日期" width="120" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag 
                :type="scope.row.status === '在职' ? 'success' : 'danger'"
              >
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button size="small" @click="viewStaff(scope.row)">查看</el-button>
              <el-button 
                v-if="canEdit" 
                size="small" 
                type="primary" 
                @click="editStaff(scope.row)"
              >
                编辑
              </el-button>
              <el-button 
                v-if="canEdit" 
                size="small" 
                type="danger" 
                @click="deleteStaff(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      
      <!-- 新建/编辑职员对话框 -->
      <el-dialog 
        :title="dialogTitle" 
        v-model="showAddDialog" 
        width="600px"
      >
        <el-form :model="staffForm" :rules="rules" ref="staffFormRef" label-width="100px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="姓名" prop="name">
                <el-input v-model="staffForm.name" placeholder="请输入姓名" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="性别" prop="gender">
                <el-radio-group v-model="staffForm.gender">
                  <el-radio label="男">男</el-radio>
                  <el-radio label="女">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="职位" prop="position">
                <el-select v-model="staffForm.position" placeholder="请选择职位" style="width: 100%">
                  <el-option label="医生" value="医生" />
                  <el-option label="护士" value="护士" />
                  <el-option label="管理员" value="管理员" />
                  <el-option label="技师" value="技师" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="科室" prop="department">
                <el-select v-model="staffForm.department" placeholder="请选择科室" style="width: 100%">
                  <el-option 
                    v-for="dept in departments" 
                    :key="dept.id" 
                    :label="dept.name" 
                    :value="dept.name"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="联系电话" prop="phone">
                <el-input v-model="staffForm.phone" placeholder="请输入联系电话" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="staffForm.email" placeholder="请输入邮箱" />
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="入职日期" prop="hireDate">
                <el-date-picker 
                  v-model="staffForm.hireDate" 
                  type="date" 
                  placeholder="选择入职日期"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态" prop="status">
                <el-select v-model="staffForm.status" placeholder="请选择状态" style="width: 100%">
                  <el-option label="在职" value="在职" />
                  <el-option label="离职" value="离职" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-form-item label="备注" prop="notes">
            <el-input 
              v-model="staffForm.notes" 
              type="textarea" 
              :rows="3"
              placeholder="请输入备注信息"
            />
          </el-form-item>
        </el-form>
        
        <template #footer>
          <el-button @click="showAddDialog = false">取消</el-button>
          <el-button type="primary" @click="saveStaff">确定</el-button>
        </template>
      </el-dialog>
      
      <!-- 查看职员详情对话框 -->
      <el-dialog title="职员详情" v-model="showViewDialog" width="600px">
        <div class="staff-detail" v-if="currentStaff">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="姓名">{{ currentStaff.name }}</el-descriptions-item>
            <el-descriptions-item label="性别">{{ currentStaff.gender }}</el-descriptions-item>
            <el-descriptions-item label="职位">
              <el-tag :type="getPositionTagType(currentStaff.position)">
                {{ currentStaff.position }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="科室">{{ currentStaff.department }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{ currentStaff.phone }}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{ currentStaff.email }}</el-descriptions-item>
            <el-descriptions-item label="入职日期">{{ currentStaff.hireDate }}</el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="currentStaff.status === '在职' ? 'success' : 'danger'">
                {{ currentStaff.status }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="备注" :span="2">
              {{ currentStaff.notes || '无' }}
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
  name: 'Staff',
  components: {
    Layout
  },
  data() {
    return {
      userInfo: {},
      staff: [],
      departments: [],
      filteredStaff: [],
      showAddDialog: false,
      showViewDialog: false,
      isEdit: false,
      currentStaff: null,
      searchForm: {
        name: '',
        position: '',
        department: ''
      },
      staffForm: {
        name: '',
        gender: '',
        position: '',
        department: '',
        phone: '',
        email: '',
        hireDate: '',
        status: '在职',
        notes: ''
      },
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
        position: [{ required: true, message: '请选择职位', trigger: 'change' }],
        department: [{ required: true, message: '请选择科室', trigger: 'change' }],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
        ],
        hireDate: [{ required: true, message: '请选择入职日期', trigger: 'change' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }]
      }
    }
  },
  computed: {
    dialogTitle() {
      return this.isEdit ? '编辑职员' : '新建职员'
    },
    
    canEdit() {
      // 只有管理员可以编辑职员信息
      return this.userInfo.role === 'admin'
    }
  },
  mounted() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
    this.loadData()
  },
  methods: {
    loadData() {
      this.staff = DataManager.getStaff()
      this.departments = DataManager.getDepartments()
      this.filteredStaff = [...this.staff]
    },
    
    handleSearch() {
      this.filteredStaff = this.staff.filter(staff => {
        const matchName = !this.searchForm.name || 
          staff.name.includes(this.searchForm.name)
        const matchPosition = !this.searchForm.position || 
          staff.position === this.searchForm.position
        const matchDepartment = !this.searchForm.department || 
          staff.department === this.searchForm.department
        return matchName && matchPosition && matchDepartment
      })
    },
    
    resetSearch() {
      this.searchForm = { name: '', position: '', department: '' }
      this.filteredStaff = [...this.staff]
    },
    
    getPositionTagType(position) {
      const typeMap = {
        '医生': 'primary',
        '护士': 'success',
        '管理员': 'warning',
        '技师': 'info'
      }
      return typeMap[position] || 'default'
    },
    
    viewStaff(staff) {
      this.currentStaff = staff
      this.showViewDialog = true
    },
    
    editStaff(staff) {
      if (!this.canEdit) {
        this.$message.warning('您没有编辑权限')
        return
      }
      this.isEdit = true
      this.staffForm = { ...staff }
      if (this.staffForm.hireDate) {
        this.staffForm.hireDate = new Date(this.staffForm.hireDate)
      }
      this.showAddDialog = true
    },
    
    deleteStaff(staff) {
      if (!this.canEdit) {
        this.$message.warning('您没有删除权限')
        return
      }
      
      this.$confirm('确认删除这个职员吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DataManager.deleteStaff(staff.id)
        this.loadData()
        this.$message.success('删除成功')
      })
    },
    
    saveStaff() {
      if (!this.canEdit) {
        this.$message.warning('您没有编辑权限')
        return
      }
      
      this.$refs.staffFormRef.validate((valid) => {
        if (valid) {
          const formData = { ...this.staffForm }
          
          // 转换日期格式
          if (formData.hireDate) {
            formData.hireDate = formData.hireDate.toISOString().split('T')[0]
          }
          
          if (this.isEdit) {
            DataManager.updateStaff(formData.id, formData)
            this.$message.success('更新成功')
          } else {
            DataManager.addStaff(formData)
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
      this.staffForm = {
        name: '',
        gender: '',
        position: '',
        department: '',
        phone: '',
        email: '',
        hireDate: '',
        status: '在职',
        notes: ''
      }
      this.$nextTick(() => {
        this.$refs.staffFormRef?.clearValidate()
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

.staff-detail {
  padding: 20px 0;
}
</style>
