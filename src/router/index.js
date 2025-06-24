import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import MedicalRecords from '../views/MedicalRecords.vue'
import Patients from '../views/Patients.vue'
import Statistics from '../views/Statistics.vue'
import Departments from '../views/Departments.vue'
import Staff from '../views/Staff.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/medical-records',
    name: 'MedicalRecords',
    component: MedicalRecords
  },
  {
    path: '/patients',
    name: 'Patients',
    component: Patients
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: Statistics
  },
  {
    path: '/departments',
    name: 'Departments',
    component: Departments
  },
  {
    path: '/staff',
    name: 'Staff',
    component: Staff
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userInfo = localStorage.getItem('userInfo')
  
  if (to.path === '/login') {
    next()
  } else if (!userInfo) {
    next('/login')
  } else {
    next()
  }
})

export default router
