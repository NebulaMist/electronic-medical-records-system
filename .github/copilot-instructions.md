<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# 电子病案管理系统

这是一个基于Vue.js和Element Plus的纯前端电子病案管理系统。

## 项目特点

- 使用Vue.js 3 + Element Plus构建
- 数据存储在浏览器的localStorage中
- 包含登录、仪表板、病案管理、患者管理和统计报表功能
- 响应式设计，适配不同屏幕尺寸

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
5. **统计报表** - 数据统计和导出功能

## 数据结构

### 患者数据
- id: 唯一标识
- name: 姓名
- gender: 性别
- age: 年龄
- idCard: 身份证号
- phone: 联系电话
- address: 地址
- createTime: 创建时间

### 病案数据
- id: 唯一标识
- patientId: 患者ID
- patientName: 患者姓名
- department: 科室
- doctor: 主治医生
- admissionDate: 入院日期
- dischargeDate: 出院日期
- diagnosis: 诊断
- treatment: 治疗方案
- cost: 医疗费用
- createTime: 创建时间

## 开发注意事项

- 保持代码简洁和组件化
- 遵循Vue.js最佳实践
- 使用Element Plus组件库的标准用法
- 确保数据验证和错误处理
- 保持良好的用户体验
