// 数据管理工具 - 使用localStorage存储
export class DataManager {
  
  // 获取患者数据
  static getPatients() {
    const patients = localStorage.getItem('patients')
    return patients ? JSON.parse(patients) : []
  }

  // 保存患者数据
  static savePatients(patients) {
    localStorage.setItem('patients', JSON.stringify(patients))
  }

  // 获取病案数据
  static getMedicalRecords() {
    const records = localStorage.getItem('medicalRecords')
    return records ? JSON.parse(records) : []
  }

  // 保存病案数据
  static saveMedicalRecords(records) {
    localStorage.setItem('medicalRecords', JSON.stringify(records))
  }

  // 添加患者
  static addPatient(patient) {
    const patients = this.getPatients()
    patient.id = Date.now().toString()
    patient.createTime = new Date().toISOString()
    patients.push(patient)
    this.savePatients(patients)
    return patient
  }

  // 添加病案
  static addMedicalRecord(record) {
    const records = this.getMedicalRecords()
    record.id = Date.now().toString()
    record.createTime = new Date().toISOString()
    records.push(record)
    this.saveMedicalRecords(records)
    return record
  }

  // 更新患者
  static updatePatient(id, updatedPatient) {
    const patients = this.getPatients()
    const index = patients.findIndex(p => p.id === id)
    if (index !== -1) {
      patients[index] = { ...patients[index], ...updatedPatient }
      this.savePatients(patients)
      return patients[index]
    }
    return null
  }

  // 更新病案
  static updateMedicalRecord(id, updatedRecord) {
    const records = this.getMedicalRecords()
    const index = records.findIndex(r => r.id === id)
    if (index !== -1) {
      records[index] = { ...records[index], ...updatedRecord }
      this.saveMedicalRecords(records)
      return records[index]
    }
    return null
  }

  // 删除患者
  static deletePatient(id) {
    const patients = this.getPatients()
    const filteredPatients = patients.filter(p => p.id !== id)
    this.savePatients(filteredPatients)
  }

  // 删除病案
  static deleteMedicalRecord(id) {
    const records = this.getMedicalRecords()
    const filteredRecords = records.filter(r => r.id !== id)
    this.saveMedicalRecords(filteredRecords)
  }

  // 获取科室数据
  static getDepartments() {
    const departments = localStorage.getItem('departments')
    return departments ? JSON.parse(departments) : []
  }

  // 保存科室数据
  static saveDepartments(departments) {
    localStorage.setItem('departments', JSON.stringify(departments))
  }

  // 获取职员数据
  static getStaff() {
    const staff = localStorage.getItem('staff')
    return staff ? JSON.parse(staff) : []
  }

  // 保存职员数据
  static saveStaff(staff) {
    localStorage.setItem('staff', JSON.stringify(staff))
  }

  // 添加科室
  static addDepartment(department) {
    const departments = this.getDepartments()
    department.id = Date.now().toString()
    department.createTime = new Date().toISOString()
    department.staffCount = 0
    departments.push(department)
    this.saveDepartments(departments)
    return department
  }

  // 添加职员
  static addStaff(staff) {
    const staffList = this.getStaff()
    staff.id = Date.now().toString()
    staff.createTime = new Date().toISOString()
    staffList.push(staff)
    this.saveStaff(staffList)
    
    // 更新科室职员数量
    this.updateDepartmentStaffCount()
    return staff
  }

  // 更新科室
  static updateDepartment(id, updatedDepartment) {
    const departments = this.getDepartments()
    const index = departments.findIndex(d => d.id === id)
    if (index !== -1) {
      departments[index] = { ...departments[index], ...updatedDepartment }
      this.saveDepartments(departments)
      return departments[index]
    }
    return null
  }

