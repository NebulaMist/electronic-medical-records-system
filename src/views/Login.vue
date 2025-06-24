<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <div class="card-header">
          <h2>电子病案管理系统</h2>
          <p>欢迎登录</p>
        </div>
      </template>
      
      <el-form :model="loginForm" :rules="rules" ref="loginFormRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input 
            v-model="loginForm.username" 
            placeholder="请输入用户名"
            prefix-icon="User"
          />
        </el-form-item>
        
        <el-form-item label="密码" prop="password">
          <el-input 
            v-model="loginForm.password" 
            type="password" 
            placeholder="请输入密码"
            prefix-icon="Lock"
          />
        </el-form-item>
        
        <el-form-item label="角色" prop="role">
          <el-select v-model="loginForm.role" placeholder="请选择角色" style="width: 100%">
            <el-option label="医生" value="doctor" />
            <el-option label="护士" value="nurse" />
            <el-option label="管理员" value="admin" />
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button 
            type="primary" 
            @click="handleLogin" 
            :loading="loading"
            style="width: 100%"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loading: false,
      loginForm: {
        username: 'admin',
        password: '123456',
        role: 'doctor'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        role: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    async handleLogin() {
      this.loading = true
      try {
        await this.$refs.loginFormRef.validate()
        
        // 模拟登录验证
        setTimeout(() => {
          localStorage.setItem('userInfo', JSON.stringify(this.loginForm))
          this.$message.success('登录成功！')
          this.$router.push('/dashboard')
          this.loading = false
        }, 1000)
        
      } catch (error) {
        this.loading = false
        this.$message.error('请填写完整信息')
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.card-header {
  text-align: center;
}

.card-header h2 {
  margin: 0 0 10px 0;
  color: #303133;
}

.card-header p {
  margin: 0;
  color: #909399;
}
</style>
