// 数据重置脚本
import { DataManager } from './src/utils/dataManager.js';

console.log('=== 开始数据重置 ===');

// 1. 清除现有数据
console.log('1. 清除现有数据...');
localStorage.removeItem('patients');
localStorage.removeItem('medicalRecords');
localStorage.removeItem('departments');
localStorage.removeItem('staff');

// 2. 验证数据已清除
console.log('2. 验证数据清除状态...');
console.log('患者数据:', DataManager.getPatients().length);
console.log('病案数据:', DataManager.getMedicalRecords().length);
console.log('科室数据:', DataManager.getDepartments().length);
console.log('职员数据:', DataManager.getStaff().length);

// 3. 重新初始化数据
console.log('3. 重新初始化数据...');
DataManager.initializeData();

// 4. 验证初始化结果
console.log('4. 验证初始化结果...');
const patients = DataManager.getPatients();
const records = DataManager.getMedicalRecords();
const departments = DataManager.getDepartments();
const staff = DataManager.getStaff();

console.log('患者数据:', patients.length);
console.log('病案数据:', records.length);
console.log('科室数据:', departments.length);
console.log('职员数据:', staff.length);

// 5. 显示详细信息
if (patients.length > 0) {
    console.log('首个患者示例:', {
        id: patients[0].id,
        name: patients[0].name,
        age: patients[0].age,
        gender: patients[0].gender
    });
}

if (records.length > 0) {
    console.log('首个病案示例:', {
        id: records[0].id,
        patientName: records[0].patientName,
        department: records[0].department,
        cost: records[0].cost
    });
}

console.log('=== 数据重置完成 ===');