  // 更新职员
  static updateStaff(id, updatedStaff) {
    const staffList = this.getStaff()
    const index = staffList.findIndex(s => s.id === id)
    if (index !== -1) {
      staffList[index] = { ...staffList[index], ...updatedStaff }
      this.saveStaff(staffList)
      
      // 更新科室职员数量
      this.updateDepartmentStaffCount()
      return staffList[index]
    }
    return null
  }

  // 删除科室
  static deleteDepartment(id) {
    const departments = this.getDepartments()
    const filteredDepartments = departments.filter(d => d.id !== id)
    this.saveDepartments(filteredDepartments)
  }

  // 删除职员
  static deleteStaff(id) {
    const staffList = this.getStaff()
    const filteredStaff = staffList.filter(s => s.id !== id)
    this.saveStaff(filteredStaff)
    
    // 更新科室职员数量
    this.updateDepartmentStaffCount()
  }

  // 更新科室职员数量
  static updateDepartmentStaffCount() {
    const departments = this.getDepartments()
    const staffList = this.getStaff()
    
    departments.forEach(dept => {
      dept.staffCount = staffList.filter(staff => 
        staff.department === dept.name && staff.status === '在职'
      ).length
    })
    
    this.saveDepartments(departments)
  }
  // 获取科室名称列表
  static getDepartmentNames() {
    const departments = this.getDepartments()
    return departments.map(dept => dept.name)
  }

  // 根据医生姓名获取病案记录
  static getMedicalRecordsByDoctor(doctorName, limit = 10) {
    const records = this.getMedicalRecords()
    const doctorRecords = records.filter(record => record.doctor === doctorName)
    
    // 按创建时间排序，获取最新的记录
    return doctorRecords
      .sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
      .slice(0, limit)
  }

