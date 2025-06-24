// 手动重置localStorage数据的简单脚本
// 在浏览器控制台中运行此脚本

console.log('🔧 开始手动重置localStorage数据...');

// 1. 检查当前数据
console.log('📊 当前数据状态:');
const keys = ['patients', 'medicalRecords', 'departments', 'staff'];
keys.forEach(key => {
    const data = localStorage.getItem(key);
    if (data) {
        try {
            const parsed = JSON.parse(data);
            console.log(`  ${key}: ${parsed.length} 条记录`);
        } catch (e) {
            console.log(`  ${key}: 数据损坏`);
        }
    } else {
        console.log(`  ${key}: 无数据`);
    }
});

// 2. 清除旧数据
console.log('🗑️ 清除旧数据...');
keys.forEach(key => {
    localStorage.removeItem(key);
    console.log(`  已清除: ${key}`);
});

// 3. 验证清除
console.log('✅ 验证清除结果:');
const hasData = keys.some(key => localStorage.getItem(key) !== null);
if (hasData) {
    console.error('❌ 数据清除不完整!');
} else {
    console.log('✅ 所有数据已清除');
}

console.log('');
console.log('📝 下一步操作:');
console.log('1. 刷新页面 (F5 或 Ctrl+R)');
console.log('2. 应用将自动重新初始化80个患者的完整数据');
console.log('3. 如果问题仍然存在，请检查main.js中的DataManager.initializeData()调用');
