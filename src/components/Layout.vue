<template>
  <el-container class="layout-container">
    <!-- 顶部导航 -->
    <el-header class="header">
      <div class="header-left">
        <h3>电子病案管理系统</h3>
      </div>
      <div class="header-right">
        <el-dropdown @command="handleCommand">
          <span class="user-info">
            <el-icon><User /></el-icon>
            {{ userInfo.username }} ({{ getRoleText(userInfo.role) }})
            <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>
    
    <el-container>
      <!-- 侧边导航 -->
      <el-aside width="200px" class="sidebar">        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical"
          router
        >
          <el-menu-item index="/dashboard">
            <el-icon><Odometer /></el-icon>
            <span>仪表板</span>
          </el-menu-item>
          
          <el-menu-item index="/medical-records">
            <el-icon><Document /></el-icon>
            <span>病案管理</span>
          </el-menu-item>
          
          <el-menu-item index="/patients">
            <el-icon><UserFilled /></el-icon>
            <span>患者管理</span>
          </el-menu-item>
          
          <el-menu-item index="/departments">
            <el-icon><OfficeBuilding /></el-icon>
            <span>科室管理</span>
          </el-menu-item>
          
          <el-menu-item index="/staff" v-if="canViewStaff">
            <el-icon><Avatar /></el-icon>
            <span>职员管理</span>
            <el-tag v-if="userInfo.role === 'doctor'" type="info" size="small" style="margin-left: 5px;">只读</el-tag>
          </el-menu-item>
          
          <el-menu-item index="/statistics">
            <el-icon><DataAnalysis /></el-icon>
            <span>统计报表</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      
      <!-- 主内容区 -->
      <el-main class="main-content">
        <slot />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Layout',
  data() {
    return {
      userInfo: {}
    }
  },
  computed: {
    canEdit() {
      // 护士只有查看权限，医生和管理员可以编辑
      return this.userInfo.role !== 'nurse'
    },
    
    canViewStaff() {
      // 管理员和医生可以查看职员管理页面
      return this.userInfo.role === 'admin' || this.userInfo.role === 'doctor'
    }
  },
  mounted() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
  },
  methods: {
    getRoleText(role) {
      const roleMap = {
        doctor: '医生',
        nurse: '护士',
        admin: '管理员'
      }
      return roleMap[role] || role
    },
    
    handleCommand(command) {
      if (command === 'logout') {
        this.$confirm('确认退出登录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          localStorage.removeItem('userInfo')
          this.$router.push('/login')
          this.$message.success('已退出登录')
        })
      }
    }
  }
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.header {
  background-color: #545c64;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.header-left h3 {
  margin: 0;
}

.user-info {
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

.sidebar {
  background-color: #f5f5f5;
}

.el-menu-vertical {
  border-right: none;
}

.main-content {
  background-color: #f0f2f5;
  padding: 20px;
}
</style>
