# 电子病案管理系统

这是一个基于Vue.js和Element Plus的纯前端电子病案管理系统。

## 项目特点

- 使用Vue.js 3 + Element Plus构建
- 数据存储在浏览器的localStorage中
- 包含登录、仪表板、病案管理、患者管理、科室管理、职员管理和统计报表功能
- 响应式设计，适配不同屏幕尺寸
- 基于角色的权限控制系统

## 技术栈

- Vue.js 3
- Vue Router 4
- Element Plus UI组件库
- Vite构建工具

## 功能模块

1. **登录系统** - 用户身份验证和角色选择
2. **仪表板** - 系统概览和统计数据
3. **病案管理** - 病案的增删改查功能
4. **患者管理** - 患者信息管理
5. **科室管理** - 科室信息管理（新增）
6. **职员管理** - 职员信息管理（新增）
7. **统计报表** - 数据统计和导出功能

## 权限控制系统

### 用户角色
- **护士 (nurse)**: 只读权限，可以查看所有模块但无法编辑
- **医生 (doctor)**: 可以编辑病案和患者信息，对职员管理只有查看权限
- **管理员 (admin)**: 拥有所有模块的完整权限

### 权限说明
| 模块 | 护士 | 医生 | 管理员 |
|------|------|------|--------|
| 仪表板 | 查看 | 查看 | 查看 |
| 病案管理 | 查看 | 增删改查 | 增删改查 |
| 患者管理 | 查看 | 增删改查 | 增删改查 |
| 科室管理 | 查看 | 增删改查 | 增删改查 |
| 职员管理 | 不可见 | 查看 | 增删改查 |
| 统计报表 | 查看 | 查看 | 查看 |

## 安装和运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 使用说明

1. 访问 http://localhost:5174
2. 使用任意用户名和密码登录
3. 选择用户角色（护士/医生/管理员）
4. 体验不同角色的权限差异

## 数据结构

### 患者数据
- id, name, gender, age, idCard, phone, address, createTime

### 病案数据  
- id, patientId, patientName, department, doctor, admissionDate, dischargeDate, diagnosis, treatment, cost, createTime

### 科室数据
- id, name, type, director, location, phone, description, staffCount, createTime

### 职员数据
- id, name, gender, position, department, phone, email, hireDate, status, notes, createTime

## 项目结构

```
src/
├── components/          # 公共组件
│   └── Layout.vue      # 主布局组件
├── views/              # 页面组件
│   ├── Login.vue       # 登录页
│   ├── Dashboard.vue   # 仪表板
│   ├── MedicalRecords.vue  # 病案管理
│   ├── Patients.vue    # 患者管理
│   ├── Departments.vue # 科室管理
│   ├── Staff.vue       # 职员管理
│   └── Statistics.vue  # 统计报表
├── router/             # 路由配置
├── utils/              # 工具类
│   └── dataManager.js  # 数据管理工具
└── assets/             # 静态资源
```