  // 获取医生的统计信息
  static getDoctorStatistics(doctorName) {
    const records = this.getMedicalRecords()
    const doctorRecords = records.filter(record => record.doctor === doctorName)
    
    const totalCases = doctorRecords.length
    const totalCost = doctorRecords.reduce((sum, record) => sum + (record.cost || 0), 0)
    const avgCost = totalCases > 0 ? totalCost / totalCases : 0
    
    // 统计诊断类型
    const diagnosisStats = {}
    doctorRecords.forEach(record => {
      if (record.diagnosis) {
        diagnosisStats[record.diagnosis] = (diagnosisStats[record.diagnosis] || 0) + 1
      }
    })
    
    // 统计科室分布
    const departmentStats = {}
    doctorRecords.forEach(record => {
      if (record.department) {
        departmentStats[record.department] = (departmentStats[record.department] || 0) + 1
      }
    })
    
    return {
      totalCases,
      totalCost,
      avgCost,
      diagnosisStats,
      departmentStats
    }
  }
  // 初始化示例数据
  static initializeData() {
    // 初始化患者数据
    if (this.getPatients().length === 0) {
      const firstNames = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '马', '朱', '胡', '郭', '林', '何', '高', '梁']
      const secondNames = ['伟', '芳', '娜', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '涛', '明', '超', '鹏', '丹', '辉', '玲', '华', '燕', '鑫', '雷', '凯', '晓', '红', '波', '斌', '健']
      const addresses = ['北京市朝阳区', '北京市海淀区', '北京市西城区', '北京市东城区', '北京市丰台区', '北京市石景山区', '北京市通州区', '北京市昌平区', '北京市大兴区', '北京市房山区']
      
      const samplePatients = []
      
      // 生成80个患者
      for (let i = 1; i <= 80; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
        const secondName = secondNames[Math.floor(Math.random() * secondNames.length)]
        const gender = Math.random() > 0.5 ? '男' : '女'
        const age = Math.floor(Math.random() * 70) + 18 // 18-87岁
        const year = 2024 - age
        const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')
        const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')
        const address = addresses[Math.floor(Math.random() * addresses.length)]
        
        samplePatients.push({
          id: i.toString(),
          name: firstName + secondName,
          gender: gender,
          age: age,
          idCard: `11010${year}${month}${day}${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
          phone: `138${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
          address: address,
          createTime: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
        })
      }
      
      this.savePatients(samplePatients)
    }    // 初始化病案数据
    if (this.getMedicalRecords().length === 0) {
      const patients = this.getPatients()
      const departments = ['内科', '外科', '妇科', '儿科', '骨科', '神经内科', '心内科', '呼吸内科', '消化内科', '急诊科', 'ICU重症监护室']
      const doctors = ['王志明', '张建华', '王美丽', '刘小红', '陈强', '马教授', '赵主任', '孙医生', '周主任', '吴主任', '郑主任']
      const diagnoses = {
        '内科': ['高血压', '糖尿病', '冠心病', '心律不齐', '甲亢', '慢性胃炎', '肝炎', '肾炎'],
        '外科': ['阑尾炎', '胆结石', '疝气', '肿瘤切除', '外伤缝合', '骨折', '烧伤', '胃穿孔'],
        '妇科': ['妇科炎症', '子宫肌瘤', '卵巢囊肿', '宫颈糜烂', '不孕症', '月经不调', '盆腔炎', '乳腺增生'],
        '儿科': ['感冒发烧', '肺炎', '腹泻', '手足口病', '哮喘', '营养不良', '佝偻病', '先天性心脏病'],
        '骨科': ['骨折', '关节炎', '腰椎间盘突出', '颈椎病', '肩周炎', '股骨头坏死', '韧带损伤', '半月板损伤'],
        '神经内科': ['脑梗塞', '癫痫', '帕金森病', '头痛', '失眠', '神经衰弱', '面瘫', '三叉神经痛'],
        '心内科': ['冠心病', '心肌梗塞', '心律不齐', '心脏病', '高血压', '心肌炎', '心绞痛', '心脏瓣膜病'],
        '呼吸内科': ['肺炎', '哮喘', '慢阻肺', '肺结核', '支气管炎', '肺气肿', '胸腔积液', '肺癌'],
        '消化内科': ['胃炎', '胃溃疡', '肝硬化', '胰腺炎', '胆囊炎', '结肠炎', '消化道出血', '肝癌'],
        '急诊科': ['急性中毒', '外伤', '心脏骤停', '休克', '急性腹痛', '车祸外伤', '急性心梗', '过敏反应'],
        'ICU重症监护室': ['多器官衰竭', '呼吸衰竭', '心脏骤停', '严重感染', '重症肺炎', '脑出血', '大面积烧伤', '严重外伤']
      }
      
      const treatments = {
        '内科': ['药物治疗', '输液治疗', '物理治疗', '饮食控制', '生活方式调整', '定期随访', '中西医结合治疗'],
        '外科': ['手术治疗', '微创手术', '腹腔镜手术', '术后护理', '伤口换药', '抗感染治疗', '物理康复'],
        '妇科': ['药物治疗', '手术治疗', '物理治疗', '激素治疗', '中药调理', '定期检查', '生活指导'],
        '儿科': ['药物治疗', '物理降温', '营养支持', '免疫治疗', '康复训练', '家庭护理指导', '预防接种'],
        '骨科': ['手术治疗', '保守治疗', '物理治疗', '康复训练', '石膏固定', '内固定手术', '关节置换'],
        '神经内科': ['药物治疗', '康复训练', '物理治疗', '针灸治疗', '心理治疗', '生活指导', '定期复查'],
        '心内科': ['药物治疗', '介入治疗', '支架置入', '搭桥手术', '心脏起搏器', '生活方式调整', '定期监测'],
        '呼吸内科': ['抗感染治疗', '氧疗', '雾化吸入', '呼吸训练', '肺功能锻炼', '戒烟指导', '免疫治疗'],
        '消化内科': ['药物治疗', '内镜治疗', '饮食调整', '护肝治疗', '止血治疗', '营养支持', '定期复查'],
        '急诊科': ['紧急救治', '生命支持', '抗休克治疗', '急诊手术', '解毒治疗', '监护观察', '转科治疗'],
        'ICU重症监护室': ['生命支持', '机械通气', '血液净化', '营养支持', '感染控制', '器官功能维护', '家属沟通']
      }
      
      const sampleRecords = []
      
      // 为每个患者生成1-3个病案记录
      patients.forEach((patient, index) => {
        const recordCount = Math.floor(Math.random() * 3) + 1 // 1-3个病案
        
        for (let i = 0; i < recordCount; i++) {
          const dept = departments[Math.floor(Math.random() * departments.length)]
          const diagnosis = diagnoses[dept][Math.floor(Math.random() * diagnoses[dept].length)]
          const treatment = treatments[dept][Math.floor(Math.random() * treatments[dept].length)]
          const doctor = doctors[Math.floor(Math.random() * doctors.length)]
          
          // 生成随机住院日期（过去一年内）
          const admissionDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
          const dischargeDate = new Date(admissionDate.getTime() + (Math.random() * 14 + 1) * 24 * 60 * 60 * 1000) // 1-15天住院
          const isCurrentlyAdmitted = Math.random() < 0.1 // 10%的患者仍在住院
          
          // 根据科室和诊断生成合理的费用
          let baseCost = 0
          if (dept === 'ICU重症监护室') baseCost = 50000
          else if (dept === '心内科') baseCost = 25000
          else if (dept === '外科') baseCost = 15000
          else if (dept === '骨科') baseCost = 12000
          else if (dept === '神经内科') baseCost = 10000
          else baseCost = 5000
          
          const cost = baseCost + Math.floor(Math.random() * baseCost * 0.5) // 基础费用 + 50%随机浮动
          
          sampleRecords.push({
            id: `${index + 1}_${i + 1}`,
            patientId: patient.id,
            patientName: patient.name,
            department: dept,
            doctor: doctor,
            admissionDate: admissionDate.toISOString().split('T')[0],
            dischargeDate: isCurrentlyAdmitted ? '' : dischargeDate.toISOString().split('T')[0],
            diagnosis: diagnosis,
            treatment: treatment,
            cost: cost,
            createTime: admissionDate.toISOString()
          })
        }
      })
      
      this.saveMedicalRecords(sampleRecords)
    }// 初始化科室数据
    if (this.getDepartments().length === 0) {
      const sampleDepartments = [
        {
          id: '1',
          name: '内科',
          type: '临床科室',
          director: '李志明',
          location: '住院部2楼',
          phone: '13801234567',
          description: '主要负责内科疾病的诊断和治疗，包括心血管、呼吸、消化等系统疾病',
          staffCount: 12,
          createTime: new Date().toISOString()
        },
        {
          id: '2',
          name: '外科',
          type: '临床科室',
          director: '张建华',
          location: '住院部3楼',
          phone: '13801234568',
          description: '主要负责外科手术和创伤治疗，包括普外科、胸外科等',
          staffCount: 15,
          createTime: new Date().toISOString()
        },
        {
          id: '3',
          name: '妇科',
          type: '临床科室',
          director: '王美丽',
          location: '住院部4楼',
          phone: '13801234569',
          description: '专门负责妇科疾病的诊治，包括妇科肿瘤、内分泌等',
          staffCount: 10,
          createTime: new Date().toISOString()
        },
        {
          id: '4',
          name: '儿科',
          type: '临床科室',
          director: '刘小红',
          location: '住院部5楼',
          phone: '13801234570',
          description: '专门负责儿童疾病的诊断和治疗，包括新生儿科',
          staffCount: 14,
          createTime: new Date().toISOString()
        },
        {
          id: '5',
          name: '骨科',
          type: '临床科室',
          director: '陈强',
          location: '住院部6楼',
          phone: '13801234571',
          description: '主要负责骨科疾病和创伤的治疗，包括关节置换等',
          staffCount: 11,
          createTime: new Date().toISOString()
        },
        {
          id: '6',
          name: '神经内科',
          type: '临床科室',
          director: '马教授',
          location: '住院部7楼',
          phone: '13801234572',
          description: '专门负责神经系统疾病的诊断和治疗',
          staffCount: 8,
          createTime: new Date().toISOString()
        },
        {
          id: '7',
          name: '心内科',
          type: '临床科室',
          director: '赵主任',
          location: '住院部8楼',
          phone: '13801234573',
          description: '专门负责心血管疾病的诊断和治疗，包括介入治疗',
          staffCount: 13,
          createTime: new Date().toISOString()
        },
        {
          id: '8',
          name: '呼吸内科',
          type: '临床科室',
          director: '孙医生',
          location: '住院部9楼',
          phone: '13801234574',
          description: '专门负责呼吸系统疾病的诊断和治疗',
          staffCount: 9,
          createTime: new Date().toISOString()
        },
        {
          id: '9',
          name: '消化内科',
          type: '临床科室',
          director: '周主任',
          location: '住院部10楼',
          phone: '13801234575',
          description: '专门负责消化系统疾病的诊断和治疗，包括内镜诊疗',
          staffCount: 10,
          createTime: new Date().toISOString()
        },
        {
          id: '10',
          name: '急诊科',
          type: '临床科室',
          director: '吴主任',
          location: '急诊楼1楼',
          phone: '13801234576',
          description: '负责急危重症患者的抢救和治疗',
          staffCount: 16,
          createTime: new Date().toISOString()
        },
        {
          id: '11',
          name: 'ICU重症监护室',
          type: '临床科室',
          director: '郑主任',
          location: '重症楼2楼',
          phone: '13801234577',
          description: '负责危重症患者的监护和治疗',
          staffCount: 18,
          createTime: new Date().toISOString()
        },
        {
          id: '12',
          name: '放射科',
          type: '医技科室',
          director: '徐主任',
          location: '医技楼1楼',
          phone: '13801234578',
          description: '负责医学影像检查，包括CT、MRI、X光等',
          staffCount: 7,
          createTime: new Date().toISOString()
        }
      ]
      this.saveDepartments(sampleDepartments)
    }    // 初始化职员数据
    if (this.getStaff().length === 0) {
      const sampleStaff = [
        // 内科
        {
          id: '1',
          name: '王志明',
          gender: '男',
          position: '医生',
          department: '内科',
          phone: '13812345678',
          email: 'wang.doctor@hospital.com',
          hireDate: '2020-03-15',
          status: '在职',
          notes: '主治医师，擅长心血管疾病',
          createTime: new Date().toISOString()
        },
        {
          id: '2',
          name: '李小红',
          gender: '女',
          position: '护士',
          department: '内科',
          phone: '13812345679',
          email: 'li.nurse@hospital.com',
          hireDate: '2021-05-20',
          status: '在职',
          notes: '责任护士，工作认真负责',
          createTime: new Date().toISOString()
        },
        {
          id: '3',
          name: '刘医生',
          gender: '男',
          position: '医生',
          department: '内科',
          phone: '13812345680',
          email: 'liu.doctor@hospital.com',
          hireDate: '2019-08-10',
          status: '在职',
          notes: '副主任医师，内分泌专家',
          createTime: new Date().toISOString()
        },
        // 外科
        {
          id: '4',
          name: '张建华',
          gender: '男',
          position: '医生',
          department: '外科',
          phone: '13812345681',
          email: 'zhang.doctor@hospital.com',
          hireDate: '2018-01-15',
          status: '在职',
          notes: '主任医师，普外科专家',
          createTime: new Date().toISOString()
        },
        {
          id: '5',
          name: '陈护士',
          gender: '女',
          position: '护士',
          department: '外科',
          phone: '13812345682',
          email: 'chen.nurse@hospital.com',
          hireDate: '2020-06-01',
          status: '在职',
          notes: '手术室护士，技术精湛',
          createTime: new Date().toISOString()
        },
        // 妇科
        {
          id: '6',
          name: '王美丽',
          gender: '女',
          position: '医生',
          department: '妇科',
          phone: '13812345683',
          email: 'wang.gynecology@hospital.com',
          hireDate: '2017-03-20',
          status: '在职',
          notes: '主任医师，妇科肿瘤专家',
          createTime: new Date().toISOString()
        },
        {
          id: '7',
          name: '赵护士',
          gender: '女',
          position: '护士',
          department: '妇科',
          phone: '13812345684',
          email: 'zhao.nurse@hospital.com',
          hireDate: '2021-02-10',
          status: '在职',
          notes: '产科护士，经验丰富',
          createTime: new Date().toISOString()
        },
        // 儿科
        {
          id: '8',
          name: '刘小红',
          gender: '女',
          position: '医生',
          department: '儿科',
          phone: '13812345685',
          email: 'liu.pediatrics@hospital.com',
          hireDate: '2019-09-15',
          status: '在职',
          notes: '副主任医师，儿童呼吸科专家',
          createTime: new Date().toISOString()
        },
        {
          id: '9',
          name: '孙护士',
          gender: '女',
          position: '护士',
          department: '儿科',
          phone: '13812345686',
          email: 'sun.nurse@hospital.com',
          hireDate: '2020-11-05',
          status: '在职',
          notes: '儿科专科护士',
          createTime: new Date().toISOString()
        },
        // 骨科
        {
          id: '10',
          name: '陈强',
          gender: '男',
          position: '医生',
          department: '骨科',
          phone: '13812345687',
          email: 'chen.orthopedics@hospital.com',
          hireDate: '2016-07-01',
          status: '在职',
          notes: '主任医师，关节外科专家',
          createTime: new Date().toISOString()
        },
        {
          id: '11',
          name: '马护士',
          gender: '女',
          position: '护士',
          department: '骨科',
          phone: '13812345688',
          email: 'ma.nurse@hospital.com',
          hireDate: '2021-04-12',
          status: '在职',
          notes: '骨科康复护士',
          createTime: new Date().toISOString()
        },
        // 心内科
        {
          id: '12',
          name: '赵主任',
          gender: '男',
          position: '医生',
          department: '心内科',
          phone: '13812345689',
          email: 'zhao.cardiology@hospital.com',
          hireDate: '2015-05-20',
          status: '在职',
          notes: '主任医师，心血管介入专家',
          createTime: new Date().toISOString()
        },
        {
          id: '13',
          name: '李技师',
          gender: '男',
          position: '技师',
          department: '心内科',
          phone: '13812345690',
          email: 'li.technician@hospital.com',
          hireDate: '2020-08-15',
          status: '在职',
          notes: '心电图技师',
          createTime: new Date().toISOString()
        },
        // 急诊科
        {
          id: '14',
          name: '吴主任',
          gender: '男',
          position: '医生',
          department: '急诊科',
          phone: '13812345691',
          email: 'wu.emergency@hospital.com',
          hireDate: '2018-12-01',
          status: '在职',
          notes: '急诊科主任，急救专家',
          createTime: new Date().toISOString()
        },
        {
          id: '15',
          name: '黄护士',
          gender: '女',
          position: '护士',
          department: '急诊科',
          phone: '13812345692',
          email: 'huang.nurse@hospital.com',
          hireDate: '2019-01-20',
          status: '在职',
          notes: '急诊科护士长',
          createTime: new Date().toISOString()
        },
        // 管理员
        {
          id: '16',
          name: '陈管理员',
          gender: '男',
          position: '管理员',
          department: '行政办公室',
          phone: '13812345693',
          email: 'chen.admin@hospital.com',
          hireDate: '2017-01-15',
          status: '在职',
          notes: '系统管理员，负责医院信息化建设',
          createTime: new Date().toISOString()
        }
      ]
      this.saveStaff(sampleStaff)
      this.updateDepartmentStaffCount()
    }
  }
}
